import {path} from './config'
import {
  addAndroidInputBugFixEvent,
  removeAndroidInputBugFixEvent,
  isString,
  handleDecimalLength
} from 'hui/lib/util.js'
import moment from 'moment'
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'

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

export let calDistance = {
  methods: {
    calDistance (point1, point2, unit = 'meters') { // 计算距离
      return esriLoader.loadModules([
        'esri/geometry/geometryEngine',
        'esri/geometry/Polyline'
      ], options).then(([geometryEngine, Polyline]) => {
        var line = new Polyline()
        line.addPath([point1, point2])
        var distance = 0
        if (this.map.spatialReference.wkid === 4326 || this.map.spatialReference.isWebMercator()) { // 在web麦卡托投影和WGS84坐标系下的计算方法
          distance = geometryEngine.geodesicLength(line, unit)
        } else { // 在其他投影坐标系下的计算方法
          distance = geometryEngine.planarLength(line, unit)
        }
        return distance
      })
    }
  }
}

export let _handleDecimalLength = {
  filters: {
    handleDecimalLength
  }
}

export let getSubmitBtnClass = {
  computed: {
    getSubmitBtnClass () {
      return this.disabled ? 'color-disabled' : 'color-theme'
    }
  }
}

// 标记单个点
export let markPoint = {
  methods: {
    markPoint ({coord, pointType = 'point', SymbolType = 'picture-marker', svg, width, height, attributes}) {
      esriLoader.loadModules([
        'esri/Graphic'
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude

        // First create a point geometry
        var point = {
          type: pointType, // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: SymbolType, // autocasts as new PictureMarkerSymbol()
          width: width,
          height: height,
          url: '/static/svg/' + svg
        }

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: attributes || coord
        })
        // console.log(pointGraphic)
        // Add the line graphic to the view's GraphicsLayer
        this.view.graphics.add(pointGraphic)
      })
    }
  }
}
