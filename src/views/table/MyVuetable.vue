<template>
  <div>
    <filter-bar v-show="false"></filter-bar>

    <vuetable ref="vuetable"
              :api-url="apiUrl"
              :fields="fields"
              pagination-path=""
              :per-page="10"
              :multi-sort="true"
              :sort-order="sortOrder"
              :append-params="appendParams"
              detail-row-component="detailRowComponent"
              @vuetable:pagination-data="onPaginationData"
              @vuetable:cell-clicked="onCellClicked"
              @vuetable:loaded="isLoded"
    >
      <template slot="actions" scope="props">
        <div class="custom-actions">
          <button class="ui basic button"
                  @click="onAction('view-item', props.rowData, props.rowIndex)">
            <i class="zoom icon"></i>
          </button>
          <button class="ui basic button"
                  @click="onAction('edit-item', props.rowData, props.rowIndex)">
            <i class="edit icon"></i>
          </button>
          <button class="ui basic button"
                  @click="onAction('delete-item', props.rowData, props.rowIndex)">
            <i class="delete icon"></i>
          </button>
        </div>
      </template>
    </vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
                           @vuetable-pagination:change-page="onChangePage">
      </vuetable-pagination>
    </div>

  </div>
</template>

<script>
  import FilterBar from './FilterBar'
  import DetailRow from './DetailRow'
  import {Vuetable, VuetablePagination, VuetablePaginationInfo} from 'vuetable-2'
  import Vue from 'vue'
  import CustomActions from './CustomActions'
  Vue.component('custom-actions', CustomActions)
  Vue.component('my-detail-row', DetailRow)
  Vue.component('filter-bar', FilterBar)

  var url = '/data/todos/user'

  export default {
    components: {
      Vuetable,
      VuetablePagination,
      VuetablePaginationInfo
    },
    props: {
      apiUrl: {
        type: String,
        required: true
      },
      fields: {
        type: Array,
        required: true
      },
      sortOrder: {
        type: Array,
        default () {
          return []
        }
      },
      appendParams: {
        type: Object,
        default () {
          return {}
        }
      },
      detailRowComponent: {
        type: String
      }
    },
    data () {
      return {
      }
    },
    mounted () {
      this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
      this.$events.$on('filter-reset', e => this.onFilterReset())
      this.$events.$on('change-option', e => this.onChangeOption())
    },
    methods: {
      fetchData () {
        Vue.axios.get(url).then((response) => {
          var user = response.data
          this.user = user
        })
      },
      allcap (value) {
        return value.toUpperCase()
      },
      /* genderLabel (value) {
        return value === 'M'
          ? '<span class="ui teal label"><i class="fa fa-male"></i>Male</span>'
          : '<span class="ui pink label"><i class="fa fa-female"></i>Female</span>'
      },
      formatDate (value, fmt = 'YYYY-MMM-D ') {
        return (value == null)
          ? ''
          : moment(value, 'YYYY-MM-DD').format(fmt)
      }, */
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      onAction (action, data, index) {
        console.log('slot) action: ' + action, data.name, index)
      },
      onCellClicked (data, field, event) {
        console.log('cellClicked: ', field.name)
        this.$refs.vuetable.toggleDetailRow(data.id)
      },
      onFilterSet (filterText) {
        console.log('filter-set : ', filterText)
        this.appendParams.filter = filterText
        Vue.nextTick(() => this.$refs.vuetable.refresh())
      },
      onFilterReset () {
        console.log('filter-reset')
        delete this.appendParams.filter
        Vue.nextTick(() => this.$refs.vuetable.refresh())
      },
      onChangeOption (params) {
        console.log('change-option mac : ' + params.mac + ',  from : ' + params.from + ' , to : ' + params.to)
        var time = new Date(params.to)
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
        var time2 = new Date(params.from)
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

        console.log(typeof time)
        this.appendParams.to = toString
        this.appendParams.mac = params.mac
        this.appendParams.from = fromString
        Vue.nextTick(() => this.$refs.vuetable.refresh())
      },
      isLoded () {
        console.log('my-vuetable is loded ')
        this.$emit('close-loded')
      }
    }
  }
</script>
