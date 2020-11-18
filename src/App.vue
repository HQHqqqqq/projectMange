<template>
  <div id="app">
    <router-view v-if="routerAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: "app",
  data(){
    return{
      routerAlive:true
    }
  },
  provide(){
    return {
      routerRefresh: this.routerRefresh
    }
  },
  methods:{
    routerRefresh(){
      this.routerAlive = false;
      this.$nextTick(()=>{
          this.routerAlive = true;
      });
    },
  }
};
</script>
