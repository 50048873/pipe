<template>
  <div class="page pipeFixSign">
    <form class="form" v-if="currentIndex === 0">
      <ul class="line-bottom signInfo">
        <li>
          <div class="title">
            <i class="hui-icon-bell"></i>
            <span>签到时间：</span>
          </div>
          <div class="content">
            <time>{{signInfo.time}}</time>
          </div>
        </li>
        <li>
          <div class="title">
            <i class="hui-icon-bell"></i>
            <span>签到点：</span>
          </div>
          <div class="content">{{signInfo.address}}</div>
        </li>
        <li>
          <div class="title">
            <i class="hui-icon-bell"></i>
            <span>当前位置：</span>
          </div>
          <div class="content">
            <span><input ref="currentPlace" class="currentPlace" type="text" placeholder="请输入当前位置" required v-model="signInfo.currentAddress"></span>
            <em v-show="signInfo.distance">（距离最近签到点{{signInfo.distance | handleDecimalLength(0)}}米）</em>
          </div>
        </li>
      </ul>
      <div class="signMapWrap line-top line-bottom">
        <div id="view_pipeFixSign"></div>
      </div>
      <div class="signPhotoWrap">
        <hui-uploader title="签到照片" @fileChanged="fileChanged"></hui-uploader>
      </div>
      <div class="submitWrap">
        <button class="btn" :class="getSignBtnStatusClass" @click.prevent="sign" :disabled="disabled">签到</button>
      </div>
    </form>
    <list3 :data="signedData" v-if="currentIndex === 1"></list3>
    <tabs @tabChange="tabChange"></tabs>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
import List3 from '@/components/List3'
import * as esriLoader from 'esri-loader'
import {options, success} from '@/assets/js/config'
import {getTiandituMap} from '@/assets/js/util'
import {mapGetters} from 'vuex'
import moment from 'moment'
import {calDistance, _handleDecimalLength, markPoint} from '@/assets/js/mixin'
import {getServerErrorMessageAsHtml} from 'hui/lib/util.js'
import * as api from '@/assets/js/api'

