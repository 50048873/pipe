<template>
  <label for="searchInput" class="Search" :class="{'center': center}" :style="getBgColor">
    <span class="extend-click" @click.prevent><i class="hui-icon-search"></i></span>
    <input id="searchInput" ref="searchInput" type="text" :placeholder="placeholder" v-model="searchValue" />
  </label>
</template>

<script>

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索关键字'
    },
    center: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'white'
    }
  },
  data () {
    return {
      searchValue: ''
    }
  },
  computed: {
    getBgColor () {
      return {
        'background-color': this.backgroundColor
      }
    }
  },
  watch: {
    searchValue (newVal) {
      if (!this.center) return
      let len = newVal.length
      if (len > 0) {
        this.$refs.searchInput.style.width = len + 1 + 'em'
      } else {
        this.$refs.searchInput.style.width = 5 + 'em'
      }
      this.$emit('search-change', newVal)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .Search {
    display: flex;
    align-items: center;
    color: @color-text;
    // background-color: #dcdcdc;
    border-radius: 14px;
    box-sizing: border-box;
    padding-right: 15px;
    padding-left: 15px;
    .extend-click {
      &:active {
        transition: transform 0.2s;
        transform: scale(1.25);
        i {
          color: @color-theme;
        }
      }
    }
    input {
      display: block;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 6px;
    }
    &.center {
      justify-content: center;
      input {
        width: 5em;
        margin-right: 1em;
        margin-left: 1em;
        padding-left: 0;
        max-width: calc(100% - 14px);
        box-sizing: border-box;
        text-align: center;
      }
    }
  }
</style>
