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
      <br/>
      <a v-on:click="cancelEvent(event)" v-if=" !cancelled && currentUser && canEdit(event.author_id)" class="red btn btn-link btn-link-danger">
        Отменить
      </a>
      <router-link v-if="currentUser && canEdit(event.author_id)" class="btn btn-link btn-primary" :to="`/event/${event.slug_url}/edit`">
        Изменить
      </router-link>
      <a v-on:click="get_cal()" class="btn btn-link btn-danger">
        Календарь
      </a>
      <h4><small>{{ event.address }}</small></h4>
      <div class="col-md-12 text-center">
        <h4 class="info-title"> {{ event.description }} </h4>
      </div>
    </div>
    <div class="row">
        <div v-bind:class="'col-md-6 mr-auto ml-auto text-center ' + divClass"
        v-if="fullLimit(event.visits_count, event.max_limit)">
            <div class="alert alert-danger text-center">
                СВОБОДНЫХ МЕСТ БОЛЬШЕ НЕТ
            </div>
        </div>
        <div v-bind:class="'col-md-6 mr-auto ml-auto text-center visible'"
        v-if="cancelled">
            <div class="alert alert-danger text-center">
                СОБЫТИЕ ОТМЕНЕНО
            </div>
        </div>
    </div>
    <choice
        :limit.sync="event.visits_count == event.max_limit" :count.sync="event.visits_count" :decision.sync="event.decision" :users.sync="event.users" 
        v-if="!cancelled && currentUser && !(momentCheck(event.start_at)) 
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
      <GmapMap
        id="map"
        ref="map"
        :center="center"
        :zoom="15"
        style="width:100%;  height: 400px;">
        <div v-if="mapLoaded"> 
          <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
            {{infoContent}}
          </GmapInfoWindow>
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            @click="toggleInfoWindow(m,index)"
            :draggable="true"
          />
        </div>  
      </GmapMap>
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
                        <p class="card-description text-center upper">
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
            <p class='upper' v-for="user, index in arr_teams">
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
import Loading from './Loading.vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCj7yumb7U_kY-Q9Jxln4SE8jUAVbEnHZA',
    libraries: 'places'
  }
})

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
      distance: 25,
      local_google: null,
      infoContent: '',
      infoWindowPos: null,
      infoWinOpen: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      mapLoaded: false,
      markers: [],
      center: { lat: 0, lng: 0 },
      users: {},
      divClass: 'invisible',
      show: false,
      cancelled: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser', google: VueGoogleMaps.gmapApi }), google: VueGoogleMaps.gmapApi
  },
  watch: {
    distance: function (n) {
      this.getMarkers()
    },
    markers: function (newMarkers, o) {
      var trafficLayer = new google.maps.TrafficLayer()
      this.$refs.map.$mapPromise.then((map) => {
        trafficLayer.setMap(map)
      })
    }
  },
  methods: {
    searchLocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = { lat: position.coords.latitude, lng: position.coords.longitude }
      })
    },
    getMarkers: function () {
      var app = this
      app.$refs.map.$mapPromise.then(() => {
        app.$http.get(this.$route.path, { headers: { 'Authorization': localStorage.token } })
          .then(function (resp) {
            app.event = resp.data['event']
            app.users = resp.data['event']['users']
            app.show = false
            if (app.event.latitude && app.event.longitude) {
              app.center = { lat: app.event.latitude, lng: app.event.longitude }
              app.markers = [{infoText: app.event.title + ' : ' + app.event.address, position: { lat: app.event.latitude, lng: app.event.longitude }}]
            } else {
              app.searchLocation()
            }
            app.cancelled = app.event.state === 'cancelled'
            app.divClass = 'visible'
          })
          .catch(function (resp) {
            console.log(resp)
            app.show = false
            alert('Ошибка при загрузке события')
          })
        this.mapLoaded = true
      })
    },
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.position
      this.infoContent = marker.infoText
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    },
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
    cancelEvent: function () {
      this.$http.post(this.$route.path + '/cancel', {}, {})
        .then((response) => {
          this.cancelled = true
        })
        .catch((err) => {
          console.log(err)
        })
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
    this.getMarkers()
  }
}
</script>