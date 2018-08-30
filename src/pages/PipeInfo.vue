<template>
  <div class="page pipeInfo">
    <div id="viewDiv"></div>
    <input class="esri-component esri-widget-button esri-widget esri-interactive" type="button" id="toggleViewBtn" value="3D" />
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
export default {
  methods: {
    initPipe () {
      esriLoader.loadModules([
        'esri/config',
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/layers/FeatureLayer'
      ], window.DSE.options).then(([config, Map, MapView, SceneView, FeatureLayer]) => {
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
