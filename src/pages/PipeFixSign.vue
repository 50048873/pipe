<template>
  <div class="page pipeFixSign">
    <section class="startSignWrap" v-if="currentIndex === 0">
      <ul class="line-bottom signInfo">
        <li>
          <div class="title">
            <i class="hui-icon-bell"></i>
            <span>签到时间：</span>
          </div>
          <div class="content">
            <time>2018-05-16 10:30</time>
          </div>
        </li>
        <li>
          <div class="title">
            <i class="hui-icon-bell"></i>
            <span>签到点：</span>
          </div>
          <div class="content">固原市</div>
        </li>
        <li>
          <div class="title">
            <i class="hui-icon-bell"></i>
            <span>当前位置：</span>
          </div>
          <div class="content">
            <span>固原市</span>
            <em>（距离最近签到点100米）</em>
          </div>
        </li>
      </ul>
      <div class="signMapWrap line-top line-bottom">
        <div id="view_pipeFixSign"></div>
      </div>
      <div class="signPhotoWrap">
        <hui-uploader title="签到照片"></hui-uploader>
      </div>
      <div class="signBtnWrap">
        <a class="btn color-theme">签到</a>
      </div>
    </section>
    <list3 :data="signedData" v-if="currentIndex === 1"></list3>
    <tabs @tabChange="tabChange"></tabs>
  </div>
</template>

