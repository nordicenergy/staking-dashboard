/* istanbul ignore file: really just integrations */

import { listenToExtensionMessages } from "scripts/extension-utils"
import {
  enableGoogleAnalytics,
  setGoogleAnalyticsPage
} from "scripts/google-analytics"
import config from "src/config"
import Node from "./connectors/node"
import router, { routeGuard } from "./router"
import Store from "./vuex/store"

const google_analytics_uid = process.env.GOOGLE_ANALYTICS_UID || ""

function setOptions(urlParams, store) {
  if (urlParams.experimental) {
    store.commit(`setExperimentalMode`)
  }
  if (urlParams.rpc) {
    store.commit(`setRpcUrl`, urlParams.rpc)
  }
  if (config.mobileApp || urlParams.insecure) {
    store.commit(`setInsecureMode`)
  }
}

export default function init(urlParams, env = process.env) {
  // add error handlers in production
  if (env.NODE_ENV === `production`) {
    enableGoogleAnalytics(google_analytics_uid)
  }

  const node = Node('')
  const store = Store({ node, apollo: {} })

  setGoogleAnalyticsPage(router.currentRoute.path)
  router.beforeEach(routeGuard(store, {}))
  router.afterEach(to => {
    /* istanbul ignore next */
    setGoogleAnalyticsPage(to.path)
  })

  setOptions(urlParams, store)

  store.dispatch(`loadLocalPreferences`)

  store.dispatch("loadPersistedState")

  store
    .dispatch(`init`)
    // wait for connected as the check for session will sign in directly and query account data
    .then(() => {
      store.dispatch(`checkForPersistedSession`)
      store.dispatch(`checkForPersistedAddresses`)
      // Promise.all([
      //   store.dispatch("getDelegates")
      //   // store.dispatch("getValidators")
      // ]).then(() => store.dispatch("getRewardsFromMyValidators"))
      store.dispatch(`getPool`)
      store.dispatch(`getMintingParameters`)
    })

  listenToExtensionMessages(store)

  return { store, router }
}
