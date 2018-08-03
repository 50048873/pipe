<template>
  <div class="page page-hasTab">
    <form class="form" ref="formEle">
      <div class="item-group line-bottom line-top">
        <h6>隐患地点</h6>
        <div class="iconWrap">
          <input type="text" placeholder="手动输入或者定位" required v-model="params.yhdd">
          <i class="hui-icon-bell"></i>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>隐患名称</h6>
        <div>
          <input type="text" placeholder="请输入隐患名称" required v-model="params.yhmc">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>设备编号</h6>
        <div>
          <input type="text" placeholder="请输入设备编号" v-model="params.sbbh">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>设备名称</h6>
        <div>
          <input type="text" placeholder="请输入设备名称" required v-model="params.sbmc">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>紧急程度</h6>
        <div class="urgentGrade">
          <label class="radio-item" for="red">
            <input type="radio" id="red" value="0" v-model="params.jjcd" required>
            <a href="javascript:;" class="btn btn-mini btn-plain color-text">紧急</a>
          </label>
          <label class="radio-item" for="warn">
            <input type="radio" id="warn" value="1" v-model="params.jjcd" required>
            <a href="javascript:;" class="btn btn-mini btn-plain color-text">严重</a>
          </label>
          <label class="radio-item" for="normal">
            <input type="radio" id="normal" value="2" v-model="params.jjcd" required>
            <a href="javascript:;" class="btn btn-mini btn-plain color-text">一般</a>
          </label>
        </div>
      </div>
      <div class="hiddenTrouble">
        <h6>隐患描述</h6>
        <textarea placeholder="请输入隐患描述" v-model="params.yhmx" @focus="focus"></textarea>
        <p class="explain">至少10个字符，已输入{{params.yhmx.length}}个字符</p>
      </div>

      <div class="huiUploaderWrap"><hui-uploader @fileChanged="fileChanged"></hui-uploader></div>

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
        yhdd: '',
        yhmc: '',
        sbbh: '',
        sbmc: '',
        jjcd: '',
        yhmx: '',
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
      if (!this.params.yhmc) {
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
          this.$message({content: getServerErrorMessageAsHtml(err, 'ReservoirDetailInspectionAdd.vue->submit'), icon: 'hui-icon-warn'})
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
