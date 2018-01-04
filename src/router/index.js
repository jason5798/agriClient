import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Device from '@/views/Device'
import Find from '@/views/Find'
import Zone from '@/views/Zone'
import Profiles from '@/views/Profiles'
import DeviceSetting from '@/views/DeviceSetting'
import EventLog from '@/views/EventLog'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/device',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'device',
          name: 'Device',
          component: Device
        },
        {
          path: 'find',
          name: 'Find',
          component: Find
        },
        {
          path: 'zone',
          name: 'Zone',
          component: Zone
        },
        {
          path: 'profiles',
          name: 'Profiles',
          component: Profiles
        },
        {
          path: 'device-settings',
          name: 'DeviceSetting',
          component: DeviceSetting
        },
        {
          path: 'event-log',
          name: 'EventLog',
          component: EventLog
        }
      ]
    }
  ]
})
