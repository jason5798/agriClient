import Vue from 'vue'
import Vuex from 'vuex'
import device from './modules/device'
import profile from './modules/profile'
import type from './modules/type'
import status from './modules/status'
import zone from './modules/zone'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    device,
    profile,
    type,
    status,
    zone
  },
  getters
})

export default store
