<template>
  <div class="page pipeFix">
    <div id="view_pipeFix"></div>
    <div class="searchWrap">
      <hui-search
        :center.sync="isCenter"
        @search-change="searchChange"
      >
      </hui-search>
    </div>
    <div class="otherBtnWrap">
      <hui-float-ball
        v-show="addHiddenTroubleAndSignBtn"
        class="addHiddenTroubleRecordBtn"
        left="15"
        bottom="90"
        iconClass="hui-icon-add"
        @ball-click="toHiddenTrouble">
      </hui-float-ball>
      <hui-float-ball
        class="startInspectBtn"
        bottom="90"
        @ball-click="startInspect">
        <div class="animated infinite spin" v-show="inspecting"></div>
        <div class="startText">
          <p>{{getInspectBtnTitle}}</p>
          <p>巡检</p>
        </div>
      </hui-float-ball>
      <hui-float-ball
        v-show="addHiddenTroubleAndSignBtn"
        class="signBtn"
        right="15"
        bottom="90"
        iconClass="hui-icon-bell"
        @ball-click="toSign">
      </hui-float-ball>
    </div>
    <div class="tableWrap">
      <table class="table">
        <thead>
          <tr>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>今日巡检长度</th>
            <th>巡检工作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{tableData.startTime | dateFormat('HH:mm:ss')}}</td>
            <td>{{tableData.endTime | dateFormat('HH:mm:ss')}}</td>
            <td><span v-show="tableData.distance">{{tableData.distance | toKilometre}}公里</span></td>
            <td class="detailBtnWrap"><router-link class="btn btn-mini color-theme" to="/pipeFix/pipeFixList">详情</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
    <transition name="fade">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
