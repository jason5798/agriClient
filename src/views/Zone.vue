<template>
  <div class="container max-width mx-auto container-zone">
    <div id="page-header">
      <h1 class="page-title">區域</h1>
      <a @click="onAdd"><img class="btn-add m-l21"  src="static/img/btn_add_n.png"/></a>
    </div>
    <div class="row row-giot editmenu m-t33">
    </div>
    <div class="row row-giot editmenu">
      <template v-for="(item, index) in items">
        <div class="m-t33 editmenu-item" v-bind:class="{ 'm-l32': index % 3 !== 0 }">
          <edit-item :params="item" :tag="index" @click-edit="onEdit" @click-del="onDel"></edit-item>
        </div>
      </template>
    </div>
    <!------------------------------------ spinner -------------------------------->
    <spinner ref="spinner" size="xl" fixed="true" text="處理中........."></spinner>
    <!------------------------------------ Add modal -------------------------------->
    <modal title="Modal title" large class="modal-primary" v-model="addModal" @ok="addModal = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 v-if="selectIndex === -1" class="modal-title">新增區域設定</h4>
        <h4 v-else class="modal-title">變更區域設定</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <form role="form">
          <div>
            <div class="form-group">
              <label >
                <h5>區域名稱</h5>
              </label>
              <input  v-if="selectIndex === -1" type="text" v-model="title" class="form-control input-lg" >
              <input  v-else type="text" v-model="title" class="form-control input-lg" disabled>

            </div>
            <Transfer
              :titles="titleList"
              :data="data"
              :target-keys="targetKeys"
              :list-style="listStyle"
              :render-format="render"
              :operations="['到左邊','到右邊']"
              filterable
              @on-change="onChange">
              <div :style="{float: 'right', margin: '5px'}">
                <Button type="ghost" size="small" @click="reloadMockData()">重置
                  <i class="fa fa-refresh"></i>
                </Button>
              </div>
            </Transfer>
          </div>
        </form>
      </div>

      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="addModal = false">離開</button>
        <button v-if="selectIndex === -1" type="button" class="btn btn-primary" @click="toAdd">新增</button>
        <button v-else type="button" class="btn btn-primary" @click="toEdit">更改</button>
      </div>
    </modal>
    <!------------------------------------ Delete modal -------------------------------->
    <modal title="Modal title" class="modal-danger" v-model="deleteFlag" @ok="deleteFlag = false" effect="fade/zoom">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">刪除區域</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <label >
          <h5>確定要刪除 [ {{title}} ] 區域?</h5>
        </label>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="deleteFlag = false">離開</button>
        <button type="button" class="btn btn-danger" @click="toDel">刪除</button>
      </div>
    </modal>
  </div>
</template>

