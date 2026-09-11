import { templateConditionalStyles } from './conditional-styles'
import { templateConfigs } from './configs'
import { templateLegacyRoutes } from './deprecated'
import { templateLayouts } from './layouts'
import { templateMonacoRunDeps } from './monaco-deps'
import { templateMonacoTypes } from './monaco-types'
import { templateSetups } from './setups'

export const templates = [
  templateMonacoTypes,
  templateMonacoRunDeps,
  templateConfigs,
  templateConditionalStyles,
  templateLayouts,
  ...templateSetups,

  // Deprecated
  templateLegacyRoutes,
]
