<template>
  <div>
    <div class="menuedit-content">
      <div class="site-name"><span><img class="menuedit-icon m-r8" src="static/img/ico_manhole_small.png"/></span><span class="r">{{params.title}}</span></div>
      <div class="row site-text m-0">
        <div class="col-6 text-total">
          <div class="text-title">總數</div>
          <div class="text-num">{{params.total}}</div>
        </div>
        <div class="col-6 text-opened">
          <div class="text-title">啟用</div>
          <div class="text-num">{{params.active}}</div>
        </div>
      </div>
    </div>
    <div class="site-bottom row">
      <div class="col-6 text-btn text-edit" @click="onClickEdit"><img src="static/img/btn_edit_n.png"/>Edit</div>
      <div class="col-6 text-btn text-delete" @click="onClickDel"><img src="static/img/btn_delete_n.png"/>Delete</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'edit-item',
    props: {
      params: Object,
      tag: Number
    },
    methods: {
      onClickEdit () {
        console.log('Child item click edit: ' + this.tag + ' , type : ' + typeof this.tag)
        this.$emit('click-edit', this.tag)
      },
      onClickDel () {
        console.log('Child item click del: ' + this.tag + ' , type : ' + typeof this.tag)
        this.$emit('click-del', this.tag)
      }
    }
  }
</script>
<style>
  .menuedit-content {
    height: 108px;
    padding: 8px 11px;
  }
  .site-name {
    font-weight: 600;
    color: #ffffff;
    font-size: 19px;
  }
  .site-name span {
    display: inline-block;
  }
  .menuedit-icon {
    vertical-align: text-top;
    width: 25px;
    height: 25px;
  }
  .site-bottom {
    height: 48px;
    text-align: center;
    border-radius: 0 0 6px 6px;
    background-color: #ffffff;
    margin-left: 0px;
    margin-right: 0px;
  }
  .site-text {
    height: 72px;
    padding-top: 10px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 8px;
  }
  .site-text .text-total {
    border-right: 1.5px solid rgba(250, 250, 250, 0.4);
  }
  .site-text .text-num {
    font-size: 24px;
  }
  .text-btn {
    padding-top: 13px;
    font-size: 14px;
  }
</style>
