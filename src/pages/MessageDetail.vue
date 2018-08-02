<template>
  <div class="page message">
    <ul>
      <li class="line-bottom">
        <span class="title">检修单号</span>
        <span class="content">内容</span>
      </li>
      <li class="line-bottom">
        <span class="title">最迟处理时间</span>
        <span class="content">内容</span>
      </li>
      <li class="line-bottom">
        <span class="title">紧急程度</span>
        <span class="content">内容</span>
      </li>
      <li class="line-bottom">
        <span class="title">检修类型</span>
        <span class="content">内容</span>
      </li>
      <li class="line-bottom">
        <span class="title">检修地点</span>
        <span class="content"><i class="hui-icon-bell"></i></span>
      </li>
    </ul>
    <div class="hiddenDangerDes">
      <h6>隐患描述</h6>
      <textarea @focus="focus"></textarea>
    </div>
    <div class="reasonNoAccept">
      <h6>不接受工作原因</h6>
      <textarea @focus="focus"></textarea>
    </div>
    <div class="btnWrap">
      <a href="javascript:;" class="btn color-theme">接受</a>
      <a href="javascript:;" class="btn color-theme">不接受</a>
    </div>
  </div>
</template>

<script>
import {androidInputBugFixEvent} from '@/assets/js/mixin'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [androidInputBugFixEvent]
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .message {
    .searchWrap {
      margin: 15px;
    }
    ul {
      li {
        display: flex;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        background-color: white;
        [class^="hui-icon"] {
          font-size: 24px;
          color: @color-theme;
        }
      }
    }
    .hiddenDangerDes, .reasonNoAccept {
      margin: 15px;
      h6 {
        margin-bottom: 5px;
      }
      textarea {
        display: block;
        width: 100%;
        height: 100px;
        resize: none;
        border: 1px solid @color-border-default;
        line-height: 1.5;
        padding: 5px;
        box-sizing: border-box;
      }
    }
    .btnWrap {
      display: flex;
      margin: 0 15px 15px;
      .btn {
        flex: 1;
        &:first-child {
          margin-right: 8px;
        }
        &:last-child {
          margin-left: 8px;
        }
      }
    }
  }
</style>
