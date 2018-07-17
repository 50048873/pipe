import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Warn from '@/pages/Warn'
import Message from '@/pages/Message'
import MessageDetail from '@/pages/MessageDetail'
import PersonalCenter from '@/pages/PersonalCenter'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'ON',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/warn',
      name: 'Warn',
      component: Warn
    },
    {
      path: '/message',
      name: 'Message',
      component: Message
    },
    {
      path: '/message/:id',
      name: 'MessageDetail',
      component: MessageDetail,
      props: true
    },
    {
      path: '/personalCenter',
      name: 'PersonalCenter',
      component: PersonalCenter
    }
  ]
})
