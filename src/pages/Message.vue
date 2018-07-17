<template>
  <div class="page message">
    <div class="searchWrap">
      <search></search>
    </div>
    <ul>
      <li class="line-top line-bottom" @click="goDetail(0)">
        <div class="iconWrap">
          <i class="hui-icon-bell"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span>标题标题<b class="redDot"></b></span>
          </h6>
          <p>描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙描叙</p>
        </div>
        <div class="detailWrap">
          <div class="time">12-23 13:00</div>
          <div class="detail">
            <a href="javascript:;" class="btn btn-plain-warn">查看详情</a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Search from '@/components/Search'
export default {
  components: {
    Search
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
      margin: 15px;
    }
    ul {
      li {
        display: flex;
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
          i {
            font-size: 28px;
            color: white;
          }
        }
        .titleWrap {
          flex: 1;
          margin-left: 8px;
          padding-right: 15px;
          white-space: nowrap;
          overflow: hidden;
          h6 {
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            margin-bottom: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            .redDot {
              position: absolute;
              width: 8px;
              height: 8px;
              background-color: red;
              border-radius: 50%;
              margin-top: 3px;
              margin-left: 4px;
            }
          }
          p {
            font-size: 12px;
            line-height: 1;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .detailWrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;
          text-align: right;
        }
      }
    }
  }
</style>
