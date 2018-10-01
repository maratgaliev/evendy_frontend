<template>
<nav class="navbar navbar-expand-md bg-info">
  <div class="container">
      <a class="navbar-brand" href="/">EVENDY</a>
      <button class="navbar-toggler navbar-toggler-right burger-menu" type="button" data-toggle="collapse" data-target="#navbar-primary" aria-controls="navbarSupportedContent" aria-expanded="true" aria-label="Toggle navigation">
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
    </button>
      <div class="navbar-collapse collapse show" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <router-link class="nav-link" :to="`/editor`">Добавить
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="`/`">События
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="`/map`">Карта
                </router-link>
              </li>
              <li class="nav-item" v-if="!currentUser">
                <a class="nav-link" href="/register">Регистрация</a>
              </li>
              <li class="nav-item" v-if="!currentUser">
                <a class="nav-link" href="/login">Вход</a>
              </li>
              <li class="nav-item" v-if="currentUser">
                <a class="nav-link" href="/logout">Выход</a>
              </li>
          </ul>
      </div>
  </div>
</nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  }
}
</script>

<style lang="scss" scoped>
.bg-bookstore {
  background: #605B56 !important;
}
.btn-logout {
  background-color: #837A75;
  border-color: #837A75;
  color: #fff;
}
.btn-logout:hover {
  background-color: darken(#837A75, 20%);
  border-color: darken(#837A75, 20%);
  color: #fff;
}
</style>