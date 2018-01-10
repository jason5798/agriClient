import {getBindList, toAddBindDevice, toUpdateBindDevice, toDelBindDevice} from '../../api/todos'

const app = {
  state: {
    selectMac: '',
    // deviceList: [],
    selectBindDevice: {},
    bindDeviceList: []
  },
  mutations: {
    SET_SELECT_MAC: (state, mac) => {
      state.selectMac = mac
      // console.log('$$$$$ store state.selectMac : ' + state.selectMac)
    },
    GET_BIND_LIST: (state, lists) => {
      console.log('$ GET_BIND_LIST : ' + lists.length)
      state.bindDeviceList = lists
    },
    SET_SELECT_DEVICE: (state, device) => {
      state.selectBindDevice = JSON.parse(JSON.stringify(device))
      console.log('$ store  state.selectDevice : ' + device.name)
    },
    ADD_BIND_DEVICE: (state, device) => {
      state.bindDeviceList.push(JSON.parse(JSON.stringify(device)))
      console.log('$ store after ADD_DEVICE : ' + state.bindDeviceList.length)
    },
    DELETE_BIND_DEVICE: (state, name) => {
      var delIndex = findIndex(state.bindDeviceList, name)
      console.log('$ store : delete bindDeviceList  index : ' + delIndex)
      state.bindDeviceList.splice(delIndex, 1)
      console.log('$ store  DELETE_DEVICE  : ' + state.bindDeviceList.length)
    },
    UPDATE_BIND_DEVICE: (state, device) => {
      var updateIndex = findIndex(state.bindDeviceList, device.name)
      console.log('$ store : UPDATE_DEVICE  index : ' + updateIndex)
      state.bindDeviceList[updateIndex] = JSON.parse(JSON.stringify(device))
    }
  },
  actions: {
    setSelectMac: ({commit}, mac) => {
      commit('SET_SELECT_MAC', mac)
    },
    getBindDeviceList: ({commit}) => {
      return new Promise((resolve, reject) => {
        getBindList().then(response => {
          console.log('$ store : getBindList : ' + response.data.length)
          commit('GET_BIND_LIST', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    setSelectDevice: ({ commit }, device) => {
      commit('SET_SELECT_DEVICE', device)
    },
    addBindDevice: ({ commit }, device) => {
      console.log('* addBindDevice : ' + JSON.stringify(device))
      commit('SET_IS_LOADING', true)
      commit('ADD_BIND_DEVICE', device)
      return new Promise((resolve, reject) => {
        toAddBindDevice(device).then(response => {
          commit('SET_IS_LOADING', false)
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            console.log('**** toAddProfile to DB is success!')
          } else {
            console.log('????  toAddProfile to DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    deleteBindDevice: ({ commit }, name) => {
      console.log('$ store  deleteProfile receive name : ' + name)
      commit('SET_IS_LOADING', true)
      commit('DELETE_BIND_DEVICE', name)
      return new Promise((resolve, reject) => {
        toDelBindDevice(name).then(response => {
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            commit('SET_IS_LOADING', false)
          } else {
            console.log('????  deleteProfile with DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateBindDevice: ({ commit }, device) => {
      console.log('$ store  updateDevice receive device name : ' + JSON.stringify(device))
      commit('SET_IS_LOADING', true)
      commit('UPDATE_BIND_DEVICE', device)
      return new Promise((resolve, reject) => {
        toUpdateBindDevice(device).then(response => {
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            commit('SET_IS_LOADING', false)
          } else {
            console.log('?  updateDevic with DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          console.log('return new Promise error :' + error)
          reject(error)
        })
      })
    }
  }
}

function findIndex (lists, name) {
  console.log('$ store :  device  findIndex()  receive  name : ' + name)
  var mIndex = 0
  for (var b = 0; b < lists.length; b++) {
    console.log('$$$$$ store bindDeviceList[ ' + b + ' ] name : ' + lists[b].name)
    if (name.localeCompare(lists[b].name) === 0) {
      mIndex = b
    }
  }
  return mIndex
}

export default app
