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
  name: "associatedOutputItem",
  components: {
    GenerateForm
  },
  data() {
    return {
      jsonData: {
        "list": [
          {
            "type": "associatedOutput",
            "name": "",
            "icon": "icon-jilianxuanze",
            "isShow": "true",
            "url": "",
            "options": {
              "defaultValue": [],
              "width": "",
              "placeholder": "",
              "disabled": false,
              "clearable": false,
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
              "remoteFunc": "func_1575706020000_63636"
            },
            "key": "1575706020000_63636",
            "model": "associatedOutput_1575706020000_63636",
            "rules": []
          }
        ],
        "config": {
          "labelWidth": 100,
          "labelPosition": "top",
          "size": "small"
        }
      },
      remoteFuncs: {},
      editData: {}
    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  mounted() { },
  methods: {
    init() { }
  }
};
</script>

<style >
@import "../../assets/css/common.css";
/* .out-main {
  overflow: hidden;
} */
</style>
