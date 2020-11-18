<template>
  <div>dfgdfg</div>
</template>
<script>
export default {
  name: "ExternalPage",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {
    $route: {
      handler(val, oldval) {
        console.log(val); //新路由信息
        console.log(oldval); //老路由信息
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    // window.open('https://www.baidu.com/', "_blank");
    // window.location.href = "https://www.baidu.com/";
  },
  methods: {}
};
</script>
<style  type="text/css" lang="scss" scoped>
</style>



