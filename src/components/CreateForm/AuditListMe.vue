<template>
  <div class="list-container">
    <header class="list-header">
      <el-row :gutter="20">
        <el-col :md="24" :lg="24">
          <el-row class="btn-item">
            <el-button type="primary" size="mini" :disabled="isWaitMeBtn" @click="detail">详情</el-button>
            <el-button type="primary" size="mini" :disabled="isWaitMeBtn" @click="openTemporaryDialog">审批</el-button>
            <el-popover placement="left" width="200" trigger="click" class="popover">
              <el-checkbox v-model="item.isShow" v-for="item in listConfig" :key="item.key" class="popover-checkbox">
                {{item.label}}</el-checkbox>
              <!-- <el-button size="mini" type="primary" slot="reference">显示字段</el-button> -->
              <el-button type="primary" icon="el-icon-menu" slot="reference" size="mini" circle
                class="circle-menu btn-left"></el-button>
            </el-popover>
            <el-button type="primary" icon="el-icon-refresh" size="mini" circle class="circle-menu btn-left"
              @click="clearFilter"></el-button>
          </el-row>
        </el-col>
      </el-row>
    </header>

    <el-table :data="tableData" class="father-pro-table" highlight-current-row border :height="asideHeight"
      ref="refTable" v-loading="tableLoading"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}" :cell-style="{padding:0}" @cell-click="handleCell"
      @current-change="handleSelectionChange" @sort-change="handleSortChange"
      style="width: 100%;margin-bottom: 20px;min-height: 400px;" row-key="id" default-expand-all
      :tree-props="{children: 'son_project', hasChildren: 'hasChildren'}">
      <!-- <el-table-column width="50"></el-table-column> -->
      <el-table-column type="index" width="38" align="center" label="序号" fixed></el-table-column>

      <el-table-column width="280" fixed label="项目名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="35" label="进度" align="center">
        <!-- <template slot-scope="scope">
          <div class="progress" :title="scope.row.name"></div>
        </template>-->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.delayPercentage|formatTip" placement="right">
            <div class="progress progress-red" v-if="scope.row.color==1"></div>
            <div class="progress progress-yellow" v-if="scope.row.color==2"></div>
            <div class="progress progress-green" v-if="scope.row.color==3"></div>
            <div class="progress" v-if="scope.row.color==null"></div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="35" label="关注" align="center">
        <template slot-scope="scope">
          <i class="el-icon-star-on startGrey"
            :class="{'el-icon-star-on':isCared?isCared:scope.row.isCare,'startYellow':isCared?isCared:scope.row.isCare}"></i>
        </template>
      </el-table-column>

      <!-- <el-table-column width="100" label="测试" align="center">
        <template slot-scope="scope">
          <router-link
            :to="{name:'/projectHome', params:{ id: scope.row.id,projectName:scope.row.name,projectNumber:scope.row.projectNum}}"
          >
            <span class="num">{{scope.row.id}}</span>
          </router-link>
        </template>
      </el-table-column>-->
      <el-table-column :prop="val.key" :label="val.label" v-for="val in listConfig" :key="val.key" width="130"
        align="center" v-if="val.isShow" :sortable="val.sortable?val.sortable:null"
        :filters="val.filters?val.filters:null" :filter-method="val.filters?filterHandler:null ">
        <template slot-scope="scope">
          <span
            v-if="val.isShow&&val.isQfw==1">{{ scope.row[val.key]==null?'--': scope.row[val.key]| formatThousands}}</span>
          <span v-if="val.isShow&&val.isPercent">{{ scope.row[val.key]==null?'--': scope.row[val.key]*100+'%'}}</span>
          <span
            v-if="val.isShow&&val.isQfw!=1&&!val.isPercent">{{ (scope.row[val.key]==null||scope.row[val.key]=='')?'--': scope.row[val.key]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="page right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="currentPage" :page-size="1" :page-sizes="[20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
    </div>
    <div class="block"></div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" class="dialog">
      <i class="icon-message red"></i>
      <span class="red">危险提示</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRecall">确 定</el-button>
      </span>
    </el-dialog>
    <!---待我审核的项目弹框-->
    <el-dialog title="登记审批" :visible.sync="examineDialog" class="dialog" width="80%">
      <el-table :data="tableData1"
        :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
        :row-style="{height:'50px'}" :cell-style="{padding:0}" style="width: 100%">
        <el-table-column prop="role" label="审批角色" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="审核内容" width="360">
          <template slot-scope="scope">
            <span style="display:inline-block" v-for="(item,index) in scope.row.content" :key="index">
              <span>{{item.msgText}}</span>
              <el-radio v-model="item.model" label="1" :disabled="item.disabled">是</el-radio>
              <el-radio v-model="item.model" label="0" :disabled="item.disabled">否</el-radio>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="审批人及日期">
          <template slot-scope="scope">
            <span style="display:block">审批人：{{scope.row.user.userName}}</span>
            <span style="display:block">日期：{{scope.row.user.date}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="审核意见">
          <template slot-scope="scope">
            <el-input v-model="scope.row.auditComment" :disabled="scope.row.isAuditComment"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectedHandle(0)" size="small">驳 回</el-button>
        <el-button type="primary" @click="confirmPass(1)" size="small">通 过</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogShowField" width="30%" class="dialog">
      <el-checkbox v-model="item.isShow" v-for="item in listConfig" :key="item.key">{{item.label}}</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRecall">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogTemporaryVisible" width="30%">
      <span>您接下来的操作，将会跳转oa系统中进行审批，请单击确定执行</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTemporaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="TemporaryConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  projectMsgById,
  care,
  projectListTabel,
  tooken,
  oaStatus,
  auditRecord,
  saveAuditRecord
} from "../../api/api.js";
import config from "../../config";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "ProjectList",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      dialogTemporaryVisible: false,
      form: {
        dicName: "All"
      },
      currentPage: 1,

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
        // { key: "", label: "", isShow: true },
        { key: "auditStatus", label: "审核状态", isShow: true },
        { key: "projectNum", label: "项目编号", isShow: false },
        { key: "levelOneName", label: "实施B级单位", isShow: true },
        { key: "levelTwoName", label: "实施C级单位", isShow: false },
        { key: "projectManager", label: "项目经理", isShow: true },
        { key: "customerCenter", label: "销售B级单位", isShow: true },
        { key: "saleTwoName", label: "销售C级单位", isShow: false },
        { key: "contractMarket", label: "销售人员", isShow: true },
        {
          key: "projectType",
          label: "项目类型",
          isShow: true,
          filters: [
            { text: "开发类项目", value: "开发类项目" },
            { text: "数据服务类项目", value: "数据服务类项目" },
            { text: "测绘类项目", value: "测绘类项目" },
            { text: "运维类项目", value: "运维类项目" },
            { text: "规划设计类项目", value: "规划设计类项目" },
            { text: "咨询服务类项目", value: "咨询服务类项目" },
            { text: "监理类项目", value: "监理类项目" },
            { text: "科研类项目", value: "科研类项目" },
            { text: "集成类项目", value: "集成类项目" },
            { text: "其他类项目", value: "其他类项目" },
            { text: "内部研发类项目", value: "内部研发类项目" },
            { text: "市场类项目", value: "市场类项目" },
            { text: "事务型项目", value: "事务型项目" }
          ]
        },
        {
          key: "projectLevel",
          label: "项目级别",
          isShow: false,
          filters: [
            { text: "超大型", value: "超大型" },
            { text: "大型", value: "大型" },
            { text: "中型", value: "中型" },
            { text: "小型", value: "小型" }
          ]
        },
        {
          key: "contractAmount",
          label: "合同额",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "backMoney",
          label: "回款额",
          isShow: true,
          isQfw: 1, //是否有千分位
          sortable: "custom"
        },
        {
          key: "projectStatus",
          label: "项目状态",
          isShow: true,
          filters: [
            { text: "已登记", value: "已登记" },
            { text: "运行中", value: "运行中" },
            { text: "暂停", value: "暂停" },
            { text: "完成", value: "完成" },
            { text: "关闭", value: "关闭" },
            { text: "异常关闭", value: "异常关闭" }
          ]
        },
        {
          key: "stageName",
          label: "当前阶段",
          isShow: true,
          filters: [
            { text: "启动", value: "启动" },
            { text: "规划", value: "规划" },
            { text: "实施", value: "实施" },
            { text: "收尾", value: "收尾" }
          ]
        },
        {
          key: "percentageComplete",
          label: "实施进度",
          isShow: true,
          isPercent: true, //是否为百分比
          sortable: "custom"
        },
        { key: "contractNumber", label: "合同编号", isShow: false },
        {
          key: "totalBudget",
          label: "总预算",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "totalCost",
          label: "总成本",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "predictGrossProfit",
          label: "预计毛利润",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "curGrossProfit",
          label: "当前毛利润",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "predictNetPorfit",
          label: "预计净利润",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "curNetPorfit",
          label: "当前净利润",
          isShow: true,
          isQfw: 1,
          sortable: "custom"
        },
        { key: "progressProblems", label: "当前进展问题", isShow: false },
        {
          key: "reviewTime",
          label: "最近Review时间",
          isShow: false,
          sortable: "custom"
        },
        { key: "clientName", label: "客户名称", isShow: false },
        {
          key: "contractSigningTime",
          label: "合同签订日期",
          isShow: false,
          sortable: "custom"
        },
        {
          key: "contractCheckTime",
          label: "合同约定项目结束时间",
          isShow: false,
          sortable: "custom"
        },
        {
          key: "proStartTime",
          label: "项目预计开始时间",
          isShow: false,
          sortable: "custom"
        },
        {
          key: "proEndTime",
          label: "项目预计结束时间",
          isShow: false,
          sortable: "custom"
        },
        { key: "trade", label: "行业", isShow: false },
        { key: "region", label: "区域", isShow: false },
        { key: "pigeonholeStatus", label: "归档状态", isShow: false },
        { key: "Aunit", label: "A级单位", isShow: false }

        // { key: "description", label: "项目描述", isShow: true },
        // { key: "contractType", label: "合同类型", isShow: true },
        // { key: "milestone", label: "当前里程碑", isShow: true },
      ],
      //是否启动
      isStart: false,
      //是否撤回
      isRecall: true,
      //是否编辑
      isEditor: true,
      multipleSelection: [],
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
      isWaitMeBtn: false,
      proParams: {},
      tableData1: [
        {
          role: "公司PMO专员意见",
          content: [
            {
              msgText: "项目登记信息规范完整",
              model: "2",
              disabled: false
            },
            {
              msgText: "同意项目登记",
              model: "1"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        },
        {
          role: "客户中心销售人员意见",
          content: [
            {
              msgText: "登记信息已知晓，同意项目登记",
              model: "1"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        },
        {
          role: "工程中心部门经理意见",
          content: [
            {
              msgText: "项目基本信息、项目简介可通过",
              model: "1"
            },
            {
              msgText: "同意项目登记",
              model: "1"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        },
        {
          role: "工程中心项目总监意见",
          content: [
            {
              msgText: "项目基本信息、项目简介可通过",
              model: "1"
            },
            {
              msgText: "同意项目登记",
              model: "1"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        },
        {
          role: "工程中心总经理意见",
          content: [
            {
              msgText: "登记信息已知晓，同意项目登记",
              model: "1"
            }
          ],
          user: { date: "2010-2-3", userName: "张三" },
          auditComment: ""
        }
      ],
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
      oaConfig: {
        1: "待发",
        3: "待处理",
        4: "处理中",
        6: "回退",
        7: "取回",
        5: "撤销",
        15: "终止",
        0: "结束"
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
      if (value == null) {
        return "--";
      } else {
        return parseFloat((value * 100).toFixed(10)) + "%";
      }
    }
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        // console.log(this.datas);
        // console.log(this.datas.options.url_a);
      }
    }
  },
  computed: {
    ...mapState([
      "userinfo", //os跳转过来的用户信息值
      "cacheParams" //os跳转过来的用户信息值
    ]),
    projectType() {
      return this.datas.options.pro_type;
    },
    copyListConfig() {
      return JSON.parse(JSON.stringify(this.listConfig));
    },

    listCode() {
      return "waitMe";
    },
    asideHeight: function() {
      return document.documentElement.clientHeight - 240;
    }
  },
  mounted() {
    this.init();
    //获取tooken
    this.getTooken();
  },
  methods: {
    ...mapActions(["setDetailPage", "setCacheParams"]),
    init() {
      this.getProjectTable();
    },
    //获取tooken
    getTooken() {
      tooken()
        .then(res => {
          this.tookenId = res.data.id;
        })
        .catch(err => {
          console.log(err);
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //获取项目列表表格
    getProjectTable(val) {
      if (val) {
        this.tableLoading = false;
      } else {
        this.tableLoading = true;
      }
      var params = {
        code: this.listCode,
        memberId: this.userinfo.memberid,
        pageNum: this.page.pageNum,
        //每页显示条数
        pageSize: this.page.pageSize,
        fieldName: this.fieldName != "" ? this.fieldName : undefined,
        content: this.fieldContent != "" ? this.fieldContent : undefined,
        sortFieldName:
          this.sortFieldName != "" ? this.sortFieldName : undefined,
        sort: this.sort != null ? this.sort : undefined
      };
      if (this.cacheParams.fieldName && this.cacheParams.fieldName != "") {
        this.form.dicName = this.cacheParams.code;
        params = this.cacheParams;
      } else if (this.cacheParams.code != "waitMe") {
        this.form.dicName = this.cacheParams.code;
        params = params;
      }
      //获取项目列表信息
      projectListTabel("/sgpm/rest/api/server/pm/projects/item/dynamic", params)
        .then(res => {
          this.tableLoading = false;
          let result = res.data.data || [];
          this.tableData = res.data.data || [];
          this.page.total = res.data.meta.totalCount;
          this.$emit("totalCount", res.data.meta.totalCount);
          this.getOaStatus(result);
        })
        .catch(err => {
          console.log(err);
        });
    },

    getOaStatus(list) {
      list.forEach(item => {
        if (item.processId) {
          oaStatus(`/flow/state/${item.processId}?token=${this.tookenId}`, null)
            .then(res => {
              // console.log(res.data);
              item.auditStatus = this.oaConfig[res.data];
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          item.auditStatus = "登记待提交";
        }
      });
    },
    selectChange(val) {
      this.form.dicName = val;
      //切换查询条件后页数从第一页开始
      this.page.pageNum = 1;
      this.$refs.refTable.clearFilter();
      this.fieldContent = undefined;
      this.fieldName = undefined;
      this.sort = undefined;
      this.sortFieldName = undefined;
      this.setCacheParams({});
      this.getProjectTable();
    },
    handleSizeChange(val) {
      this.getProjectTable();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getProjectTable();
    },
    filterHandler(value, row, column) {
      if (column.filteredValue.length != 0) {
        // console.log("走接口");
        this.fieldName = column.property;
        this.fieldContent = column.filteredValue;
        this.sort = undefined;
        this.sortFieldName = undefined;
        this.setCacheParams({});
        this.getProjectTable();
        this.$refs.refTable.clearFilter();
      }
    },
    clearFilter() {
      this.$refs.refTable.clearFilter();
      this.fieldContent = undefined;
      this.fieldName = undefined;
      this.sort = undefined;
      this.sortFieldName = undefined;
      this.form.dicName = "All";
      this.setCacheParams({});
      this.getProjectTable();
    },
    handleSortChange(column, prop, order) {
      this.sortFieldName = column.prop;
      this.sort = column.order == "ascending" ? 1 : 2;
      this.fieldName = undefined;
      this.fieldContent = undefined;
      this.getProjectTable();
      // console.log(this.listConfig);
    },
    handleSelectionChange(val) {
      if (val) {
        this.isPass = false;
        this.isReject = false;
        var status = val.auditStatus || "";
        this.editorBtnMark = status;
        // this.isStart = val.projectStatus === "已登记";
        this.isStart = val.auditStatus != "登记已审核";
        this.isRecall = status !== "审核中";
        this.isWaitMeBtn = false;
      }
      if (status == "登记待提交") {
        this.isEditor = false;
      } else {
        this.isEditor = true;
      }
      this.multipleSelection = val;
      // console.log(this.multipleSelection);
    },

    handleCell(row, column, cell, event) {
      if (cell.cellIndex === 3) {
        //d_care_id 如果有就说明是已关注的项目进行取消，如果没有就是添加关注
        let param = {
          id: row.d_care_id,
          user_id: this.userinfo.memberid,
          project_id: row.id
        };
        if (row.d_care_id) {
          this.$message({
            message: "取消关注",
            type: "success"
          });
          cell.firstChild.firstChild.className = "el-icon-star-on startGrey";
        } else {
          this.$message({
            message: "关注成功",
            type: "success"
          });
          cell.firstChild.firstChild.className = "el-icon-star-on startYellow";
        }
        care("/sgpm/rest/api/server/pm/project/care", param)
          .then(res => {
            if (res.data.code == 200) {
              this.getProjectTable("care");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //通过项目id获取项目信息进行编辑或者查看
    getProjectMsyById() {
      // console.log(this.multipleSelection);
      let projectId = this.multipleSelection.id;
      //编辑是根据jumpType来判断跳转那种项目 1，是商机项目，2，是合同项目，3，是子项目
      let jumpType = this.multipleSelection.jumpType;
      let audit_status = this.multipleSelection.audit_status;
      if (!jumpType) {
        this.$message({
          message: "不能跳转",
          type: "warning"
        });
      }
      //通过项目id获取项目基本信息
      projectMsgById(
        `/sgpm/rest/api/server/pm/project?projectId=${projectId}`,
        null
      )
        .then(res => {
          let result = res.data.data;
          // console.log(result);
          let obj = this.updateJsonData(result);
          // console.log(obj);
          // localStorage.setItem("projectMsg", JSON.stringify(obj));

          //
          setTimeout(() => {
            Bus.$emit("audit", { obj, projectId });
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
      if (
        jumpType == 1 &&
        audit_status != 20 &&
        audit_status != 21 &&
        audit_status != 22
      ) {
        this.$router.push({
          name: "/Businessproject",
          params: {
            id: this.multipleSelection.id
          }
        });
      } else if (
        jumpType == 2 &&
        audit_status != 20 &&
        audit_status != 21 &&
        audit_status != 22
      ) {
        this.$router.push({
          name: "/contractproject",
          params: {
            id: this.multipleSelection.id
          }
        });
      } else if (
        jumpType == 3 &&
        audit_status != 20 &&
        audit_status != 21 &&
        audit_status != 22
      ) {
        this.$router.push({
          name: "/childproject",
          params: {
            id: this.multipleSelection.id
          }
        });
      } else if (
        audit_status == 20 ||
        audit_status == 21 ||
        audit_status == 22
      ) {
        this.$router.push({
          name: "/projectstart",
          params: {
            id: this.multipleSelection.id,
            category: this.multipleSelection.jumpType,
            judgestart: 99
          }
        });
      }
    },
    //通过projectId获取的数据拆分
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

    //确定撤回
    handleRecall() {
      alert("撤回了");
      this.dialogVisible = false;
    },
    //打开审核的弹框
    openExamineDialog() {
      this.examineDialog = true;
      let multipleSelection = this.multipleSelection;
      let accountId = this.userinfo.account_id;
      auditRecord(
        `/sgpm/rest/api/integration/audit/record?accountId=${accountId}&processId=${multipleSelection.processId}&type=${multipleSelection.jumpType}`,
        null
      )
        .then(res => {
          let resultData = res.data.data;
          let result = JSON.parse(JSON.stringify(resultData));

          let ary = result.forEach(item => {
            //如果是modify为0 不可编辑
            if (item.modify == 0) {
              item.content.forEach(jtem => {
                jtem["disabled"] = true;
              });
              item["isAuditComment"] = true;
            } else {
              item.user.userName = this.userinfo.emp_name;
              // console.log(item);
            }
          });
          // console.log(resultData);
          this.tableData1 = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存审核意见
    confirmPass(val) {
      let list = JSON.parse(JSON.stringify(this.tableData1));
      let param = {};
      list.forEach(item => {
        if (item.modify == 1) {
          param = item;
          item.isAudit = 1;
        }
      });
      param.projectId = this.multipleSelection.id;
      param.memberId = this.userinfo.memberid;
      param.attitude = val;
      param.projectNumber = this.multipleSelection.projectNum;
      saveAuditRecord("/sgpm/rest/api/integration/audit/record", param)
        .then(res => {
          // console.log(res);
          this.getProjectTable();
          this.$message({
            message: "审核已经提交",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.examineDialog = false;
    },
    // 驳回审核意见
    rejectedHandle(val) {
      let list = JSON.parse(JSON.stringify(this.tableData1));
      let param = {};
      list.forEach(item => {
        if (item.modify == 1) {
          param = item;
          item.isAudit = 1;
        }
      });
      param.projectId = this.multipleSelection.id;
      param.memberId = this.userinfo.memberid;
      param.attitude = val;
      param.isPass = val;
      param["login_name"] = this.userinfo.login_name;
      param.projectNumber = this.multipleSelection.projectNum;
      saveAuditRecord("/sgpm/rest/api/integration/audit/record", param)
        .then(res => {
          this.getProjectTable();
          this.$message({
            message: "审核已经提交",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.examineDialog = false;
    },
    detail() {
      this.setDetailPage(true);
      this.getProjectMsyById();
    },
    //临时到oa里面去审批
    openTemporaryDialog() {
      // this.dialogTemporaryVisible = true;
      this.examineDialog = true;
    },
    TemporaryConfirm() {
      this.dialogTemporaryVisible = false;
      window.open("http://oa.supermap.cn/seeyon/index.jsp");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form--label-top .el-form-item__label {
  float: left;
}

.el-popper {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-table-filter__checkbox-group label.el-checkbox {
  margin: 0 0 0 0;
}
.list-container {
  padding: 0 15px 0 15px;
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
    .btn-item {
      display: flex;
      justify-content: flex-end;
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
  }

  .right {
    float: right;
  }

  .page {
    margin: 20px 0 0 0;
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
}
</style>
