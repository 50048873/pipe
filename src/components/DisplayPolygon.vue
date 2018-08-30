<template>
  <div id="view_markPolygon" class="view_markPolygon"></div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import {getTiandituMap} from '@/assets/js/util'
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
        'esri/geometry/Polygon',
        'esri/geometry/geometryEngine',

        'dojo/domReady!'
      ], window.DSE.options).then(([Draw, Map, MapView, Graphic, Polygon, geometryEngine]) => {
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
          // create a polygon using the provided vertices
          function createPolygon () {
            const rings = [[[114.3607392097591, 30.585583351776602], [114.36102950400182, 30.585483414414355], [114.36092956663957, 30.585116977419457], [114.36062499563083, 30.585159807717563]]]

            return new Polygon({
              rings: rings,
              spatialReference: view.spatialReference
            })
          }

          // create a new graphic representing the polygon that is being drawn on the view
          function createGraphic (polygon) {
            let graphic = new Graphic({
              geometry: polygon,
              symbol: {
                type: 'simple-fill', // autocasts as SimpleFillSymbol
                color: [178, 102, 234, 0.8],
                style: 'solid',
                outline: { // autocasts as SimpleLineSymbol
                  color: [255, 255, 255],
                  width: 2
                }
              }
            })
            return graphic
          }

          var polygon = createPolygon()
          console.log(polygon)
          var graphic = createGraphic(polygon)
          console.log(graphic)

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

          var labelGraphic = labelAreas(polygon, 10)
          view.graphics.add(labelGraphic)
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
