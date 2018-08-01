<template>
  <div class="page pipeFix">
    <hui-nav3 :data="data2" position="top" height="34px" :isActiveLine="isActiveLine"></hui-nav3>
    <router-view></router-view>
  </div>
</template>

<script>
let data2 = [
  {
    title: '隐患',
    to: '/pipeFix/hiddenTrouble'
  },
  {
    title: '智慧水务',
    to: '/home/systemMenu'
  },
  {
    title: '通讯录',
    to: '/home/addressBook'
  },
  {
    title: '我的',
    to: '/home/me'
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
  .pipeFix {
  }
</style>
