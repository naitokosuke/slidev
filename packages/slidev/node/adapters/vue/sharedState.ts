import type { SlidevFrameworkAdapter } from '../types'
import ServerRef from 'vite-plugin-vue-server-ref'

// Keep in sync with `vite-plugin-vue-server-ref` internals
const SERVER_REF_WS_EVENT = 'vue-server-ref'

/**
 * Shared state synced through `vite-plugin-vue-server-ref`,
 * exposed to the clients as Vue refs via `server-ref:` / `server-reactive:` imports
 */
export const vueSharedState: SlidevFrameworkAdapter['sharedState'] = {
  plugin: (state, onChanged) => ServerRef({
    debug: false, // process.env.NODE_ENV === 'development',
    state,
    onChanged: (key, data, patch, timestamp) => onChanged(key as string, data, patch, timestamp),
  }),

  send(server, { key, patch, source, timestamp }) {
    // Refresh the initial state served to newly loaded clients
    for (const id of [`/@server-reactive/${key}`, `/@server-ref/${key}`]) {
      const module = server.moduleGraph.getModuleById(id)
      if (module)
        server.moduleGraph.invalidateModule(module)
    }

    server.hot.send({
      type: 'custom',
      event: SERVER_REF_WS_EVENT,
      data: { key, source, patch, timestamp },
    })
  },
}
