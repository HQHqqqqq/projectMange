<template>
  <el-col :span="24" class="projectview">
    <generate-form
      :data="jsonData"
      :remote="remoteFuncs"
      :value="editData"
      ref="generateForm"
      :globalParams="globalParams"
    ></generate-form>
    <!--<el-button type="primary" @click="saveDate">保存</el-button>-->
    <div class="btns">
      <el-button type="primary" size="mini" @click="saveDate" v-show="isShow" :disabled="isSave">保存</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleSubmit"
        v-show="isShow"
        :disabled="disabled"
      >提交</el-button>
      <el-button type="primary" size="mini" @click="back">返回</el-button>
    </div>
  </el-col>
</template>
<script>
var select_array = [];
var all_array = [];
var index_array = [];
var projectLevel = [];
import axios from "axios";
import Bus from "../../bus";
import { serverPostHttpMethod } from "../../api/api.js"; //
import { integrationGetMethod } from "../../api/api.js"; //
import GenerateForm from "@/components/CreateForm/GenerateForm";
import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
import "@/components/CreateForm/styles/FormCreate.css";
import { getData } from "../../api/api.js";
import { getMenuList } from "../../api/api.js";
import { submitOa } from "../../api/api.js";
import { getPersonInfor } from "../../api/api.js";
import { getPage } from "../../api/api.js";
import { getTemplate } from "../../api/api.js";
import { updateTime } from "../../api/api.js";
import { saveDate } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import { getContract } from "../../api/api.js";
import { getProjectStart } from "../../api/api.js";

