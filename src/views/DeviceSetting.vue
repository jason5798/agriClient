<template>
  <div class="container-giot">
    <div class="row row-giot">
      <div  class="col-md-3">
        <device-set-form
          :preProfile="firstProfile"
          @change-mode="changeMode"
          @click-new="onAddDevice"
          @click-change="onUpdateDevice"
          @click-delete="onDeleteDevice">
        </device-set-form>
      </div>
      <div class="col-md-9">
        <device-table :titles="deviceTitleData" @click-profile="onClickProfile"></device-table>
        <button v-if="isShowProfile" type="button" class="btn" @click="onChange(false)">
          隱藏異常通知內容
        </button>
        <button v-else type="button" class="btn btn-info" @click="onChange(true)">
          顯示異常通知內容
        </button>
        <br>
        <br>
        <profile-table v-show="isShowProfile" :isDisable="isDisableEdit" :titles="titleData"></profile-table>
      </div>
    </div>
    <modal title="Modal title" class="modal-primary" v-model="myModal" @ok="myModal = false" effect="fade/zoom" width="20%">
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
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="myModal = false">離開</button>
      </div>
    </modal>
  </div>
</template>
<script>

  import DeviceSetForm from './submenu/DeviceSetForm'
  import ProfileTable from './table/profileTable'
  import DeviceTable from './table/DeviceTable'
  import modal from 'vue-strap/src/Modal'
  import { mapGetters } from 'vuex'
  import {getProfileByType} from '../api/profileSetting'

  export default {
    name: 'profiles',
    components: {
      ProfileTable,
      DeviceTable,
      DeviceSetForm,
      modal
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
        test: true,
        isDisableEdit: true,
        isShowProfile: false,
        deviceCount: 0,
        firstDevice: '請選擇裝置',
        firstProfile: '請選擇通知設定',
        newProfile: {},
        newDevice: {
          'name': '',
          'macAddr': '',
          profileName: '',
          'position': {
            'lat': '',
            'lng': ''
          }},
        titleData: ['名稱', '最大值', '超過最大值提示', '最小值', '低於最小值提示'],
        deviceTitleData: ['裝置識別碼', '座標緯度', '座標經度', '異常通知名稱']
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
      onClickProfile () {
        this.myModal = true
      },
      onChange (isShow) {
        this.isShowProfile = isShow
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
        // Add profile to global profile list
        device = this.devicetransfer(device)
        console.log('$ onAddDevicedevice lat type : ' + typeof device.lat)
        console.log('$ onAddDevice device : ' + JSON.stringify(device))
        this.$store.dispatch('addBindDevice', device).then(response => {
          console.log('$ onAddDevice : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
        }).catch(function (error) {
          console.log('? onAddDevice  error :' + error)
        })
      },
      onUpdateDevice (device) {
        device = this.devicetransfer(device)
        console.log('$ onAddDevicedevice lat type : ' + typeof device.lat)
        console.log('Parent : press update button  device  : ' + JSON.stringify(device))
        // Update device to global bind device list
        this.$store.dispatch('updateBindDevice', device).then(response => {
          console.log('$ onUpdateDevice : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
        }).catch(function (error) {
          console.log('? onUpdateDevice  error :' + error)
        })
      },
      onDeleteDevice (device) {
        console.log('Parent : press update button  profile  name: ' + device.name)
        // Delete profile to global profile list
        this.$store.dispatch('deleteBindDevice', device.name).then(response => {
          console.log('$ onDeleteDevice : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
        }).catch(function (error) {
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
        var deviceList = this.$store.getters.bindDeviceList
        // For init setting
        if (isInit === true) {
          console.log('# setCurrentStatus  isInit : true , profiles.length : ' + profiles.length)
          if (deviceList.length > 0) {
            this.$store.dispatch('setSelectDevice', deviceList[0])
            this.$store.dispatch('setIsAddDevice', false) // Edit mode
          } else if (profiles.length === 0) {
            this.$store.dispatch('setSelectDevice', this.newDevice)
            this.$store.dispatch('setIsAddDevice', true) // Add mode
          }
          var name = deviceList[0]['profileName']
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
          if (this.deviceCount > deviceList.length) {
            // Delete device setting
            console.log('# setCurrentStatus : Delete device setting ')
            if (deviceList.length > 0) {
              this.$store.dispatch('setSelectDevice', deviceList[0])
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
        this.deviceCount = deviceList.length // Reset profile count
      }
    }
  }
</script>
