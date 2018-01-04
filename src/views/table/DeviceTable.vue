<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-8">
          <h5>裝置設定內容 * 修改內容後須按右邊的<i class="fa fa-pencil-square-o "></i>更新按鍵才會儲存 *</h5>

        </div>
      </div>
    </div>
    <div class="card-block">
      <div>
        <table  class="table table-bordered table-hover table-striped">
          <thead>
          <tr class="mytable-title">
            <th width="10%">項目</th>
            <th v-for="title  in titles">{{title}}</th>
            <th width="30%"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(device, index) in deviceList">
            <td>
              {{ index + 1}}
            </td>
            <td>
              <input  name="name" v-model="device.name"  type="text" maxlength="10" size="10" />
            </td>
            <td>
              <input v-if="isAddDevice" name="mac" v-model="device.macAddr" type="text" placeholder="" />
              <span v-else>{{device.macAddr}}</span>
            </td>
            <td>
              <input  name="lat" v-model="device.position.lat"  type="number"  maxlength="7" size="7" />
            </td>
            <td>
              <input name="min" v-model="device.position.lng" type="number"  maxlength="7" size="7"  />
            </td>
            <td>
              <input name="minInfo" v-model="device.profileName" type="text" placeholder="" @click="onMouseClick(index)"/>
            </td>
            <td>
              <button type="button" class="btn btn-primary" @click="editDevice(index)">
                <i class="fa fa-pencil-square-o "></i>
              </button>
              <button type="button" class="btn btn-danger" @click="delDevice(index)">
                <i class="fa fa-times "></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'device-table',
    computed: {
      ...mapGetters([
        'selectBindDevice',
        'isAddDevice',
        'bindDeviceList',
        'selectProfile',
        'isDeviceForm'
      ])
    },
    watch: {
      selectProfile (val) {
        if (this.isDeviceForm === false) {
          console.log('Device table watch select profile : ' + val.name)
          this.deviceList[this.currentDeviceIndex].profileName = val.name
        }
      }
    },
    props: {
      titles: {
        type: Array,
        required: true
      },
      deviceList: {
        type: Array,
        required: true
      },
      selectedProfile: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        isSelectProfile: false,
        currentDeviceIndex: -1
      }
    },
    methods: {
      onMouseClick (index) {
        this.isSelectProfile = true
        this.currentDeviceIndex = index
        console.log('Child click profile select')
        this.$store.dispatch('setIsDeviceForm', false)
        this.$emit('click-profile', this.deviceList[index].profileName)
      },
      editDevice (index) {
        console.log(JSON.stringify(this.deviceList[index]))
        this.$emit('edit-device', this.deviceList[index])
        this.currentDeviceIndex = -1
      },
      delDevice (index) {
        console.log(JSON.stringify(this.deviceList[index]))
        this.$emit('del-device', this.deviceList[index])
        this.currentDeviceIndex = -1
      }
    }
  }
</script>
<style>
  .mytable-title {
    color: #FFFFFF;
    text-decoration: none;
    background-color: #0088d2;
  }
</style>
