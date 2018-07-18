<template>
  <div class="page page-hasFooter message">
    <div class="searchWrap">
      <search></search>
    </div>
    <div class="dateWrap">
      <span>{{date}}</span>
      <span>
        <label for="date">
          <i class="hui-icon-calendar"></i>
          <input id="date" type="date" v-model="date" />
        </label>
      </span>
    </div>
    <ul>
      <li class="line-top line-bottom" @click="goDetail(0)">
        <div class="iconWrap">
          <i class="hui-icon-bell"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span class="title">标题标题</span>
            <span class="urgent red"><i>紧急</i></span>
          </h6>
          <p>2018-05-24 22:21</p>
        </div>
        <div class="arrow-r"></div>
      </li>
      <li class="line-top line-bottom" @click="goDetail(0)">
        <div class="iconWrap">
          <i class="hui-icon-bell"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span class="title">标题标题</span>
            <span class="urgent warn"><i>较急</i></span>
          </h6>
          <p>2018-05-24 22:21</p>
        </div>
        <div class="arrow-r"></div>
      </li>
      <li class="line-top line-bottom" @click="goDetail(0)">
        <div class="iconWrap">
          <i class="hui-icon-bell"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span class="title">标题标题</span>
            <span class="urgent normal"><i>一般</i></span>
          </h6>
          <p>2018-05-24 22:21</p>
        </div>
        <div class="arrow-r"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import Search from '@/components/Search'
import {getDateStr} from 'hui/lib/util'
export default {
  components: {
    Search
  },
  data () {
    return {
      date: getDateStr()
    }
  },
  methods: {
    goDetail (id) {
      let from = this.$route.path
      let to = `${from}/${id}`
      this.$router.push({path: to})
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .message {
    .searchWrap {
      margin: 10px 15px;
    }
    .dateWrap {
      display: flex;
      justify-content: space-between;
      margin: 15px;
      position: relative;
      .hui-icon-calendar {
        position: absolute;
        top: 50%;
        right: 0;
        color: @color-theme;
        transform: translateY(-50%);
      }
      input {
        visibility: hidden;
      }
    }
    ul {
      li {
        margin-bottom: 5px;
        padding: 15px;
        background-color: white;
        .iconWrap {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: @color-theme;
          border-radius: 50%;
          float: left;
          i {
            font-size: 24px;
            color: white;
          }
        }
        .titleWrap {
          display: inline-flex;
          flex-direction: column;
          justify-content: space-between;
          width: calc(100% - 55px - 30px);
          height: 40px;
          margin-left: 8px;
          margin-right: 15px;
          h6 {
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            .title {
              display: inline-block;
              max-width: calc(100% - 30px);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          p {
            font-size: 12px;
            line-height: 1;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .arrow-r {
          position: absolute;
          top: 50%;
          right: 15px;
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
</style>
