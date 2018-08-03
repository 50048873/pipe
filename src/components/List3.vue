<template>
  <ul class="HuiList3 clearfix" v-if="data.length">
    <li class="line-top line-bottom item" v-for="(item, index) in data" :key="index">
      <div class="datetimeWrap">
        <p>
          <time class="day">20</time>
          <time>6月</time>
        </p>
        <p>
          <time class="time">10:30</time>
        </p>
      </div>
      <div class="contentWrap">
        <h6 class="line-top">固原市</h6>
        <p class="des">固原市北京路</p>
        <div class="thumbnail">
          <ul>
            <li v-for="(photo, index) in item.photos" :key="index">
              <img height="60px" v-lazy="photo.thumb" alt="">
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import {replaceSomeCharacter} from '@/assets/js/mixin'
import {getItem} from '@/assets/js/session'
export default {
  name: 'HuiList3',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mixins: [replaceSomeCharacter],
  created () {
    this.filePathUrl = getItem('filePathUrl')
    // v-lazy = "filePathUrl + _replaceSomeCharacter(photo.thumb, '\\', '/')"
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .HuiList3 {
    .item {
      margin-top: @margin-small;
      background-color: white;
      padding: @margin-medium;
      display: flex;
      .datetimeWrap {
        font-weight: bold;
        padding-right: @margin-medium;
        .day {
          font-size: 20px;
        }
        .time {
          font-size: 16px;
        }
      }
      .contentWrap {
        flex: 1;
        margin-top: 12px;
        h6 {
          padding-top: @margin-medium;
        }
        .des {
          font-size: 10px;
          margin-bottom: 10px;
        }
        .thumbnail {
          overflow-x: auto;
          ul {
            white-space: nowrap;
            li {
              display: inline-block;
              margin-right: @margin-small;
            }
          }
        }
      }
      &:last-child {
        margin-bottom: @margin-small;
      }
    }
  }
</style>
