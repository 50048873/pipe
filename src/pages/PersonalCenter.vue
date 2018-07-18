<template>
  <div class="page page-hasFooter personalCenter">
    <div class="nameWrap">
      <span class="headPortrait" :style="getHeadPortrait()"></span>
      <span class="name">姓名</span>
    </div>
    <ul>
      <li class="line-top">
        <span class="title">
          <i class="hui-icon-bell"></i>
          <span>部门</span>
        </span>
        <span class="content">部门</span>
      </li>
      <li class="line-top">
        <span class="title">
          <i class="hui-icon-bell"></i>
          <span>岗位</span>
        </span>
        <span class="content">岗位</span>
      </li>
      <li class="line-top line-bottom">
        <span class="title">
          <i class="hui-icon-bell"></i>
          <span>电话</span>
        </span>
        <span class="content"><a href="tel:10016">10016</a></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    getHeadPortrait (url) {
      return {
        backgroundImage: `url(${url})`
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .personalCenter {
    background: url('../assets/img/personalCenter-1.png') center top no-repeat;
    background-size: 100% 126px;
    .nameWrap {
      color: white;
      display: inline-flex;
      align-items: center;
      margin-top: 26px;
      margin-left: 15px;
      .headPortrait {
        width: 62px;
        height: 62px;
        border: 2px solid;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: white;
        background-position: center;
        background-position: no-repeat;
        background-size: cover;
      }
      .name {
        font-size: 18px;
        margin-left: 16px;
      }
    }
    ul {
      margin-top: 34px;
      background-color: white;
      li {
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        color: @color-text;
        [class^="hui-icon"] {
          color: @color-theme;
        }
        a {
          color: @color-text;
        }
      }
    }
  }
</style>
