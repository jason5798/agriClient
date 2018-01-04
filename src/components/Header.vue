<template>
  <navbar>
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>    <a class="navbar-brand" href="#"></a>
    <ul class="nav navbar-nav d-md-down-none mr-auto">
      <li class="nav-item px-3">
        <a class="nav-link" href="#/device">裝置</a>
      </li>
      <li class="nav-item px-3">
        <a class="nav-link" href="#/find">查詢</a>
      </li>
      <li class="nav-item px-3">
        <a class="nav-link" href="#/zone">區域</a>
      </li>
      <dropdown text="設定" class="nav-item px-3">
        <div class="dropdown-header text-center"><strong>所有設定</strong></div>
        <li><a class="dropdown-item" href="#/device-settings"><i class="fa fa-map-marker"></i> 裝置設定</a></li>
        <li><a class="dropdown-item" href="#/profiles"><i class="fa fa-bell-o"></i> 通知設定</a></li>
      </dropdown>
      <dropdown text="記錄" class="nav-item px-3">
        <div class="dropdown-header text-center"><strong>系統記錄</strong></div>
        <li><a class="dropdown-item" href="#/event-log"><i class="fa fa-bell-o"></i> 異常通知記錄</a></li>
        <!--<a class="dropdown-item" href="#/profiles"><i class="fa fa-hand-pointer-o"></i> 操作記錄</a></li>-->
      </dropdown>
    </ul>
    <ul class="nav navbar-nav ml-auto">
      <li class="nav-item d-md-down-none" >
        <a class="nav-link" href="#/event-log">
          <i class="icon-bell" ></i>
          <span id="notifyCount"> </span>&nbsp;異常通知 &nbsp;&nbsp;&nbsp;
        </a>

      </li>
      <dropdown size="nav" class="nav-item">
        <span slot="button">
          <span class="d-md-down-none">Hi,Giot</span>
        </span>
        <!--<div slot="dropdown-menu"class="dropdown-menu dropdown-menu-right">

          <div class="dropdown-header text-center"><strong>Account</strong></div>

          <a class="dropdown-item" href="#"><i class="fa fa-bell-o"></i> Updates<span class="badge badge-info">42</span></a>
          <a class="dropdown-item" href="#"><i class="fa fa-envelope-o"></i> Messages<span class="badge badge-success">42</span></a>
          <a class="dropdown-item" href="#"><i class="fa fa-tasks"></i> Tasks<span class="badge badge-danger">42</span></a>
          <a class="dropdown-item" href="#"><i class="fa fa-comments"></i> Comments<span class="badge badge-warning">42</span></a>

          <div class="dropdown-header text-center"><strong>Settings</strong></div>

          <a class="dropdown-item" href="#"><i class="fa fa-user"></i> Profile</a>
          <a class="dropdown-item" href="#"><i class="fa fa-wrench"></i> Settings</a>
          <a class="dropdown-item" href="#"><i class="fa fa-usd"></i> Payments<span class="badge badge-default">42</span></a>
          <a class="dropdown-item" href="#"><i class="fa fa-file"></i> Projects<span class="badge badge-primary">42</span></a>
          <div class="divider"></div>
          <a class="dropdown-item" href="#"><i class="fa fa-shield"></i> Lock Account</a>
          <a class="dropdown-item" href="#"><i class="fa fa-lock"></i> Logout</a>-->
        </div>
      </dropdown>
    </ul>
  </navbar>
</template>
<script>

import navbar from './Navbar'
import { dropdown } from 'vue-strap'

document.body.classList.toggle('sidebar-hidden')

export default {
  name: 'header',
  components: {
    navbar,
    dropdown
  },
  methods: {
    click () {
      // do nothing
    },
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>
