<template>
  <div @click="onClick">
    <div class="inline field">
      <label>Date: </label>
      <span>{{rowData.date}}</span>
    </div>
    <div class="inline field">
      <label>Data: </label>
      <span>{{rowData.data}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      rowData: {
        type: Object,
        required: true
      },
      rowIndex: {
        type: Number
      }
    },
    methods: {
      onClick (event) {
        console.log('my-detail-row: on-click', event.target)
      }
    }
  }
</script>
