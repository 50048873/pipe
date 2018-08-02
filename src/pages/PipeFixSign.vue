<template>
  <div class="page pipeFixSign">
    <section class="startSignWrap">
      <ul class="line-bottom">
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
        <div id="viewDiv"></div>
      </div>
      <div class="signPhotoWrap">
        <hui-uploader title="签到照片"></hui-uploader>
      </div>
      <div class="signBtnWrap">
        <a class="btn color-theme">签到</a>
      </div>
    </section>
    <section class="signedWrap"></section>
    <div class="tabsWrap">
      <tabs></tabs>
    </div>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
export default {
  components: {
    Tabs
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFixSign {
    ul {
      margin-bottom: @margin-small;
      background-color: white;
      padding: 10px;
      li {
        display: flex;
        margin-top: 5px;
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
    #viewDiv {
      width: 100%;
      height: 350px;
      background-color: white;
    }
    .signPhotoWrap {
      margin: 10px;
    }
    .signBtnWrap {
      margin: 10px;
    }
  }
</style>
