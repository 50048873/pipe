<template>
  <div class="page pipeFixInspectTask">
    <div class="searchWrap">
      <hui-search
        @search-change="searchChange"
      >
      </hui-search>
    </div>

    <ul class="taskList">
      <li class="line-top line-bottom">
        <div class="iconWrap">
          <label class="checkbox-item" for="normal">
            <input class="extend-click" type="checkbox" value="0" v-model="checkedTask">
            <i class="hui-icon-success"></i>
            <span class="noChecked"></span>
          </label>
        </div>
        <div class="content">
          <h6>标题</h6>
          <p>描述</p>
        </div>
        <div class="percent">
          <h6>完成率</h6>
          <progress-bar></progress-bar>
        </div>
      </li>
      <li class="line-top line-bottom">
        <div class="iconWrap">
          <label class="checkbox-item" for="normal">
            <input class="extend-click" type="checkbox" value="1" v-model="checkedTask">
            <i class="hui-icon-success"></i>
            <span class="noChecked"></span>
          </label>
        </div>
        <div class="content">
          <h6>标题</h6>
          <p>描述</p>
        </div>
        <div class="percent">
          <h6>完成率</h6>
          <progress-bar></progress-bar>
        </div>
      </li>
    </ul>

    <div class="taskBtnWrap">
      <a class="btn color-theme" @click.prevent="cancel">取消</a>
      <a class="btn color-theme" @click.prevent="confirm">确定</a>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ProgressBar from '@/components/ProgressBar'
export default {
  components: {
    ProgressBar
  },
  data () {
    return {
      checkedTask: []
    }
  },
  methods: {
    searchChange (newVal) {
      console.log(newVal)
    },
    confirm () {
      this.$emit('checked', this.checkedTask)
      this.$router.push({name: 'PipeFix'})
    },
    cancel () {
      this.$router.push({name: 'PipeFix'})
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFixInspectTask {
    z-index: 9;
    .searchWrap {
      padding: @margin-medium;
    }
    .taskList {
      li {
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: @margin-medium;
        background-color: white;
        .iconWrap {
          .checkbox-item {
            position: relative;
            display: block;
            width: 22px;
            height: 22px;
            input {
              position: absolute;
              z-index: 2;
              width: 100%;
              height: 100%;
            }
            [class*="hui-icon"] {
              position: absolute;
              opacity: 0;
              color: @color-green;
              font-size: 24px;
            }
            .noChecked {
              position: absolute;
              width: 22px;
              height: 22px;
              border: 1px solid @color-border-default;
              border-radius: 50%;
            }
            input:checked + [class*="hui-icon"] {
              + .noChecked {
                display: none;
              }
              transition: opacity 0.4s;
              opacity: 1;
            }
          }
        }
        .content {
          flex: 1;
          margin-left: @margin-medium;
          h6 {
            font-weight: bold;
          }
          p {
            font-size: 12px;
          }
        }
        .percent {
          width: 104px;
          text-align: center;
          h6 {
            margin-bottom: @margin-small;
            font-size: 12px;
          }
        }
      }
    }
    .taskBtnWrap {
      display: flex;
      .btn {
        flex: 1;
        margin-right: @margin-medium;
        margin-left: @margin-medium;
      }
    }
  }
</style>
