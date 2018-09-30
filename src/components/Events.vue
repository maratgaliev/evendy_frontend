<template>
    <div class="row align-self-center">
        <div class="loading">
          <loading
              :show="show"
              :label="label"
              :overlay="overlay">
          </loading>  
        </div>
    <div class="col-md-4 event-col" v-for="event, index in events">
      <div class="card" v-bind:data-color="colorClass(event.start_at, event.state)" data-background="color"> 
        <div class="card-body text-center">
          <div class="col-md-12 mr-auto ml-auto text-center">
            <span class="label label-info main-tag text-center">{{ event.date_string }}</span>
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
          <div class="card-footer">
            <router-link v-bind:class="'preview__title ' + marginClass(currentUser, event.users_ids)" :to="`/events/${event.slug_url}`">
              <button class="btn btn-danger btn-round">Посмотреть</button>
            </router-link>
            <div v-if="currentUser && checkIsGoing(event.users_ids, currentUser.id)" class="going_icon icon icon-primary btn-white">
              <i class="nc-icon nc-user-run"></i>
            </div>
          </div>
				</div>
		  </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Loading from './Loading.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Loading
  },
  data: function () {
    return {
      events: [],
      show: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  methods: {
    marginClass (user, arr) {
      return user && arr.includes(user.id) ? 'marginleft' : ''
    },
    checkIsGoing (arr, userId) {
      return arr.includes(userId)
    },
    colorClass (date, state) {
      var isDone = moment(date).isBefore(moment())
      var color = isDone ? 'green' : 'blue'
      if (state === 'cancelled') {
        color = 'brown'
      }
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
      app.events = resp.data['events']
      app.show = false
    })
      .catch(function (resp) {
        app.show = false
        alert('Ошибка при загрузке событий')
      })
  }
}
</script>