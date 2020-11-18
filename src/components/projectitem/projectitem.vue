<template>
  <el-col :span="24" class="out-main">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
    <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
  </el-col>
</template>

<script>
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import cookie from "vue-cookie";
export default {
  name: "project-test",
  components: {
    GenerateForm
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm.$parent.$parent.$parent.getMenu();
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next(vm => {
      // vm.$parent.$parent.$parent.getMenu();
    });
  },
  data() {
    return {
      jsonData: {
        list: [],
        config: {
          labelPosition: "left",
          labelWidth: 100,
          size: "small"
        }
      },
      editData: {},
      remoteFuncs: {}
    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  mounted() {
    this.init();
    // if (cookie.get("memberid") == undefined) {
    //   this.$router.push({
    //     name: "login"
    //   });
    // } else {

    // }
  },
  methods: {
    init() {
      if (!this.userinfo) {
        return;
      }
      var params = {
        memberId: this.userinfo.memberid,
        menuId: 7
      };
      getMenuList("/template", params)
        .then(res => {
          this.jsonData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSubmit() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          // 数据校验成功
          // data 为获取的表单数据
          console.log(data);
        })
        .catch(e => {
          // 数据校验失败
          console.log(e);
        });
    }
  }
};
</script>

<style >
@import "../../assets/css/common.css";
/* @import "../../assets/css/app.css"; */
/* .out-main {
  overflow: hidden;
} */
</style>
