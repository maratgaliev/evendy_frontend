<template>
<div class="section text-center">
    <div class="container">
        <div class="row">
            <div class="col-md-8 ml-auto mr-auto">
                <h2 class="title black_color">Статистика</h2>
                <h5 class="description"></h5>
            </div>
        </div>
				<br><br>
				<div class="row">
					<div class="col-md-3">
						<div class="info">
							<div class="icon icon-danger">
								<i class="nc-icon nc-album-2"></i>
							</div>
							<div class="description">
								<h4 class="info-title">Пользователей</h4>
								<p class="description">{{ userCount }}</p>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<div class="info">
							<div class="icon icon-danger">
								<i class="nc-icon nc-bulb-63"></i>
							</div>
							<div class="description">
								<h4 class="info-title">Событий</h4>
								<p>{{ eventCount }}</p>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<div class="info">
							<div class="icon icon-danger">
								<i class="nc-icon nc-chart-bar-32"></i>
							</div>
							<div class="description">
								<h4 class="info-title">Последняя регистрация</h4>
								<p>{{ lastUserName }}</p>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<div class="info">
							<div class="icon icon-danger">
								<i class="nc-icon nc-sun-fog-29"></i>
							</div>
							<div class="description">
								<h4 class="info-title">Последнее событие</h4>
								<p>{{ lastEventName }}</p>
							</div>
						</div>
					</div>
				</div>
      </div>
  </div>
</template>

<script>
import Loading from '../Loading.vue'

export default {
  components: {
    Loading
  },
  name: 'Stats',
  data () {
    return {
      userCount: 0,
      eventCount: 0,
      lastUserName: '',
      lastEventName: '',
      show: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  mounted () {
    var app = this
    app.show = true
    this.$http.get(this.$route.path, { })
        .then(function (resp) {
          var data = resp.data['data']
          app.userCount = data.user_count
          app.eventCount = data.event_count
          app.lastUserName = data.last_user_name
          app.lastEventName = data.last_event_name
          app.show = false
        })
        .catch(function (resp) {
          app.show = false
          alert('Ошибка при загрузке события')
        })
  }
}
</script>