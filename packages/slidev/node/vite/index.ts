import type { ResolvedSlidevOptions, SlidevPluginOptions, SlidevServerOptions } from '@slidev/types'
import type { PluginOption } from 'vite'
import { frameworkAdapter } from '../adapters'
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
import { createSharedStatePlugin } from './sharedState'
import { createStaticCopyPlugin } from './staticCopy'
import { createUnocssPlugin } from './unocss'

export function ViteSlidevPlugin(
  options: ResolvedSlidevOptions,
  pluginOptions: SlidevPluginOptions = {},
  serverOptions: SlidevServerOptions = {},
): Promise<PluginOption[]> {
  const adapter = frameworkAdapter

  return Promise.all([
    createSlidesLoader(options, serverOptions, adapter),
    createMcpPlugin(options, adapter),
    adapter.vitePlugins(options, pluginOptions),
    createSlideImportGuardPlugin(),
    createIconsPlugin(options, pluginOptions),
    createRemoteAssetsPlugin(options, pluginOptions),
    createSharedStatePlugin(options, pluginOptions, adapter),
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
