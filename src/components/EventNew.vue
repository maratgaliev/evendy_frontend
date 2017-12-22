<template>
<div class="container">
  <div class="row">
    <div class="col-md-8 ml-auto mr-auto">
      <div class="no-transition">
        <h3 class="card-title text-center">Новое событие</h3>
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto">
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
            <form role="form" id="contact-form" method="post" 
            @submit.prevent="createEvent" v-if="!formSubmitted">
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
                  <input v-model="start_at" 
                  data-vv-as="'Дата и время начала'"
                  type="text" id="inputStartAt" 
                  v-validate.initial="start_at" data-vv-rules="required|date_format:DD/MM/YYYY HH:mm"
                  class="event_start_at datetimepicker form-control" placeholder="Дата и время начала" />
                  <p class="text-danger" v-if="errors.has('start_at')">{{ errors.first('start_at') }}</p>
                </div>

                <div class="form-group label-floating">
                  <label>Дата и время окончания</label>
                  <input v-model="end_at" 
                  data-vv-as="'Дата и время окончания'"
                  type="text" id="inputEndAt" 
                  v-validate.initial="end_at" data-vv-rules="required|date_format:DD/MM/YYYY HH:mm"
                  class="event_end_at datetimepicker form-control" placeholder="Дата и время окончания" />
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

Validator.installDateTimeValidators(moment)
Vue.use(VeeValidate, {
  locale: 'ru',
  dictionary: {
    ru: { messages: messagesRU }
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
      this.$router.replace(this.$route.query.redirect || '/events')
    },
    createFailed (errors) {
      this.error = 'Ошибка при сохранении'
    }
  }
}
</script>
