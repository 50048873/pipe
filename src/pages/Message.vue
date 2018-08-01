<template>
  <div class="page page-hasFooter message">
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
            <span class="title">标题标题</span>
            <span class="redDot"></span>
          </h6>
          <p>描叙描叙</p>
        </div>
        <div class="detailWrap">
          <div class="time">12-23 13:00</div>
          <div class="detail">
            <a href="javascript:;" class="btn btn-mini btn-plain color-warn">查看详情</a>
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
      margin: 10px 15px;
    }
    ul {
      li {
        padding: 15px;
        background-color: white;
        .iconWrap {
          float: left;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: @color-theme;
          border-radius: 50%;
          i {
            font-size: 24px;
            color: white;
          }
        }
        .titleWrap {
          display: inline-flex;
          width: calc(100% - 55px - 80px);
          height: 40px;
          margin-left: 8px;
          margin-right: 15px;
          flex-direction: column;
          justify-content: space-between;
          h6 {
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            .title {
              display: inline-block;
              max-width: 90%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
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
            white-space: nowrap;
          }
        }
        .detailWrap {
          position: absolute;
          top: 50%;
          right: 15px;
          font-size: 12px;
          text-align: right;
          transform: translateY(-50%);
          .time {
            margin-bottom: 4px;
          }
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
</style>
