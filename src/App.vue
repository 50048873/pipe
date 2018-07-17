<template>
  <div id="app">
    <hui-routerview-slide></hui-routerview-slide>
    <hui-nav3 :data="nav3Data"></hui-nav3>
  </div>
</template>

<script>
let nav3Data = [
  {
    title: '首页',
    icon: 'hui-icon-bell',
    to: '/home'
  },
  {
    title: '预警',
    icon: 'hui-icon-bell',
    to: '/warn'
  },
  {
    title: '消息',
    icon: 'hui-icon-bell',
    to: '/message'
  },
  {
    title: '个人中心',
    icon: 'hui-icon-bell',
    to: '/personalCenter'
  }
]
export default {
  data () {
    return {
      nav3Data: nav3Data
    }
  }
}
</script>
