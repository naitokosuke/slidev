import type { VirtualModuleTemplate } from './types'

/**
 * Kept for backward compatibility, use #slidev/slides instead
 *
 * @deprecated
 */
export const templateLegacyRoutes: VirtualModuleTemplate = {
  id: '/@slidev/routes',
  getContent() {
    return [
      `export { slides } from '#slidev/slides'`,
      `console.warn('[slidev] #slidev/routes is deprecated, use #slidev/slides instead')`,
    ].join('\n')
  },
}
