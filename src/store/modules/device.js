const app = {
  state: {
    devicelist: [],
    selectMac: ''
  },
  mutations: {
    SET_DEVICE_LIST: (state, list) => {
      state.devicelist = list
    },
    SET_SELECT_MAC: (state, mac) => {
      state.selectMac = mac
      console.log('$$$$$ store state.selectMac : ' + state.selectMac)
    }
  },
  actions: {
    setDeviceList: ({ commit }, list) => {
      commit('SET_DEVICE_LIST', list)
    },
    setSelectMac: ({ commit }, mac) => {
      commit('SET_SELECT_MAC', mac)
    }
  }
}

export default app
