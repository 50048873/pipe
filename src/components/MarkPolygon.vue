<template>
  <div class="page markPolygon">
    <div id="view_markPolygon" class="view_markPolygon">
      <!-- <div id="line-button" class="esri-widget-button esri-widget esri-interactive" title="Draw polyline">
        <span class="esri-icon-polyline"></span>
      </div> -->
      <div id="draw-polygon" class="esri-widget-button esri-widget esri-interactive" title="Draw and measure polygon">
        <span class="esri-icon-polygon"></span>
      </div>
    </div>

    <div class="submitWrap">
      <button class="btn color-theme" @click="del"><i class="hui-icon-bell"></i>删除</button>
      <button class="btn color-theme" @click="confirm"><i class="hui-icon-bell"></i>确定</button>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import {getTiandituMap} from '@/assets/js/util'
export default {
  methods: {
    del () {
      this.drawPolygonButton.click()
    },
    confirm () {
      let planArea = JSON.stringify(this.graphic.geometry)
      let params = {
        planArea: planArea,
        areas: (this.areas / 1000).toString(),
        areaColor: '178, 102, 234, 0.8'
      }
      this.$router.push({name: 'PipeFixInspectReportConstructingProject', params: {polygonData: params}})
    },
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
        var _this = this

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

        // add the button for the draw tool
        // view.ui.add("line-button", "top-left");

        // add the button for the draw tool
        view.ui.add('draw-polygon', 'top-left')

        view.when(function (event) {
          var draw = new Draw({
            view: view
          })

          // *******************
          // draw polygon button
          // *******************
          _this.drawPolygonButton = document.getElementById('draw-polygon')
          _this.drawPolygonButton.addEventListener('click', function () {
            view.graphics.removeAll()
            enableCreatePolygon(draw, view)
          })
        })

        function enableCreatePolygon (draw, view) {
          // create() will return a reference to an instance of PolygonDrawAction
          var action = draw.create('polygon')

          // focus the view to activate keyboard shortcuts for drawing polygons
          view.focus()

          // listen to vertex-add event on the action
          action.on('vertex-add', drawPolygon)

          // listen to cursor-update event on the action
          action.on('cursor-update', drawPolygon)

          // listen to vertex-remove event on the action
          action.on('vertex-remove', drawPolygon)

          // *******************************************
          // listen to draw-complete event on the action
          // *******************************************
          action.on('draw-complete', drawPolygon)
        }

        // this function is called from the polygon draw action events
        // to provide a visual feedback to users as they are drawing a polygon
        function drawPolygon (event) {
          var vertices = event.vertices

          // remove existing graphic
          view.graphics.removeAll()

          // create a new polygon
          var polygon = createPolygon(vertices)

          // create a new graphic representing the polygon, add it to the view
          var graphic = createGraphic(polygon)

          view.graphics.add(graphic)

          _this.graphic = graphic

          // calculate the area of the polygon
          var area = geometryEngine.geodesicArea(polygon, 'square-meters')
          if (area < 0) {
            // simplify the polygon if needed and calculate the area again
            var simplifiedPolygon = geometryEngine.simplify(polygon)
            if (simplifiedPolygon) {
              area = geometryEngine.geodesicArea(simplifiedPolygon, 'square-meters')
            }
          }
          _this.areas = area
          // start displaying the area of the polygon
          labelAreas(polygon, area)
        }

        // create a polygon using the provided vertices
        function createPolygon (vertices) {
          return new Polygon({
            rings: vertices,
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
          view.graphics.add(graphic)
        }
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
  @import '../assets/less/submitBtn.less';
  .markPolygon {
    position: fixed;
    z-index: 9;
    .view_markPolygon {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
</style>
