<template>
  <div class="page pipeFix">
    <div id="viewDiv"></div>
    <div class="viewBtnWrap">
      <input class="esri-component esri-widget-button esri-widget esri-interactive" type="button" id="toggleViewBtn" value="3D" />
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
        bottom="90">
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
            <td class="detailBtnWrap"><router-link class="btn btn-mini color-theme" to="/pipeFix/pipeFixDetail">详情</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
export default {
  methods: {
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
