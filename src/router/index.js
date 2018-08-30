import Vue from 'vue'
import Router from 'vue-router'
import {path} from '@/assets/js/config'
import Home from '@/pages/Home'
import PipeInfo from '@/pages/PipeInfo'
import PipeMonitor from '@/pages/PipeMonitor'
import PipeCalc from '@/pages/PipeCalc'
import PipeFix from '@/pages/PipeFix'
import PipeFixInspectReport from '@/pages/PipeFixInspectReport'
import PipeFixInspectReportHiddenTrouble from '@/pages/PipeFixInspectReportHiddenTrouble'
import PipeFixInspectReportConstructingProject from '@/pages/PipeFixInspectReportConstructingProject'
import PipeFixInspectReportRoadImprove from '@/pages/PipeFixInspectReportRoadImprove'
import PipeFixInspectReportOther from '@/pages/PipeFixInspectReportOther'
import PipeFixSign from '@/pages/PipeFixSign'
import PipeFixInspectTask from '@/pages/PipeFixInspectTask'
import PipeAnalyze from '@/pages/PipeAnalyze'

import Message from '@/pages/Message'
import MessageDetail from '@/pages/MessageDetail'
import PersonalCenter from '@/pages/PersonalCenter'

import ProblemList from '@/components/ProblemList'
import ProblemDetail from '@/components/ProblemDetail'
import MarkPolygon from '@/components/MarkPolygon'
import MarkPolyline from '@/components/MarkPolyline'

Vue.use(Router)

let routes = new Router({
  base: path,
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
      },
      children: [
        {
          path: '/pipeFix/pipeFixInspectReport',
          redirect: '/pipeFix/pipeFixInspectReport/hiddenTrouble',
          name: 'PipeFixInspectReport',
          component: PipeFixInspectReport,
          children: [
            {
              path: '/pipeFix/pipeFixInspectReport/hiddenTrouble',
              name: 'PipeFixInspectReportHiddenTrouble',
              component: PipeFixInspectReportHiddenTrouble,
              meta: {
                title: '巡检上报'
              }
            },
            {
              path: '/pipeFix/pipeFixInspectReport/constructingProject',
              name: 'PipeFixInspectReportConstructingProject',
              component: PipeFixInspectReportConstructingProject,
              meta: {
                title: '巡检上报'
              },
              children: [
                {
                  path: '/pipeFix/pipeFixInspectReport/constructingProject/markPolygon',
                  name: 'MarkPolygon',
                  component: MarkPolygon
                }
              ]
            },
            {
              path: '/pipeFix/pipeFixInspectReport/roadImprove',
              name: 'PipeFixInspectReportRoadImprove',
              component: PipeFixInspectReportRoadImprove,
              meta: {
                title: '巡检上报'
              },
              children: [
                {
                  path: '/pipeFix/pipeFixInspectReport/constructingProject/markPolyline',
                  name: 'MarkPolyline',
                  component: MarkPolyline
                }
              ]
            },
            {
              path: '/pipeFix/pipeFixInspectReport/other',
              name: 'PipeFixInspectReportOther',
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
          path: '/pipeFix/pipeFixInspectTask',
          name: 'PipeFixInspectTask',
          component: PipeFixInspectTask,
          meta: {
            title: '巡检任务选择'
          }
        },
        {
          path: '/pipeFix/pipeFixList',
          name: 'PipeFixList',
          component: ProblemList,
          meta: {
            title: '巡检工作'
          }
        }
      ]
    },
    {
      path: '/pipeFix/pipeFixList/:id',
      name: 'PipeFixDetail',
      component: ProblemDetail,
      props: true,
      meta: {
        title: '上报详情'
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
