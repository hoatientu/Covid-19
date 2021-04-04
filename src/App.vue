<template>
  <v-app style="width: 100%; height: 100%">
    <v-content style="width: 100%; height: 100%; overflow: hidden">
<!--      <div style="height: 100%; width: 100%; background-color: black">-->

<!--      </div>-->
      <Main/>
    </v-content>
  </v-app>
</template>

<script>
import Main from './components/main-layout';

export default {
  name: 'App',

  components: {
    Main,
  },

  data: () => ({
    //
  }),
};
</script>
<style scoped>
</style>
