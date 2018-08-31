<template>
  <div class="page pipeFixSign">
    <list3 :data="signedData" @image-click="imageClick"></list3>
    <gallery :visible.sync="visible" :index="index" :backgroundImage="backgroundImage"></gallery>
  </div>
</template>

<script>
import List3 from '@/components/List3'
import Gallery from '@/components/Gallery'
let signedData = [
  {
    datetime: '06-20 10:30',
    title: '固原市',
    des: '固原市北京路',
    photos: [
      {
        thumb: require('@/assets/img/example-1.jpg')
      }
    ]
  }
]
export default {
  components: {
    List3,
    Gallery
  },
  data () {
    return {
      signedData: signedData,
      visible: false,
      index: -1,
      backgroundImage: ''
    }
  },
  methods: {
    imageClick (index, backgroundImage) {
      this.visible = true
      this.index = index
      this.backgroundImage = backgroundImage
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .pipeFixSign {
    z-index: 9;
    padding-bottom: 40px;
  }
</style>
