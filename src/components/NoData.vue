<template>
  <div class="NoData">
    <span class="line"></span>
    <span class="title">{{title}}</span>
    <span class="line"></span>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    title: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/variable.less';
.NoData {
  position: relative;
  width: 100%;
  background-color: transparent;
  text-align: center;
  color: #dddddd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  .title {
    width: 6em;
  }
  .line {
    flex: 0 0 25%;
    height: 1px;
    background-color: currentColor;
  }
}
</style>
