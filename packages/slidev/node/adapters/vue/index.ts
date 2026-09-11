import type { SlidevFrameworkAdapter } from '../types'
import { templateGlobalLayers } from './virtual/global-layers'
import { templateNavControls } from './virtual/nav-controls'
import { templateSlides } from './virtual/slides'
import { templateLegacyTitles, templateTitleRenderer, templateTitleRendererMd } from './virtual/titles'
import { createVueCompilerFlagsPlugin } from './vite/compilerFlags'
import { createComponentsPlugin } from './vite/components'
import { createContextInjectionPlugin } from './vite/contextInjection'
import { createHmrPatchPlugin } from './vite/hmrPatch'
import { createLayoutWrapperPlugin } from './vite/layoutWrapper'
import { createMarkdownPlugin } from './vite/markdown'
import { createVuePlugin } from './vite/vue'

export const vueAdapter: SlidevFrameworkAdapter = {
  name: 'vue',
  vitePlugins: (options, pluginOptions) => Promise.all([
    createMarkdownPlugin(options, pluginOptions),
    createLayoutWrapperPlugin(options),
    createContextInjectionPlugin(),
    createVuePlugin(options, pluginOptions),
    createHmrPatchPlugin(),
    createComponentsPlugin(options, pluginOptions),
    createVueCompilerFlagsPlugin(options),
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
}
