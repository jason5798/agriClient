<template>
  <div class="container-giot">
    <div class="row row-giot">
      <div  class="col-md-3">
        <device-set-form
          :preProfile="firstProfile"
          @click-profile="onClickProfile"
          @change-mode="changeMode"
          @click-new="onAddDevice">
        </device-set-form>
      </div>
      <div class="col-md-9">
        <device-table :titles="deviceTitleData"
                      :deviceList="devices"
                      @click-profile="onClickProfile"
                      @edit-device="onUpdateDevice"
                      @del-device="onDeleteDevice">
        </device-table>
      </div>
    </div>
    <spinner ref="spinner" size="xl" text="處理中........."></spinner>
    <modal title="Modal title" large class="{'modal-danger':effect === 'fade','modal-lg':large,'modal-sm':small}" v-model="myModal" @ok="myModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">異常通知設定選擇</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>選擇異常通知設定</h5>
        </label>
        <select v-model="selectProfile.name" class="form-control" @change="selectProfileOption">
          <option disabled value="">請選擇通知設定</option>
          <option value="">不指定</option>
          <option v-for="profile in profileList">{{profile.name}}</option>
        </select>
        <br>
        <hr>
        <profile-table :isDisable="isDisableEdit" :titles="titleData"></profile-table>
      </div>

      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="myModal = false">離開</button>
      </div>
    </modal>
    <!------------------------------------ Delete modal -------------------------------->
    <modal title="Modal title" class="modal-danger" v-model="deleteModal" @ok="deleteModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">刪除綁定裝置</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要刪除綁定裝置?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="deleteModal = false">離開</button>
        <button type="button" class="btn btn-danger" @click="toDeleteDevice">刪除</button>
      </div>
    </modal>
    <!------------------------------------ Update modal -------------------------------->
    <modal title="Modal title" class="modal-primary" v-model="updateModal" @ok="updateModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">更新裝置設定</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要更新裝置設定?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="updateModal = false">離開</button>
        <button type="button" class="btn btn-primary" @click="toUpdateDevice">更新</button>
      </div>
    </modal>
    <!------------------------------------ Add modal -------------------------------->
    <modal title="Modal title" class="modal-primary" v-model="addModal" @ok="addModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">新增綁定裝置</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要新增綁定裝置?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="addModal = false">離開</button>
        <button type="button" class="btn btn-primary" @click="toAddDevice">新增</button>
      </div>
    </modal>
  </div>
