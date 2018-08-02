<template>
  <div class="line-top line-bottom">
    <ul class="photos clearfix">
      <li v-for="(item, index) in photos" :key="index">
        <span class="photoWrap" :style="getBg(item.url)"></span>
      </li>
    </ul>
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
    photos: {
      type: Array,
      default: () => {
        return photos
      }
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
</style>
