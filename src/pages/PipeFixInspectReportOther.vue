<template>
  <div class="page page-hasTab">
    <form class="form" ref="formEle">
      <div class="item-group line-bottom line-top">
        <h6>发生地点<span class="required color-red">*</span></h6>
        <div class="iconWrap">
          <input type="text" name="place" placeholder="手动输入或者定位" required v-model="params.place">
          <i class="hui-icon-bell"></i>
        </div>
      </div>
      <div class="item-group line-bottom">
        <h6>上报类型<span class="required color-red">*</span></h6>
        <div>
          <input type="text" name="reportType" placeholder="请输入（乱用水、乱接管等等）" required v-model="params.reportType">
        </div>
      </div>
      <div class="hiddenTrouble">
        <h6>备注</h6>
        <textarea name="descrip" placeholder="请输入备注" v-model="params.descrip"></textarea>
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
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      params: {
        probStatus: '1',
        place: '必胜客欢乐餐厅骏业餐厅',
        reportType: '消防栓漏水',
        descrip: '必胜客欢乐餐厅骏业餐厅附近有一处消防栓在滴水',
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
          content: '请输入发生地点'
        })
        return false
      }
      if (!this.params.reportType) {
        this.$message({
          content: '请输入上报类型'
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
      params.append('probType', '4') // 问题类型
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
  .form {
    padding: 10px 0;
    .item-group {
      display: flex;
      padding: 10px;
      background-color: white;
      > div {
        flex: 1;
        text-align: right;
        input {
          text-align: right;
        }
      }
      .iconWrap {
        [class*="hui-icon"] {
          color: @color-theme;
        }
      }
      .urgentGrade {
        .radio-item {
          display: inline-block;
          input {
            position: absolute;
            width: 54px;
            height: 28px;
            z-index: 1;
            opacity: 0;
          }
          #red {
            &:checked + .btn {
              color: white;
              background-color: @color-red;
            }
          }
          #warn {
            &:checked + .btn {
              color: white;
              background-color: @color-warn;
            }
          }
          #normal {
            &:checked + .btn {
              color: white;
              background-color: @color-normal;
            }
          }
        }
      }
    }
    .hiddenTrouble {
      padding: 10px;
      h6 {
        padding-bottom: 5px;
      }
      textarea {
        display: block;
        border: 0;
        resize: none;
        width: 100%;
        height: 110px;
        padding: 10px;
        color: inherit;
        font-size: 1em;
        line-height: inherit;
        outline: 0;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        box-sizing: border-box;
      }
      .explain {
        text-align: right;
        line-height: 2;
        font-size: 10px;
      }
    }
    .huiUploaderWrap {
      padding: 0 10px;
    }
    .submitWrap {
      margin: 10px;
    }
  }
</style>
