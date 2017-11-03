<template>
  <div class="animated fadeIn">
    <div id="google_map">
      <gmap-map ref="example"
                :center="center"
                :zoom="20"
                style="width: 100%; height: 630px"
      >
        <gmap-info-window :options="infoOptions"
                          :position="infoWindowPos"
                          :opened="infoWinOpen"
                          @closeclick="closeInfo"
        >
          {{infoContent}}
        </gmap-info-window>

        <gmap-marker
          :key="i"
          v-for="(m,i) in markers"
          :position="m.position"
          :clickable="true"
          :icon="iconArr[i]"
          @click="toggleInfoChart(m,i)"
          @mouseover="mouseover(m,i)"
          @mouseout="mouseOut"
        >
        </gmap-marker>
      </gmap-map>
    </div>

    <div v-show="isOverMap">
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBvWE_sIwKbWkiuJQOf8gSk9qzpO96fhfY',
      libraries: 'places'
    }
  })

  export default {
    name: 'agri-map',
    props: {
      markers: Array,
      icons: Array
    },
    watch: {
      markers (val) {
        if (val && val.length > 0) {
          this.iconArr = this.getIconList(val.length)
          console.log('watch :  val: ' + JSON.stringify(val))
          console.log('watch :  val[0]: ' + JSON.stringify(val[0]))
          console.log('watch :  val[0].position : ' + JSON.stringify(val[0].position))
          this.center = val[0].position
        }
        this.isOverMap = false
      },
      isOverMap (val) {
        console.log('child show-view : ' + val)
        this.$emit('show-view', val)
      }
    },
    data () {
      return {
        center: {
          lat: 22.9764891,
          lng: 120.5493562
        },
        infoContent: '',
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        // optional: offset infowindow so it visually sits nicely on top of our marker
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        isOverMap: false,
        iconArr: this.icons,
        icon1: {url: 'static/img/ico_manhole_small.png'},
        icon2: {url: 'static/img/ico_manhole_warning_small.png'}
      }
    },
    methods: {
      mouseover (marker, idx) {
        this.infoWindowPos = marker.position
        this.infoContent = marker.name + ' : ' + marker.macAddr
        // check if its the same marker that was selected if yes toggle
        if (this.currentMidx === idx) {
          this.infoWinOpen = !this.infoWinOpen
        } else {
          // if different marker set infowindow to open and reset current marker index
          this.infoWinOpen = true
        }
      },
      mouseOut () {
        this.infoWinOpen = false
      },
      toggleInfoChart (marker, idx) {
        var oldIndex = this.currentMidx
        console.log('toggleInfoChart marker : ' + JSON.stringify(marker))
        if (this.currentMidx === idx) {
          this.isOverMap = !this.isOverMap
        } else {
          // if different marker set infowindow to open and reset current marker index
          this.iconArr[oldIndex] = this.icon1
          this.isOverMap = true
          this.currentMidx = idx
        }
        if (this.isOverMap) {
          this.iconArr[idx] = this.icon2
        } else {
          this.iconArr[idx] = this.icon1
        }
        // console.log('toggleInfoChart after : currentMidx : ' + this.currentMidx + ' ,  idx :' + idx)
        var device = {mac: marker.macAddr, information: {temperature: 24.8, humidity: 58, ph: 9, con: 700}}
        this.$emit('toggle-info', device)
      },
      closeInfo () {
        this.infoWinOpen = false
        this.isOverMap = false
      },
      getIconList (length) {
        var arr = []
        var icon1 = {url: 'static/img/ico_manhole_small.png'}
        for (let i = 0; i < length; i++) {
          arr.push(icon1)
        }
        return arr
      }
    }
  }
</script>

<style>
  #wrapper { position: relative; }
  #over_map {
    position: relative;
    top: -630px;
    z-index: 99;
    height: 400px;
    width:  400px;
    background-color: gray;
    border-radius: 6px;
    opacity:0.4;
  }
</style>
