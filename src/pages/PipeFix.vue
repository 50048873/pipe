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
            <td>{{tableData.startTime | dateFormat('HH:mm')}}</td>
            <td>{{tableData.endTime | dateFormat('HH:mm')}}</td>
            <td>{{tableData.distance | toKilometre}}公里</td>
            <td class="detailBtnWrap"><router-link class="btn btn-mini color-theme" to="/pipeFix/pipeFixList">详情</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
import {getTiandituMap} from '@/assets/js/util'
import {toKilometre, dateFormat} from '@/assets/js/mixin'
export default {
  data () {
    return {
      isCenter: true,
      inspecting: false,
      tableData: {
        startTime: '',
        endTime: '',
        distance: 0
      }
    }
  },
  mixins: [toKilometre, dateFormat],
  computed: {
    getInspectBtnTitle () {
      return this.inspecting ? '正在' : '开始'
    }
  },
  methods: {
    startInspect () {
      this.inspecting = !this.inspecting
      this.watchPosition()
      if (this.inspecting) {
        this.tableData.startTime = new Date()
      } else {
        navigator.geolocation && navigator.geolocation.clearWatch(this.watchId)
        this.tableData.endTime = new Date()
      }
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
    initPipeFixMap () {
      esriLoader.loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/WebTileLayer',
        'esri/layers/support/TileInfo'
      ], options).then(([config, Map, MapView, WebTileLayer, TileInfo]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282')

        // 加载天地图
        var map = getTiandituMap(TileInfo, WebTileLayer, Map)

        // 创建MapView
        var view = new MapView({
          container: 'view_pipeFix',
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

        view.ui._removeComponents(['attribution'])

        this.map = map
        this.view = view

        // 标记签到点
        this.markMultiSignPoint(view, this.signPoint)

        // 注册点击事件
        this.registerPopup(view)
      })
    },
    watchPosition () {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          this.watchId = navigator.geolocation.watchPosition((position) => {
            this.success(position)
            resolve(position)
          }, (err) => {
            this.error(err)
            reject(err)
          }, {
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAcuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 15000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 0
          })
        }
      })
    },
    _calDistance (point1, point2) { //计算距离
      return esriLoader.loadModules([
        "esri/geometry/geometryEngine",
        "esri/geometry/Polyline"
      ], options).then(([geometryEngine, Polyline]) => {
        var line = new Polyline();
        line.addPath([point1, point2]);
        var distance = 0
        if (this.map.spatialReference.wkid == "4326" || this.map.spatialReference.isWebMercator()) {//在web麦卡托投影和WGS84坐标系下的计算方法
          distance = geometryEngine.geodesicLength(line, "meters")
          console.log(typeof this.tableData.distance, typeof distance)
          this.tableData.distance += distance
        } else {//在其他投影坐标系下的计算方法
          distance = geometryEngine.planarLength(line, "meters")
          this.tableData.distance += distance
        }
        return distance
      })
    },
    success (position) {
      esriLoader.loadModules([
        "esri/Graphic",
        "esri/geometry/geometryEngine",
        "esri/geometry/Polyline"
      ], options).then(([Graphic, geometryEngine, Polyline]) => {
        console.log('success', position)
        let longitude = position.coords.longitude
        let latitude = position.coords.latitude

        // First create a line geometry (this is the Keystone pipeline)
        this.polyline.paths.push([longitude, latitude])

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
          geometry: this.polyline,
          symbol: lineSymbol,
          attributes: lineAtt
        });

        var paths = this.polyline.paths
        var len = paths.length
        if (len > 1) {
          var startPoint = paths[len - 2]
          var endPoint = paths[len - 1]
          this._calDistance(startPoint, endPoint, "meters")
        }

        // Add the line graphic to the view's GraphicsLayer
        this.view.graphics.add(polylineGraphic);
      })
    },
    error (error) {
      console.log('error', error)
    },
    registerPopup (view) {
      view.on("click", function(event) {
        event.stopPropagation();
        console.log(event)

        // Get the coordinates of the click on the view
        // around the decimals to 3 decimals
        var lat = event.mapPoint.latitude;
        var lon = event.mapPoint.longitude;

        var centerPoint = view.center.clone();

        view.popup.open({
            // Set the popup's title to the coordinates of the clicked location
            title: "Reverse geocode: [" + lon + ", " + lat + "]",
            location: event.mapPoint, // Set the location of the popup to the clicked location,
            content: "Use the control in the center of the map to change the location where the popup will dock."
        });
      });
    },
    markSingleSignPoint (view, longitude, latitude) {
      esriLoader.loadModules([
        "esri/Graphic"
      ], options).then(([Graphic]) => {
        // First create a point geometry
        var point = {
          type: "point",  // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          color: [255, 0, 0]
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
        let longitude = coords[i].longitude
        let latitude = coords[i].latitude
        this.markSingleSignPoint(view, longitude, latitude)
      }
    },
    initSingleDirectionParam () {
      this.view = null
      this.map = null
      this.watchId = null
      this.polyline = {
        type: "polyline",  // autocasts as new Polyline()
        paths: [
          // [114.360694, 30.584929],
          // [114.360809, 30.585959]
        ]
      };

      this.signPoint = [
        {
          longitude: 114.36042987982836,
          latitude: 30.58512173634147
        },
        {
          longitude: 114.36001585361335,
          latitude: 30.58453163001203
        },
        {
          longitude: 114.36031090677805,
          latitude: 30.584307960677474
        },
        {
          longitude: 114.36079155790127,
          latitude: 30.58477909395663
        }
      ]
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

<style>
  .esri-view-width-xsmall .esri-popup--is-docked-top-center .esri-popup__main-container, .esri-view-width-xsmall .esri-popup--is-docked-bottom-center .esri-popup__main-container {
    left: 0;
}
</style>
