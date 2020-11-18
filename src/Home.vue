<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24">
      <top-nav></top-nav>
    </el-col>
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <left-nav></left-nav>
      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </section>
    </el-col>
  </el-row>
</template>
<script>
import leftNav from "@/view/leftNav";
import topNav from "@/view/topNav";
import { mapState, mapActions } from "vuex";
export default {
  name: "home",
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState([
      "userinfo" //oa跳转过来的用户信息值
    ])
  },
  methods: {
    ...mapActions(["getUserInfo"])
  },
  created() {
    this.getUserInfo();
  },
  components: {
    leftNav,
    topNav
  }
};
</script>
<style lang="scss" >
@import "assets/css/app.css";
@import "assets/css/common.css";
</style>
