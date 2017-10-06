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
        <div class="m-t33 editmenu-item" v-bind:class="{ 'm-l32': item.isActive }">
          <edit-item :params="item" :tag="index" @click-edit="onEdit" @click-del="onDel"></edit-item>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
  import EditItem from './submenu/EditItem'
  export default {
    name: 'zone',
    components: {
      'edit-item': EditItem
    },
    data () {
      return {
        items: [
          {
            title: '永齡農場',
            isActive: false,
            total: 2,
            active: 2
          },
          {
            title: '區域1',
            isActive: true,
            total: 2,
            active: 0
          },
          {
            title: '區域2',
            isActive: true,
            total: 0,
            active: 0
          }
        ]
      }
    },
    methods: {
      onEdit (index) {
        console.log('Zone receice click-edit : ' + index + ' , type : ' + typeof index)
      },
      onDel (index) {
        console.log('Zone receice click-del : ' + index + ' , type : ' + typeof index)
        this.items.splice(index, 1)
        for (var i = 0; i < this.items.length; i++) {
          if (i % 3 === 0) {
            this.items[i].isActive = false
          } else {
            this.items[i].isActive = true
          }
        }
      },
      onAdd () {
        var length = this.items.length
        var item = {}
        Object.assign(item, this.items[0])
        console.log('length : ' + length + ' , items : ' + JSON.stringify(item))
        item.total = 0
        item.active = 0
        item.title = 'Zone' + (length + 1)
        if ((length % 3) === 0) {
          item.isActive = false
        } else {
          item.isActive = true
        }
        var debug = true
        if (debug === true) {
          this.items.push(item)
        }
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
