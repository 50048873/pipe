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
import Tabs from '@/components/Tabs'
import List3 from '@/components/List3'
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
  methods: {
    tabChange (index) {
      this.currentIndex = index
    }
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
