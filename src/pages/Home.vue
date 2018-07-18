<template>
  <div class="page page-hasFooter home">
    <nav>
      <div class="item">
        <span><i class="hui-icon-gclb"></i></span>
        <span>管网信息</span>
      </div>
      <div class="item">
        <span><i class="hui-icon-gclb"></i></span>
        <span>管网监测</span>
      </div>
      <div class="item">
        <span><i class="hui-icon-gclb"></i></span>
        <span>分区计量</span>
      </div>
      <div class="item">
        <span><i class="hui-icon-gclb"></i></span>
        <span>巡检抢修</span>
      </div>
      <div class="item">
        <span><i class="hui-icon-gclb"></i></span>
        <span>统计分析</span>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="less">
  .home {
    background-image: linear-gradient(to bottom, #0884f4, #34d2d1);
    nav {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
      .item {
        width: calc(100% - 30px);
        height: 25%;
        margin-top: 15px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
        span {
          font-size: 20px;
          margin: 0 8px;
          font-weight: bold;
        }
        [class^="hui-icon"] {
          font-size: 50px;
        }
        &:nth-child(1) {
          background-image: linear-gradient(to bottom, #2593f5, #2ca1ef);
        }
        &:nth-child(2) {
          background-image: linear-gradient(to bottom, #2ea5ed, #37b5e5);
        }
        &:nth-child(3) {
          background-image: linear-gradient(to bottom, #38b7e4, #40c1e1);
        }
        &:nth-child(4) {
          background-image: linear-gradient(to bottom, #40c3df, #47cdd9);
        }
        &:nth-child(5) {
          background-image: linear-gradient(to bottom, #48ceda, #4cd6d8);
        }
        &:last-child {
          margin-bottom: 15px;
        }
      }
    }
  }
</style>
