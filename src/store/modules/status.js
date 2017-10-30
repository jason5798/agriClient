const status = {
  state: {
    isLoading: false,
    isAddProfile: false,
    isAddDevice: false
  },
  mutations: {
    SET_IS_LOADING: (state, status) => {
      state.isLoading = status
      console.log('$$$$$ store state.isLoading : ' + state.isLoading)
    },
    SET_IS_ADD_PROFILE: (state, status) => {
      state.isAddProfile = status
      console.log('$ store SET_IS_ADD_PROFILE : ' + state.isAddProfile)
    },
    SET_IS_ADD_DEVICE: (state, status) => {
      state.isAddDevice = status
      console.log('$ store SET_IS_ADD_DEVICE : ' + state.isAddDevice)
    }
  },
  actions: {
    setIsLoading: ({commit}, status) => {
      console.log('$ store setIsLoading : ' + status)
      commit('SET_IS_LOADING', status)
    },
    setIsAddProfile: ({commit}, status) => {
      commit('SET_IS_ADD_PROFILE', status)
    },
    setIsAddDevice: ({commit}, status) => {
      commit('SET_IS_ADD_DEVICE', status)
    },
    setTest: ({commit}, status) => {
      console.log('***************************** test ok *********************************')
    }
  }
}

export default status
