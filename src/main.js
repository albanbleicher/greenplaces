import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import '../src/assets/App.scss'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
