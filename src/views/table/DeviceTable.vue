<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-8">
          <h5>裝置設定內容</h5>
        </div>
      </div>
    </div>
    <div class="card-block">
      <div>
        <table  class="table table-bordered table-hover table-striped">
          <thead>
          <tr class="mytable-title">
            <th v-for="title  in titles">{{title}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="selectBindDevice.position !== undefined">
            <td>
              <input v-if="isAddDevice" name="mac" v-model="selectBindDevice.macAddr" type="text" placeholder="" />
              <span v-else>{{selectBindDevice.macAddr}}</span>
            </td>
            <td>
              <input  name="lat" v-model="selectBindDevice.position.lat"  type="number" placeholder="" />
            </td>
            <td>
              <input name="min" v-model="selectBindDevice.position.lng" type="number" placeholder="" />
            </td>
            <td>
              <input name="minInfo" v-model="selectBindDevice.profileName" type="text" placeholder="" @click="onMouseClick"/>
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
        'isAddDevice'
      ])
    },
    props: {
      titles: {
        type: Array,
        required: true
      }
    },
    methods: {
      onMouseClick () {
        console.log('Child click profile select')
        this.$emit('click-profile')
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
