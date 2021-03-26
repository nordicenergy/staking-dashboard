<template>
  <SessionFrame title="Create New Account" image="account">
      <h2 class="session-title">Use Nordic Energy Browser Extension (Deprecated)</h2>
      <div v-if="!extension.enabled" class="session-main">
        <p>
          Looks like you don't have the Nordic Energy browser extension installed yet.
          Head over to the
          <a
            href="https://nordicenergy/chrome-wallet"
            target="_blank"
            rel="noopener norefferer"
            >Nordic Energy Chrome Extension</a
          >
          to quickly install the extension.
        </p>
      </div>

      <div v-else class="session-main">
        <p class="extension-message">
          Below is a list of accounts we've received from the Nordic Energy browser
          extension.
        </p>
        <AccountList
          :accounts="accounts"
          :button-action="signIn"
          :button-text="`Use Account`"
        />
      </div>
  </SessionFrame>
</template>

<script>
import AccountList from "common/AccountList"
import SessionFrame from "common/SessionFrame"
import { mapState } from "vuex"
export default {
  name: `session-extension`,
  components: {
    AccountList,
    SessionFrame
  },
  data: () => ({
    connectionError: null,
    address: null
  }),
  computed: {
    ...mapState([`extension`]),
    accounts() {
      return this.extension.accounts
    }
  },
  mounted() {
    this.getAddressesFromExtension()
  },
  methods: {
    getAddressesFromExtension() {
      this.$store.dispatch("getAddressesFromExtension")
    },
    async signIn(address) {
      this.$store.dispatch(`signIn`, {
        sessionType: `extension`,
        address: address
      })
      this.$router.push(`/`)
    }
  }
}
</script>
<style scoped>

</style>
