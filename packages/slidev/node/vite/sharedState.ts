import type { ResolvedSlidevOptions, SlidevPluginOptions } from '@slidev/types'
import type { SlidevFrameworkAdapter } from '../adapters/types'
import { loadDrawings, writeDrawings } from '../integrations/drawings'
import { loadSnapshots, writeSnapshots } from '../integrations/snapshots'

const sharedStates = new WeakMap<ResolvedSlidevOptions, Record<string, any>>()

/**
 * Access the server-side state shared with the clients
 * (e.g. `nav` holds the current position of the live presentation).
 */
export function getSharedState(options: ResolvedSlidevOptions): Record<string, any> | undefined {
  return sharedStates.get(options)
}

export async function createSharedStatePlugin(
  options: ResolvedSlidevOptions,
  pluginOptions: SlidevPluginOptions,
  adapter: SlidevFrameworkAdapter,
) {
  const state: Record<string, any> = {
    sync: false,
    nav: {
      page: 0,
      clicks: 0,
      timer: {
        status: 'stopped',
        slides: {},
        startedAt: 0,
        pausedAt: 0,
      },
    },
    drawings: await loadDrawings(options),
    snapshots: await loadSnapshots(options),
    ...pluginOptions.serverRef?.state,
  }
  sharedStates.set(options, state)

  return adapter.sharedState.plugin(state, (key, data, patch, timestamp) => {
    pluginOptions.serverRef?.onChanged?.(key, data, patch, timestamp)

    if (options.data.config.drawings.persist && key === 'drawings')
      writeDrawings(options, patch ?? data)

    if (key === 'snapshots')
      writeSnapshots(options, data)
  })
}
