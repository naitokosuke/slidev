import type { ModuleNode } from 'vite'
import type { SlidevFrameworkAdapter } from '../types'

export const slideFrontmatterModule: SlidevFrameworkAdapter['slideFrontmatterModule'] = (frontmatter, slide) => [
  'import { computed, reactive, shallowReactive } from "vue"',
  `export const frontmatterData = ${JSON.stringify(frontmatter)}`,
  // handle HMR, update frontmatter with update
  'if (import.meta.hot) {',
  '  import.meta.hot.data.frontmatter ??= reactive(frontmatterData)',
  '  import.meta.hot.accept(({ frontmatterData: update }) => {',
  '    const frontmatter = import.meta.hot.data.frontmatter',
  '    Object.keys(frontmatter).forEach(key => {',
  '      if (!(key in update)) delete frontmatter[key]',
  '    })',
  '    Object.assign(frontmatter, update)',
  '  })',
  '}',
  'export const frontmatter = import.meta.hot ? import.meta.hot.data.frontmatter : reactive(frontmatterData)',
  'export default frontmatter',
  'export const meta = shallowReactive({',
  '  get layout(){ return frontmatter.layout },',
  '  get transition(){ return frontmatter.transition },',
  '  get class(){ return frontmatter.class },',
  '  get clicks(){ return frontmatter.clicks },',
  '  get name(){ return frontmatter.name },',
  '  get preload(){ return frontmatter.preload },',
  // No need to be reactive, as it's only used once after reload
  '  slide: {',
  `    ...(${JSON.stringify(slide)}),`,
  `    frontmatter,`,
  '  },',
  '  __clicksContext: null,',
  '  __preloaded: false,',
  '})',
].join('\n')

export const resolveSlidesHmr: SlidevFrameworkAdapter['resolveSlidesHmr'] = async (server, modules) => {
  const reloadBeforeOthers: ModuleNode[] = []
  const vueModules: ModuleNode[] = []
  for (const main of modules) {
    const styles = [...main.clientImportedModules].filter(m => m.id?.includes(`&type=style`))
    if (styles.length) {
      // `pluginVue.transform(mainModule)` must be called before `pluginVue.load(styleModule)`
      // to refresh the internal descriptor cache of `@vitejs/plugin-vue`
      reloadBeforeOthers.push(main)
      vueModules.push(...styles)
    }
    else {
      vueModules.push(main)
    }
  }

  await Promise.all(reloadBeforeOthers.map(m => server.reloadModule(m)))

  return vueModules
}
