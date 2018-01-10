<template>
  <div class="container-giot">
    <div class="row row-giot">
      <div  class="col-md-3">
        <notify-set-form
                         :preProfile="firstProfile"
                         @change-mode="changeMode"
                         @click-new="onAddProfile"
                         @click-change="onUpdateProfile"
                         @click-delete="onDeleteProfile">
        </notify-set-form>
      </div>
      <div class="col-md-9">
        <profile-table :titles="titleData" :isDisable="isDisable"></profile-table>
      </div>
    </div>
    <!------------------------------------ spinner -------------------------------->
    <spinner ref="spinner" size="xl"  text="處理中........."></spinner>
    <!------------------------------------ Delete modal -------------------------------->
    <modal title="Modal title" class="modal-danger" v-model="deleteModal" @ok="deleteModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">刪除異常通知</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要刪除異常通知 [ {{this.profileName}} ]?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="deleteModal = false">離開</button>
        <button type="button" class="btn btn-danger" @click="toDeleteProfile">刪除</button>
      </div>
    </modal>
    <!------------------------------------ Update modal -------------------------------->
    <modal title="Modal title" class="modal-primary" v-model="updateModal" @ok="updateModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">更新異常通知</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要更新異常通知 [ {{this.profileName}} ]?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="updateModal = false">離開</button>
        <button type="button" class="btn btn-primary" @click="toUpdateProfile">更新</button>
      </div>
    </modal>
    <!------------------------------------ Add modal -------------------------------->
    <modal title="Modal title" class="modal-primary" v-model="addModal" @ok="addModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">新增異常通知</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要新增異常通知 [ {{this.profileName}} ]?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="addModal = false">離開</button>
        <button type="button" class="btn btn-primary" @click="toAddProfile">新增</button>
      </div>
    </modal>
  </div>
</template>
<script>

  import NotifySetForm from './submenu/NotifySetForm'
  import ProfileTable from './table/profileTable'
  import {getProfileByType} from '../api/profileSetting'
  import {modal, spinner} from 'vue-strap'
  // import VerifyModal from './modal/VerifyModal'

  export default {
    name: 'profiles',
    components: {
      ProfileTable,
      NotifySetForm,
      modal,
      spinner
    },
    created () {
      this.initData()
    },
    data () {
      return {
        addModal: false,
        updateModal: false,
        deleteModal: false,
        currentProfile: null,
        profileName: '',
        profileCount: 0,
        firstDevice: '請選擇裝置',
        firstProfile: '請選擇通知設定',
        newProfile: {},
        titleData: ['名稱', '最大值', '超過最大值提示', '最小值', '低於最小值提示'],
        isDisable: false
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
            this.profileCount = response.data.length
            console.log('$ getProfiles : ' + this.profileCount)
          }).catch(function (error) {
            console.log('?????? getDeviceTypes  error :' + error)
          })
        } else {
          this.profileCount = profileList.length
          console.log('$ profiles : ' + this.profileCount)
        }
        if (typeList.length === 0) {
          this.$store.dispatch('getDeviceType').then(response => {
            var types = response.data
            // console.log('$ get device types : ' + JSON.stringify(types))
            this.newProfile = getProfileByType(types[0])
            // this.$store.dispatch('setCleanProfile', this.newProfile)
            this.setCurrentStatus(true)
          }).catch(function (error) {
            console.log('?????? getDeviceTypes  error :' + error)
          })
        } else {
          this.newProfile = getProfileByType(this.$store.getters.selectType)
          // this.$store.dispatch('setCleanProfile', this.newProfile)
          this.setCurrentStatus(true)
        }
        console.log(' deviceList : ' + JSON.stringify(deviceList))
        if (deviceList.length === 0) {
          this.$store.dispatch('getBindDeviceList').then(response => {
            console.log('$ deviceList is empty getBindDeviceList : ' + JSON.stringify(response.data.length))
          }).catch(function (error) {
            console.log('? getBindDeviceList  error :' + error)
          })
        }
      },
      onAddProfile (profile) {
        this.currentProfile = profile
        this.profileName = profile.name
        this.addModal = true
      },
      toAddProfile () {
        // Add profile to global profile list
        this.addModal = false
        this.$refs.spinner.show()
        this.$store.dispatch('addProfile', this.currentProfile).then(response => {
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
          this.$refs.spinner.hide()
        })
      },
      onUpdateProfile (profile) {
        this.currentProfile = profile
        this.profileName = profile.name
        this.updateModal = true
      },
      toUpdateProfile () {
        this.updateModal = false
        this.$refs.spinner.show()
        console.log('Parent : press update button  profile  : ' + JSON.stringify(this.currentProfile))
        // Add profile to global profile list
        this.$store.dispatch('updateProfile', this.currentProfile).then(response => {
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
          this.$refs.spinner.hide()
        })
      },
      onDeleteProfile (profile) {
        this.currentProfile = profile
        this.profileName = profile.name
        this.deleteModal = true
      },
      toDeleteProfile () {
        this.deleteModal = false
        this.$refs.spinner.show()
        console.log('Parent : press update button  profile  name: ' + this.currentProfile.name)
        // Delete profile to global profile list
        this.$store.dispatch('deleteProfile', this.currentProfile.name).then(response => {
          console.log('$ onDeleteProfile : ' + JSON.stringify(response.data))
          this.setCurrentStatus(false)
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onDeleteProfile  error :' + error)
          this.$refs.spinner.hide()
        })
      },
      changeMode (val) {
        if (val) {
          // Add mode
          this.$store.dispatch('setSelectProfile', this.newProfile)
        } else {
          // Edit mode
          var profiles = this.$store.getters.profileList
          this.$store.dispatch('setSelectProfile', profiles[0])
        }
      },
      setCurrentStatus (isInit) {
        var profiles = this.$store.getters.profileList
        // For init setting
        if (isInit === true) {
          console.log('# setCurrentStatus  isInit : true , profiles.length : ' + profiles.length)
          if (profiles.length > 0) {
            this.$store.dispatch('setSelectProfile', profiles[0])
            this.$store.dispatch('setIsAddProfile', false) // Edit mode
          } else if (profiles.length === 0) {
            this.$store.dispatch('setSelectProfile', this.newProfile)
            this.$store.dispatch('setIsAddProfile', true) // Add mode
          }
        } else {
          // For process add, delete and update profile
          // if is add or update keep select profile setting
          console.log('# setCurrentStatus  isInit : false , profiles.length : ' + profiles.length)
          if (this.profileCount > profiles.length) {
            // Delete profile setting
            console.log('# setCurrentStatus : Delete profile setting ')
            if (profiles.length > 0) {
              this.$store.dispatch('setSelectProfile', profiles[0])
              this.$store.dispatch('setIsAddProfile', false) // Edit mode
            } else {
              this.$store.dispatch('setSelectProfile', this.newProfile)
              this.$store.dispatch('setIsAddProfile', true) // Add mode
            }
          } else {
            // Add or update profile setting
            console.log('# setCurrentStatus : Add or update profile setting ')
            this.$store.dispatch('setIsAddProfile', false) // Edit mode
          }
        }
        this.profileCount = profiles.length // Reset profile count
      }
    }
  }
</script>
