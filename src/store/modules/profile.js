import {getProfileList, toAddProfile, toDelProfile, toUpdateProfile} from '../../api/profileSetting'

const profile = {
  state: {
    profileList: [],
    selectProfile: {}
  },
  mutations: {
    SET_PROFILE_LIST: (state, list) => {
      state.profileList = list
      console.log('$ store SET_PROFILE_LIST  state.profileList : ' + state.profileList.length)
    },
    ADD_PROFILE: (state, profile) => {
      console.log('$ store before  ADD_PROFILEstate.profileList : ' + state.profileList.length)
      state.profileList.push(profile)
      console.log('$ store after ADD_PROFILE state.profileList : ' + state.profileList.length)
    },
    DELETE_PROFILE: (state, name) => {
      var delIndex = findIndex(state.profileList, name)
      console.log('$$$$$ store  delete profileList index : ' + delIndex)
      state.profileList.splice(delIndex, 1)
      console.log('$$$$$ store  state.profileList : ' + state.profileList)
    },
    UPDATE_PROFILE: (state, profile) => {
      var updateIndex = findIndex(state.profileList, profile.name)
      console.log('$$$$$ store UPDATE_PROFILE  index : ' + updateIndex)
      state.profileList[updateIndex] = profile
    },
    SET_SELECT_PROFILE: (state, profile) => {
      // Jason modify for avoid original profile be changed
      state.selectProfile = JSON.parse(JSON.stringify(profile))
      console.log('$ store  state.selectProfile : ' + state.selectProfile.name)
    },
    SET_NEW_PROFILE: (state, profile) => {
      state.selectProfile = profile
      console.log('$$$$$ store  state.selectProfile : ' + state.selectProfile.name)
    }
  },
  actions: {
    setProfileList: ({ commit }, list) => {
      commit('SET_PROFILE_LIST', list)
      commit('SET_SELECT_PROFILE', list[0])
    },
    addProfile: ({ commit }, profile) => {
      commit('SET_IS_LOADING', true)
      commit('ADD_PROFILE', profile)
      return new Promise((resolve, reject) => {
        toAddProfile(profile).then(response => {
          if (response.data.result.localeCompare('ok') === 0) {
            // Jason mark delete finish to show alert
            console.log('**** toAddProfile to DB is success!')
            commit('SET_IS_LOADING', false)
          } else {
            console.log('????  toAddProfile to DB is fail!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    deleteProfile: ({ commit }, name) => {
      console.log('$$$$$ store  deleteProfile receive name : ' + name)
      commit('SET_IS_LOADING', true)
      commit('DELETE_PROFILE', name)
      return new Promise((resolve, reject) => {
        toDelProfile(name).then(response => {
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
    updateProfile: ({ commit }, profile) => {
      console.log('$$$$$ store  updateProfile receive profile name : ' + profile.name)
      commit('SET_IS_LOADING', true)
      commit('UPDATE_PROFILE', profile)
      return new Promise((resolve, reject) => {
        toUpdateProfile(profile).then(response => {
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
    setSelectProfile: ({ commit }, profile) => {
      commit('SET_SELECT_PROFILE', profile)
    },
    getProfiles: ({commit}) => {
      return new Promise((resolve, reject) => {
        getProfileList().then(response => {
          var lists = response.data
          console.log('$ getProfileList :  ' + lists.length)
          commit('SET_PROFILE_LIST', lists)
          if (lists.length > 0) {
            commit('SET_SELECT_PROFILE', lists[0])
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

function findIndex (lists, name) {
  console.log('$$$$$ store  DELETE_PROFILE receive  name : ' + name)
  var mIndex = 0
  for (var b = 0; b < lists.length; b++) {
    console.log('$$$$$ store  profileListlist [ ' + b + ' ]name : ' + lists[b].name)
    if (name.localeCompare(lists[b].name) === 0) {
      mIndex = b
    }
  }
  return mIndex
}

export default profile
