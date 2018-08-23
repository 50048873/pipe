<template>
  <div class="ProgressBar">
    <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">60%</div>
  </div>
</template>

<script>

export default {
  name: 'ProgressBar'
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .ProgressBar {
    height: 14px;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    .progress-bar {
      float: left;
      width: 0;
      height: 100%;
      font-size: 12px;
      line-height: 14px;
      color: #fff;
      text-align: center;
      background-color: @color-theme;
      -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
      box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
      -webkit-transition: width .6s ease;
      -o-transition: width .6s ease;
      transition: width .6s ease;
    }
  }
</style>
