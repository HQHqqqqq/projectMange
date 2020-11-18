<template>
  <div class="cash">
    <div class="search">
      <div class="row">
        <div class="col">
          <span class="label"><span style="color:red">*</span>B级单位</span>
          <el-select filterable  v-model="search.firstLevelDepartmentId" style="width:60%" size="mini" placeholder="请选择B级单位">
            <el-option :label="item.firstDeptName" :value="item.firstDeptId" v-for="(item, index) in BLevelAry"
              :key="index"></el-option>
          </el-select>
        </div>
        <div class="col">
          <span class="label">承担人</span>
          <el-select style="width: 60%;" size="mini" v-model="search.emp_name" filterable remote reserve-keyword
            placeholder="请输入承担人" :remote-method="remoteMethod" :loading="loading" @change="changeHandle">
            <el-option v-for="(item, index) in takeOne" :key="index" :label="item.underTakerName"
              :value="item.underTakerId">
            </el-option>
          </el-select>
        </div>
        <div class="col"> <span class="label">借款单号</span>
          <el-input v-model="search.loanNumber" placeholder="请输入借款单号" size="mini" style="width:60%"></el-input>
        </div>
        <div class="col2">
          <span class="label">起止日期</span>
          <el-date-picker v-model="search.dataTime" type="daterange" size="mini" style="width:60%" range-separator=""
            format="yyyy-MM-dd" value-format="timestamp" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="col3">
          <el-button type="primary" size="mini" @click="searchHandle" :disabled="isDisabled">查询</el-button>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <span class="label">保证金类型</span>
          <el-select v-model="search.depositType" size="mini" style="width:60%" placeholder="请选择类型">
            <el-option label="投标保证金" value="1"></el-option>
            <el-option label="履约保证金" value="2"></el-option>
          </el-select>
        </div>
        <div class="col">
          <span class="label">项目名称</span>
          <el-input v-model="search.projectName" placeholder="请输入项目名称" style="width:60%" size="mini"></el-input>
        </div>
        <div class="col">
          <el-checkbox-group v-model="search.notAllReturn" size="mini">
            <el-checkbox label="仅显示未全部归还" name="type" style="width:60%"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="col2">
          <span class="label">项目状态</span>
          <el-radio-group v-model="search.projectStatus" size="mini" style="width:60%">
            <el-radio label="1">不限</el-radio>
            <el-radio label="2">已验收</el-radio>
            <el-radio label="3">未验收</el-radio>
          </el-radio-group>
        </div>
        <div class="col3">
          <el-button type="primary" size="mini" @click="exportExcel" :disabled="isDisabled">XLS导出</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" :disabled="isDisabled" circle class="circle-btn"
            @click="clearFilter">
          </el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table v-loading="tableLoading" :data="tableData" class="father-pro-table" highlight-current-row border
        ref="refTable" min-width="30" :max-height="asideHeight" :header-cell-style="{
        fontSize: '14px',
        color: '#303133',
        height: '51px',
        padding: 0,
        backgroundColor: '#ccd1d5'
      }" :row-style="{ height: '50px' }" :cell-style="{ padding: 0 }" style="width: 100%;margin-bottom: 10px;"
        row-key="id" default-expand-all :tree-props="{ children: 'son_project', hasChildren: 'hasChildren' }">
        <!-- <el-table-column width="50"></el-table-column> -->

        <el-table-column type="index" width="38" align="center" label="序号"></el-table-column>
        <el-table-column label="借款单号" prop="loanNumber" width="90" align="center">
        </el-table-column>
        <el-table-column prop="firstLevelDepartmentName" label="一级部门" width="120" align="center">
        </el-table-column>
        <el-table-column prop="underTakerName" label="承担人" align="center"> </el-table-column>
        <el-table-column prop="purpose" label="用途" align="center" width="100"> </el-table-column>
        <el-table-column prop="loanAmount" header-align="center" align="right" label="借款金额(元)" width="140">
          <template slot-scope="scope">
            <span>
              {{ scope.row.loanAmount | formatThousands }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="unpaidAmount" header-align="center" align="right" label="未还金额(元)" width="140">
          <template slot-scope="scope">
            <span>
              {{ scope.row.unpaidAmount | formatThousands }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentDate" align="center" label="支付日期" width="100">
        </el-table-column>
        <el-table-column prop="paymentMethod" align="center" label="支付方式" width="140">
        </el-table-column>
        <el-table-column prop="receivingParty" align="center" label="收款方" width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="contractNumber" align="center" label="合同编号" width="180">
        </el-table-column>
        <el-table-column prop="businessNumber" align="center" label="商机编号" width="80">
        </el-table-column>
        <el-table-column prop="projectName" align="center" label="项目名称" width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="projectStatusName" align="center" label="项目状态">
        </el-table-column>
        <el-table-column prop="borrowerName" align="center" label="借款人"> </el-table-column>
        <el-table-column prop="borrowingInstruction" align="center" label="借款说明" width="300"
          :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination class="pagenation" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[20]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBlevelList,
  getCashList,
  systemGetHttpMethod,
  serverGetHttpMethod,
  getAllSeller
} from "../../api/api.js";
import api from "../../api/index";
import { formatDate } from "../../assets/js/util";
import { mapState, mapActions } from "vuex";
export default {
  name: "cashDepositList",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      BLevelAry: [],
      takeOne: [],
      loading: true,
      pageNum: 1,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      tableData: [],
      tableLoading: false,
      search: {
        firstLevelDepartmentId: null,
        emp_name: "",
        underTakerId: "",
        loanNumber: "",
        dataTime: [],
        beginDate: "",
        endDate: "",
        notAllReturn: false
      },

    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    asideHeight: function () {
      return document.documentElement.clientHeight - 240;
    },
    isDisabled: function (val) {
      if (this.search.firstLevelDepartmentId == null) {
        return true
      } else {
        return false
      }
    }
  },
  filters: {
    formatThousands: function (value) {
      if (value == "--") {
        return "--";
      }
      value = value.toFixed(2);
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
    }
  },
  watch: {
    datas: {
      deep: true,
      handler: function (val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      }
    },
    "search.dataTime": function (val) {
      var start = val[0];
      var end = val[1];
      this.search.beginDate = formatDate(start);
      this.search.endDate = formatDate(end);
    },


  },
  methods: {
    getBLevelSelect() {
      var memberId = this.userinfo.memberid;
      getBlevelList(
        `/sgpm/rest/api/server/charge/supervision/b/level/dept/${memberId}`,
        null
      )
        .then(res => {
          if ((res.status = 200)) {
            this.BLevelAry = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //导出
    exportExcel() {
      let a = document.createElement("a");
      // a.href =
      //   "http://192.168.102.101:11104/sgpm/rest/api/server/project/deposit/export/" + this.userinfo.memberid;
      a.href =
        api.urlPort04 + "/sgpm/rest/api/server/project/deposit/export/" + this.userinfo.memberid;
      a.download =
        api.urlPort04 + "/sgpm/rest/api/server/project/deposit/export/" + this.userinfo.memberid;
      a.click();
      return false;
    },
    //承担人模糊查询
    remoteMethod(val) {
      var url = `/sgpm/rest/api/server/under/taker/fuzzy/search?name=${val}`
      serverGetHttpMethod(url)
        .then(res => {
          if (res.status == 200) {
            this.loading = false;
            this.takeOne = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeHandle(val) {
      getAllSeller(
        `/sgpm/rest/api/system/user/department/part?memberId=${val}`,
        null
      )
        .then(res => {
          if (res.status == 200) {
            let result = res.data.data;
            this.search.emp_name = result.emp_name
            this.search.underTakerId = result.memberid
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTableList(params) {
      getCashList(`/sgpm/rest/api/server/project/deposit`, params)
        .then(res => {
          if ((res.status = 200)) {
            this.tableLoading = false;
            this.tableData = res.data.data;
            this.total = res.data.meta.totalCount;
            this.currentPageContract = res.data.meta.pageNo;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      var params = {
        firstLevelDepartmentId: this.search.firstLevelDepartmentId || null,
        underTakerId: this.search.underTakerId || undefined,
        loanNumber: this.search.loanNumber || undefined,
        beginDate: this.search.beginDate || undefined,
        endDate: this.search.endDate || undefined,
        depositType: this.search.depositType || undefined,
        projectName: this.search.projectName || undefined,
        projectStatus: this.search.projectStatus || undefined,
        notAllReturn: this.search.notAllReturn ? 1 : 0,
        pageNum: val,
        pageSize: this.pageSize,
        memberId: this.userinfo.memberid
      };
      this.getTableList(params);
    },
    //查询
    searchHandle() {
      var params = {
        firstLevelDepartmentId: this.search.firstLevelDepartmentId || null,
        underTakerId: this.search.underTakerId || undefined,
        loanNumber: this.search.loanNumber || undefined,
        beginDate: this.search.beginDate || undefined,
        endDate: this.search.endDate || undefined,
        depositType: this.search.depositType || undefined,
        projectName: this.search.projectName || undefined,
        projectStatus: this.search.projectStatus || undefined,
        notAllReturn: this.search.notAllReturn ? 1 : 0,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        memberId: this.userinfo.memberid
      };
      this.getTableList(params);
    },
    clearFilter() {
      this.search = {
        firstLevelDepartmentId: null,
        emp_name: "",
        underTakerId: "",
        loanNumber: "",
        dataTime: [],
        beginDate: "",
        endDate: "",
        notAllReturn: false
      }
      var params = {
        firstLevelDepartmentId: this.search.firstLevelDepartmentId || null,
        underTakerId: this.search.underTakerId || undefined,
        loanNumber: this.search.loanNumber || undefined,
        beginDate: this.search.beginDate || undefined,
        endDate: this.search.endDate || undefined,
        depositType: this.search.depositType || undefined,
        projectName: this.search.projectName || undefined,
        projectStatus: this.search.projectStatus || undefined,
        notAllReturn: this.search.notAllReturn ? 1 : 0,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        memberId: this.userinfo.memberid
      };
      this.getTableList(params);
    }
  },
  created() {
    this.getBLevelSelect()

  }
};
</script>
<style lang="scss">
.cash {
  .el-radio {
    margin-right: 10px;
  }
  .el-checkbox__label {
    font-size: 12px !important;
  }
  .el-radio__label {
    font-size: 12px !important;
  }
}
</style>

<style lang="scss" scoped>
.cash {
  padding: 10px 15px;
  .search {
    padding: 0 15px;
    .row {
      display: flex;
      margin: 0 0 10px 0;
      .col {
        flex: 1;
        text-align: center;
        .label {
          display: inline-block;
          width: 66px;
          font-size: 12px;
          text-align: left;
        }
      }
      .col2 {
        flex: 2;
        text-align: center;
        .label {
          display: inline-block;
          width: 66px;
          font-size: 12px;
          text-align: left;
        }
      }
      .col3 {
        flex: 1;
      }
    }
  }
  .circle-btn {
    border-radius: 5px;
  }
  .content {
    .page {
      overflow: hidden;
      .pagenation {
        float: right;
      }
    }
  }
}
</style>
