<template>
  <div class="animated fadeIn m-t33">
    <div class="row">
      <div class="col-sm-12 col-md-3">
        <div class="BG-Average">
          <nav class="navbar bg-faded btn-menu">
            <button type="button" class="btn btn-all btn-block" @click="onClickAll">
              全部區域&nbsp;&nbsp;&nbsp;
              <img src="static/img/ico_refresh.png"  scroll="false" width="8%">
            </button>
          </nav>
          <ul class="submenu">
            <li  class="submenu-item" v-bind:class="{ active: item.isActive }" v-for="(item, index) in items">
              <sub-item :params="item" :tag="index" @click-item="onClick"></sub-item>
            </li>
          </ul>
        </div>
      </div><!--/.col-->
      <div class="col-sm-12 col-md-9 ">
        <div class="BG-Average-Copy">
          <div id="map">
            <agri-map :center="center" :markers="markerList" :icons="iconList" @show-view="isShowView" @toggle-info="showChartInfo"></agri-map>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-3">
        <div v-show="isOverView" id="over_view" >
          <chart-info :params="toggleData" @click-close="clickClose" @loading-finish="loadingFinish"></chart-info>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import SubItem from './submenu/SubItem'
  import AgriMap from './map/AgriMap'
  import ChartInfo from './submenu/ChartInfo'
  var tmpdata = []
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
      ChartInfo
    },
    mounted () {
      this.init()
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
            title: '東華',
            isActive: false,
            total: 2,
            active: 2
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
          lat: 22.978395,
          lng: 120.550663
        },
        isOverView: false,
        isOverLoading: false,
        toggleData: {
          mac: '',
          information: {
            temperature: '',
            humidity: '',
            ph: '',
            con: ''
          }
        }
      }
    },
    methods: {
      init () {
        this.$store.dispatch('getBindDeviceList').then(response => {
          var list = response.data
          this.marks = [[], [], []]
          for (var j in list) {
            if ((list[j].name).includes('土壤')) {
              this.marks[1].push(list[j])
            } else {
              this.marks[0].push(list[j])
            }
          }
          this.markerList = this.marks[0]
          /* if (!process.env.NODE_ENV === 'production') {
            console.log('$ Bind list : ' + JSON.stringify(list))
            console.log(' this.markerList : ' + JSON.stringify(this.markerList))
            console.log(' this.marks : ' + JSON.stringify(this.marks))
          } */
          console.log('init bind list : ' + list.length)
          console.log('init this.markerList : ' + this.markerList.length)
          console.log('init this.marks : ' + this.marks.length)
        }).catch(function (error) {
          console.log('? getBindDeviceList  error :' + error)
        })
        this.$store.dispatch('getDeviceType').then(response => {
          console.log('$ getDeviceType : ' + JSON.stringify(response.data))
        }).catch(function (error) {
          console.log('? getDeviceType  error :' + error)
        })
        this.$store.dispatch('getProfiles').then(response => {
          console.log('$ getProfiles : ' + JSON.stringify(response.data))
        }).catch(function (error) {
          console.log('? getProfiles  error :' + error)
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
        for (var i = 0; i < this.items.length; i++) {
          if (i === 0) {
            this.items[i].isActive = true
          } else {
            this.items[i].isActive = false
          }
        }
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
          this.toggleData = data // set propo for charts info
          this.$store.dispatch('setSelectMac', data.mac)
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
    width: auto;
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
    height: auto;
    width: auto;
    top: -660px;
    border-radius: 4px;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 10px 10px;
  }

  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
