export const templateInjectionMarker = '/* @slidev-injection */'
export const templateImportContextUtils = `import { useSlideContext as _useSlideContext, frontmatterToProps as _frontmatterToProps } from "@slidev/client/context.ts"`
export const templateInitContext = `const { $slidev, $nav, $clicksContext, $clicks, $page, $renderContext, $frontmatter } = _useSlideContext()`
