<template>
  <div class="tabs line-top">
    <div
      class="tab"
      :class="{ON: currentIndex === index}"
      v-for="(item, index) in data"
      :key="index"
      @click="tabChange(index)">
      <i :class="item.icon"></i>
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
let data = [
  {
    name: '巡检签到',
    icon: 'hui-icon-bell'
  },
  {
    name: '已签到点',
    icon: 'hui-icon-bell'
  }
]
export default {
  data () {
    return {
      data: data,
      currentIndex: 0
    }
  },
  methods: {
    tabChange (index) {
      this.currentIndex = index
      this.$emit('tabChange', index)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .tabs {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    text-align: center;
    background-color: white;
    .tab {
      flex: 1;
      padding: 10px 0;
      position: relative;
      background-color: white;
      &:hover {
        opacity: 0.8;
      }
      &.ON {
        color: @color-theme;
      }
      &:first-child {
        &:before {
          content: " ";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 1px;
          border-right: 1px solid;
          transform-origin: 0 0;
          transform: scaleX(0.5);
          color: @color-border-default;
        }
      }
    }
  }
</style>
