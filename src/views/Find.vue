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
                  <h5>選擇裝置</h5>
                </label>
                <select v-model="info.mac" class="form-control">
                  <option disabled value="">請選擇裝置</option>
                  <option v-for="mac in maclist">{{mac}}</option>

                </select>
              </div>

              <div class="form-group">

                <label for="exampleInputEmail1">
                  <h5>開始日期</h5>
                </label>
                <DatePicker type="date" placeholder="選擇開始日期" format="yyyy-MM-dd" v-model="info.from" @on-change="fromChange" style="width: 100%"></DatePicker>
              </div>
              <div class="form-group">

                <label for="exampleInputPassword1">
                  <h5>結束日期</h5>
                </label>
                <DatePicker type="date" placeholder="選擇結束日期" format="yyyy-MM-dd" v-model="info.to" @on-change="toChange" style="width: 100%"></DatePicker>
              </div>
              <button type="button" class="btn btn-primary btn-block" @click="toLoadData">
                <i v-show="isShowLoading" class='fa fa-spinner fa-spin '></i>查詢
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
                  <button type="button" class="btn btn-success" @click="showPlot">
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
                  <div class="col-md-4">裝置 :{{info.mac}}</div>
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
                <div v-show="isShowTable">
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
                <div v-show="isShowLine" class="tile is-ancestor">
                  <div ref="temp"  style="width:100%; height:300px;"></div>
                  <div ref="ph"  style="width:100%; height:300px;"></div>
                  <div ref="water"  style="width:100%; height:300px;"></div>
                  <div ref="ec"  style="width:100%; height:300px;"></div>
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
  import Vue from 'vue'
  import Plotly from 'plotly.js/dist/plotly'
  import FieldDefs from './table/FieldDefs.js'
  import MyVuetable from './table/MyVuetable'

  const url2 = '/data/todos/bindlist'
  const url3 = '/data/todos/devices'
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

    name: 'charts',
    components: {
      MyVuetable
    },
    mounted () {
      this.getBindList()
      this.initDate()
    },
    data () {
      return {
        maclist: [],
        isShowLoading: false,
        rows: [],
        type: 'scatter',
        isAlert: false,
        isShowTable: true,
        isShowLine: false,
        isShowSearch: true,
        isOverLoading: false,
        bar_show: false,
        plotdata: [],
        isPlotExist: false,
        layout1: layout,
        api_url: url3,
        fields: FieldDefs,
        info: {
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
        url: '',
        alertTitle: '警告!',
        alertMessage: '尚未選擇裝置,無法查詢或更新.'
      }
    },
    methods: {
      initDate () {
        let now = new Date()
        let oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        this.info.to = this.getDateString(now)
        this.info.from = this.getDateString(oneWeekAgo)
        console.log(typeof this.info.from + ' : ' + this.info.from)
        console.log(typeof this.info.to + ' : ' + this.info.to)
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
        this.url = '/data/todos/datas?mac=' + this.info.mac + '&from=' + fromString + '&to=' + toString
        console.log('fetchData (chart) url  : ' + this.url)
        Vue.axios.get(this.url).then((response) => {
          var data = response.data
          if (data !== null) {
            console.log('#### data length : ' + data.ph.length)
            this.plotdata = [
              // {x: data.time, y: data.ec, name: '電導度'},
              // {x: data.time, y: data.ph, name: '酸鹼度'},
              // {x: data.time, y: data.water, name: '水含量'},
              {x: data.time, y: data.temprature, name: '溫度'}]

            if (this.isPlotExist === false) {
              console.log('this.isPlotExist === false')
              Plotly.newPlot(
                this.$refs.temp,
                [{x: data.time, y: data.temprature, name: '溫度'}],
                layout
              )
              Plotly.newPlot(
                this.$refs.ph,
                [{x: data.time, y: data.ph, name: '酸鹼度'}],
                layout2
              )
              Plotly.newPlot(
                this.$refs.water,
                [{x: data.time, y: data.water, name: '水含量'}],
                layout3
              )
              Plotly.newPlot(
                this.$refs.ec,
                [{x: data.time, y: data.ec, name: '電導度'}],
                layout4
              )
              this.isPlotExist = true
            } else {
              console.log('this.isPlotExist === true')
              this.$refs.temp.title = '溫度'
              this.$refs.temp.data = [{x: data.time, y: data.temprature, name: '溫度'}]
              Plotly.redraw(this.$refs.temp)
              this.$refs.ph.title = '酸鹼度'
              this.$refs.ph.data = [{x: data.time, y: data.ph, name: '酸鹼度'}]
              Plotly.redraw(this.$refs.ph)
              this.$refs.water.title = '水含量'
              this.$refs.water.data = [{x: data.time, y: data.water, name: '水含量'}]
              Plotly.redraw(this.$refs.water)
              this.$refs.ec.title = '電導度'
              this.$refs.ec.data = [{x: data.time, y: data.ec, name: '電導度'}]
              Plotly.redraw(this.$refs.water)
            }
          }
        })
      },
      getBindList () {
        Vue.axios.get(url2).then((response) => {
          console.log(typeof response + ' response : ' + JSON.stringify(response))
          var lists = response.data
          var macs = []
          for (var k in lists) {
            macs.push(lists[k].macAddr)
          }
          console.log(typeof macs + ' data : ' + JSON.stringify(macs))
          this.maclist = macs
        })
      },
      showPlot () {
        this.isShowTable = false
        this.isShowLine = true
      },
      showTable () {
        this.isShowTable = true
        this.isShowLine = false
      },
      toLoadData () {
        if (this.info.mac === '') {
          this.alertMessage = '尚未選擇裝置,無法查詢.'
          this.warning()
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
        if (this.url === '') {
          return
        }
        var csvUrl = this.url + '&csv=true'
        Vue.axios.get(csvUrl).then((response) => {
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
        console.log(' str :' + str)
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
      csvData (data) {

      },
      fromChange (date) {
        this.info.from = date
      },
      toChange (date) {
        this.info.to = date
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
      getDateString (date) {
        var m = date.getMonth() + 1
        var d = date.getDate()
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        return date.getFullYear() + '-' + m + '-' + d
      }
    }
  }
</script>
<style>

</style>
