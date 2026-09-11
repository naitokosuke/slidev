import type { MarkdownExit } from 'markdown-exit'
import type { MonacoWriteToken } from '../../../syntax/snippet'
import lz from 'lz-string'

/**
 * Render `<<< path {monaco-write}` snippets as a writable Monaco editor
 */
export default function MarkdownItVueMonacoWrite(md: MarkdownExit) {
  md.renderer.rules.monaco_write = (tokens, idx) => {
    const { content, meta: { filepath, lang, meta } } = tokens[idx] as unknown as MonacoWriteToken
    const safeFilepath = JSON.stringify(filepath).slice(1, -1)
    const encoded = lz.compressToBase64(content)
    return `<Monaco writable="${safeFilepath}" code-lz="${encoded}" lang="${lang}" v-bind="${meta}" />\n`
  }
}
