import {getZoneList, toAddZone, toDelZone, toUpdateZone} from '../../api/zoneSetting'

const zone = {
  state: {
    zoneList: [],
    selectZone: {}
  },
  mutations: {
    SET_ZONE_LIST: (state, list) => {
      state.zoneList = list
      console.log('$ store SET_PROFILE_LIST  state.zoneList : ' + state.zoneList.length)
    },
    ADD_ZONE: (state, zone) => {
      console.log('$ store before  ADD_PROFILEstate.zoneList : ' + state.zoneList.length)
      state.zoneList.push(JSON.parse(JSON.stringify(zone)))
      console.log('$ store after ADD_PROFILE state.zoneList : ' + state.zoneList.length)
    },
    DELETE_ZONE: (state, name) => {
      var delIndex = findIndex(state.zoneList, name)
      console.log('$$$$$ store  delete zoneList index : ' + delIndex)
      state.zoneList.splice(delIndex, 1)
      console.log('$$$$$ store  state.zoneList : ' + state.zoneList)
    },
    UPDATE_ZONE: (state, zone) => {
      var updateIndex = findIndex(state.zoneList, zone.name)
      console.log('$$$$$ store UPDATE_PROFILE  index : ' + updateIndex)
      state.zoneList[updateIndex] = JSON.parse(JSON.stringify(zone))
    },
    SET_SELECT_ZONE: (state, zone) => {
      // Jason modify for avoid original zone be changed
      state.selectZone = JSON.parse(JSON.stringify(zone))
      console.log('$ store  state.selectZone : ' + zone.name)
    }
  },
  actions: {
    setZoneList: ({ commit }, list) => {
      commit('SET_ZONE_LIST', list)
      commit('SET_SELECT_ZONE', list[0])
    },
    addZone: ({ commit }, zone) => {
      commit('SET_IS_LOADING', true)
      commit('ADD_ZONE', zone)
      return new Promise((resolve, reject) => {
        toAddZone(zone).then(response => {
          commit('SET_IS_LOADING', false)
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            console.log('**** toAddZone to DB is success!')
          } else {
            console.log('????  toAddZone to DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    deleteZone: ({ commit }, name) => {
      console.log('$ store  deleteZone receive name : ' + name)
      commit('SET_IS_LOADING', true)
      commit('DELETE_ZONE', name)
      return new Promise((resolve, reject) => {
        toDelZone(name).then(response => {
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            commit('SET_IS_LOADING', false)
          } else {
            console.log('????  deleteZone with DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateZone: ({ commit }, zone) => {
      console.log('$store  updateZone receive zone name : ' + JSON.stringify(zone))
      // console.log('$store  updateZone receive zone name : ' + zone.name)
      commit('SET_IS_LOADING', true)
      commit('UPDATE_ZONE', zone)
      return new Promise((resolve, reject) => {
        toUpdateZone(zone).then(response => {
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            commit('SET_IS_LOADING', false)
          } else {
            console.log('????  deleteZone with DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    setSelectZone: ({ commit }, zone) => {
      commit('SET_SELECT_ZONE', zone)
    },
    getZones: ({commit}) => {
      return new Promise((resolve, reject) => {
        getZoneList().then(response => {
          var lists = response.data
          commit('SET_ZONE_LIST', lists)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

function findIndex (lists, name) {
  console.log('$ store  findIndex()  receive  name : ' + name)
  var mIndex = 0
  for (var b = 0; b < lists.length; b++) {
    console.log('$$$$$ store  zoneListlist [ ' + b + ' ]name : ' + lists[b].name)
    if (name.localeCompare(lists[b].name) === 0) {
      mIndex = b
    }
  }
  return mIndex
}

export default zone
