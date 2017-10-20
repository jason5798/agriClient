import Vue from 'vue'
import Vuex from 'vuex'
import device from './modules/device'
import profile from './modules/profile'
import type from './modules/type'
import status from './modules/status'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    device,
    profile,
    type,
    status
  },
  getters
})

export default store
