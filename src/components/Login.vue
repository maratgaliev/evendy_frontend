<template>
  <div class="col-md-4 col-sm-6 ml-auto mr-auto">
      <div class="card card-register">
          <h3 class="text-center">ВХОД НА САЙТ</h3>
          <form class="register-form" @submit.prevent="login">
            <br/>
            <div class="alert alert-danger text-center" v-if="error">{{ error }}</div>
              <label>Email</label>
              <input v-model="email" type="email" id="inputEmail" class="form-control no-border" placeholder="Email" required autofocus>
              <label>Пароль</label>
              <input v-model="password" type="password" id="inputPassword" class="form-control no-border" placeholder="Пароль" required>
              <button class="btn btn-danger btn-block btn-round">Вход</button>
          </form>
          <div class="forgot">
            <router-link class="btn btn-link btn-white" :to="`/register`">
              РЕГИСТРАЦИЯ
            </router-link>
          </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error: false
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  methods: {
    login () {
      this.$http.post('/users/sign_in', { user: { email: this.email, password: this.password } })
        .then(request => this.loginSuccessful(request))
        .catch(() => this.loginFailed())
    },
    loginSuccessful (req) {
      if (!req.headers['authorization']) {
        this.loginFailed()
        return
      }
      this.error = false
      var user = req.data.user
      localStorage.token = req.headers['authorization']
      var userJson = { id: user.id, email: user.email, phone: user.phone, name: user.name }
      localStorage.setItem('userData', JSON.stringify(userJson))
      this.$store.dispatch('login')
      this.$router.replace(this.$route.query.redirect || '/')
    },
    loginFailed () {
      this.error = 'Заполните все поля корректно'
      this.$store.dispatch('logout')
      delete localStorage.token
    }
  }
}
</script>

<style lang="css" scoped>
.login-overlay {
  background: #605B56 !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.login-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
  animation: fadein 0.6s;
}
@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>