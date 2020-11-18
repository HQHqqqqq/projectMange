<template>
  <!--左侧导航-->
  <aside>
    <!--展开折叠开关-->
    <div class="menu-toggle" @click.prevent="collapse">
      <i class="el-icon-s-fold" v-show="!collapsed" title="收起"></i>
      <i class="el-icon-s-unfold" v-show="collapsed" title="展开"></i>
    </div>
    <!--导航菜单-->
    <el-menu :default-active="$route.path" router :collapse="collapsed" ref="leftNavigation">
      <!-- <template v-for="(issue,index) in $router.options.routes"> -->
      <!-- <template v-for="(issue,index) in $router.options.routes"> -->
      <template v-for="(issue, index) in menuList">
        <!-- 注意：这里就是leftNavState状态作用之处，当该值与router的根路由的name相等时加载相应菜单组 -->
        <template v-if="issue.path === $store.state.leftNavState">
          <template v-for="(item, index) in issue.children">
            <el-submenu
              v-if="!item.leaf"
              :index="index + ''"
              class="sub-menu wrap-more"
              :key="index"
            >
              <template slot="title" class>
                <i class="iconfont" :class="item.icon"></i>
                <span slot="title" class="change-name">{{ item.name }}</span>
                <i
                  v-show="!collapsed"
                  class="el-icon-more nav-more"
                  @click.stop="openLately"
                  v-if="
                    item.code == 'YIZHANGTUGONGXIANGPINGTAI' ||
                      item.code == 'HT_ROOT'
                  "
                ></i>
                <transition name="slide-fade" v-if="item.code == 'YIZHANGTUGONGXIANGPINGTAI'">
                  <div class="div-more" v-if="latelyMore" @click.stop v-clickoutside="handleClose">
                    <p class="title">最近查看项目</p>
                    <ul v-for="(item, index) in projectArray" :key="index">
                      <li @click="recentProList(item, true)">
                        <span>{{ index + 1 }}</span>
                        ，{{ item.projectName }}
                      </li>
                    </ul>
                  </div>
                </transition>
              </template>
              <el-menu-item
                v-for="term in item.children"
                :key="term.path"
                :index="term.path"
                :class="$route.path === term.path ? 'is-active' : ''"
              >
                <i class="iconfont" :class="term.icon"></i>
                <span slot="title">{{ term.name }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else-if="item.leaf"
              :index="item.path"
              :class="$route.path === item.path ? 'is-active' : ''"
              :key="item.path"
            >
              <template v-if="item.name == '审批列表'">
                <i class="iconfont" :class="item.icon"></i>
                <span slot="title">{{ item.name }}</span>
                <span slot="title" class="badge" v-show="isExamineNum"></span>
              </template>
              <template v-else>
                <i class="iconfont" :class="item.icon"></i>
                <span slot="title">{{ item.name }}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </aside>
</template>
<script>
import config from "../config";
import { mapState, mapActions } from "vuex";
import {
  getMenuList,
  integrationGetMethod,
  getProject,
  updateTime
} from "../api/api";
import Bus from "../bus";
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};
export default {
  name: "leftNav",
    inject:['routerRefresh'],   //在子组件中注入在父组件中创建的属性
  data() {
    return {
      //是否展示最近查看项目
      latelyMore: false,
      menuList: [],
      loading: false,
      collapsed: this.$store.state.collapsed,
      //获取待审核数据
      examineCount: 0,
      //审批已发流程数量
      examineCountYF: 0,
      //审批待发流程数量
      examineCountDF: 0,
      projectArray: []
    };
  },
  directives: { clickoutside },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "audittableOne", //待审流程审批列表数字
      "audittableThreeDF", //待发流程审批列表数字
      "audittableTwoYF" //已发流程审批列表数字
    ]),
    isExamineNum: function() {
      if (
        this.examineCount == 0 &&
        this.examineCountYF == 0 &&
        this.examineCountDF == 0
      ) {
        return false;
      } else {
        return true;
      }
    }
    // menuList: function() {
    //   var list = JSON.parse(localStorage.getItem("menuList"));
    //   return list;
    // }
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    handleClose() {
      this.latelyMore = false;
    },
    openLately() {
      this.latelyMore = !this.latelyMore;
      getProject("/sgpm/rest/api/server/pm/project/lately", {
        memberId: this.userinfo.memberid
      })
        .then(res => {
          let projectList = res.data.data;
          this.projectArray = projectList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
      this.$store.state.collapsed = this.collapsed;
    },
    // 左侧导航栏根据当前路径默认打开子菜单（如果当前是二级菜单，则父级子菜单默认打开）
    defaultLeftNavOpened() {
      let cur_path = this.$route.path; //获取当前路由
      // let routers = this.$router.options.routes; // 获取路由对象
      let routers = this.menuList; // 获取路由对象
      let subMenuIndex = "",
        needOpenSubmenu = false;
      for (let i = 0; i < routers.length; i++) {
        let children = routers[i].children;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              break;
            }
            // 如果该菜单下还有子菜单
            if (children[j].children && !children[j].leaf) {
              let grandChildren = children[j].children;
              for (let z = 0; z < grandChildren.length; z++) {
                if (grandChildren[z].path === cur_path) {
                  subMenuIndex = j;
                  needOpenSubmenu = true;
                  break;
                }
              }
            }
          }
        }
      }
      if (this.$refs["leftNavigation"] && needOpenSubmenu) {
        this.$refs["leftNavigation"].open(subMenuIndex); // 打开子菜单
      }
    },
    getMenuList() {
      var list = JSON.parse(localStorage.getItem("menuList"));
      this.menuList = list;
    },
    //递归查找code未YIZHANGTUGONGXIANGPINGTAI未指定项目节点
    searchProjectName(val, list) {
      for (var item of list) {
        if (item.code == "YIZHANGTUGONGXIANGPINGTAI") {
          item.name = val == null ? "未指定项目" : val;
          break;
        } else {
          if (item.children.length > 0) {
            this.searchProjectName(val, item.children);
          } else {
            continue;
          }
        }
      }
    },

    //获取最近访问的项目列表isChangeProject 默认进来不传这参数，只有点击切换项目的时候传true，如果传true需要跳转项目信息页面，如果不传不需要跳转
    recentProList(val, isChangeProject) {
      this.searchProjectName(val.projectName, this.menuList);
      var params = {
        projectId: val.id,
        userId: this.userinfo.memberid
      };
      var storage = window.localStorage;
      if (val.id != null) {
        storage.projectNumber = val.projectNumber;
        storage.projectName = val.projectName;
        storage.projectId = val.id; //项目id
        storage.parent_id = val.parent_id;
      }
      if(val.jump_type=='11'){
        localStorage.setItem("judgeproject",'非合同项目信息')
      }else{
        localStorage.setItem("judgeproject",'项目信息')
      }
      Bus.$emit("projectContent", val);
      if (isChangeProject) {
        this.$router.push({
          name: "/projectInformation",
        });
        localStorage.setItem("jump_type",val.jump_type)
        this.routerRefresh();
      }
      updateTime("/sgpm/rest/api/server/pm/project/lately", params)
        .then(res => {
          //请求成功后再调用
          if (res.data.code == 200) {
            getProject("/sgpm/rest/api/server/pm/project/lately", {
              memberId: this.userinfo.memberid
            })
              .then(res => {
                var projectList = res.data.data;
                this.projectArray = projectList;
                let list = JSON.parse(localStorage.getItem("menuList"));
                var projectNamearray = [];
                list.forEach(jtem => {
                  if (jtem.name == "项目视图") {
                    projectNamearray.push(jtem);
                  }
                });
                var menuCodeAry = projectNamearray[0].children;
                menuCodeAry.forEach(item => {
                  if (item.code == "YIZHANGTUGONGXIANGPINGTAI") {
                    item.name = localStorage.getItem("projectName");
                  }
                });
                //选中项目更新导航在切换项目的时候要更新菜单
                localStorage.setItem("menuList", JSON.stringify(list));
                this.latelyMore = false;
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    moreHandle() {},
    //获取待审核数据
    getTableDatas() {
      var params = {
        memberId: this.userinfo.memberid,
        pageNum: 1,
        pageSize: 10
      };
      var url = "/sgpm/rest/api/integration/oa/pending/process/information";
      integrationGetMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          var _this = this;
          if (res.data.code == 200) {
            if (_this.audittableOne == null) {
              //默认登录的时候获取待审信息，如果待审信息变化将存在vux里面，如果vux状态里面有值就取状态的值
              _this.examineCount = res.data.meta.totalCount;
            } else {
              _this.examineCount = _this.audittableOne;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取已发流程
    getTableDatasYF() {
      var params = {
        memberId: this.userinfo.memberid,
        pageNum: 1,
        pageSize: 10
      };
      var url = "/sgpm/rest/api/integration/oa/existing/process/information";
      integrationGetMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          var _this = this;
          if (res.data.code == 200) {
            if (_this.audittableTwoYF == null) {
              _this.examineCountYF = res.data.meta.totalCount;
            } else {
              _this.examineCountYF = _this.audittableTwoYF;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取待发流程数据
    getTableDatasDF() {
      var params = {
        memberId: this.userinfo.memberid,
        pageNum: 1,
        pageSize: 10
      };
      var url =
        "/sgpm/rest/api/integration/oa/wait/sending/process/information";

      integrationGetMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          var _this = this;
          if (res.data.code == 200) {
            if (_this.audittableThreeDF == null) {
              _this.examineCountDF = res.data.meta.totalCount;
            } else {
              _this.examineCountDF = _this.audittableThreeDF;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route: function(to, from) {
      // 路由改变时执行
      //console.info("to.path:" + to.path);
    }
  },
  mounted() {
    var storage = window.localStorage;
    this.defaultLeftNavOpened();
    this.getMenuList();
    this.getTableDatas();
    this.getTableDatasYF();
    this.getTableDatasDF();
    this.recentProList({
      id: storage.projectId || null,
      projectName: storage.projectName || null,
      projectNumber: storage.projectNumber || null,
      parent_id: storage.parent_id || null,
      judgeproject: storage.judgeproject || null
    });
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.sub-menu {
  position: relative;
  .change-name {
    width: 100px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.nav-more {
  position: absolute;
  right: 0;
  top: 15px;
}
.wrap-more {
  position: relative;
}
.div-more {
  position: absolute;
  top: -50px;
  left: 199px;
  z-index: 9;
  height: 350px;
  border-radius: 10px;
  border: 2px solid #ebeef5;
  background-color: #fff;
  color: #606266;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  .title {
    text-align: center;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  }
  ul {
  }
}
.badge {
  width: 6px;
  height: 6px;
  background: #ff4242;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  bottom: 10px;
  left: 2px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
