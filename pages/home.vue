<template>
  <div class="container">
    <div>
      <h1>home</h1><nuxt-link :to="{ path: '/' }">index</nuxt-link>
      <online-status :user="userGetter" name="home" ref="onlineStatus" />
      <content-list :user="userGetter" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import onlineStatus from '../components/onlineStatus.vue'

export default {
  components: { onlineStatus },
  data() {
    return {
      checkLastChangedIntervalId: null,
    }
  },
  computed: {
    ...mapGetters('user', ['userGetter'])
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    clearInterval(this.checkLastChangedIntervalId)
  },
  methods: {
    init() {
      this.checkLastChangedIntervalId = this.$refs.onlineStatus.checkLastChanged()
    }
  }
}
</script>
