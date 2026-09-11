import type { VirtualModuleTemplate } from '../../../virtual/types'
import { VIRTUAL_LEGACY_TITLES_ID, VIRTUAL_TITLE_RENDERER_MD_ID } from '../../../vite/common'

export const templateTitleRendererMd: VirtualModuleTemplate = {
  id: VIRTUAL_TITLE_RENDERER_MD_ID,
  getContent({ data }) {
    const lines = data.slides
      .map(({ title }, i) => `<template ${i === 0 ? 'v-if' : 'v-else-if'}="no === ${i + 1}">\n\n${title}\n\n</template>`)

    lines.push(
      `<script setup lang="ts">`,
      `import { useSlideContext } from '@slidev/client/context.ts'`,
      `import { computed } from 'vue'`,
      `const props = defineProps<{ no?: number | string }>()`,
      `const { $page } = useSlideContext()`,
      `const no = computed(() => +(props.no ?? $page.value))`,
      `</script>`,
    )

    return lines.join('\n')
  },
}

export const templateTitleRenderer: VirtualModuleTemplate = {
  id: '/@slidev/title-renderer',
  async getContent() {
    return `export { default } from "${VIRTUAL_TITLE_RENDERER_MD_ID}"`
  },
}

/**
 * Kept for backward compatibility, use #slidev/title-renderer instead
 *
 * @deprecated
 */
export const templateLegacyTitles: VirtualModuleTemplate = {
  id: VIRTUAL_LEGACY_TITLES_ID,
  getContent() {
    return `
<script setup lang="ts">
import TitleRenderer from '#slidev/title-renderer'
defineProps<{ no: number | string }>()
console.warn('/@slidev/titles.md is deprecated, import from #slidev/title-renderer instead')
</script>

<TitleRenderer :no="no" />
`
  },
}
