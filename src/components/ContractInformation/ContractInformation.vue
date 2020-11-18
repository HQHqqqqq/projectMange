<template>
  <!--合同信息-->
  <el-col :span="24">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
  </el-col>
</template>

<script>
import GenerateForm from "@/components/CreateForm/GenerateForm";
export default {
  name: "ContractInfomation",
  components: {
    GenerateForm
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$parent.$children[0].getMenuList();
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  data() {
    return {
      currentProgress: 0,
      jsonData: {
        list: [
          {
            type: "tabs",
            name: "",
            icon: "icon-jilianxuanze",
            isShow: "true",
            tabs: [
              {
                name: "合同信息"
              },
              {
                name: "商机"
              }
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
  methods: {
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    }
  }
};
</script>
