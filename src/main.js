/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueLazyloader from 'vue-lazyload'
Vue.use(VueLazyloader, {
  loading: require('@/assets/img/imageLoading.gif'),
  error: require('@/assets/img/placeholder.png'),
  preLoad: 1.3,
  attempt: 1
})

// import VConsole from 'vconsole'
// new VConsole()

import '@/assets/less/common.less'

import useHui from '@/assets/js/useHui'
useHui()

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
