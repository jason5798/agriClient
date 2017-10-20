<template>
  <div class="container-giot">
    <div class="row row-giot">
      <div  class="col-md-3">
        <notify-set-form
                         :preProfile="firstProfile"
                         @change-mode="changeMode"
                         @reduce-profile="onWatchProfile"
                         @click-new="onAddProfile"
                         @click-change="onUpdateProfile"
                         @click-delete="onDeleteProfile">
        </notify-set-form>
      </div>
      <div class="col-md-9">
        <profile-table :titles="titleData"></profile-table>
      </div>
    </div>
  </div>
</template>
<script>

  import NotifySetForm from './submenu/NotifySetForm'
  import ProfileTable from './table/profileTable'
  import {getProfileByType} from '../api/profileSetting'

  export default {
    name: 'profiles',
    components: {
      ProfileTable,
      NotifySetForm
    },
    mounted () {
      this.initData()
    },
    data () {
      return {
        firstDevice: '請選擇裝置',
        firstProfile: '請選擇通知設定',
        newProfile: {},
        titleData: ['名稱', '最大值', '最大值提示', '最小值', '最小值提示']
      }
    },
    methods: {
      initData: function () {
        var typeList = this.$store.getters.typeList
        var deviceList = this.$store.getters.deviceList
        var profileList = this.$store.getters.profileList
        console.log('profile page typeList :  ' + JSON.stringify(typeList))
        console.log('profile page profileList :  ' + JSON.stringify(profileList))
        console.log('profile page deviceList :  ' + JSON.stringify(deviceList))
        if (profileList.length === 0) {
          console.log('? profileList is empty to getProfiles ')
          this.$store.dispatch('getProfiles')
        }
        if (typeList.length === 0) {
          this.$store.dispatch('getDeviceType').then(response => {
            var types = response.data
            console.log('$ get device types : ' + JSON.stringify(types))
            this.newProfile = getProfileByType(types[0])
            this.$store.dispatch('setSelectProfile', this.newProfile)
          }).catch(function (error) {
            console.log('?????? getDeviceTypes  error :' + error)
          })
        } else {
          this.newProfile = getProfileByType(this.$store.getters.selectType)
          this.$store.dispatch('setSelectProfile', this.newProfile)
        }
        console.log(' deviceList : ' + JSON.stringify(deviceList))
        if (deviceList.length === 0) {
          this.$store.dispatch('getDeviceList').then(response => {
            console.log('$ deviceList is empty getDeviceList : ' + JSON.stringify(response.data.length))
          }).catch(function (error) {
            console.log('? getDeviceList  error :' + error)
          })
        }
      },
      onAddProfile (profile) {
        console.log('Parent : press update button  profile  : ' + profile.name)
        console.log('Empty  profile  : ' + JSON.stringify(this.newProfile))
        // Clean profile
        this.$store.dispatch('setSelectProfile', this.newProfile)
        // Add profile to global profile list
        this.$store.dispatch('addProfile', profile).then(response => {
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
        })
      },
      onUpdateProfile (profile) {
        console.log('Parent : press update button  profile  : ' + JSON.stringify(profile))
        // Add profile to global profile list
        this.$store.dispatch('updateProfile', profile).then(response => {
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
        })
      },
      onDeleteProfile (profile) {
        console.log('Parent : press update button  profile  name: ' + profile.name)
        // Delete profile to global profile list
        this.$store.dispatch('deleteProfile', profile.name).then(response => {
          console.log('$ onDeleteProfile : ' + JSON.stringify(response.data))
        }).catch(function (error) {
          console.log('? onDeleteProfile  error :' + error)
        })
      },
      /* Jason add for fix remove profile issue
       * 1.Older setting still exist issue
       * 2.Select profile name is empty
       * Function : Set select profile to profileList[0]
       */
      onWatchProfile () {
        console.log('* Parent  reduce-profile')
        if (this.$store.getters.profileList.length > 0) {
          this.$store.dispatch('setSelectProfile', this.$store.getters.profileList[0])
        }
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
      }
    }
  }
</script>
