<template>
  <navbar>
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <a class="navbar-brand" href="#"></a>
    <ul class="nav navbar-nav d-md-down-none">
      <!--li class="nav-item">
        <a class="nav-link navbar-toggler sidebar-toggler" href="#" @click="sidebarMinimize">&#9776;</a>
      </li>-->
      <li class="nav-item px-3">
        <a class="nav-link" href="#/devices">裝置</a>
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
    </ul>
    <ul class="nav navbar-nav ml-auto">
      <li class="nav-item d-md-down-none">
        <a class="nav-link" href="#">
          <i class="icon-bell" ></i>
          <div  style="width:30px;height:20px;background-color:#ff9933;border-radius:50%;">
            <span id="notifyCount">10</span>
          </div>

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
      <!--<li class="nav-item d-md-down-none">
        <a class="nav-link navbar-toggler aside-menu-toggler" href="#" @click="asideToggle">&#9776;</a>
      </li>-->
    </ul>
  </navbar>
</template>
<script>

  import navbar from './Navbar'
  import { dropdown } from 'vue-strap'
  document.body.classList.toggle('sidebar-hidden')
  var notifyCount = 0

  var ws = new WebSocket('ws://localhost:3000/ws/notify')
  ws.onmessage = function (m) {
    console.log('< from-node-red:', m.data)
    if (typeof m.data === 'string' && m.data !== null) {
      var msg = JSON.parse(m.data)
      console.log('from-node-red : id:' + msg.id)
      if (msg.id === 'event_notity') {
        console.log('msg.v : ' + JSON.stringify(msg.v))
        notifyCount = notifyCount + 1
        console.log('notifyCount : ' + notifyCount)
      }
    }
  }

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
