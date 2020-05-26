import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
window.mapboxgl = mapboxgl
window.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
