<template>
  <div class="chart-info">
    <button type="button" class="close" aria-label="Close" @click="clickClose">
      <span aria-hidden="true">&times;</span>
    </button>
    <img src="static/img/agricultural.jpg" />
    <div class="data-block">
      <h4>
         裝置 :<small>{{' ' + params.mac}}</small>
      </h4>
    </div>
    <hr>
    <div class="container">
      <div class="row data-block">
        <div class="col-md-4">
          溫度
          <h5>
            {{tmp}}°C
          </h5>
          <div class="row">
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-up fa-lg block-icon-1"></i>
              {{tmpMax}}°C
            </div>
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-down fa-lg block-icon-2"></i>
              {{tmpMin}}°C
            </div>
          </div>
        </div>
        <div class="col-md-8 chart-view">
          <daily-income
            :chart-data="tmpData"
            :options="myoptions"
            :width="220"
            :height="80"
          ></daily-income>
        </div>
      </div>
      <hr>
      <div class="row data-block">
        <div class="col-md-4">
          土壤水分含量
          <h5>
            {{water}}%
          </h5>
          <div class="row">
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-up fa-lg block-icon-1"></i>
              {{waterMax}}
            </div>
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-down fa-lg block-icon-2"></i>
              {{waterMin}}
            </div>
          </div>
        </div>
        <div class="col-md-8 chart-view">
          <daily-income
            :chart-data="humData"
            :options="myoptions"
            :width="220"
            :height="80"
          ></daily-income>
        </div>
      </div>
      <hr>
      <div class="row data-block">
        <div class="col-md-4">
          酸鹼值
          <h5>
            {{ph}}
          </h5>
          <div class="row">
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-up fa-lg block-icon-1"></i>
              {{phMax}}
            </div>
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-down fa-lg block-icon-2"></i>
              {{phMin}}
            </div>
          </div>
        </div>
        <div class="col-md-8 chart-view">
          <daily-income :chart-data="phData" :options="myoptions" :width="220" :height="80"></daily-income>
        </div>
      </div>
      <hr>
      <div class="row data-block">
        <div class="col-md-4">
          電導度
          <h5>
            {{ec}}
          </h5>
          ms／cm
          <div class="row">
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-up fa-lg block-icon-1"></i>
              {{ecMax}}
            </div>
            <div class="col-md-6">
              <i class="fa fa-arrow-circle-down fa-lg block-icon-2"></i>
              {{ecMin}}
            </div>
          </div>
        </div>
        <div class="col-md-8 chart-view">
          <daily-income
            :chart-data="conData"
            :options="myoptions"
            :width="220"
            :height="80"
          ></daily-income>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import DailyIncome from '../charts/DailyIncome'
  import CardLine3ChartExample from '../dashboard/CardLine3ChartExample'
  import {getDatas} from '../../api/todos'

  const datasets = [
    {
      label: 'My First dataset',
      backgroundColor: '#c2c2d6',
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40]
    }
  ]
  const data = {
    labels: ['0', '', '', '', '', '', '12'],
    datasets: datasets
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
        }
      }],
      yAxes: [{
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
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }

  export default {
    name: 'chart-info',
    props: {
      params: Object
    },
    components: {
      DailyIncome,
      CardLine3ChartExample
    },
    data () {
      return {
        conData: null,
        phData: null,
        tmpData: null,
        humData: null,
        tmpMax: null,
        tmpMin: null,
        phMax: null,
        phMin: null,
        ecMax: null,
        ecMin: null,
        waterMax: null,
        waterMin: null,
        tmp: null,
        ph: null,
        ec: null,
        water: null,
        myoptions: options
      }
    },
    watch: {
      params (val) {
        if (val) {
          console.log('watch :  params val: ' + JSON.stringify(val))
          this.updateChart(val)
        }
      }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        this.conData = data
        this.phData = data
        this.tmpData = data
        this.humData = data
      },
      updateChart (val) {
        console.log('test val : ' + JSON.stringify(val))
        getDatas({mac: val.mac}).then(response => {
          var datas = response.data
          // console.log('datas : ' + JSON.stringify(datas))

          var time = []
          // console.log('*************** last')
          var now = new Date()
          var last = now.getHours() + ':' + now.getMinutes()
          if (Object.keys(datas).length === 0) {
            time.push('00:01')
            time.push(last)
            var empty = [0, 0]
            datas.temprature = empty
            datas.water = empty
            datas.ph = empty
            datas.ec = empty
            this.phMax = null
            this.phMin = null
            this.waterMax = null
            this.waterMin = null
            this.tmpMax = null
            this.tmpMin = null
            this.ecMax = null
            this.ecMin = null
            this.tmp = null
            this.ph = null
            this.water = null
            this.ec = null
          } else {
            var length = datas.time.length
            this.phMax = this.getMaxOfArray(datas.ph)
            this.phMin = this.getMinOfArray(datas.ph)
            this.waterMax = this.getMaxOfArray(datas.water)
            this.waterMin = this.getMinOfArray(datas.water)
            this.tmpMax = this.getMaxOfArray(datas.temprature)
            this.tmpMin = this.getMinOfArray(datas.temprature)
            this.ecMax = this.getMaxOfArray(datas.ec)
            this.ecMin = this.getMinOfArray(datas.ec)
            this.tmp = (datas.temprature)[datas.temprature.length - 1]
            this.ph = (datas.ph)[datas.ph.length - 1]
            this.water = (datas.water)[datas.water.length - 1]
            this.ec = (datas.ec)[datas.ec.length - 1]
            /* console.log('temprature max : ' + this.tmpMax + ' , min : ' + this.tmpMin)
            console.log('ph max : ' + this.phMax + ' , min : ' + this.phMin)
            console.log('water max : ' + this.waterMax + ' , min : ' + this.waterMin)
            console.log('ec max : ' + this.ecMax + ' , min : ' + this.ecMin) */
            for (var i = 0; i < length; i++) {
              if (i === 0) {
                time.push('00:01')
              } else if (i === (length - 1)) {
                time.push(last)
              } else {
                time.push('')
              }
            }
          }
          // console.log('time : ' + time.length + '=>' + JSON.stringify(time))
          // console.log('con : ' + datas.temprature.length + '=>' + JSON.stringify(datas.temprature))
          const dataTemp = {
            labels: time,
            datasets: [
              {
                label: '溫度',
                backgroundColor: '#c2c2d6',
                borderColor: 'rgba(255,255,255,.55)',
                data: datas.temprature
              }
            ]
          }
          const dataHum = {
            labels: time,
            datasets: [
              {
                label: '土壤水含量',
                backgroundColor: '#c2c2d6',
                borderColor: 'rgba(255,255,255,.55)',
                data: datas.water
              }
            ]
          }
          const dataPh = {
            labels: time,
            datasets: [
              {
                label: '酸鹼值',
                backgroundColor: '#c2c2d6',
                borderColor: 'rgba(255,255,255,.55)',
                data: datas.ph
              }
            ]
          }
          const dataCon = {
            labels: time,
            datasets: [
              {
                label: '電導度',
                backgroundColor: '#c2c2d6',
                borderColor: 'rgba(255,255,255,.55)',
                data: datas.ec
              }
            ]
          }
          this.tmpData = dataTemp
          this.humData = dataHum
          this.phData = dataPh
          this.conData = dataCon
          console.log('child loading-finish')
          this.$emit('loading-finish')
        }).catch(function (error) {
          console.log(error)
        })
      },
      clickClose () {
        console.log('child click-close')
        this.$emit('click-close')
      },
      getMaxOfArray (numArray) {
        console.log('getMaxOfArray => ' + numArray)
        return Math.max.apply(null, numArray)
      },
      getMinOfArray (numArray) {
        return Math.min.apply(null, numArray)
      }
    }
  }
</script>

<style>
  .chart-info{
    background-color: white;
    margin-top: 5px;
    margin-left: 6px;
    height: 99%;
    width: 96%;
    border-radius: 6px;
  }
  .data-block{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .chart-info img{
    widith: 230px;
    height: 60px;
    border-radius: 6px;
  }
  .block-icon-1{
    color: red;
  }
  .block-icon-2{
    color: #0088d2;
  }
  .chart-view {
    width: 200px;
    height: 80px;
  // background-color: yellow;
  }
</style>