</template>
<script>
  import DeviceSetForm from './submenu/DeviceSetForm'
  import ProfileTable from './table/profileTable'
  import DeviceTable from './table/DeviceTable'
  import {modal, spinner} from 'vue-strap'
  import { mapGetters } from 'vuex'
  import {getProfileByType} from '../api/profileSetting'

  export default {
    name: 'profiles',
    components: {
      ProfileTable,
      DeviceTable,
      DeviceSetForm,
      modal,
      spinner
    },
    created () {
      this.initData()
    },
    computed: {
      ...mapGetters([
        'selectProfile',
        'profileList'
      ])
    },
    data () {
      return {
        myModal: false,
        addModal: false,
        updateModal: false,
        deleteModal: false,
        processDevice: null,
        test: true,
        isDisableEdit: true,
        deviceCount: 0,
        firstDevice: '請選擇裝置',
        firstProfile: '請選擇通知設定',
        newProfile: {},
        devices: [],
        newDevice: {
          'name': '',
          'macAddr': '',
          profileName: '',
          'position': {
            'lat': '',
            'lng': ''
          }},
        titleData: ['名稱', '最大值', '超過最大值提示', '最小值', '低於最小值提示'],
        deviceTitleData: ['裝置名稱', '裝置識別碼', '座標緯度', '座標經度', '異常通知名稱']
      }
    },
    methods: {
      initData () {
        var typeList = this.$store.getters.typeList
        var deviceList = this.$store.getters.bindDeviceList
        var profileList = this.$store.getters.profileList
        console.log('profile page typeList :  ' + JSON.stringify(typeList))
        console.log('profile page profileList :  ' + JSON.stringify(profileList))
        console.log('profile page deviceList :  ' + JSON.stringify(deviceList))
        if (profileList.length === 0) {
          console.log('? profileList is empty to getProfiles ')
          this.$store.dispatch('getProfiles').then(response => {
            console.log('$ getProfiles : ' + response.data.length)
          }).catch(function (error) {
            console.log('?  getProfiles  error :' + error)
          })
        } else {
          console.log('$ profiles : ' + profileList.length)
        }
        // Jason mark : get type for empty profile
        if (typeList.length === 0) {
          this.$store.dispatch('getDeviceType').then(response => {
            var types = response.data
            // console.log('$ get device types : ' + JSON.stringify(types))
            this.newProfile = getProfileByType(types[0])
          }).catch(function (error) {
            console.log('?????? getDeviceTypes  error :' + error)
          })
        } else {
          this.newProfile = getProfileByType(typeList[0])
        }
        console.log(' deviceList : ' + JSON.stringify(deviceList))
        if (deviceList.length === 0) {
          this.$store.dispatch('getBindDeviceList').then(response => {
            console.log('$ deviceList is empty reload =>  getBindDeviceList : ' + JSON.stringify(response.data.length))
            this.setCurrentStatus(true)
          }).catch(function (error) {
            console.log('? getBindDeviceList  error :' + error)
          })
        } else {
          this.setCurrentStatus(true)
        }
      },
      selectProfileOption (ele) {
        var name = ele.target.value
        console.log('child select profile name: ' + JSON.stringify(name))
        if (name === '') {
          this.$store.dispatch('setSelectProfile', this.newProfile)
        } else {
          var profileList = this.$store.getters.profileList
          for (var b = 0; b < profileList.length; b++) {
            console.log('$ DeviceSetting profileList[' + b + '][\'name\']r :' + profileList[b]['name'])
            if (profileList[b]['name'] === name) {
              this.$store.dispatch('setSelectProfile', profileList[b])
            }
          }
        }

        var device = this.$store.getters.selectBindDevice
        device.profileName = name
        this.$store.dispatch('setSelectDevice', device)
      },
      onClickProfile (index) {
        console.log('onClickProfile : ' + index)
        this.myModal = true
      },
      onChange (isShow) {
        // this.isShowProfile = isShow
      },
      devicetransfer (device) {
        if (device.macAddr.length === 8) {
          device.macAddr = '00000000' + device.macAddr
        }
        device.position.lat = Number(device.position.lat)
        device.position.lng = Number(device.position.lng)
        return device
      },
      onAddDevice (device) {
        this.processDevice = device
        this.addModal = true
      },
      toAddDevice () {
        this.addModal = false
        var device = this.processDevice
        this.$refs.spinner.show()
        // Add profile to global profile list
        device = this.devicetransfer(device)
        console.log('$ onAddDevicedevice lat type : ' + typeof device.lat)
        console.log('$ onAddDevice device : ' + JSON.stringify(device))
        this.$store.dispatch('addBindDevice', device).then(response => {
          console.log('$ onAddDevice : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onAddDevice  error :' + error)
          this.$refs.spinner.hide()
        })
      },
      onUpdateDevice (device) {
        this.processDevice = device
        this.updateModal = true
      },
      toUpdateDevice () {
        this.$refs.spinner.show()
        this.updateModal = false
        var device = this.processDevice
        device = this.devicetransfer(device)
        console.log('$ onAddDevicedevice lat type : ' + typeof device.lat)
        console.log('Parent : press update button  device  : ' + JSON.stringify(device))
        // Update device to global bind device list
        this.$store.dispatch('updateBindDevice', device).then(response => {
          console.log('$ onUpdateDevice : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
          this.$refs.spinner.hide()
        }).catch(function (error) {
          this.$refs.spinner.hide()
          console.log('? onUpdateDevice  error :' + error)
        })
      },
      onDeleteDevice (device) {
        this.processDevice = device
        this.deleteModal = true
      },
      toDeleteDevice () {
        this.$refs.spinner.show()
        this.deleteModal = false
        var device = this.processDevice
        console.log('Parent : press update button  profile  name: ' + device.name)
        // Delete profile to global profile list
        this.$store.dispatch('deleteBindDevice', device.name).then(response => {
          console.log('$ onDeleteDevice : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
          this.$refs.spinner.hide()
        }).catch(function (error) {
          this.$refs.spinner.hide()
          console.log('? onDeleteDevice  error :' + error)
        })
      },
      hideProfile (val) {
        if (val) {
          // Hide profile setting content
        } else {
          // Show profile setting content
        }
      },
      changeMode (val) {
        console.log('Parent change mode : ' + val)
        this.$store.dispatch('setIsAddDevice', val)
        if (val) {
          // Add mode for device
          this.$store.dispatch('setSelectDevice', this.newDevice)
        } else {
          // Edit mode
          var bindList = this.$store.getters.bindDeviceList
          this.$store.dispatch('setSelectDevice', bindList[0])
        }
      },
      setCurrentStatus (isInit) {
        var profiles = this.$store.getters.profileList
        this.devices = this.$store.getters.bindDeviceList
        // For init setting
        if (isInit === true) {
          console.log('# setCurrentStatus  isInit : true , profiles.length : ' + profiles.length)
          if (this.devices.length > 0) {
            this.$store.dispatch('setSelectDevice', this.devices[0])
            this.$store.dispatch('setIsAddDevice', false) // Edit mode
          } else if (profiles.length === 0) {
            this.$store.dispatch('setSelectDevice', this.newDevice)
            this.$store.dispatch('setIsAddDevice', true) // Add mode
          }
          var name = this.devices[0]['profileName']
          console.log('***** There are profile name : ' + name)
          if (profiles.length > 0 && name !== '') {
            for (var b = 0; b < profiles.length; b++) {
              if (profiles[b]['name'] === name) {
                this.$store.dispatch('setSelectProfile', profiles[b])
              }
            }
          }
        } else {
          // For process add, delete and update profile
          // if is add or update keep select profile setting
          console.log('# setCurrentStatus  isInit : false , profiles.length : ' + profiles.length)
          if (this.deviceCount > this.devices.length) {
            // Delete device setting
            console.log('# setCurrentStatus : Delete device setting ')
            if (this.devices.length > 0) {
              this.$store.dispatch('setSelectDevice', this.devices[0])
              this.$store.dispatch('setIsAddDevice', false) // Edit mode
            } else {
              this.$store.dispatch('setSelectDevice', this.newDevice)
              this.$store.dispatch('setIsAddDevice', true) // Add mode
            }
          } else {
            // Add or update profile setting
            console.log('# setCurrentStatus : Add or update device setting ')
            this.$store.dispatch('setIsAddDevice', false) // Edit mode
          }
        }
        this.deviceCount = this.devices.length // Reset profile count
      }
    }
  }
</script>
