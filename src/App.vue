<template>
  <div id="app">
    <template>
      <Navbar></Navbar>
    </template>
    <div class="wrapper">
      <div class="main">
        <div class="custom_section section-white">
          <div class="container">
            <template v-if="$route.name == 'Events'">
            <div class="space-top"></div>
            <div class="row">
              <div class="col-md-12 ml-auto mr-auto text-center">
                <h2 class="title">EVENDY</h2>
              </div>
    			  </div>
            <div class="space-top"></div>
            </template>
            <router-view></router-view>
            <template v-if="$route.name == 'Events'">
              <Foot></Foot>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from '@/components/Navbar'
import Foot from '@/components/Foot'
export default {
  name: 'app',
  computed: {
    ...mapGetters({ currentUser: 'currentUser' })
  },
  // created () {
  //   this.checkCurrentLogin()
  // },
  // updated () {
  //   this.checkCurrentLogin()
  // },
  // methods: {
  //   checkCurrentLogin () {
  //     if (!this.currentUser && this.$route.path == '/editor') {
  //       this.$router.push('/?redirect=' + this.$route.path)
  //     }
  //   }
  // },
  components: {
    Navbar,
    Foot
  }
}
</script>

<style>
</style>