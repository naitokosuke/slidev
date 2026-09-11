import type { CodeblockTransformer, ResolvedSlidevOptions } from '@slidev/types'
import type MagicString from 'magic-string'
import type MarkdownExit from 'markdown-exit'
import MarkdownItComark from '@comark/markdown-it'
import { taskLists as MarkdownItTaskList } from '@hedgedoc/markdown-it-plugins'
// @ts-expect-error missing types
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import { MarkdownItCodeblocks } from '../../../syntax/codeblock'
import MarkdownItLink from '../../../syntax/link'
import MarkdownItShiki from '../../../syntax/shiki'
import MarkdownItSnippet from '../../../syntax/snippet'
import { vueCodeblockTransformers } from '../codeblock'
import MarkdownItVDrag from './drag'
import MarkdownItEscapeInlineCode from './escape-code'
import MarkdownItVueKatex from './katex'
import MarkdownItVueMonacoWrite from './monaco-write'
import MarkdownItStyleScoped from './scoped'
import MarkdownItSlotSugar from './slot-sugar'

export async function useMarkdownItPlugins(
  md: MarkdownExit,
  options: ResolvedSlidevOptions,
  markdownTransformMap: Map<string, MagicString>,
  codeblockTransformers: (CodeblockTransformer | false)[],
) {
  const { data: { features, config }, utils: { katexOptions } } = options

  md.use(MarkdownItSnippet, options)
  md.use(MarkdownItVueMonacoWrite)
  // @ts-expect-error @shikijs/markdown-it types expect MarkdownItAsync, but MarkdownExit is API-compatible
  md.use(await MarkdownItShiki(options))
  md.use(MarkdownItCodeblocks, options, [...codeblockTransformers, ...vueCodeblockTransformers])

  md.use(MarkdownItLink)
  md.use(MarkdownItEscapeInlineCode)
  md.use(MarkdownItFootnote)
  md.use(MarkdownItTaskList, { enabled: true, lineNumber: true, label: true })
  if (features.katex)
    md.use(MarkdownItVueKatex, katexOptions)
  md.use(MarkdownItVDrag, markdownTransformMap)
  md.use(MarkdownItSlotSugar)
  if (config.comark || config.mdc)
    md.use(MarkdownItComark)
  md.use(MarkdownItStyleScoped)
  md.use(MarkdownItGitHubAlerts as any)
}
