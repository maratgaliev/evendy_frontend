import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'
import router from './router'
import axios from './backend/vue-axios'
import store from './store'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'ru',
  messages: {
    ru: {
      user: {
        name: 'Имя',
        phone: 'Телефон',
        email: 'Email',
        password: 'Пароль'
      }
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  axios,
  store,
  template: '<App/>',
  components: { App }
})
