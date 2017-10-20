import fetch from '../utils/fetch'

export function getMacList () {
  return fetch({
    url: 'todos/bindlist',
    method: 'get'
  })
}

export function getDatas (obj) {
  var url = 'todos/datas'
  var index = 0
  Object.keys(obj).forEach(function (key) {
    if (index === 0) {
      url += '?' + key + '=' + obj[key]
    } else {
      url += '&' + key + '=' + obj[key]
    }
    index++
  })
  return fetch({
    url: url,
    method: 'get'
  })
}

export function getDevices (obj) {
  var url = 'todos/devices'
  var index = 0
  Object.keys(obj).forEach(function (key) {
    if (index === 0) {
      url += '?' + key + '=' + obj[key]
    } else {
      url += '&' + key + '=' + obj[key]
    }
    index++
  })
  return fetch({
    url: url,
    method: 'get'
  })
}

export function getDeviceTypes () {
  return fetch({
    url: 'todos/deviceMaps',
    method: 'get'
  })
}
