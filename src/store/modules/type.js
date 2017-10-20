import {getDeviceTypes} from '../../api/todos'

const type = {
  state: {
    devicTypes: Array, // device types is device type object example {17 : {....}}
    typeList: [], // typeList is device type array example [{typeName:'test'},...]
    selectTypeName: '',
    selectType: null
  },
  mutations: {
    SET_DEVICE_TYPES: (state, types) => {
      state.devicTypes = types
      // console.log('SET_DEVICE_TYPES : ' + JSON.stringify(types))
      state.typeList = []
      Object.keys(types).forEach(function (content) {
        if (types[content].typeName !== undefined) {
          // console.log('SET_DEVICE_TYPES content : ' + content + ' = > ' + JSON.stringify(types[content].typeName))
          state.typeList.push(types[content])
        }
      })
      // console.log('state.typeList : ' + JSON.stringify(state.typeList))
      if (state.selectTypeName === '') {
        state.selectTypeName = state.typeList.length > 0 ? state.typeList[0].typeName : ''
      }
      state.selectType = state.typeList.length > 0 ? state.typeList[0] : {}
      // console.log('$$$$$ store  state.selectTypeName : ' + JSON.stringify(state.selectTypeName))
      // console.log('$$$$$ store  state.selectType : ' + JSON.stringify(state.selectType))
    },
    SET_SELECT_TYPE_NAME: (state, name) => {
      state.selectTypeName = name
      // console.log('$$$$$ store  state.selectTypeName : ' + state.selectTypeName)
      for (var i = 0; i < state.typeList.length; i++) {
        if (state.typeList[i].typeName === name) {
          state.selectType = state.typeList[i]
        }
      }
      // console.log('$$$$$ store  state.selectType : ' + JSON.stringify(state.selectType))
    }
  },
  actions: {
    setDeviceTypes: ({commit}, types) => {
      commit('SET_DEVICE_TYPES', types)
    },
    setSelectTypeName: ({commit}, name) => {
      commit('SET_SELECT_TYPE_NAME', name)
    },
    getDeviceType: ({commit}) => {
      return new Promise((resolve, reject) => {
        getDeviceTypes().then(response => {
          commit('SET_DEVICE_TYPES', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default type
