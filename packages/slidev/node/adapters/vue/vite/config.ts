import type { Plugin, UserConfig } from 'vite'
import { mergeConfig } from 'vite'
import { resolveImportPath } from '../../../resolver'

const RE_MONACO_EDITOR = /\/monaco-editor(?:-core)?\//

// @keep-sorted
const EXCLUDE = [
  '@shikijs/magic-move/vue',
  '@unhead/vue',
  '@vueuse/core',
  '@vueuse/math',
  '@vueuse/motion',
  '@vueuse/shared',
  'floating-vue',
  'vue-demi',
  'vue-router',
  'vue',
]

const ASYNC_MODULES = [
  'file-saver',
  'vue',
  '@vue',
]

/**
 * Vite config for the Vue runtime and the client bundle
 */
export function createVueConfigPlugin(): Plugin {
  return {
    name: 'slidev:vue-config',
    async config(config) {
      const injection: UserConfig = {
        resolve: {
          alias: [
            {
              find: 'vue',
              replacement: await resolveImportPath('vue/dist/vue.esm-bundler.js', true),
            },
          ],
          dedupe: ['vue'],
        },
        optimizeDeps: {
          exclude: EXCLUDE,
        },
        build: {
          rollupOptions: {
            output: {
              chunkFileNames(chunkInfo) {
                const DEFAULT = 'assets/[name]-[hash].js'

                // Already handled in manualChunks
                if (chunkInfo.name.includes('/'))
                  return DEFAULT

                // Over 60% of the chunk is slidev client code, we put it into slidev chunk
                if (chunkInfo.moduleIds.filter(i => isSlidevClient(i)).length > chunkInfo.moduleIds.length * 0.6)
                  return 'assets/slidev/[name]-[hash].js'

                // Monaco Editor
                if (chunkInfo.moduleIds.filter(i => i.match(RE_MONACO_EDITOR)).length > chunkInfo.moduleIds.length * 0.6)
                  return 'assets/monaco/[name]-[hash].js'

                return DEFAULT
              },
              manualChunks(id) {
                if (id.startsWith('/@slidev-monaco-types/') || id.includes('/@slidev/monaco-types') || id.endsWith('?monaco-types&raw'))
                  return 'monaco/bundled-types'
                if (id.includes('/shiki/') || id.includes('/@shikijs/'))
                  return `modules/shiki`
                if (id.startsWith('~icons/'))
                  return 'modules/unplugin-icons'
                // It seems that moving slides out will breaks the production build
                // Would need to find a better way to handle this
                // const slideMatch = id.match(/\/@slidev\/slides\/(\d+)/)
                // if (slideMatch && !id.includes('.frontmatter'))
                //   return `slides/${slideMatch[1]}`

                const matchedAsyncModule = ASYNC_MODULES.find(i => id.includes(`/node_modules/${i}`))
                if (matchedAsyncModule)
                  return `modules/${matchedAsyncModule.replace('@', '').replace('/', '-')}`
              },
            },
          },
        },
      }

      function isSlidevClient(id: string) {
        return id.includes('/@slidev/') || id.includes('/slidev/packages/client/') || id.includes('/@vueuse/')
      }

      return mergeConfig(mergeConfig(injection, config), {
        define: {
          // Fixes Vue production mode breaking PDF Export #1245
          __VUE_PROD_DEVTOOLS__: false,
        },
      })
    },
  }
}
