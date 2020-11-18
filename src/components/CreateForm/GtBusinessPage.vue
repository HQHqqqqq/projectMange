<template>
  <!--国图  合同视图/合同信息/商机 页面-->
  <div class="tables" :style="{ maxHeight: browerHeight + 'px' }">
    <!--{{CONTRACTNUMBER}}-->
    <div style="">
      <div class="title" style="margin-bottom: -20px">商机信息</div>
      <div style="margin: 20px"></div>
      <el-divider></el-divider>

      <div>
        <div class="title_right width1">商机名称：</div>
        <div class="title_left">{{ b_BUSINESSNAME }}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 20px"></div>

      <div>
        <!--<div class="title_right width1">商机名称：</div>-->
        <!--<div class="title_left width2">{{b_BUSINESSNAME}}</div>-->
        <div class="title_right width1">商机编号：</div>
        <div class="title_left width2">{{ b_BUSINESSNUMBER }}</div>
        <div class="title_right width3">预计合同额(万元)：</div>
        <div class="title_left width4">{{ b_CONTRACTMONEY }}</div>
        <div class="title_right width5">销售B级单位：</div>
        <div class="title_left width6">{{ b_CUSTOMERCENTER }}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 20px"></div>

      <div>
        <div class="title_right width1">项目销售：</div>
        <div class="title_left width2">{{ b_CONTRACTMARKET }}</div>
        <div class="title_right width3"><span>行业：</span></div>
        <div class="title_left width4">
          <span>{{ b_INDUSTRY }}</span>
        </div>
        <div class="title_right width5">销售C级单位：</div>
        <div class="title_left width6">{{ b_CUSTOMERDEPARTMENT }}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 20px"></div>

      <div>
        <div class="title_right width1"><span>区域：</span></div>
        <div class="title_left width2">
          <span>{{ b_REGION }}</span>
        </div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 20px"></div>
    </div>
    <!--<div style="height: 20px;background: #ecf0f5"></div>-->
    <div style="margin: 20px"></div>

    <!--<div style="">-->
    <!--<div class="title">合同信息</div>-->
    <!--<div style="margin-right: 20px;margin-top:-30px;float: right">-->
    <!--&lt;!&ndash;<el-button type="primary" size="small" @click="dialogVisible = true" :disabled="contractStatus">关联合同</el-button>&ndash;&gt;-->
    <!--<el-button type="primary" size="small" @click="dialogVisible = true" :disabled="roleStatus == true? contractStatus : true">关联合同</el-button>-->
    <!--</div>-->
    <!--<div style="margin: 20px"></div>-->
    <!--<el-divider></el-divider>-->
    <!--<div>-->
    <!--<div class="title_right width1">合同名称：</div>-->
    <!--<div class="title_left">{{FIELD0005}}</div>-->
    <!--<div style="clear: left"></div>-->
    <!--</div>-->
    <!--<div style="margin: 20px"></div>-->
    <!--<div>-->
    <!--<div class="title_right width1">合同编号：</div>-->
    <!--<div class="title_left width2">{{CONTRACTNUMBER}}</div>-->
    <!--<div class="title_right width3"><span>合同额(万元)：</span></div>-->
    <!--<div class="title_left width4"><span>{{CONTRACTMONEY}}</span></div>-->
    <!--<div class="title_right width5">销售B级单位：</div>-->
    <!--<div class="title_left width6">{{CUSTOMERCENTER}}</div>-->
    <!--<div style="clear: left"></div>-->
    <!--</div>-->
    <!--<div style="margin: 20px"></div>-->
    <!--<div>-->
    <!--<div class="title_right width1">项目销售：</div>-->
    <!--<div class="title_left width2">{{CONTRACTMARKET}}</div>-->
    <!--<div class="title_right width3"><span>行业：</span></div>-->
    <!--<div class="title_left width4"><span>{{INDUSTRY}}</span></div>-->
    <!--<div class="title_right width5">销售C级单位：</div>-->
    <!--<div class="title_left width6">{{CUSTOMERDEPARTMENT}}</div>-->
    <!--<div style="clear: left"></div>-->
    <!--</div>-->
    <!--<div style="margin: 20px"></div>-->
    <!--<div>-->
    <!--<div class="title_right width1">区域：</div>-->
    <!--<div class="title_left width2">{{REGION}}</div>-->
    <!--<div class="title_right width3"><span>客户名称：</span></div>-->
    <!--<div class="title_left width4"><span>{{CUSTOMERNAME}}</span></div>-->
    <!--<div class="title_right width5">合同签订时间：</div>-->
    <!--<div class="title_left width6">{{CONTRACTSIGNINGDATE}}</div>-->
    <!--<div style="clear: left"></div>-->
    <!--</div>-->
    <!--<div style="margin: 20px"></div>-->
    <!--<div>-->
    <!--<div class="title_right width1"><span>归档状态：</span></div>-->
    <!--<div class="title_left width2"><span>{{FILESTATUS}}</span></div>-->
    <!--<div class="title_right width3">合同状态：</div>-->
    <!--<div class="title_left width4">{{CONTRACTSTATE}}</div>-->
    <!--<div style="clear: left"></div>-->
    <!--</div>-->
    <!--<div style="margin: 20px"></div>-->
    <!--</div>-->
    <!--<el-dialog-->
    <!--title="提示"-->
    <!--:visible.sync="dialogVisible"-->
    <!--width="30%">-->
    <!--<el-select v-model="contractNumber" placeholder="请选择" @change="selectChange(contractNumber)">-->
    <!--<el-option-->
    <!--v-for="item in contractDatas"-->
    <!--:key="item.contractNumber"-->
    <!--:label="item.contractName"-->
    <!--:value="item.contractNumber">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import { integrationGetMethod } from "../../api/api.js"; //
