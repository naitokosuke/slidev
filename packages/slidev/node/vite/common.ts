export const regexSlideReqPath = /^\/__slidev\/slides\/(\d+)\.json$/
export const regexSlideFacadeId = /^\/@slidev\/slides\/(\d+)\/(md|frontmatter)($|\?)/
export const regexSlideSourceId = /__slidev_(\d+)\.(md|frontmatter)$/

// Virtual module ids shared between the core and framework adapters
export const VIRTUAL_SLIDE_PREFIX = '/@slidev/slides/'
export const VIRTUAL_SLIDES_ID = '/@slidev/slides'
export const VIRTUAL_TITLE_RENDERER_MD_ID = '/@slidev/title-renderer.md'
export const VIRTUAL_LEGACY_TITLES_ID = '/@slidev/titles.md'
