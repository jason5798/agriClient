<template>
  <div class="container-giot">
    <div class="row row-giot">
      <div  class="col-md-3">
        <div class="card">
          <div class="card-header">
            <div class="row">
              <div class="col-md-12">
                <h5><i class="fa fa-pencil-square-o"></i>設定搜尋資料</h5>
              </div>
            </div>
          </div>
          <div class="card-block">
            <div>
              <form role="form">
                <div class="form-group">
                  <label for="exampleInputEmail1">
                    <h5>開始日期</h5>
                  </label>
                  <DatePicker type="date" placeholder="選擇開始日期時間" format="yyyy-MM-dd HH:mm" :value="info.from" @on-change="fromChange" style="width: 100%"></DatePicker>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">
                    <h5>結束日期</h5>
                  </label>
                  <DatePicker type="date" placeholder="選擇結束日期時間" format="yyyy-MM-dd HH:mm" :value="info.to" @on-change="toChange" style="width: 100%"></DatePicker>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">
                    <h5>選擇裝置</h5>
                  </label>
                  <select v-model="info.name" class="form-control" @change="selectDeviceOption">
                    <option disabled value="">請選擇裝置</option>
                    <option value="">不指定</option>
                    <option v-for="device in bindDeviceList">{{device.name}}</option>
                  </select>
                </div>
                <button type="button" class="btn btn-primary btn-block" @click="toLoadData">
                  <i v-show="isShowLoading" class='fa fa-spinner fa-spin '></i><h5>查詢</h5>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="card">
          <div class="card-header">

            <div class="row">
              <div class="col-md-4">
                <div class="row">
                  <div class="col-md-8">
                    <h5>異常通知記錄</h5>
                  </div>
                  <div class="col-md-4">
                    <tooltip effect="scale" placement="bottom" content="更新">
                      <button type="button" class="btn btn-info"  @click="toRefresh">
                        <i v-show="isOverLoading" class='fa fa-spinner fa-spin '></i>
                        <i v-show="!isOverLoading" class="fa fa-refresh"></i>
                      </button>
                    </tooltip>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="row">
                  <!--<div class="col-md-4">裝置 :{{info.name}}</div>-->
                  <div class="col-md-4">開始日期 :{{info.from}}</div>
                  <div class="col-md-4">結束日期 :{{info.to}}</div>
                </div>
              </div>

            </div>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-md-12">
                <div style="width:100%; height:1200px;">
                  <my-vuetable
                    :api-url="api_url"
                    :fields="fields"
                    :sort-order="sortOrder"
                    :append-params="moreParams"
                    detail-row-component="my-detail-row"
                    @close-loded="closeLoading"
                    ref="tablechild"
                  ></my-vuetable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FieldDefs from './table/FieldDefs2.js'
  import MyVuetable from './table/MyVuetable'
  import {getDateToString} from '../utils/dateTools'
  // Get API url
  const url3 = process.env.BASE_API + 'todos/log/event'
  // console.log('url3 ' + url3)
  var layout = {
    'title': '溫度',
    'xaxis': {
      color: '#06f',
      type: 'date',
      'tickprefix': '',
      'showtickprefix': 'first',
      'ticksuffix': ' ',
      'showticksuffix': 'last',
      'separatethousands': true
    },
    'yaxis': {
      'type': 'log'
    },
    width: 850
  }
  var layout2 = JSON.parse(JSON.stringify(layout))
  layout2.title = '酸鹼度'
  var layout3 = JSON.parse(JSON.stringify(layout))
  layout3.title = '水含量'
  var layout4 = JSON.parse(JSON.stringify(layout))
  layout4.title = '電導度'

  export default {

    name: 'event-log',
    components: {
      MyVuetable
    },
    computed: {
      ...mapGetters([
        'bindDeviceList'
      ])
    },
    mounted () {
      this.initDate()
    },
    data () {
      return {
        maclist: [],
        isShowLoading: false,
        rows: [],
        type: 'scatter',
        isAlert: false,
        isShowSearch: true,
        isOverLoading: false,
        bar_show: false,
        plotdata: [],
        isPlotExist: false,
        layout1: layout,
        api_url: url3,
        fields: FieldDefs,
        info: {
          name: '',
          mac: '',
          from: '',
          to: ''
        },
        sortOrder: [
          {
            field: 'date',
            sortField: 'date',
            direction: 'desc'
          }
        ],
        moreParams: {},
        items: [],
        obj: '',
        alertTitle: '警告!',
        alertMessage: '尚未選擇裝置,無法查詢或更新.'
      }
    },
    methods: {
      initDate () {
        // Verify bind device list
        this.$events.fire('testEvent', 'clear event log')
        var deviceList = this.$store.getters.bindDeviceList
        if (deviceList.length === 0) {
          this.$store.dispatch('getBindDeviceList').then(response => {
            console.log('$ deviceList is empty getBindDeviceList : ' + JSON.stringify(response.data.length))
          }).catch(function (error) {
            console.log('? getBindDeviceList  error :' + error)
          })
        }
        // Set default search date
        let now = new Date()
        let lastDay = new Date()
        lastDay.setDate(lastDay.getDate() - 1)
        this.info.to = getDateToString(now, 0)
        this.info.from = getDateToString(lastDay, 0)
        // console.log(typeof this.info.from + ' : ' + this.info.from)
        // console.log(typeof this.info.to + ' : ' + this.info.to)
      },
      selectDeviceOption (ele) {
        var name = ele.target.value
        console.log('$ Find sselectDeviceVal :' + name)
        var deviceList = this.$store.getters.bindDeviceList
        console.log('$$$ selectDeviceVal deviceList :' + JSON.stringify(deviceList))
        var index = -1
        for (var a = 0; a < deviceList.length; a++) {
          console.log('####  deviceList[' + a + ']: ' + JSON.stringify(deviceList[a]) + 'select name : ' + name)
          if (deviceList[a].name === name) {
            console.log('$$$$ deviceList[' + a + '].typeName === this.deviceName')
            index = a
          }
        }
        if (index !== -1) {
          this.info.mac = deviceList[index].macAddr
        } else {
          this.info.mac = ''
        }
        console.log('$ Current info :' + JSON.stringify(this.info))
      },
      toLoadData () {
        this.isShowLoading = true
        console.log('toLoadData info : ' + JSON.stringify(this.info))
        this.$refs.tablechild.onChangeOption(this.info)
      },
      closeLoading () {
        this.isShowLoading = false
        this.isOverLoading = false
        console.log('parent closed-loading')
      },
      toRefresh () {
        this.isOverLoading = true
        console.log('toRefresh info : ' + JSON.stringify(this.info))
        this.$refs.tablechild.onChangeOption(this.info)
      },
      fromChange (date) {
        this.info.from = date
      },
      toChange (date) {
        var now = new Date()
        var mdate = new Date(date)
        var nowString = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        var mdateString = mdate.getFullYear() + '-' + (mdate.getMonth() + 1) + '-' + mdate.getDate()
        if (nowString === mdateString) {
          mdateString = getDateToString(now, 0)
        } else {
          mdateString = getDateToString(mdate, 2)
        }

        // alert(mdateString)
        this.info.to = mdateString
      },
      warning () {
        this.$Notice.config({
          top: 100,
          duration: 3
        })
        this.$Notice.warning({
          title: this.alertTitle,
          desc: this.alertMessage
        })
      },
      /* getDateString(
        *  flag 0: current time
        *  flag 1: start time example 00:00
        *  flag 2: end time example 23:59
        * */
      getDateToString (date, flag) {
        var M = date.getMonth() + 1
        var d = date.getDate()
        if (M < 10) {
          M = '0' + M
        }
        if (d < 10) {
          d = '0' + d
        }
        if (flag === 0) {
          var h = date.getHours()
          var m = date.getMinutes()

          if (m < 10) {
            m = '0' + m
          }
          if (h < 10) {
            h = '0' + h
          }
          return date.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m
        } else if (flag === 1) {
          return date.getFullYear() + '-' + M + '-' + d + ' 00:00'
        } else if (flag === 2) {
          return date.getFullYear() + '-' + M + '-' + d + ' 23:59'
        }
      }
    }
  }
</script>
<style>

</style>
