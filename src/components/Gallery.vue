<template>
  <transition name="fade">
    <div class="Gallery" v-show="visible" @click.prevent="closeGallery">
      <span class="weui-gallery__img" :style="getImage()"></span>
      <div class="weui-gallery__opr" v-if="delIcon">
        <a href="javascript:" class="weui-gallery__del">
          <i class="hui-icon-bell weui-icon_gallery-delete extend-click" @click.prevent="deleteImage"></i>
        </a>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'Gallery',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    backgroundImage: {
      type: String,
      default: '',
      required: true
    },
    index: {
      type: [Number, String],
      required: true
    },
    delIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeGallery () {
      this.$emit('update:visible', false)
    },
    deleteImage () {
      this.$emit('delete-image', this.index)
      this.$emit('update:visible', false)
    },
    getImage () {
      if (this.backgroundImage) {
        return {
          'background-image': `url(${this.backgroundImage})`
        }
      }
      return ''
    }
  }
}
</script>

<style scoped lang="less">
  .Gallery {
    &.fade-enter-active, &.fade-leave-active {
      transition: opacity .4s;
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
    }
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000000;
    z-index: 1000;
    .weui-gallery__img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 60px;
      left: 0;
      background: center center no-repeat;
      background-size: contain;
    }
    .weui-gallery__opr {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #0D0D0D;
      color: #FFFFFF;
      line-height: 60px;
      text-align: center;
    }
    .weui-gallery__del {
      display: block;
      i {
        color: #FFFFFF;
        font-size: 22px;
      }
    }
  }
</style>
