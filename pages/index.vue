<template>
  <div class="container">
    <div>
      <h1>index</h1>
      <nuxt-link :to="{ path: 'home' }">home</nuxt-link>
      <online-status :user="userGetter" name="index" ref="onlineStatus" />
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

<style>
.container {
  margin: 0 auto;
  padding: 30px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}

a {
  cursor: pointer;
}

span {
  display: block;
  margin-bottom: 30px;
}

form {
  width: 500px;
  margin: 60px auto 0;
  display: flex;
  align-items: start;
  justify-content: space-between;
}

input {
  margin: 0;
  padding: 10px;
  border-radius: 4px;
  border: solid 1px #666;
  font-size: 16px;
}

table {
  margin: 30px auto 0;
}

table.contents {
  text-align: left;
}

tr {
  width: 200px;
}
</style>
