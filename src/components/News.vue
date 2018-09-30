<template>
  <div class="container">
    <div class="article" v-for="event, index in data['news_items']">
      <div class="row">
        <div class="col-md-8 ml-auto mr-auto">
          <div class="card card-blog card-plain text-center">
            <div class="card-body">
              <div class="card-category">
                <span class="label label-primary main-tag">{{ event.date_string }}</span>
              </div>
              <a href="javascript:void(0);">
                <h3 class="card-title">{{ event.title }}</h3>
              </a>
              <div class="card-description">
                <p>{{ event.description }}</p>
              </div>
            </div>
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
  beforeMount () {
    var app = this
    this.$http.get('/news_items')
      .then(function (resp) {
        app.data = resp.data
      })
      .catch(function (resp) {
        alert('Ошибка при загрузке новостей')
      })
  }
}
</script>