import {getTiandituMap} from '@/assets/js/util'
import {toKilometre, dateFormat} from '@/assets/js/mixin'
import * as api from '@/assets/js/api'
import {mapGetters, mapMutations} from 'vuex'
import {calDistance} from '@/assets/js/mixin'
export default {
  data () {
    return {
      isCenter: true,
      inspecting: false,
      tableData: {
        startTime: '',
        endTime: '',
        distance: 0
      },
      addHiddenTroubleAndSignBtn: false
    }
  },
  mixins: [toKilometre, dateFormat, calDistance],
  computed: {
    ...mapGetters(['currentInspectorId']),
    getInspectBtnTitle () {
      return this.inspecting ? '正在' : '开始'
    }
  },
  methods: {
    ...mapMutations(['set_signPoint', 'set_inspectedPathInfo']),
    startInspect () {
      this.inspecting = !this.inspecting

      this.addHiddenTroubleAndSignBtn = true

      // 清除之前的定位并开始巡检中的定位
      this.watchId && this.clearWatch(this.watchId)
      this.watchPositionInspecting()

      if (this.inspecting) {
        this.tableData.startTime = new Date()
      } else {
        this.tableData.endTime = new Date()
      }
    },
    clearWatch (watchId) {
      navigator.geolocation && navigator.geolocation.clearWatch(watchId)
    },
    searchChange (newVal) {
      console.log(newVal)
    },
    toHiddenTrouble () {
      this.$router.push({path: '/pipeFix/pipeFixInspectReport'})
    },
    toSign () {
      this.$router.push({path: '/pipeFix/pipeFixSign'})
    },
    async initPipeFixMap () {
      // 加载天地图
      var map = await getTiandituMap()

      esriLoader.loadModules([
        'esri/views/MapView'
      ], options).then(async ([MapView]) => {
        // 创建MapView
        var view = new MapView({
          container: 'view_pipeFix',
          spatialReference: {
            wkid: 4326
          },
          map: map,
          center: [114.360694, 30.584929],
          // 1:scale的图
          scale: 2000
        })

        // 移除esri log
        view.ui._removeComponents(['attribution'])

        this.map = map
        this.view = view

        // 获取签到点
        let signPoint = await api.getSignPoint()
        // 标记签到点
        this.markMultiSignPoint(view, signPoint)
        // mutation签到点
        this.set_signPoint(signPoint)

        // 获取隐患点
        let hiddenTrouble = await api.gethiddenTrouble()
        // 标记隐患点
        this.markMultiHiddenTroublePoint(view, hiddenTrouble)

        // 标记自己的位置
        this.watchPositionNoInspect()

        // 标记其他人的位置
        this.handleOtherInspector()

        // 注册点击事件
        this.registerPopup(view)
      })
    },
    async handleOtherInspector () {
      let firstInfo = await this.getOtherInspectorInfo()
      // 标记其他巡检人初始位置
      this.markMultiInspector(this.view, firstInfo)

      this.interval = setInterval(() => {
        this.getOtherInspectorInfo()
          .then((res) => {
            // 清除其他巡检人之前的位置
            let arr = this.view.graphics.items.filter((graphic) => {
              return graphic.attributes && graphic.attributes.name && graphic.attributes.id !== this.currentInspectorId
            })
            this.view.graphics.removeMany(arr)

            // 标记其他巡检人新的位置
            this.markMultiInspector(this.view, res)
          })
      }, 3000)
    },
    watchPositionNoInspect () {
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition((position) => {
          this.handleNoInspect(position)
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
    handleNoInspect (position) {
      // console.log('handleNoInspect', position)
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
    },
    watchPositionInspecting () {
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition((position) => {
          this.handleInspecting(position)
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
    handleInspecting (position) {
      esriLoader.loadModules([
        "esri/Graphic",
        "esri/geometry/geometryEngine",
        "esri/geometry/Polyline"
      ], options).then(([Graphic, geometryEngine, Polyline]) => {
        // console.log('handleInspecting', position)
        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        let accuracy = position.coords.accuracy
        let time = position.timestamp

        this.inspectedPathCoord.push([longitude, latitude])
        this.set_inspectedPathInfo({longitude, latitude, accuracy, time})

        // First create a line geometry (this is the Keystone pipeline)
        var polyline = {                 // 自己的巡检路径
          type: "polyline",  // autocasts as new Polyline()
          paths: this.inspectedPathCoord
        };

        // Create a symbol for drawing the line
        var lineSymbol = {
          type: "simple-line",  // autocasts as SimpleLineSymbol()
          color: [255, 0, 0],
          width: 3
        };

        // Create an object for storing attributes related to the line
        var lineAtt = {
          Name: "Keystone Pipeline",
          Owner: "TransCanada",
          Length: "3,456 km"
        };

        var polylineGraphic = new Graphic({
          geometry: polyline,
          symbol: lineSymbol,
          attributes: lineAtt
        });

        // Add the line graphic to the view's GraphicsLayer
        this.view.graphics.add(polylineGraphic);

        // 计算已走线路长度
        var paths = this.inspectedPathCoord
        var len = paths.length
        if (len > 1) {
          var startPoint = paths[len - 2]
          var endPoint = paths[len - 1]
          this.calDistance(startPoint, endPoint, "meters")
            .then((distance) => {
              this.tableData.distance += distance
            })
        }

        // 标记起始点
        if (!this.startPointIsMarked) {
          this.markStartPoint(this.view, {longitude, latitude})
          this.startPointIsMarked = true
        }

        // 重新标记自己的位置
        let graphic = this.view.graphics.items.find((graphic) => {
          if (graphic.attributes) {
            return graphic.attributes.id === this.currentInspectorId
          }
        })
        this.view.graphics.remove(graphic)
        this.markSingleInspector(this.view, {longitude, latitude, id: this.currentInspectorId})
        this.view.goTo([longitude, latitude])
      })
    },
    error (error) {
      console.log('error', error)
    },
    registerPopup (view) {
      view.on('click', (event) => {
          event.stopPropagation()
          console.log(event)
          let screenPoint = {
            x: event.x,
            y: event.y
          }
          let mapPoint = event.mapPoint
          view.hitTest(screenPoint)
            .then((res) => {
              console.log(res)
              let info = res.results[0]
              if (info && info.graphic && info.graphic.attributes) {
                info = info.graphic.attributes
              }
              view.popup.open({
                  // currentDockPosition: 'bottom-center',
                  dockEnabled: true,
                  dockOptions: {
                    // Disables the dock button from the popup
                    buttonEnabled: true,
                    // Ignore the default sizes that trigger responsive docking
                    breakpoint: {
                      width: 320
                    },
                    position: 'top-center'
                  },
                  // Set the popup's title to the coordinates of the clicked location
                  title: "隐患信息",
                  location: mapPoint, // Set the location of the popup to the clicked location,
                  content: `<table class="popup-table">
                    <tbody>
                      <tr>
                        <td>隐患时间：</td>
                        <td>${info.time}</td>
                        <td>地点：</td>
                        <td>${info.address}</td>
                      </tr>
                      <tr>
                        <td>隐患描述：</td>
                        <td>${info.des}</td>
                        <td>上报人：</td>
                        <td>${info.reportor}</td>
                      </tr>
                      <tr>
                        <td>状态：</td>
                        <td>${info.status}</td>
                        <td class="title"></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>`
              });
            })
        })
    },
    markSingleSignPoint (view, coord) {
      esriLoader.loadModules([
        "esri/Graphic"
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude
        // First create a point geometry
        var point = {
          type: "point",  // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          color: [255, 0, 0],
          size: 16,
          outline: {
            width: 0,
            color: [255, 255, 255, 0]
          },
          xoffset: 16,
          yoffset: 16,
          path: "M6.407,0h52.577c0,0,0.422,0,0.547,0.141c0.193,0.217,0.167,0.468,0.167,0.468v12.453h33.895V70.12H51.848V59.455H18.835V100H6.407V0z"
        }
        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        })
        // Add the line graphic to the view's GraphicsLayer
        view.graphics.add(pointGraphic);
      })
    },
    markMultiSignPoint (view, coords) {
      let len = coords.length
      if (!len) return
      for (let i = 0; i < len; i++) {
        let coord = coords[i]
        this.markSingleSignPoint(view, coord)
      }
    },
    markSingleInspector (view, coord) {
      esriLoader.loadModules([
        "esri/Graphic"
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude

        // First create a point geometry
        var point = {
          type: "point",  // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        var color = coord.id === this.currentInspectorId ? 'orange' : 'blue'

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          color: color,
          size: 22,
          outline: {
            width: 0,
            color: [255, 255, 255, 0]
          },
          path: "M57.083,57.722v2.344c4.87,0.671,8.251,2.122,8.251,3.81c0,2.324-6.398,4.208-14.292,4.208v-3.601h2.967V51.455h4.063V40.62  c-0.791-1.182-3.344-1.161-3.344-1.161h-2.436v-0.569c1.51-0.521,2.601-1.938,2.601-3.625c0-2.126-1.724-3.85-3.851-3.85  s-3.851,1.724-3.851,3.85c0,1.687,1.091,3.104,2.601,3.625v0.569h-2.313c-2.711,0-3.468,1.161-3.468,1.161v10.964h3.935v12.898  h3.095v3.601c-7.893,0-14.292-1.884-14.292-4.208c0-1.688,3.381-3.139,8.25-3.81v-2.344c-8.068,0.834-13.917,3.292-13.917,6.195  c0,3.59,8.936,6.5,19.958,6.5c11.022,0,19.958-2.91,19.958-6.5C71,61.014,65.151,58.556,57.083,57.722z"
        }

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: coord
        })
        // console.log(pointGraphic)
        // Add the line graphic to the view's GraphicsLayer
        view.graphics.add(pointGraphic);
      })
    },
    markMultiInspector (view, coords) {
      let len = coords.length
      if (!len) return
      for (let i = 0; i < len; i++) {
        let coord = coords[i]
        this.markSingleInspector(view, coord)
      }
    },
    markStartPoint (view, coord) {
      esriLoader.loadModules([
        "esri/Graphic"
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude

        // First create a point geometry
        var point = {
          type: "point",  // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          width: 22,
          height: 22,
          url: '/static/svg/startPoint.svg'
        }

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: coord
        })
        // console.log(pointGraphic)
        // Add the line graphic to the view's GraphicsLayer
        view.graphics.add(pointGraphic);
      })
    },
    markSingleHiddenTroublePoint (view, coord) {
      esriLoader.loadModules([
        "esri/Graphic"
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude

        // First create a point geometry
        var point = {
          type: "point",  // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
          width: 16,
          height: 16,
          url: '/static/svg/icon-hiddenTrouble.svg'
        }

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: coord
        })
        // Add the line graphic to the view's GraphicsLayer
        view.graphics.add(pointGraphic);
      })
    },
    markMultiHiddenTroublePoint (view, coords) {
      let len = coords.length
      if (!len) return
      for (let i = 0; i < len; i++) {
        let coord = coords[i]
        this.markSingleHiddenTroublePoint(view, coord)
      }
    },
    getOtherInspectorInfo () {
      let getRandomPosition = () => {
        return Math.random() / 10000
      }
      return new Promise((resolve, reject) => {
        let arr = this.inspector.filter((item) => {
          return item.id !== this.currentInspectorId
        })
        arr.forEach((item) => {
          item.longitude += getRandomPosition()
          item.latitude += getRandomPosition()
        })
        resolve(arr)
      })
    },
    initSingleDirectionParam () {
      this.view = null                  // 视图
      this.map = null                   // 地图
      this.watchId = null               // 定位id
      this.startPointIsMarked = false   // 是否已标记起点
      this.interval = null              // 其他巡检人id
      this.noInspectPath = []           // 自己的非巡检路径
      this.inspectedPathCoord = [            // 自己的巡检路径
        // [114.360694, 30.584929],
        // [114.360809, 30.585959]
      ]

      this.inspector = [
        {
          id: 0,
          longitude: 114.360287112168,
          latitude: 30.58497896868112,
          name: '巡检人一',
          tel: 13800000000
        },
        {
          id: 1,
          longitude: 114.36105805753392,
          latitude: 30.58454114785602,
          name: '巡检人二',
          tel: 13800000000
        },
        {
          id: 2,
          longitude: 114.35998254115928,
          latitude: 30.583922487994503,
          name: '巡检人三',
          tel: 13800000000
        }
      ]
    }
  },
  created () {
    this.initSingleDirectionParam()
  },
  mounted () {
    this.initPipeFixMap()
  },
  beforeDestroy () {
    this.clearWatch(this.watchId)
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFix {
    #view_pipeFix {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
    .startInspectBtn {
      left: 50%!important;
      transform: translateX(-50%);
      color: white;
      .animated {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-width: 2px;
        border-style: solid;
        border-top-color: red;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-radius: 50%;
        animation-duration: 2s;
      }
      .startText {
        p {
          line-height: 1.3;
        }
      }
    }
    .addHiddenTroubleRecordBtn, .signBtn {
      width: 36px;
      height: 36px;
      background-color: rgba(255, 255, 255, 0.6);
    }
    .searchWrap {
      position: fixed;
      top: 10px;
      right: 10px;
      left: 57px;
    }
    .tableWrap {
      position: fixed;
      bottom: 10px;
      right: 10px;
      left: 10px;
    }
    .table {
      width: 100%;
      background-color: white;
      text-align: center;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.1);
      thead {
        tr {
          th {
            background-color: @color-theme;
            color: white;
            line-height: 2;
            border: 1px solid #ddd;
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 5px 0;
            text-align: center;
            border: 1px solid #ddd;
          }
          .detailBtnWrap {
            font-size: 0;
          }
        }
      }
    }
  }
</style>
