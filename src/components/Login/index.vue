<template>
  <div class="wrap">
    <div class="content">
      <img src="../../assets/statistics.png" alt="" />
      <div class="login">
        <div class="con">
          <p class="con-title">欢迎登陆项目管理系统</p>
          <el-input placeholder="请输入用户名" class="con-input" prefix-icon="el-icon-s-custom" v-model="loginForm.username">
          </el-input>
          <el-input placeholder="请输入密码" class="con-input" type="password" @keyup.enter.native="onSubmit"
            prefix-icon="el-icon-s-goods" v-model="loginForm.password">
          </el-input>
          <el-button type="primary" class="btn" @click="onSubmit">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "../../config";
import { getNav, login } from "@/api/api.js";
import cookie from "vue-cookie";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    sessionStorage.setItem("loginIdentifier", 1);
    localStorage.clear();
    cookie.delete("account_id");
    cookie.delete("account_name");
    cookie.delete("code");
    cookie.delete("dept_id");
    cookie.delete("dept_name");
    cookie.delete("e_mail");
    cookie.delete("emp_name");
    cookie.delete("login_name");
    cookie.delete("memberid");
    cookie.delete("post_id");
    cookie.delete("post_name");
    cookie.delete("subdept_id");
    cookie.delete("subdept_name");
    cookie.delete("telnumber");
    cookie.delete("token");
    next(vm => {
      // vm.$parent.$parent.$parent.getUserInfo();
      // vm.$parent.$parent.$parent.getMenu();
      // vm.setCacheParams({});
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  watch: {},
  mounted() {},
  created() {},
  computed: {},
  methods: {
    ...mapActions([
      "setCacheParams",
      "setAudittableOneNum",
      "setAudittableTwoYFNum",
      "setAudittableThreeNum"
    ]),
    onSubmit() {
      login("/login", this.loginForm)
        .then(res => {
          let result = res.data.data;
          localStorage.userinfo = JSON.stringify(result);
          cookie.set("account_id", result.account_id);
          cookie.set("account_name", result.account_name);
          cookie.set("code", result.code);
          cookie.set("dept_id", result.dept_id);
          cookie.set("dept_name", result.dept_name);
          cookie.set("e_mail", result.e_mail);
          cookie.set("emp_name", result.emp_name);
          cookie.set("login_name", result.login_name);
          cookie.set("memberid", result.memberid);
          cookie.set("post_id", result.post_id);
          cookie.set("post_name", result.post_name);
          cookie.set("subdept_id", result.subdept_id);
          cookie.set("subdept_name", result.subdept_name);
          cookie.set("telnumber", result.telnumber);
          cookie.set("token", result.token);
          this.getMenu(result);
          this.setCacheParams({
            code: "All",
            pageNum: 1,
            pageSize: 20
          });
          sessionStorage.setItem("loginIdentifier", 0);
          this.setAudittableOneNum(null); //清空审批列表待审的记录数
          this.setAudittableTwoYFNum(null); //清空获取已发流程记录数
          this.setAudittableThreeNum(null); //清空审批列表待发流程记录数
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取菜单menuList数据
    getMenu(userinfo) {
      getNav(
        `/sgpm/rest/api/system/portal/menus/${userinfo.memberid}?deptId=${userinfo.dept_id}&subDeptId=${userinfo.subdept_id}&accountId=${userinfo.account_id}`
      )
        .then(res => {
          var result = res.data.data;
          this.menuList = result.element;
          localStorage.setItem("menuList", JSON.stringify(result.element));
          this.$router.push({
            name: "projectitem"
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.css";
.wrap {
  overflow: hidden;
  display: flex;
  background-image: linear-gradient(
    117deg,
    #6b46e3 0%,
    #5264ee 50%,
    #55a0eb 100%
  );
  .content {
    width: 100%;
    height: 100vh;
    background-size: cover;
    position: relative;
    img {
      width: 55%;
      margin-top: -3%;
    }
    .login {
      position: absolute;
      top: 150px;
      right: 170px;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 20px;
      border-radius: 20px;
      width: 340px;
      height: 340px;
      .con-title {
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        height: 30px;
      }
      .con {
        width: 80%;
        margin: 0 auto;
        .con-input {
          margin: 10px 0;
        }
        .btn {
          width: 100%;
          margin: 10px 0;
        }
      }
    }
  }
}
</style>
