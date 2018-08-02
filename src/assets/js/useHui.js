import Vue from 'vue'
import * as Hui from 'hui'
import 'hui/src/assets/less/hui.css'
import 'hui/src/assets/font-hui/style.css'
export default () => {
  Vue.use(Hui.RouterviewSlide)
  Vue.use(Hui.Nav3)
  Vue.use(Hui.Message)
  Vue.use(Hui.Uploader)
  Vue.use(Hui.FloatBall)
}
