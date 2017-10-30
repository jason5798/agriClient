<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-8">
          <h5><i class="fa fa-map-marker"></i>  綁定裝置設定</h5>
        </div>
        <div class="col-md-4">
          <a v-show="!isAddDevice" @click="onAddMode"><img class="btn-add m-l21"  src="static/img/btn_add_n.png"/></a>
          <a v-show="isAddDevice" @click="onEditMode"><img class="btn-add m-l21"  src="static/img/btn_edit_n.png"/></a>
        </div>
      </div>
    </div>
    <div class="card-block">
      <div>
        <form role="form">
          <div v-if="isAddDevice">
            <div class="form-group">
              <label >
                <h5>新增綁定裝置設定名稱</h5>
              </label>
              <input type="text" v-model="selectBindDevice.name" class="form-control input-lg">
            </div>
          </div>
          <div v-if="!isAddDevice">
            <div class="form-group">
              <label >
                <h5>選擇綁定裝置</h5>
              </label>
              <select v-model="selectBindDevice.name" class="form-control" @change="selectDeviceVal">
                <option disabled value="">請選擇綁定裝置</option>
                <option v-for="device in bindDeviceList">{{device.name}}</option>
              </select>
            </div>
          </div>
          <div v-show="isShowNotifySelect" class="form-group">
            <label >
              <h5>選擇異常通知設定</h5>
            </label>
            <select v-model="selectProfile.name" class="form-control" @change="selectProfileVal">
              <option disabled value="">請選擇通知設定</option>
              <option value="">不指定</option>
              <option v-for="profile in profileList">{{profile.name}}</option>
            </select>
          </div>
          <button v-show="isAddDevice" type="button" class="btn btn-primary btn-block" @click="onNew">
            <i v-if="isLoading" class='fa fa-spinner fa-spin '></i>
            <h5 v-else>新增</h5>
          </button>
          <div v-show ="!isAddDevice" class="row">
            <div class="col-md-6">
              <button type="button" class="btn btn-primary btn-block" @click="onChange">
                <i v-if="isLoading" class='fa fa-spinner fa-spin '></i>
                <h5 v-else>更新</h5>
              </button>
            </div>
            <div class="col-md-6">
              <button type="button" class="btn btn-danger btn-block" @click="onDelete">
                刪除
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
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
        'profileList'
      ])
    },
    data () {
      return {
        isShowNotifySelect: false,
        newProfile: '',
        deviceName: '',
        btnName: '新增',
        deviceIndex: 0,
        isNeedFocus: false,
        alertTitle: '警告! ',
        alertMessage: '尚未通知設定,無法取得顯示設定.',
        profileCount: 0
      }
    },
    methods: {
      onNew () {
        var newDevice = this.verifyDevice(true)
        if (newDevice === null) {
          return
        }
        console.log('Child : press new button')
        this.$emit('click-new', newDevice)
      },
      onChange () {
        var newDevice = this.verifyDevice(false)
        if (newDevice === null) {
          return
        }
        console.log('Child : press change button')
        this.$emit('click-change', newDevice)
      },
      onDelete () {
        console.log('Child : press delete button')
        this.$emit('click-delete', this.$store.getters.selectBindDevice)
      },
      selectProfileVal (ele) {
        var name = ele.target.value
        console.log('child select profile name: ' + JSON.stringify(name))
        var profileList = this.$store.getters.profileList
        for (var b = 0; b < profileList.length; b++) {
          if (profileList[b]['name'] === name) {
            this.$store.dispatch('setSelectProfile', profileList[b])
          }
        }
        var device = this.$store.getters.selectBindDevice
        device.profileName = name
        this.$store.dispatch('setSelectDevice', device)
      },
      selectDeviceVal (ele) {
        this.deviceName = ele.target.value
        console.log('$$$ NotifySetForm sselectDeviceVa :' + this.deviceName)
        var deviceList = this.$store.getters.bindDeviceList
        console.log('$$$ selectDeviceVal deviceList :' + JSON.stringify(deviceList))
        for (var a = 0; a < deviceList.length; a++) {
          console.log('####  deviceList[' + a + ']: ' + JSON.stringify(deviceList[a]) + 'select name : ' + this.deviceName)
          if (deviceList[a].name === this.deviceName) {
            console.log('$$$$ deviceList[' + a + '].typeName === this.deviceName')
            this.$store.dispatch('setSelectDevice', deviceList[a])
          }
        }
      },
      onAddMode () {
        console.log('Child change to add mode')
        this.$emit('change-mode', true)
      },
      onEditMode () {
        console.log('Child change to edit mode :  false')
        if (this.$store.getters.profileList.length === 0) {
          this.alertMessage = '尚未取得通知設定,無法顯示設定.<br>若是尚未加入,請先新增通知設定.<br>若是已有通知設定,按F5重新整理'
          this.warning()
        } else {
          this.$emit('change-mode', false)
        }
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
      verifyDevice (isNeedCheckName) {
        var isOK = true
        var device = this.$store.getters.selectBindDevice
        if (device) {
          if (isNeedCheckName) {
            if (device.name === null || device.name === undefined || device.name === '') {
              this.alertMessage = '尚未輸入裝置名稱.'
              this.warning()
              isOK = false
            } else {
              var lists = this.$store.getters.bindDeviceList
              console.log('? verifyDevice select name  : ' + device.name)
              for (var i = 0; i < lists.length; i++) {
                console.log('? verifyDevice[ ' + i + '] name  : ' + lists[i].name)
                if (lists[i].name === device.name) {
                  this.alertMessage = '輸入通知設定名稱已存在,請更改名稱.'
                  this.warning()
                  isOK = false
                }
              }
            }
          }
          if (device.macAddr === '') {
            this.alertMessage = '尚未設定裝置識別碼.'
            this.warning()
            isOK = false
          }
          if (device.position.lat === '' || device.position.lng === '') {
            this.alertMessage = '尚未設定座標.'
            this.warning()
            isOK = false
          }
          if (isOK) {
            return device
          } else {
            return null
          }
        } else {
          return null
        }
      }
    }
  }
</script>
<style>
</style>
