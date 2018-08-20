<template>
  <div class="page page-hasTab">
    <form class="form" ref="formEle">
      <div class="item-group line-bottom line-top">
        <h6>隐患地点<span class="required color-red">*</span></h6>
        <div class="iconWrap">
          <input type="text" name="place" placeholder="手动输入或者定位" required v-model="params.place">
          <i class="hui-icon-bell"></i>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>隐患名称<span class="required color-red">*</span></h6>
        <div>
          <input type="text" name="probName" placeholder="请输入隐患名称" required v-model="params.probName">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>设备编号</h6>
        <div>
          <input type="text" name="deviceCode" placeholder="请输入设备编号" v-model="params.deviceCode" pattern="[a-zA-Z0-9_-]*">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>设备名称<span class="required color-red">*</span></h6>
        <div>
          <input type="text" name="deviceName" placeholder="请输入设备名称" required v-model="params.deviceName">
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>紧急程度<span class="required color-red">*</span></h6>
        <div class="urgentGrade">
          <label class="radio-item" for="red">
            <input type="radio" name="probLevel" id="red" value="0" v-model="params.probLevel" required>
            <a href="javascript:;" class="btn btn-mini btn-plain color-text">紧急</a>
          </label>
          <label class="radio-item" for="warn">
            <input type="radio" name="probLevel" id="warn" value="1" v-model="params.probLevel" required>
            <a href="javascript:;" class="btn btn-mini btn-plain color-text">严重</a>
          </label>
          <label class="radio-item" for="normal">
            <input type="radio" name="probLevel" id="normal" value="2" v-model="params.probLevel" required>
            <a href="javascript:;" class="btn btn-mini btn-plain color-text">一般</a>
          </label>
        </div>
      </div>
      <div class="hiddenTrouble">
        <h6>隐患描述</h6>
        <textarea name="descrip" placeholder="请输入隐患描述" v-model="params.descrip" @focus="focus"></textarea>
        <p class="explain">至少10个字符，已输入{{params.descrip.length}}个字符</p>
      </div>

      <div class="huiUploaderWrap"><hui-uploader @fileChanged="fileChanged"></hui-uploader></div>

      <div class="submitWrap">
        <button class="btn" :class="getSubmitBtnClass" @click.prevent="submit" :disabled="disabled">上报</button>
      </div>
    </form>
  </div>
</template>

<script>
import {getServerErrorMessageAsHtml} from 'hui/lib/util.js'
import * as api from '@/assets/js/api'
import {success} from '@/assets/js/config'
import {androidInputBugFixEvent} from '@/assets/js/mixin'
import {mapGetters} from 'vuex'
export default {
  mixins: [androidInputBugFixEvent],
  data () {
    return {
      params: {
        probStatus: '1',
        place: '必胜客欢乐餐厅骏业餐厅', //
        probName: '消防栓漏水', //
        deviceCode: 'dc-00001', //
        deviceName: '消防栓', //
        probLevel: '1',
        descrip: '必胜客欢乐餐厅骏业餐厅附近有一处消防栓在滴水', //
        files: []
      },
      disabled: false
    }
  },
  computed: {
    ...mapGetters(['inspectedPathInfo']),
    getSubmitBtnClass () {
      return this.disabled ? 'color-disabled' : 'color-theme'
    }
  },
  methods: {
    fileChanged (files) {
      this.params.files = files
    },
    validate () {
      if (!this.params.place) {
        this.$message({
          content: '请输入隐患地点'
        })
        return false
      }
      if (!this.params.probName) {
        this.$message({
          content: '请输入隐患名称'
        })
        return false
      }
      if (!this.params.probName) {
        this.$message({
          content: '请输入隐患名称'
        })
        return false
      }

      let deviceCode = this.$refs.formEle['deviceCode']
      if (deviceCode.validity && deviceCode.validity.patternMismatch) {
        this.$message({
          content: '设备编号只能包含字母（区分大小写）、数字、英文中横杠（-）、英文下横杠（_）'
        })
        return false
      }

      if (!this.params.probLevel) {
        this.$message({
          content: '请选择紧急程度'
        })
        return false
      }
      if (this.params.descrip && this.params.descrip.length < 10) {
        this.$message({
          content: `至少应该输入10个字符，已输入${this.params.descrip.length}个字符`
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
      // 添加其它要传的参数
      params.append('probType', '1') // 问题类型
      let coord = this.inspectedPathInfo.slice().pop()
      if (coord) {
        params.append('lgtd', coord.longitude) // 经度
        params.append('lttd', coord.latitude) // 纬度
      }

      this.params.files.forEach(function (item) {
        params.append('files', item)
      })

      api.addDanger(params)
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
                // this.$destroy()
              }
            })
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
  },
  created () {

  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
</style>