import { serverGetHttpMethod } from "../../api/api.js"; //
import { saveDate } from "../../api/api.js"; //
import Bus from "../../bus";

export default {
  name: "gt-business-page",
  data() {
    return {
      roleStatus: false, //根据权限控制按钮
      dialogVisible: false,
      contractDatas: [], //所有合同数据
      contractNumber: "", //合同编号
      projectData: {}, //项目信息
      contractStatus: false, //选择合同按钮状态
      browerHeight: window.innerHeight - 250,

      //合同数据
      CONTRACTNUMBER: "-",
      FIELD0005: "-",
      CONTRACTSIGNINGDATE: "-",
      CONTRACTMARKET: "-",
      CUSTOMERCENTER: "-",
      CUSTOMERDEPARTMENT: "-",

      CONTRACTPROSTARTDATE: "-",
      CONTRACTPROENDDATE: "-",
      CONTRACTSTATE: "-",
      CUSTOMERNAME: "-",
      INDUSTRY: "-",
      REGION: "-",

      FILESTATUS: "-",
      CONTRACTMONEY: "-",

      //商机数据
      b_BUSINESSNAME: "-",
      b_BUSINESSNUMBER: "-",
      b_CONTRACTMONEY: "-",

      b_CONTRACTMARKET: "-",
      b_CUSTOMERCENTER: "-",
      b_CUSTOMERDEPARTMENT: "-",

      b_INDUSTRY: "-",
      b_REGION: "-"
    };
  },

  //解决重复请求bug
  beforeDestroy() {
    Bus.$off("projectContent");
  },

  created() {
    // this.getContractDatas();
    // var projectId = localStorage.getItem("projectId");
    var businessNumber = localStorage.getItem("businessNumber");
    // var projectId = localStorage.getItem("projectId");
    // this.getProjectData(projectId); //获取项目信息  包含商机信息  初始化商机数据

    this.getBusinessData(businessNumber);

    // if(projectData.CONTRACTNUMBER){
    //   this.getContractData2(projectData.CONTRACTNUMBER) //获取合同信息
    // }
    // 切换项目后，更新商机信息
    // Bus.$on("projectContent", item => {
    //   if (item) {
    //     debugger
    //     console.log("======projectContent=====");
    //     console.log(item);
    //     this.getProjectData(item.id); //获取项目信息  包含商机信息，合同信息
    //   }
    // });
  },

  // 解决页面切换到里程碑后 再切换到项目信息页面时，切换项目不更新数据bug
  mounted() {
    Bus.$on("projectContent", item => {
      if (item) {
        // debugger
        // console.log("======projectContent=====");
        // console.log(item);
        // this.getProjectData(item.id); //获取项目信息  包含商机信息，合同信息
      }
    });

    Bus.$on("memberRole", item => {
      debugger;
      console.log("合同/商机 角色信息：" + item);
      if (item == 1 || item == 3) {
        this.roleStatus = true; //项目经理才能编辑
      } else {
        this.roleStatus = false;
      }
    });
  },

  methods: {
    // 选择合同时
    selectChange(contractNumber) {
      console.log(contractNumber);
      this.contractNumber = contractNumber;
      this.getContractData(contractNumber);
    },

    //更新合同信息
    updateContractData(data) {
      //处理数据为null的
      $.each(data, function(key, value) {
        if (data[key] == null) {
          data[key] = "-";
        }
      });
      this.CONTRACTNUMBER = data.CONTRACTNUMBER;
      this.FIELD0005 = data.FIELD0005;
      this.CONTRACTSIGNINGDATE = data.CONTRACTSIGNINGDATE;
      this.CONTRACTMARKET = data.CONTRACTMARKET;
      this.CUSTOMERCENTER = data.CUSTOMERCENTER;
      this.CUSTOMERDEPARTMENT = data.CUSTOMERDEPARTMENT;
      this.CONTRACTPROSTARTDATE = data.CONTRACTPROSTARTDATE;
      this.CONTRACTPROENDDATE = data.CONTRACTPROENDDATE;
      this.CONTRACTSTATE = data.CONTRACTSTATE;
      this.CUSTOMERNAME = data.CUSTOMERNAME;
      this.INDUSTRY = data.INDUSTRY;
      this.REGION = data.REGION;
      this.FILESTATUS = data.FILESTATUS;
      this.CONTRACTMONEY = data.CONTRACTMONEY;
    },

    //重置合同信息,合同信息不存在时重置
    resetContractData() {
      this.CONTRACTNUMBER = "-";
      this.FIELD0005 = "-";
      this.CONTRACTSIGNINGDATE = "-";
      this.CONTRACTMARKET = "-";
      this.CUSTOMERCENTER = "-";
      this.CUSTOMERDEPARTMENT = "-";
      this.CONTRACTPROSTARTDATE = "-";
      this.CONTRACTPROENDDATE = "-";
      this.CONTRACTSTATE = "-";
      this.CUSTOMERNAME = "-";
      this.INDUSTRY = "-";
      this.REGION = "-";
      this.FILESTATUS = "-";
      this.CONTRACTMONEY = "-";
    },

    //更新项目信息 合同编号
    updateProject(contractNumber) {
      var data = {
        id: this.projectData.ID,
        project: {
          custom_field_values: {
            13: contractNumber
          },
          project_no: this.projectData.PROJECTNUMBER
        }
      };

      // var data = {
      //   id: 78606,
      //   project: {
      //     custom_field_values: {
      //       13: "77777",
      //     },
      //     project_no: "XX-H-2019-0427"
      //   }
      // };
      saveDate("/sgpm/rest/api/server/pm/project", data)
        .then(res => {
          if (res.data.code == 200) {
            alert("保存成功!");
          } else if (res.data.code == 201) {
            alert("保存失败!");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取单个合同信息，并更新项目信息（选择合同时使用）
    getContractData(contractNumber) {
      // var url =
      //   "/sgpm/rest/api/integration/oa/contract/wanyuan/" + contractNumber;
      var url = `/sgpm/rest/api/integration/data/contract/${this.userinfo.account_id}?contractNumber=${contractNumber}`; //2020 1,9新
      integrationGetMethod(url)
        .then(res => {
          console.log("======单个==合同信息=======");
          console.log(res.data.data);
          this.updateContractData(res.data.data); //更新页面合同信息
          this.updateProject(contractNumber); //更新项目信息 合同编号
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取单个合同信息，不更新项目信息（切换项目时使用）
    // getContractData2(contractNumber) {
    //   var url = '/sgpm/rest/api/integration/oa/contract/wanyuan/' + contractNumber;
    //   integrationGetMethod(url).then(res => {
    //     console.log("======单个==合同信息===2====");
    //     console.log(res.data.data);
    //     this.updateContractData(res.data.data)//更新页面合同信息
    //   }).catch(err => {
    //     console.log(err)
    //   });
    // },

    //获取项目信息，根据项目id
    getProjectData(projectId) {
      var url = "/sgpm/rest/api/server/pm/project";
      var params = { projectId: projectId };
      serverGetHttpMethod(url, params)
        .then(res => {
          console.log("======项目信息=======");
          console.log(res.data.data);
          this.projectData = res.data.data;

          //更新商机信息
          if (res.data.data.BUSINESS) {
            var businessData = res.data.data.BUSINESS;
            this.updateBusinessData(businessData); //更新页面商机数据
          } else {
            this.resetBusinessData(); //重置页面商机数据
          }

          //更新页面合同信息
          if (res.data.data.CONTRACT) {
            this.updateContractData(res.data.data.CONTRACT); //更新页面合同信息
            //有合同编号时，不能再选择合同
            this.contractStatus = true;
          } else {
            this.resetContractData(); //重置合同信息
            this.contractStatus = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取商机信息  V2
    getBusinessData(businessNumber) {
      // if(businessNumber != null){
      var url =
        "/sgpm/rest/api/integration/oa/business/wanyuan/" + businessNumber;
      integrationGetMethod(url)
        .then(res => {
          console.log("=======商机信息========");
          console.log(res.data.data);
          if (res.data.data == null) {
            this.resetBusinessData();
          } else {
            this.updateBusinessData(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
      // }else{
      //   this.resetBusinessData();
      // }
    },

    //更新商机信息
    updateBusinessData(data) {
      console.log("=======更新商机信息======");
      //处理数据为null的
      $.each(data, function(key, value) {
        if (data[key] == null) {
          data[key] = "-";
        }
      });
      this.b_BUSINESSNAME = data.BUSINESSNAME;
      this.b_BUSINESSNUMBER = data.BUSINESSNUMBER;
      this.b_CONTRACTMONEY = data.CONTRACTMONEY;
      this.b_CONTRACTMARKET = data.CONTRACTMARKET;
      this.b_CUSTOMERCENTER = data.CUSTOMERCENTER;
      this.b_CUSTOMERDEPARTMENT = data.CUSTOMERDEPARTMENT;
      this.b_INDUSTRY = data.INDUSTRY;
      this.b_REGION = data.REGION;
    },

    //重置商机信息
    resetBusinessData() {
      console.log("=======重置商机信息======");
      this.b_BUSINESSNAME = "-";
      this.b_BUSINESSNUMBER = "-";
      this.b_CONTRACTMONEY = "-";
      this.b_CONTRACTMARKET = "-";
      this.b_CUSTOMERCENTER = "-";
      this.b_CUSTOMERDEPARTMENT = "-";
      this.b_INDUSTRY = "-";
      this.b_REGION = "-";
    },

    //获取所有合同信息
    getContractDatas() {
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      if (userinfo) {
        var memberid = userinfo.memberid;
      }
      // var url = '/sgpm/rest/api/integration/oa/contracts/7503529197009650726';
      // var url = '/sgpm/rest/api/integration/oa/contracts/' + memberid;
      var url = `/sgpm/rest/api/integration/data/contracts/${userinfo.account_id}?memberId=${memberid}`; //2020 1.9修改
      integrationGetMethod(url)
        .then(res => {
          console.log("========合同信息=======");
          console.log(res.data.data);
          this.contractDatas = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //将数字转为 金额格式
    formatThousands(value) {
      // return value
      value = value / 10000;
      value = value.toFixed(2); //万元单位 保留二位小数点

      var r = /^[0-9]*[1-9][0-9]*$/; //正整数
      if (r.test(value) == false) {
        return (
          value &&
          value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
          })
        );
      } else {
        var reg = /\d{1,3}(?=(\d{3})+$)/g;
        return (value + "").replace(reg, "$&,");
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 15px;
  text-align: center;
  font-weight: bold;
  color: #000;
}

.title_right {
  font-weight: bold;
  font-size: 14px;
  float: left;
  /*border: 1px solid red;*/
  text-align: right;
}

.title_left {
  font-size: 12px;
  float: left;
  /*border: 1px solid red;*/
  text-align: left;
}

.width1 {
  /*border: 1px solid red;*/
  width: 10%;
}

.width2 {
  width: 23%;
}

.width3 {
  /*border: 1px solid red;*/
  width: 17%;
}

.width4 {
  /*border: 1px solid red;*/
  width: 24%;
}

.width5 {
  /*border: 1px solid red;*/
  width: 11%;
}

.width6 {
  width: 15%;
}

.tables {
  overflow-y: auto;
  width: 100%;
}
</style>
