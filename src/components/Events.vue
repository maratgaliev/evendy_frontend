<template>
    <div class="row align-self-center">
        <div class="loading">
          <loading
              :show="show"
              :label="label"
              :overlay="overlay">
          </loading>  
        </div>
        
    <div class="col-md-4 event-col" v-for="event, index in data['events']">
      <div class="card" v-bind:data-color="colorClass(event.start_at)" data-background="color">
        <div class="card-body text-center">
          <div class="card-category text-center">
            <span class="label label-info main-tag">{{ event.date_string }}</span>
          </div>
          <h5 class="card-title custom_card_title">
            <router-link class="custom_card_title" :to="`/events/${event.slug_url}`">
            {{ event.title }}
            </router-link>
          </h5>
          <p class="card-description card_main_desc">
            {{ event.description }}
          </p>
          <h6 class="card-category visits_count">{{ event.visits_count }} / {{ event.max_limit }}</h6>
          <div class="card-description">
            <div class="progress">
              <div 
              v-bind:class=" 'progress-bar-custom progress-bar progress-bar-' + progressClass(event.percentage) "
              role="progressbar"
              v-bind:style="{ width: event.percentage + '%' }"
              v-bind:aria-valuenow="event.percentage" aria-valuemin="0" aria-valuemax="100">
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <router-link class="preview__title" :to="`/events/${event.slug_url}`">
              <button class="btn btn-danger btn-round">Посмотреть</button>
            </router-link>
          </div>
				</div>
		  </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Loading from '../Loading.vue'

export default {
  components: {
    Loading
  },
  data: function () {
    return {
      data: [],
      show: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  methods: {
    colorClass (date) {
      var isDone = moment(date).isBefore(moment())
      var color = isDone ? 'green' : 'blue'
      return color
    },
    progressClass (percentage) {
      if (percentage >= 0 && percentage <= 30) {
        return 'success'
      } else if (percentage >= 30 && percentage <= 60) {
        return 'warning'
      } else return 'danger'
    }
  },
  mounted () {
    var app = this
    app.show = true
    this.$http.get('/events').then(function (resp) {
      app.data = resp.data
      app.show = false
    })
      .catch(function (resp) {
        app.show = false
        alert('Ошибка при загрузке событий')
      })
  }
}
</script>