let signedData = [
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  }
]
export default {
  components: {
    Tabs,
    List3
  },
  data () {
    return {
      currentIndex: 0,
      signedData: signedData,
      signInfo: {
        time: moment().format('YYYY-MM-DD'),
        address: '',
        currentAddress: ' 测试位置01',
        distance: null,
        files: []
      },
      disabled: false
    }
  },
  mixins: [calDistance, _handleDecimalLength, markPoint],
  computed: {
    ...mapGetters(['signPoint']),
    getSignBtnStatusClass () {
      return this.signInfo.distance <= 50 ? 'color-theme' : 'color-disabled'
    }
  },
  methods: {
    fileChanged (files) {
      this.signInfo.files = files
    },
    validate () {
      if (!this.signInfo.currentAddress) {
        this.$message({
          content: '请输入当前位置'
        })
        this.$refs.currentPlace.focus()
        return false
      }
      return true
    },
    sign () {
      if (this.signInfo.distance <= 50) {
        this.signInfo.time = moment().format('YYYY-MM-DD HH:mm')
        this.addSign()
      } else {
        this.$message({
          content: '50米范围内才能签到（含50米）！'
        })
      }
    },
    addSign () {
      if (!this.validate()) return
      this.disabled = true

      let params = new FormData()

      params.append('pointCode', this.signInfo.address)
      params.append('addrNow', this.signInfo.currentAddress)

      this.signInfo.files.forEach(function (item) {
        params.append('files', item)
      })
      return api.addSign(params)
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            console.log(res)
            this.$message({
              content: res.msg,
              time: 400
            })
          } else {
            this.$message({
              content: res.msg
            })
          }
        }, (err) => {
          this.$message({content: getServerErrorMessageAsHtml(err, 'PipeFixSign.vue->save'), icon: 'hui-icon-warn'})
        })
    },
    tabChange (index) {
      this.currentIndex = index
    },
    error (error) {
      console.log('error', error)
    },
    markSingleInspector (view, coord) {
      esriLoader.loadModules([
        'esri/Graphic'
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude

        // First create a point geometry
        var point = {
          type: 'point', // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        var color = coord.id === this.currentInspectorId ? 'orange' : 'blue'

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          color: color,
          size: 22,
          outline: {
            width: 0,
            color: [255, 255, 255, 0]
          },
          path: 'M57.083,57.722v2.344c4.87,0.671,8.251,2.122,8.251,3.81c0,2.324-6.398,4.208-14.292,4.208v-3.601h2.967V51.455h4.063V40.62  c-0.791-1.182-3.344-1.161-3.344-1.161h-2.436v-0.569c1.51-0.521,2.601-1.938,2.601-3.625c0-2.126-1.724-3.85-3.851-3.85  s-3.851,1.724-3.851,3.85c0,1.687,1.091,3.104,2.601,3.625v0.569h-2.313c-2.711,0-3.468,1.161-3.468,1.161v10.964h3.935v12.898  h3.095v3.601c-7.893,0-14.292-1.884-14.292-4.208c0-1.688,3.381-3.139,8.25-3.81v-2.344c-8.068,0.834-13.917,3.292-13.917,6.195  c0,3.59,8.936,6.5,19.958,6.5c11.022,0,19.958-2.91,19.958-6.5C71,61.014,65.151,58.556,57.083,57.722z'
        }

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: coord
        })
        // console.log(pointGraphic)
        // Add the line graphic to the view's GraphicsLayer
        view.graphics.add(pointGraphic)
      })
    },
    async handlePosition (position) {
      console.log('handlePosition', position)
      let longitude = position.coords.longitude
      let latitude = position.coords.latitude

      // 移除之前自己的位置
      let graphic = this.view.graphics.items.find((graphic) => {
        if (graphic.attributes) {
          return graphic.attributes.id === this.currentInspectorId
        }
      })
      this.view.graphics.remove(graphic)

      this.markSingleInspector(this.view, {longitude, latitude, id: this.currentInspectorId})
      this.view.goTo([longitude, latitude])

      let nearestSignPointInfo = await this.getNearestSignPointInfo(longitude, latitude)
      console.log(nearestSignPointInfo)
      this.signInfo.distance = nearestSignPointInfo.nearestDistance
      this.signInfo.address = nearestSignPointInfo.signAddress
    },
    async getNearestSignPointInfo (longitude, latitude) {
      let arr = []
      let nearestDistance
      let index
      let signPointInfo

      for (let item of this.signPoint) {
        let distance = await this.calDistance([longitude, latitude], [item.longitude, item.latitude])
        arr.push(distance)
      }

      // 获取巡检人到最近签到点的距离
      nearestDistance = Math.min.apply(Math, arr)

      // 获取巡检人到最近签到点对象
      index = arr.findIndex((item) => {
        return item === nearestDistance
      })
      signPointInfo = this.signPoint[index]
      signPointInfo.nearestDistance = nearestDistance

      return signPointInfo
    },
    watchPosition () {
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition((position) => {
          this.handlePosition(position)
        }, (err) => {
          this.error(err)
        }, {
          // 指示浏览器获取高精度的位置，默认为false
          enableHighAcuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 15000,
          // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
          maximumAge: 0
        })
      }
    },
    async initPipeFixMap () {
      // 加载天地图
      var map = await getTiandituMap()

      esriLoader.loadModules([
        'esri/views/MapView'
      ], options).then(async ([MapView]) => {
        // 创建MapView
        var view = new MapView({
          container: 'view_pipeFixSign',
          spatialReference: {
            wkid: 4326
          },
          map: map,
          center: [114.360694, 30.584929],
          // 1:scale的图
          scale: 2000,
          popup: {
            dockEnabled: true,
            dockOptions: {
              // Disables the dock button from the popup
              buttonEnabled: true,
              // Ignore the default sizes that trigger responsive docking
              breakpoint: {
                width: 320
              },
              position: 'top-center'
            }
          }
        })

        // 移除esri log
        view.ui._removeComponents(['attribution'])
        // 移除缩放图标
        view.ui.remove('zoom')

        this.map = map
        this.view = view

        // 标记签到点
        this.markMultiSignPoint(this.signPoint)

        // 标记自己的位置
        this.watchPosition()
      })
    },
    markMultiSignPoint (coords) {
      let len = coords && coords.length
      if (!len) return
      for (let i = 0; i < len; i++) {
        let coord = coords[i]
        this.markPoint({
          width: '26px',
          height: '26px',
          coord,
          svg: 'flag.svg'
        })
      }
    },
    initSingleDirectionParam () {
      this.view = null // 视图
      this.map = null // 地图
      this.watchId = null // 定位id
      this.currentInspectorId = 0 // 当前巡检人
    }
  },
  created () {
    this.initSingleDirectionParam()
  },
  mounted () {
    this.initPipeFixMap()
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFixSign {
    z-index: 9;
    padding-bottom: 40px;
    .form {
      padding-top: 5px;
    }
    .signInfo {
      margin-bottom: @margin-small;
      background-color: white;
      padding: @margin-medium;
      li {
        display: flex;
        margin-top: @margin-small;
        .title {
          width: 7em;
          color: @color-text-light;
          [class^="hui-icon"] {
            margin-right: 4px;
          }
        }
        .content {
          flex: 1;
          time {
            vertical-align: -2px;
          }
          em {
            display: block;
            color: @color-red;
            font-size: 12px;
            font-style: normal;
            margin-top: @margin-small
          }
          .currentPlace {
            width: 100%;
          }
        }
        &:first-child {
          margin-top: 0;
        }
      }
    }
    #view_pipeFixSign {
      width: 100%;
      height: 260px;
      background-color: white;
    }
    .signPhotoWrap {
      margin: @margin-medium;
    }
    .signBtnWrap {
      margin: @margin-medium;
    }
  }
</style>
