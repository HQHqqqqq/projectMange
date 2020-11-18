<template>
  <div class="list-container">
    <div class="header">
      <el-form ref="form" :model="form" :inline="true" size="mini">
        <el-row :gutter="5" type="flex" justify="space-between">
          <el-col :md="14" :xl="9" :sm="14" :lg="2"></el-col>
          <el-col :md="18" :xl="9" :sm="14" :lg="11">
            <div class="header-search">
              <el-form-item>
                <el-input v-model="form.fieldName" :placeholder="placeholder" size="mini">
                  <el-button slot="append" icon="el-icon-search" @click="keyWordSearch"></el-button>
                </el-input>
              </el-form-item>
              <!-- <el-dropdown size="mini" split-button type="primary" @command="handleCommandAdd">
                项目审批
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">非合同项目登记</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <el-button type="primary" size="mini" :disabled="isShowBtn" @click="notProjectStart('a')">非合同项目登记
              </el-button>
                <el-button type="primary" size="mini" :disabled="isFinish" @click="postProjectHandle()">非合同项目结项
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData" class="father-pro-table" highlight-current-row border :max-height="asideHeight"
      ref="refTable" v-loading="tableLoading"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}" :cell-style="{padding:0}" @current-change="handleSelectionChange"
      @header-dragend="headerDragend" style="width: 100%;margin-bottom: 10px;"
      row-key="id" default-expand-all :tree-props="{children: 'son_project', hasChildren: 'hasChildren'}">
      <!-- <el-table-column width="50"></el-table-column> -->

      <el-table-column type="index" width="38" align="center" label="序号" :fixed="checkFixed"></el-table-column>
      <el-table-column label="项目名称" width="140" align="center" :fixed="checkFixed" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="{
              name: '/projectInformation',
              params: {
                id: scope.row.id,
                category: scope.row.jumpType,
                projectName: scope.row.projectName,
                projectNumber: scope.row.projectNumber,
                company_id: scope.row.company_id,
                judgeproject: '非合同项目信息',
              }
            }">
            <span class="num">{{ scope.row.projectName }}</span></router-link>
        </template>
      </el-table-column>
      <el-table-column :prop="val.key" width="140" :label="val.label" v-for="(val,index) in listConfig" :key="index" align="center"
        v-if="val.isShow">
        <template slot-scope="scope">
          <span
            v-if="val.key=='projectStatus'">{{ scope.row[val.key]==null?'--':projectStatusConfig[scope.row[val.key]] }}</span>
          <span v-else>{{ scope.row[val.key]==null?'--': scope.row[val.key]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="page right">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="1"
        :page-sizes="[20]" layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  projectMsgById,
  summary,
  updateTime,
  care,
  projectListTabel,
  tooken,
  oaStatus,
  auditRecord,
  saveAuditRecord,
  projectListSelect,
  advancedCondition,
  notContractListTabel
} from "../../api/api.js";
import config from "../../config";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "ProjectList",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      isShowBtn: true,
      projectStatusConfig: {
        0: "已登记",
        1: "运行中",
        2: "完成",
        3: "暂停",
        4: "关闭",
        5: "异常关闭",
        6: "验收"
      },
      isPname: true,
      btnMaxWidth: 130,
      dynamiCheckList: [],
      form: {
        dicName: "All",
        keyWord: ""
      },
      advancedDialog: false,
      advancedForm: {
        fieldName: "",
        fieldValue: ""
      },

      dynamicValidateForm: {
        domains: [
          {
            value: "",
            value1: "",
            isDisabled: false
          }
        ],
        type: []
      },
      //是否是文本框
      isTest: false,
      checkFixed: true,
      currentPage: 1,
      advancedList: [],
      tableData: [],
      //下拉列表
      selectAry: [],
      page: {
        //当前页
        pageNum: 1,
        //每页显示条数
        pageSize: 20,
        total: 0
      },
      listConfig: [
		    { key: "auditStatus", label: "审核进度", isShow: true },
        { key: "projectNumber", label: "项目编号", isShow: true },
        { key: "classUnitBName", label: "实施B级单位", isShow: true },
        { key: "classUnitCName", label: "实施C级单位", isShow: true },
        { key: "projectManagerName", label: "项目经理", isShow: true },
        { key: "projectStatus", label: "项目状态", isShow: true },
        { key: "projectType", label: "项目类型", isShow: true },
        { key: "keyword", label: "项目关键字", isShow: true },
        {
          key: "expectProjectStartDate",
          label: "项目预计开始时间",
          isShow: true
        },
        {
          key: "expectProjectEndDate",
          label: "项目预计结束时间",
          isShow: true
        },
        { key: "note", label: "备注", isShow: true }
      ],
      //是否已签合同
      isAlready: false,
      //是否启动
      isStart: false,
      //是否结项
      isFinish: true,
      //是否撤回
      isRecall: true,
      //是否编辑
      isEditor: true,
      multipleSelection: [],
      advancedOptions: config.advancedOptions,
      advancedMultiples: {},
      // 编辑按钮的标识
      editorBtnMark: "",
      dialogVisible: false,
      dialogShowField: false,
      checkedField: [],
      aLLField: [],
      tableLoading: true,
      examineDialog: false,
      passForm: {
        attitude: "1",
        comment: ""
      },
      //带我审核的按钮
      isWaitMeBtn: true,
      proParams: {},
      //项目列表筛选字段名称
      fieldName: "",
      //项目列表字段筛选内容
      fieldContent: [],
      //项目列表排序字段名称
      sortFieldName: "",
      //项目列表排序 1 升序 2，降序
      sort: null,
      isCared: null,
      tookenId: "",

      //审核进度
      auditConfig: {
        10: "登记待提交",
        11: "登记审核中",
        12: "登记已审核",
        20: "启动待提交",
        21: "启动审核中",
        22: "启动已审核",
        30: "工作结项待提交",
        31: "工作结项审核中",
        32: "工作结项已审核"
      }
    };
  },
  filters: {
    formatThousands: function(value) {
      if (value == "--") {
        return "--";
      }
      value = value / 10000;
      value = value.toFixed(2);
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
    },
    formatTip: function(value) {
      var num =
        value != undefined ? parseFloat((value * 100).toFixed(10)) : "--";

      if (num < 10) {
        return `进度正常(${num}%)`;
      } else if (num >= 10 && num < 30) {
        return `一般延期(${num}%)`;
      } else if (num >= 30) {
        return `严重延期(${num}%)`;
      } else {
        return "--";
      }
      // if (value == null) {
      //   return "--";
      // } else if (value == "0.0") {
      //   return "正常";
      // } else {
      //   return parseFloat((value * 100).toFixed(10)) + "%";
      // }
    }
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      }
    }
  },
  computed: {
    ...mapState([
      "userinfo", //os跳转过来的用户信息值
      "gjFromModel",
      "gjFromCheckList"
    ]),
    placeholder(){
      if(this.userinfo.account_id == "8416498716893399290"){//南康添加工程代码模糊查询
        return '项目名称/项目编号/工程代码'
      }else{
         return '项目名称/项目编号'
      }
    },
    projectType() {
      return this.datas.options.pro_type;
    },
    copyListConfig() {
      return JSON.parse(JSON.stringify(this.listConfig));
    },

    listCode() {
      return this.form.dicName;
    },
    asideHeight: function() {
      return document.documentElement.clientHeight - 205;
    }
  },
  mounted() {
    this.init();
    if (
      this.userinfo.account_id == "-1814768306395265967" || //国图信息
      this.userinfo.account_id == "5326994013938795629" || //超图信息
      this.userinfo.account_id == "-1360422574114386809" || //超图软件
      this.userinfo.account_id == "7034660345998100768" || //河南超图
      this.userinfo.account_id == "8416498716893399290" || //南康
      this.userinfo.account_id == "-7975978055853456035" || 
      this.userinfo.account_id == "7638091599462351621" //安图
    ) {
      //地图慧
      this.isShowBtn = false;
    } else {
      this.isShowBtn = true;
    }
    if(this.userinfo.account_id == "8416498716893399290"){//南康
        this.listConfig=config.contractTableConfigNk
    }
  },
  methods: {
    ...mapActions([
      "setDetailPage",
      "setCacheParams",
      "setGJFromModel",
      "setGJFromCheck"
    ]),
    headerDragend(newWidth, oldWidth, column, event) {
      this.btnMaxWidth = newWidth;
      if (newWidth > 200) {
        this.isPname = false;
      } else {
        this.isPname = true;
        this.btnMaxWidth = 200;
      }
    },
    init() {
      if (this.userinfo.account_id == "-1814768306395265967") {
        //说明是国图的人
        this.isAlready = true;
      } else {
        this.isAlready = false;
      }
      this.getNotContractTable({
        pageNum: 1,
        pageSize: 20,
        keyWord: "",
        type:'all',
        memberId:this.userinfo.memberid
      });
      //下拉选框
      this.getSelectList();
    },
    
    advancedChange(val, index) {
      this.dynamicValidateForm.domains[index].value1 = "";
      // if (obj == "projectManager") {
      //   this.isTest = true;
      // } else {
      //   this.isTest = false;
      // }

      advancedCondition(
        `/sgpm/rest/api/server/pm/project/condition?projectKey=${val}`,
        null
      )
        .then(res => {
          this.advancedList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    popoverShow() {
      this.checkFixed = false;
      // this.asideHeight = document.documentElement.clientHeight - 260;
    },
    popoverHide() {
      this.checkFixed = true;
      // this.asideHeight = document.documentElement.clientHeight - 260;
    },
    advancedDialogOpen() {
      this.advancedDialog = true;
      this.dynamicValidateForm = this.gjFromModel;
      this.dynamiCheckList = this.gjFromCheckList.isStart || [];
    },
    //获取项目列表表格
    getNotContractTable(val) {
      this.tableLoading = true;
      let params = val;
      //获取项目列表信息
      notContractListTabel("/sgpm/rest/api/server/non/pm/gt/projects", params)
        .then(res => {
          this.tableLoading = false;
          let result = res.data.data || [];
          this.tableData = res.data.data || [];
          this.page.total = res.data.meta.totalCount;
          // this.setCacheParams(params);
        })
        .catch(err => {
          console.log(err);
        });
    },
    keyWordSearch() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        keyWord: this.form.fieldName.trim(),
        type:'all',
        memberId:this.userinfo.memberid
      };
      this.getNotContractTable(params);
    },
    //获取查看范围下拉选框
    getSelectList() {
      //获取下拉选信息
      projectListSelect("/sgpm/rest/api/server/pm/project/item?param=1", null)
        .then(res => {
          var result = res.data.data;
          this.selectAry = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      let params = {
        pageNum: val,
        pageSize: this.page.pageSize,
        keyWord: this.form.fieldName&&this.form.fieldName.trim(),
        type:'all',
        memberId:this.userinfo.memberid,
      };
      this.getNotContractTable(params);
    },
    handleSelectionChange(val) {
    localStorage.setItem("projectInfo", JSON.stringify(val));
    //登记待提交10、登记审核中11、登记已审核12；
    //启动待提交20、启动审核中21、启动已审核22；
    //工作结项待提交30、工作结项审核中31、工作结项已审核32
    //合同结项待提交40、合同结项审核中41、合同结项已审核42；
    //异常结项待提交50、异常结项审核中51、合同结项已审核52 
		if (val) {
			var _isFinish = (val.audit_status == 12 && this.userinfo.emp_name == val.projectManagerName) || (val.audit_status == 30 &&this.userinfo.emp_name == val.projectManagerName);
			this.isFinish = !_isFinish;
		  
		  
        this.isPass = false;
        this.isReject = false;
        var status = val.auditStatus || "";
        this.editorBtnMark = status;
        //如果是登记已审核可以启动
        this.isStart =
          val.audit_status == 12 &&
          this.userinfo.emp_name == val.projectManager;
        this.isRecall = status !== "审核中";
        // if (
        //   (val.audit_status == 30 ||
        //     val.audit_status == 31 ||
        //     val.audit_status == 32) &&
        //   this.userinfo.emp_name == val.projectManager
        // ) {
        //   this.isFinish = true;
        // } else if (
        //   val.percentageComplete * 100 == 100 &&
        //   // (val.audit_status == 12 || val.audit_status == 22) &&
        //   val.audit_status == 22 &&
        //   this.userinfo.emp_name == val.projectManager
        // ) {
        //   this.isFinish = false;
        // } else {
        //   this.isFinish = true;
        // }

        this.isWaitMeBtn = false;
      }
      if (status == "登记待提交") {
        this.isEditor = false;
      } else {
        this.isEditor = true;
      }
      this.multipleSelection = val;
    },
    notProjectStart(val) {
      localStorage.removeItem("projectMsg");
      this.setDetailPage(false);
      sessionStorage.setItem("isRevoke", 2);
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      localStorage.removeItem("businessProjectId");
      localStorage.removeItem("globalParams");
      this.$router.push({
        path: "notContractProject",
        query: {
          judgelogo: val
        }
      });
    },
    postProjectHandle(){
      this.$router.push({
        path: "nonPostProject",
        query: {
          id: this.multipleSelection.id,
          projectNum: this.multipleSelection.projectNumber
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-form--label-top .el-form-item__label {
  float: left;
}

.el-form-item__label {
  width: 100% !important;
}

.el-table-filter__checkbox-group label.el-checkbox {
  margin: 0 0 0 0;
}

.list-container {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 9px;
  }
  padding: 0 15px 0 15px;
  .header {
    margin-top: 20px;
    .circle-btn {
      border-radius: 5px;
    }
    .one-row {
      margin: 10px 0;
    }
    .header-search {
      float: right;
      margin-bottom: 10px;
    }
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .startGrey {
    color: #c4c4c4;
    font-size: 13px;
    display: block;
  }
  .startYellow {
    color: #ff9900;
    font-size: 13px;
  }
  .search {
    margin: 30px 0 0 0;
  }
  .progress {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: gray;
    border-radius: 50%;
    position: relative;
  }
  .progress-red {
    background: #f56954 !important;
  }
  .progress-yellow {
    background: #f39c12 !important;
  }
  .progress-green {
    background: #00a65a !important;
  }
  .el-table__expanded-cell {
    padding: 0;
  }
  .el-form-item__label {
    width: 70px !important;
  }

  .list-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    .label {
      font-size: 12px;
      vertical-align: -webkit-baseline-middle;
    }
    .btn-item {
      display: flex;
      justify-content: flex-end;
      margin: 5px 0 0 0;
      .circle-menu {
        border-radius: 2px;
      }
      .btn-right {
        margin: 0 10px 0 0;
      }
      .btn-left {
        margin: 0 0 0 10px;
      }
    }

    .tittle {
      font-weight: bold;
      font-size: 16px !important;
    }
    .title-position {
      text-align: left;
    }
    .btn-drop {
      margin: 0 10px 0 0;
    }
    .popover {
      height: 200px;
    }
  }

  .right {
    float: right;
  }
  .father-pro-table {
    // overflow-y: auto;
    .el-table--scrollable-x .el-table__body-wrapper {
      overflow-x: hidden;
    }
    .num {
      color: #409eff;
      text-decoration: underline;
    }
  }
  .dialog {
    .red {
      color: red;
    }
  }
  .demo-dynamic {
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
  .pname {
    // max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
