<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Main msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Main from '@/components/main-layout.vue'

export default {
  name: 'Home',
  components: {
    Main
  }
}
</script>
