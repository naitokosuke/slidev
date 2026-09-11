import type { SlidevFrameworkAdapter } from '../types'
import { vueSharedState } from './sharedState'
import { resolveSlidesHmr, slideFrontmatterModule } from './slides'
import { templateGlobalLayers } from './virtual/global-layers'
import { templateNavControls } from './virtual/nav-controls'
import { templateSlides } from './virtual/slides'
import { templateLegacyTitles, templateTitleRenderer, templateTitleRendererMd } from './virtual/titles'
import { createVueCompilerFlagsPlugin } from './vite/compilerFlags'
import { createComponentsPlugin } from './vite/components'
import { createVueConfigPlugin } from './vite/config'
import { createContextInjectionPlugin } from './vite/contextInjection'
import { createHmrPatchPlugin } from './vite/hmrPatch'
import { createLayoutWrapperPlugin } from './vite/layoutWrapper'
import { createMarkdownPlugin } from './vite/markdown'
import { createVuePlugin } from './vite/vue'

export const vueAdapter: SlidevFrameworkAdapter = {
  name: 'vue',
  layoutExtensions: ['vue', 'js', 'mjs', 'ts', 'mts'],
  vitePlugins: (options, pluginOptions) => Promise.all([
    createMarkdownPlugin(options, pluginOptions),
    createLayoutWrapperPlugin(options),
    createContextInjectionPlugin(),
    createVuePlugin(options, pluginOptions),
    createHmrPatchPlugin(),
    createComponentsPlugin(options, pluginOptions),
    createVueCompilerFlagsPlugin(options),
    createVueConfigPlugin(),
  ]),
  virtualModules: [
    templateGlobalLayers,
    templateNavControls,
    templateSlides,
    templateTitleRenderer,
    templateTitleRendererMd,

    // Deprecated
    templateLegacyTitles,
  ],
  slideFrontmatterModule,
  resolveSlidesHmr,
  sharedState: vueSharedState,
}
