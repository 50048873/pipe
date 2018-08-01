import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Warn from '@/pages/Warn'
import WarnDetail from '@/pages/WarnDetail'
import Message from '@/pages/Message'
import MessageDetail from '@/pages/MessageDetail'
import PersonalCenter from '@/pages/PersonalCenter'
import PipeInfo from '@/pages/PipeInfo'
import PipeMonitor from '@/pages/PipeMonitor'
import PipeCalc from '@/pages/PipeCalc'
import PipeFix from '@/pages/PipeFix'
import PipeFixHiddenTrouble from '@/pages/PipeFixHiddenTrouble'
import PipeAnalyze from '@/pages/PipeAnalyze'

Vue.use(Router)

let routes = new Router({
  mode: 'history',
  linkActiveClass: 'ON',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '管网管理'
      }
    },
    {
      path: '/pipeInfo',
      name: 'PipeInfo',
      component: PipeInfo,
      meta: {
        title: '管网信息'
      }
    },
    {
      path: '/pipeMonitor',
      name: 'PipeMonitor',
      component: PipeMonitor,
      meta: {
        title: '管网监测'
      }
    },
    {
      path: '/pipeCalc',
      name: 'PipeCalc',
      component: PipeCalc,
      meta: {
        title: '分区计量'
      }
    },
    {
      path: '/pipeFix',
      redirect: '/pipeFix/hiddenTrouble',
      name: 'PipeFix',
      component: PipeFix,
      meta: {
        title: '巡检抢修'
      },
      children: [
        {
          path: '/pipeFix/hiddenTrouble',
          name: 'PipeFixHiddenTrouble',
          component: PipeFixHiddenTrouble,
          meta: {
            title: '巡检上报'
          }
        }
      ]
    },
    {
      path: '/pipeAnalyze',
      name: 'PipeAnalyze',
      component: PipeAnalyze,
      meta: {
        title: '统计分析'
      }
    },
    {
      path: '/warn',
      name: 'Warn',
      component: Warn,
      meta: {
        title: '预警消息'
      }
    },
    {
      path: '/warn/:id',
      name: 'WarnDetail',
      component: WarnDetail,
      props: true,
      meta: {
        title: '上报详情'
      }
    },
    {
      path: '/message',
      name: 'Message',
      component: Message,
      meta: {
        title: '消息'
      }
    },
    {
      path: '/message/:id',
      name: 'MessageDetail',
      component: MessageDetail,
      props: true,
      meta: {
        title: '工单详情'
      }
    },
    {
      path: '/personalCenter',
      name: 'PersonalCenter',
      component: PersonalCenter,
      meta: {
        title: '个人中心'
      }
    }
  ]
})

routes.beforeEach((to, from, next) => {
  let title
  if (to.meta && to.meta.title) {
    title = to.meta.title
    if (to.query && to.query.title) {
      title = to.query.title + title
    }
    document.title = title
  }
  next()
})

export default routes
