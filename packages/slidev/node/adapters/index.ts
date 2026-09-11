import type { SlidevFrameworkAdapter } from './types'
import { vueAdapter } from './vue'

// Only Vue is supported for now
export const frameworkAdapter: SlidevFrameworkAdapter = vueAdapter
