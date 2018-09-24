<template>
  <div id="info-areas">
    <div class="loading">
          <loading
              :show="show"
              :label="label"
              :overlay="overlay">
          </loading>  
    </div>
    <div class="container">
      <div class="title text-center">
          <h2>РЕЙТИНГИ</h2> 
          <div class="text-center">
            <div class="container">
              <br/>
              <br/>
              <div class="logo_stats">
                <div class="avatar">
                  <img src="/static/img/stats.png" class="img-circle img-no-padding img-responsive">
                </div>
              </div>  
            </div>
          </div>
      </div>    
      <div class="row">
        <div class="ml-auto mr-auto">
          <div class="table-responsive">
            <table class="table table-shopping">
              <thead>
                <tr>
                  <th class="text-left">ИМЯ</th>
                  <th class="text-right">РЕЙТИНГ</th>
                  <th class="text-right">СКОРОСТЬ</th>
                  <th class="text-right">УДАР</th>
                  <th class="text-right">ПАС</th>
                  <th class="text-right">ДРИБЛИНГ</th>
                  <th class="text-right">ЗАЩИТА</th>
                  <th class="text-right">ФИЗИКА</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user, index in data['users']">
                  <td class="td">
                    <b>{{ user.name }}</b>
                  </td>
                  <td class="td-price">
                    {{ user.cached_rating }}
                  </td>                  
                  <td class="td-price">
                    {{ user.pace }}
                  </td>
                  <td class="td-price">
                    {{ user.shooting }}
                  </td>
                  <td class="td-price">
                    {{ user.passing }}
                  </td>
                  <td class="td-price">
                    {{ user.dribbling }}
                  </td>
                  <td class="td-price">
                    {{ user.defending }}
                  </td>
                  <td class="td-price">
                    {{ user.physicality }}
                  </td>
                </tr>
              </tbody>
            </table>
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
  data: function () {
    return {
      data: [],
      show: false,
      label: 'Загрузка',
      overlay: true
    }
  },
  mounted () {
    var app = this
    app.show = true
    this.$http.get('/users').then(function (resp) {
      app.data = resp.data
      app.show = false
    })
      .catch(function (resp) {
        app.show = false
        alert('Ошибка при загрузке рейтингов')
      })
  }
}
</script>