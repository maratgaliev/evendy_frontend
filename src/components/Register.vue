<template>
  <div class="col-md-4 col-sm-6 ml-auto mr-auto">
      <div class="card card-register">
          <h3 class="card-title">Регистрация</h3>
          <form class="register-form" @submit.prevent="register">
            <br/>
            <div class="alert alert-danger text-center" v-if="errors">
              <p class='text-left' v-for="msg, key in errors">
                {{ $t('user.' + key) + ': ' + msg.toString().toLowerCase() }}
              </p>
            </div>
              <label>Имя</label>
              <input v-model="name" type="text" id="inputName" class="name form-control no-border" placeholder="Имя" >
              <label>Телефон</label>
              <input v-model="phone" type="text" id="inputPhone" class="phone form-control no-border" placeholder="Телефон" >
              <label>Email</label>
              <input v-model="email" type="email" id="inputEmail" class="form-control no-border" placeholder="Email" >
              <label>Пароль</label>
              <input v-model="password" type="password" id="inputPassword" class="form-control no-border" placeholder="Пароль">
              <button class="btn btn-danger btn-block btn-round">Регистрация</button>
          </form>
          <div class="forgot">
            <router-link class="btn btn-link btn-danger" :to="`/login`">
              Вход
            </router-link>
          </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      phone: '',
      name: '',
      password: '',
      errors: '',
      submitted: false
    }
  },
  methods: {
    register () {
      this.$http.post('/users/sign_up', { user: { email: this.email, password: this.password, name: this.name, phone: this.phone } })
        .then(request => this.registerSuccessful(request))
        .catch(errors => this.registerFailed(errors))
    },
    registerSuccessful (req) {
      this.submitted = true
      localStorage.token = req.headers['authorization']
      this.$store.dispatch('register')
      this.$router.replace(this.$route.query.redirect || '/')
    },
    registerFailed (errors) {
      this.errors = errors.response.data.errors
      this.$store.dispatch('register')
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