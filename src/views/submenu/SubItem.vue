<template>
  <div>
    <div class="submenu-content m-t33" @click="onClick">
      <div class="site-name"><span><img class="submenu-icon m-r8" src="static/img/ico_manhole_small.png"/></span><span class="r">{{params.title}}</span></div>
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
    <div class="site-arrow"><img src="static/img/ico_double_arrows_down.png"/></div>
    <div class="submenu-footer"></div>
  </div>
</template>
<script>
  export default {
    name: 'sub-item',
    props: {
      params: Object,
      tag: Number
    },
    methods: {
      onClick () {
        console.log('Child item click : ' + this.tag + ' , type : ' + typeof this.tag)
        this.$emit('click-item', this.tag)
      }
    }
  }
</script>
<style>
  .submenu-content {
    height: 108px;
    padding: 8px 11px;
  }
  .submenu-item .site-name {
    font-weight: 600;
    color: #ffffff;
    font-size: 19px;
  }
  .submenu-item .site-name span {
    display: inline-block;
  }
  .submenu-icon {
    vertical-align: text-top;
    width: 25px;
    height: 25px;
  }
  .submenu-arrow {
    width: 12px;
    height: 12px;
  }
  .submenu-item .site-arrow {
    height: 28px;
    text-align: center;
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
  .submenu-footer {
    position: relative;
    width: 100%;
    position: absolute;
    top: 108px;
    height: 28px;
    opacity: 0.14;
    background-color: #ffffff;
  }
</style>
