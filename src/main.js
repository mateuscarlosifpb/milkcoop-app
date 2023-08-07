import Vue from 'vue'
import App from './App.vue'
import vuetify from "./plugins/vuetify.js";
import router from "@/router/router.js";


Vue.config.productionTip = false

import 'vuetify/dist/vuetify.min.css';

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
