<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="/"><img src="../assets/logo.png" style="padding-left:8px" /></a>
      </div>
      <div class="topbar-logos">
        <a href="/" style="color: #fff;"><span>项目管理系统</span></a>
      </div>
      <div class="topbar-title">
        <el-row>
          <el-col :span="24">
            <el-menu :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
              :router="true">

              <el-menu-item v-for="(item, index) in menuList" :index="item.path" :key="index">{{ item.name }}
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="topbar-account topbar-btn">
        <i class="el-icon-user-solid"></i> {{this.userinfo.emp_name}}

        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <i class="el-icon-question"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <p class="pop-time">2020-4-28项目管理系统-功能发布、更新如下：</p>
              <ul class="pop-ul">
                <li>
                  <span class="cirle"></span>1、财务报表导出。
                </li>
                <li><span class="cirle"></span>2、软硬件review。</li>
                <li><span class="cirle"></span>3、文档批量下载。</li>
                <li><span class="cirle"></span>4、项目里程碑文档变更。</li>
                <li><span class="cirle"></span>5、项目团队模块查找范围优化。</li>
                <li><span class="cirle"></span>6、项目里程碑“完成百分比”优化</li>
                <li><span class="cirle"></span>7、通过数据中台获取OA、SERP的回款数据。</li>
                <li><span class="cirle"></span>8、合同列表（含待登记、高级筛选、查询）。</li>
                <li><span class="cirle"></span>9、国图经费产值模块增加日期筛选区间范围。</li>
              </ul>

            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapActions } from "vuex";
import config from "../config";
export default {
  name: "leftNav",
  data() {
    return {
      loading: false,
      companyName: "",
      defaultActiveIndex: "/sysMenu",
      homeMenu: false,
      messageCount: 5
    };
  },
  computed: {
    ...mapState([
      "userinfo" //oa跳转过来的用户信息值
    ]),
    menuList: function() {
      var list = JSON.parse(localStorage.getItem("menuList"));
      return list;
    }
  },
  methods: {
    handleSelect(index) {
      this.defaultActiveIndex = index;
    },
    fetchNavData() {
      // 初始化菜单激活项
      let cur_path = this.$route.path; //获取当前路由
      // let routers = this.$router.options.routes; // 获取路由对象
      let routers = this.menuList; // 获取路由对象
      let nav_type = "",
        nav_name = "";
      for (var i = 0; i < routers.length; i++) {
        let children = routers[i].children;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              nav_type = routers[i].type;
              nav_name = routers[i].path;
              break;
            }
            // 如果该菜单下还有子菜单
            if (children[j].children) {
              let grandChildren = children[j].children;
              for (let z = 0; z < grandChildren.length; z++) {
                if (grandChildren[z].path === cur_path) {
                  nav_type = routers[i].type;
                  nav_name = routers[i].path;
                  break;
                }
              }
            }
          }
        }
      }
      this.$store.state.topNavState = nav_type;
      this.$store.state.leftNavState = nav_name;
      this.defaultActiveIndex = nav_name;
    }
  },
  watch: {
    $route: function(to, from) {
      // 路由改变时执行
      //console.info("to.path:" + to.path);
      this.fetchNavData();
    }
  },
  mounted() {},
  created() {
    // 组件创建完后获取数据
    this.fetchNavData();
  }
};
</script>
<style lang="scss" scoped>
.pop-time {
  font-weight: bold;
}
</style>