export default {
  name: "projectstart",
  components: {
    GenerateForm,
    GenetateFormItem,
  },
  //离开当前页面提示
  beforeRouteLeave(to, from, next) {
    if (this.disabled == true) {
      next();
    } else {
      const answer = window.confirm(
        "系统可能不会保存您所做的更改，确定要离开吗?"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    }
  },
  data() {
    return {
      isShow: this.$route.query.isShow == 1 ? false : true, //默认显示 1不显示提交按钮
      //项目预算数据
      accountTableData: [
        { expendItem: "实施费用预算", budgetMoney: "" },
        { expendItem: "--人工费用预算", budgetMoney: "" },
        { expendItem: "--运营费用预算", budgetMoney: "" },
        { expendItem: "销售费用预算", budgetMoney: "" },
        { expendItem: "项目采购成本预算", budgetMoney: "" },
        { expendItem: "项目总预算", budgetMoney: "" },
      ],
      jsonData: {
        list: "",
        config: {
          labelPosition: "left",
          labelWidth: 100,
          size: "small",
        },
      },
      addData: "",
      addTableData: "",
      projectId: this.$route.query.id,
      editData: {},
      remoteFuncs: {},
      disabled: false,
      isSave: false,
      globalParams: {},
    };
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      // "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮 bug
    ]),
  },
  //解决重复请求bug，跟created同级
  beforeDestroy() {
    Bus.$off("contractNumber");
  },
  created() {
    this.globalParams.memberId = this.userinfo.memberid;
    this.globalParams.subdept_id = this.userinfo.subdept_id;
    this.globalParams.companyId = this.userinfo.account_id;
    this.globalParams.projectId = localStorage.getItem("proId");
    this.initModule();
    this.initProjectStartData();

    //获取合同编号，选择合同时
    Bus.$on("contractNumber", (item) => {
      if (item) {
        // alert(item)
        console.log("===合同编号===" + item);
        this.getAccountData(item);
      }
    });
    this.$nextTick(() => {
      Bus.$on("audit", ({ obj, projectId }) => {
        this.globalParams.businessProjectId = projectId;
        this.$set(this.globalParams, "data", obj);
        this.$set(this.globalParams, "data1", obj);
        // this.globalParams.data = obj
      });
    });
  },
  destroyed() {
    window.onbeforeunload = null;
  },
  mounted() {
    //刷新浏览器提示未保存
    window.onbeforeunload = function (e) {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = "关闭提示";
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return "关闭提示";
    };
    localStorage.removeItem("addData");
    localStorage.removeItem("projectMember");
    Bus.$on("contractMes", (item) => {
      if (item) {
        this.contractMes = item;
      }
    });
    Bus.$on("addData", (item) => {
      if (item) {
        this.addData = item;
      }
    });
    Bus.$on("addTableData", (item) => {
      if (item) {
        this.addTableData = item;
      }
    });
    Bus.$on("keyword", (item) => {
      if (item) {
        this.keywordList = item;
      }
    });
    Bus.$on("keytechnology", (item) => {
      if (item) {
        this.keytechnologyList = item;
      }
    });
    var that = this;
    var id = 3; //商机1，合同2，启动3
    var account_id = this.userinfo.account_id;
    var url = "/template/" + id + "/" + account_id;
    getTemplate(url)
      .then((res) => {
        this.jsonData = res.data.data;
        if (this.userinfo.account_id == "8416498716893399290") {
          this.jsonData.config.labelWidth = 130;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    },
    initModule() {
      // let url = "/sgpm/rest/api/integration/oa/contract/wanyuan/";
      this.$nextTick(() => {
        Bus.$on("contactcontract", ({ model, val }) => {
          if (/.*[\u4e00-\u9fa5]+.*$/.test(val)) {
            var index = val.lastIndexOf("-");
            val = val.substring(0, index);
            return val;
          }
          let url = `/sgpm/rest/api/integration/data/contract/${this.userinfo.account_id}?contractNumber=${val}`; //2020 1,9新
          getContract(url).then((res) => {
            // res.data.data.CONTRACTMONEY = parseFloat(res.data.data.CONTRACTMONEY);
            this.$set(this.globalParams, "data", res.data.data);
            console.log(res.data.data);
            this.projectInfo = res.data.data;
            console.log("===合同编号===" + res.data.data.CONTRACTNUMBER);
            this.getAccountData(res.data.data.CONTRACTNUMBER);
          });
        });
      });
    },
    initProjectStartData() {
      // this.$nextTick(() => {
      // let _this = this;
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      localStorage.removeItem("projectCode");
      localStorage.removeItem("globalParams");
      var projectId = localStorage.getItem("proId");
      var params = {
        projectId: projectId || "",
      };
      let url = "/pm/project";
      getProjectStart(url, params).then((res) => {
        console.log(this.updateJsonData(res.data.data));
        console.log(res.data.data);
        // localStorage.setItem('startDate',JSON.stringify(res.data.data));
        if (res.data.data.KEYWORD == null) {
          res.data.data.KEYWORD = "";
        }
        if (res.data.data.KEYTECHNOLOGY == null) {
          res.data.data.KEYTECHNOLOGY = "";
        }
        if (this.userinfo.account_id == "8416498716893399290") {
          localStorage.setItem("projectCode", res.data.data.KEYWORD);
        } else {
          localStorage.setItem("keyWords", res.data.data.KEYWORD);
        }
        localStorage.setItem("keytechnologys", res.data.data.KEYTECHNOLOGY);
        res.data.data.BUSINESS = "";

        this.$set(
          this.globalParams,
          "data",
          this.updateJsonData(res.data.data)
        );
        this.$set(
          this.globalParams,
          "data1",
          this.updateJsonData(res.data.data)
        );
        localStorage.setItem(
          "globalParams",
          JSON.stringify(this.updateJsonData(res.data.data))
        );
        // this.$set(this.globalParams, "CONTRACTMARKET", res.data.data.CONTRACTMARKET);
        // this.$set(this.globalParams, "PROJECTNAME", res.data.data.PROJECTNAME);
        // this.$set(this.globalParams, "PROJECTNUMBER", res.data.data.PROJECTNUMBER);
        // this.$set(this.globalParams, "CONSTRUCTIONCONTENT", res.data.data.CONSTRUCTIONCONTENT);
        // this.$set(this.globalParams, "BUSINESSSYSTEM", res.data.data.BUSINESSSYSTEM);
      });
      // })
    },
    //合同额保留两位小数
    keepTwoDecimalFull(num) {
      var result = parseFloat(num);
      if (isNaN(result)) {
        alert("传递参数错误，请检查！");
        return false;
      }
      result = Math.round(num * 100) / 100;
      var s_x = result.toString();
      var pos_decimal = s_x.indexOf(".");
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += ".";
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += "0";
      }
      return s_x;
    },
    formatThousands(value) {
      value = value / 10000;
      value = value.toFixed(2); //万元单位 保留二位小数点
      var r = /^[0-9]*[1-9][0-9]*$/; //正整数
      if (r.test(value) == false) {
        return (
          value &&
          value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          })
        );
      } else {
        var reg = /\d{1,3}(?=(\d{3})+$)/g;
        return (value + "").replace(reg, "$&,");
      }
    },
    //通过projectId获取的数据拆分
    updateJsonData(obj) {
      let result = {};
      for (let item in obj) {
        if (item == "CONTRACT") {
          for (let jtem in obj[item]) {
            result[jtem] = obj[item][jtem];
          }
        } else {
          result[item] = obj[item];
        }
      }
      return result;
    },
    //提示信息
    warnMessage() {
      this.$message({
        showClose: true,
        message: "项目关键字不能为空",
        type: "warning",
      });
    },
    warnMessage3() {
      this.$message({
        showClose: true,
        message: "工程代码不能为空",
        type: "warning",
      });
    },
    warnMessage2() {
      this.$message({
        showClose: true,
        message: "拟使用的关键技术不能为空",
        type: "warning",
      });
    },
    handleSubmit() {
      this.$refs.generateForm.getData().then((data) => {
        // 数据校验成功
        // data 为获取的表单数据
        this.disabled = true;
        this.isSave = true;
        // this.saveCustom(JSON.parse(localStorage.getItem('addData')));
        if (data.contractnumber == "" && data.contractnumber == null) {
          alert("该项目没有关联合同不能提交!");
          this.disabled = false;
          this.isSave = false;
          return;
        }
        //获取项目核算 字符串数据
        var accountKeys = ["expendItem", "budgetMoney"];
        // this.getOAStr(accountTableData,keys);
        //获取初始化的项目预算数据
        // this.accountTableData = JSON.parse(
        //    localStorage.getItem("ProjectAccountParams")
        //  );
        if (localStorage.getItem("ProjectAccountParams")) {
          this.accountTableData = JSON.parse(
            localStorage.getItem("ProjectAccountParams")
          );
        }

        //保存项目成员
        var projectMember = JSON.parse(localStorage.getItem("projectMember"));
        if (projectMember) {
          // var keysMember = ["user_name", "enter_time", "leave_time", "level_one", "level_two", "role", "status", "unit_name"];
          var keysMember = [
            "user_name",
            "role",
            "status",
            "enter_time",
            "leave_time",
            "unit_name",
            "level_one",
            "level_two",
          ];
        }

        //保存客户联系人
        var customercontact = JSON.parse(localStorage.getItem("addData"));
        if (customercontact) {
          // var keyscustomer = ["BusRole", "CustomName", "Email", "FAddress", "LMName", "MobilePhont", "PostInfo", "ZipCode"];
          var keyscustomer = [
            "LMName",
            "CustomName",
            "BusRole",
            "Email",
            "ZipCode",
            "MobilePhont",
            "PostInfo",
            "FAddress",
          ];
        }

        //项目风险
        var ProjectriskParams = localStorage.getItem("ProjectriskParams");
        // var tableData = JSON.parse(ProjectriskParams);
        var tableData = [];
        if (JSON.parse(ProjectriskParams)) {
          tableData = JSON.parse(ProjectriskParams);
        }

        //V2 新需求 风险非必填
        if (tableData && tableData.length > 0) {
          //要封装的字段key值
          var keysrisk = [
            "riskType",
            "riskDescription",
            "possibilityGrade",
            "severityProbability",
            "urgency",
            "solutions",
          ];
          this.handleSaveProjectRisk(tableData);
        }

        //里程碑数据
        var json = localStorage.getItem("MilestoneParams");
        var MilestoneParams = JSON.parse(json);
        if (MilestoneParams) {
          var Milestone = [
            "stageName",
            "milestoneName",
            "progressPercentage",
            "isCut",
            "expectedBeginTime",
            "expectedEndTime",
            "workHours",
            "description",
          ];
        }
        //判断数据是否 全部填写
        var flag = this.checkMilestoneParams(MilestoneParams);
        if (!flag) {
          alert("里程碑模板请填写全部数据！");
          this.disabled = false;
          this.isSave = false;
          return false;
        }

        var prostartdate = new Date(data.projectstartdate.replace(/\-/g, "/"));
        var proenddate = new Date(data.projectenddate.replace(/\-/g, "/"));
        if (prostartdate >= proenddate) {
          alert("项目预计开始时间不能大于项目预计结束时间！");
          this.disabled = false;
          this.isSave = false;
          return false;
        }
        var keyword = "";
        var keywordList = localStorage.getItem("keyWords");
        if (this.userinfo.account_id == "8416498716893399290") {
          if (localStorage.getItem("projectCode")) {
            keyword = localStorage.getItem("projectCode");
          }
          if (keyword == "") {
            this.warnMessage3();
            this.disabled = false;
            this.isSave = false;
            return;
          }
        } else {
          if (localStorage.getItem("keyWords")) {
            keyword = keywordList;
          }
          // if (this.keywordList) {
          //   keyword = this.keywordList.join(",");
          // } else {
          //   keyword = data.keyword;
          //   // keyword = localStorage.getItem("keyWords").join(",")
          // }
          if (keyword == "") {
            this.warnMessage();
            this.disabled = false;
            this.isSave = false;
            return;
          }
        }

        var keytechnology = "";
        if (localStorage.getItem("keytechnologys")) {
          keytechnology = localStorage.getItem("keytechnologys");
        }
        // if (this.keytechnologyList) {
        //   keytechnology = this.keytechnologyList.join(",");
        // } else {
        //   keytechnology = data.keytechnology;
        //   // keytechnology = localStorage.getItem("keyWords").join(",")
        // }
        if (keytechnology == "") {
          this.warnMessage2();
          this.disabled = false;
          this.isSave = false;
          return;
        }

        var id = "";
        if (this.$route.query.id) {
          id = this.$route.query.id;
        } else {
          id = localStorage.getItem("proId");
        }
        if (
          this.userinfo.account_id == "5326994013938795629" ||
          this.userinfo.account_id == "-1360422574114386809" ||
          this.userinfo.account_id == "-7975978055853456035" ||
          this.userinfo.account_id == "-8234401961992436364"
        ) {
          var data = {
            id: id,
            project: {
              name: data.projectname,
              custom_field_values: {
                12: data.projectnumber,
                13: data.contractnumber,
                16: data.customercenter,
                17: data.contractmarket,
                18: data.contractmoney,
                19: data.contractsigningdate,
                22: data.projectlevel,
                23: data.operationalperiod,
                24: data.industry,
                25: data.region,
                // 26: data.contractprostartdate,
                // 27: data.contractproenddate,
                28: data.projectstartdate,
                29: data.projectenddate,
                30: data.projecttype,
                32: keyword,
                35: data.constructioncontent,
                36: keytechnology,
                39: data.businessnumber,
                41: data.businesssystem,
                42: 1,
                43: data.customerdepartment,
                33: data.repositoryaddress,
              },
              parent_id: "",
              description: "",
              is_public: "1",
              user_id: this.userinfo.memberid,
              user_name: this.userinfo.emp_name,
              company_name: this.userinfo.account_name,
              company_id: this.userinfo.account_id,
              level_one_name: this.userinfo.subdept_name,
              level_one_id: this.userinfo.subdept_id,
              level_two_name: this.userinfo.dept_name,
              level_two_id: this.userinfo.dept_id,
              sale_name: data.contractmarket,
              sale_id: data.saleid,
              project_no: data.projectnumber,
              audit_status: 21,
            },
            category: this.$route.query.category,
            account_name: this.userinfo.account_name,
            username: this.userinfo.login_name,
            start: 1,
            project_member: projectMember,
            customer_contact: customercontact,
            risk: tableData,
            milestone: this.getOAMilestone(MilestoneParams),
            implement_budget: this.formatThousands(
              this.accountTableData[0].budgetMoney
            ), //实施费用预算
            labour_budget: this.formatThousands(
              this.accountTableData[1].budgetMoney
            ), //人工费用预算
            run_budget: this.formatThousands(
              this.accountTableData[2].budgetMoney
            ), //运营费用预算
            sale_budget: this.formatThousands(
              this.accountTableData[3].budgetMoney
            ), //销售费用预算
            purchase_budget: this.formatThousands(
              this.accountTableData[4].budgetMoney
            ), //采购成本预算
            project_budget: this.formatThousands(
              this.accountTableData[5].budgetMoney
            ), //项目总预算
          };
          submitOa("/sgpm/rest/api/integration/oa/flow", data)
            .then((res) => {
              this.disabled = true;
              this.isSave = true;
              console.log(res);
              if (res.data.code == 200) {
                this.disabled = true;
                alert("提交成功!");
                // 保存客户干系人
                this.saveCustom(JSON.parse(localStorage.getItem("addData")));

                //保存里程碑信息
                var json2 = localStorage.getItem("MilestoneParams");
                var MilestoneParams = JSON.parse(json2);
                console.log("项目里程碑数据");
                console.log(MilestoneParams);
                console.log(data.project.project_no);
                if (MilestoneParams) {
                  this.handleSaveProjectMilestone(
                    data.project.project_no,
                    MilestoneParams
                  );
                }
                this.$router.push({
                  path: "audititem",
                });
              } else {
                this.disabled = false;
                this.isSave = false;
                alert("提交失败!");
              }
            })
            .catch((e) => {
              // 数据校验失败
              console.log(e);
              this.disabled = false;
              this.isSave = false;
              alert("提交失败!");
            });
        } else if (
          this.userinfo.account_id == "-1814768306395265967" ||
          this.userinfo.account_id == "7638091599462351621"
        ) {
          //国图
          console.log(data);
          var data = {
            id: id,
            project: {
              name: data.projectname,
              custom_field_values: {
                12: data.projectnumber,
                13: data.contractnumber,
                16: data.customercenter,
                17: data.contractmarket,
                22: data.projectlevel,
                28: data.projectstartdate,
                29: data.projectenddate,
                30: data.projecttype,
                32: keyword,
                35: data.constructioncontent,
                36: keytechnology,
                39: data.businessnumber,
                42: 1,
                31: data.businesstype,
                33: data.repositoryaddress,
                43: data.customerdepartment,
              },
              projectChildType: data.projectchildtype || "",
              parent_id: "",
              description: "",
              is_public: "1",
              user_id: this.userinfo.memberid,
              user_name: this.userinfo.emp_name,
              company_name: this.userinfo.account_name,
              company_id: this.userinfo.account_id,
              level_one_name: this.userinfo.subdept_name,
              level_one_id: this.userinfo.subdept_id,
              level_two_name: this.userinfo.dept_name,
              level_two_id: this.userinfo.dept_id,
              sale_name: data.contractmarket,
              sale_id: data.saleid, //新加
              project_no: data.projectnumber,
              expectContributions: data.expectcontributions,
              milestoneWeight: data.milestoneweight.substr(
                0,
                data.milestoneweight.length - 1
              ), //bug
              audit_status: 21,
            },
            category: this.$route.query.category,
            account_name: this.userinfo.account_name,
            username: this.userinfo.login_name,
            start: 1,
            project_member: projectMember,
            customer_contact: customercontact,
            risk: tableData,
            milestone: this.getOAMilestone(MilestoneParams),
          };
          submitOa("/sgpm/rest/api/integration/oa/flow", data)
            .then((res) => {
              this.disabled = true;
              console.log(res);
              if (res.data.code == 200) {
                this.disabled = true;
                this.isSave = true;
                alert("提交成功!");
                // 保存客户干系人
                this.saveCustom(JSON.parse(localStorage.getItem("addData")));

                //保存里程碑信息
                var json2 = localStorage.getItem("MilestoneParams");
                var MilestoneParams = JSON.parse(json2);
                console.log("项目里程碑数据");
                console.log(MilestoneParams);
                console.log(data.project.project_no);
                if (MilestoneParams) {
                  this.handleSaveProjectMilestone(
                    data.project.project_no,
                    MilestoneParams
                  );
                }
                this.$router.push({
                  path: "audititem",
                });
              } else {
                this.disabled = false;
                this.isSave = false;
                alert("提交失败!");
              }
            })
            .catch((e) => {
              // 数据校验失败
              console.log(e);
              this.disabled = false;
              this.isSave = false;
              alert("提交失败!");
            });
        } else if (this.userinfo.account_id == "8416498716893399290") {
          //南康启动
          var data = {
            id: id,
            project: {
              custom_field_values: {
                22: data.projectlevel, //项目级别
                28: data.projectstartdate, //项目预计开始时间
                29: data.projectenddate, //项目预计结束时间
                30: data.projecttype, //项目类型
                32: keyword, //项目关键字
                33: data.repositoryaddress, //配置库地址
                35: data.constructioncontent, //项目建设内容
                36: keytechnology, //拟使用的关键技术
              },
              parent_id: "", //不用填值
              description: "", //不用填值
              is_public: 0, //就是0
              name: data.projectname, ////项目名称
              project_no: data.projectnumber, //项目编号
              user_id: this.userinfo.memberid, //项目经理ID
              user_name: this.userinfo.emp_name, //项目经理名称
              company_name: this.userinfo.account_name, //项目经理名称
              company_id: this.userinfo.account_id, //项目经理公司名称
              level_one_name: this.userinfo.subdept_name, //实施B级单位名称
              level_one_id: this.userinfo.subdept_id, //实施B级单位ID
              // level_two_name: this.userinfo.dept_name,//实施C级单位名称
              // level_two_id: this.userinfo.dept_id,//实施C级单位ID

              sale_id: data.saleid || "", //销售ID
              sale_name: data.contractmarket, //销售名称
              customercenter: data.customercenter, //销售b级单位名称
              customercenternumber: data.customercenternumber, //销售b级单位id
              // customerdepartment: data.customerdepartment,//销售c级单位名称
              // customerdepartmentnumber: data.customerdepartmentnumber,//销售c级单位id

              expectContributions: data.expectcontributions, //销售c级单位id
              milestoneWeight: data.milestoneweight.substr(
                0,
                data.milestoneweight.length - 1
              ), //b占合同里程碑进度权重
              audit_status: 20,
            },
            username: this.userinfo.login_name, ///一定要填，当前登录人的姓名拼音
            category: 1, //固定值
            account_name: this.userinfo.account_name, //项目经理公司名称
            start: 1, //固定值,
            project_member: projectMember,
            customer_contact: customercontact,
            risk: tableData,
            milestone: this.getOAMilestone(MilestoneParams),
          };
          submitOa("/sgpm/rest/api/integration/oa/nk/workflow/start", data)
            .then((res) => {
              this.disabled = true;
              console.log(res);
              if (res.data.code == 200) {
                this.disabled = true;
                this.isSave = true;
                alert("提交成功!");
                // 保存客户干系人
                this.saveCustom(JSON.parse(localStorage.getItem("addData")));

                //保存里程碑信息
                var json2 = localStorage.getItem("MilestoneParams");
                var MilestoneParams = JSON.parse(json2);
                console.log("项目里程碑数据");
                console.log(MilestoneParams);
                console.log(data.project.project_no);
                if (MilestoneParams && MilestoneParams.length > 0) {
                  this.handleSaveProjectMilestone(
                    data.project.project_no,
                    MilestoneParams
                  );
                }
                this.$router.push({
                  path: "audititem",
                });
              } else {
                this.disabled = false;
                this.isSave = false;
                alert("提交失败!");
              }
            })
            .catch((e) => {
              // 数据校验失败
              console.log(e);
              this.disabled = false;
              this.isSave = false;
              alert("提交失败!");
            });
        }
      });
    },
    //测试保存
    saveDate1() {
      // 保存项目风险数据
      var json = localStorage.getItem("ProjectriskParams");
      var tableData = JSON.parse(json);
      if (tableData) {
        // this.handleSaveProjectRisk(tableData);
        //风险 要封装的字段key值
        var keys = [
          "riskType",
          "riskDescription",
          "possibilityGrade",
          "severityProbability",
          "urgency",
          "solutions",
        ];
        this.getOAStrRisk(tableData, keys);

        this.handleSaveProjectRisk(tableData);
      }

      //里程碑数据
      var json = localStorage.getItem("MilestoneParams");
      var MilestoneParams = JSON.parse(json);
      console.log("项目里程碑数据");
      console.log(MilestoneParams);
      //里程碑 要封装的字段key值
      var keys = [
        "stageName",
        "milestoneName",
        "progressPercentage",
        "isCut",
        "expectedBeginTime",
        "expectedEndTime",
        "workHours",
        "description",
      ];
      this.getOAStrMilestone(MilestoneParams, keys);

      //判断数据是否 全部填写
      var flag = this.checkMilestoneParams(MilestoneParams);

      //成员数据
      var projectMember = JSON.parse(localStorage.getItem("projectMember"));
      if (projectMember) {
        var keysMember = [
          "user_name",
          "role",
          "status",
          "enter_time",
          "leave_time",
          "unit_name",
          "level_one",
          "level_two",
        ];
        this.getOAStrMember(projectMember, keysMember);
      }

      //客户联系人
      var customercontact = JSON.parse(localStorage.getItem("addData"));
      if (customercontact) {
        var keyscustomer = [
          "LMName",
          "CustomName",
          "BusRole",
          "Email",
          "ZipCode",
          "MobilePhont",
          "PostInfo",
          "FAddress",
        ];
        this.getOAStrCustomer(customercontact, keyscustomer);
      }
    },

    saveDate() {
      this.$refs.generateForm.getData().then((data) => {
        this.isSave = true;
        this.disabled = true;
        // this.saveCustom(JSON.parse(localStorage.getItem('addData')));
        //获取项目核算 字符串数据
        var accountKeys = ["expendItem", "budgetMoney"];
        //获取初始化的项目预算数据
        if (localStorage.getItem("ProjectAccountParams")) {
          this.accountTableData = JSON.parse(
            localStorage.getItem("ProjectAccountParams")
          );
        }
        //保存项目成员
        var projectMember = JSON.parse(localStorage.getItem("projectMember"));
        if (projectMember) {
          var keysMember = [
            "user_name",
            "role",
            "status",
            "enter_time",
            "leave_time",
            "unit_name",
            "level_one",
            "level_two",
          ];
        }

        //保存客户联系人
        var customercontact = JSON.parse(localStorage.getItem("addData"));
        if (customercontact) {
          var keyscustomer = [
            "LMName",
            "CustomName",
            "BusRole",
            "Email",
            "ZipCode",
            "MobilePhont",
            "PostInfo",
            "FAddress",
          ];
        }
        //项目风险
        var ProjectriskParams = localStorage.getItem("ProjectriskParams");
        var tableData = [];
        if (JSON.parse(ProjectriskParams)) {
          tableData = JSON.parse(ProjectriskParams);
        }
        //V2 新需求 风险非必填
        if (tableData && tableData.length > 0) {
          //要封装的字段key值
          var keysrisk = [
            "riskType",
            "riskDescription",
            "possibilityGrade",
            "severityProbability",
            "urgency",
            "solutions",
          ];
          this.handleSaveProjectRisk(tableData);
        }
        //里程碑数据
        var json = localStorage.getItem("MilestoneParams");
        var MilestoneParams = JSON.parse(json);
        if (MilestoneParams) {
          var Milestone = [
            "stageName",
            "milestoneName",
            "progressPercentage",
            "isCut",
            "expectedBeginTime",
            "expectedEndTime",
            "workHours",
            "description",
          ];
        }
        //判断数据是否 全部填写
        // var flag = this.checkMilestoneParams(MilestoneParams);
        // if (!flag) {
        // 	alert('里程碑模板请填写全部数据！');
        // 	this.isSave = false;
        // 	this.disabled = false;
        // 	return false;
        // }
        // 新需求：保存时 里程碑可以不填

        var prostartdate = new Date(data.projectstartdate.replace(/\-/g, "/"));
        var proenddate = new Date(data.projectenddate.replace(/\-/g, "/"));
        if (prostartdate >= proenddate) {
          alert("项目预计开始时间不能大于项目预计结束时间！");
          this.isSave = false;
          this.disabled = false;
          return false;
        }
        var keyword = "";
        var keywordList = localStorage.getItem("keyWords");
        if (this.userinfo.account_id == "8416498716893399290") {
          if (localStorage.getItem("projectCode")) {
            keyword = localStorage.getItem("projectCode");
          }
          if (keyword == "") {
            this.warnMessage3();
            this.disabled = false;
            this.isSave = false;
            return;
          }
        } else {
          if (localStorage.getItem("keyWords")) {
            keyword = keywordList;
          }
          if (keyword == "") {
            this.warnMessage();
            this.isSave = false;
            this.disabled = false;
            return;
          }
        }

        var keytechnology = "";
        if (localStorage.getItem("keytechnologys")) {
          keytechnology = localStorage.getItem("keytechnologys");
        }
        if (keytechnology == "") {
          this.warnMessage2();
          this.isSave = false;
          this.disabled = false;
          return;
        }
        var id = "";
        if (this.$route.query.id) {
          id = this.$route.query.id;
        } else {
          id = localStorage.getItem("proId");
        }

        if (
          this.userinfo.account_id == "5326994013938795629" ||
          this.userinfo.account_id == "-1360422574114386809" ||
          this.userinfo.account_id == "-7975978055853456035" ||
          this.userinfo.account_id == "-8234401961992436364"
        ) {
          //填写
          var data = {
            id: id,
            project: {
              name: data.projectname,
              custom_field_values: {
                12: data.projectnumber,
                13: data.contractnumber,
                16: data.customercenter,
                17: data.contractmarket,
                18: data.contractmoney,
                19: data.contractsigningdate,
                22: data.projectlevel,
                23: data.operationalperiod,
                24: data.industry,
                25: data.region,
                28: data.projectstartdate,
                29: data.projectenddate,
                30: data.projecttype,
                32: keyword,
                35: data.constructioncontent,
                36: keytechnology,
                39: data.businessnumber,
                41: data.businesssystem,
                42: 1,
                43: data.customerdepartment,
                33: data.repositoryaddress,
              },
              parent_id: "",
              description: "",
              is_public: "1",
              user_id: this.userinfo.memberid,
              user_name: this.userinfo.emp_name,
              company_name: this.userinfo.account_name,
              company_id: this.userinfo.account_id,
              level_one_name: this.userinfo.subdept_name,
              level_one_id: this.userinfo.subdept_id,
              level_two_name: this.userinfo.dept_name,
              level_two_id: this.userinfo.dept_id,
              sale_name: data.contractmarket,
              sale_id: data.saleid,
              project_no: data.projectnumber,
              audit_status: 20,
            },
            account_name: this.userinfo.account_name,
            username: this.userinfo.login_name,
            start: 1,
          };
        } else if (
          this.userinfo.account_id == "-1814768306395265967" ||
          this.userinfo.account_id == "7638091599462351621"
        ) {
          //国图
          var data = {
            id: id,
            project: {
              name: data.projectname,
              custom_field_values: {
                12: data.projectnumber,
                13: data.contractnumber,
                16: data.customercenter,
                17: data.contractmarket,
                22: data.projectlevel,
                28: data.projectstartdate,
                29: data.projectenddate,
                30: data.projecttype,
                32: keyword,
                35: data.constructioncontent,
                36: keytechnology,
                39: data.businessnumber,
                42: 1,
                31: data.businesstype,
                33: data.repositoryaddress,
                43: data.customerdepartment,
              },
              projectChildType: data.projectchildtype || "",
              parent_id: "",
              description: "",
              is_public: "1",
              user_id: this.userinfo.memberid,
              user_name: this.userinfo.emp_name,
              company_name: this.userinfo.account_name,
              company_id: this.userinfo.account_id,
              level_one_name: this.userinfo.subdept_name,
              level_one_id: this.userinfo.subdept_id,
              level_two_name: this.userinfo.dept_name,
              level_two_id: this.userinfo.dept_id,
              sale_name: data.contractmarket,
              sale_id: data.saleid, //新加
              project_no: data.projectnumber,
              expectContributions: data.expectcontributions,
              milestoneWeight: data.milestoneweight.substr(
                0,
                data.milestoneweight.length - 1
              ), //bug
              audit_status: 20,
            },
            category: this.$route.query.category,
            account_name: this.userinfo.account_name,
            username: this.userinfo.login_name,
            start: 1,
          };
        } else if (this.userinfo.account_id == "8416498716893399290") {
          //南康
          var data = {
            id: id,
            project: {
              custom_field_values: {
                22: data.projectlevel, //项目级别
                28: data.projectstartdate, //项目预计开始时间
                29: data.projectenddate, //项目预计结束时间
                30: data.projecttype, //项目类型
                32: keyword, //项目关键字
                33: data.repositoryaddress, //配置库地址
                35: data.constructioncontent, //项目建设内容
                36: keytechnology, //拟使用的关键技术
              },
              parent_id: "", //不用填值
              description: "", //不用填值
              is_public: 0, //就是0
              name: data.projectname, ////项目名称
              project_no: data.projectnumber, //项目编号
              user_id: this.userinfo.memberid, //项目经理ID
              user_name: this.userinfo.emp_name, //项目经理名称
              company_name: this.userinfo.account_name, //项目经理名称
              company_id: this.userinfo.account_id, //项目经理公司名称
              level_one_name: this.userinfo.subdept_name, //实施B级单位名称
              level_one_id: this.userinfo.subdept_id, //实施B级单位ID
              // level_two_name: this.userinfo.dept_name,//实施C级单位名称
              // level_two_id: this.userinfo.dept_id,//实施C级单位ID

              sale_id: data.saleid || "", //销售ID
              sale_name: data.contractmarket, //销售名称
              customercenter: data.customercenter, //销售b级单位名称
              customercenternumber: data.customercenternumber, //销售b级单位id
              // customerdepartment: data.customerdepartment,//销售c级单位名称
              // customerdepartmentnumber: data.customerdepartmentnumber,//销售c级单位id
              audit_status: 20,
            },
            username: this.userinfo.login_name, ///一定要填，当前登录人的姓名拼音
            category: 1, //固定值
            account_name: this.userinfo.account_name, //项目经理公司名称
            start: 1, //固定值
          };
        }

        saveDate("/sgpm/rest/api/server/pm/project", data)
          .then((res) => {
            // console.log(res);
            if (res.data.code == 200) {
              alert("保存成功!");
              this.isSave = false;
              this.disabled = false;
            } else if (res.data.code == 201) {
              alert("保存失败!");
              this.isSave = false;
              this.disabled = false;
            }
          })
          .catch((err) => {
            console.log(err);
            this.isSave = false;
            this.disabled = false;
          });

        // 保存项目风险数据
        var json = localStorage.getItem("ProjectriskParams");

        //保存里程碑信息
        var json = localStorage.getItem("MilestoneParams");
        var MilestoneParams = JSON.parse(json);
        console.log("项目里程碑数据");
        console.log(MilestoneParams);
        console.log(data.project.project_no);
        if (MilestoneParams && MilestoneParams.length > 0) {
          this.handleSaveProjectMilestone(
            data.project.project_no,
            MilestoneParams
          );
          //里程碑 要封装的字段key值
          var keys = [
            "stageName",
            "milestoneName",
            "progressPercentage",
            "expectedBeginTime",
            "expectedEndTime",
            "workHours",
            "description",
          ];
          this.getOAStr(MilestoneParams, keys);
        }

        //保存客户联系人

        // if (this.addDate) {
        //   var saveData = this.addData;
        // } else {
        //   var saveData = this.addTableData;
        // }
        var customercontact = JSON.parse(localStorage.getItem("addData"));
        var keys = [
          "BusRole",
          "CustomName",
          "Email",
          "FAddress",
          "LMName",
          "MobilePhont",
          "PostInfo",
          "ZipCode",
        ];
        // this.getOAStr(customercontact,keys);
        this.saveCustom(customercontact);

        //保存项目成员
        var projectMember = JSON.parse(localStorage.getItem("projectMember"));
        var keys = [
          "user_name",
          "enter_time",
          "leave_time",
          "level_one",
          "level_two",
          "role",
          "status",
          "unit_name",
        ];
        // this.getOAStr(projectMember,keys);
      });
    },
    saveCustom(data) {
      serverPostHttpMethod(
        "/sgpm/rest/api/server/pm/project/customercontact",
        data
      )
        .then((res) => {
          console.log(res);
          Bus.$emit("customercontactSave", { code: 200, success: true });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //将数据封装为字符串格式，提交到OA审批中
    getOAStr(tableData, keys) {
      if (tableData != null && keys != undefined) {
        var oaStr = "";
        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i];
          // var keys = Object.keys(item); //获取hash的所有key
          // var keys=["riskType","riskDescription","possibilityGrade","severityProbability","urgency"];
          var str = ""; //单行数据
          keys.forEach((key) => {
            var value = item[key];
            if (value == "" || value == undefined) {
              value = "无";
            }
            value += "|";
            str += value;
          });
          str = str + "\r\n"; //加回车 换行符
          // console.log(str);
          oaStr += str;
        }
      } else {
        oaStr = "";
      }
      console.log("====组件字符串形式数据======");
      console.log(oaStr);
      return oaStr;
    },

    //项目成员组件转字符串
    // ["user_name", "role", "status", "enter_time", "leave_time","unit_name", "level_one", "level_two"];
    getOAStrMember(tableData, keys) {
      if (tableData != null && keys != undefined) {
        var oaStr =
          "【项目成员】    【角色】    【员工状态】    【预计加入时间】    【预计离开时间】         【A级单位】                【B级单位】           【C级单位】";
        oaStr += "\r\n";

        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i];
          var str = ""; //单行数据
          keys.forEach((key) => {
            var value = item[key];
            if (value == "" || value == undefined) {
              value = "无";
            }

            //固定长度 项目成员
            if (key == "user_name") {
              var n1 = this.GetStringByteLength(value);
              if (n1 < 8) {
                var num = 8 - n1 + 9; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
              if (n1 == 8) {
                var num = 8 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            //固定长度 角色
            if (key == "role") {
              var n1 = this.GetStringByteLength(value);
              // console.log("n1:"+n1);
              if (n1 < 18) {
                var num = 18 - n1 + 9; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
              if (n1 == 18) {
                var num = 18 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            //固定长度 状态
            if (key == "status") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 4) {
                var num = 4 - n1 + 10; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            //固定长度 加入时间
            if (key == "enter_time") {
              var s = " ".repeat(12);
              value += s;
            }

            if (key == "leave_time") {
              if (value == "无") {
                var s = " ".repeat(20);
                value += s;
              } else {
                var s = " ".repeat(6);
                value += s;
              }
            }
            if (key == "unit_name") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 26) {
                var num = 26 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            if (key == "level_one") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 16) {
                var num = 16 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }

            value += "";
            str += value;
          });
          str = str + "\r\n"; //加回车 换行符
          oaStr += str;
        }
      } else {
        oaStr = "";
      }
      console.log("====项目成员 字符串形式数据======");
      console.log(oaStr);
      return oaStr;
    },

    //客户干系人组件转字符串
    //  ["LMName", "CustomName", "BusRole", "Email", "ZipCode", "MobilePhont","PostInfo", "FAddress"];
    getOAStrCustomer(tableData, keys) {
      if (tableData != null && keys != undefined && tableData.length > 0) {
        //获取 客户单位名称  字段最大长度  "CustomName", "FAddress"
        var len1 = this.GetStringByteLength(tableData[0].CustomName);

        for (var i = 1; i < tableData.length; i++) {
          var item2 = tableData[i]; //第二个元素开始比较
          var item2_len1 = this.GetStringByteLength(item2.CustomName);
          if (item2_len1 > len1) {
            len1 = item2_len1;
          }
        }
        console.log("len1:" + len1);

        var title1 = "【客户单位名称】";
        if (len1 > this.GetStringByteLength(title1)) {
          var s = " ".repeat(len1 - this.GetStringByteLength(title1) + 10);
          title1 += s;
        }
        var oaStr =
          "【姓名】      " +
          title1 +
          "【职务】          【电子邮箱地址】          【邮编】        【电话】          【客户成员角色】         【通讯地址】";
        oaStr += "\r\n";
        // var oaStr = "【姓名】    【客户单位名称】                     【职务】          【电子邮箱地址】      【通讯地址】                                【邮编】        【电话】          【客户成员角色】";
        // oaStr += "\r\n";

        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i];
          var str = ""; //单行数据
          keys.forEach((key) => {
            var value = item[key];
            if (value == "" || value == undefined) {
              value = "无";
            }

            if (key == "LMName") {
              var n1 = this.GetStringByteLength(value);
              if (n1 < 8) {
                var num = 8 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
              if (n1 == 8) {
                var num = 8 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            // 客户单位名称
            if (key == "CustomName") {
              var n1 = this.GetStringByteLength(value);
              if (n1 < len1) {
                var num = len1 - n1 + 8; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
              if (n1 == len1) {
                var num = len1 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            //固定长度 职务
            if (key == "BusRole") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 10) {
                var num = 10 - n1 + 10; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            if (key == "Email") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 20) {
                var num = 20 - n1 + 8; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            // 邮编
            if (key == "ZipCode") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 10) {
                var num = 10 - n1 + 2; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            // 电话
            if (key == "MobilePhont") {
              var n1 = this.GetStringByteLength(value);
              if (n1 <= 16) {
                var num = 16 - n1 + 8; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            // 客户成员角色
            if (key == "PostInfo") {
              var n1 = this.GetStringByteLength(value);
              if (n1 < 12) {
                var num = 12 - n1 + 9;
                var s = " ".repeat(num);
                value += s;
              }
              if (n1 == 12) {
                var num = 12 - n1 + 6;
                var s = " ".repeat(num);
                value += s;
              }
            }

            value += "";
            str += value;
          });
          str = str + "\r\n"; //加回车 换行符
          oaStr += str;
        }
      } else {
        oaStr = "";
      }
      console.log("====干系人 字符串形式数据======");
      console.log(oaStr);
      return oaStr;
    },

    //风险组件转字符串
    getOAStrRisk(tableData, keys) {
      if (tableData != null && keys != undefined) {
        //获取风险描述 应对措施字段最大长度  "riskDescription", "solutions"
        var len1 = this.GetStringByteLength(tableData[0].riskDescription); //风险描述的最大长度
        var len2 = this.GetStringByteLength(tableData[0].solutions); //应对措施的最大长度

        for (var i = 1; i < tableData.length; i++) {
          var item2 = tableData[i]; //第二个元素开始比较
          var item2_len1 = this.GetStringByteLength(item2.riskDescription);
          var item2_len2 = this.GetStringByteLength(item2.solutions);
          if (item2_len1 > len1) {
            len1 = item2_len1;
          }
          if (item2_len2 > len2) {
            len2 = item2_len2;
          }
        }
        console.log("len1:" + len1);
        console.log("len2:" + len2);

        var title1 = "【风险描述】";
        if (len1 > this.GetStringByteLength(title1)) {
          var s = " ".repeat(len1 - this.GetStringByteLength(title1) + 6);
          title1 += s;
        }
        var title2 = "【应对措施】";
        var oaStr =
          "【风险类型】     " +
          title1 +
          "【可能性等级】    【严重性】      【紧迫性】     " +
          title2;
        oaStr += "\r\n";

        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i];
          var str = ""; //单行数据
          keys.forEach((key) => {
            var value = item[key];
            if (value == "" || value == undefined) {
              value = "无";
            }

            //固定长度 风险类型
            if (key == "riskType") {
              var n1 = this.GetStringByteLength(value);
              if (n1 < 12) {
                var num = 12 - n1 + 9; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
              if (n1 == 12) {
                var num = 12 - n1 + 6; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            //固定长度 风险描述
            if (key == "riskDescription") {
              var n1 = this.GetStringByteLength(value);
              if (n1 < len1) {
                var num = len1 - n1 + 16; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }

              if (n1 == len1) {
                var num = len1 - n1 + 12; //添加 空格的个数
                var s = " ".repeat(num);
                value += s;
              }
            }
            //固定长度
            if (key == "possibilityGrade" || key == "severityProbability") {
              var s = " ".repeat(20);
              value += s;
            }

            if (key == "urgency") {
              var s = " ".repeat(12);
              value += s;
            }

            // value += "|";
            value += "";
            str += value;
          });
          str = str + "\r\n"; //加回车 换行符
          // console.log(str);
          oaStr += str;
        }
      } else {
        oaStr = "";
      }
      console.log("====风险组件字符串形式数据======");
      console.log(oaStr);
      return oaStr;
    },

    //里程碑组件 重新封装到OA数据
    getOAMilestone(tableData) {
      var arr = [];
      if (tableData != null) {
        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i];
          //添加选中的数据
          if (item.deliverableStatus) {
            var hash = {};
            hash["stageName"] = item.stageName; //阶段名称 新增字段
            hash["milestoneName"] = item.milestoneName;
            hash["progressPercentage"] = item.progressPercentage;
            hash["isCut"] = item.isCut == 1 ? "是" : "否";
            hash["description"] = item.description;
            hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
            hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
            hash["estimatedWorkingHours"] = item.workHours; //预计工时
            // 交付物数据
            var deliverable = item.deliverable;
            var del_str = "";
            deliverable.forEach((del) => {
              if (del.checkedStatus) {
                del_str += del.deliverableName + "、";
              }
            });
            hash["delStr"] = del_str.substr(0, del_str.length - 1);
            arr.push(hash);
          }
        }
      }
      console.log("======里程碑OA数据======");
      console.log(arr);
      return arr;
    },

    //里程碑组件 将数据封装为字符串格式，添加交付物的数据
    getOAStrMilestone(tableData, keys) {
      if (tableData != null && keys != undefined) {
        var oaStr =
          "【阶段名称】   【里程碑名称】    【对应百分比】    【是否可裁剪】     【预计开始时间】     【预计完成时间】   【预计工时(人月)】    【里程碑描述】";
        // var oaStr = "阶段名称   里程碑名称    对应百分比    是否可裁剪     预计开始时间     预计完成时间   预计工时(人月)    里程碑描述";
        oaStr += "\r\n";

        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i];
          //添加选中的数据
          if (item.deliverableStatus) {
            // 交付物数据
            var deliverable = item.deliverable;
            var str = "     "; //单行数据
            keys.forEach((key) => {
              var value = item[key];
              if (value == undefined) {
                value = "无";
              }
              //对应百分比 加%
              if (key == "progressPercentage") {
                // value = value + "%";
                value = value;
              }
              //是否可裁剪 转为字符串
              if (key == "isCut") {
                if (value == 0) {
                  value = "否";
                } else {
                  value = "是";
                }
              }
              //固定长度 里程碑名称
              if (key == "milestoneName") {
                // var len1 = value.length;
                var len1 = this.GetStringByteLength(value);
                if (len1 < 15) {
                  var num = 15 - len1 + 12; //添加 空格的个数
                  var s = " ".repeat(num);
                  value += s;
                }
              }
              //stageName 阶段名称
              if (key == "stageName") {
                var len1 = value.length;
                if (len1 < 3) {
                  var num = 3 - len1 + 18; //添加 空格的个数
                  var s = " ".repeat(num);
                  value += s;
                }
              }
              //progressPercentage 对应百分比
              if (key == "progressPercentage") {
                value += ""; //将数字转为字符串
                var len1 = this.GetStringByteLength(value);
                // var len1 = value.length;
                console.log(len1);
                if (len1 < 5) {
                  var num = 5 - len1 + 22; //添加 空格的个数
                  var s = " ".repeat(num);
                  value += s;
                }
              }
              // isCut  是否可裁剪
              if (key == "isCut") {
                var s = " ".repeat(18);
                value += s;
              }
              // expectedBeginTime
              // expectedEndTime
              if (key == "expectedBeginTime" || key == "expectedEndTime") {
                var s = " ".repeat(15);
                value += s;
              }
              // workHours
              if (key == "workHours") {
                var len1 = this.GetStringByteLength(value);
                if (len1 < 6) {
                  var num = 6 - len1 + 17; //添加 空格的个数
                  var s = " ".repeat(num);
                  value += s;
                }
              }
              // description
              // value += "|";
              value += "";
              str += value;
            });
            str = str + "\r\n";
            str =
              str +
              "          【交付物名称】        【是否可裁剪】        【交付物描述】   ";
            deliverable.forEach((del) => {
              if (del.checkedStatus) {
                var delKeys = ["deliverableName", "isCut", "description"];
                str = str + "\r\n";
                var delStr = "            "; //交付物单行数据
                delKeys.forEach((key) => {
                  var kValue = del[key];
                  if (key == "deliverableName") {
                    var len1 = this.GetStringByteLength(kValue);
                    if (len1 < 20) {
                      var num1 = 20 - len1 + 6; //添加 空格的个数
                      var s1 = " ".repeat(num1);
                      kValue += s1;
                    }
                  }
                  if (key == "isCut") {
                    if (kValue == 0) {
                      kValue = "否";
                    } else {
                      kValue = "是";
                    }
                    var s = " ".repeat(16);
                    kValue += s;
                  }
                  delStr += kValue;
                });
                delStr += "";
                str += delStr;
              }
            });
            str = str + "\r\n"; //加回车 换行符
            str = str + "\r\n"; //加回车 换行符
            oaStr += str;
          }
        }
      } else {
        oaStr = "";
      }
      console.log("====组件字符串形式数据======");
      console.log(oaStr);
      return oaStr;
    },

    //里程碑数据 预计开始时间 预计结束时间 预计工时 判断是否全部必填
    checkMilestoneParams(multipleSelection) {
      if (multipleSelection) {
        // 新增判断条件
        if (multipleSelection.length == 0) {
          return false;
        }
        var flag = true;
        multipleSelection.forEach((item) => {
          //针对选择的数据判断
          if (item.deliverableStatus) {
            var d1 = item.expectedBeginTime;
            var d2 = item.expectedEndTime;
            var d3 = item.workHours;
            if (!d1 || !d2 || !d3) {
              flag = false;
            }
          }
        });
        return flag;
      } else {
        // alert('项目里程碑实施计划必须填写!')
        return false;
      }
    },

    //项目风险 风险描述 判断是否全部必填
    checkProjectriskParams(ProjectriskParams) {
      if (ProjectriskParams) {
        var flag = true;
        ProjectriskParams.forEach((item) => {
          var d1 = item.riskDescription;
          if (d1 == "") {
            flag = false;
          }
        });
        return flag;
      } else {
        return false;
      }
    },

    /**
     *获取字符串字节数
     */
    GetStringByteLength(val) {
      if (val) {
        var Zhlength = 0; // 全角
        var Enlength = 0; // 半角
        for (var i = 0; i < val.length; i++) {
          if (val.substring(i, i + 1).match(/[^\x00-\xff]/gi) != null)
            Zhlength += 1;
          else Enlength += 1;
        }
        // 返回当前字符串字节长度
        return Zhlength * 2 + Enlength;
      }
    },

    //获取项目核算数据--根据项目编号
    getAccountData(contractNumber) {
      // console.log("====核算合同编号===="+contractNumber);
      // contractNumber= 'SM-XS-JSKF-ZS-2012-4659';
      var params = { contractNumber: contractNumber };
      if (contractNumber) {
        // var url = "/sgpm/rest/api/integration/oa/budgets/information";
        var url = `/sgpm/rest/api/integration/data/budgets/information/${this.userinfo.account_id}?contractNumber=${contractNumber}`; // 2020 1.9 新
        integrationGetMethod(url, null)
          .then((res) => {
            var jsonData = res.data.data;
            console.log(jsonData);
            //  var accountTableData= [
            //   {expendItem: '实施费用预算', budgetMoney: ''},
            //   {expendItem: '--人工费用预算', budgetMoney: ''},
            //   {expendItem: '--运营费用预算', budgetMoney: ''},
            //   {expendItem: '销售费用预算', budgetMoney: ''},
            //   {expendItem: '项目采购成本预算', budgetMoney: ''},
            //   {expendItem: '项目总预算', budgetMoney: ''},
            // ];
            // accountTableData[0].budgetMoney = jsonData.shishifeiyongBudget; //实施费用预算
            // accountTableData[1].budgetMoney = jsonData.rengongfeiyongBudget;  //人工费用预算
            // accountTableData[2].budgetMoney = jsonData.yunyingfeiyongBudget;  //运营费用预算
            // accountTableData[3].budgetMoney = jsonData.xiaoshoufeiyongBudget;  //销售费用预算
            // accountTableData[4].budgetMoney = jsonData.caigouchengbenBudget;  //项目采购成本预算
            // accountTableData[5].budgetMoney = jsonData.totalBudget;  //项目总预算

            this.accountTableData[0].budgetMoney = jsonData.shishifeiyongBudget; //实施费用预算
            this.accountTableData[1].budgetMoney =
              jsonData.rengongfeiyongBudget; //人工费用预算
            this.accountTableData[2].budgetMoney =
              jsonData.yunyingfeiyongBudget; //运营费用预算
            this.accountTableData[3].budgetMoney =
              jsonData.xiaoshoufeiyongBudget; //销售费用预算
            this.accountTableData[4].budgetMoney =
              jsonData.caigouchengbenBudget; //项目采购成本预算
            this.accountTableData[5].budgetMoney = jsonData.totalBudget; //项目总预算
            //获取组件字符串数据
            // var keys=["expendItem","budgetMoney"];
            // this.getOAStr(accountTableData,keys);

            Bus.$emit("accountTableData", this.accountTableData); //发送到预算组件中
            var Params = JSON.stringify(this.accountTableData);
            localStorage.setItem("ProjectAccountParams", Params); //更新localstorage
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    //保存项目风险的方法
    handleSaveProjectRisk(data) {
      var url = "/sgpm/rest/api/server/pm/project/risk";
      serverPostHttpMethod(url, data)
        .then((res) => {
          if (res.data.code == 200) {
            // alert('风险保存成功');
            Bus.$emit("ProjectriskSave", { code: 200, success: true });
          } else {
            alert("保存失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //保存里程碑信息方法 第一次启动保存使用
    handleSaveProjectMilestone(projectNumber, multipleSelection) {
      console.log("项目编号：" + projectNumber);
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      var data = {};
      data["projectNumber"] = projectNumber; //项目编号
      var milestones = [];
      multipleSelection.forEach((item) => {
        // 全选bug 修改 item.deliverableStatus true为选中的
        if (item.deliverableStatus) {
          var hash = {};
          hash["milestoneName"] = item.milestoneName;
          hash["isCut"] = item.isCut;
          hash["progressPercentage"] = item.progressPercentage;
          hash["sortIndex"] = 1.0;
          hash["description"] = item.description;
          hash["milestoneTemplateName"] = item.milestoneTemplateName; //里程碑模板名称
          hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
          hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
          hash["finishDate"] = item.actualEndTime; //实际完成时间
          hash["estimatedWorkingHours"] = item.workHours; //预计工时
          hash["delayDays"] = item.delayDays; //延期天数
          hash["status"] = 0;
          hash["stageName"] = item.stageName; //阶段名称 新增字段
          hash["id"] = item.projectMilestoneId; //里程碑id 更新使用
          //交付物
          var deliverable = [];
          item.deliverable.forEach((del) => {
            //根据交付物中checkedStatus状态 保存交付物
            if (del.checkedStatus) {
              var ha = {};
              ha["deliverableName"] = del.deliverableName;
              ha["isCut"] = del.isCut;
              ha["auditDeliverable"] = del.auditDeliverable; //新增字段 是否审计
              // 区分更新操作还是添加 有deliverableTemplateId 时为更新操作  否则为添加操作
              if (del["deliverableTemplateId"] == undefined) {
                //添加操作
                ha["deliverableTemplateId"] = del.deliverableId; //交付物模板id 新增字段
              } else {
                //更新操作
                ha["id"] = del.deliverableId;
              }
              //国图新增字段
              ha["contractDeliverable"] = del.contractDeliverable; //是否合同交付物

              // ha["deliverableId"] = del.deliverableId;//交付物id 更新使用
              ha["description"] = del.description;
              // ha["deliverableTemplateId"] = del.deliverableId; //交付物模板id 新增字段
              ha["status"] = 1; //交付物状态 1未上传  2待审核   3审核通过  4驳回
              deliverable.push(ha);
            }
          });
          hash["deliverable"] = deliverable;
          milestones.push(hash);
        }
      });
      data["milestones"] = milestones; //里程碑信息
      console.log("保存参数--里程碑");
      console.log(data);
      serverPostHttpMethod(url, data)
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            // alert('保存成功')
            Bus.$emit("ProjectMilestoneSave", {
              projectNumber: projectNumber,
              success: true,
            });
          } else {
            alert("保存失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //柴跃华 每个组件都要增加销毁前重置EventBus
    beforeDestroy() {
      Bus.$off();
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/common.css";

.projectview {
  overflow-y: auto;
}

.btns {
  text-align: center;
}
</style>
<style scoped></style>
