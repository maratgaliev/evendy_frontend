<template>
<div class="container">
  <div class="row">
    <div class="col-md-8 ml-auto mr-auto">
      <div class="no-transition">
        <h3 class="card-title text-center">Редактирование события</h3>
        {{ event }}
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto">
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
            <form role="form" id="contact-form" method="post" 
            @submit.prevent="updateEvent" v-if="!formSubmitted">
              <div class="card-body">
                
                <div class="form-group label-floating">
                    <label>Наименование</label>
                    <input v-model="title" 
                    data-vv-as="'Наименование'"
                    v-validate.initial="title" data-vv-rules="required|min:3" 
                    class="form-control" type="text" placeholder="Наименование">
                    <p class="text-danger" v-if="errors.has('title')">{{ errors.first('title') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Описание</label>
                  <textarea 
                  data-vv-as="'Описание'"
                  v-model="description" type="text" id="inputDescription"
                  v-validate.initial="description" data-vv-rules="required|min:3" 
                  class="event_description form-control" placeholder="Описание" />
                  <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Адрес</label>
                  <vue-google-autocomplete
                      country="ru"
                      id="inputAddress"
                      v-model="address"
                      classname="form-control"
                      placeholder="Адрес"
                      v-on:placechanged="getAddressData"
                  >
                  </vue-google-autocomplete>
                </div>

                <div class="form-group label-floating">
                  <label>Дата и время начала</label>
                  <date-picker v-model="start_at" />
                  <p class="text-danger" v-if="errors.has('start_at')">{{ errors.first('start_at') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Дата и время окончания</label>
                  <date-picker v-model="end_at" />
                  <p class="text-danger" v-if="errors.has('end_at')">{{ errors.first('end_at') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Ограничение по количеству участников</label>
                  <input v-model="max_limit" 
                  data-vv-as="'Ограничение по количеству участников'"
                  type="text" id="inputMaxLimit" 
                  v-validate.initial="max_limit" data-vv-rules="required|numeric"
                  class="event_max_limit form-control" placeholder="Ограничение по количеству участников" />
                  <p class="text-danger" v-if="errors.has('max_limit')">{{ errors.first('max_limit') }}</p>
                </div>                                                                    

                <div class="form-group label-floating">
                  <label>Стоимость</label>
                  <input v-model="price" 
                  data-vv-as="'Стоимость'"
                  type="text" id="inputPrice" 
                  v-validate.initial="price" data-vv-rules="required|numeric"
                  class="event_price form-control" placeholder="Стоимость" />
                  <p class="text-danger" v-if="errors.has('price')">{{ errors.first('price') }}</p>
                </div>                                            

                <div class="form-group label-floating">
                  <label>Telegram</label>
                  <input v-model="telegram" type="text" id="inputTelegram" class="event_telegram form-control" placeholder="Telegram" />
                </div>  

                <div class="row">
                  <div class="ml-auto mr-auto">
                    <button type="submit" class="btn btn-primary pull-right">Сохранить
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VeeValidate, { Validator } from 'vee-validate'
import messagesRU from 'vee-validate/dist/locale/ru'
import { mapGetters } from 'vuex'
import VueEvendycal from '../custom/evendycal'

Vue.component('evendycal', require('../custom/evendycal'))

Validator.installDateTimeValidators(moment)
Vue.use(VeeValidate, {
  locale: 'ru',
  dictionary: {
    ru: { messages: messagesRU }
  }
})
export default {
  components: { VueGoogleAutocomplete, VueEvendycal },
  name: 'EventEdit',
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  data () {
    return {
      event: null,
      title: '',
      description: '',
      address: '',
      start_at: '',
      end_at: '',
      max_limit: '',
      price: '',
      telegram: '',
      error: false,
      formSubmitted: false
    }
  },
  created () {
    this.checkEvent()
  },
  updated () {
    this.checkEvent()
  },
  methods: {
    validateBeforeSubmit (e) {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.submitForm()
      }
    },
    submitForm () {
      this.formSubmitted = true
    },
    getAddressData: function (addressData, placeResultData, id) {
      this.address = placeResultData.formatted_address
    },
    checkEvent () {
      if (!this.currentUser) {
        this.$router.push('/login/?redirect=/editor')
      }
    },
    updateEvent () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.$http.patch('/events/' + this.$route.params.event, { event: { title: this.title, description: this.description, address: this.address, start_at: this.start_at, end_at: this.end_at, max_limit: parseInt(this.max_limit), price: this.price, telegram: this.telegram } }, { headers: { 'Authorization': localStorage.token } })
        .then(request => this.updateSuccessful(request))
        .catch(() => this.updateFailed())
      }
    },
    updateSuccessful (req) {
      this.error = false
      this.$router.replace(this.$route.query.redirect || '/')
    },
    updateFailed (errors) {
      this.error = 'Ошибка при обновлении'
    }
  },
  beforeMount () {
    var app = this
    this.$http.get('/events/' + this.$route.params.event, { headers: { 'Authorization': localStorage.token } })
    .then(function (resp) {
      var event = resp.data['event']
      app.title = event.title
      app.description = event.description

      app.$children[0].$refs.autocomplete.value = event.address
      app.$children[0].$emit('input', event.address)

      var startAt = moment(event.start_at).format('DD/MM/YYYY HH:mm')
      app.$children[1].$refs.input.value = startAt
      app.$children[1].$emit('input', startAt)

      var endAt = moment(event.end_at).format('DD/MM/YYYY HH:mm')
      app.$children[2].$refs.input.value = endAt
      app.$children[2].$emit('input', endAt)

      app.max_limit = event.max_limit
      app.price = event.price
      app.telegram = event.telegram
      console.log(event.telegram)
    })
    .catch(function (resp) {
      alert('Ошибка при загрузке события')
    })
  }
}
</script>
