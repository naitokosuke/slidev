import type { KatexOptions } from 'katex'
import type { MarkdownExit } from 'markdown-exit'
import MarkdownItKatex, { renderKatexBlock, renderKatexInline } from '../../../syntax/katex'
import { normalizeRangeStr } from '../../../syntax/utils'
import { escapeVueInCode } from './utils'

const RE_KATEX_BLOCK_INFO = /^\{([\w*,|-]+)\}\s*(\{[^}]*\})?/

export default function MarkdownItVueKatex(md: MarkdownExit, options: KatexOptions) {
  md.use(MarkdownItKatex, options)

  md.renderer.rules.math_inline = (tokens, idx) => escapeVueInCode(renderKatexInline(tokens[idx].content, options))
  md.renderer.rules.math_block = (tokens, idx) => {
    const token = tokens[idx]
    const [, rangeStr, blockOptions] = RE_KATEX_BLOCK_INFO.exec(token.info) || []
    const ranges = normalizeRangeStr(rangeStr)
    const optionsProp = blockOptions ? `v-bind="${blockOptions}"` : ''
    return `<KaTexBlockWrapper ${optionsProp} :ranges='${JSON.stringify(ranges)}'>${escapeVueInCode(renderKatexBlock(token.content, options))}</KaTexBlockWrapper>\n`
  }
}
