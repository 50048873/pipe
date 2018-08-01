<template>
  <div class="page pipeInfo">
    <div id="viewDiv"></div>
    <input class="esri-component esri-widget-button esri-widget esri-interactive" type="button" id="toggleViewBtn" value="3D" />
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
export default {
  methods: {
    Look_around_camera_position (WebScene, SceneView) {
      esriLoader.loadModules([
        'esri/config',
        'esri/WebScene',
        'esri/views/SceneView',
        'dojo/domReady!'
      ], options)
        .then(([esriConfig, WebScene, SceneView, domReady]) => {
          // esriConfig设置
          esriConfig.request.proxyUrl = 'http://10.100.50.129/arcgis/resource-proxy-master/Java/proxy.jsp'
          esriConfig.request.corsEnabledServers.push('http://10.100.50.71:2282')
          // esriConfig.request.forceProxy = true
          var scene = new WebScene({
            portalItem: { // autocasts as new PortalItem()
              id: 'd8695805cb324135846f4b03eaeddeaa'
            }
          })

          // create a view and add the scene
          var view = new SceneView({
            map: scene,
            container: 'viewDiv'
          })

          view.ui.add('description', 'bottom-left')

          // add event listeners on keys s, w, a and d
          view.on('key-down', function (event) {
            switch (event.key) {
              case 's':
                event.stopPropagation()

                // only when camera.tilt is bigger than 2 deg allow for tilting down
                if (view.camera.tilt > 2) {
                  // decrease the tilt and apply it, by using goTo()
                  view.goTo({
                    position: view.camera.position,
                    tilt: view.camera.tilt - 1
                  }, {
                    // animate is false, because otherwise camera position will also change
                    // due to interpolations in the camera animations
                    animate: false
                  })
                }

                break

              case 'w':
                event.stopPropagation()

                if (view.camera.tilt < 160) {
                  view.goTo({
                    position: view.camera.position,
                    tilt: view.camera.tilt + 1
                  }, {
                    animate: false
                  })
                }

                break

              case 'a':
                event.stopPropagation()

                view.goTo({
                  position: view.camera.position,
                  heading: view.camera.heading - 1
                }, {
                  animate: false
                })

                break

              case 'd':
                event.stopPropagation()

                view.goTo({
                  position: view.camera.position,
                  heading: view.camera.heading + 1
                }, {
                  animate: false
                })

                break
            }
          })
        })
    },
    IntrotoMapView () {
      esriLoader.loadModules([
        'esri/config',
        'esri/Basemap',
        'esri/Map',
        'esri/views/SceneView',
        'esri/layers/TileLayer',
        'esri/layers/FeatureLayer',
        'esri/WebMap'
      ], options).then(([esriConfig, Basemap, Map, SceneView, TileLayer, FeatureLayer, WebMap]) => {
        // esriConfig设置
        esriConfig.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        esriConfig.request.corsEnabledServers.push('http://10.100.50.71:2282')
        // esriConfig.request.forceProxy = true
        // 切片地图
        var layer = new TileLayer({
          url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
        })

        var layer1 = new FeatureLayer({
          // URL to the service
          url: 'http://10.100.50.71:6080/arcgis/rest/services/0723PointService/MapServer'
        })

        var layer2 = new FeatureLayer({
          // URL to the service
          url: 'http://10.100.50.71:6080/arcgis/rest/services/point0723Service/MapServer'
        })

        var layer3 = new FeatureLayer({
          // URL to the service
          url: 'http://10.100.50.71:6080/arcgis/rest/services/0723MapService/MapServer'
        })

        // eslint-disable-next-line
        var customBasemap = new Basemap({
          baseLayers: [layer, layer3, layer1, layer2],
          title: '自定底图',
          id: 'myBasemap'
        })

        var map = new Map({
          basemap: 'satellite',
          ground: 'world-elevation'
        })

        map.add(layer3)
        map.add(layer1)
        map.add(layer2)

        // eslint-disable-next-line
        var view = new SceneView({
          container: 'viewDiv',
          map: map,
          zoom: 15,
          center: [106.2789984, 35.9969383] // longitude, latitude
        })
      })
    },
    webMap () {
      esriLoader.loadModules([
        'esri/WebMap',
        'esri/views/MapView'
      ]).then(([WebMap, MapView]) => {
        // 天地图全球影像地图
        var webMap = new WebMap({
          portalItem: {
            id: '0f7479fb453c43139cb58fa4c1ea868c'
          }
        })
        // eslint-disable-next-line
        new MapView({
          container: 'viewDiv',
          map: webMap,
          zoom: 17,
          center: [114.372402, 30.588834] // longitude, latitude
        })
      })
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

          var layer1 = new FeatureLayer({
            url: 'http://10.100.50.71:6080/arcgis/rest/services/0723PointService/MapServer'
          })

          var layer2 = new FeatureLayer({
            url: 'http://10.100.50.71:6080/arcgis/rest/services/point0723Service/MapServer'
          })

          var layer3 = new FeatureLayer({
            url: 'http://10.100.50.71:6080/arcgis/rest/services/0723MapService/MapServer'
          })

          map.add(layer3)
          map.add(layer1)
          map.add(layer2)

          var params = {
            container: 'viewDiv',
            map: map,
            zoom: 15,
            center: [106.2789984, 35.9969383]
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
        }

        toggleView()

        toggleViewBtn.addEventListener('click', function () {
          toggleView()
        })
      })
    }
  },
  mounted () {
    // this.Look_around_camera_position()
    // this.IntrotoMapView()
    // this.webMap()
    this.initPipe()
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeInfo {
    #viewDiv {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
