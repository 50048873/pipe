<template>
  <div id="app">
    <hui-routerview-slide></hui-routerview-slide>
    <hui-nav3 :data="nav3Data" v-show="isVisible"></hui-nav3>
  </div>
</template>

<script>
import * as api from '@/assets/js/api'
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
      nav3Data: nav3Data,
      isVisible: true
    }
  },
  methods: {
    getSessionUser () {
      api.getSessionUser()
        .then((res) => {
          // console.log(res)
        }, (err) => {
          console.log(err)
        })
    }
  },
  created () {
    this.getSessionUser()
  },
  watch: {
    '$route' (to, from) {
      switch (to.name) {
        case 'Home':
          this.isVisible = true
          break
        case 'Warn':
          this.isVisible = true
          break
        case 'Message':
          this.isVisible = true
          break
        case 'PersonalCenter':
          this.isVisible = true
          break
        default:
          this.isVisible = false
      }
    }
  }
}
</script>

<style scoped lang="less">
  iframe {
    display: none;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10;
    border: 1px solid;
    box-sizing: border-box;
  }
</style>
