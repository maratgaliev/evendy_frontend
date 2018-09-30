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
                <h2 class="title">СОБЫТИЯ</h2>
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
import Navbar from '@/components/Navbar'
import Foot from '@/components/Foot'

export default {
  name: 'App',
  components: {
    Navbar,
    Foot
  }
}
</script>
