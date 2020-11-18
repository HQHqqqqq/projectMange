<template>
  <!--审批列表页面重构-->
  <!--<el-col :span="23" class="main projectview">-->
  <el-col :span="24" class="out-main">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
  </el-col>
</template>

<script>
import GenerateForm from "@/components/CreateForm/GenerateForm";
export default {
  name: "AuditTable",
  components: {
    GenerateForm
  },
  data() {
    return {
      jsonData: {
        list: [
          {
            type: "tabs",
            name: "",
            icon: "icon-jilianxuanze",
            isShow: "true",
            tabs: [
              { name: "待审流程" },
              { name: "已发流程" },
              { name: "待发流程" }
            ],
            options: {
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
              remoteFunc: "func_1563958033000_83495"
            },
            key: "1563958033000_83495",
            model: "tabs_1563958033000_83495",
            rules: []
          }
        ],
        config: {
          labelWidth: 100,
          labelPosition: "top",
          size: "small"
        }
      },
      editData: {},
      remoteFuncs: {}
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>

<style lang="scss" scoped>
@import "../../assets/css/common.css";
// .out-main {
//   padding: 0 15px 0 15px;
// }
</style>
