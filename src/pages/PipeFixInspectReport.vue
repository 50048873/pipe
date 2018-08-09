<template>
  <div class="page pipeFixInspectReport">
    <hui-nav3 :data="data2" position="top" height="34px" :isActiveLine="isActiveLine"></hui-nav3>
    <router-view></router-view>
  </div>
</template>

<script>
let data2 = [
  {
    title: '隐患',
    to: '/pipeFix/pipeFixInspectReport/hiddenTrouble'
  },
  {
    title: '在建工程',
    to: '/pipeFix/pipeFixInspectReport/constructingProject'
  },
  {
    title: '道路改造',
    to: '/pipeFix/pipeFixInspectReport/roadImprove'
  },
  {
    title: '其他',
    to: '/pipeFix/pipeFixInspectReport/other'
  }
]
export default {
  data () {
    return {
      data2: data2,
      isActiveLine: true
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFixInspectReport {
  }
</style>
