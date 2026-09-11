import fs from 'node:fs'
import lz from 'lz-string'
import MarkdownExit from 'markdown-exit'
import path from 'pathe'
import { expect, it } from 'vitest'
import MarkdownItSnippet from '../../../syntax/snippet'
import MarkdownItVueMonacoWrite from './monaco-write'

const fixturesRoot = path.join(__dirname, '../../../../../../test/fixtures/')

it('renders monaco-write snippets as a writable Monaco editor', async () => {
  const md = MarkdownExit()
  md.use(MarkdownItSnippet, {
    userRoot: fixturesRoot,
    userWorkspaceRoot: fixturesRoot,
    roots: [fixturesRoot],
    data: {
      watchFiles: {},
      slides: [{
        index: 0,
        source: { filepath: path.join(fixturesRoot, 'test.md') },
      }],
    },
  } as any)
  md.use(MarkdownItVueMonacoWrite)

  const result = await md.renderAsync('<<< @/snippets/snippet.ts {monaco-write}', { id: 'slides.md__slidev_1.md' })

  expect(result).toMatch(/^<Monaco writable="@\/snippets\/snippet\.ts" code-lz="[^"]+" lang="ts" v-bind="\{\}" \/>\n$/)

  const encoded = result.match(/code-lz="([^"]+)"/)![1]
  expect(lz.decompressFromBase64(encoded)).toBe(fs.readFileSync(path.join(fixturesRoot, 'snippets/snippet.ts'), 'utf-8'))
})
