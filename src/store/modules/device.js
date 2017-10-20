import {getMacList} from '../../api/todos'

const app = {
  state: {
    selectMac: '',
    deviceList: []
  },
  mutations: {
    SET_DEVICE_LIST: (state, lists) => {
      state.deviceList = lists
    },
    SET_SELECT_MAC: (state, mac) => {
      state.selectMac = mac
      // console.log('$$$$$ store state.selectMac : ' + state.selectMac)
    },
    GET_DEVICE_LIST: (state, lists) => {
      // console.log('$$$$$ GET_DEVICE_LIST : ' + JSON.stringify(lists))
      state.deviceList = lists
    }
  },
  actions: {
    setDeviceList: ({commit}, list) => {
      commit('SET_DEVICE_LIST', list)
    },
    setSelectMac: ({commit}, mac) => {
      commit('SET_SELECT_MAC', mac)
    },
    getDeviceList: ({commit}) => {
      return new Promise((resolve, reject) => {
        getMacList().then(response => {
          commit('GET_DEVICE_LIST', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default app
