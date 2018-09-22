<template>
  <div id="info-areas">
        <div class="loading">
          <loading
              :show="show"
              :label="label"
              :overlay="overlay">
          </loading>  
        </div>
    <div class="title text-center">
        <h2>{{ event.title }}</h2>
        <h4><small>{{ event.address }}</small></h4>
        <div class="col-md-12 text-center">
          <h4 class="info-title"> {{ event.description }} </h4>
        </div>
        <router-link v-if="currentUser && canEdit(event.author_id)" class="btn btn-link btn-danger" :to="`/event/${event.slug_url}/edit`">
          Изменить
        </router-link>

        <a v-on:click="get_cal()" class="btn btn-link btn-danger">
          Календарь
        </a>
    </div>
    <div class="row">
        <div class="" 
        v-bind:class="'col-md-6 mr-auto ml-auto text-center ' + divClass"
        v-if="fullLimit(event.visits_count, event.max_limit)">
            <div class="alert alert-danger text-center">
                Свободных мест больше нет
            </div>
        </div>
    </div>
    <choice
        :limit.sync="event.visits_count == event.max_limit" :count.sync="event.visits_count" :decision.sync="event.decision" :users.sync="event.users" 
        v-if="currentUser && !(momentCheck(event.start_at)) 
        && (canRevote(event.users, currentUser, event.visits_count, event.max_limit))">
    </choice>

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
                    <i class="nc-icon nc-spaceship"></i>
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
                        <router-link :to="`/users/${user.id}`">
                          <div class="card-avatar">
                            <img src="/static/img/user.png" v-bind:alt="user.name">
                            <h4 class="card-title">{{ user.name }}</h4>
                          </div>
                        </router-link>
                        <p class="card-description text-center">
                          <router-link :to="`/users/${user.id}`">
                            {{ user.name }}
                          </router-link>
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

    <div class="users_block align_center" v-if="users.length > 0 && (users.length == event.max_limit)">
        <hr/>
        <h3 class="title-uppercase text-center">Составы</h3>
        <br/>
        <div class="row">
          <div v-bind:class="'team_' + index" class="col-md-6 event-col" v-for="arr_teams, index in getChunks(shuffle(users), 5)">
            <p v-for="user, index in arr_teams">
              {{ user.name }}
            </p>
            <hr/>
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
import Loading from '../Loading.vue'

Vue.use(require('vue-moment'))
Vue.component('choice', Choice)

export default {
  components: {
    Loading
  },
  name: 'events-event',
  resource: 'Event',
  data () {
    return {
      event: {
        users: []
      },
      users: {},
      divClass: 'invisible',
      show: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  methods: {
    shuffle: function (array) {
      let counter = array.length
      while (counter > 0) {
        let index = Math.floor(Math.random() * counter)
        counter--
        let temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
      }
      return array
    },
    getChunks: function (myArray, chunkSize) {
      var temporal = []
      for (var i = 0; i < myArray.length; i += chunkSize) {
        temporal.push(myArray.slice(i, i + chunkSize))
      }
      return temporal
    },
    get_cal: function () {
      this.$http.post(this.$route.path + '/calendar', {}, {responseType: 'blob'})
        .then((response) => {
          let blob = new Blob([response.data], { type: 'text/calendar' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'event.ics'
          link.click()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    canRevote: function (usersArr, currentUser, visitsCount, maxLimit) {
      var canRevote = false
      var limit = this.fullLimit(visitsCount, maxLimit)
      if (currentUser.id) {
        if (usersArr.filter(function (e) { return e.id === currentUser.id }).length > 0) {
          canRevote = true
        } else if (!limit) {
          canRevote = true
        }
      }
      return canRevote
    },
    fullLimit: function (visitsCount, maxLimit) {
      return visitsCount === maxLimit
    },
    momentCheck: function (date) {
      return moment(date).isBefore(moment())
    },
    canEdit: function (authorId) {
      return authorId === this.currentUser.id
    }
  },
  mounted () {
    var app = this
    app.show = true
    this.$http.get(this.$route.path, { headers: { 'Authorization': localStorage.token } })
        .then(function (resp) {
          app.event = resp.data['event']
          app.users = resp.data['event']['users']
          app.show = false
          app.divClass = 'visible'
        })
        .catch(function (resp) {
          app.show = false
          alert('Ошибка при загрузке события')
        })
  }
}
</script>