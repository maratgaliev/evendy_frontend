<template></template>

<script>
export default {
  name: 'Logout',
  created () {
    delete localStorage.token
    delete localStorage.userData
    this.$store.dispatch('logout')
    this.$router.push('/')
  }
}
</script>