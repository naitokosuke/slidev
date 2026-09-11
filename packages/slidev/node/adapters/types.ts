import type { Awaitable } from '@antfu/utils'
import type { ResolvedSlidevOptions, SlidevPluginOptions } from '@slidev/types'
import type { PluginOption } from 'vite'
import type { VirtualModuleTemplate } from '../virtual/types'

/**
 * The framework-specific part of Slidev: how slides and components are compiled and rendered.
 */
export interface SlidevFrameworkAdapter {
  name: string
  /**
   * Vite plugins compiling slides and components for the framework
   */
  vitePlugins: (options: ResolvedSlidevOptions, pluginOptions: SlidevPluginOptions) => Awaitable<PluginOption[]>
  /**
   * Virtual modules whose generated code depends on the framework
   */
  virtualModules: VirtualModuleTemplate[]
}
