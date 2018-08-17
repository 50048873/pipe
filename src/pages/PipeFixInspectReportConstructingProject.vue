<template>
  <div class="page page-hasTab">
    <form class="form" ref="formEle">
      <div class="item-group line-bottom line-top">
        <h6>工程区域</h6>
        <div class="btnWrap">
          <a class="btn btn-mini color-theme extend-click" @click="markPolygon">标面</a>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>工程名称</h6>
        <div>
          <input type="text" name="areaname" placeholder="请输入工程名称" required v-model="params.areaname">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>施工单位</h6>
        <div>
          <input type="text" name="buildTeam" placeholder="请输入施工单位" v-model="params.buildTeam">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>开工日期</h6>
        <div class="dateWrap">
          <input type="date" placeholder="请输入开工日期" required v-model="params.commencementDate">
          <span>{{params.commencementDate}}</span>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>竣工日期</h6>
        <div class="dateWrap">
          <input type="date" placeholder="请输入竣工日期" required v-model="params.completionDate">
          <span>{{params.completionDate}}</span>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>联系人</h6>
        <div>
          <input type="text" name="linkman" placeholder="请输入联系人" v-model="params.linkman" @focus="focus">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>联系人电话</h6>
        <div>
          <input type="text" name="phone" placeholder="请输入手机号" v-model="params.phone" @focus="focus">
        </div>
      </div>
      <div class="hiddenTrouble">
        <h6>备注</h6>
        <textarea name="remark" placeholder="请输入备注" v-model="params.remark" @focus="focus"></textarea>
        <p class="explain">至少10个字符，已输入{{params.remark.length}}个字符</p>
      </div>

      <div class="huiUploaderWrap"><hui-uploader des="注：包括工程公示牌、施工平面图等内容" @fileChanged="fileChanged"></hui-uploader></div>

      <div class="submitWrap">
        <button class="btn" :class="getSubmitBtnClass" @click.prevent="submit" :disabled="disabled">上报</button>
      </div>
    </form>
    <transition name="fade">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
import {getServerErrorMessageAsHtml} from 'hui/lib/util.js'
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'
import {androidInputBugFixEvent, getSubmitBtnClass} from '@/assets/js/mixin'
import moment from 'moment'
export default {
  mixins: [androidInputBugFixEvent, getSubmitBtnClass],
  data () {
    return {
      params: {
        areaname: '骏业财富广场',
        buildTeam: '中建三局',
        commencementDate: '2016-05-20',
        completionDate: '2018-09-30',
        linkman: '胡工',
        phone: '13800000000',
        remark: '项目已封顶，正在进行外立面施工',
        files: []
      },
      disabled: false
    }
  },
  methods: {
    markPolygon () {
      this.$router.push({name: 'MarkPolygon', params: {areaName: this.params.areaname}})
    },
    fileChanged (files) {
      this.params.files = files
    },
    validate () {
      let params = this.$route.params
      this.areaId = params.areaId // uuid
      if (!this.areaId) {
        this.$message({
          content: '请先点击标面按钮，然后在打开的页面中标面，并保存成功才能上报在建工程',
          time: 10000
        })
        return false
      }
      if (!this.params.areaname) {
        this.$message({
          content: '请输入工程名称'
        })
        return false
      }
      if (!this.params.commencementDate) {
        this.$message({
          content: '请输入开工日期'
        })
        return false
      }
      if (!this.params.completionDate) {
        this.$message({
          content: '请输入竣工日期'
        })
        return false
      }
      if (this.params.yhmx && this.params.yhmx.length < 10) {
        this.$message({
          content: `至少应该输入10个字符，已输入${this.params.yhmx.length}个字符`
        })
        return false
      }
      return true
    },
    submit () {
      if (!this.validate()) return
      this.disabled = true
      let formEle = this.$refs.formEle
      let params = new FormData(formEle)

      params.append('commencementDate', moment(this.params.commencementDate).format('YYYY/M/D'))
      params.append('completionDate', moment(this.params.completionDate).format('YYYY/M/D'))

      // 添加其它要传的参数
      params.append('type', '2') // 问题类型
      params.append('areaId', this.areaId) // uuid

      this.params.files.forEach(function (item) {
        params.append('files', item)
      })

      api.addPorject(params)
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            this.$message({
              content: res.msg,
              time: 600,
              closed: () => {
                this.$router.push('/pipeFix')
              }
            })
          } else {
            this.$message({
              content: res.msg
            })
            this.disabled = false
          }
        }, (err) => {
          this.$message({content: getServerErrorMessageAsHtml(err, 'ReservoirDetailInspectionAdd.vue->submit'), icon: 'hui-icon-warn'})
          this.disabled = false
        })
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
</style>
