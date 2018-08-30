<template>
  <div class="page message">
    <div class="searchWrap">
      <hui-search backgroundColor="#dcdcdc" @search-change="searchChange" time="600"></hui-search>
    </div>
    <div class="dateWrap">
      <span>{{date}}</span>
      <span>
        <label for="date">
          <!-- <i class="hui-icon-calendar"></i> -->
          <input id="date" type="date" v-model="date" @change="getInspectData" />
        </label>
      </span>
    </div>
    <ul>
      <li
        class="line-top line-bottom"
        v-for="item in hiddenAndOtherData"
        :key="item.id"
        @click="goDetail(item.id, 'hiddenAndOtherData')"
      >
        <div class="iconWrap">
          <i :class="getIconClass(item.probType)"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span class="title">{{getTypeTxt(item.probType)}}</span>
            <span class="urgent" :class="getProbStatusClass(item.probStatus)"><i>{{getStatusTxt(item.probStatus)}}</i></span>
          </h6>
          <p v-if="item.probType == 1">{{item.probName}}</p>
          <p v-else-if="item.probType == 4">{{item.place}}</p>
        </div>
        <div class="arrow-r"></div>
      </li>
      <li
        class="line-top line-bottom"
        v-for="item in buildAndRoadData"
        :key="item.id"
        @click="goDetail(item.id, 'buildAndRoadData')"
      >
        <div class="iconWrap">
          <i :class="getIconClass(item.probType)"></i>
        </div>
        <div class="titleWrap">
          <h6>
            <span class="title">{{getTypeTxt(item.probType)}}</span>
            <span class="urgent" :class="getProbStatusClass(item.probStatus)"><i>{{getStatusTxt(item.probStatus)}}</i></span>
          </h6>
          <p>{{item.areaName}}</p>
        </div>
        <div class="arrow-r"></div>
      </li>
    </ul>
    <hui-nodata v-show="!hiddenAndOtherData.length && !buildAndRoadData.length"></hui-nodata>
  </div>
</template>

<script>
import moment from 'moment'
import {getServerErrorMessageAsHtml} from 'hui/lib/util.js'
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'

export default {
  data () {
    return {
      date: moment().format('YYYY-MM-DD'),
      name: '',
      hiddenAndOtherData: [],
      buildAndRoadData: []
    }
  },
  methods: {
    getTypeTxt (probType) {
      let res
      switch (probType) {
        case '1':
          res = '隐患'
          break
        case '2':
          res = '在建工程'
          break
        case '3':
          res = '道路改造'
          break
        case '4':
          res = '其他'
          break
      }
      return res
    },
    getIconClass (probLevel) {
      let res
      switch (probLevel) {
        case '1':
          res = 'hui-icon-bell'
          break
        case '4':
          res = 'hui-icon-bell'
          break
        case '2':
          res = 'hui-icon-clock'
          break
        case '3':
          res = 'hui-icon-clock'
          break
        default:
          res = 'hui-icon-bell'
      }
      return res
    },
    getProbStatusClass (probLevel) {
      let res
      switch (probLevel) {
        case '0':
          res = 'color-probStatus-1'
          break
        case '1':
          res = 'color-probStatus-2'
          break
        case '2':
          res = 'color-probStatus-3'
          break
        case '3':
          res = 'color-probStatus-4'
          break
        case '4':
          res = 'color-probStatus-5'
          break
        default:
          res = 'color-probStatus-1'
      }
      return res
    },
    getStatusTxt (probLevel) {
      let res
      switch (probLevel) {
        case '0':
          res = '未核实'
          break
        case '1':
          res = '已核实'
          break
        case '2':
          res = '已派单'
          break
        case '3':
          res = '处理中'
          break
        case '4':
          res = '已处理'
          break
        default:
          res = '未核实'
      }
      return res
    },
    goDetail (id, resource) {
      let from = this.$route.path
      let to = `${from}/${id}`
      this.$router.push({path: to, query: {resource: resource}})
    },
    searchChange (newVal) {
      this.name = newVal
      this.getInspectData()
    },
    getInspectData () {
      let params = {
        time: this.date,
        name: this.name
      }
      return api.getInspectData(params)
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            let data = res.data
            this.hiddenAndOtherData = data && data.hiddenAndOtherData
            this.buildAndRoadData = data && data.buildAndRoadData
            // console.log(this.hiddenAndOtherData, this.buildAndRoadData)
            // this.$message({
            //   content: res.msg,
            //   time: 400
            // })
          } else {
            this.$message({
              content: res.msg
            })
          }
        }, (err) => {
          this.$message({content: getServerErrorMessageAsHtml(err, 'ProblemList.vue->save'), icon: 'hui-icon-warn'})
        })
    }
  },
  created () {
    this.getInspectData()
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .message {
    z-index: 9;
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
      // input {
      //   visibility: hidden;
      // }
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
