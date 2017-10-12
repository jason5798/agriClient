// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'iview/dist/styles/iview.css'
import VueEvents from 'vue-events'
Vue.use(Vuex)
Vue.use(VueEvents)
Vue.use(iView)
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
