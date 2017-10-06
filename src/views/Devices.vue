<template>
  <div class="container max-width mx-auto container-giot">
    <div class="row row-giot">
      <div class="BG-Average m-r13">
        <nav class="navbar bg-faded btn-menu">
          <form class="form-inline">
            <button type="button" class="btn btn-all btn-lg" @click="onClickAll">
              全部區域<img class="btn-refresh" src="static/img/ico_refresh.png"/>
            </button>
            <button class="btn btn-setting m-l10" type="button">
              <img class="btn-icon" src="static/img/ico_srtting.png"/>
            </button>
            <button class="btn btn-setting m-l10" type="button">
              <img class="btn-icon" src="static/img/ico_date.png"/>
            </button>
          </form>
        </nav>
        <ul class="submenu">
          <li  class="submenu-item" v-bind:class="{ active: item.isActive }" v-for="(item, index) in items">
            <sub-item :params="item" :tag="index" @click-item="onClick"></sub-item>
          </li>
        </ul>
      </div>
      <div class="BG-Average-Copy">
        <div id="map">
          <agri-map :center="center" :markers="markerList" :icons="iconList" @show-view="isShowView" @toggle-info="showChartInfo"></agri-map>
        </div>
      </div>
    </div>
    <div v-show="isOverView" id="over_view" >
      <chart-info :params="toggleData" @click-close="clickClose" @loading-finish="loadingFinish"></chart-info>
    </div>
    <div v-show="isOverLoading" id="over_view_loading" >

      <Spin fix>
        <Icon type="load-c" size=40 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import SubItem from './submenu/SubItem'
  import AgriMap from './map/AgriMap'
  import LineExample from './charts/LineExample'
  import ChartInfo from './submenu/ChartInfo'

  const url2 = '/data/todos/bindlist'
  var tmpdata = [[], []]
  var icons = []
  var icon1 = {url: 'static/img/ico_manhole_small.png'}
  for (var i = 0; i < 5; i++) {
    icons.push(icon1)
  }
  export default {
    name: 'devices',
    components: {
      SubItem,
      AgriMap,
      LineExample,
      ChartInfo
    },
    mounted () {
      this.getBindList()
    },
    data () {
      return {
        items: [
          {
            title: '永齡農場',
            isActive: true,
            total: 2,
            active: 2
          },
          {
            title: '區域1',
            isActive: false,
            total: 0,
            active: 0
          },
          {
            title: '區域2',
            isActive: false,
            total: 0,
            active: 0
          }
        ],
        marks: tmpdata,
        markerList: tmpdata[0],
        iconList: icons,
        all: [],
        center: {
          lat: 23.898406,
          lng: 121.544638
        },
        isOverView: false,
        isOverLoading: false,
        toggleData: {
          mac: '',
          information: {
            temprature: '',
            humidity: '',
            ph: '',
            con: ''
          }
        }
      }
    },
    methods: {
      getBindList () {
        Vue.axios.get(url2).then((response) => {
          // console.log(typeof response + ' response : ' + JSON.stringify(response))
          this.markerList = response.data
          console.log(' this.marks : ' + JSON.stringify(this.marks))
          console.log(' this.markerList : ' + JSON.stringify(this.markerList))
          this.marks = []
          this.marks.push(response.data)
          for (var k in tmpdata) {
            this.marks.push(tmpdata[k])
          }
          console.log(' this.marks : ' + JSON.stringify(this.marks))
        }).catch(function (error) {
          console.log(error)
        })
      },
      insertArr (arr, index, item) {
        return arr.splice(index, 0, item)
      },
      onClick (index) {
        console.log('submemu item click : ' + index + ' , type : ' + typeof index)
        for (var i = 0; i < this.items.length; i++) {
          if (i === index) {
            this.items[i].isActive = true
          } else {
            this.items[i].isActive = false
          }
        }
        this.markerList = this.marks[index]
      },
      onClickAll () {
        console.log(' click All ')
        var all = []
        all = all.concat(...this.marks)
        console.log('all : ' + this.all.length)
        this.markerList = all
      },
      getIconList (list) {
        var arr = []
        var icon1 = {url: 'static/img/ico_manhole_small.png'}
        for (var i = 0; i < list.length; i++) {
          arr.push(icon1)
        }
        return arr
      },
      isShowView (val) {
        console.log('Parent show-view : ' + val)
        this.isOverView = val
      },
      showChartInfo (data) {
        if (data) {
          console.log('parent toggle-info : ' + JSON.stringify(data))
          this.toggleData = data // set propo for chart info
          // this.isOverLoading = true // Show loading indicator
        }
      },
      clickClose () {
        console.log('parent click-close')
        this.isOverView = false
      },
      loadingFinish () {
        console.log('parentl loading-finish')
        this.isOverLoading = false
      }
    }
  }
</script>

<style lang="css">
  form-inline.btn {
    color: #20a8d8;
    text-decoration: none;
    background-color: #0088d2;
  }
  .btn-menu .btn-setting {
    color: #fff;
    background-color: #39b2d5;
    border-color: #39b2d5;
    width: 45px;
    height: 45px;
    border-radius: 5px;
  }
  .btn-menu .btn-all {
    color: #fff;
    background-color: #0088d2;
    border-color: #0088d2;
    height: 45px;
    weight: 185;
    padding: 0;
    border-radius: 5px;
  }
  .btn-refresh {
    width: 19px;
    height: 19px;
    position: absolute;
    left: 136px;
    top: 13px;
  }
  .btn-icon {
    width: 15px;
    height: 20px;
  }
  .submenu {
    padding: 0px;
  }
  .submenu .submenu-item {
    width: 300px;
    height: 136px;
    background-color: rgba(0, 136, 210, 0.5);
    list-style: none;
    border-radius: 6px;
    margin-bottom: 9px;
    position: relative;
    cursor: pointer;
    padding: 0px;
  }
  .submenu .active {
    background-color: #0088d2;
  }
  #map {
    height: 637px;
    width: 100%;
  }
  #over_view{
    position: relative;
    height: 650px;
    width: 320px;
    top: -660px;
    border-radius: 4px;
    background-color: lightgray;
    border-radius: 6px;
  }
  #over_view_loading{
    position: relative;
    height: 650px;
    width: 320px;
    top: -1245px;
    border-radius: 4px;
    border-radius: 6px;
    opacity: 0.5;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>
