<template>
  <el-col :span="24" :class="isActive">
    <div v-loading="boxLoading">
      <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm" class="projectInfo"></generate-form>
      <div class="btns">
        <el-button
          type="primary"
          size="mini"
          @click="saveDate"
          v-if="this.userinfo.memberid=='7603819741782557558' && this.judgeproject == '分包项目信息'"
          v-show="isShow"
          :disabled="isSave"
        >保存</el-button>
        <el-button type="primary"  v-if="this.judgeproject == '分包项目信息'" size="mini" @click="back">返回</el-button>
      </div>
    </div>
  </el-col>
</template>

<script>
import '@/components/CreateForm/styles/FormCreate.css';
import Bus from "../../bus";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import {
  getMenuList,
  getProject,
  updateTime,
  saveDate,
} from "../../api/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "ProjectInfo",
  components: {
    GenerateForm,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
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
        list: [],
        config: {
          labelPosition: "left",
          labelWidth: 100,
          size: "small",
        },
      },
      editData: {},
      remoteFuncs: {},
      judgeproject: localStorage.getItem("judgeproject"),
      isShow: this.$route.query.isShow == 1 ? false : true, //默认显示 1不显示提交按钮
      projectId: localStorage.getItem("projectId"),
      // judgeproject: this.$route.params.judgeproject,
      boxLoading: false,
      isSave: false, //根据权限控制按钮
    };
  },
  computed: {
    ...mapState([
      "userinfo", //os跳转过来的用户信息值
    ]),
    isActive() {
      return this.judgeproject == "分包项目信息" ? "projectview" : "out-main";
    },
    isRevoke: function () {
      return sessionStorage.getItem("isRevoke");
    },
    // judgeproject() {
		// 	return localStorage.getItem('judgeproject');
		// }
  },
  watch: {
		$route: function(to, from) {
			this.$router.go(0);
			// 路由改变时执行
			//console.info("to.path:" + to.path);
		}
	},
  mounted() {
    var _this = this;
    //超图信息、超图软件
    // if (
    //   this.userinfo.account_id == "5326994013938795629" ||
    //   this.userinfo.account_id == "-1360422574114386809"
    // ) {
    //   getMenuList("/template/6/5326994013938795629").then(res => {
    //     this.jsonData = res.data.data;
    //   });
    // }
    //国图、南康
    // if (
    //   this.userinfo.account_id == "-1814768306395265967" ||
    //   this.userinfo.account_id == "8416498716893399290"
    // ) {
    //   getMenuList("/template/6/-1814768306395265967").then(res => {
    //     this.jsonData = res.data.data;
    //   });
    // }
    // V2 国图南康，一个项目也关联一个合同
    if (this.judgeproject == "分包项目信息") {
      this.getSubPackage();
    } else if (
      localStorage.getItem("judgeproject") == "非合同项目信息" ||
      localStorage.getItem("jump_type") == "11"
    ) {
      this.notProListInit();
    } else {
      this.init();
    }

    this.getLatelyList();
  },
  created() {
    if (this.judgeproject == "分包项目信息") {
      this.getSubData(this.projectId);
    }
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getSubPackage() {
      if (this.userinfo.memberid == "7603819741782557558") {
        this.jsonData = {
          list: [
            {
              columns: [
                {
                  list: [
                    {
                      name: "自定义文字",
                      icon: "icon-row",
                      options: {
                        remoteFunc: "func_1566268705000_2153",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        listened: false,
                        placeholder: "分包项目登记表",
                        required: false,
                      },
                      model: "row_1566268705000_2153",
                      rules: [],
                      type: "row",
                      key: "1566268705000_2153",
                      isShow: "false",
                    },
                    {
                      icon: "icon-divider",
                      options: {
                        remoteFunc: "func_1566370404000_62453",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        listened: false,
                        placeholder: "",
                        required: false,
                      },
                      model: "divider_1566370404000_62453",
                      rules: [],
                      type: "divider",
                      key: "1566370404000_62453",
                      isShow: "false",
                    },
                  ],
                  span: 24,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566268698000_72220",
                gutter: 0,
                justify: "start",
                listened: false,
                align: "top",
              },
              model: "grid_1566268698000_72220",
              rules: [],
              type: "grid",
              key: "1566268698000_72220",
            },
            {
              columns: [
                {
                  list: [
                    {
                      type: "input",
                      name: "采购合同编号",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098344000_20458",
                        listened: false,
                      },
                      key: "1599098344000_20458",
                      model: "purchasecontractnumber",
                      rules: [
                        {
                          type: "string",
                          message: "采购合同编号格式不正确",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "关联销售合同编号",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098405000_49854",
                        listened: false,
                      },
                      key: "1599098405000_49854",
                      model: "salescontractnumber",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联销售合同额",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098451000_87364",
                      },
                      key: "1599098451000_87364",
                      model: "salescontractamount",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联项目编号",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098485000_30755",
                      },
                      key: "1599098485000_30755",
                      model: "projectnumber",
                      rules: [],
                    },
                  ],
                  span: 12,
                },
                {
                  list: [
                    {
                      type: "input",
                      name: "采购合同名称",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098383000_91367",
                        listened: false,
                      },
                      key: "1599098383000_91367",
                      model: "purchasecontractname",
                      rules: [
                        {
                          type: "string",
                          message: "采购合同名称格式不正确",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "关联销售合同名称",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098430000_35882",
                      },
                      key: "1599098430000_35882",
                      model: "salescontractname",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "经费类型",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098469000_12650",
                      },
                      key: "1599098469000_12650",
                      model: "typeoffunding",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联项目名称",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098500000_51261",
                      },
                      key: "1599098500000_51261",
                      model: "projectname",
                      rules: [],
                    },
                  ],
                  span: 12,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566268792000_64292",
                gutter: 0,
                justify: "start",
                listened: false,
                align: "top",
              },
              model: "grid_1566268792000_64292",
              rules: [],
              type: "grid",
              key: "1566268792000_64292",
            },
            {
              columns: [
                {
                  list: [
                    {
                      name: "自定义文字",
                      icon: "icon-row",
                      options: {
                        remoteFunc: "func_1566370428000_86732",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        listened: false,
                        placeholder: "分包项目信息",
                        required: false,
                      },
                      model: "row2_1566370428000_86732",
                      rules: [],
                      type: "row2",
                      key: "1566370428000_86732",
                      isShow: "false",
                    },
                  ],
                  span: 24,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566370415000_91126",
                gutter: 0,
                justify: "start",
                listened: false,
                align: "top",
              },
              model: "grid_1566370415000_91126",
              rules: [],
              type: "grid",
              key: "1566370415000_91126",
            },
            {
              type: "grid",
              name: "栅格布局",
              icon: "icon-grid-",
              columns: [
                {
                  span: 12,
                  list: [
                    {
                      type: "input",
                      name: "分包业务类型",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: true,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: false,
                        remoteFunc: "func_1599098615000_38474",
                        listened: false,
                      },
                      key: "1599098615000_38474",
                      model: "subcontractingbusinesstype",
                      rules: [
                        {
                          type: "string",
                          message: "分包业务类型格式不正确",
                        },
                        {
                          required: true,
                          message: "分包业务类型必须填写",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "所属机构",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098669000_14780",
                      },
                      key: "1599098669000_14780",
                      model: "affiliation",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "所属部门",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098718000_7822",
                      },
                      key: "1599098718000_7822",
                      model: "department",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "乙方单位",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098746000_43613",
                      },
                      key: "1599098746000_43613",
                      model: "partybunit",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "我方项目经理",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: true,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: false,
                        remoteFunc: "func_1599098781000_49408",
                      },
                      key: "1599098781000_49408",
                      model: "ourprojectmanager",
                      rules: [
                        {
                          required: true,
                          message: "我方项目经理必须填写",
                        }
                      ],
                    },
                    {
                      type: "input",
                      name: "关联项目经费(元)",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098826000_27156",
                      },
                      key: "1599098826000_27156",
                      model: "relatedprojectfunding",
                      rules: [
                        {
                          type: "string",
                          message: "关联项目经费(元)格式不正确",
                        },
                      ],
                    },
                    {
                      type: "date",
                      name: "项目开始时间",
                      icon: "icon-date",
                      isShow: "true",
                      options: {
                        defaultValue: "",
                        readonly: false,
                        disabled: false,
                        editable: true,
                        clearable: true,
                        placeholder: "",
                        startPlaceholder: "",
                        endPlaceholder: "",
                        type: "date",
                        format: "yyyy-MM-dd",
                        timestamp: false,
                        required: true,
                        width: "50%",
                        remote: true,
                        filterable: false,
                        remoteFunc: "func_1599098913000_15610",
                        listened: false,
                      },
                      key: "1599098913000_15610",
                      model: "projectstarttime",
                      rules: [
                        {
                          required: true,
                          message: "项目开始时间必须填写",
                        },
                      ],
                    },
                    {
                      type: "date",
                      name: "项目结束时间",
                      icon: "icon-date",
                      isShow: "true",
                      options: {
                        defaultValue: "",
                        readonly: false,
                        disabled: false,
                        editable: true,
                        clearable: true,
                        placeholder: "",
                        startPlaceholder: "",
                        endPlaceholder: "",
                        type: "date",
                        format: "yyyy-MM-dd",
                        timestamp: false,
                        required: true,
                        width: "50%",
                        remote: true,
                        filterable: false,
                        remoteFunc: "func_1599098980000_4568",
                      },
                      key: "1599098980000_4568",
                      model: "projectendtime",
                      rules: [
                        {
                          required: true,
                          message: "项目结束时间必须填写",
                        },
                      ],
                    },
                  ],
                },
                {
                  span: 12,
                  list: [
                    {
                      type: "input",
                      name: "分包方式",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098633000_60503",
                      },
                      key: "1599098633000_60503",
                      model: "subcontractingtheway",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "合作地区(省市区)",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098690000_41391",
                      },
                      key: "1599098690000_41391",
                      model: "cooperationarea",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "所属中心",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098731000_99217",
                      },
                      key: "1599098731000_99217",
                      model: "affiliatedcenter",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "联系人",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: true,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: false,
                        remoteFunc: "func_1599098760000_28135",
                      },
                      key: "1599098760000_28135",
                      model: "contactperson",
                      rules: [
                        {
                          type: "string",
                          message: "联系人格式不正确",
                        },
                        {
                          required: true,
                          message: "联系人必须填写",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "电话",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: true,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: false,
                        remoteFunc: "func_1599098808000_50134",
                        listened: false,
                      },
                      key: "1599098808000_50134",
                      model: "telephone",
                      rules: [
                        {
                          type: "string",
                          message: "电话格式不正确",
                        },
                        {
                          required: true,
                          message: "电话必须填写",
                        },
                      ],
                    },
                    {
                      name: "试点情况",
                      icon: "icon-select",
                      options: {
                        remoteFunc: "func_1575524687000_30869",
                        filterable: false,
                        clearable: false,
                        defaultValue: "新选项",
                        remoteOptions: [],
                        multiple: false,
                        remote: false,
                        required: true,
                        showLabel: false,
                        props: {
                          label: "label",
                          value: "value",
                        },
                        width: "50%",
                        options: [
                          {
                            value: "通过",
                          },
                          {
                            value: "不通过",
                          },
                          {
                            value: "无",
                          },
                        ],
                        disabled: false,
                        listened: false,
                        placeholder: "",
                      },
                      model: "pilotsituation",
                      rules: [
                        {
                          required: true,
                          message: "试点情况必须填写",
                        },
                      ],
                      type: "select",
                      config: {
                        labelPosition: "",
                      },
                      url: "",
                      key: "1575524687000_30869",
                      isShow: "true",
                    },
                    {
                      type: "input",
                      name: "分包项目进度(%)",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: true,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: false,
                        remoteFunc: "func_1599098947000_56104",
                      },
                      key: "1599098947000_56104",
                      model: "subcontractingprojectprogress",
                      rules: [
                        {
                          type: "string",
                          message: "分包项目进度(%)格式不正确",
                        },
                        {
                          required: true,
                          message: "分包项目进度(%)必须填写",
                        },
                      ],
                    },
                    {
                      name: "满意度评价",
                      icon: "icon-select",
                      options: {
                        remoteFunc: "func_1575524687000_30864",
                        filterable: false,
                        clearable: false,
                        defaultValue: "新选项",
                        remoteOptions: [],
                        multiple: false,
                        remote: false,
                        required: true,
                        showLabel: false,
                        props: {
                          label: "label",
                          value: "value",
                        },
                        width: "50%",
                        options: [
                          {
                            value: "优质",
                          },
                          {
                            value: "良好",
                          },
                          {
                            value: "一般",
                          },
                          {
                            value: "较差",
                          },
                        ],
                        disabled: false,
                        listened: false,
                        placeholder: "",
                      },
                      model: "satisfactionevaluation",
                      rules: [
                        {
                          required: true,
                          message: "满意度评价必须填写",
                        },
                      ],
                      type: "select",
                      config: {
                        labelPosition: "",
                      },
                      url: "",
                      key: "1575524687000_30864",
                      isShow: "true",
                    },
                  ],
                },
              ],
              options: {
                gutter: 0,
                justify: "start",
                align: "top",
                remoteFunc: "func_1599098610000_78782",
                listened: false,
              },
              key: "1599098610000_78782",
              model: "grid_1599098610000_78782",
              rules: [],
            },
            {
              columns: [
                {
                  list: [
                    {
                      name: "自定义文字",
                      icon: "icon-row",
                      options: {
                        remoteFunc: "func_1566370451000_98859",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        placeholder: "分包合同信息",
                        required: false,
                      },
                      model: "row2_1566370451000_98859",
                      rules: [],
                      type: "row2",
                      key: "1566370451000_98859",
                      isShow: "false",
                    },
                    {
                      type: "contractInformation",
                      name: "分包合同信息",
                      icon: "icon-jilianxuanze",
                      isShow: "false",
                      url: "",
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
                          children: "children",
                        },
                        remoteFunc: "func_1599197559000_60826",
                        listened: false,
                      },
                      key: "1599197559000_60826",
                      model: "contractInformation_1599197559000_60826",
                      rules: [],
                    },
                    {
                      type: "row2",
                      name: "自定义文字",
                      icon: "icon-row",
                      isShow: "false",
                      options: {
                        width: "100%",
                        defaultValue: "",
                        required: false,
                        pattern: "",
                        placeholder: "分包合同付款信息",
                        disabled: false,
                        remoteFunc: "func_1599197555000_72586",
                        listened: false,
                      },
                      key: "1599197555000_72586",
                      model: "row2_1599197555000_72586",
                      rules: [],
                    },
                  ],
                  span: 24,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566370442000_43293",
                gutter: 0,
                justify: "start",
                align: "top",
                listened: false,
              },
              model: "grid_1566370442000_43293",
              rules: [],
              type: "grid",
              key: "1566370442000_43293",
            },
            {
              type: "grid",
              name: "栅格布局",
              icon: "icon-grid-",
              columns: [
                {
                  span: 24,
                  list: [
                    {
                      type: "paymentInformation",
                      name: "分包项目登记表",
                      icon: "icon-jilianxuanze",
                      isShow: "false",
                      url: "",
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
                          children: "children",
                        },
                        remoteFunc: "func_1599114227000_70501",
                        listened: false,
                      },
                      key: "1599114227000_70501",
                      model: "paymentInformation_1599114227000_70501",
                      rules: [],
                    },
                  ],
                },
              ],
              options: {
                gutter: 0,
                justify: "start",
                align: "top",
                remoteFunc: "func_1599114187000_21298",
                listened: false,
              },
              key: "1599114187000_21298",
              model: "grid_1599114187000_21298",
              rules: [],
            },
          ],
          config: {
            size: "small",
            labelPosition: "right",
            labelWidth: 170,
          },
        };
      } else {
        this.jsonData = {
          list: [
            {
              columns: [
                {
                  list: [
                    {
                      name: "自定义文字",
                      icon: "icon-row",
                      options: {
                        remoteFunc: "func_1566268705000_2153",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        listened: false,
                        placeholder: "分包项目登记表",
                        required: false,
                      },
                      model: "row_1566268705000_2153",
                      rules: [],
                      type: "row",
                      key: "1566268705000_2153",
                      isShow: "false",
                    },
                    {
                      icon: "icon-divider",
                      options: {
                        remoteFunc: "func_1566370404000_62453",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        listened: false,
                        placeholder: "",
                        required: false,
                      },
                      model: "divider_1566370404000_62453",
                      rules: [],
                      type: "divider",
                      key: "1566370404000_62453",
                      isShow: "false",
                    },
                  ],
                  span: 24,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566268698000_72220",
                gutter: 0,
                justify: "start",
                listened: false,
                align: "top",
              },
              model: "grid_1566268698000_72220",
              rules: [],
              type: "grid",
              key: "1566268698000_72220",
            },
            {
              columns: [
                {
                  list: [
                    {
                      type: "input",
                      name: "采购合同编号",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098344000_20458",
                        listened: false,
                      },
                      key: "1599098344000_20458",
                      model: "purchasecontractnumber",
                      rules: [
                        {
                          type: "string",
                          message: "采购合同编号格式不正确",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "关联销售合同编号",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098405000_49854",
                        listened: false,
                      },
                      key: "1599098405000_49854",
                      model: "salescontractnumber",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联销售合同额",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098451000_87364",
                      },
                      key: "1599098451000_87364",
                      model: "salescontractamount",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联项目编号",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098485000_30755",
                      },
                      key: "1599098485000_30755",
                      model: "projectnumber",
                      rules: [],
                    },
                  ],
                  span: 12,
                },
                {
                  list: [
                    {
                      type: "input",
                      name: "采购合同名称",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098383000_91367",
                        listened: false,
                      },
                      key: "1599098383000_91367",
                      model: "purchasecontractname",
                      rules: [
                        {
                          type: "string",
                          message: "采购合同名称格式不正确",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "关联销售合同名称",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098430000_35882",
                      },
                      key: "1599098430000_35882",
                      model: "salescontractname",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "经费类型",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098469000_12650",
                      },
                      key: "1599098469000_12650",
                      model: "typeoffunding",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联项目名称",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098500000_51261",
                      },
                      key: "1599098500000_51261",
                      model: "projectname",
                      rules: [],
                    },
                  ],
                  span: 12,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566268792000_64292",
                gutter: 0,
                justify: "start",
                listened: false,
                align: "top",
              },
              model: "grid_1566268792000_64292",
              rules: [],
              type: "grid",
              key: "1566268792000_64292",
            },
            {
              columns: [
                {
                  list: [
                    {
                      name: "自定义文字",
                      icon: "icon-row",
                      options: {
                        remoteFunc: "func_1566370428000_86732",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        listened: false,
                        placeholder: "分包项目信息",
                        required: false,
                      },
                      model: "row2_1566370428000_86732",
                      rules: [],
                      type: "row2",
                      key: "1566370428000_86732",
                      isShow: "false",
                    },
                  ],
                  span: 24,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566370415000_91126",
                gutter: 0,
                justify: "start",
                listened: false,
                align: "top",
              },
              model: "grid_1566370415000_91126",
              rules: [],
              type: "grid",
              key: "1566370415000_91126",
            },
            {
              type: "grid",
              name: "栅格布局",
              icon: "icon-grid-",
              columns: [
                {
                  span: 12,
                  list: [
                    {
                      type: "input",
                      name: "分包业务类型",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098615000_38474",
                      },
                      key: "1599098615000_38474",
                      model: "subcontractingbusinesstype",
                      rules: [
                        {
                          type: "string",
                          message: "分包业务类型格式不正确",
                        },
                      ],
                    },
                    {
                      type: "input",
                      name: "所属机构",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098669000_14780",
                      },
                      key: "1599098669000_14780",
                      model: "affiliation",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "所属部门",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098718000_7822",
                      },
                      key: "1599098718000_7822",
                      model: "department",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "乙方单位",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098746000_43613",
                      },
                      key: "1599098746000_43613",
                      model: "partybunit",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "我方项目经理",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098781000_49408",
                      },
                      key: "1599098781000_49408",
                      model: "ourprojectmanager",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "关联项目经费(元)",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098826000_27156",
                      },
                      key: "1599098826000_27156",
                      model: "relatedprojectfunding",
                      rules: [
                        {
                          type: "string",
                          message: "关联项目经费(元)格式不正确",
                        },
                      ],
                    },
                    {
                      type: "date",
                      name: "项目开始时间",
                      icon: "icon-date",
                      isShow: "true",
                      options: {
                        defaultValue: "",
                        readonly: false,
                        disabled: true,
                        editable: true,
                        clearable: true,
                        placeholder: "",
                        startPlaceholder: "",
                        endPlaceholder: "",
                        type: "date",
                        format: "yyyy-MM-dd",
                        timestamp: false,
                        required: false,
                        width: "50%",
                        remote: true,
                        filterable: false,
                        remoteFunc: "func_1599098913000_15610",
                        listened: false,
                      },
                      key: "1599098913000_15610",
                      model: "projectstarttime",
                      rules: [],
                    },
                    {
                      type: "date",
                      name: "项目结束时间",
                      icon: "icon-date",
                      isShow: "true",
                      options: {
                        defaultValue: "",
                        readonly: false,
                        disabled: true,
                        editable: true,
                        clearable: true,
                        placeholder: "",
                        startPlaceholder: "",
                        endPlaceholder: "",
                        type: "date",
                        format: "yyyy-MM-dd",
                        timestamp: false,
                        required: false,
                        width: "50%",
                        remote: true,
                        filterable: false,
                        remoteFunc: "func_1599098980000_4568",
                      },
                      key: "1599098980000_4568",
                      model: "projectendtime",
                      rules: [],
                    },
                  ],
                },
                {
                  span: 12,
                  list: [
                    {
                      type: "input",
                      name: "分包方式",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098633000_60503",
                      },
                      key: "1599098633000_60503",
                      model: "subcontractingtheway",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "合作地区(省市区)",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098690000_41391",
                      },
                      key: "1599098690000_41391",
                      model: "cooperationarea",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "所属中心",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098731000_99217",
                      },
                      key: "1599098731000_99217",
                      model: "affiliatedcenter",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "联系人",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098760000_28135",
                      },
                      key: "1599098760000_28135",
                      model: "contactperson",
                      rules: [],
                    },
                    {
                      type: "input",
                      name: "电话",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098808000_50134",
                      },
                      key: "1599098808000_50134",
                      model: "telephone",
                      rules: [
                        {
                          type: "string",
                          message: "电话格式不正确",
                        },
                      ],
                    },
                    {
                      name: "试点情况",
                      icon: "icon-select",
                      options: {
                        remoteFunc: "func_1575524687000_30964",
                        filterable: false,
                        clearable: false,
                        defaultValue: "新选项",
                        remoteOptions: [],
                        multiple: false,
                        remote: false,
                        required: false,
                        showLabel: false,
                        props: {
                          label: "label",
                          value: "value",
                        },
                        width: "50%",
                        options: [
                          {
                            value: "通过",
                          },
                          {
                            value: "不通过",
                          },
                          {
                            value: "无",
                          },
                        ],
                        disabled: true,
                        listened: false,
                        placeholder: "",
                      },
                      model: "pilotSituation",
                      rules: [],
                      type: "select",
                      config: {
                        labelPosition: "",
                      },
                      url: "",
                      key: "1575524687000_30964",
                      isShow: "true",
                    },
                    {
                      type: "input",
                      name: "分包项目进度(%)",
                      icon: "icon-input",
                      isShow: "true",
                      url: "",
                      options: {
                        width: "50%",
                        defaultValue: "",
                        required: false,
                        dataType: "string",
                        pattern: "",
                        placeholder: "",
                        disabled: true,
                        remoteFunc: "func_1599098947000_56104",
                      },
                      key: "1599098947000_56104",
                      model: "subcontractingprojectprogress",
                      rules: [
                        {
                          type: "string",
                          message: "分包项目进度(%)格式不正确",
                        },
                      ],
                    },
                    {
                      name: "满意度评价",
                      icon: "icon-select",
                      options: {
                        remoteFunc: "func_1575524687000_30864",
                        filterable: false,
                        clearable: false,
                        defaultValue: "新选项",
                        remoteOptions: [],
                        multiple: false,
                        remote: false,
                        required: false,
                        showLabel: false,
                        props: {
                          label: "label",
                          value: "value",
                        },
                        width: "50%",
                        options: [
                          {
                            value: "优质",
                          },
                          {
                            value: "良好",
                          },
                          {
                            value: "一般",
                          },
                          {
                            value: "较差",
                          },
                        ],
                        disabled: true,
                        listened: false,
                        placeholder: "",
                      },
                      model: "satisfactionevaluation",
                      rules: [],
                      type: "select",
                      config: {
                        labelPosition: "",
                      },
                      url: "",
                      key: "1575524687000_30864",
                      isShow: "true",
                    },
                  ],
                },
              ],
              options: {
                gutter: 0,
                justify: "start",
                align: "top",
                remoteFunc: "func_1599098610000_78782",
                listened: false,
              },
              key: "1599098610000_78782",
              model: "grid_1599098610000_78782",
              rules: [],
            },
            {
              columns: [
                {
                  list: [
                    {
                      name: "自定义文字",
                      icon: "icon-row",
                      options: {
                        remoteFunc: "func_1566370451000_98859",
                        defaultValue: "",
                        width: "100%",
                        pattern: "",
                        disabled: false,
                        placeholder: "分包合同信息",
                        required: false,
                      },
                      model: "row2_1566370451000_98859",
                      rules: [],
                      type: "row2",
                      key: "1566370451000_98859",
                      isShow: "false",
                    },
                    {
                      type: "contractInformation",
                      name: "分包合同信息",
                      icon: "icon-jilianxuanze",
                      isShow: "false",
                      url: "",
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
                          children: "children",
                        },
                        remoteFunc: "func_1599197559000_60826",
                        listened: false,
                      },
                      key: "1599197559000_60826",
                      model: "contractInformation_1599197559000_60826",
                      rules: [],
                    },
                    {
                      type: "row2",
                      name: "自定义文字",
                      icon: "icon-row",
                      isShow: "false",
                      options: {
                        width: "100%",
                        defaultValue: "",
                        required: false,
                        pattern: "",
                        placeholder: "分包合同付款信息",
                        disabled: false,
                        remoteFunc: "func_1599197555000_72586",
                        listened: false,
                      },
                      key: "1599197555000_72586",
                      model: "row2_1599197555000_72586",
                      rules: [],
                    },
                  ],
                  span: 24,
                },
              ],
              name: "栅格布局",
              icon: "icon-grid-",
              options: {
                remoteFunc: "func_1566370442000_43293",
                gutter: 0,
                justify: "start",
                align: "top",
                listened: false,
              },
              model: "grid_1566370442000_43293",
              rules: [],
              type: "grid",
              key: "1566370442000_43293",
            },
            {
              type: "grid",
              name: "栅格布局",
              icon: "icon-grid-",
              columns: [
                {
                  span: 24,
                  list: [
                    {
                      type: "paymentInformation",
                      name: "分包项目登记表",
                      icon: "icon-jilianxuanze",
                      isShow: "false",
                      url: "",
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
                          children: "children",
                        },
                        remoteFunc: "func_1599114227000_70501",
                        listened: false,
                      },
                      key: "1599114227000_70501",
                      model: "paymentInformation_1599114227000_70501",
                      rules: [],
                    },
                  ],
                },
              ],
              options: {
                gutter: 0,
                justify: "start",
                align: "top",
                remoteFunc: "func_1599114187000_21298",
                listened: false,
              },
              key: "1599114187000_21298",
              model: "grid_1599114187000_21298",
              rules: [],
            },
          ],
          config: {
            size: "small",
            labelPosition: "right",
            labelWidth: 170,
          },
        };
      }
    },
    init() {
      getMenuList("/template/6/5326994013938795629").then((res) => {
        this.jsonData = res.data.data;
      });
    },
    // 非合同项目标签json 基本信息，项目工时
    notProListInit() {
      getMenuList("/template/6/5326994013938795629").then((res) => {
        this.jsonData = {
          list: [
            {
              name: "",
              icon: "icon-jilianxuanze",
              tabs: [
                {
                  name: "基本信息",
                },
                {
                  name: "项目工时",
                },
              ],
              options: {
                remoteFunc: "func_1563958033000_83495",
                clearable: false,
                defaultValue: [],
                remoteOptions: [],
                remote: true,
                props: {
                  children: "children",
                  label: "label",
                  value: "value",
                },
                url_d: "",
                url_b: "",
                url_c: "",
                url_a: "",
                width: "",
                disabled: false,
                placeholder: "",
              },
              model: "tabs_1563958033000_83495",
              rules: [],
              type: "tabs",
              key: "1563958033000_83495",
              isShow: "true",
            },
          ],
          config: {
            size: "small",
            labelPosition: "top",
            labelWidth: 170,
          },
        };
      });
    },
    //获取最新列表
    getLatelyList() {
      let params = {
        projectId: this.$route.params.id,
        userId: this.userinfo.memberid,
      };
      updateTime("/sgpm/rest/api/server/pm/project/lately", params)
        .then((res) => {
          //请求成功后再调用
          if (res.data.code == 200) {
            getProject("/sgpm/rest/api/server/pm/project/lately", {
              memberId: this.userinfo.memberid,
            })
              .then((res) => {})
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分包项目信息
    getSubData(id) {
      //加载提升效果
      this.boxLoading = true;
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      getProject(`/sgpm/rest/api/server/gt/subcontract/project/${id}`)
        .then((res) => {
          this.boxLoading = false;
          var projectData = res.data.data;
          Bus.$emit("projectData", projectData);
          if (projectData) {
            localStorage.removeItem("projectData");
            localStorage.setItem("projectData", JSON.stringify(projectData));
            localStorage.setItem("keyWords", res.data.data.KEYWORD);
            localStorage.setItem("keytechnologys", res.data.data.KEYTECHNOLOGY);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 更新数据
    saveDate() {
      this.$refs.generateForm
        .getData()
        .then((data) => {
          console.log(data);
          var data = {
            id: data.id,
            subcontractingBusinessType: data.subcontractingbusinesstype,
            contactPerson: data.contactperson,
            ourProjectManager: data.ourprojectmanager,
            telephone: data.telephone,
            pilotSituation: data.pilotsituation,
            projectStartTime: data.projectstarttime,
            projectEndTime: data.projectendtime,
            subcontractingProjectProgress: data.subcontractingprojectprogress,
            satisfactionEvaluation: data.satisfactionevaluation,
          };
          var url = "/sgpm/rest/api/server/gt/subcontract/project";
          saveDate(url, data)
            .then((res) => {
              console.log(res);
              if (res.data.code == 200) {
                alert("保存成功!");
              }
            })
            .catch((err) => {
              console.log(err);
              alert("保存失败!");
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.css";
.main {
  width: 100%;
  .el-tabs__header {
    position: relative;
    padding-left: 0px;
    background: #f9f9f9;
  }
}
.btns {
	display: flex;
	justify-content: center;
	margin-top: 0px;
}

</style>
