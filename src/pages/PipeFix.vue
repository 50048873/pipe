<template>
  <div class="page pipeFix">
    <div id="viewDiv"></div>
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
            <td>{{tableData.startTime}}</td>
            <td>{{tableData.endTime}}</td>
            <td>{{tableData.distance}}公里</td>
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
import moment from 'moment'
export default {
  data () {
    return {
      isCenter: true,
      inspecting: false,
      tableData: {
        startTime: '',
        endTime: '',
        distance: ''
      }
    }
  },
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
        this.tableData.startTime = moment().format('HH:mm')
      } else {
        this.tableData.endTime = moment().format('HH:mm')
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
    initPipe () {
      esriLoader.loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/FeatureLayer'
      ], options).then(([config, Map, MapView, SceneView, FeatureLayer]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282')
        // config.request.forceProxy = true

        var toggleViewBtn = document.getElementById('toggleViewBtn')
        var view

        var createView = function (type = '2d') {
          var map

          if (type === '2d') {
            map = new Map({
              basemap: 'satellite'
            })
          } else {
            map = new Map({
              basemap: 'satellite',
              ground: 'world-elevation'
            })
          }

          // var layer1 = new FeatureLayer({
          //   url: 'http://10.100.50.71:6080/arcgis/rest/services/0723PointService/MapServer'
          // })

          // var layer2 = new FeatureLayer({
          //   url: 'http://10.100.50.71:6080/arcgis/rest/services/point0723Service/MapServer'
          // })

          // var layer3 = new FeatureLayer({
          //   url: 'http://10.100.50.71:6080/arcgis/rest/services/0723MapService/MapServer'
          // })

          // map.add(layer3)
          // map.add(layer1)
          // map.add(layer2)

          var params = {
            container: 'viewDiv',
            map: map,
            zoom: 15,
            center: [106.2789984, 35.9969383],
            logo: false
          }

          return type === '2d' ? new MapView(params) : new SceneView(params)
        }

        var toggleView = function () {
          if (view === undefined) {
            view = createView()
          } else {
            var is2D = view.type === '2d'
            if (is2D) {
              view = createView('3d')
              toggleViewBtn.value = '2D'
            } else {
              view = createView()
              toggleViewBtn.value = '3D'
            }
          }
          view.ui.add(toggleViewBtn, 'top-left')
          view.ui._removeComponents(['attribution'])
        }

        toggleView()

        toggleViewBtn.addEventListener('click', function () {
          toggleView()
        })
      })
    },
    initPipeFixMap () {
      esriLoader.loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/WebTileLayer',
        'esri/layers/support/TileInfo',
        "esri/Graphic",
        "esri/geometry/geometryEngine",
      ], options).then(([config, Map, MapView, WebTileLayer, TileInfo, Graphic, geometryEngine]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282')

        // 加载天地图
        var map = getTiandituMap(TileInfo, WebTileLayer, Map)

        // 创建MapView
        var view = new MapView({
          container: 'viewDiv',
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

        this.map = map
        this.view = view

        // 标记签到点
        this.markMultiSignPoint(view, this.signPoint)

        this.registerPopup(view)

        /*var success = (position) => {
          console.log('success', position)
          let longitude = position.coords.longitude
          let latitude = position.coords.latitude

          // First create a line geometry (this is the Keystone pipeline)
          this.polyline.paths.push([longitude, latitude])

          // Create a symbol for drawing the line
          var lineSymbol = {
            type: "simple-line",  // autocasts as SimpleLineSymbol()
            color: [255, 0, 0],
            width: 4
          };

          // Create an object for storing attributes related to the line
          var lineAtt = {
            Name: "Keystone Pipeline",
            Owner: "TransCanada",
            Length: "3,456 km"
          };

          ******************************************
           * Create a new graphic and add the geometry,
           * symbol, and attributes to it. You may also
           * add a simple PopupTemplate to the graphic.
           * This allows users to view the graphic's
           * attributes when it is clicked.
           *****************************************
          var polylineGraphic = new Graphic({
            geometry: this.polyline,
            symbol: lineSymbol,
            attributes: lineAtt
          });

          // Add the line graphic to the view's GraphicsLayer
          view.graphics.add(polylineGraphic);
        }

        var error = (error) => {
          console.log('error', error)
        }

        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(this.success, this.error, {
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAcuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 15000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 0
          })
        }*/
      })
    },
    watchPosition () {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition((position) => {
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
        if (this.map.spatialReference.wkid == "4326"||this.map.spatialReference.isWebMercator()) {//在web麦卡托投影和WGS84坐标系下的计算方法
          distance = geometryEngine.geodesicLength(line, "meters")
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

        this._calDistance([114.360694, 30.584929], [114.360809, 30.585959], "meters")

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
      this.polyline = {
        type: "polyline",  // autocasts as new Polyline()
        paths: [
          [114.360694, 30.584929],
          [114.360809, 30.585959]
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
    #viewDiv {
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
