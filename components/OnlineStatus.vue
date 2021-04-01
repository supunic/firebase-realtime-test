<template>
  <div>
    <span>user : {{ user.name }}</span>
    <span>"{{ name }}" online user : {{ onlineUserCount || '-' }}</span>
    <table class="users">
      <thead>
        <tr>
          <th width="200" height="30">name</th>
          <th width="200" height="30">online</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td width="200" height="30">{{ user.name }}</td>
          <td width="200" height="30">{{ user.state === 'online' ? '○' : '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      randomNumber: Math.ceil(Math.random() * 10),
      database: firebase.database(),
      connectionStatus: 'connectionStatus',
      connectInfo: '.info/connected',
      onlineUserCount: null,
      users: [],
      setIntervalId: null,
    }
  },
  computed: {
    databaseStatus() {
      return {
        name: this.user.name,
        lastChanged: firebase.database.ServerValue.TIMESTAMP,
      }
    },
    onlineStatus() {
      return { state: 'online', ...this.databaseStatus }
    },
    offlineStatus() {
      return { state: 'offline', ...this.databaseStatus }
    },
  },
  mounted() {
    this.realtimeConnection()
    this.fetchConnectionStatus()
    this.updateLastChanged()
    this.checkLastChanged()
  },
  beforeDestroy() {
    clearInterval(this.setIntervalId)
    this.offlineConnectionStatus()
  },
  beforeRouteLeave() {
    clearInterval(this.setIntervalId)
    this.offlineConnectionStatus()
  },
  methods: {
    realtimeConnection() {
      this.database.ref(this.connectInfo).on('value', snap => {
        if (snap.val() === false) return
        this.database.ref(this.connectionStatus)
          .child(this.name)
          .child(this.user.id)
          .onDisconnect()
          .set(this.offlineStatus)
        this.database.ref(this.connectionStatus)
          .child(this.name)
          .child(this.user.id)
          .set(this.onlineStatus)
      })
    },
    fetchConnectionStatus() {
      this.database.ref(this.connectionStatus).child(this.name).on('value', snap => {
        const items = Object.values(snap.toJSON())
        this.users = items.filter(v => v)
        this.onlineUserCount = items.filter(childSnap => childSnap.state === 'online').length
      }) 
    },
    updateLastChanged() {
      this.setIntervalId = setInterval(() => {
        this.database.ref(this.connectionStatus)
          .child(this.name)
          .child(this.user.id)
          .update({ lastChanged: this.onlineStatus.lastChanged })
      }, 5 * 1000)
    },
    checkLastChanged() {
      // 親コンポーネントで使用することを想定
      const id = setInterval(() => {
        this.database.ref(this.connectionStatus)
          .child(this.name)
          .child(this.user.id)
          .on('value', snap => {
            const now = firebase.database.ServerValue.TIMESTAMP
            const latest = snap.toJSON().lastChanged
            if (now - latest >= 16000) {
              this.offlineConnectionStatus()
              clearInterval(this.setIntervalId)
              clearInterval(id)
            }
          })
      }, 5 * 1000)
      return id
    },
    offlineConnectionStatus() {
      this.database.ref(this.connectionStatus)
        .child(this.name)
        .child(this.user.id)
        .set(this.offlineStatus)
    },
  }
}
</script>
