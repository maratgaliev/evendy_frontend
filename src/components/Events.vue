<template>
  <div class="row">
    <div class="col-md-4 event-col" v-for="event, index in data['events']">
      <div class="card" v-bind:data-color="colorClass()" data-background="color">
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
export default {
  data: function () {
    return {
      data: []
    }
  },
  methods: {
    colorClass () {
      var colors = ['orange', 'blue', 'purple', 'brown', 'green', 'yellow']
      return colors[Math.floor(Math.random() * colors.length)]
    },
    progressClass (percentage) {
      if (percentage >= 0 && percentage <= 30) {
        return 'success'
      } else if (percentage >= 30 && percentage <= 60) {
        return 'warning'
      } else return 'danger'
    }
  },
  beforeMount () {
    var app = this
    this.$http.get('/events')
        .then(function (resp) {
          app.data = resp.data
        })
        .catch(function (resp) {
          alert('Ошибка при загрузке событий')
        })
  }
}
</script>