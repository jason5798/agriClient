import fetch from '../utils/fetch'

export function toAddZone (zone) {
  const data = {
    zone
  }
  return fetch({
    url: '/todos/zone',
    method: 'post',
    data
  })
}

export function toUpdateZone (zone) {
  const data = {
    zone
  }
  return fetch({
    url: '/todos/zone',
    method: 'put',
    data
  })
}

export function toDelZone (name) {
  const data = {
    name
  }
  return fetch({
    url: '/todos/zone',
    method: 'delete',
    data
  })
}

export function getZoneList () {
  return fetch({
    url: 'todos/zone?create=asc',
    method: 'get'
  })
}
