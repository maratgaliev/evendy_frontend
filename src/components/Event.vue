<template>
  <div id="info-areas">
    <div class="title text-center">
        <h2>{{ event.title }}</h2>
        <h4><small>{{ event.address }}</small></h4>
        <div class="col-md-12 text-center">
          <h4 class="info-title"> {{ event.description }} </h4>
        </div>
    </div>
    <choice :count.sync="event.visits_count" :decision.sync="event.decision" :users.sync="event.users" 
    v-if="currentUser && !(momentCheck(event.start_at))"></choice>
    <div class="row">
        <div class="col-md-4">
            <div class="info">
                <div class="icon icon-primary">
                    <i class="nc-icon nc-calendar-60"></i>
                </div>
                <div class="description">
                    <h4 class="info-title"> Дата </h4>
                    <p class="info-p">{{ event.date_string }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="info">
                <div class="icon icon-warning">
                    <i class="nc-icon nc-user-run"></i>
                </div>
                <div class="description">
                    <h4 class="info-title"> Места </h4>
                    <p class="info-p">{{ event.visits_count }} / {{ event.max_limit }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="info">
                <div class="icon icon-danger">
                    <i class="nc-icon nc-money-coins"></i>
                </div>
                <div class="description">
                    <h4 class="info-title"> Стоимость </h4>
                    <p class="info-p">{{ event.price }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="users_block" v-if="event.users.length > 0">
        <hr/>
        <h3 class="title-uppercase text-center">Участники</h3>
        <div class="row">
            <div class="col-md-4" v-for="user, index in event.users">
                <div class="card card-profile card-plain">
                    <div class="card-body">
                        <div class="card-avatar">
                            <a href="#avatar">
                                <img src="http://demos.creative-tim.com/paper-kit-2-pro/assets/img/faces/joe-gardner-2.jpg" v-bind:alt="user.name"
                                >
                                <h4 class="card-title">{{ user.name }}</h4>
                            </a>
                        </div>
                        <p class="card-description text-center">
                            {{ user.name }}
                        </p>
                    </div>
                    <!-- <div class="card-footer text-center">
                        <a href="#pablo" class="btn btn-just-icon btn-linkedin"><i class="fa fa-linkedin"></i></a>
                        <a href="#pablo" class="btn btn-just-icon btn-dribbble"><i class="fa fa-dribbble"></i></a>
                        <a href="#pablo" class="btn btn-just-icon btn-instagram"><i class="fa fa-instagram"></i></a>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import Choice from './Choice.vue'
import { mapGetters } from 'vuex'
Vue.use(require('vue-moment'))
Vue.component('choice', Choice)

export default {
  name: 'events-event',
  resource: 'Event',
  data () {
    return {
      event: {
        users: []
      }
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  methods: {
    momentCheck: function (date) {
      return moment(date).isBefore(moment())
    }
  },
  beforeMount () {
    if (!this.event) return
    var app = this
    this.$http.get(this.$route.path, { headers: { 'Authorization': localStorage.token } })
        .then(function (resp) {
          app.event = resp.data['event']
        })
        .catch(function (resp) {
          console.log(resp)
          alert('Could not load events')
        })
  }
}
</script>