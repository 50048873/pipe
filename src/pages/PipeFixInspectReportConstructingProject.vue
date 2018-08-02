<template>
  <div class="page page-hasTab">
    <form class="form" ref="formEle">
      <div class="item-group line-bottom line-top">
        <h6>工程区域</h6>
        <div class="btnWrap">
          <a href="javascript:;" class="btn btn-mini color-theme">标面</a>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>工程名称</h6>
        <div>
          <input type="text" placeholder="请输入工程名称" required v-model="params.gcmc">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>施工单位</h6>
        <div>
          <input type="text" placeholder="请输入施工单位" v-model="params.sgdw">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>开工日期</h6>
        <div class="dateWrap">
          <input type="date" placeholder="请输入开工日期" required v-model="params.startDate">
          <span>{{params.startDate}}</span>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>竣工日期</h6>
        <div class="dateWrap">
          <input type="date" placeholder="请输入竣工日期" required v-model="params.endDate">
          <span>{{params.endDate}}</span>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>联系人</h6>
        <div>
          <input type="text" placeholder="请输入联系人" v-model="params.lxr" @focus="focus">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>联系人电话</h6>
        <div>
          <input type="text" placeholder="请输入手机号" v-model="params.lxrdh" @focus="focus">
        </div>
      </div>
      <div class="hiddenTrouble">
        <h6>备注</h6>
        <textarea placeholder="请输入备注" v-model="params.bz" @focus="focus"></textarea>
        <p class="explain">至少10个字符，已输入{{params.bz.length}}个字符</p>
      </div>

      <div class="huiUploaderWrap"><hui-uploader des="注：包括工程公示牌、施工平面图等内容" @fileChanged="fileChanged"></hui-uploader></div>

      <div class="submitWrap">
        <a href="javascript:;" class="btn color-theme"  @click.prevent="submit" :disabled="disabled">上报</a>
      </div>
    </form>
  </div>
</template>

<script>
import {getServerErrorMessageAsHtml, getUuid} from 'hui/lib/util.js'
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'
import {androidInputBugFixEvent} from '@/assets/js/mixin'
export default {
  mixins: [androidInputBugFixEvent],
  data () {
    return {
      params: {
        gcmc: '',
        sgdw: '',
        startDate: '2016-05-20',
        endDate: '2018-09-30',
        lxr: '',
        lxrdh: '',
        bz: '',
        files: []
      },
      disabled: false
    }
  },
  methods: {
    fileChanged (files) {
      this.params.files = files
    },
    validate () {
      if (!this.params.yhdd) {
        this.$message({
          content: '请输入隐患地点'
        })
        return false
      }
      if (!this.params.gcmc) {
        this.$message({
          content: '请输入隐患名称'
        })
        return false
      }
      if (!this.params.sbmc) {
        this.$message({
          content: '请输入设备名称'
        })
        return false
      }
      if (!this.params.jjcd) {
        this.$message({
          content: '请选择紧急程度'
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
      // params.append('pid', getPid())
      params.append('id', getUuid(32, 16))
      this.params.files.forEach(function (item) {
        params.append('files', item)
      })

      api.getReservoirDetailInspectionAdd(params)
        .then((res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          if (res.status === success) {
            this.$message({
              content: res.msg
            })
            this.$router.back()
            this.$destroy()
          } else {
            this.$message({
              content: res.msg
            })
          }
        }, (err) => {
          this.$message({content: getServerErrorMessageAsHtml(err, 'ReservoirDetailInspectionAdd.vue->submit'), icon: 'hui-warn'})
        }).always(() => {
          this.disabled = false
        })
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
</style>
