<template>
  <div class="container-giot">
    <div class="row row-giot">
      <div v-show="isShowSearch" class="col-md-3">
        <div class="card">
          <div class="card-header">
            <div class="row">
              <div class="col-md-8">
                <h5><i class="fa fa-pencil-square-o"></i>設定搜尋資料</h5>
              </div>
              <div class="col-md-4">
                <button type="button" class="close" aria-label="Close" @click="hideSearch">
                  <span aria-hidden="true">&times;</span>
                </button>
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
                  <!--<datepicker :value.sync="info.from" :format="format"></datepicker>-->
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">
                    <h5>結束日期</h5>
                  </label>
                  <DatePicker type="datetime" placeholder="選擇結束日期時間" format="yyyy-MM-dd HH:mm" :value="info.to" @on-change="toChange" style="width: 100%"></DatePicker>
                  <!--<datepicker :value.sync="info.to" :format="format"></datepicker>-->
                </div>

                <div class="form-group">
                  <label for="exampleInputEmail1">
                    <h5>選擇裝置</h5>
                  </label>
                  <select v-model="info.name" class="form-control" @change="selectDeviceOption">
                    <option disabled value="">請選擇裝置</option>
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
      <div :class="{'col-md-12': !isShowSearch, 'col-md-9': isShowSearch}">
        <div class="card">
          <div class="card-header">

            <div class="row">
              <div class="col-md-4">
                <tooltip effect="scale" placement="bottom" content="折線圖">
                  <button type="button" class="btn btn-success" @click="showChart">
                    <i class="fa fa-line-chart"></i>
                  </button>
                </tooltip>
                <tooltip effect="scale" placement="bottom" content="資料表">
                  <button type="button" class="btn btn-success" @click="showTable">
                    <i class="fa fa-table"></i>
                  </button>
                </tooltip>
                <tooltip effect="scale" placement="bottom" content="匯出CSV">
                  <button type="button" class="btn btn-success"  @click="csvExport">
                    <i class="fa fa-cloud-download"></i>
                  </button>
                </tooltip>
                <tooltip v-show="!isShowSearch" effect="scale" placement="bottom" content="顯示搜尋設定">
                  <button  type="button" class="btn btn-warning"  @click="showSearch">
                    <i class="fa fa-pencil-square-o"></i>
                  </button>
                </tooltip>
                <tooltip effect="scale" placement="bottom" content="更新">
                  <button type="button" class="btn btn-info"  @click="toRefresh">
                    <i v-show="isOverLoading" class='fa fa-spinner fa-spin '></i>
                    <i v-show="!isOverLoading" class="fa fa-refresh"></i>
                  </button>
                </tooltip>
              </div>
              <div class="col-md-8">
                <div class="row">
                  <div class="col-md-4">裝置 :{{info.name}}</div>
                  <div class="col-md-4">開始日期 :{{info.from}}</div>
                  <div class="col-md-4">結束日期 :{{info.to}}</div>
                </div>
              </div>

            </div>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-md-12">
                <div style="width:100%; height:auto;">
                  <div v-show="!isShowLine">
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
                  <div v-show="isShowLine" class="tile is-ancestor" >
                    <!--<div ref="temp"  style="width:100%; height:300px;"></div>
                    <div ref="ph"  style="width:100%; height:300px;"></div>
                    <div ref="water"  style="width:100%; height:300px;"></div>
                    <div ref="ec"  style="width:100%; height:300px;"></div>-->
                    <div class="row">
                      <div class="col-sm-5">
                        <h4 class="card-title mb-0 text-center">溫度</h4>
                      </div><!--/.col-->
                      <div class="col-sm-7 hidden-sm-down">
                        <!--<button type="button" class="btn btn-primary float-right"><i class="icon-cloud-download"></i></button>
                        <div class="btn-toolbar float-right" role="toolbar" aria-label="Toolbar with button groups">
                          <div class="btn-group mr-3" data-toggle="buttons" aria-label="First group">
                            <label class="btn btn-outline-secondary">
                              <input type="radio" name="options" id="option1"> Day
                            </label>
                            <label class="btn btn-outline-secondary active">
                              <input type="radio" name="options" id="option2" checked> Month
                            </label>
                            <label class="btn btn-outline-secondary">
                              <input type="radio" name="options" id="option3" > Year
                            </label>
                          </div>
                        </div>-->
                      </div><!--/.col-->
                    </div><!--/.row-->

                    <daily-income
                      :chart-data="tempData"
                      :options="mOptions"
                      :width = "400"
                      :height = "300"
                    ></daily-income>
                    <div class="row">
                      <div class="col-sm-5">
                        <h4 class="card-title mb-0 text-center">酸鹼值</h4>
                      </div>
                    </div>
                    <daily-income
                      :chart-data="phData"
                      :options="mOptions"
                      :width = "400"
                      :height = "300"
                    ></daily-income>
                    <div class="row">
                      <div class="col-sm-5">
                        <h4 class="card-title mb-0 text-center">水含量</h4>
                      </div>
                    </div>
                    <daily-income
                      :chart-data="waterData"
                      :options="mOptions"
                      :width = "400"
                      :height = "300"
                    ></daily-income>
                    <div class="row">
                      <div class="col-sm-5">
                        <h4 class="card-title mb-0 text-center">電導度</h4>
                      </div>
                    </div>
                    <daily-income
                      :chart-data="ecData"
                      :options="mOptions"
                      :width = "400"
                      :height = "300"
                    ></daily-income>
                  </div>
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
  import FieldDefs from './table/FieldDefs.js'
  import MyVuetable from './table/MyVuetable'
  import {getDatas} from '../api/todos'
  import {getDateToString} from '../utils/dateTools'
  // import { datepicker } from 'vue-strap'
  import DailyIncome from './charts/DailyIncome'
  // Get API url
  const url3 = process.env.BASE_API + 'todos/devices'
  // console.log('url3 ' + url3)
  /* const datasets = [
    {
      label: 'My First dataset',
      backgroundColor: '#c2c2d6',
      borderColor: 'rgba(255,255,255,.55)',
      data: [0, 0]
    }
  ] */
  const data = {
    labels: ['0:00', '現在'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: '#c2c2d6',
        data: [0, 0]
      }
    ]
  }
  const options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'black'
        },
        type: 'time',
        time: {
          displayFormats: {
            'hour': 'MM/DD HH',
            'day': 'MM/DD'
          }
        },
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 8,
          stepSize: 0
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 4,
          stepSize: 2
        },
        gridLines: {
          color: 'black'
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 5
      },
      point: {
        radius: 4,
        hitRadius: 5,
        hoverRadius: 4
      }
    }
  }

  export default {

    name: 'charts',
    components: {
      MyVuetable,
      DailyIncome
    },
    computed: {
      ...mapGetters([
        'bindDeviceList'
      ])
    },
    mounted () {
      this.getBindList()
      this.initDate()
      this.fillData()
    },
    data () {
      return {
        format: 'yy-MM-dd hh:mm',
        maclist: [],
        isShowLoading: false,
        rows: [],
        type: 'scatter',
        isAlert: false,
        isShowLine: true,
        isShowSearch: true,
        isOverLoading: false,
        bar_show: false,
        plotdata: [],
        isPlotExist: false,
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
        alertMessage: '尚未選擇裝置,無法查詢或更新.',
        mOptions: null,
        tempData: null,
        waterData: null,
        ecData: null,
        phData: null
      }
    },
    methods: {
      fillData () {
        this.tempData = data
        this.phData = data
        this.waterData = data
        this.ecData = data
        this.mOptions = options
      },
      initDate () {
        // Verify bind device list
        // this.tempData = data
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
        let oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        // this.info.to = this.getDateString(now)
        this.info.to = getDateToString(now, 0)          // time = current time
        this.info.from = getDateToString(oneWeekAgo, 1) // time = 00:00
        // console.log(typeof this.info.from + ' : ' + this.info.from)
        // console.log(typeof this.info.to + ' : ' + this.info.to)
      },
      fetchData () {
        console.log('fetchData mac : ' + this.info.mac + ',  from : ' + this.info.from + ' , to : ' + this.info.to)
        var time = new Date(this.info.to)
        time.setDate(time.getDate() + 1)
        var a = time.getMonth() + 1
        var b = time.getDate()
        console.log('to month : ' + a + ' day : ' + b)
        if (a < 10) {
          a = '0' + a
        }
        if (b < 10) {
          b = '0' + b
        }
        var time2 = new Date(this.info.from)
        var a2 = time2.getMonth() + 1
        var b2 = time2.getDate()
        console.log('from month : ' + a2 + ' day : ' + b2)
        if (a2 < 10) {
          a2 = '0' + a2
        }
        if (b2 < 10) {
          b2 = '0' + b2
        }

        var toString = time.getFullYear() + '-' + a + '-' + b + ' 00:00'
        var fromString = time2.getFullYear() + '-' + a2 + '-' + b2 + ' 00:00'
        // keep data for export CSV
        this.obj = {mac: this.info.mac, from: fromString, to: toString}
        getDatas(this.obj).then(response => {
          var data = response.data
          console.log('#### data : ' + data)
          if (data.ph) {
            console.log('#### data length : ' + data.ph.length)
            var keys = Object.keys(data)
            if (keys.length > 0) {
              // console.log('con : ' + data.temperature.length + '=>' + JSON.stringify(data.temperature))
              var diff = Math.ceil(data.time.length / 96)
              var time = []
              var temp = []
              var ph = []
              var water = []
              var ec = []

              for (let i = 0; i < data.time.length; i = i + diff) {
                time.push(data.time[i])
                temp.push(data.temperature[i])
                // console.log(data.ph[i])
                ph.push(data.ph[i])
                ec.push(data.ec[i])
                water.push(data.water[i])
              }
              /* console.log('diff : ' + diff + ', time : ' + time.length)
              console.log(' temp : ' + temp.length)
              console.log(' ph : ' + ph.length)
              console.log('water : ' + water.length)
              console.log('water : ' + ec.length) */
              this.tempData = this.getChartData('溫度', time, temp)
              this.phData = this.getChartData('酸鹼值', time, ph)
              this.waterData = this.getChartData('水含量', time, water)
              this.ecData = this.getChartData('導電度', time, ec)
            } else {
              this.fillData()
            }
          } else {
            this.fillData()
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      getBindList () {
        var mac = this.$store.getters.selectMac
        var lists = this.$store.getters.bindDeviceList
        console.log('$ this.$store.getters.bindDeviceList : ' + JSON.stringify(lists))
        for (var k in lists) {
          if (lists[k].macAddr === mac) {
            this.info.name = lists[k].name
            this.info.mac = lists[k].macAddr
          }
        }
        console.log('* Info : ' + JSON.stringify(this.info))
      },
      showChart () {
        this.isShowLine = true
      },
      showTable () {
        this.isShowLine = false
      },
      selectDeviceOption (ele) {
        var name = ele.target.value
        console.log('$ Find sselectDeviceVal :' + name)
        var deviceList = this.$store.getters.bindDeviceList
        console.log('$$$ selectDeviceVal deviceList :' + JSON.stringify(deviceList))
        for (var a = 0; a < deviceList.length; a++) {
          console.log('####  deviceList[' + a + ']: ' + JSON.stringify(deviceList[a]) + 'select name : ' + name)
          if (deviceList[a].name === name) {
            console.log('$$$$ deviceList[' + a + '].typeName === this.deviceName')
            this.info.mac = deviceList[a].macAddr
          }
        }
        console.log('$ Current info :' + JSON.stringify(this.info))
      },
      toLoadData () {
        if (this.info.mac === '') {
          this.alertMessage = '尚未選擇裝置,無法查詢.'
          this.warning()
          return
        }
        var from = new Date(this.info.from)
        var to = new Date(this.info.to)
        if (from.getTime() > to.getTime()) {
          this.alertMessage = '開始時間大於結束時間.'
          this.warning()
          return
        }
        this.isShowLoading = true
        console.log('toLoadData info : ' + JSON.stringify(this.info))
        this.$refs.tablechild.onChangeOption(this.info)
      },
      closeLoading () {
        this.isShowLoading = false
        this.isOverLoading = false
        console.log('parent closed-loading')
        if (this.info.mac !== null && this.info.mac !== undefined && this.info.mac !== '') {
          this.fetchData()
        }
      },
      csvExport () {
        console.log('csvExport () be press')
        if (this.plotdata.length === 0) {
          this.alertMessage = '尚無資料,無法匯出CSV.'
          this.warning()
        }
        if (this.obj === '') {
          return
        }
        // var csvUrl = this.url + '&csv=true'
        this.obj.csv = true
        getDatas(this.obj).then(response => {
          var data = this.convertToCSV(response.data)
          // console.log('data : ' + JSON.stringify(data))
          console.log(typeof this.info.from + ' : ' + this.info.from)
          console.log(typeof this.info.to + ' : ' + this.info.to)
          var d1 = new Date(this.info.from)
          var d2 = new Date(this.info.to)
          console.log('d1.getTime()  = ' + d1.getTime())
          console.log('d2.getTime()  = ' + d2.getTime())

          var filename = ''
          if (d1.getTime() === d2.getTime()) {
            console.log('this.info.from === this.info.to')
            filename = this.info.to + '.csv'
          } else {
            console.log('this.info.from !== this.info.to')
            filename = this.info.from + '_' + this.info.to + '.csv'
          }
          this.saveContent(data, filename)
        }).catch(function (error) {
          console.log(error)
        })
      },
      convertToCSV (objArray) {
        var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
        var str = ''
        var line = ''
        var target = ['項目', '日期', '資料', '溫度', '水含量', '酸鹼值', '電導度']
        // For title
        for (var index in target) {
          if (line !== '') line += ','
          line += target[index]
        }
        str += line + '\r\n'

        for (var i = 0; i < array.length; i++) {
          var line2 = '' + (i + 1)

          for (var j in array[i]) {
            if (line2 !== '') line2 += ','
            if (typeof array[i][j] === 'object') {
              line2 += this.getObjectStr(array[i][j])
            } else {
              line2 += array[i][j]
            }
          }
          str += line2 + '\r\n'
        }
        // console.log(' str :' + str)
        str = encodeURIComponent(str)
        return str
      },
      getObjectStr (obj) {
        var keys = Object.keys(obj)
        var arr = []
        for (var i = 0; i < keys.length; i++) {
          arr.push(obj[keys[i]])
        }
        var str = arr.toString()
        return str
      },
      saveContent (fileContents, fileName) {
        var link = document.createElement('a')
        console.log('$ fileMame : ' + fileName)
        link.download = fileName
        link.href = 'data:text/csv;charset=utf-8,\ufeff' + fileContents
        link.click()
      },
      toRefresh () {
        if (this.info.mac !== null && this.info.mac !== undefined && this.info.mac !== '') {
          this.isOverLoading = true
          this.$refs.tablechild.onChangeOption(this.info)
        } else {
          this.alertMessage = '尚未選擇裝置,無法更新.'
          this.warning()
        }
      },
      showSearch () {
        this.isShowSearch = true
      },
      hideSearch () {
        this.isShowSearch = false
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
          mdateString = getDateToString(now, 0) // time = current time
        } else {
          mdateString = getDateToString(mdate, 2) // time = 23:59
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
      getChartData (label, time, data) {
        var dataTemp = {
          labels: time,
          datasets: [
            {
              label: label,
              backgroundColor: '#b3d1ff',
              borderColor: '#1a75ff',
              data: data
            }
          ]
        }
        return dataTemp
      }
    }
  }
</script>
<style>
  .sub-chart {
    padding: 0px;
  }
</style>
