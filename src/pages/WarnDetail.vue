<template>
  <div class="page warnDetail">
    <h2>东关北街滨河小区门口爆管</h2>
    <ul class="detail line-top line-bottom">
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span class="title">上报时间：</span>
        <span class="content"><time>2018-05-26 10:30</time></span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span class="title">上报地点：</span>
        <span class="content">东关北街滨河小区门口<i class="hui-icon-bell"></i></span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span class="title">上报类型：</span>
        <span class="content">巡检上报</span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span class="title">上报人：</span>
        <span class="content">徐丽</span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span class="title">上报类型：</span>
        <span class="content">曝管</span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span class="title">紧急程度：</span>
        <span class="content"><b class="jinji">紧急</b></span>
      </li>
    </ul>
    <h3>现场照片</h3>
    <div class="line-top line-bottom">
      <ul class="photos clearfix">
        <li v-for="(item, index) in photos" :key="index">
          <span class="photoWrap" :style="getBg(item.url)"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
let photos = [
  {
    url: '/static/img/example-1.jpg'
  },
  {
    url: '/static/img/example-1.jpg'
  },
  {
    url: '/static/img/example-1.jpg'
  },
  {
    url: '/static/img/example-1.jpg'
  },
  {
    url: '/static/img/example-1.jpg'
  }
]
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      photos: photos
    }
  },
  methods: {
    getBg (url) {
      return {
        backgroundImage: `url(${url})`
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .warnDetail {
    h2 {
      text-align: center;
      font-weight: bold;
      line-height: 1;
      padding: 10px 0;
    }
    .detail {
      background-color: white;
      li {
        padding: 0 15px 10px;
        color: #828282;
        .title {
          display: inline-block;
          margin-left: 6px;
          width: 6em;
        }
        .content {
          color: @color-text;
          [class^="hui-icon"] {
            color: @color-theme;
            margin-left: 10px;
          }
        }
        .jinji {
          display: inline-block;
          background-color: @color-red;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          line-height: 1;
        }
        &:first-child {
          padding-top: 10px;
        }
      }
    }
    h3 {
      line-height: 2;
      padding-left: 15px;
    }
    .photos {
      background-color: white;
      padding: 5px;
      li {
        width: calc((100vw - 10px) / 4);
        height: calc((100vw - 10px) / 4);
        float: left;
        box-sizing: border-box;
        padding: 5px;
        &:hover {
          opacity: 0.8;
        }
        .photoWrap {
          display: inline-block;
          width: 100%;
          height: 100%;
          background-color: #eee;
          position: relative;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
    }
  }
</style>
