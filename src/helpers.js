import Vue from 'vue'
import moment from 'moment'
Vue.use(require('vue-moment'))

export const prettyDate = (date) =>
  moment(date).utcOffset('+0300').format('DD-MM-YYYY в HH:mm')

export const limitClass = (max_limit, users_count) =>
  parts = parseInt(max_limit / users_count)
