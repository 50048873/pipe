<template>
  <div class="page page-hasFooter message">
    <problem-list></problem-list>
  </div>
</template>

<script>
import ProblemList from '@/components/ProblemList'
export default {
  components: {
    ProblemList
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variable.less';
</style>
