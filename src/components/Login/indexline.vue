<template>
  <div class="wrap">

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

  watch: {},
  mounted() {
    this.getUserInfo();
    let user = JSON.parse(window.localStorage.getItem("userinfo"));
    if (user != null) {
      this.getMenu(user);
    } else {
      this.$router.push({
        name: "login"
      });
    }
  },
  created() {},
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  methods: {
     ...mapActions(["getUserInfo"]),
    //获取菜单menuList数据
    getMenu(obj) {
      getNav(
        `/sgpm/rest/api/system/portal/menus/${obj.memberid}?deptId=${obj.dept_id}&subDeptId=${obj.subdept_id}&accountId=${obj.account_id}`
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
