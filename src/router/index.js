/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'                                                                                 // 首页
import PipeInfo from '@/pages/PipeInfo'                                                                         // 首页 -> 管网信息
import PipeMonitor from '@/pages/PipeMonitor'                                                                   // 首页 -> 管网监测
import PipeCalc from '@/pages/PipeCalc'                                                                         // 首页 -> 分区计量
import PipeFix from '@/pages/PipeFix'                                                                           // 首页 -> 巡检抢修
import PipeFixInspectReport from '@/pages/PipeFixInspectReport'                                                 // 首页 -> 巡检抢修 -> 巡检上报
import PipeFixInspectReportHiddenTrouble from '@/pages/PipeFixInspectReportHiddenTrouble'                       // 首页 -> 巡检抢修 -> 巡检上报 -> 隐患
import PipeFixInspectReportConstructingProject from '@/pages/PipeFixInspectReportConstructingProject'           // 首页 -> 巡检抢修 -> 巡检上报 -> 在建工程
import PipeFixInspectReportRoadImprove from '@/pages/PipeFixInspectReportRoadImprove'                           // 首页 -> 巡检抢修 -> 巡检上报 -> 道路改造
import PipeFixInspectReportOther from '@/pages/PipeFixInspectReportOther'                                       // 首页 -> 巡检抢修 -> 巡检上报 -> 其他
import PipeFixSign from '@/pages/PipeFixSign'                                                                   // 首页 -> 巡检抢修 -> 巡检签到
import PipeAnalyze from '@/pages/PipeAnalyze'                                                                   // 首页 -> 统计分析

import Message from '@/pages/Message'                                                                           // 消息
import MessageDetail from '@/pages/MessageDetail'                                                               // 消息详情
import PersonalCenter from '@/pages/PersonalCenter'                                                             // 个人中心

import ProblemList from '@/components/ProblemList'                                                              // 预警列表（首页 -> 巡检抢修 -> 巡检列表）
import ProblemDetail from '@/components/ProblemDetail'                                                          // 预警详情（首页 -> 巡检抢修 -> 巡检详情）

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
      name: 'PipeFix',
      component: PipeFix,
      meta: {
        title: '巡检抢修'
      }
    },
    {
      path: '/pipeFix/pipeFixInspectReport',
      redirect: '/pipeFix/pipeFixInspectReport/hiddenTrouble',
      name: 'PipeFixInspectReport',
      component: PipeFixInspectReport,
      meta: {
        title: '巡检上报'
      },
      children: [
        {
          path: '/pipeFix/pipeFixInspectReport/hiddenTrouble',
          name: 'PipeFixHiddenTrouble',
          component: PipeFixInspectReportHiddenTrouble,
          meta: {
            title: '巡检上报'
          }
        },
        {
          path: '/pipeFix/pipeFixInspectReport/constructingProject',
          name: 'PipeFixConstructingProject',
          component: PipeFixInspectReportConstructingProject,
          meta: {
            title: '巡检上报'
          }
        },
        {
          path: '/pipeFix/pipeFixInspectReport/roadImprove',
          name: 'PipeFixRoadImprove',
          component: PipeFixInspectReportRoadImprove,
          meta: {
            title: '巡检上报'
          }
        },
        {
          path: '/pipeFix/pipeFixInspectReport/other',
          name: 'PipeFixOther',
          component: PipeFixInspectReportOther,
          meta: {
            title: '巡检上报'
          }
        }
      ]
    },
    {
      path: '/pipeFix/pipeFixSign',
      name: 'PipeFixSign',
      component: PipeFixSign,
      meta: {
        title: '巡检签到'
      }
    },
    {
      path: '/pipeFix/pipeFixList',
      name: 'PipeFixList',
      component: ProblemList,
      meta: {
        title: '巡检工作'
      }
    },
    {
      path: '/pipeFix/pipeFixList/:id',
      name: 'PipeFixDetail',
      component: ProblemDetail,
      props: true,
      meta: {
        title: '巡检签到'
      }
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
      component: ProblemList,
      meta: {
        title: '预警消息'
      }
    },
    {
      path: '/warn/:id',
      name: 'WarnDetail',
      component: ProblemDetail,
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
