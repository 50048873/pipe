import {path} from './config'
import {
  addAndroidInputBugFixEvent,
  removeAndroidInputBugFixEvent,
  isString
} from 'hui/lib/util.js'

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

export let replaceSomeCharacter = {
  methods: {
    replaceSomeCharacter (url, searchCharacter, replaceCharacter) {
      if (isString(url) && url.indexOf(searchCharacter) > -1) {
        return url.replace(searchCharacter, replaceCharacter)
      }
      return url
    }
  }
}
