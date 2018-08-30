<template>
  <transition :name="transitionName">
    <router-view class="Slide"></router-view>
  </transition>
</template>

<script>
export default {
  name: 'HuiRouterviewSlide',
  data () {
    return {
      transitionName: 'slideToLeft'
    }
  },
  watch: {
    '$route' (to, from) {
      let toPath = to.path
      let fromPath = from.path
      let routers = sessionStorage.getItem('routers')
      let routersArr = (routers && routers.split(',')) || []
      if (routersArr.length === 0) {
        routersArr.push(fromPath)
        routersArr.push(toPath)
      } else {
        let index = routersArr.indexOf(toPath)
        if (index !== -1) {
          this.transitionName = 'slideToRight'
          routersArr.splice(index + 1, 100)
        } else {
          this.transitionName = 'slideToLeft'
          routersArr.push(toPath)
        }
      }
      sessionStorage.setItem('routers', routersArr.join(','))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .Slide {
    transition: all 0.2s ease-out;
    &.slideToLeft-enter {
        transform: translate3d(100%, 0, 0);
    }
    &.slideToLeft-leave-to {
        transform: translate3d(-100%, 0, 0);
    }
    &.slideToRight-enter {
        transform: translate3d(-100%, 0, 0);
    }
    &.slideToRight-leave-to {
        transform: translate3d(100%, 0, 0);
    }
  }
</style>
