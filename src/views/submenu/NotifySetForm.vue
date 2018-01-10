<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-8">
          <h5><i class="fa fa-bell-o"></i>  異常通知設定</h5>
        </div>
        <div class="col-md-4">
          <a v-show="!isAddProfile" @click="onAddMode"><img class="btn-add m-l21"  src="static/img/btn_add_n.png"/></a>
          <a v-show="isAddProfile" @click="onEditMode"><img class="btn-add m-l21"  src="static/img/btn_edit_p.png"/></a>
        </div>
      </div>
    </div>
    <div class="card-block">
      <div>
        <form role="form">
          <div v-if="isAddProfile">
            <div class="form-group">
              <label >
                <h5>新增通知設定名稱</h5>
              </label>
              <input type="text" v-model="selectProfile.name" class="form-control input-lg">
            </div>
          </div>
          <div v-if="!isAddProfile">
            <div class="form-group">
              <label >
                <h5>選擇通知設定</h5>
              </label>
              <select v-model="selectProfile.name" class="form-control" @change="selectProfileVal">
                <option disabled value="">請選擇通知設定</option>
                <option v-for="profile in profileList">{{profile.name}}</option>
              </select>
            </div>
          </div>
          <div v-if="isAddProfile" class="form-group">
            <label >
              <h5>選擇裝置類型</h5>
            </label>
            <select  v-model = "selectTypeName" class="form-control" @change="selectTypeVal">
              <option disabled value="">請選擇裝置</option>
              <option v-for="type in typeList">{{type.typeName}}</option>
            </select>
          </div>
          <button v-show="isAddProfile" type="button" class="btn btn-primary btn-block" @click="onNew">
            <i v-if="isLoading" class='fa fa-spinner fa-spin '></i>
            <h5 v-else>新增</h5>

          </button>
          <div v-show ="!isAddProfile" class="row">
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
  name: 'notify-set-form',
  props: {
    preProfile: String
  },
  computed: {
    ...mapGetters([
      'typeList',
      'selectTypeName',
      'selectProfile',
      'isLoading',
      'isAddProfile',
      'profileList'
    ])
  },
  data () {
    return {
      isShowLoading: false,
      newProfile: '',
      typeName: this.$store.getters.selectTypeName,
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
      var newProfile = this.verifyProfile(true)
      if (newProfile === null) {
        return
      }
      console.log('Child : press new button')
      this.$emit('click-new', newProfile)
    },
    onChange () {
      var newProfile = this.verifyProfile(false)
      if (newProfile === null) {
        return
      }
      console.log('Child : press change button')
      this.$emit('click-change', newProfile)
    },
    onDelete () {
      console.log('Child : press delete button')
      this.$emit('click-delete', this.$store.getters.selectProfile)
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
    },
    selectTypeVal (ele) {
      this.typeName = ele.target.value
      console.log('$$$ NotifySetForm selectTypeVal :' + this.typeName)
      this.$store.dispatch('setSelectTypeName', this.typeName)
      var types = this.$store.getters.typeList
      // console.log('$$$ types :' + JSON.stringify(types))
      for (var a = 0; a < types.length; a++) {
        console.log(
          '####  types[' +
            a +
            ']: ' +
            JSON.stringify(types[a]) +
            'select name : ' +
            this.typeName
        )
        if (types[a].typeName === this.typeName) {
          console.log('$$$$ types[a].typeName === this.typeName')
          this.$store.dispatch('setSelectProfileByType', types[a])
        }
      }
    },
    onAddMode () {
      console.log('Child change to add mode :  true')
      this.$store.dispatch('setIsAddProfile', true)
      this.$emit('change-mode', true)
    },
    onEditMode () {
      console.log('Child change to edit mode :  false')
      if (this.$store.getters.profileList.length === 0) {
        this.alertMessage =
          '尚未取得通知設定,無法顯示設定.<br>若是尚未加入,請先新增通知設定.<br>若是已有通知設定,按F5重新整理'
        this.warning()
      } else {
        this.$store.dispatch('setIsAddProfile', false)
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
    verifyProfile (isNeedCheckName) {
      var profile = this.$store.getters.selectProfile
      if (profile) {
        if (isNeedCheckName) {
          if (
            profile.name === null ||
            profile.name === undefined ||
            profile.name === ''
          ) {
            this.alertMessage = '尚未輸入通知設定名稱.'
            this.warning()
            return null
          } else {
            var lists = this.$store.getters.profileList
            // console.log('? verifyProfile select name  : ' + profile.name)
            for (var i = 0; i < lists.length; i++) {
              // console.log('? verifyProfile [ ' + i + '] name  : ' + lists[i].name)
              if (lists[i].name === profile.name) {
                this.alertMessage = '輸入通知設定名稱已存在,請更改名稱.'
                this.warning()
                return null
              }
            }
          }
        }

        var isSetting = false
        var isError = false
        Object.keys(profile.setting).forEach(function (content) {
          // console.log('profile.setting[ ' + content + '] : ' + JSON.stringify(profile.setting[content]))
          if (
            profile.setting[content]['max'] !== '' &&
            profile.setting[content]['min'] !== ''
          ) {
            if (
              Number(profile.setting[content]['max']) <=
              Number(profile.setting[content]['min'])
            ) {
              isError = true
            }
          }
          if (
            profile.setting[content]['max'] !== '' ||
            profile.setting[content]['min'] !== ''
          ) {
            isSetting = true
          }
        })
        if (isError === true) {
          this.alertMessage = '最大值不得低於或等於最小值.'
          this.warning()
          return null
        } else if (isSetting === false) {
          this.alertMessage = '尚未設定通知內容.'
          this.warning()
          return null
        } else {
          return profile
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
