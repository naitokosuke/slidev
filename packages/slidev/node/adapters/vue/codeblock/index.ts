import type { CodeblockTransformer } from '@slidev/types'
import magicMoveTransformer from './magic-move'
import mermaidTransformer from './mermaid'
import monacoTransformer from './monaco'
import plantUmlTransformer from './plant-uml'
import wrapperTransformer from './wrapper'

/**
 * Built-in code block transformers rendering to Vue components.
 * `wrapperTransformer` must be the last one as it handles every remaining code block.
 */
export const vueCodeblockTransformers: CodeblockTransformer[] = [
  mermaidTransformer,
  plantUmlTransformer,
  magicMoveTransformer,
  monacoTransformer,
  wrapperTransformer,
]
