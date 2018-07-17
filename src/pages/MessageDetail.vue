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
      <textarea></textarea>
    </div>
    <div class="reasonNoAccept">
      <h6>不接受工作原因</h6>
      <textarea></textarea>
    </div>
    <div class="btnWrap">
      <a href="javascript:;" class="btn btn-info">接受</a>
      <a href="javascript:;" class="btn btn-plain-warn">不接受</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  }
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
        justify-content: space-between;
        padding: 15px;
        background-color: white;
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
        height: 96px;
        resize: none;
        border: 1px solid @color-border-default;
      }
    }
  }
</style>
