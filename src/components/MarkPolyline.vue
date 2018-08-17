<template>
  <div class="page markPolygon">
    <div id="view_markPolygon" class="view_markPolygon">
      <div id="line-button" class="esri-widget-button esri-widget esri-interactive" title="Draw polyline">
        <span class="esri-icon-polyline"></span>
      </div>
    </div>

    <div class="submitWrap">
      <button class="btn color-theme" @click="del"><i class="hui-icon-bell"></i>删除</button>
      <button class="btn color-theme" :class="getSubmitBtnClass" @click="save" :disabled="disabled"><i class="hui-icon-bell"></i>保存</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
import {getTiandituMap, labelLength} from '@/assets/js/util'
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'
import {getServerErrorMessageAsHtml, getUuid} from 'hui/lib/util.js'
import {getSubmitBtnClass} from '@/assets/js/mixin'
export default {
  mixins: [getSubmitBtnClass],
  data () {
    return {
      disabled: false
    }
  },
  methods: {
    del () {
      this.drawLineButton.click()
    },
    save () {
      this.disabled = true
      let planArea = JSON.stringify(this.graphic.geometry)
      let params = {
        areaCode: getUuid(32, 16),
        areaName: this.areaName || '',
        planArea: planArea,
        areas: (this.lineLength / 1000).toString()
      }
      console.log(params)
      api.addPlanArea(params)
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            this.$message({
              content: res.msg,
              time: 400,
              closed: () => {
                this.$router.push({name: 'PipeFixInspectReportRoadImprove', params: {areaId: params.areaCode}})
              }
            })
          } else {
            this.$message({
              content: res.msg
            })
            this.disabled = false
          }
        }, (err) => {
          this.$message({content: getServerErrorMessageAsHtml(err, 'MarkPolygon.vue->save'), icon: 'hui-icon-warn'})
          this.disabled = false
        })
    },
    async initPipeFixMap () {
      // 加载天地图
      var map = await getTiandituMap()

      esriLoader.loadModules([
        'esri/config',
        "esri/Map",
        "esri/views/MapView",
        "esri/views/2d/draw/Draw",
        "esri/Graphic",
        "esri/geometry/Polyline",
        "esri/geometry/geometryEngine",

        "dojo/domReady!"
      ], options).then(async ([config, Map, MapView, Draw, Graphic, Polyline, geometryEngine]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282')

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

        view.ui.remove("zoom")

        this.map = map
        this.view = view

        // add the button for the draw tool
        view.ui.add("line-button", "top-left");

        view.when(function(event) {
          var draw = new Draw({
            view: view
          });

          // ********************
          // draw polyline button
          // ********************
          _this.drawLineButton = document.getElementById("line-button");
          _this.drawLineButton.onclick = function() {
            view.graphics.removeAll();
            enableCreateLine(draw, view);
          }
        });

        function enableCreateLine(draw, view) {
          // creates and returns an instance of PolyLineDrawAction
          // can only draw a line by clicking on the map
          var action = draw.create("polyline", {
            mode: "click"
          });

          // focus the view to activate keyboard shortcuts for sketching
          view.focus();

          // listen to vertex-add event on the polyline draw action
          action.on("vertex-add", updateVertices);

          // listen to vertex-remove event on the polyline draw action
          action.on("vertex-remove", updateVertices);

          // listen to cursor-update event on the polyline draw action
          action.on("cursor-update", createGraphic);

          // listen to draw-complete event on the polyline draw action
          action.on("draw-complete", updateVertices);
        }

        // This function is called from the "vertex-add" and "vertex-remove"
        // events. Checks if the last vertex is making the line intersect itself.
        function updateVertices(event) {
          var point = event.vertices.slice().pop();
          // create a polyline from returned vertices
          var result = createGraphic(event);

          // calculate the length of the polyline
          var length = geometryEngine.geodesicLength(result.graphic.geometry, "meters");
          _this.lineLength = length

          // start displaying the area of the polygon
          labelLength(view, Graphic, point, length);

          // if the last vertex is making the line intersects itself,
          // prevent "vertex-add" or "vertex-remove" from firing
          if (result.selfIntersects) {
            event.preventDefault();
          }
        }

        // create a new graphic presenting the polyline that is being drawn on the view
        function createGraphic(event) {
          var vertices = event.vertices;
          view.graphics.removeAll();

          // a graphic representing the polyline that is being drawn
          var graphic = new Graphic({
            geometry: new Polyline({
              paths: vertices,
              spatialReference: view.spatialReference
            }),
            symbol: {
              type: "simple-line", // autocasts as new SimpleFillSymbol
              color: 'red',
              width: 4,
              cap: "round",
              join: "round"
            }
          });

          // check the polyline intersects itself.
          var intersectingFeature = getIntersectingFeature(graphic.geometry);

          // Add a new graphic for the intersecting segment.
          if (intersectingFeature) {
            view.graphics.addMany([graphic, intersectingFeature]);
          }
          // Just add the graphic representing the polyline if no intersection
          else {
            view.graphics.add(graphic);
          }

          _this.graphic = graphic

          // return the graphic and intersectingSegment
          return {
            graphic: graphic,
            selfIntersects: intersectingFeature
          }
        }

        // function that checks if the line intersects itself
        function isSelfIntersecting(polyline) {
          if (polyline.paths[0].length < 3) {
            return false
          }
          var line = polyline.clone();

          //get the last segment from the polyline that is being drawn
          var lastSegment = getLastSegment(polyline);
          line.removePoint(0, line.paths[0].length - 1);

          // returns true if the line intersects itself, false otherwise
          return geometryEngine.crosses(lastSegment, line);
        }

        // Checks if the line intersects itself. If yes, changes the last
        // segment's symbol giving a visual feedback to the user.
        function getIntersectingFeature(polyline) {
          if (isSelfIntersecting(polyline)) {
            return new Graphic({
              geometry: getLastSegment(polyline),
              symbol: {
                type: "simple-line", // autocasts as new SimpleLineSymbol
                style: "short-dot",
                width: 3.5,
                color: "yellow"
              }
            });
          }
          return null;
        }

        // Get the last segment of the polyline that is being drawn
        function getLastSegment(polyline) {
          var line = polyline.clone();
          var lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
          var existingLineFinalPoint = line.getPoint(0, line.paths[0].length -
            1);

          return new Polyline({
            spatialReference: view.spatialReference,
            hasZ: false,
            paths: [
              [
                [existingLineFinalPoint.x, existingLineFinalPoint.y],
                [lastXYPoint.x, lastXYPoint.y]
              ]
            ]
          });
        }
      })
    },
    // registerPolyline () {
    // },
    initSingleDirectionParam () {
      this.view = null                  // 视图
      this.map = null                   // 地图
      this.graphic = null               // 画的线
      this.drawLineButton = null        // 画面按钮
      this.lineLength = null            // 线长
      let params = this.$route.params
      this.areaName = params.areaName
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
