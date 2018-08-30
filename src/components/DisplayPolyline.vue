<template>
  <div id="view_markPolygon" class="view_markPolygon"></div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import {getTiandituMap, labelLength} from '@/assets/js/util'
export default {
  methods: {
    async initPipeFixMap () {
      // 加载天地图
      var map = await getTiandituMap()

      esriLoader.loadModules([
        'esri/views/2d/draw/Draw',
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Polyline',
        'esri/geometry/geometryEngine',

        'dojo/domReady!'
      ], window.DSE.options).then(([Draw, Map, MapView, Graphic, Polyline, geometryEngine]) => {
        // 创建MapView
        var view = new MapView({
          container: 'view_markPolygon',
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

        view.ui.remove('zoom')

        this.map = map
        this.view = view

        view.when(function (event) {
          // create a polyline using the provided vertices
          function createPolyline () {
            const path = [
              [
                114.36048698689248,
                30.585768949735055
              ],
              [
                114.36091053095153,
                30.585378718130098
              ],
              [
                114.36103902184584,
                30.584993245447155
              ]
            ]

            return new Polyline({
              paths: path,
              spatialReference: view.spatialReference
            })
          }

          // create a new graphic representing the polyline that is being drawn on the view
          function createGraphic (polyline) {
            let graphic = new Graphic({
              geometry: polyline,
              symbol: {
                type: 'simple-line', // autocasts as new SimpleFillSymbol
                color: 'red',
                width: 4,
                cap: 'round',
                join: 'round'
              }
            })
            return graphic
          }

          var polyline = createPolyline()
          var graphic = createGraphic(polyline)

          view.graphics.add(graphic)

          // Label polyon with its area
          function labelAreas (geom, area) {
            var graphic = new Graphic({
              geometry: geom.centroid,
              symbol: {
                type: 'text',
                color: 'black',
                haloColor: 'black',
                haloSize: '1px',
                text: area.toFixed(0) + '平方米',
                font: { // autocast as Font
                  size: 12,
                  family: 'sans-serif'
                },
                xoffset: '-20px'
              }
            })
            return graphic
          }

          var labelGraphic = labelAreas(polyline, 10)
          view.graphics.add(labelGraphic)

          var length = geometryEngine.geodesicLength(graphic.geometry, 'meters')
          let point = graphic.geometry.paths[0].slice().pop()
          labelLength(view, Graphic, point, length)
        })
      })
    },
    initSingleDirectionParam () {
      this.view = null // 视图
      this.map = null // 地图
      this.graphic = null // 画的面
      this.drawPolygonButton = null // 画面按钮
      this.areas = null // 面积
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
  #view_markPolygon {
    width: 100%;
    height: 300px;
    margin-top: 10px;
  }
</style>