<script>
/* eslint-disable */
import Tabs from '@/components/Tabs'
import List3 from '@/components/List3'
import * as esriLoader from 'esri-loader'
import {options} from '@/assets/js/config'
import {getTiandituMap} from '@/assets/js/util'
import {mapGetters} from 'vuex'
let signedData = [
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  },
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      },
      {
        thumb: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg',
        url: 'http://localhost:80/5ds/pipe/static/img/example-1.jpg'
      }
    ]
  }
]
export default {
  components: {
    Tabs,
    List3
  },
  data () {
    return {
      currentIndex: 0,
      signedData: signedData
    }
  },
  computed: {
    ...mapGetters(['signPoint'])
  },
  methods: {
    tabChange (index) {
      this.currentIndex = index
    },
    error (error) {
      console.log('error', error)
    },
    markSingleInspector (view, coord) {
      esriLoader.loadModules([
        "esri/Graphic"
      ], options).then(([Graphic]) => {
        let longitude = coord.longitude
        let latitude = coord.latitude

        // First create a point geometry
        var point = {
          type: "point",  // autocasts as new Point()
          longitude: longitude,
          latitude: latitude
        }

        var color = coord.id === this.currentInspectorId ? 'orange' : 'blue'

        // Create a symbol for drawing the point
        var markerSymbol = {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          color: color,
          size: 22,
          outline: {
            width: 0,
            color: [255, 255, 255, 0]
          },
          path: "M57.083,57.722v2.344c4.87,0.671,8.251,2.122,8.251,3.81c0,2.324-6.398,4.208-14.292,4.208v-3.601h2.967V51.455h4.063V40.62  c-0.791-1.182-3.344-1.161-3.344-1.161h-2.436v-0.569c1.51-0.521,2.601-1.938,2.601-3.625c0-2.126-1.724-3.85-3.851-3.85  s-3.851,1.724-3.851,3.85c0,1.687,1.091,3.104,2.601,3.625v0.569h-2.313c-2.711,0-3.468,1.161-3.468,1.161v10.964h3.935v12.898  h3.095v3.601c-7.893,0-14.292-1.884-14.292-4.208c0-1.688,3.381-3.139,8.25-3.81v-2.344c-8.068,0.834-13.917,3.292-13.917,6.195  c0,3.59,8.936,6.5,19.958,6.5c11.022,0,19.958-2.91,19.958-6.5C71,61.014,65.151,58.556,57.083,57.722z"
        }

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: coord
        })
        // console.log(pointGraphic)
        // Add the line graphic to the view's GraphicsLayer
        view.graphics.add(pointGraphic);
      })
    },
    handleNoInspect (position) {
      // console.log('handleNoInspect', position)
      let longitude = position.coords.longitude
      let latitude = position.coords.latitude

      // 移除之前自己的位置
      let graphic = this.view.graphics.items.find((graphic) => {
        if (graphic.attributes) {
          return graphic.attributes.id === this.currentInspectorId
        }
      })
      this.view.graphics.remove(graphic)

      this.markSingleInspector(this.view, {longitude, latitude, id: this.currentInspectorId})
      this.view.goTo([longitude, latitude])
    },
    watchPositionNoInspect () {
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition((position) => {
          this.handleNoInspect(position)
        }, (err) => {
          this.error(err)
        }, {
          // 指示浏览器获取高精度的位置，默认为false
          enableHighAcuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 15000,
          // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
          maximumAge: 0
        })
      }
    },
    initPipeFixMap () {
      esriLoader.loadModules([
        'esri/config',
        'esri/Map',
        'esri/Basemap',
        'esri/views/MapView',
        'esri/layers/WebTileLayer',
        'esri/layers/TileLayer',
        'esri/layers/support/TileInfo',
        'esri/layers/FeatureLayer'
      ], options).then(([config, Map, Basemap, MapView, WebTileLayer, TileLayer, TileInfo, FeatureLayer]) => {
        // config设置
        config.request.proxyUrl = 'http://10.100.50.197:2282/Java/proxy.jsp'
        config.request.corsEnabledServers.push('http://10.100.50.71:2282', 'sw.nxstjt.com')

        /* 加载天地图 */
        var map = getTiandituMap(TileInfo, WebTileLayer, Map)

        var layer1 = new FeatureLayer({
          url: 'http://10.100.50.71:6080/arcgis/rest/services/whMapService/MapServer'
        })

        var layer2 = new FeatureLayer({
          url: 'http://10.100.50.71:6080/arcgis/rest/services/whPointService/MapServer'
        })

        map.add(layer1)
        map.add(layer2)

        // 创建MapView
        var view = new MapView({
          container: 'view_pipeFixSign',
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

        // 移除esri log
        view.ui._removeComponents(['attribution'])

        this.map = map
        this.view = view

        // 标记签到点
        this.markMultiSignPoint(view, this.signPoint)

        // 标记自己的位置
        this.watchPositionNoInspect()
      })
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
          color: [255, 0, 0],
          size: 16,
          outline: {
            width: 0,
            color: [255, 255, 255, 0]
          },
          xoffset: 16,
          yoffset: 16,
          path: "M6.407,0h52.577c0,0,0.422,0,0.547,0.141c0.193,0.217,0.167,0.468,0.167,0.468v12.453h33.895V70.12H51.848V59.455H18.835V100H6.407V0z"
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
      this.view = null                  // 视图
      this.map = null                   // 地图
      this.watchId = null               // 定位id
      this.currentInspectorId = 0       // 当前巡检人
      this.startPointIsMarked = false   // 是否已标记起点
      this.interval = null              // 其他巡检人id
      this.noInspectPath = []           // 自己的非巡检路径
      this.inspectedPath = [            // 自己的巡检路径
        // [114.360694, 30.584929],
        // [114.360809, 30.585959]
      ];

      this.inspector = [
        {
          id: 0,
          longitude: 114.360287112168,
          latitude: 30.58497896868112,
          name: '巡检人一',
          tel: 13800000000
        },
        {
          id: 1,
          longitude: 114.36105805753392,
          latitude: 30.58454114785602,
          name: '巡检人二',
          tel: 13800000000
        },
        {
          id: 2,
          longitude: 114.35998254115928,
          latitude: 30.583922487994503,
          name: '巡检人三',
          tel: 13800000000
        }
      ]
    }
  },
  created () {
    this.initSingleDirectionParam()
  },
  mounted () {
    this.initPipeFixMap()
    console.log(this.signPoint)
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFixSign {
    padding-bottom: 40px;
    .signInfo {
      margin-bottom: @margin-small;
      background-color: white;
      padding: @margin-medium;
      li {
        display: flex;
        margin-top: @margin-small;
        .title {
          width: 7em;
          color: @color-text-light;
          [class^="hui-icon"] {
            margin-right: 4px;
          }
        }
        .content {
          flex: 1;
          time {
            vertical-align: -2px;
          }
          em {
            color: @color-red;
            font-size: 12px;
            font-style: normal;
          }
        }
        &:first-child {
          margin-top: 0;
        }
      }
    }
    #view_pipeFixSign {
      width: 100%;
      height: 350px;
      background-color: white;
    }
    .signPhotoWrap {
      margin: @margin-medium;
    }
    .signBtnWrap {
      margin: @margin-medium;
    }
  }
</style>
