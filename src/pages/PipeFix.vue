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
        @ball-click="ballClick">
        <div class="startText">
          <p>开始</p>
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
            <td></td>
            <td></td>
            <td></td>
            <td class="detailBtnWrap"><router-link class="btn btn-mini color-theme" to="/pipeFix/pipeFixList">详情</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- <div class="page">
    <div id="viewDiv">
      <div class="docking-control">
        <label for="dockPositionControl">Popup Dock Position</label>
        <select id="dockPositionControl">
          <option selected value="auto">Auto</option>
          <option value="top-left">Top Left</option>
          <option value="top-center">Top Center</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>
    </div>
  </div> -->
</template>

<script>
/* eslint-disable */
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
export default {
  data () {
    return {
      isCenter: true,
      center: [114.360694, 30.584929]
    }
  },
  methods: {
    ballClick () {

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
        "dojo/domReady!"
      ], options).then(([config, Map, MapView, WebTileLayer, TileInfo, Graphic]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282')

        // 首先我们设定瓦片信息，天地图经纬度地图的切片信息全部使用该信息设定
        var tileInfo = new TileInfo({
          dpi: 90.71428571427429,
          rows: 256,
          cols: 256,
          compressionQuality: 0,
          origin: {
            x: -180,
            y: 90
          },
          spatialReference: {
            wkid: 4326
          },
          lods: [
            {level: 2, levelValue: 2, resolution: 0.3515625, scale: 147748796.52937502},
            {level: 3, levelValue: 3, resolution: 0.17578125, scale: 73874398.264687508},
            {level: 4, levelValue: 4, resolution: 0.087890625, scale: 36937199.132343754},
            {level: 5, levelValue: 5, resolution: 0.0439453125, scale: 18468599.566171877},
            {level: 6, levelValue: 6, resolution: 0.02197265625, scale: 9234299.7830859385},
            {level: 7, levelValue: 7, resolution: 0.010986328125, scale: 4617149.8915429693},
            {level: 8, levelValue: 8, resolution: 0.0054931640625, scale: 2308574.9457714846},
            {level: 9, levelValue: 9, resolution: 0.00274658203125, scale: 1154287.4728857423},
            {level: 10, levelValue: 10, resolution: 0.001373291015625, scale: 577143.73644287116},
            {level: 11, levelValue: 11, resolution: 0.0006866455078125, scale: 288571.86822143558},
            {level: 12, levelValue: 12, resolution: 0.00034332275390625, scale: 144285.93411071779},
            {level: 13, levelValue: 13, resolution: 0.000171661376953125, scale: 72142.967055358895},
            {level: 14, levelValue: 14, resolution: 8.58306884765625e-005, scale: 36071.483527679447},
            {level: 15, levelValue: 15, resolution: 4.291534423828125e-005, scale: 18035.741763839724},
            {level: 16, levelValue: 16, resolution: 2.1457672119140625e-005, scale: 9017.8708819198619},
            {level: 17, levelValue: 17, resolution: 1.0728836059570313e-005, scale: 4508.9354409599309},
            {level: 18, levelValue: 18, resolution: 5.3644180297851563e-006, scale: 2254.4677204799655},
            { level: 19, levelValue: 19, resolution: 2.68220901489257815e-006, scale: 1127.23386023998275 },
            { level: 20, levelValue: 2, resolution: 1.341104507446289075e-006, scale: 563.616930119991375 }
          ]
        })

        var layer = WebTileLayer('http://{subDomain}.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}', {
          // subDomains: ['t0','t1','t2','t3','t4','t5','t6','t7'],
          subDomains: ['t0'],
          tileInfo: tileInfo
        })
        var layerAnno = WebTileLayer('http://{subDomain}.tianditu.com/DataServer?T=cva_c&x={col}&y={row}&l={level}', {
          // subDomains: ['t0','t1','t2','t3','t4','t5','t6','t7'],
          subDomains: ['t0'],
          tileInfo: tileInfo
        })

        // 创建地图，不设置底图，如果设置底图会造成坐标系无法被转换成 ESPG:4326 (WGS1984)
        var map = new Map({
          spatialReference: {
            wkid: 4326
          },
          basemap: {
            baseLayers: [layer, layerAnno]
          }
        })

        // 创建MapView
        // eslint-disable-next-line
        var view = new MapView({
          container: 'viewDiv',
          spatialReference: {
            wkid: 4326
          },
          map: map,
          center: this.center,
          // 1:scale的图
          scale: 2000,
          popup: {
            dockEnabled: true,
            dockOptions: {
              // Disables the dock button from the popup
              buttonEnabled: false,
              // Ignore the default sizes that trigger responsive docking
              breakpoint: false,
            }
          }
        })

        let popup = view.popup;

        view.when(function() {

          var centerPoint = view.center.clone();

          popup.open({
            title: "Popup dock positions",
            location: centerPoint,
            content: "Use the control in the center of the map to change the location where the popup will dock."
          });
        });

        view.on("click", function(event) {
          event.stopPropagation();

          // Get the coordinates of the click on the view
          // around the decimals to 3 decimals
          var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
          var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

          view.popup.open({
              // Set the popup's title to the coordinates of the clicked location
              title: "Reverse geocode: [" + lon + ", " + lat + "]",
              location: event.mapPoint // Set the location of the popup to the clicked location,
          });
        });

        var success = (position) => {
          console.log('success', position)
          let longitude = position.coords.longitude
          let latitude = position.coords.latitude
          this.center = [longitude, latitude]

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

          /*******************************************
           * Create a new graphic and add the geometry,
           * symbol, and attributes to it. You may also
           * add a simple PopupTemplate to the graphic.
           * This allows users to view the graphic's
           * attributes when it is clicked.
           ******************************************/
          var polylineGraphic = new Graphic({
            geometry: this.polyline,
            symbol: lineSymbol,
            attributes: lineAtt,
            // popupTemplate: {  // autocasts as new PopupTemplate()
            //   title: "{Name}",
            //   content: [{
            //     type: "fields",
            //     fieldInfos: [{
            //       fieldName: "Name"
            //     }, {
            //       fieldName: "Owner"
            //     }, {
            //       fieldName: "Length"
            //     }]
            //   }]
            // }
          });

          // Add the line graphic to the view's GraphicsLayer
          view.graphics.add(polylineGraphic);
        }

        var error = (error) => {
          console.log('error', error)
        }

        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(success, this.error, {
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
    initStaticParam () {
      this.polyline = {
        type: "polyline",  // autocasts as new Polyline()
        paths: [
          [114.360694, 30.584929],
          [114.360809, 30.585959]
        ]
      };
    },
    test () {
      esriLoader.loadModules([
        'esri/config',
        "esri/Map",
        "esri/views/MapView",
        "esri/WebMap",

        "dojo/dom",
        "dojo/on",
        "dojo/domReady!"
      ], options).then(([config, Map, MapView, WebMap, dom, on]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282')

        var webmap = new WebMap({
          portalItem: { // autocasts as new PortalItem()
            id: "3af548bac6054938b615d08104197ba0"
          }
        });

        var view = new MapView({
          map: webmap,
          popup: {
            dockEnabled: true,
            dockOptions: {
              // Disables the dock button from the popup
              buttonEnabled: false,
              // Ignore the default sizes that trigger responsive docking
              breakpoint: false,
            }
          },
          container: "viewDiv"
        });

        // let popup = view.popup;

        // view.when(function() {

        //   var centerPoint = view.center.clone();

        //   popup.open({
        //     title: "Popup dock positions",
        //     location: centerPoint,
        //     content: "Use the control in the center of the map to change the location where the popup will dock."
        //   });

        //   // Watch currentDockPosition of the popup and open the
        //   // popup at the specified position.
        //   popup.watch("currentDockPosition", function(value) {
        //     popup.visible = true;
        //   });

        //   var selectNode = dom.byId("dockPositionControl");

        //   // Let user change the position dockOptions.position property of the
        //   // popup at runtime from the drop-down list.
        //   on(selectNode, "change", function(event) {
        //     console.log(event.target.value)
        //     popup.set("dockOptions", {
        //       breakpoint: false,
        //       buttonEnabled: false,
        //       position: event.target.value
        //     });
        //   });
        // });
      })
    }
  },
  created () {
    this.initStaticParam()
  },
  mounted () {
    this.initPipeFixMap()
    // this.test()
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

<style>
  html,
  body,
  #viewDiv {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }

  .docking-control {
    font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    width: 250px;
    height: 80px;
    padding: 10px;
    box-sizing: border-box;
    margin: -40px 0 0 -125px;
    background-color: #fff;
    color: #323232;
    text-align: center;
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .docking-control label {
    display: inline-block;
    font-weight: bold;
    margin: 0 0 10px 0;
    padding: 0;
    font-size: 16px;
  }
</style>
