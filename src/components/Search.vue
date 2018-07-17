<template>
  <div class="Search">
    <i class="hui-icon-search"></i>
    <input type="text" :placeholder="placeholder" />
  </div>
</template>

<script>

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索关键字'
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .Search {
    position: relative;
    color: @color-text;
    i {
      position: absolute;
      top: 50%;
      left: 15px;
      transform: translateY(-50%);
    }
    input {
      display: block;
      width: 100%;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      background-color: #dcdcdc;
      border-radius: 14px;
      padding-left: 38px;
    }
  }
</style>
