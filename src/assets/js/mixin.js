import {path} from './config'
import {
  addAndroidInputBugFixEvent,
  removeAndroidInputBugFixEvent,
  isString
} from 'hui/lib/util.js'
import moment from 'moment'

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

export let toKilometre = {
  filters: {
    toKilometre (value) {
      if (value || value === 0) {
        return (value / 1000).toFixed(2)
      }
    }
  }
}

export let dateFormat = {
  filters: {
    dateFormat (value, format) {
      if (value) {
        return moment(value).format(format)
      }
    }
  },
  methods: {
    dateFormat (value, format) {
      if (value) {
        return moment(value).format(format)
      }
    }
  }
}
