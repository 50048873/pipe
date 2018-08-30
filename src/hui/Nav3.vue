<template>
  <nav class="HuiNav3" :style="[getHeight, getPosition]" :class="[theme, getHalfLineClass, getActiveLine]" v-if="data && data.length">
    <router-link
      v-for="(item, index) in data"
      :key="index"
      :to="item.to"
      :replace="item.replace || replace"
      :append="item.append || append"
      :tag="item.tag || tag"
      :activeClass="activeClass(item)"
      :exact="item.exact || exact"
      :event="item.event || event"
      :exactActiveClass="exactActiveClass(item)"
      @click="navClick(item, index)">
      <div class="huiNav3-item">
        <div class="iconWrap" v-if="item.icon">
          <span :class="{'redDot': item.new}" v-if="item.new"></span>
          <i :class="item.icon"></i>
        </div>
        <h3 v-if="item.title">{{item.title}}</h3>
      </div>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'HuiNav3',
  props: {
    data: {
      type: Array
    },
    replace: {
      type: Boolean,
      default: false
    },
    append: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: {
      type: Boolean,
      default: false
    },
    event: {
      type: [String, Array],
      default: 'click'
    },
    theme: {
      type: String
    },
    position: {
      type: String,
      default: 'bottom'
    },
    height: {
      type: String
    },
    isActiveLine: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getPosition () {
      if (this.position === 'top') {
        return {
          top: 0
        }
      }
      return {
        bottom: 0
      }
    },
    getHalfLineClass () {
      if (this.position === 'top') {
        return 'line-bottom'
      }
      return 'line-top'
    },
    getHeight () {
      if (this.height) {
        return {
          height: this.height
        }
      }
      return ''
    },
    getActiveLine () {
      if (this.isActiveLine) {
        return 'isActiveLine'
      }
      return ''
    }
  },
  methods: {
    activeClass (item) {
      let activeClass = item['active-class']
      if (activeClass) {
        return activeClass
      }
      return item.activeClass
    },
    exactActiveClass (item) {
      let exactActiveClass = item['exact-active-class']
      if (exactActiveClass) {
        return exactActiveClass
      }
      return item.exactActiveClass
    },
    navClick (item, index) {
      this.$emit('nav-click', item, index)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../assets/less/variable.less';
  .HuiNav3 {
    position: absolute;
    z-index: 7;
    width: 100%;
    height: 62px;
    background-color: white;
    display: flex;
    text-align: center;
    box-sizing: border-box;
    white-space: nowrap;
    overflow-x: visible;
    a {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @color-nav-default;
      padding: 0 1em;
      &.ON {
        color: #0e6fca;
      }
      .huiNav3-item {
        .iconWrap {
          display: inline-block;
          position: relative;
          .redDot {
            position: absolute;
            top: -3px;
            right: -3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: red;
          }
          [class*="hui-icon"] {
            font-size: 24px;
          }
        }
        h3 {
          line-height: 1;
          padding-top: 4px;
        }
      }
    }
    &.isActiveLine {
      .ON {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #0e6fca;
        }
      }
    }
  }
</style>
