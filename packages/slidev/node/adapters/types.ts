import type { Awaitable } from '@antfu/utils'
import type { ResolvedSlidevOptions, SlidevPluginOptions } from '@slidev/types'
import type { ModuleNode, PluginOption, ViteDevServer } from 'vite'
import type { VirtualModuleTemplate } from '../virtual/types'

export interface SharedStatePatch {
  key: string
  patch: Record<string, any>
  source: string
  timestamp: number
}

/**
 * The framework-specific part of Slidev: how slides and components are compiled and rendered.
 */
export interface SlidevFrameworkAdapter {
  name: string
  /**
   * File extensions of layout components
   */
  layoutExtensions: string[]
  /**
   * Vite plugins compiling slides and components for the framework
   */
  vitePlugins: (options: ResolvedSlidevOptions, pluginOptions: SlidevPluginOptions) => Awaitable<PluginOption[]>
  /**
   * Virtual modules whose generated code depends on the framework
   */
  virtualModules: VirtualModuleTemplate[]
  /**
   * Generate the module exporting `frontmatter` and `meta` of a slide
   */
  slideFrontmatterModule: (frontmatter: Record<string, any>, slide: Record<string, any>) => string
  /**
   * Resolve the modules to hot update from the compiled modules of the changed slides
   */
  resolveSlidesHmr: (server: ViteDevServer, modules: ModuleNode[]) => Promise<ModuleNode[]>
  /**
   * Sync the server-side shared state (`nav`, `drawings`, ...) with the clients
   */
  sharedState: {
    plugin: (state: Record<string, any>, onChanged: (key: string, data: any, patch: any, timestamp: number) => void) => Awaitable<PluginOption>
    send: (server: ViteDevServer, patch: SharedStatePatch) => void
  }
}
