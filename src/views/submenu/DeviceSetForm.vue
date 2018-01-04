<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-8">
          <h5><i class="fa fa-map-marker"></i>  新增綁定裝置</h5>
        </div>
      </div>
    </div>
    <div class="card-block">
      <div>
        <form role="form">
          <div>
            <div class="form-group">
              <label >
                <h5>裝置名稱</h5>
              </label>
              <input type="text" v-model="newDevice.name" class="form-control input-lg">
            </div>
          </div>
          <div>
            <div class="form-group">
              <label >
                <h5>裝置識別碼</h5>
              </label>
              <input type="text" v-model="newDevice.macAddr" class="form-control input-lg"
                     @input="addEvent" @change="addEvent">
            </div>
          </div>
          <div>
            <div class="form-group">
              <label >
                <h5>座標緯度</h5>
              </label>
              <input type="number" v-model="newDevice.position.lat" class="form-control input-lg">
            </div>
          </div>
          <div>
            <div class="form-group">
              <label >
                <h5>座標經度</h5>
              </label>
              <input type="number" v-model="newDevice.position.lng" class="form-control input-lg">
            </div>
          </div>
          <div  class="form-group">
            <label >
              <h5>選擇異常通知設定</h5>
            </label>
            <input v-model="newDevice.profileName" type="text" placeholder="" @click="onMouseClick" class="form-control input-lg"/>
          </div>
          <button type="button" class="btn btn-primary btn-block" @click="onNew">
            <i v-if="isLoading" class='fa fa-spinner fa-spin '></i>
            <h5 v-else><i class="fa fa-plus"></i> 新增</h5>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  var empty = {
    name: '',
    macAddr: '',
    profileName: '',
    position: {
      lat: '',
      lng: ''
    }
  }
  function checkVal (str) {
    var regExp = /^[\d|a-zA-Z]+$/
    if (regExp.test(str)) {
      return true
    } else {
      return false
    }
  }
  export default {
    name: 'device-set-form',
    props: {
      preProfile: String
    },
    computed: {
      ...mapGetters([
        'selectBindDevice',
        'bindDeviceList',
        'selectProfile',
        'isLoading',
        'isAddDevice',
        'profileList',
        'isDeviceForm'
      ])
    },
    watch: {
      selectProfile (val) {
        if (this.isDeviceForm) {
          console.log('Device form watch select profile : ' + val.name)
          this.newDevice.profileName = val.name
          this.isCurrentDevice = false
        }
      }
    },
    data () {
      return {
        alertMessage: '尚未通知設定,無法取得顯示設定.',
        newDevice: empty,
        isCurrentDevice: false
      }
    },
    methods: {
      addEvent (ele) {
        var index = ele.target.value.length - 1
        console.log('addEvent index : ' + index)
        var str = ele.target.value.charAt(index)
        console.log('addEvent str : ' + str)
        if (checkVal(str) !== true) {
          this.alertMessage = '裝置識別碼只可輸入數字或英文字.'
          this.newDevice.macAddr = ele.target.value.slice(0, -1)
          this.warning()
        }
        if (index + 1 > 16) {
          this.alertMessage = '裝置識別碼最多只可輸入16個字元.'
          this.newDevice.macAddr = ele.target.value.slice(0, -1)
          this.warning()
        }
      },
      onNew () {
        var result = this.verifyDevice(true)
        if (result === null) {
          return
        }
        console.log('Child : press new button')
        this.newDevice.macAddr = this.newDevice.macAddr.toLocaleLowerCase()
        var sendNew = JSON.parse(JSON.stringify(this.newDevice))
        this.newDevice.name = ''
        this.newDevice.profileName = ''
        this.newDevice.macAddr = ''
        this.newDevice.position.lat = ''
        this.newDevice.position.lng = ''
        this.$emit('click-new', sendNew)
      },
      onMouseClick () {
        this.isCurrentDevice = true
        this.$store.dispatch('setIsDeviceForm', true)
        this.$emit('click-profile', null)
      },
      warning () {
        this.$Notice.config({
          top: 100,
          duration: 5
        })
        this.$Notice.warning({
          title: this.alertTitle,
          desc: this.alertMessage
        })
      },
      verifyDevice () {
        var device = this.newDevice
        if (device) {
          if (device.name === null || device.name === undefined || device.name === '') {
            this.alertMessage = '尚未輸入裝置名稱.'
            this.warning()
            return null
          } else {
            var lists = this.$store.getters.bindDeviceList
            console.log('? verifyDevice select name  : ' + device.name)
            for (var i = 0; i < lists.length; i++) {
              console.log('? verifyDevice[ ' + i + '] name  : ' + lists[i].name)
              if (lists[i].name === device.name) {
                this.alertMessage = '輸入通知設定名稱已存在,請更改名稱.'
                this.warning()
                return null
              }
            }
          }
          if (device.macAddr === '') {
            this.alertMessage = '尚未設定裝置識別碼.'
            this.warning()
            return null
          }
          if (device.position.lat === '' || device.position.lng === '') {
            this.alertMessage = '尚未設定座標.'
            this.warning()
            return null
          }
          return 'ok'
        } else {
          return null
        }
      }
    }
  }
</script>
<style>
</style>
