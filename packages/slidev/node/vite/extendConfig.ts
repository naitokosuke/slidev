import type { ResolvedSlidevOptions } from '@slidev/types'
import type { Plugin, UserConfig } from 'vite'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slash, uniq } from '@antfu/utils'
import { createResolve } from 'mlly'
import { join } from 'pathe'
import { mergeConfig } from 'vite'
import { isInstalledGlobally, toAtFS } from '../resolver'

const RE_SLIDEV_CLIENT = /^@slidev\/client$/
const RE_SLIDEV_CLIENT_SUBPATH = /^@slidev\/client\/(.*)/
const RE_SLIDEV_VIRTUAL = /^#slidev\/(.*)/

const INCLUDE_GLOBAL = [
  '@fix-webm-duration/fix',
  '@typescript/ata',
  'file-saver',
  'lz-string',
  'recordrtc',
  'typescript',
  'yaml',
  'pptxgenjs',
  'ansis',
]

const INCLUDE_LOCAL = INCLUDE_GLOBAL.map(i => `@slidev/cli > @slidev/client > ${i}`)

// @keep-sorted
const EXCLUDE_GLOBAL = [
  '@antfu/utils',
  '@shikijs/monaco',
  '@shikijs/vitepress-twoslash/client',
  '@slidev/client',
  '@slidev/client/constants',
  '@slidev/client/context',
  '@slidev/client/logic/dark',
  '@slidev/parser',
  '@slidev/parser/core',
  '@slidev/rough-notation',
  '@slidev/types',
  '@unocss/reset',
  'drauu',
  'fuse.js',
  'mermaid',
  'monaco-editor',
  'shiki',
  'shiki/core',
]

const EXCLUDE_LOCAL = EXCLUDE_GLOBAL

export function createConfigPlugin(options: ResolvedSlidevOptions): Plugin {
  const resolveClientDep = createResolve({
    // Same as Vite's default resolve conditions
    conditions: ['import', 'module', 'browser', 'default', options.mode === 'build' ? 'production' : 'development'],
    url: pathToFileURL(options.clientRoot),
  })
  return {
    name: 'slidev:config',
    async config(config) {
      const injection: UserConfig = {
        define: options.utils.define,
        resolve: {
          alias: [
            {
              find: RE_SLIDEV_CLIENT,
              replacement: `${toAtFS(options.clientRoot)}/index.ts`,
            },
            {
              find: RE_SLIDEV_CLIENT_SUBPATH,
              replacement: `${toAtFS(options.clientRoot)}/$1`,
            },
            {
              find: RE_SLIDEV_VIRTUAL,
              replacement: '/@slidev/$1',
            },
            ...(isInstalledGlobally.value
              ? await Promise.all(INCLUDE_GLOBAL.map(async dep => ({
                  find: dep,
                  replacement: fileURLToPath(await resolveClientDep(dep)),
                })))
              : []
            ),
          ],
        },
        optimizeDeps: isInstalledGlobally.value
          ? {
              exclude: EXCLUDE_GLOBAL,
              include: INCLUDE_GLOBAL,
            }
          : {
              // We need to specify the full deps path for non-hoisted modules
              exclude: EXCLUDE_LOCAL,
              include: INCLUDE_LOCAL,
            },
        css: {
          postcss: {
            plugins: [
              await import('postcss-nested').then(r => (r.default || r)()) as any,
            ],
          },
        },
        server: {
          fs: {
            strict: true,
            allow: uniq([
              options.userWorkspaceRoot,
              options.clientRoot,
              // Special case for PNPM global installation
              isInstalledGlobally.value
                ? slash(options.cliRoot).replace(/\/\.pnpm\/.*$/gi, '')
                : options.cliRoot,
              ...options.roots,
            ]),
          },
        },
        publicDir: join(options.userRoot, 'public'),
        cacheDir: isInstalledGlobally.value ? join(options.cliRoot, 'node_modules/.vite') : undefined,
      }

      return mergeConfig(injection, config)
    },
    configureServer(server) {
      // serve our index.html after vite history fallback
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/index.html') {
            const headers = server.config.server.headers ?? {}

            for (const header in headers) {
              res.setHeader(header, headers[header]!)
            }

            res.setHeader('Content-Type', 'text/html')
            res.statusCode = 200
            res.end(options.utils.indexHtml)
            return
          }
          next()
        })
      }
    },
  }
}
