import {path} from './config'
import {addAndroidInputBugFixEvent, removeAndroidInputBugFixEvent} from 'hui/lib/util.js'

export let getStaticPath = {
  methods: {
    getStaticPath (imgUrl) {
      return path + imgUrl
    }
  }
}

export let androidInputBugFixEvent = {
  methods: {
    focus () {
      addAndroidInputBugFixEvent()
    }
  },
  beforeDestroy () {
    removeAndroidInputBugFixEvent()
  }
}
