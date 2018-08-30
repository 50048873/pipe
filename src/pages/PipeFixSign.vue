<template>
  <div class="page pipeFixSign">
    <list3 :data="signedData"></list3>
  </div>
</template>

<script>
import List3 from '@/components/List3'

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
    List3
  },
  data () {
    return {
      signedData: signedData
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
