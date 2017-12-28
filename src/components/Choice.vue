<template>
  <div class="row">
    <div class="col-md-6 mr-auto ml-auto text-center" v-if="msg">
      <div class="alert alert-info text-center">
        {{ msg }}
      </div>
    </div>
    <div class="col-md-12 text-center">
      <button class="btn btn-outline-danger btn-lg"
        :class="{ 'active': statusDecision }"
        @click='handleClick'>{{ statusDecision ? notGoText : goText }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    decision: {
      type: Boolean
    },
    limit: {
      type: Boolean
    },
    count: {
      type: Number
    },
    users: {
      type: Array
    }
  },
  data: function () {
    return {
      currentDecision: this.status,
      currentCount: this.count,
      currentLimit: this.limit,
      goText: 'Записаться',
      notGoText: 'Отписаться',
      msg: ''
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    statusLimit: {
      get () { return this.limit },
      set (val) { this.$emit('update:limit', val) }
    },
    statusDecision: {
      get () { return this.decision },
      set (val) { this.$emit('update:decision', val) }
    },
    statusCount: {
      get () { return this.count },
      set (val) { this.$emit('update:count', val) }
    },
    statusUsers: {
      get () { return this.users },
      set (val) { this.$emit('update:users', val) }
    }
  },
  methods: {
    handleClick: function () {
      var app = this
      this.$http.post(this.$route.path + '/apply', {},
        { headers: { 'Authorization': localStorage.token } })
        .then(function (resp) {
          app.msg = 'Спасибо, что оповестили нас'
          app.statusDecision = !app.statusDecision
          var usersArr = app.statusUsers.map(a => a.id)
          var currentUserId = app.currentUser.id
          if (usersArr.includes(currentUserId)) {
            var index = usersArr.indexOf(currentUserId)
            app.statusUsers.splice(index, 1)
            app.statusCount -= 1
          } else {
            app.statusCount += 1
            app.statusUsers.push({ id: currentUserId, name: app.currentUser.name })
          }
          app.$forceUpdate()
        })
        .catch(function (resp) {
          alert('Произошла ошибка, попробуйте позже')
        })
    }
  }
}
</script>