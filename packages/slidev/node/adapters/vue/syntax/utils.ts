/**
 * Escape `{{` in code block to prevent Vue interpret it, #99, #1316
 */
export function escapeVueInCode(md: string) {
  return md.replace(/\{\{/g, '&lbrace;&lbrace;')
}
