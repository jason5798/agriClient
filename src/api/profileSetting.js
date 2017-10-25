import fetch from '../utils/fetch'

export function toAddProfile (profile) {
  const data = {
    profile
  }
  return fetch({
    url: '/todos/profile',
    method: 'post',
    data
  })
}

export function toUpdateProfile (profile) {
  const data = {
    profile
  }
  return fetch({
    url: '/todos/profile',
    method: 'put',
    data
  })
}

export function toDelProfile (name) {
  const data = {
    name
  }
  return fetch({
    url: '/todos/profile',
    method: 'delete',
    data
  })
}

export function getProfileList () {
  return fetch({
    url: 'todos/profile',
    method: 'get'
  })
}

export function getProfileByType (type) {
  if (type) {
    console.log('$ getProfileByType : type  is exist => getNewProfile(type)')
    return getNewProfile(type)
  } else {
    console.log('$  getProfileByType  : type  is not exist => getTmpProfile()')
    return getTmpProfile()
  }
}

function getNewProfile (type) {
  var profile = {name: ''}
  var setting = {}
  console.log('*** Object.keys(type.fieldName) : ' + JSON.stringify(Object.keys(type.fieldName)))
  Object.keys(type.fieldName).forEach(function (content) {
    for (var i = 0; i < 4; i++) {
      setting[content] = {name: (type.fieldName)[content], max: '', maxInfo: '', min: '', mainInfo: ''}
    }
  })
  profile.setting = setting
  // console.log('##### current select type : ' + JSON.stringify(type))
  // console.log('##### current profile : ' + JSON.stringify(profile))
  return profile
}

function getTmpProfile () {
  var profile = {name: ''}
  var setting = {}
  var type = {fieldName: {temperature: '溫度', ph: '酸鹼度', water: '水含量', ec: '電導'}}
  Object.keys(type.fieldName).forEach(function (content) {
    for (var i = 0; i < 4; i++) {
      setting[content] = {name: (type.fieldName)[content], max: '', maxInfo: '', min: '', mainInfo: ''}
    }
  })
  profile.setting = setting
  // console.log('##### current select type : ' + JSON.stringify(type))
  // console.log('##### current profile : ' + JSON.stringify(profile))
  return profile
}
