<template>
  <div class="page page-hasFooter message">
    <div class="searchWrap">
      <hui-search backgroundColor="#dcdcdc"></hui-search>
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
      <li
        class="line-top line-bottom"
        v-for="(item, index) in data"
        :key="index"
        @click="goDetail(item.id)"
      >
        <div class="iconWrap">
          <i class="hui-icon-bell"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span class="title">{{item.title}}</span>
            <span class="urgent color-red"><i>紧急</i></span>
          </h6>
          <p>{{item.des}}</p>
        </div>
        <div class="arrow-r"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
let data = [
  {
    id: 0,
    title: '标题',
    des: '描叙',
    status: 0,
    type: 0
  }
]
export default {
  data () {
    return {
      date: moment().format('YYYY-MM-DD'),
      data: data
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
