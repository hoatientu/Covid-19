<template>
  <v-app style="width: 100%; height: 100%">
    <v-content style="width: 100%; height: 100%; overflow: hidden">
<!--      <div style="height: 100%; width: 100%; background-color: black">-->

<!--      </div>-->
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
<style scoped>
</style>
