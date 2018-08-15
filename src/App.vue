<template>
  <div id="app">
   <!--  <iframe v-if="baseUrl === '/api'" src="http://www.whdse.cn:56015/cas-server/login?service=http://www.whdse.cn:56015/znb/index.html" frameborder="0"></iframe> -->
    <hui-routerview-slide></hui-routerview-slide>
    <hui-nav3 :data="nav3Data" v-show="isVisible"></hui-nav3>
  </div>
</template>

<script>
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'
import {getServerErrorMessageAsHtml} from 'hui/lib/util.js'
import {setItem} from '@/assets/js/session'
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
    getFilePathUrl () {
      api.getFilePathUrl()
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            if (res.data && res.data.filePathUrl) {
              setItem('filePathUrl', res.data.filePathUrl)
            }
          } else {
            this.$message({
              content: res.msg
            })
          }
        }, (err) => {
          this.$message({
            content: getServerErrorMessageAsHtml(err, 'App.vue -> getFilePathUrl'),
            icon: 'hui-icon-warn'
          })
        })
    }
  },
  created () {
    // this.getFilePathUrl()
    this.baseUrl = process.env.API_HOST
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
