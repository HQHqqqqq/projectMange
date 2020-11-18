<template>
  <el-col :span="23" class="generate-content">
    <p class="back">
      <i class="el-icon-back back-size" @click="back"></i>
    </p>
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
    <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
  </el-col>
</template>

<script>
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "ProjectHome",
  components: {
    GenerateForm
  },
  beforeRouteEnter(to, from, next) {
    // console.log(this);
    next(vm => {
      console.log(vm.$parent.$parent.$parent.getMenu());
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
    this.jsonData = {
      list: [
        {
          type: "row3",
          icon: "icon-row",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "项目基本信息",
            disabled: false,
            remoteFunc: "func_1562832199000_74262"
          },
          key: "1562832199000_74262",
          model: "row3_1562832199000_74262",
          rules: []
        },
        {
          type: "divider",
          icon: "icon-divider",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "",
            disabled: false,
            remoteFunc: "func_1562832240000_45820"
          },
          key: "1562832240000_45820",
          model: "divider_1562832240000_45820",
          rules: []
        },
        {
          type: "homeBaseMsg",
          name: "",
          icon: "icon-jilianxuanze",
          isShow: "true",
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
            remoteFunc: "func_1562832245000_42200"
          },
          key: "1562832245000_42200",
          model: "homeBaseMsg_1562832245000_42200",
          rules: []
        },
        {
          type: "row3",
          icon: "icon-row",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "项目预警信息",
            disabled: false,
            remoteFunc: "func_1562832286000_69311"
          },
          key: "1562832286000_69311",
          model: "row3_1562832286000_69311",
          rules: []
        },
        {
          type: "divider",
          icon: "icon-divider",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "",
            disabled: false,
            remoteFunc: "func_1562832291000_54508"
          },
          key: "1562832291000_54508",
          model: "divider_1562832291000_54508",
          rules: []
        },
        {
          type: "grid",
          name: "栅格布局",
          icon: "icon-grid-",
          columns: [
            {
              span: 6,
              list: [
                {
                  type: "warningCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    warningName: "进度预警",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/early/warning/progress",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562834203000_60230"
                  },
                  key: "1562834203000_60230",
                  model: "progress",
                  rules: [
                    {
                      type: "string",
                      message: "单行文本格式不正确"
                    }
                  ]
                }
              ]
            },
            {
              span: 6,
              list: [
                {
                  type: "warningCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    warningName: "回款预警",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/early/warning/repayment",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562834552000_11909"
                  },
                  key: "1562834552000_11909",
                  model: "returnMoney",
                  rules: []
                }
              ]
            },
            {
              span: 6,
              list: [
                {
                  type: "warningCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    warningName: "超支预警",
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
                    remoteFunc: "func_1562834589000_43508"
                  },
                  key: "1562834589000_43508",
                  model: "warningCard_1562834589000_43508",
                  rules: []
                }
              ]
            },
            {
              span: 6,
              list: [
                {
                  type: "warningCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    warningName: "应支未支提示",
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
                    remoteFunc: "func_1562834604000_44426"
                  },
                  key: "1562834604000_44426",
                  model: "warningCard_1562834604000_44426",
                  rules: []
                }
              ]
            }
          ],
          options: {
            gutter: 20,
            justify: "start",
            align: "top",
            remoteFunc: "func_1562834106000_13477"
          },
          key: "1562834106000_13477",
          model: "grid_1562834106000_13477",
          rules: []
        },
        {
          type: "row",
          icon: "icon-row",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "",
            disabled: false,
            remoteFunc: "func_1562834650000_74753"
          },
          key: "1562834650000_74753",
          model: "row_1562834650000_74753",
          rules: []
        },
        {
          type: "row3",
          icon: "icon-row",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "项目财务数据",
            disabled: false,
            remoteFunc: "func_1562835114000_86477"
          },
          key: "1562835114000_86477",
          model: "row3_1562835114000_86477",
          rules: []
        },
        {
          type: "divider",
          icon: "icon-divider",
          isShow: "false",
          options: {
            width: "100%",
            defaultValue: "",
            required: false,
            pattern: "",
            placeholder: "",
            disabled: false,
            remoteFunc: "func_1562835155000_22562"
          },
          key: "1562835155000_22562",
          model: "divider_1562835155000_22562",
          rules: []
        },
        {
          type: "grid",
          name: "栅格布局",
          icon: "icon-grid-",
          columns: [
            {
              span: 4,
              list: [
                {
                  type: "financialCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    financialIconClass: "el-icon-setting",
                    financialLeftColor: "#3C93EF",
                    financialText: "合同额",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11103/sgpm/rest/api/integration/oa/contract",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562835175000_40362"
                  },
                  key: "1562835175000_40362",
                  model: "contractAmount",
                  rules: []
                }
              ]
            },
            {
              span: 5,
              list: [
                {
                  type: "financialCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    financialIconClass: "el-icon-goods",
                    financialLeftColor: "#E15C1A",
                    financialText: "回款金额",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/return/money",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562835225000_57213"
                  },
                  key: "1562835225000_57213",
                  model: "amountCashed",
                  rules: []
                }
              ]
            },
            {
              span: 5,
              list: [
                {
                  type: "financialCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    financialIconClass: "el-icon-setting",
                    financialLeftColor: "#00B403",
                    financialText: "项目总预算",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/total/project/budget",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562835252000_16616"
                  },
                  key: "1562835252000_16616",
                  model: "allBudget",
                  rules: []
                }
              ]
            },
            {
              span: 5,
              list: [
                {
                  type: "financialCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    financialIconClass: "el-icon-menu",
                    financialLeftColor: "#E54EED",
                    financialText: "项目总支出",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/total/cost/money",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562835342000_31733"
                  },
                  key: "1562835342000_31733",
                  model: "allExpense",
                  rules: []
                }
              ]
            },
            {
              span: 4,
              list: [
                {
                  type: "financialCard",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  options: {
                    financialIconClass: "el-icon-goods",
                    financialLeftColor: "#3C93EF",
                    financialText: "实际净利润",
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    url_a: "http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/real/net/profit",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1562835349000_42052"
                  },
                  key: "1562835349000_42052",
                  model: "profits",
                  rules: []
                }
              ]
            }
          ],
          options: {
            gutter: 20,
            justify: "center",
            align: "top",
            remoteFunc: "func_1562835158000_85004"
          },
          key: "1562835158000_85004",
          model: "grid_1562835158000_85004",
          rules: []
        }
      ],
      config: {
        labelWidth: 0,
        labelPosition: "left",
        size: "small"
      }
    };
    // var params = {
    //   memberId: this.userinfo.memberid,
    //   menuId: 7
    // };
    // getMenuList("/template", params)
    //   .then(res => {
    //     this.jsonData = res.data.data;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
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
    },
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/common.css";
.generate-content {
  padding: 20px 0 0 20px;
  .back {
    text-align: left;
    margin-bottom: 0;
    cursor: pointer;
    .back-size {
      font-size: 17px;
    }
  }
}
</style>
