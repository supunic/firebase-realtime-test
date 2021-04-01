<template>
  <div>
    <form>
      <input v-model="form.title" type="text" placeholder="title">
      <input v-model="form.body" type="text" placeholder="body">
      <a class="button--green" @click="create">craete</a>
    </form>
    <p>title と body を入力してください</p>
    <table class="contents">
      <thead>
        <tr>
          <th width="200" height="30">title</th>
          <th width="200" height="30">body</th>
          <th width="200" height="30">author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.key">
          <td width="200" height="60">{{ item.title }}</td>
          <td width="200" height="60">{{ item.body }}</td>
          <td width="200" height="60">{{ item.author }}</td>
          <td>
            <a class="button--green" @click="update(item.key)">update</a>
            <a class="button--green" @click="destroy(item.key)">delete</a>
          </td>
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
  },
  data() {
    return {
      database: firebase.database(),
      contents: 'contents',
      connectionStatus: 'connectionStatus',
      connectInfo: '.info/connected',
      form: {
        title: '',
        body: '',
      },
      list: [],
    }
  },
  mounted() {
    this.read()
  },
  methods: {
    create() {
      if (!this.validation()) return
      this.database.ref(this.contents).push({ ...this.form, author: this.user.name })
      this.clearForm()
    },
    read() {
      // 一度起動すれば値の変更を検知してリアルタイム更新する
      this.database.ref(this.contents).on('value', data => {
        const items = data.val()
        this.list = []
        if (items === null) return
        Object.keys(items).forEach((val, _) => {
          items[val].key = val
          this.list.push(items[val])
        })
      })
    },
    update(key) {
      this.database.ref(this.contents).child(key).update({ ...this.form, author: this.user.name })
      this.clearForm()
    },
    destroy(key) {
      this.database.ref(this.contents).child(key).remove()
    },
    clearForm() {
      this.form.title = ''
      this.form.body = ''
    },
    validation() {
      return this.form.title !== '' && this.form.body !== ''
    },
  }
}
</script>
