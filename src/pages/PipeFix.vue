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
    <div class="inspectorNameWrap" ref="inspectorNameWrap">
      <a :href="'tel:' + item.tel" class="nameItem" v-for="item in otherInspector" :key="item.id" :style="getNameItemStyle(item)">
        <span>{{item.name}}</span>
        <span class="hui-icon-phone"></span>
      </a>
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
import {calDistance, markPoint} from '@/assets/js/mixin'
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
      addHiddenTroubleAndSignBtn: false,
      otherInspector: []
    }
  },
  mixins: [toKilometre, dateFormat, calDistance, markPoint],
  computed: {
    ...mapGetters(['currentInspectorId']),
    getInspectBtnTitle () {
      return this.inspecting ? '正在' : '开始'
    }
  },
  methods: {
    ...mapMutations(['set_signPoint', 'set_inspectedPathInfo']),
    getNameItemStyle (item) {
      return {
        top: item.y + 'px',
        left: item.x + 'px'
      }
    },
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
      let [MapView] = await esriLoader.loadModules([
        'esri/views/MapView',
      ], options)

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
      //移除缩放图标
      view.ui.remove("zoom")

      this.map = map
      this.view = view

      // 获取签到点
      let signPoint = await api.getSignPoint()
      // 标记签到点
      this.markMultiSignPoint(signPoint)
      // mutation签到点
      this.set_signPoint(signPoint)

      // 获取隐患点
      let hiddenTroubleCoords = await api.gethiddenTrouble()
      // 标记隐患点
      this.markMultiHiddenTroublePoint(hiddenTroubleCoords)

      // 标记自己的位置
      this.watchPositionNoInspect()

      // 标记其他人的位置
      this.handleOtherInspector()

      // 注册点击事件
      this.registerPopup()

      // 注册地图移动事件
      this.registerMove()
    },
    registerMove () {
      let x = 0
      let y = 0
      this.view.on('pointer-enter', (evt) => {
        x = evt.x
        y = evt.y
      })
      this.view.on('pointer-move', (evt) => {
        this.$refs.inspectorNameWrap.style.display = 'none'
        x = evt.x - x
        y = evt.y - y
        this.otherInspector.forEach((item) => {
          item.x += x
          item.y += y
        })
      })
      this.view.on('pointer-leave', (evt) => {
        this.$refs.inspectorNameWrap.style.display = 'block'
      })
    },
    async handleOtherInspector () {
      let firstInfo = await this.getOtherInspectorInfo()
      // 标记其他巡检人初始位置
      this.markMultiInspector(firstInfo)

      this.interval = setInterval(() => {
        this.getOtherInspectorInfo()
          .then((res) => {
            // 清除其他巡检人之前的位置
            let arr = this.view.graphics.items.filter((graphic) => {
              return graphic.attributes && graphic.attributes.name && graphic.attributes.id !== this.currentInspectorId
            })
            this.view.graphics.removeMany(arr)

            // 标记其他巡检人新的位置
            this.markMultiInspector(res)
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

      this.markPoint({
        width: '26px',
        height: '26px',
        coord: {
          longitude,
          latitude
        },
        attributes: {
          id: 0
        },
        svg: 'inspector-me.svg'
      })
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
          // this.markStartPoint(this.view, {longitude, latitude})
          this.markPoint({
            width: '32px',
            height: '32px',
            coord: {longitude, latitude},
            svg: 'startPoint.svg'
          })
          this.startPointIsMarked = true
        }

        // 重新标记自己的位置
        let graphic = this.view.graphics.items.find((graphic) => {
          if (graphic.attributes) {
            return graphic.attributes.id === this.currentInspectorId
          }
        })
        this.view.graphics.remove(graphic)
        this.markPoint({
          width: '26px',
          height: '26px',
          coord: {
            longitude,
            latitude
          },
          attributes: {
            id: 0
          },
          svg: 'inspector-me.svg'
        })
        this.view.goTo([longitude, latitude])
      })
    },
    error (error) {
      console.log('error', error)
    },
    registerPopup () {
      this.view.on('click', (event) => {
          event.stopPropagation()
          console.log(event)
          let screenPoint = {
            x: event.x,
            y: event.y
          }
          let mapPoint = event.mapPoint
          this.view.hitTest(screenPoint)
            .then((res) => {
              console.log(res)
              let info = res.results[0]
              if (info && info.graphic && info.graphic.attributes) {
                info = info.graphic.attributes
              }
              if (!info.isHiddenTrouble) return
              this.view.popup.open({
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
    markMultiInspector (coords) {
      let len = coords && coords.length
      if (!len) return
      for (let i = 0; i < len; i++) {
        let coord = coords[i]
        this.markPoint({
          width: '26px',
          height: '26px',
          coord: coord,
          svg: 'inspector-other.svg'
        })
      }
    },
    markMultiHiddenTroublePoint (coords) {
      let len = coords && coords.length
      if (!len) return
      for (let i = 0; i < len; i++) {
        let coord = coords[i]
        this.markPoint({
          width: '26px',
          height: '26px',
          coord,
          svg: 'hiddenTrouble.svg'
        })
      }
    },
    addOtherInspectorName1 (res) {
      esriLoader.loadModules([
        "esri/geometry/Point"
      ], options).then(([Point]) => {
        if (this.firstLoadName) {
          res.forEach((item) => {
            let mapPoint = new Point({
              longitude: item.longitude,
              latitude: item.latitude
            })
            let position = this.view.toScreen(mapPoint)
            item.x = position.x
            item.y = position.y
          })
          this.otherInspector = res
        }
        this.firstLoadName = true
      })
    },
    async getOtherInspectorInfo () {
      let getRandomPosition = () => {
        return Math.random() / 10000
      }
      let res = await api.getInspector()

      let arr = res.filter((item) => {
        return item.id !== this.currentInspectorId
      })
      arr.forEach((item) => {
        item.longitude += getRandomPosition()
        item.latitude += getRandomPosition()
      })

      // 标记所有巡检人的姓名小窗
      this.addOtherInspectorName1(arr)

      return arr
    },
    initSingleDirectionParam () {
      this.view = null                  // 视图
      this.map = null                   // 地图
      this.watchId = null               // 定位id
      this.startPointIsMarked = false   // 是否已标记起点
      this.interval = null              // 其他巡检人id
      this.noInspectPath = []           // 自己的非巡检路径
      this.inspectedPathCoord = [           // 自己的巡检路径
        // [114.360694, 30.584929],
        // [114.360809, 30.585959]
      ]
      this.firstLoadName = false
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
      // left: 57px;
      left: 10px;
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
    .inspectorNameWrap {
      position: relative;
      z-index: 1;
      .nameItem {
        position: fixed;
        z-index: 1;
        background-color: white;
        padding: 5px 10px;
        border-radius: 4px;
        top: 0;
        left: 0;
        z-index: 10;
        white-space: nowrap;
        font-size: 10px;
        margin-left: 15px;
        margin-top: -10px;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
        [class*="hui-icon"] {
          color: @color-theme
        }
      }
    }
  }
</style>
