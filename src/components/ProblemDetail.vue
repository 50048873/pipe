<template>
  <div class="page warnDetail">
    <div v-if="data.probType == 1">
      <h2>{{data.probName}}</h2>
      <ul class="detail line-top line-bottom">
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报人：</span>
          <span class="content">{{data.createUser}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报时间：</span>
          <span class="content"><time>{{data.reportTime}}</time></span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报来源：</span>
          <span class="content">{{data.reportType}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报类型：</span>
          <span class="content">{{getTypeTxt(data.probType)}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报地点：</span>
          <span class="content">{{data.place}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">紧急程度：</span>
          <span class="urgent" :class="getProbLevelClass(data.probLevel)"><i>{{getProbLevel(data.probLevel)}}</i></span>
        </li>
      </ul>
    </div>
    <div v-else-if="data.probType == 2">
      <h2>{{data.areaName}}</h2>
      <ul class="detail line-top line-bottom">
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报人：</span>
          <span class="content">{{data.createUser}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报时间：</span>
          <span class="content"><time>{{data.reportTime}}</time></span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报来源：</span>
          <span class="content">{{data.reportType}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报类型：</span>
          <span class="content">{{getTypeTxt(data.probType)}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">工程名称：</span>
          <span class="content"><time>{{data.areaName}}</time></span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">施工单位：</span>
          <span class="content">{{data.buildTeam}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">联系人：</span>
          <span class="content">{{data.linkMan}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">联系电话：</span>
          <span class="content">{{data.phone}}</span>
        </li>
      </ul>
    </div>
    <div v-else-if="data.probType == 3">
      <h2>{{data.areaName}}</h2>
      <ul class="detail line-top line-bottom">
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报人：</span>
          <span class="content">{{data.createUser}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报时间：</span>
          <span class="content"><time>{{data.reportTime}}</time></span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报来源：</span>
          <span class="content">{{data.reportType}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报类型：</span>
          <span class="content">{{getTypeTxt(data.probType)}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">工程名称：</span>
          <span class="content"><time>{{data.areaName}}</time></span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">施工单位：</span>
          <span class="content">{{data.buildTeam}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">联系人：</span>
          <span class="content">{{data.linkMan}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">联系电话：</span>
          <span class="content">{{data.phone}}</span>
        </li>
      </ul>
    </div>
    <div v-else-if="data.probType == 4">
      <h2>{{data.reportType}}</h2>
      <ul class="detail line-top line-bottom">
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报人：</span>
          <span class="content">{{data.createUser}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报时间：</span>
          <span class="content"><time>{{data.reportTime}}</time></span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报来源：</span>
          <span class="content">{{data.reportType}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">上报类型：</span>
          <span class="content">{{getTypeTxt(data.probType)}}</span>
        </li>
        <li>
          <span class="iconWrap"><i class="hui-icon-bell"></i></span>
          <span class="title">发生地点：</span>
          <span class="content">{{data.place}}</span>
        </li>
      </ul>
    </div>
    <h3 v-if="data.file && data.file.length">现场照片</h3>
    <photo :photos="data.file" v-if="data.file && data.file.length"></photo>
    <display-polygon></display-polygon>
  </div>
</template>

<script>
import Photo from '@/components/Photo'
import DisplayPolygon from '@/components/DisplayPolygon'
import {getServerErrorMessageAsHtml} from 'hui/lib/util.js'
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    Photo,
    DisplayPolygon
  },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    getProbLevelClass (probLevel) {
      let res
      switch (probLevel) {
        case '0':
          res = 'color-red'
          break
        case '1':
          res = 'color-warn'
          break
        case '2':
          res = 'color-normal'
          break
        default:
          res = 'color-normal'
      }
      return res
    },
    getProbLevel (probLevel) {
      let res
      switch (probLevel) {
        case '0':
          res = '紧急'
          break
        case '1':
          res = '严重'
          break
        case '2':
          res = '一般'
          break
        default:
          res = '一般'
      }
      return res
    },
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
    getInspectData () {
      let params = {
        id: this.id
      }
      return api.getInspectData(params)
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            let data = res.data
            let query = this.$route.query
            let resource = query && query.resource
            this.data = resource && data[resource].length && data[resource][0]
            // console.log(res)
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
