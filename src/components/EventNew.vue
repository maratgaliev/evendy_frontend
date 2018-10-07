<template>
<div class="container">
  <div class="row">
    <div class="col-md-8 ml-auto mr-auto">
      <div class="no-transition">
        <h3 class="card-title text-center">НОВОЕ СОБЫТИЕ</h3>
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto">
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
            <form role="form" id="contact-form" method="post" 
            @submit.prevent="createEvent" v-if="!formSubmitted">
              <div class="card-body">
                <div class="form-group label-floating">
                    <label>Наименование</label>
                    <input v-model="title"
                    data-vv-as="'Наименование'" data-vv-name="title" ref="title"
                    v-validate="'required|min:3'"
                    class="form-control" type="text" placeholder="Наименование">
                    <p class="text-danger" v-if="errors.has('title')">{{ errors.first('title') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Описание</label>
                  <textarea 
                  data-vv-as="'Описание'" data-vv-name="description" ref="description"
                  v-model="description" type="text" id="inputDescription"
                  v-validate="'required|min:3'" 
                  class="event_description form-control" placeholder="Описание" />
                  <p class="text-danger" v-if="errors.has('description')">{{ errors.first('description') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Адрес</label>
                    <vue-google-autocomplete
                        v-if="loaded"
                        country="ru"
                        id="inputAddress"
                        v-model="address"
                        classname="form-control"
                        placeholder="Адрес"
                        v-on:placechanged="getAddressData"
                    >
                  </vue-google-autocomplete>
                </div>

                <input v-model="latitude" type="hidden">
                <input v-model="longitude" type="hidden"> 

                <div class="form-group label-floating">
                  <label>Дата и время начала</label>
                  <date-picker v-model="start_at" data-vv-name="start_at" ref="start_at"/>
                  <p class="text-danger" v-if="errors.has('start_at')">{{ errors.first('start_at') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Дата и время окончания</label>
                  <date-picker v-model="end_at" data-vv-name="end_at" ref="end_at"/>
                  <p class="text-danger" v-if="errors.has('end_at')">{{ errors.first('end_at') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Ограничение по количеству участников</label>
                  <input v-model="max_limit" 
                  data-vv-as="'Ограничение по количеству участников'"
                  type="text" id="inputMaxLimit"
                  data-vv-name="max_limit" ref="max_limit"
                  v-validate="'required|numeric'"
                  class="event_max_limit form-control" placeholder="Ограничение по количеству участников" />
                  <p class="text-danger" v-if="errors.has('max_limit')">{{ errors.first('max_limit') }}</p>
                </div>                                                                    

                <div class="form-group label-floating">
                  <label>Стоимость</label>
                  <input v-model="price" 
                  data-vv-as="'Стоимость'"
                  type="text" id="inputPrice" 
                  data-vv-name="'price'" ref="'price'"
                  v-validate="'required|numeric'"
                  class="event_price form-control" 
                  placeholder="Стоимость" />
                  <p class="text-danger" v-if="errors.has('price')">{{ errors.first('price') }}</p>
                </div>                                            

                <div class="form-group label-floating">
                  <label>Telegram</label>
                  <input v-model="telegram" data-vv-name="telegram" ref="price" type="text" id="inputTelegram" class="event_telegram form-control" placeholder="Telegram" />
                </div>  

                <div class="row">
                  <div class="ml-auto mr-auto">
                    <button type="submit" class="btn btn-danger pull-right">Сохранить
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
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VeeValidate, { Validator } from 'vee-validate'
import { mapGetters } from 'vuex'
import ru from 'vee-validate/dist/locale/ru'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.component('evendycal', require('../custom/evendycal'))

Vue.use(VeeValidate)
Validator.localize('ru', ru)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCj7yumb7U_kY-Q9Jxln4SE8jUAVbEnHZA',
    libraries: 'places'
  }
})
export default {
  components: { VueGoogleAutocomplete },
  name: 'EventNew',
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  data () {
    return {
      title: '',
      description: '',
      address: '',
      latitude: 0,
      longitude: 0,
      start_at: '',
      end_at: '',
      max_limit: '',
      price: '',
      telegram: 'evendy_prod',
      error: false,
      formSubmitted: false,
      loaded: false
    }
  },
  created () {
    this.checkEvent()
  },
  updated () {
    this.checkEvent()
  },
  beforeMount () {
    if (!this.event) return
    var app = this
    this.$http.get(this.$route.path, { headers: { 'Authorization': localStorage.token } })
      .then(function (resp) {
        app.event = resp.data['event']
      })
      .catch(function (resp) {
        alert('Ошибка при загрузке события')
      })
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
      var lat = placeResultData.geometry.location.lat()
      var lng = placeResultData.geometry.location.lng()
      this.address = placeResultData.formatted_address
      this.latitude = lat
      this.longitude = lng
    },
    checkEvent () {
      if (!this.currentUser) {
        this.$router.push('/login/?redirect=/editor')
      }
    },
    createEvent () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.$http.post('/events', { event: { title: this.title, description: this.description, address: this.address, start_at: this.start_at, end_at: this.end_at, max_limit: parseInt(this.max_limit), price: this.price, telegram: this.telegram } }, { headers: { 'Authorization': localStorage.token } })
          .then(request => this.createSuccessful(request))
          .catch(() => this.createFailed())
      }
    },
    createSuccessful (req) {
      this.error = false
      this.$router.replace(this.$route.query.redirect || '/')
    },
    createFailed (errors) {
      this.error = 'Ошибка при сохранении'
    }
  }
}
</script>
