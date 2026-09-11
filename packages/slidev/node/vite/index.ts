import type { ResolvedSlidevOptions, SlidevPluginOptions, SlidevServerOptions } from '@slidev/types'
import type { PluginOption } from 'vite'
import { vueAdapter } from '../adapters/vue'
import setupVitePlugins from '../setups/vite-plugins'
import { createConfigPlugin } from './extendConfig'
import { createIconsPlugin } from './icons'
import { createSlideImportGuardPlugin } from './importGuard'
import { createInspectPlugin } from './inspect'
import { createSlidesLoader } from './loaders'
import { createMcpPlugin } from './mcp'
import { createMonacoTypesLoader } from './monacoTypes'
import { createMonacoWriterPlugin } from './monacoWrite'
import { createPatchMonacoSourceMapPlugin } from './patchMonacoSourceMap'
import { createPWAPlugin } from './pwa'
import { createRemoteAssetsPlugin } from './remoteAssets'
import { createServerRefPlugin } from './serverRef'
import { createStaticCopyPlugin } from './staticCopy'
import { createUnocssPlugin } from './unocss'

export function ViteSlidevPlugin(
  options: ResolvedSlidevOptions,
  pluginOptions: SlidevPluginOptions = {},
  serverOptions: SlidevServerOptions = {},
): Promise<PluginOption[]> {
  // Only Vue is supported for now
  const adapter = vueAdapter

  return Promise.all([
    createSlidesLoader(options, serverOptions, adapter),
    createMcpPlugin(options),
    adapter.vitePlugins(options, pluginOptions),
    createSlideImportGuardPlugin(),
    createIconsPlugin(options, pluginOptions),
    createRemoteAssetsPlugin(options, pluginOptions),
    createServerRefPlugin(options, pluginOptions),
    createConfigPlugin(options),
    createMonacoTypesLoader(options),
    createMonacoWriterPlugin(options),
    createUnocssPlugin(options, pluginOptions),
    createStaticCopyPlugin(options, pluginOptions),
    createInspectPlugin(options, pluginOptions),
    createPatchMonacoSourceMapPlugin(),
    createPWAPlugin(options),

    setupVitePlugins(options),
  ])
}
