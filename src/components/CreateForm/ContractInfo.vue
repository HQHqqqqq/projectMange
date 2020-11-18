<template>
  <!--合同视图/合同信息/合同信息-->
  <div class="tables" :style="{maxHeight:browerHeight + 'px'}">

    <div style="">
      <div class="title" style="margin-bottom: -20px">合同信息</div>
      <el-divider></el-divider>
      <div>
        <div class="title_right width1">合同名称：</div>
        <div class="title_left">{{contractName}}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 15px"></div>
      <div>
        <div class="title_right width1">合同编号：</div>
        <div class="title_left width2">{{contractNumber}}</div>
        <div class="title_right width3"><span>合同额(万元)：</span></div>
        <div class="title_left width4"><span>{{contractMoneyWanYuan}}</span></div>
        <div class="title_right width5">销售B级单位：</div>
        <div class="title_left width6">{{saleLevelOneName}}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 15px"></div>
      <div>
        <div class="title_right width1">项目销售：</div>
        <div class="title_left width2">{{contractSaleName}}</div>
        <div class="title_right width3"><span>行业：</span></div>
        <div class="title_left width4"><span>{{industry}}</span></div>
        <div class="title_right width5">销售C级单位：</div>
        <div class="title_left width6">{{saleLevelTwoName}}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 15px"></div>
      <div>
        <div class="title_right width1">区域：</div>
        <div class="title_left width2">{{region}}</div>
        <div class="title_right width3"><span>客户名称：</span></div>
        <div class="title_left width4"><span>{{contractParty}}</span></div>
        <div class="title_right width5">合同签订时间：</div>
        <div class="title_left width6">{{contractSigningTime}}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 15px"></div>
      <div>
        <div class="title_right width1"><span>归档状态：</span></div>
        <div class="title_left width2"><span>{{archivingStatus}}</span></div>
        <div class="title_right width3">合同状态：</div>
        <div class="title_left width4">{{contractStatus}}</div>
        <div class="title_right width5">项目预计开始时间：</div>
        <div class="title_left width6">{{expectProjectStartDate}}</div>
        <div style="clear: left"></div>
      </div>
      <div style="margin: 15px"></div>

      <div>
        <div class="title_right width1"><span>项目运维期：</span></div>
        <div class="title_left width2"><span>{{projectOperationalPeriod}}</span></div>
        <div class="title_right width3">合同性质：</div>
        <div class="title_left width4">{{contractNative}}</div>
        <div class="title_right width5">项目预计结束时间：</div>
        <div class="title_left width6">{{expectProjectEndDate}}</div>
        <div style="clear: left"></div>
      </div>

      <div style="margin: 15px"></div>
      <div>
        <div class="title_right width1"><span>合同建设内容：</span></div>
        <div class="title_left">{{contractContent}}</div>
        <div style="clear: left"></div>
      </div>
    </div>

    <div class="title" style="margin-bottom: -20px">包含项目</div>
    <!--<div style="margin: 10px"></div>-->
    <el-divider></el-divider>
    <el-table :data="tableData" border
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'50px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}" :cell-style="{padding:0}" style="width: 100%">
      <el-table-column type="index" label="序号" width="35" align="center"></el-table-column>

      <el-table-column prop="projectNumber" align="center" label="项目编号" width="180">
      </el-table-column>
      <el-table-column prop="classUnitBName" align="center" label="实施B级单位" width="180">
      </el-table-column>
      <el-table-column prop="classUnitCName" align="center" label="实施C级单位">
      </el-table-column>

      <el-table-column prop="projectManagerName" align="center" label="实施项目经理">
      </el-table-column>

      <el-table-column prop="projectName" align="center" width="150" :show-overflow-tooltip="true" label="项目名称">
      </el-table-column>

      <el-table-column prop="milestoneWeight" align="center" width="150" label="项目占合同里程碑进度权重(%)">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { integrationGetMethod } from "../../api/api.js"; //
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
export default {
  name: "contract-info",
  data() {
    return {
      tableData: [],
      browerHeight: window.innerHeight - 150,

      //合同数据
      contractName: "-", //合同名称
      // contractNumber: 'SM-XS-FW-ZS-2015-9254', //合同编号
      // contractNumber: 'NJGT-XA-M-2016-303', //合同编号
      contractNumber: "-", //合同编号
      contractMoneyWanYuan: "-", //合同金额
      saleLevelOneName: "-", //销售B级单位
      contractSaleName: "-", //项目销售
      industry: "-", //行业
      saleLevelTwoName: "-", //销售C级单位
      region: "-",
      contractParty: "-", //客户名称
      contractSigningTime: "-", //合同签订时间
      archivingStatus: "-", //归档状态
      contractStatus: "-", //合同状态
      expectProjectStartDate: "-", //项目预计开始时间
      projectOperationalPeriod: "-", //项目运维期
      contractNative: "-", //合同性质
      expectProjectEndDate: "-", //项目预计结束时间
      contractContent: "-" //合同建设内容
    };
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ])
  },
  //解决重复请求bug
  beforeDestroy() {
    Bus.$off("projectContent");
  },

  created() {
    var contractNumber = localStorage.getItem("contractNumber");
    if (contractNumber) {
      this.contractNumber = contractNumber;
      this.getContractData(this.contractNumber);
    }
  },

  // 解决页面切换到里程碑后 再切换到项目信息页面时，切换项目不更新数据bug
  mounted() {
    // Bus.$on("projectContent", item => {
    //   if (item) {
    //     this.getProjectData(item.id); //获取项目信息  包含商机信息，合同信息
    //   }
    // });
  },

  methods: {
    //获取合同信息
    getContractData(contractNumber) {
      if (contractNumber) {
        // var url = '/sgpm/rest/api/integration/contract/' + contractNumber;
        var url = `/sgpm/rest/api/integration/contract/${contractNumber}?companyId=${this.userinfo.account_id}`;
        integrationGetMethod(url)
          .then(res => {
            console.log(res.data.data);
            //判断合同数据是否存
            if (this.checkData(res.data.data)) {
              this.updateContractData(res.data.data); //更新页面合同信息
            }
            //判断项目数据是否存在
            var status = this.checkData(res.data.data.element);
            if (status) {
              this.updateProjects(res.data.data); //更新项目信息
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //判断hash是否为空
    checkData(data) {
      for (var i in data) {
        return true;
      }
      return false;
    },

    //更新项目信息
    updateProjects(data) {
      data.element.projects.forEach(item => {
        if (item.milestoneWeight == null) {
          item.milestoneWeight = "-";
        }
      });
      this.tableData = data.element.projects;
    },

    //更新合同信息
    updateContractData(data) {
      //处理数据为null的
      $.each(data, function(key, value) {
        if (data[key] == null) {
          data[key] = "-";
        }
      });
      this.contractName = data.contractName;
      this.contractMoneyWanYuan = data.contractMoneyWanYuan;
      this.saleLevelOneName = data.saleLevelOneName; //销售B级单位
      this.contractSaleName = data.contractSaleName; //项目销售
      this.industry = data.industry;
      this.saleLevelTwoName = data.saleLevelTwoName;
      this.region = data.region;
      this.contractParty = data.contractParty;
      this.contractSigningTime = data.contractSigningTime;
      this.archivingStatus = data.archivingStatus;
      this.contractStatus = data.contractStatus;
      this.contractNative = data.contractNative;

      //从项目中获取的 合同信息
      this.expectProjectStartDate =
        data.element.expectProjectStartDate != undefined
          ? data.element.expectProjectStartDate
          : "-";
      this.expectProjectEndDate =
        data.element.expectProjectEndDate != undefined
          ? data.element.expectProjectEndDate
          : "-";
      this.projectOperationalPeriod =
        data.element.projectOperationalPeriod != undefined
          ? data.element.projectOperationalPeriod
          : "-";
      this.contractContent =
        data.element.contractContent != undefined
          ? data.element.contractContent
          : "-";
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
  /*border: 1px solid red;*/
  width: 20%;
}

.width3 {
  /*border: 1px solid red;*/
  width: 10%;
}
.width4 {
  /*border: 1px solid red;*/
  width: 28%;
}

.width5 {
  /*border: 1px solid red;*/
  width: 14%;
}
.width6 {
  width: 18%;
}

.tables {
  overflow-y: auto;
  width: 100%;
  /*border: 1px solid*/
}
</style>
