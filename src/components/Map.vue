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
      <h2>КАРТА СОБЫТИЙ</h2>
    </div>
      <GmapMap
        id="map"
        ref="map"
        :center="center"
        :zoom="11"
        style="width:100%;  height: 800px;">
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
</div>
</template>

<script>
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
      events: {},
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
      divClass: 'invisible',
      show: false,
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
    eventExists: function (arr, lat, lng) {
      let hasMagenicVendor = arr.some(vendor => console.log(vendor))
      return hasMagenicVendor
    },
    checkAndAdd: function (eventsArr) {
      var markers = this.markers
      eventsArr.forEach(function (event, i) {
        if (markers.length > 0) {
          if (markers.filter(function (e) { return e.position.lat === event.latitude }).length === 0) {
            markers.push({id: event.id, infoText: event.title + ' : ' + event.address, position: { lat: event.latitude, lng: event.longitude }})
          }
        } else {
          markers.push({id: event.id, infoText: event.title + ' : ' + event.address, position: { lat: event.latitude, lng: event.longitude }})
        }
      })
    },
    getMarkers: function () {
      var app = this
      app.$refs.map.$mapPromise.then(() => {
        app.$http.get('/events', { headers: { 'Authorization': localStorage.token } })
          .then(function (resp) {
            app.events = resp.data['events']
            app.checkAndAdd(app.events)
            app.show = false
            app.divClass = 'visible'
          })
          .catch(function (resp) {
            app.show = false
            alert('Ошибка при загрузке событий')
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
    }
  },
  mounted () {
    var app = this
    app.show = true
    this.getMarkers()
    this.searchLocation()
  }
}
</script>