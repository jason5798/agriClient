<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col-md-8">
          <h5>異常通知設定內容</h5>
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
            <tr v-for="item in selectProfile.setting">
              <td>{{item.name}}</td>
              <td>
                <span v-if="isDisable">{{item.max}}</span>
                <input v-else name="max" v-model="item.max" type="number" placeholder=""/>
              </td>
              <td>
                <span v-if="isDisable">{{item.maxInfo}}</span>
                <input v-else name="maxInfo" v-model="item.maxInfo"  type="text" placeholder="" />
              </td>
              <td>
                <span v-if="isDisable">{{item.min}}</span>
                <input v-else name="min" v-model="item.min" type="number" placeholder="" />
              </td>
              <td>
                <span v-if="isDisable">{{item.minInfo}}</span>
                <input v-else name="minInfo" v-model="item.minInfo" type="textr" placeholder="" />
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
    name: 'profile-table',
    computed: {
      ...mapGetters([
        'selectProfile'
      ])
    },
    props: {
      titles: {
        type: Array,
        required: true
      },
      isDisable: {
        type: Boolean,
        required: true,
        default: false
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
