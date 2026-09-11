import MarkdownExit from 'markdown-exit'
import { expect, it } from 'vitest'
import MarkdownItKatex from './katex'

it('inline math', async () => {
  const md = MarkdownExit()
  md.use(MarkdownItKatex, {})

  const result = await md.renderAsync('This is $x^2$ inline')
  expect(result).toContain('<span class="katex">')
})

it('block math', async () => {
  const md = MarkdownExit()
  md.use(MarkdownItKatex, {})

  const result = await md.renderAsync('$$ {2,3|4}\nx^2\n$$')

  expect(result).toMatch(/^<p><span class="katex-display">.*<\/p>\n$/s)
  expect(result).not.toContain('KaTexBlockWrapper')
})

it('not transform in code block', async () => {
  const md = MarkdownExit()
  md.use(MarkdownItKatex, {})

  const result = await md.renderAsync('```\n$$x^2$$\n```')

  expect(result).toMatchInlineSnapshot(`
    "<pre><code>$$x^2$$
    </code></pre>
    "
  `)
})
