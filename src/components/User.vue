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
          <h2>Профиль игрока №{{ user.id }}</h2> 
          <h4><small><b>Дата регистрации:</b> {{ user.date_string }}</small></h4> 
          <div class="col-md-12 text-center">
            <h4 class="info-title"> В Парке Горького </h4>
          </div> 
          </div>
          <div class="section profile-content text-center">
            <div class="container">
                <div class="owner">
                    <div class="avatar">
                      <img src="/static/img/user.png" class="img-circle img-no-padding img-responsive">
                    </div>
                    <div class="name">
                      <h1 class="title custom_title">{{ user.name }}</h1>
                      <h3>РЕЙТИНГ: {{ user.rating }}</h3>
                      <br/>
						          <h5 class="description">Всего матчей: {{ user.games_visited }}</h5>
                      <br/>
                      <h6 class="description">Позиция: {{ user.position }}</h6>
                    </div>
                </div>
            </div>

            <div class="row labels_row">
              <div class="col-md-12">
                <span v-for="label, index in user.label_list" class="label label-danger custom_label">{{ label }}</span>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                  <div class="info">
                      <div class="icon icon-primary">
                          <i class="nc-icon nc-user-run"></i>
                      </div>
                      <div class="description">
                          <h4 class="info-title"> СКОРОСТЬ </h4>
                          <p class="info-p">{{ user.pace }}</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                      <div class="icon icon-warning">
                          <i class="nc-icon nc-hat-3"></i>
                      </div>
                      <div class="description">
                          <h4 class="info-title"> УДАР </h4>
                          <p class="info-p">{{ user.shooting }}</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                      <div class="icon icon-danger">
                          <i class="nc-icon nc-pin-3"></i>
                      </div>
                      <div class="description">
                          <h4 class="info-title"> ПАС </h4>
                          <p class="info-p">{{ user.passing }}</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                      <div class="icon icon-primary">
                          <i class="nc-icon nc-refresh-69"></i>
                      </div>
                      <div class="description">
                          <h4 class="info-title"> ДРИБЛИНГ </h4>
                          <p class="info-p">{{ user.dribbling }}</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                      <div class="icon icon-warning">
                          <i class="nc-icon nc-support-17"></i>
                      </div>
                      <div class="description">
                          <h4 class="info-title"> ЗАЩИТА </h4>
                          <p class="info-p">{{ user.defending }}</p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                      <div class="icon icon-danger">
                          <i class="nc-icon nc-button-power"></i>
                      </div>
                      <div class="description">
                          <h4 class="info-title"> ФИЗИКА </h4>
                          <p class="info-p">{{ user.physicality }}</p>
                      </div>
                  </div>
              </div>
            </div>
        </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Loading from '../Loading.vue'

Vue.use(require('vue-moment'))

export default {
  components: {
    Loading
  },
  name: 'users-user',
  resource: 'User',
  data () {
    return {
      user: {},
      divClass: 'invisible',
      show: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  mounted () {
    var app = this
    app.show = true
    this.$http.get(this.$route.path, { headers: { 'Authorization': localStorage.token } })
        .then(function (resp) {
          app.user = resp.data['user']
          app.show = false
          app.divClass = 'visible'
        })
        .catch(function (resp) {
          app.show = false
          alert('Ошибка при загрузке данных')
        })
  }
}
</script>