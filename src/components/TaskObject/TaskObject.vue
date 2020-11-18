<template>
  <el-col :span="23">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
  </el-col>
</template>

<script>
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "project-test",
  components: {
    GenerateForm
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
    debugger
    this.jsonData = {
      list: [
        {
          type: "taskobjectory",
          name: "",
          icon: "icon-jilianxuanze",
          isShow: "true",
          options: {
            warningName: "",
            defaultValue: [],
            width: "",
            placeholder: "",
            disabled: false,
            clearable: false,
            remote: true,
            remoteOptions: [],
            url_a: "",
            url_b: "",
            url_c: "",
            url_d: "",
            props: {
              value: "value",
              label: "label",
              children: "children"
            },
            remoteFunc: "func_1564040058000_15634"
          },
          key: "1564040058000_15634",
          model: "taskobjectory_1564040058000_15634",
          rules: []
        }
      ],
      config: {
        labelWidth: 100,
        labelPosition: "top",
        size: "small"
      }
    };
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
</style>
