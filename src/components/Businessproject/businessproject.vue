<template>
  <el-col :span="24" class="projectview busniess">
    <p class="back">
      <!-- <p class="back"> -->
      <i class="el-icon-back back-size" @click="back"></i>
    </p>
    <!-- {{globalParams}} -->
    <generate-form
      :data="jsonData"
      :remote="remoteFuncs"
      :value="editData"
      ref="generateForm"
      :globalParams="globalParams"
    ></generate-form>
    <div class="btns">
      <el-button type="primary" size="mini" @click="saveDate" v-show="isShow" :disabled="isSave">保存</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleSubmit"
        :disabled="disabled"
        v-show="isShow && isRevoke == 2"
      >提交</el-button>
      <el-button type="primary" size="mini" @click="back">返回</el-button>
    </div>
  </el-col>
</template>
<script>
import Bus from "../../bus";
var select_array = [];
var all_array = [];
var index_array = [];
var projectLevel = [];
var personInfor = JSON.parse(localStorage.getItem("personInfor"));
import GenerateForm from "@/components/CreateForm/GenerateForm";
import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
import "@/components/CreateForm/styles/FormCreate.css";
import { getData } from "../../api/api.js";
import { getMenuList } from "../../api/api.js";
import { submitOa } from "../../api/api.js";
import { getPersonInfor } from "../../api/api.js";
import { serverPostHttpMethod } from "../../api/api.js";
import { updateTime } from "../../api/api.js";
import { getTemplate } from "../../api/api.js";
import { saveDate } from "../../api/api.js";
import { updateDate } from "../../api/api.js";
import { serverGetHttpMethod } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import { getContract } from "../../api/api.js";
import { projectMsgById } from "../../api/api.js";
import api from "../../api/index"; // 引用url.js
import config from "../../config";
export default {
  name: "Businessproject",
  components: {
    GenerateForm,
    GenetateFormItem,
  },
  data() {
    return {
      isShow: this.$route.query.isShow == 1 ? false : true, //默认显示 1不显示提交按钮
      isSave: false,
      jsonData: {
        list: "",
        config: {
          labelPosition: "left",
          labelWidth: 100,
          size: "small",
        },
      },
      disabled: false,
      itemInfo: [],
      pId: "",
      pNum: "",
      projectData: [],
      keywordList: "",
      projectCodeList: "",
      keytechnologyList: "",
      editData: {},
      remoteFuncs: {},
      globalParams: {},
      projectInfo: [],
      deptInfo: [],
      marketInfo: "",
      projectNumber: this.$route.query.projectNumber,
    };
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail", //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ]),
    isRevoke: function () {
      return sessionStorage.getItem("isRevoke");
    },
  },
  beforeCreate() {
    // console.log('this.globalParams')
    // console.log(this.globalParams)
  },
  created() {
    console.log(this.projectNumber);
    this.globalParams.account_id = this.userinfo.account_id;
    var that = this;
    var id = 1; //商机1，合同2，启动3
    //公司id
    var account_id = this.userinfo.account_id;
    var url = "/template/" + id + "/" + account_id;
    getTemplate(url)
      .then((res) => {
        this.jsonData = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
    var businessProjectId = localStorage.getItem("businessProjectId");
    this.globalParams.memberId = this.userinfo.memberid;
    this.globalParams.subdept_id = this.userinfo.subdept_id;
    this.globalParams.businessProjectId = businessProjectId;
    this.initModule();
    if (
      (businessProjectId &&
        this.userinfo.account_id == "-1360422574114386809") ||
      (businessProjectId &&
        this.userinfo.account_id == "5326994013938795629") ||
      (businessProjectId &&
        this.userinfo.account_id == "-7975978055853456035") ||
      (businessProjectId && this.userinfo.account_id == "-8234401961992436364")
    ) {
      this.initBusinessData(businessProjectId);
    } else if (
      (this.projectNumber &&
        this.userinfo.account_id == "-1814768306395265967") ||
      (this.projectNumber &&
        this.userinfo.account_id == "8416498716893399290") ||
      (this.projectNumber && this.userinfo.account_id == "7638091599462351621")
    ) {
      console.log(this.projectNumber);
      this.initBusinessData(this.projectNumber);
    }
    this.initModuleDept();
    this.getDept();
    this.$nextTick(() => {
      Bus.$on("audit", ({ obj, projectId }) => {
        this.globalParams.businessProjectId = projectId;
        this.$set(this.globalParams, "data", obj);
        this.$set(this.globalParams, "data1", obj);
        this.globalParams.data = obj;
      });
    });
    if (this.$route.fullPath == "/Businessproject?judgelogo=a") {
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      localStorage.removeItem("projectCode");
    }
    localStorage.removeItem("pNumber");
    localStorage.removeItem("quanzhongDate");
    localStorage.removeItem("projectSplit");
    localStorage.removeItem("gtprojectId");
    if (this.$route.query.judgelogo == "a") {
      localStorage.removeItem("market");
      localStorage.removeItem("gtProjectSplit");
    }
  },
  mounted() {
    //获取商机页面
    Bus.$on("businessInfo", (item) => {
      if (item) {
        this.itemInfo = item;
        // console.log(item);
      }
    });
    Bus.$on("keyword", (item) => {
      if (item) {
        this.keywordList = item;
      }
    });
    Bus.$on("projectCode", (item) => {
      if (item) {
        this.projectCodeList = item;
      }
    });
    Bus.$on("keytechnology", (item) => {
      if (item) {
        this.keytechnologyList = item;
      }
    });
    Bus.$on("projectlevel", (item) => {
      if (item) {
        this.projectlevel = item;
      }
    });
    Bus.$on("MarketSelectInfo", (item) => {
      if (item) {
        this.marketInfo = item;
        console.log(this.marketInfo);
      }
    });
  },
  methods: {
    getDept() {
      var subdept_id = this.userinfo.subdept_id;
      var url =
        api.urlPort05 + "/sgpm/rest/api/system/second/dept/" + subdept_id;
      this.axios
        .get(url)
        .then((res) => {
          this.deptInfo = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initModule() {
      var that = this;
      let url = "/sgpm/rest/api/integration/oa/business/wanyuan/";
      this.$nextTick(() => {
        Bus.$on("contactbusiness", ({ model, val }) => {
          // console.log(val)
          if (/.*[\u4e00-\u9fa5]+.*$/.test(val)) {
            var index = val.lastIndexOf("-");
            val = val.substring(0, index);
            return val;
          }
          getContract(url + val).then((res) => {
            // res.data.data.CONTRACTMONEY = this.keepTwoDecimalFull(res.data.data.CONTRACTMONEY);
            this.$set(this.globalParams, "data", res.data.data);

            // console.log(res.data.data)
            this.projectInfo = res.data.data;
          });
        });
      });
    },
    initModuleDept() {
      var that = this;
      this.$nextTick(() => {
        Bus.$on("implementationsecondary", ({ model, val }) => {
          // console.log(val,model)
        });
      });
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
    initBusinessData(businessProjectId) {
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      localStorage.removeItem("projectCode");
      if (
        this.userinfo.account_id == "-1360422574114386809" ||
        this.userinfo.account_id == "5326994013938795629" ||
        this.userinfo.account_id == "-7975978055853456035" ||
        this.userinfo.account_id == "-8234401961992436364"
      ) {
        //超图
        //通过项目id获取项目基本信息
        projectMsgById(
          "/sgpm/rest/api/server/pm/project?projectId=" + businessProjectId,
          null
        )
          .then((res) => {
            if (this.userinfo.account_id == "8416498716893399290") {
              localStorage.setItem("projectCode", res.data.data.KEYWORD);
            } else {
              localStorage.setItem("keyWords", res.data.data.KEYWORD);
            }
            localStorage.setItem("keytechnologys", res.data.data.KEYTECHNOLOGY);
            this.$set(this.globalParams, "data", res.data.data);
            localStorage.removeItem("globalParams");
            if (res.data.data.BUSINESS) {
              res.data.data.customercenter =
                res.data.data.BUSINESS.CUSTOMERCENTER;
              res.data.data.customerdepartment =
                res.data.data.BUSINESS.CUSTOMERDEPARTMENT;
            }
            localStorage.setItem(
              "globalParams",
              JSON.stringify(this.updateJsonData(res.data.data))
            );
            this.$set(
              this.globalParams,
              "CONTRACTMARKET",
              res.data.data.CONTRACTMARKET
            );
            this.$set(
              this.globalParams,
              "PROJECTNAME",
              res.data.data.PROJECTNAME
            );
            this.$set(
              this.globalParams,
              "PROJECTNUMBER",
              res.data.data.PROJECTNUMBER
            );
            this.$set(
              this.globalParams,
              "CONSTRUCTIONCONTENT",
              res.data.data.CONSTRUCTIONCONTENT
            );
            this.$set(
              this.globalParams,
              "BUSINESSSYSTEM",
              res.data.data.BUSINESSSYSTEM
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        this.userinfo.account_id == "-1814768306395265967" ||
        this.userinfo.account_id == "8416498716893399290" ||
        this.userinfo.account_id == "7638091599462351621"
      ) {
        //国图-南康
        //通过项目编号获取
        let projectNumber = this.projectNumber;
        if (
          this.userinfo.account_id == "-1814768306395265967" ||
          this.userinfo.account_id == "7638091599462351621"
        ) {
          var url = "/sgpm/rest/api/server/pm/gt/project/" + projectNumber;
        } else if (this.userinfo.account_id == "8416498716893399290") {
          var url = "/sgpm/rest/api/server/pm/nk/project/" + projectNumber;
        }
        localStorage.removeItem("keyWords");
        localStorage.removeItem("keytechnologys");
        localStorage.removeItem("projectCode");
        serverGetHttpMethod(url)
          .then((res) => {
            console.log(res);
            let data = res.data.data;
            res.data.data.expectContractAmount = this.keepTwoDecimalFull(
              res.data.data.expectContractAmount / 10000
            );
            var projectSplitContent = res.data.data.projects;
            for (var i = 0; i < projectSplitContent.length; i++) {
              projectSplitContent[i].expectContributions =
                projectSplitContent[i].expectContributions / 10000;
            }

            localStorage.removeItem("globalParams");
            if (this.userinfo.account_id == "8416498716893399290") {
              localStorage.setItem("projectCode", res.data.data.projectKeyWord);
            } else {
              localStorage.setItem("keyWords", res.data.data.projectKeyWord);
            }
            localStorage.setItem("keytechnologys", res.data.data.keyTechnology);
            localStorage.setItem("globalParams", JSON.stringify(data));
            var market = {
              projectSaleName: res.data.data.projectSaleName,
              saleClassUnitBName: res.data.data.saleClassUnitBName,
              saleClassUnitCName: res.data.data.saleClassUnitCName,
              projectSaleId: res.data.data.projectSaleId,
              saleClassUnitBId: res.data.data.saleClassUnitBId,
              saleClassUnitCId: res.data.data.saleClassUnitCId,
            };
            localStorage.removeItem("market");
            localStorage.setItem("market", JSON.stringify(market));
            localStorage.removeItem("gtProjectSplit");
            localStorage.setItem(
              "gtProjectSplit",
              JSON.stringify(res.data.data.projects)
            );
            Bus.$emit("gtProjectSplit", JSON.stringify(res.data.data.projects));
            Bus.$emit("market", JSON.stringify(market));
            Bus.$emit("keyWords", res.data.data.projectKeyWord);
            Bus.$emit("keytechnologys", res.data.data.keyTechnology);
            Bus.$emit("projectCode", res.data.data.projectKeyWord);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    updateJsonData(obj) {
      let result = {};
      for (let item in obj) {
        if (item == "CONTRACT" || item == "BUSINESS") {
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
    warnMessage2() {
      this.$message({
        showClose: true,
        message: "拟使用的关键技术不能为空",
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
    //提交
    handleSubmit() {
      this.disabled = true;
      this.isSave = true;
      var that = this;
      this.$refs.generateForm
        .getData()
        .then((data) => {
          // 数据校验成功
          // data 为获取的表单数据
          // console.log(data);
          // console.log(this.$refs.generateForm.tagArr);
          if (
            this.userinfo.account_id == "-1360422574114386809" ||
            this.userinfo.account_id == "5326994013938795629" ||
            this.userinfo.account_id == "-7975978055853456035" ||
            this.userinfo.account_id == "-8234401961992436364"
          ) {
            //超图
            var level_two_name = "";
            var level_two_id = "";
            if (data.implementationsecondary) {
              this.deptInfo.forEach((item) => {
                if (
                  item.deptId == data.implementationsecondary ||
                  item.deptName == data.implementationsecondary
                ) {
                  level_two_name = item.deptName;
                  level_two_id = item.deptId;
                }
              });
            } else {
              level_two_name = "";
              level_two_id = "";
            }
            var prostartdate = new Date(
              data.projectstartdate.replace(/\-/g, "/")
            );
            var proenddate = new Date(data.projectenddate.replace(/\-/g, "/"));
            if (prostartdate >= proenddate) {
              alert("项目预计开始时间不能大于项目预计结束时间！");
              this.disabled = false;
              this.isSave = false;
              return false;
            }
            var keyword = "";
            var keytechnology = "";
            if (
              (that.$route.query.id != undefined &&
                that.$route.query.id != null) ||
              this.pId
            ) {
              if (this.userinfo.account_id == "8416498716893399290") {
                if (this.projectCodeList) {
                  keyword = this.projectCodeList.join(",");
                } else {
                  keyword = data.keyword;
                }
                if (keyword == "") {
                  this.warnMessage3();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }
              } else {
                if (this.keywordList) {
                  keyword = this.keywordList.join(",");
                } else {
                  keyword = data.keyword;
                }
                if (keyword == "") {
                  this.warnMessage();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }
              }
              if (this.keytechnologyList) {
                keytechnology = this.keytechnologyList.join(",");
              } else {
                keytechnology = data.keytechnology;
              }
              if (keytechnology == "") {
                this.warnMessage2();
                this.disabled = false;
                this.isSave = false;
                return;
              }
              var id = "";
              if (that.$route.query.id) {
                id = that.$route.query.id;
              } else {
                id = this.pId;
              }
              var projectNum = "";
              if (data.projectnumber) {
                projectNum = data.projectnumber;
              } else {
                projectNum = this.pNum;
              }
              //编辑
              var data = {
                id: id,
                project: {
                  name: data.projectname,
                  custom_field_values: {
                    16: data.customercenter,
                    17: data.contractmarket,
                    18: data.contractmoney,
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
                  },
                  parent_id: "",
                  description: "",
                  is_public: "1",
                  user_id: that.userinfo.memberid,
                  user_name: that.userinfo.emp_name,
                  company_name: that.userinfo.account_name,
                  company_id: that.userinfo.account_id,
                  level_one_name: that.userinfo.subdept_name,
                  level_one_id: that.userinfo.subdept_id,
                  level_two_name: level_two_name,
                  level_two_id: level_two_id,
                  sale_name: data.contractmarket,
                  sale_id: data.saleid,
                  project_no: projectNum,
                },
                child: 0,
                category: 1,
                account_name: that.userinfo.account_name,
                username: that.userinfo.login_name,
                workflow_type: 0, //0,商机项目  1，合同项目  2，子项目  3，非合同类项目
              };
            } else {
              //填写
              if (this.userinfo.account_id == "8416498716893399290") {
                if (this.projectCodeList) {
                  keyword = this.projectCodeList.join(",");
                }
                if (keyword == "") {
                  this.warnMessage3();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }
              } else {
                if (this.keywordList) {
                  keyword = this.keywordList.join(",");
                }
                if (keyword == "") {
                  this.warnMessage();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }
              }
              if (this.keytechnologyList) {
                keytechnology = this.keytechnologyList.join(",");
              }
              if (keytechnology == "") {
                this.warnMessage2();
                this.disabled = false;
                this.isSave = false;
                return;
              }
              if (this.projectData.project_id == undefined) {
                this.projectData.project_id = "";
              }
              var data = {
                id: this.projectData.project_id,
                project: {
                  name: data.projectname,
                  custom_field_values: {
                    16: data.customercenter,
                    17: this.projectInfo.CONTRACTMARKETNUMBER,
                    18: data.contractmoney,
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
                    39: this.projectInfo.BUSINESSNUMBER,
                    41: data.businesssystem,
                    42: 1,
                    43: data.customerdepartment,
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
                  level_two_name: level_two_name,
                  level_two_id: level_two_id,
                  sale_name: data.contractmarket,
                  sale_id: this.projectInfo.CONTRACTMARKETNUMBER,
                  project_no: this.projectData.project_no,
                },
                child: 0,
                category: 1,
                account_name: this.userinfo.account_name,
                username: this.userinfo.login_name,
                workflow_type: 0, //0,商机项目  1，合同项目  2，子项目  3，非合同类项目
              };
            }
            submitOa("/sgpm/rest/api/integration/oa/flow", data)
              .then((res) => {
                // console.log(res);
                if (res.data.code == 200) {
                  this.disabled = true;
                  this.isSave = true;
                  alert("提交成功!");
                  // var params = {
                  //   projectId: res.data.data.project_id
                  // };
                  //判断是否可以提交
                  // updateDate("/sgpm/rest/api/server/pm/project", params)
                  //   .then(res => {
                  //     if (res.data.code == 200) {
                  //       if (res.data.data.processId != null) {
                  //         this.disabled = true;
                  //       } else {
                  //         this.disabled = false;
                  //       }
                  //     }
                  //   })
                  //   .catch(err => {
                  //     console.log(err);
                  //   });
                  this.$router.push({
                    path: "audititem",
                  });
                } else if (res.data.code == 501) {
                  this.disabled = false;
                  this.isSave = false;
                  this.pId = res.data.data.project_id;
                  this.pNum = res.data.data.project_no;
                  alert("提交失败!");
                  // alert("提交失败，可从待发流程列表中编辑该流程重新发起!");
                  // this.$router.push({
                  // 	path: "audititem"
                  // });
                } else {
                  this.disabled = false;
                  this.isSave = false;
                  alert("提交失败!");
                }
              })
              .catch((err) => {
                console.log(err);
                this.disabled = false;
                this.isSave = false;
                alert("提交失败!");
              });
          } else if (
            this.userinfo.account_id == "-1814768306395265967" ||
            this.userinfo.account_id == "7638091599462351621"
          ) {
            //国图
            var prostartdate = new Date(
              data.expectprojectstartdate.replace(/\-/g, "/")
            );
            var proenddate = new Date(
              data.expectprojectenddate.replace(/\-/g, "/")
            );
            if (prostartdate >= proenddate) {
              alert("项目预计开始时间不能大于项目预计结束时间！");
              this.disabled = false;
              this.isSave = false;
              return false;
            }
            var tableDataInfo = JSON.parse(
              localStorage.getItem("tableDataInfo")
            );
            if (tableDataInfo) {
              var dateArr = {
                auditStatus: 10,
                workflowId: "",
                jumpType: 1,
              };
              tableDataInfo = tableDataInfo.map((item) => {
                return Object.assign(item, dateArr);
              });
            }
            if (tableDataInfo) {
              tableDataInfo = tableDataInfo;
            } else {
              tableDataInfo = JSON.parse(
                localStorage.getItem("gtProjectSplit")
              );
            }
            var quanzhong = [];
            var money = [];
            if (tableDataInfo) {
              var quanzhongAdd = "";
              var moneyAdd = "";
              for (var i = 0; i < tableDataInfo.length; i++) {
                tableDataInfo[i]["jumpType"] = 1;

                if (tableDataInfo.length == 1) {
                  quanzhong.push(tableDataInfo[0].milestoneWeight);
                  quanzhongAdd = tableDataInfo[0].milestoneWeight;
                } else if (
                  tableDataInfo[i].milestoneWeight != "" &&
                  tableDataInfo[i].milestoneWeight != undefined
                ) {
                  quanzhong.push(tableDataInfo[i].milestoneWeight);
                  quanzhongAdd = eval(quanzhong.join("+"));
                }
                if (tableDataInfo.length == 1) {
                  money.push(tableDataInfo[0].expectContributions);
                  moneyAdd = tableDataInfo[0].expectContributions;
                } else if (
                  tableDataInfo[i].expectContributions != "" &&
                  tableDataInfo[i].expectContributions != undefined
                ) {
                  money.push(tableDataInfo[i].expectContributions);
                  moneyAdd = eval(money.join("+"));
                }
              }
            }
            if (moneyAdd) {
              moneyAdd = that.keepTwoDecimalFull(moneyAdd);
              console.log(that.keepTwoDecimalFull(moneyAdd));
            }
            if (
              moneyAdd != that.keepTwoDecimalFull(data.expectcontractamount) &&
              tableDataInfo
            ) {
              alert("合同额(经费)必须等于预计合同额!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else if (quanzhongAdd > 100 && tableDataInfo) {
              alert("所有项目进度权重不能大于100%!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else if (quanzhongAdd == 0 && tableDataInfo) {
              alert("所有项目进度权重不能为0%!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else if (quanzhongAdd != 100 && tableDataInfo) {
              alert("所有项目进度权重必须等于100%!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else {
              if (
                (that.$route.query.id != undefined &&
                  that.$route.query.id != null) ||
                this.pId
              ) {
                //编辑
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                } else {
                  keytechnology = data.keytechnology;
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }
                var saleClassUnitBId = "";
                if (this.marketInfo.subdept_id) {
                  saleClassUnitBId = this.marketInfo.subdept_id;
                } else {
                  saleClassUnitBId = this.marketInfo.saleClassUnitBId;
                }
                var projectSaleId = "";
                if (this.marketInfo.memberid) {
                  projectSaleId = this.marketInfo.memberid;
                } else {
                  projectSaleId = this.marketInfo.projectSaleId;
                }
                var saleClassUnitCId = "";
                if (this.marketInfo.dept_id) {
                  saleClassUnitCId = this.marketInfo.dept_id;
                } else {
                  saleClassUnitCId = this.marketInfo.saleClassUnitCId;
                }
                var id = "";
                if (that.$route.query.id) {
                  id = that.$route.query.id;
                } else {
                  id = this.pId;
                }
                var projectNum = "";
                if (data.projectnumber) {
                  projectNum = data.projectnumber;
                } else {
                  projectNum = this.pNum;
                }
                var data = {
                  id: id,
                  projectName: data.projectname,
                  projectNumber: projectNum,
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: projectSaleId,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  classUnitCId: this.userinfo.dept_id,
                  classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: saleClassUnitBId,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  saleClassUnitCId: saleClassUnitCId,
                  saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: data.contractnumber,
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  professionalWorkTypes: data.professionalworktypes,
                  projectChildType: data.projectchildtype || "",
                  userName: this.userinfo.login_name,
                  projects: tableDataInfo,
                };
              } else {
                //填写
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }

                if (!tableDataInfo) {
                  tableDataInfo = [
                    {
                      projectContent: data.contractcontent,
                      projectLevel: data.contractprojectlevel,
                      projectManagerName: this.userinfo.emp_name,
                      classUnitBName: this.userinfo.subdept_name,
                      projectNumber: "",
                      projectType: data.contractprojecttype,
                      classUnitCId: this.userinfo.dept_id,
                      classUnitBId: this.userinfo.subdept_id,
                      expectContributions: data.expectcontractamount,
                      professionalWorkTypes: data.professionalworktypes,
                      milestoneWeight: 100,
                      classUnitCName: this.userinfo.dept_name,
                      auditStatus: 10,
                      projectManagerId: this.userinfo.memberid,
                      projectName: data.projectname,
                      projectChildType: data.projectchildtype || "",
                      workflowId: "",
                      jumpType: 1,
                    },
                  ];
                }
                console.log(tableDataInfo);
                console.log(data);
                var data = {
                  id: this.projectData.project_id,
                  projectName: data.projectname,
                  projectNumber: "",
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: this.marketInfo.memberid,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  classUnitCId: this.userinfo.dept_id,
                  classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: this.marketInfo.subdept_id,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  saleClassUnitCId: this.marketInfo.dept_id,
                  saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: "",
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  userName: this.userinfo.login_name,
                  professionalWorkTypes: data.professionalworktypes,
                  projectChildType: data.projectchildtype || "",
                  projects: tableDataInfo,
                };
              }
            }
            console.log(data);
            submitOa("/sgpm/rest/api/integration/oa/gt/workflow", data)
              .then((res) => {
                console.log(res);
                if (res.data.code == 200) {
                  alert("提交成功!");
                  this.disabled = true;
                  this.isSave = true;
                  this.$router.push({
                    path: "audititem",
                  });
                } else if (res.data.code == 501) {
                  alert("提交失败!");
                  this.disabled = false;
                  this.isSave = false;
                  this.pId = res.data.data.id;
                  this.pNum = res.data.data.projectNumber;
                } else {
                  alert("提交失败!");
                  this.disabled = false;
                  this.isSave = false;
                }
              })
              .catch((err) => {
                console.log(err);
                alert("提交失败!");
                this.disabled = false;
                this.isSave = false;
              });
          } else if (this.userinfo.account_id == "8416498716893399290") {
            //南康
            var prostartdate = new Date(
              data.expectprojectstartdate.replace(/\-/g, "/")
            );
            var proenddate = new Date(
              data.expectprojectenddate.replace(/\-/g, "/")
            );
            if (prostartdate >= proenddate) {
              alert("项目预计开始时间不能大于项目预计结束时间！");
              this.disabled = false;
              this.isSave = false;
              return false;
            }
            var tableDataInfo = JSON.parse(
              localStorage.getItem("tableDataInfo")
            );
            if (tableDataInfo) {
              var dateArr = {
                auditStatus: 10,
                workflowId: "",
                jumpType: 1,
              };
              tableDataInfo = tableDataInfo.map((item) => {
                return Object.assign(item, dateArr);
              });
            }
            if (tableDataInfo) {
              tableDataInfo = tableDataInfo;
            } else {
              tableDataInfo = JSON.parse(localStorage.getItem("projectSplit"));
            }
            var quanzhong = [];
            var money = [];
            if (tableDataInfo) {
              var quanzhongAdd = "";
              var moneyAdd = "";
              for (var i = 0; i < tableDataInfo.length; i++) {
                tableDataInfo[i]["jumpType"] = 1;

                if (tableDataInfo.length == 1) {
                  quanzhong.push(tableDataInfo[0].milestoneWeight);
                  quanzhongAdd = tableDataInfo[0].milestoneWeight;
                } else if (
                  tableDataInfo[i].milestoneWeight != "" &&
                  tableDataInfo[i].milestoneWeight != undefined
                ) {
                  quanzhong.push(tableDataInfo[i].milestoneWeight);
                  quanzhongAdd = eval(quanzhong.join("+"));
                }
                if (tableDataInfo.length == 1) {
                  money.push(tableDataInfo[0].expectContributions);
                  moneyAdd = tableDataInfo[0].expectContributions;
                } else if (
                  tableDataInfo[i].expectContributions != "" &&
                  tableDataInfo[i].expectContributions != undefined
                ) {
                  money.push(tableDataInfo[i].expectContributions);
                  moneyAdd = eval(money.join("+"));
                }
              }
            }
            if (moneyAdd) {
              moneyAdd = that.keepTwoDecimalFull(moneyAdd);
              console.log(that.keepTwoDecimalFull(moneyAdd));
            }
            if (
              moneyAdd != that.keepTwoDecimalFull(data.expectcontractamount) &&
              tableDataInfo
            ) {
              alert("合同额(经费)必须等于预计合同额!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else if (quanzhongAdd > 100 && tableDataInfo) {
              alert("所有项目进度权重不能大于100%!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else if (quanzhongAdd == 0 && tableDataInfo) {
              alert("所有项目进度权重不能为0%!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else if (quanzhongAdd != 100 && tableDataInfo) {
              alert("所有项目进度权重必须等于100%!");
              this.disabled = false;
              this.isSave = false;
              return;
            } else {
              if (
                (that.$route.query.id != undefined &&
                  that.$route.query.id != null) ||
                this.pId
              ) {
                //编辑
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                } else {
                  keytechnology = data.keytechnology;
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }
                var saleClassUnitBId = "";
                if (this.marketInfo.subdept_id) {
                  saleClassUnitBId = this.marketInfo.subdept_id;
                } else {
                  saleClassUnitBId = this.marketInfo.saleClassUnitBId;
                }
                var projectSaleId = "";
                if (this.marketInfo.memberid) {
                  projectSaleId = this.marketInfo.memberid;
                } else {
                  projectSaleId = this.marketInfo.projectSaleId;
                }
                var saleClassUnitCId = "";
                if (this.marketInfo.dept_id) {
                  saleClassUnitCId = this.marketInfo.dept_id;
                } else {
                  saleClassUnitCId = this.marketInfo.saleClassUnitCId;
                }
                var id = "";
                if (that.$route.query.id) {
                  id = that.$route.query.id;
                } else {
                  id = this.pId;
                }
                var projectNum = "";
                if (data.projectnumber) {
                  projectNum = data.projectnumber;
                } else {
                  projectNum = this.pNum;
                }
                var data = {
                  id: id,
                  projectName: data.projectname,
                  projectNumber: projectNum,
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: projectSaleId,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  // classUnitCId: this.userinfo.dept_id,
                  // classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: saleClassUnitBId,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  // saleClassUnitCId: saleClassUnitCId,
                  // saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: data.contractnumber,
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  userName: this.userinfo.login_name,
                  projects: tableDataInfo,
                };
              } else {
                //填写
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.disabled = false;
                    this.isSave = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.disabled = false;
                  this.isSave = false;
                  return;
                }

                if (!tableDataInfo) {
                  tableDataInfo = [
                    {
                      projectContent: data.contractcontent,
                      projectLevel: data.contractprojectlevel,
                      projectManagerName: this.userinfo.emp_name,
                      classUnitBName: this.userinfo.subdept_name,
                      projectNumber: "",
                      projectType: data.contractprojecttype,
                      // classUnitCId: this.userinfo.dept_id,
                      classUnitBId: this.userinfo.subdept_id,
                      expectContributions: data.expectcontractamount,
                      milestoneWeight: 100,
                      // classUnitCName: this.userinfo.dept_name,
                      auditStatus: 10,
                      projectManagerId: this.userinfo.memberid,
                      projectName: data.projectname,
                      workflowId: "",
                      jumpType: 1,
                    },
                  ];
                }
                console.log(tableDataInfo);
                console.log(data);
                var data = {
                  id: "",
                  projectName: data.projectname,
                  projectNumber: "",
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: this.marketInfo.memberid,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  // classUnitCId: this.userinfo.dept_id,
                  // classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: this.marketInfo.subdept_id,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  // saleClassUnitCId: this.marketInfo.dept_id,
                  // saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: "",
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  userName: this.userinfo.login_name,
                  projects: tableDataInfo,
                };
              }
            }
            console.log(data);
            submitOa("/sgpm/rest/api/integration/oa/nk/workflow", data)
              .then((res) => {
                console.log(res);
                if (res.data.code == 200) {
                  alert("提交成功!");
                  this.disabled = true;
                  this.isSave = true;
                  this.$router.push({
                    path: "audititem",
                  });
                } else if (res.data.code == 501) {
                  alert("提交失败!");
                  this.disabled = false;
                  this.isSave = false;
                  this.pId = res.data.data.id;
                  this.pNum = res.data.data.projectNumber;
                } else {
                  alert("提交失败!");
                  this.isSave = false;
                  this.disabled = false;
                }
              })
              .catch((err) => {
                console.log(err);
                alert("提交失败!");
                this.disabled = false;
                this.isSave = false;
              });
          }
        })
        .catch((e) => {
          // 数据校验失败
          console.log(e);
          this.disabled = false;
          this.isSave = false;
        });
    },

    //保存
    saveDate() {
      this.isSave = true;
      this.disabled = true;
      var dateArr = {
        auditStatus: 10,
        workflowId: "",
        jumpType: 1,
      };
      console.log(localStorage.getItem("projectSplit"));
      var tableDataInfo = JSON.parse(localStorage.getItem("quanzhongDate"));
      if (tableDataInfo) {
        tableDataInfo = tableDataInfo.map((item) => {
          return Object.assign(item, dateArr);
        });
      }
      console.log(tableDataInfo);

      var that = this;
      this.$refs.generateForm
        .getData()
        .then((data) => {
          if (
            this.userinfo.account_id == "-1360422574114386809" ||
            this.userinfo.account_id == "5326994013938795629"
          ) {
            //超图
            var level_two_name = "";
            var level_two_id = "";
            if (data.implementationsecondary) {
              this.deptInfo.forEach((item) => {
                if (
                  item.deptId == data.implementationsecondary ||
                  item.deptName == data.implementationsecondary
                ) {
                  level_two_name = item.deptName;
                  level_two_id = item.deptId;
                }
              });
            } else {
              level_two_name = "";
              level_two_id = "";
            }
            var prostartdate = new Date(
              data.projectstartdate.replace(/\-/g, "/")
            );
            var proenddate = new Date(data.projectenddate.replace(/\-/g, "/"));
            if (prostartdate >= proenddate) {
              alert("项目预计开始时间不能大于项目预计结束时间！");
              this.isSave = false;
              this.disabled = false;
              return false;
            }
            var keyword = "";
            var keytechnology = "";
            if (
              (that.$route.query.id != undefined &&
                that.$route.query.id != null) ||
              this.pId
            ) {
              //编辑
              if (this.userinfo.account_id == "8416498716893399290") {
                if (this.projectCodeList) {
                  keyword = this.projectCodeList.join(",");
                } else {
                  keyword = data.keyword;
                }
                if (keyword == "") {
                  this.warnMessage3();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
              } else {
                if (this.keywordList) {
                  keyword = this.keywordList.join(",");
                } else {
                  keyword = data.keyword;
                }
                if (keyword == "") {
                  this.warnMessage();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
              }

              if (this.keytechnologyList) {
                keytechnology = this.keytechnologyList.join(",");
              } else {
                keytechnology = data.keytechnology;
              }
              if (keytechnology == "") {
                this.warnMessage2();
                this.isSave = false;
                this.disabled = false;
                return;
              }
              var id = "";
              if (that.$route.query.id) {
                id = that.$route.query.id;
              } else {
                id = this.pId;
              }
              var projectNum = "";
              if (data.projectnumber) {
                projectNum = data.projectnumber;
              } else {
                projectNum = this.pNum;
              }
              var data = {
                id: id,
                project: {
                  name: data.projectname,
                  custom_field_values: {
                    16: data.customercenter,
                    17: data.contractmarket,
                    18: data.contractmoney,
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
                  },
                  parent_id: "",
                  description: "",
                  is_public: "1",
                  user_id: that.userinfo.memberid,
                  user_name: that.userinfo.emp_name,
                  company_name: that.userinfo.account_name,
                  company_id: that.userinfo.account_id,
                  level_one_name: that.userinfo.subdept_name,
                  level_one_id: that.userinfo.subdept_id,
                  level_two_name: level_two_name,
                  level_two_id: level_two_id,
                  sale_name: data.contractmarket,
                  sale_id: data.saleid,
                  project_no: projectNum,
                },
                child: 0,
                category: 1,
                account_name: that.userinfo.account_name,
              };
            } else {
              //填写
              if (this.userinfo.account_id == "8416498716893399290") {
                if (this.projectCodeList) {
                  keyword = this.projectCodeList.join(",");
                }
                if (keyword == "") {
                  this.warnMessage3();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
              } else {
                if (this.keywordList) {
                  keyword = this.keywordList.join(",");
                }
                if (keyword == "") {
                  this.warnMessage();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
              }
              if (this.keytechnologyList) {
                keytechnology = this.keytechnologyList.join(",");
              }
              if (keytechnology == "") {
                this.warnMessage2();
                this.isSave = false;
                this.disabled = false;
                return;
              }
              if (this.projectData.project_id == undefined) {
                this.projectData.project_id = "";
              }
              console.log(this.projectInfo);
              var data = {
                id: this.projectData.project_id,
                project: {
                  name: data.projectname,
                  custom_field_values: {
                    16: data.customercenter,
                    17: data.contractmarket,
                    18: data.contractmoney,
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
                    39: this.projectInfo.BUSINESSNUMBER,
                    41: data.businesssystem,
                    42: 1,
                    43: data.customerdepartment,
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
                  level_two_name: level_two_name,
                  level_two_id: level_two_id,
                  sale_name: data.contractmarket,
                  sale_id: this.projectInfo.CONTRACTMARKETNUMBER,
                  project_no: this.projectData.project_no,
                },
                child: 0,
                category: 1,
                account_name: this.userinfo.account_name,
              };
            }
            saveDate("/sgpm/rest/api/server/pm/project", data)
              .then((res) => {
                // console.log(res);
                if (res.data.code == 200) {
                  alert("保存成功!");
                  this.isSave = false;
                  this.disabled = false;
                  var data = res.data.data;
                  this.pId = res.data.data.project_id;
                  this.pNum = res.data.data.project_no;
                  this.projectData = data;
                  var project_no = data.project_no;
                  var jsonList = this.jsonData.list;
                  for (var i = 0; i < jsonList.length; i++) {
                    for (var j = 0; j < jsonList[i].columns.length; j++) {
                      for (
                        var q = 0;
                        q < jsonList[i].columns[j].list.length;
                        q++
                      ) {
                        if (
                          jsonList[i].columns[j].list[q].model ==
                          "projectnumber"
                        ) {
                          jsonList[i].columns[j].list[q].options.placeholder =
                            res.data.data.value;
                        }
                      }
                    }
                  }
                } else {
                  alert("保存失败!");
                  this.isSave = false;
                  this.disabled = false;
                }
              })
              .catch((err) => {
                console.log(err);
                alert("保存失败!");
                this.isSave = false;
                this.disabled = false;
              });
          } else if (
            this.userinfo.account_id == "-1814768306395265967" ||
            this.userinfo.account_id == "7638091599462351621"
          ) {
            //国图
            var prostartdate = new Date(
              data.expectprojectstartdate.replace(/\-/g, "/")
            );
            var proenddate = new Date(
              data.expectprojectenddate.replace(/\-/g, "/")
            );
            if (prostartdate >= proenddate) {
              alert("项目预计开始时间不能大于项目预计结束时间！");
              this.isSave = false;
              this.disabled = false;
              return false;
            }
            var keyword = "";
            var keytechnology = "";
            var gtprojectId = localStorage.getItem("gtprojectId");
            if (tableDataInfo) {
              tableDataInfo = tableDataInfo;
            } else {
              tableDataInfo =
                JSON.parse(localStorage.getItem("projectSplit")) ||
                JSON.parse(localStorage.getItem("gtProjectSplit"));
            }
            var quanzhong = [];
            var money = [];
            if (tableDataInfo) {
              var quanzhongAdd = "";
              var moneyAdd = "";
              for (var i = 0; i < tableDataInfo.length; i++) {
                if (tableDataInfo.length == 1) {
                  quanzhong.push(tableDataInfo[0].milestoneWeight);
                  quanzhongAdd = tableDataInfo[0].milestoneWeight;
                } else if (
                  tableDataInfo[i].milestoneWeight != "" &&
                  tableDataInfo[i].milestoneWeight != undefined
                ) {
                  quanzhong.push(tableDataInfo[i].milestoneWeight);
                  quanzhongAdd = eval(quanzhong.join("+"));
                }
                if (tableDataInfo.length == 1) {
                  money.push(tableDataInfo[0].expectContributions);
                  moneyAdd = tableDataInfo[0].expectContributions;
                } else if (
                  tableDataInfo[i].expectContributions != "" &&
                  tableDataInfo[i].expectContributions != undefined
                ) {
                  money.push(tableDataInfo[i].expectContributions);
                  moneyAdd = eval(money.join("+"));
                }
              }
            }
            if (moneyAdd) {
              moneyAdd = that.keepTwoDecimalFull(moneyAdd);
              console.log(that.keepTwoDecimalFull(moneyAdd));
            }
            if (
              moneyAdd != that.keepTwoDecimalFull(data.expectcontractamount) &&
              tableDataInfo
            ) {
              alert("合同额(经费)必须等于预计合同额!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else if (quanzhongAdd > 100 && tableDataInfo) {
              alert("所有项目进度权重不能大于100%!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else if (quanzhongAdd == 0 && tableDataInfo) {
              alert("所有项目进度权重不能为0%!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else if (quanzhongAdd != 100 && tableDataInfo) {
              alert("所有项目进度权重必须等于100%!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else {
              if (
                (that.$route.query.id != undefined &&
                  that.$route.query.id != null) ||
                gtprojectId
              ) {
                //编辑
                var id = "";
                if (that.$route.query.id) {
                  id = that.$route.query.id;
                } else if (gtprojectId) {
                  id = gtprojectId;
                }
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  } else if (data.keyword) {
                    keyword = data.keyword;
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  } else if (data.keyword) {
                    keyword = data.keyword;
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                } else {
                  keytechnology = data.keytechnology;
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
                var saleClassUnitBId = "";
                if (this.marketInfo.subdept_id) {
                  saleClassUnitBId = this.marketInfo.subdept_id;
                } else {
                  saleClassUnitBId = this.marketInfo.saleClassUnitBId;
                }
                var projectSaleId = "";
                if (this.marketInfo.memberid) {
                  projectSaleId = this.marketInfo.memberid;
                } else {
                  projectSaleId = this.marketInfo.projectSaleId;
                }
                var saleClassUnitCId = "";
                if (this.marketInfo.dept_id) {
                  saleClassUnitCId = this.marketInfo.dept_id;
                } else {
                  saleClassUnitCId = this.marketInfo.saleClassUnitCId;
                }
                var projectnumber = "";
                if (data.projectnumber) {
                  projectnumber = data.projectnumber;
                } else {
                  projectnumber = localStorage.getItem("pNumber");
                }
                var data = {
                  id: id,
                  projectName: data.projectname,
                  projectNumber: projectnumber,
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: projectSaleId,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  classUnitCId: this.userinfo.dept_id,
                  classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: saleClassUnitBId,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  saleClassUnitCId: saleClassUnitCId,
                  saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: "",
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  professionalWorkTypes: data.professionalworktypes,
                  projectChildType: data.projectchildtype || "",
                  projects: tableDataInfo,
                };
                console.log(data);
              } else {
                //填写
                console.log(data);
                if (!tableDataInfo) {
                  tableDataInfo = [
                    {
                      projectContent: data.contractcontent,
                      projectLevel: data.contractprojectlevel,
                      projectManagerName: this.userinfo.emp_name,
                      classUnitBName: this.userinfo.subdept_name,
                      projectNumber: "",
                      projectType: data.contractprojecttype,
                      classUnitCId: this.userinfo.dept_id,
                      classUnitBId: this.userinfo.subdept_id,
                      expectContributions: data.expectcontractamount,
                      professionalWorkTypes: data.professionalworktypes,
                      milestoneWeight: 100,
                      classUnitCName: this.userinfo.dept_name,
                      auditStatus: 10,
                      projectManagerId: this.userinfo.memberid,
                      projectName: data.projectname,
                      projectChildType: data.projectchildtype || "",
                      workflowId: "",
                      jumpType: 1,
                    },
                  ];
                }
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
                var data = {
                  id: this.projectData.project_id,
                  projectName: data.projectname,
                  projectNumber: "",
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: this.marketInfo.memberid,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  classUnitCId: this.userinfo.dept_id,
                  classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: this.marketInfo.subdept_id,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  saleClassUnitCId: this.marketInfo.dept_id,
                  saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: "",
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  professionalWorkTypes: data.professionalworktypes,
                  projectChildType: data.projectchildtype || "",
                  projects: tableDataInfo,
                };
              }
            }
            saveDate("/sgpm/rest/api/server/pm/gt/project", data)
              .then((res) => {
                console.log(res);
                if (res.data.code == 200) {
                  alert("保存成功!");
                  var projectSplitContent = res.data.data.projects;
                  console.log(projectSplitContent);
                  for (var i = 0; i < projectSplitContent.length; i++) {
                    projectSplitContent[i].expectContributions =
                      projectSplitContent[i].expectContributions / 10000;
                  }
                  this.pId = res.data.data.id;
                  this.pNum = res.data.data.projectNumber;
                  this.isSave = false;
                  this.disabled = false;
                  localStorage.removeItem("gtprojectId");
                  localStorage.removeItem("gtProjectSplit");
                  localStorage.removeItem("tableDataInfo");
                  localStorage.setItem("gtprojectId", res.data.data.id);
                  localStorage.setItem(
                    "gtProjectSplit",
                    JSON.stringify(res.data.data.projects)
                  );
                  Bus.$emit(
                    "gtProjectSplit",
                    JSON.stringify(res.data.data.projects)
                  );
                } else {
                  alert("保存失败!");
                  this.isSave = false;
                  this.disabled = false;
                }
              })
              .catch((err) => {
                console.log(err);
                alert("保存失败!");
                this.isSave = false;
                this.disabled = false;
              });
          } else if (this.userinfo.account_id == "8416498716893399290") {
            //南康
            var prostartdate = new Date(
              data.expectprojectstartdate.replace(/\-/g, "/")
            );
            var proenddate = new Date(
              data.expectprojectenddate.replace(/\-/g, "/")
            );
            if (prostartdate >= proenddate) {
              alert("项目预计开始时间不能大于项目预计结束时间！");
              this.isSave = false;
              this.disabled = false;
              return false;
            } else if (this.marketInfo.saleClassUnitBId == "") {
              alert("请输入项目销售");
              this.isSave = false;
              this.disabled = false;
              return false;
            }
            var keyword = "";
            var keytechnology = "";
            var gtprojectId = localStorage.getItem("gtprojectId");
            if (tableDataInfo) {
              tableDataInfo = tableDataInfo;
            } else {
              tableDataInfo =
                JSON.parse(localStorage.getItem("projectSplit")) ||
                JSON.parse(localStorage.getItem("gtProjectSplit"));
            }
            var quanzhong = [];
            var money = [];
            if (tableDataInfo) {
              var quanzhongAdd = "";
              var moneyAdd = "";
              for (var i = 0; i < tableDataInfo.length; i++) {
                if (tableDataInfo.length == 1) {
                  quanzhong.push(tableDataInfo[0].milestoneWeight);
                  quanzhongAdd = tableDataInfo[0].milestoneWeight;
                } else if (
                  tableDataInfo[i].milestoneWeight != "" &&
                  tableDataInfo[i].milestoneWeight != undefined
                ) {
                  quanzhong.push(tableDataInfo[i].milestoneWeight);
                  quanzhongAdd = eval(quanzhong.join("+"));
                }
                if (tableDataInfo.length == 1) {
                  money.push(tableDataInfo[0].expectContributions);
                  moneyAdd = tableDataInfo[0].expectContributions;
                } else if (
                  tableDataInfo[i].expectContributions != "" &&
                  tableDataInfo[i].expectContributions != undefined
                ) {
                  money.push(tableDataInfo[i].expectContributions);
                  moneyAdd = eval(money.join("+"));
                }
              }
            }
            if (moneyAdd) {
              moneyAdd = that.keepTwoDecimalFull(moneyAdd);
              console.log(that.keepTwoDecimalFull(moneyAdd));
            }
            if (
              moneyAdd != that.keepTwoDecimalFull(data.expectcontractamount) &&
              tableDataInfo
            ) {
              alert("合同额(经费)必须等于预计合同额!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else if (quanzhongAdd > 100 && tableDataInfo) {
              alert("所有项目进度权重不能大于100%!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else if (quanzhongAdd == 0 && tableDataInfo) {
              alert("所有项目进度权重不能为0%!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else if (quanzhongAdd != 100 && tableDataInfo) {
              alert("所有项目进度权重必须等于100%!");
              this.isSave = false;
              this.disabled = false;
              return;
            } else {
              if (
                (that.$route.query.id != undefined &&
                  that.$route.query.id != null) ||
                gtprojectId
              ) {
                //编辑
                var id = "";
                if (that.$route.query.id) {
                  id = that.$route.query.id;
                } else if (gtprojectId) {
                  id = gtprojectId;
                }
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  } else if (data.keyword) {
                    keyword = data.keyword;
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  } else if (data.keyword) {
                    keyword = data.keyword;
                  } else {
                    keyword = data.projectkeyword;
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                } else {
                  keytechnology = data.keytechnology;
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
                var saleClassUnitBId = "";
                if (this.marketInfo.subdept_id) {
                  saleClassUnitBId = this.marketInfo.subdept_id;
                } else {
                  saleClassUnitBId = this.marketInfo.saleClassUnitBId;
                }
                var projectSaleId = "";
                if (this.marketInfo.memberid) {
                  projectSaleId = this.marketInfo.memberid;
                } else {
                  projectSaleId = this.marketInfo.projectSaleId;
                }
                var saleClassUnitCId = "";
                if (this.marketInfo.dept_id) {
                  saleClassUnitCId = this.marketInfo.dept_id;
                } else {
                  saleClassUnitCId = this.marketInfo.saleClassUnitCId;
                }
                var projectnumber = "";
                if (data.projectnumber) {
                  projectnumber = data.projectnumber;
                } else {
                  projectnumber = localStorage.getItem("pNumber");
                }
                var data = {
                  userName: this.userinfo.login_name,
                  id: id,
                  projectName: data.projectname,
                  projectNumber: projectnumber,
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: projectSaleId,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  // classUnitCId: this.userinfo.dept_id,
                  // classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: saleClassUnitBId,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  // saleClassUnitCId: saleClassUnitCId,
                  // saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: "",
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  projects: tableDataInfo,
                };
                console.log(data);
              } else {
                //填写
                console.log(data);
                if (!tableDataInfo) {
                  tableDataInfo = [
                    {
                      projectContent: data.contractcontent,
                      projectLevel: data.contractprojectlevel,
                      projectManagerName: this.userinfo.emp_name,
                      classUnitBName: this.userinfo.subdept_name,
                      projectNumber: "",
                      projectType: data.contractprojecttype,
                      // classUnitCId: this.userinfo.dept_id,
                      classUnitBId: this.userinfo.subdept_id,
                      expectContributions: data.expectcontractamount,
                      milestoneWeight: 100,
                      // classUnitCName: this.userinfo.dept_name,
                      auditStatus: 10,
                      projectManagerId: this.userinfo.memberid,
                      projectName: data.projectname,
                      workflowId: "",
                      jumpType: 1,
                    },
                  ];
                }
                if (this.userinfo.account_id == "8416498716893399290") {
                  if (this.projectCodeList) {
                    keyword = this.projectCodeList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage3();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                } else {
                  if (this.keywordList) {
                    keyword = this.keywordList.join(",");
                  }
                  if (keyword == "") {
                    this.warnMessage();
                    this.isSave = false;
                    this.disabled = false;
                    return;
                  }
                }
                if (this.keytechnologyList) {
                  keytechnology = this.keytechnologyList.join(",");
                }
                if (keytechnology == "") {
                  this.warnMessage2();
                  this.isSave = false;
                  this.disabled = false;
                  return;
                }
                var data = {
                  userName: this.userinfo.login_name,
                  id: this.projectData.project_id,
                  projectName: data.projectname,
                  projectNumber: "",
                  projectManagerId: this.userinfo.memberid,
                  projectManagerName: this.userinfo.emp_name,
                  projectSaleId: this.marketInfo.memberid,
                  projectSaleName: this.marketInfo.emp_name,
                  classUnitBId: this.userinfo.subdept_id,
                  classUnitBName: this.userinfo.subdept_name, //实施B级
                  // classUnitCId: this.userinfo.dept_id,
                  // classUnitCName: this.userinfo.dept_name, //实施C级
                  saleClassUnitBId: this.marketInfo.subdept_id,
                  saleClassUnitBName: this.marketInfo.subdept_name, //销售B级
                  // saleClassUnitCId: this.marketInfo.dept_id,
                  // saleClassUnitCName: this.marketInfo.dept_name, //销售C级
                  expectContractAmount: data.expectcontractamount,
                  expectContractSigningDate: data.expectcontractsigningdate,
                  expectProjectStartDate: data.expectprojectstartdate,
                  expectProjectEndDate: data.expectprojectenddate,
                  contractProjectType: data.contractprojecttype,
                  contractProjectLevel: data.contractprojectlevel,
                  projectKeyWord: keyword,
                  projectOperationalPeriod: data.projectoperationalperiod,
                  keyTechnology: keytechnology,
                  contractContent: data.contractcontent,
                  contractNumber: "",
                  accountId: this.userinfo.account_id,
                  accountName: this.userinfo.account_name,
                  projects: tableDataInfo,
                };
              }
              saveDate("/sgpm/rest/api/server/pm/nk/project", data)
                .then((res) => {
                  console.log(res);
                  if (res.data.code == 200) {
                    alert("保存成功!");
                    var projectSplitContent = res.data.data.projects;
                    console.log(projectSplitContent);
                    for (var i = 0; i < projectSplitContent.length; i++) {
                      projectSplitContent[i].expectContributions =
                        projectSplitContent[i].expectContributions / 10000;
                    }
                    var jsonList = this.jsonData.list;
                    for (var i = 0; i < jsonList.length; i++) {
                      for (var j = 0; j < jsonList[i].columns.length; j++) {
                        for (
                          var q = 0;
                          q < jsonList[i].columns[j].list.length;
                          q++
                        ) {
                          if (
                            jsonList[i].columns[j].list[q].model ==
                            "projectnumber"
                          ) {
                            jsonList[i].columns[j].list[q].options.placeholder =
                              res.data.data.projectNumber;
                          }
                        }
                      }
                    }
                    this.isSave = false;
                    this.disabled = false;
                    localStorage.removeItem("gtprojectId");
                    localStorage.removeItem("gtProjectSplit");
                    localStorage.removeItem("tableDataInfo");
                    localStorage.setItem("gtprojectId", res.data.data.id);
                    localStorage.setItem(
                      "gtProjectSplit",
                      JSON.stringify(res.data.data.projects)
                    );
                    Bus.$emit(
                      "gtProjectSplit",
                      JSON.stringify(res.data.data.projects)
                    );
                    this.pId = res.data.data.id;
                    this.pNum = res.data.data.projectNumber;
                  } else {
                    alert("保存失败!");
                    this.isSave = false;
                  }
                })
                .catch((err) => {
                  console.log(err);
                  alert("保存失败!");
                  this.isSave = false;
                  this.disabled = false;
                });
            }
          }
        })
        .catch((e) => {
          // 数据校验失败
          console.log(e);
          this.isSave = false;
          this.disabled = false;
        });
    },
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    },
  },
  //柴跃华 每个组件都要增加销毁前重置EventBus
  beforeDestroy() {
    Bus.$off();
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/common.css";

.projectview {
  overflow-y: auto;
}
.btns {
  text-align: center;
}

.back {
  text-align: left;
  margin-bottom: 0;
  cursor: pointer;

  .back-size {
    font-size: 17px;
  }
}
</style>
<style>
.busniess .el-form-item__error {
  left: 180px !important;
}
</style>
