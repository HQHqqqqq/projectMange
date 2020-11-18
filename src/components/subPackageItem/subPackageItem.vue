<template>
  <el-col :span="24" class="out-main">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
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
  data() {
    return {
      jsonData: {
  "list": [
    {
      "type": "subPackageList",
      // "name": "分包项目列表",
      "icon": "icon-jilianxuanze",
      "isShow": "true",
      "options": {
        "defaultValue": [],
        "width": "",
        "placeholder": "",
        "remote": true,
        "remoteOptions": [],
        "url_a": "",
        "url_b": "",
        "url_c": "",
        "url_d": "",
        "props": {
          "value": "value",
          "label": "label",
          "children": "children"
        },
        "remoteFunc": "func_1599199631000_87738"
      },
      "key": "1599199631000_87738",
      "model": "subPackageList_1599199631000_87738",
      "rules": []
    }
  ],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "small"
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
    // this.init();
    // if (cookie.get("memberid") == undefined) {
    //   this.$router.push({
    //     name: "login"
    //   });
    // } else {

    // }
  },
  methods: {
    // init() {
    //   if (!this.userinfo) {
    //     return;
    //   }
    //   var params = {
    //     memberId: this.userinfo.memberid,
    //     menuId: 7
    //   };
    //   getMenuList("/template", params)
    //     .then(res => {
    //       this.jsonData = res.data.data;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
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
