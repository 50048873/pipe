<template>
  <div class="page warnDetail">
    <h2>东关北街滨河小区门口爆管</h2>
    <ul class="detail">
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span>上报时间：</span>
        <span><time>2018-05-26 10:30</time></span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span>上报地点：</span>
        <span>东关北街滨河小区门口<i class="hui-icon-bell"></i></span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span>上报类型：</span>
        <span>巡检上报</span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span>上报人：</span>
        <span>徐丽</span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span>上报类型：</span>
        <span>曝管</span>
      </li>
      <li>
        <span class="iconWrap"><i class="hui-icon-bell"></i></span>
        <span>紧急程度：</span>
        <span><b class="jinji">紧急</b></span>
      </li>
    </ul>
    <h3>现场照片</h3>
    <ul class="photos">
      <li>
        <img src="" alt="img">
      </li>
    </ul>
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
  .warnDetail {
    h2 {
      text-align: center;
      font-weight: bold;
    }
    .detail {
      li {
        color: #828282;
      }
    }
  }
</style>
