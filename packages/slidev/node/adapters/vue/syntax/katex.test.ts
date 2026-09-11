import MarkdownExit from 'markdown-exit'
import { expect, it } from 'vitest'
import MarkdownItVueKatex from './katex'

it('block math', async () => {
  const md = MarkdownExit()
  md.use(MarkdownItVueKatex, {})

  const result = await md.renderAsync('$$ {2,3|4}\nx^2\n$$')

  expect(result).toMatchInlineSnapshot(`
    "<KaTexBlockWrapper  :ranges='["2,3","4"]'><p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi>x</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">x^2
    </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="katex-base"><span class="katex-strut" style="height:0.8641em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="katex-sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span></p></KaTexBlockWrapper>
    "
  `)
})
