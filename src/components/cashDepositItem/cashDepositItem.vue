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
  data() {
    return {
      jsonData: {
        "list": [
          {
            "type": "cashDeposit",
            "name": "",
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
              "remoteFunc": "func_1577347024000_7924"
            },
            "key": "1577347024000_7924",
            "model": "cashDeposit_1577347024000_7924",
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
  },
  methods: {

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

<style>
@import "../../assets/css/common.css";
/* .out-main {
  overflow: hidden;
} */
</style>