<script>
  import EditItem from './submenu/EditItem'
  import {modal, spinner} from 'vue-strap'
  import { mapGetters } from 'vuex'

  function getItem (name, length) {
    return {
      title: name,
      total: length,
      active: length
    }
  }

  function getItems (lists) {
    var items = []
    for (var i = 0; i < lists.length; i++) {
      let myZone = lists[i]
      items.push(getItem(myZone.name, myZone.deviceList.length))
    }
    return items
  }

  export default {
    name: 'zone',
    components: {
      'edit-item': EditItem,
      modal,
      spinner
    },
    computed: {
      ...mapGetters([
        'zoneList'
      ])
    },
    created () {
      this.initData()
    },
    data () {
      return {
        addModal: false,
        deleteFlag: false,
        selectIndex: -1,
        map: {},
        titleList: ['可加入裝置列表', '已加入裝置列表'],
        data: [],
        targetKeys: [],
        listStyle: {
          width: '250px',
          height: '300px'
        },
        title: '',
        items: []
      }
    },
    methods: {
      initData () {
        if (this.$store.getters.bindDeviceList.length === 0) {
          this.$store.dispatch('getBindDeviceList').then(response => {
            console.log('$ deviceList is empty reload =>  getBindDeviceList : ' + response.data.length)
            this.getZones()
          }).catch(function (error) {
            console.log('? getBindDeviceList  error :' + error)
          })
        } else {
          this.getZones()
        }
      },
      getZones () {
        this.$store.dispatch('getZones').then(response => {
          console.log('$ getZones : ' + response.data.length)
          if (response.data.length > 0) {
            this.items = getItems(response.data)
          }
          this.reloadMockData(0)
        }).catch(function (error) {
          console.log('?  getZones  error :' + error)
        })
      },
      onEdit (index) {
        this.selectIndex = index
        this.title = this.$store.getters.zoneList[index].name
        this.reloadMockData()
        this.addModal = true
        console.log('Zone receive click-edit : ' + index + ' , type : ' + typeof index)
      },
      toEdit () {
        this.addModal = false
        this.$refs.spinner.show()
        this.$store.dispatch('updateZone', this.getZoneData()).then(response => {
          this.title = ''
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
          this.getZones()
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
          this.$refs.spinner.hide()
        })
      },
      onDel (index) {
        this.selectIndex = index
        this.title = this.$store.getters.zoneList[index].name
        this.deleteFlag = true
      },
      toDel () {
        this.$refs.spinner.show()
        var index = this.selecttIndex
        this.deleteFlag = false
        console.log('Zone receice click-del : ' + index + ' , type : ' + typeof index)
        this.$store.dispatch('deleteZone', this.title).then(response => {
          this.title = ''
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
          this.getZones()
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
          this.$refs.spinner.hide()
        })
        /* this.items.splice(index, 1)
        for (var i = 0; i < this.items.length; i++) {
          if (i % 3 === 0) {
            this.items[i].isActive = false
          } else {
            this.items[i].isActive = true
          }
        } */
      },
      onAdd () {
        this.selectIndex = -1
        this.title = ''
        this.reloadMockData()
        this.addModal = true
      },
      toAdd () {
        this.$refs.spinner.show()
        this.addModal = false
        this.$store.dispatch('addZone', this.getZoneData()).then(response => {
          this.title = ''
          console.log('$ onAddProfile : ' + JSON.stringify(response.data))
          this.getZones()
          this.$refs.spinner.hide()
        }).catch(function (error) {
          console.log('? onAddProfile  error :' + error)
          this.$refs.spinner.hide()
        })
      },
      getZoneData () {
        var zone = {name: this.title}
        var keys = this.targetKeys
        var devices = this.$store.getters.bindDeviceList
        var list = []
        for (let i = 0; i < keys.length; i++) {
          let key = Number(keys[i])
          list.push(devices[key].name)
        }
        zone.deviceList = list
        console.log('toAdd list : ' + JSON.stringify(zone))
        return zone
      },
      getMockData (filter) {
        let mockData = []
        let map = {}
        var devices = this.$store.getters.bindDeviceList

        if (devices.length > 0) {
          for (let i = 0; i < devices.length; i++) {
            let a = filter.indexOf(devices[i].name)
            // console.log(' name: ' + devices[i].name + ' , index : ' + a)
            if (a === -1) { // If not find in filter
              mockData.push({
                key: i.toString(),
                label: devices[i].name,
                description: i
              })
              map[devices[i].name] = i.toString()
            }
          }
        }
        // console.log('map :' + JSON.stringify(map))
        // console.log(' getMockData () :' + JSON.stringify(mockData))
        this.map = map
        return mockData
      },
      getTargetKeys (filter, index) {
        var targetKeys = []
        console.log('??? this.data : ' + JSON.stringify(this.data))
        if (index > -1) {
          var lists = this.$store.getters.zoneList[index].deviceList
          console.log('*** lists : ' + JSON.stringify(lists))
          console.log('??? map : ' + JSON.stringify(this.map))
          for (var i = 0; i < lists.length; i++) {
            let a = this.map[lists[i]]
            if (a !== undefined) {
              targetKeys.push(a)
            }
          }
        }
        console.log('??? targetKeys : ' + JSON.stringify(targetKeys))
        return targetKeys
      },
      getFilter (index) {
        var zones = this.$store.getters.zoneList
        var filter = []
        // Get has added device list for filter
        for (let i = 0; i < zones.length; i++) {
          if (i !== index) {
            filter = filter.concat(zones[i].deviceList)
          }
        }
        console.log(' get  filter devices : ' + JSON.stringify(filter))
        return filter
      },
      onChange (newTargetKeys) {
        // newTargetKeys.sort()
        console.log('newTargetKeys : ' + newTargetKeys)
        this.targetKeys = newTargetKeys
      },
      render (item) {
        return item.label
      },
      reloadMockData () {
        // If selectIndex is -1 , no filter
        var filter = this.getFilter(this.selectIndex)
        this.data = this.getMockData(filter)
        this.targetKeys = this.getTargetKeys(filter, this.selectIndex)
      }
    }
  }
</script>

<style lang="css">
  .editmenu {
    padding: 0px;
  }
  .editmenu .editmenu-item {
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
</style>
