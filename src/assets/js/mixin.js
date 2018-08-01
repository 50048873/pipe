import path from './config'

export let getStaticPath = {
  methods: {
    getStaticPath (imgUrl) {
      return path + imgUrl
    }
  }
}
