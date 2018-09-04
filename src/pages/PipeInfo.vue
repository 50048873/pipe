<template>
  <div class="page pipeFix">
    <div id="view_pipeFix"></div>
    <div class="searchWrap">
      <hui-search
        :center.sync="isCenter"
        @search-change="searchChange"
      >
      </hui-search>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import {getTiandituMap} from '@/assets/js/util'
export default {
  data () {
    return {
      isCenter: true
    }
  },
  methods: {
    searchChange (newVal) {
      console.log(newVal)
    },
    async initPipeMap () {
      // 加载天地图
      var map = await getTiandituMap()
      let [MapView] = await esriLoader.loadModules([
        'esri/views/MapView'
      ], window.DSE.options)

      // 创建MapView
      var view = new MapView({
        container: 'view_pipeFix',
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
      // 移除缩放图标
      view.ui.remove('zoom')

      this.map = map
      this.view = view

      // 注册点击事件
      this.registerPopup()
    },
    registerPopup () {
      this.view.on('click', (event) => {
        event.stopPropagation()
        console.log(event)
        let screenPoint = {
          x: event.x,
          y: event.y
        }
        let mapPoint = event.mapPoint
        this.view.hitTest(screenPoint)
          .then((res) => {
            console.log(res)
            let info = res.results[0]
            if (!info) {
              this.view.popup.open({
                // currentDockPosition: 'bottom-center',
                dockEnabled: true,
                dockOptions: {
                  // Disables the dock button from the popup
                  buttonEnabled: true,
                  // Ignore the default sizes that trigger responsive docking
                  breakpoint: {
                    width: 320
                  },
                  position: 'top-center'
                },
                // Set the popup's title to the coordinates of the clicked location
                title: 'xx管道信息',
                location: mapPoint, // Set the location of the popup to the clicked location,
                content: `<div class="pipeInfo-popup">
                            <div class="pipeInfo-popup-photo"></div>
                            <table class="pipeInfo-popup-table">
                              <tbody>
                                <tr>
                                  <td>管道编号</td>
                                  <td>NXST-XFS001</td>
                                </tr>
                                <tr>
                                  <td>管道长度</td>
                                  <td>600m</td>
                                </tr>
                                <tr>
                                  <td>所在道路</td>
                                  <td>固原大道</td>
                                </tr>
                                <tr>
                                  <td>埋设深度</td>
                                  <td>0.89m</td>
                                </tr>
                                <tr>
                                  <td>更多资料</td>
                                  <td><a class="btn btn-mini color-theme">详情</a></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>`
              })
            }
          })
      })
    },
    initSingleDirectionParam () {
      this.view = null // 视图
      this.map = null // 地图
    }
  },
  created () {
    this.initSingleDirectionParam()
  },
  mounted () {
    this.initPipeMap()
  }
}
</script>

<style lang="less">
  @import '../assets/less/variable.less';
  .pipeFix {
    #view_pipeFix {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
    .searchWrap {
      position: fixed;
      top: 10px;
      right: 10px;
      // left: 57px;
      left: 10px;
    }
    .esri-popup__feature-buttons {
      display: none;
    }
    .pipeInfo-popup {
      display: flex;
      .pipeInfo-popup-photo {
        width: 150px;
        height: 150px;
        background-color: @color-theme;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url('/static/img/example-1.jpg');
      }
      .pipeInfo-popup-table {
        flex: 1;
        height: 149px;
        text-align: center;
        tbody {
          tr {
            td {
              border: 1px solid @color-border-default;
              a {
                color: @color-theme;
                position: relative;
                top: 3px;
              }
            }
            td:nth-child(2n+1) {
              width: 7em;
              background-color: #dffffe;
            }
          }
        }
      }
    }
  }
</style>
