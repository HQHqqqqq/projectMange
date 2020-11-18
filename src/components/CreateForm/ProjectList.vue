<template>
  <div class="list-container">
    <div class="header">
      <el-form ref="form" :model="form" size="mini" :inline="true" class="search-form">
        <div class="search-left">
          <el-form-item label="查看范围">
            <el-select v-model="form.dicName" size="mini" placeholder="查看范围" @change="selectChange">
              <el-option :label="item.dicName" :value="item.dicCode" v-for="item in selectAry" :key="item.dicCode">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search-right">
          <el-form-item>
            <el-input v-model="form.keyWord" placeholder="项目名称/项目/合同编号/项目关键字" size="mini">
              <el-button slot="append" icon="el-icon-search" @click="keyWordSearch"></el-button>
            </el-input>
          </el-form-item>
          <el-button size="mini" type="primary" @click="advancedDialogOpen">高级查询</el-button>
          <el-dropdown size="mini" split-button type="primary" @command="handleCommandAdd">
            登记
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">{{
                dropdownName
              }}</el-dropdown-item>

              <el-dropdown-item command="b" v-show="!isAlready">已签合同项目</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" type="primary" @click="projectStartHandle" :disabled="!isStart">启动</el-button>
          <el-dropdown size="mini" split-button type="primary" @command="dropdownJX">
            结项
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="d" :disabled="isFinish">项目结项</el-dropdown-item>
              <el-dropdown-item command="b" :disabled="isContractFinish">合同结项</el-dropdown-item>
              <el-dropdown-item command="c" :disabled="isAbnormalJX">异常结项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button type="primary" icon="el-icon-refresh" size="mini" circle class="circle-btn" @click="clearFilter">
          </el-button>
          <el-popover placement="right" width="200" trigger="click" class="popover" @show="popoverShow"
            @hide="popoverHide">
            <el-checkbox v-model="item.isShow" v-for="item in listConfig" :key="item.key" class="popover-checkbox">
              {{ item.label }}</el-checkbox>
            <el-button type="primary" icon="el-icon-menu" slot="reference" size="mini" circle class="circle-btn">
            </el-button>
          </el-popover>
        </div>
        <!-- <el-row :gutter="5" type="flex" justify="space-between" class="one-row"></el-row>
        <el-row :gutter="5" type="flex" justify="space-between">
          <el-col :md="10" :xl="9" :sm="10" :lg="8">
            <el-form-item label="查看范围">
              <el-select
                v-model="form.dicName"
                size="mini"
                placeholder="查看范围"
                @change="selectChange"
              >
                <el-option
                  :label="item.dicName"
                  :value="item.dicCode"
                  v-for="item in selectAry"
                  :key="item.dicCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="14" :xl="9" :sm="14" :lg="14">
            <div class="header-search">
              <el-form-item>
                <el-input v-model="form.keyWord" placeholder="项目名称/项目/合同编号" size="mini">
                  <el-button slot="append" @click="keyWordSearch">
                    <i class="icon-search"></i>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-dropdown size="mini" split-button type="primary" @command="handleCommandAdd">
                项目审批
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">未签合同项目</el-dropdown-item>
                  <el-dropdown-item command="b" :disabled="isAlready">已签合同项目</el-dropdown-item>
                  <el-dropdown-item command="c" :disabled="!isStart">项目启动</el-dropdown-item>
                  <el-dropdown-item command="d" :disabled="isFinish">项目结项</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button size="mini" type="primary" @click="advancedDialogOpen">高级</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" circle class="circle-btn"
                @click="clearFilter"></el-button>
              <el-popover placement="right" width="200" trigger="click" class="popover" @show="popoverShow"
                @hide="popoverHide">
                <el-checkbox v-model="item.isShow" v-for="item in listConfig" :key="item.key" class="popover-checkbox">
                  {{item.label}}</el-checkbox>
                <el-button type="primary" icon="el-icon-menu" slot="reference" size="mini" circle class="circle-btn">
                </el-button>
              </el-popover>
            </div>
          </el-col>
        </el-row> -->
      </el-form>
    </div>

    <el-table :data="tableData" class="father-pro-table" highlight-current-row border ref="refTable"
      v-loading="tableLoading" min-width="30" :max-height="asideHeight" :header-cell-style="{
        fontSize: '14px',
        color: '#303133',
        height: '51px',
        padding: 0,
        backgroundColor: '#ccd1d5'
      }" :row-style="{ height: '50px' }" :cell-style="{ padding: 0 }" @cell-click="handleCell"
      @current-change="handleSelectionChange" @sort-change="handleSortChange" @header-dragend="headerDragend"
      style="width: 100%;margin-bottom: 10px;" row-key="id" default-expand-all
      :tree-props="{ children: 'son_project', hasChildren: 'hasChildren' }">
      <!-- <el-table-column width="50"></el-table-column> -->

      <el-table-column type="index" width="38" align="center" label="序号" :fixed="checkFixed"></el-table-column>
      <el-table-column label="项目名称" width="140" align="center" :fixed="checkFixed" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="{
              name: '/projectInformation',
              params: {
                id: scope.row.id,
                category: scope.row.jumpType,
                projectName: scope.row.name,
                projectNumber: scope.row.projectNum,
                parent_id: scope.row.parent_id,
                company_id: scope.row.company_id,
                judgeproject: '项目信息',
              }
            }">
            <span class="num">{{ scope.row.name }}</span></router-link>
        </template>
      </el-table-column>
      <el-table-column width="38" label="进度" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.delayPercentage | formatTip" placement="right">
            <div class="progress progress-red" v-if="scope.row.color == 1"></div>
            <div class="progress progress-yellow" v-if="scope.row.color == 2"></div>
            <div class="progress progress-green" v-if="scope.row.color == 3"></div>
            <div class="progress" v-if="scope.row.color == null"></div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="38" label="关注" align="center">
        <template slot-scope="scope">
          <i class="el-icon-star-on startGrey" :class="{
              'el-icon-star-on': isCared ? isCared : scope.row.isCare,
              startYellow: isCared ? isCared : scope.row.isCare
            }"></i>
        </template>
      </el-table-column>

      <el-table-column width="110" label="审核进度" align="center">
        <template slot-scope="scope">
          <span>{{ auditConfig[scope.row.audit_status] }}</span>
        </template>
      </el-table-column>

      <el-table-column :prop="val.key" header-align="center" :align="
          val.key == 'contractAmount' ||
          val.key == 'backMoney' ||
          val.key == 'totalBudget' ||
          val.key == 'totalCost' ||
          val.key == 'predictGrossProfit' ||
          val.key == 'curGrossProfit' ||
          val.key == 'predictNetPorfit' ||
          val.key == 'curNetPorfit'
            ? 'right'
            : 'center'
        " :label="val.label" v-for="(val, index) in listConfig" :key="index" width="170" v-if="val.isShow"
        :sortable="val.sortable ? val.sortable : null" :filters="val.filters ? val.filters : null"
        :filter-method="val.filters ? filterHandler : null">
        <template slot-scope="scope">
          <span v-if="val.isShow && val.isQfw == 1">{{
            scope.row[val.key] == null
              ? "--"
              : scope.row[val.key] | formatThousands
          }}</span>
          <span v-if="val.isShow && val.isPercent">{{
            scope.row[val.key] == null
              ? "--"
              : Math.round(scope.row[val.key] * 100) + "%"
          }}</span>
          <span v-if="val.isShow && val.isPercentNot100">{{
            scope.row[val.key] == null
              ? "--"
              : Math.round(scope.row[val.key]) + "%"
          }}</span>
          <span v-if="
              val.isShow &&
                val.isQfw != 1 &&
                !val.isPercent &&
                !val.isPercentNot100
            ">{{ scope.row[val.key] == null ? "--" : scope.row[val.key] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="高级筛选" v-dialogDrag :visible.sync="advancedDialog" width="51%" center>
      <div class="dialog-wrap">
        <div class="wrap-left">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="200px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key"
              :prop="'domains.' + index + '.value'" size="mini">
              <el-select v-model="domain.value" placeholder="请选择查询字段" @change="advancedChange(domain.value, index)">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) in advancedOptions"
                  :key="index">
                </el-option>
              </el-select>
              <el-select v-model="domain.value1" :disabled="domain.isDisabled" filterable multiple placeholder="请选择">
                <el-option v-for="(item, index) in advancedList" :key="index" :label="item.label" size="mini"
                  :value="item.label"></el-option>
              </el-select>
              <el-button type="text" @click.prevent="
                  removeDomain(domain, dynamicValidateForm.domains.length)
                " class="btn-item">
                <i class="el-icon-remove btn-del"></i>
              </el-button>
              <el-button type="text" @click.prevent="addDomain" class="btn-item">
                <i class="el-icon-circle-plus btn-plus"></i>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="wrap-right">
          <div class="grid-content bg-purple">
            <el-checkbox-group v-model="dynamiCheckList">
              <el-checkbox label="可启动"></el-checkbox>
              <el-checkbox label="可结项"></el-checkbox>
              <el-checkbox label="本月未Review"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="advancedDialog = false" size="mini">取消</el-button>
        <el-button type="primary" @click="advancedConfirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>

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
  advancedCondition
} from "../../api/api.js";
import config from "../../config";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
import _ from "lodash";

export default {
  name: "ProjectList",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      isContractFinish: true,
      //异常结项按钮是否显示
      isAbnormalJX: true,
      isPname: true,
      btnMaxWidth: 180,
      dynamiCheckList: [],
      isGZ: false, //是否关注
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
        { key: "projectNum", label: "项目编号", isShow: true },
        { key: "levelOneName", label: "实施B级单位", isShow: true },
        { key: "levelTwoName", label: "实施C级单位", isShow: false },
        { key: "projectManager", label: "项目经理", isShow: true },
        { key: "customerCenter", label: "销售B级单位", isShow: true },
        { key: "customerDepartment", label: "销售C级单位", isShow: false },
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
        { key: "contractNumber", label: "合同编号", isShow: true },
        { key: "keyword", label: "关键字", isShow: true },
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
          sortable: "custom"
        },
        {
          key: "outsourcePaymentRate",
          label: "外包支付率",
          isShow: true,
          isPercentNot100: true, //是否为百分比
          sortable: "custom"
        },
        {
          key: "returnmoneypercentage",
          label: "回款率",
          isShow: true,
          isPercent: true, //是否为百分比
          // isPercentNot100: true, //是否为百分比
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
        { key: "company_name", label: "A级单位", isShow: false }

        // { key: "description", label: "项目描述", isShow: true },
        // { key: "contractType", label: "合同类型", isShow: true },
        // { key: "milestone", label: "当前里程碑", isShow: true },
      ],
      //是否已签合同
      isAlready: false,
      //是否启动
      isStart: false,
      //是否结项
      isFinish: true,

      multipleSelection: [],
      advancedOptions: config.advancedOptions,
      advancedMultiples: {},
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
      proParams: {},
      tableData1: [
        {
          role: "公司PMO专员意见",
          content: [
            {
              msgText: "项目登记信息规范完整",
              model: "2",
              disabled: true
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
        32: "工作结项已审核",
        40: "合同结项待提交",
        41: "合同结项审核中",
        42: "合同结项已审核",
        50: "异常结项待提交",
        51: "异常结项审核中",
        52: "异常结项已审核"
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
      "cacheParams", //项目列表查询条件缓存条件
      "gjFromModel",
      "gjFromCheckList"
    ]),
    projectType() {
      return this.datas.options.pro_type;
    },
    headerAlign(val) {},
    listCode() {
      return this.form.dicName;
    },
    asideHeight: function() {
      return document.documentElement.clientHeight - 230;
    },
    dropdownName() { 
      return this.userinfo.account_id == "-1814768306395265967" || this.userinfo.account_id == "7638091599462351621"||
        this.userinfo.account_id == "8416498716893399290"
        ? "项目登记"
        : "未签合同项目";
    }
  },
  mounted() {
    this.init();
      if(this.userinfo.account_id == "8416498716893399290"){//南康
        this.listConfig=config.projectTableConfigNk
      }else if(this.userinfo.account_id == "-1814768306395265967"){//国图
        this.listConfig=config.projectTableConfigGT
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
    //项目启动
    projectStartHandle() {
      localStorage.removeItem("projectMsg");
      this.setDetailPage(false);
      sessionStorage.setItem("isRevoke", 2);
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");

      localStorage.removeItem("globalParams");
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      localStorage.setItem("proId", this.multipleSelection.id);
      this.$router.push({
        path: "projectstart",
        query: {
          id: this.multipleSelection.id,
          category: this.multipleSelection.jumpType,
          judgestart: 99
        }
      });
    },
    init() {
      if (
        this.userinfo.account_id == "-1814768306395265967" ||
        this.userinfo.account_id == "8416498716893399290"||
        this.userinfo.account_id == "7638091599462351621"
      ) {
        //说明是国图的人或者南康或者安图
        this.isAlready = true;
      } else {
        this.isAlready = false;
      }
      this.getProjectTable();
      //下拉选框
      this.getSelectList();
    },
    advancedConfirm() {
      console.log(this.dynamiCheckList);
      var isStartObj = {
        isStart: this.dynamiCheckList
      };
      this.setCacheParams({});
      let array = this.dynamicValidateForm.domains;
      let obj = {};
      array.forEach(item => {
        if (item.value1.length > 0) {
          obj[item.value] = item.value1;
        }
      });

      if (this.dynamiCheckList.length > 0) {
        obj = Object.assign(obj, isStartObj);
      }
      this.advancedMultiples = obj;
      let params = {
        code: this.listCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        memberId: this.userinfo.memberid,
        fieldName: this.fieldName,
        content: this.fieldContent,
        multiples: this.advancedMultiples,
        sortFieldName: this.sortFieldName,
        sort: this.sort == "ascending" ? 1 : 2
      };
      this.getProjectTable(params);
      this.setGJFromModel(this.dynamicValidateForm);
      this.setGJFromCheck(isStartObj);
      this.advancedDialog = false;
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
    getProjectTable(val) {
      if (this.isGZ) {
        this.tableLoading = false;
      } else {
        this.tableLoading = true;
      }

      this.isStart = false;
      this.isFinish = true;
      this.isContractFinish = true;
      this.isAbnormalJX = true;
      var params = this.cacheParams;
      if (val) {
        params = val;
      } else {
        if (JSON.stringify(params) == "{}") {
          params = { code: "All", pageNum: 1, pageSize: 20 };
        }
        params = Object.assign(params, {
          memberId: this.userinfo.memberid
        });
        this.form.keyWord = params.keyWord;
        this.form.dicName = params.code;
      }

      //获取项目列表信息
      projectListTabel("/sgpm/rest/api/server/pm/projects/item/dynamic", params)
        .then(res => {
          this.tableLoading = false;
          let result = res.data.data || [];
          this.tableData = res.data.data || [];
          this.page.total = res.data.meta.totalCount;
          this.setCacheParams(params);
        })
        .catch(err => {
          console.log(err);
        });
    },
    keyWordSearch() {
      let params = {
        code: this.listCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        memberId: this.userinfo.memberid,
        keyWord: this.form.keyWord.trim(),
        fieldName: this.fieldName,
        content: this.fieldContent,
        multiples: this.advancedMultiples,
        sortFieldName: this.sortFieldName,
        sort: this.sort == "ascending" ? 1 : 2
      };
      this.getProjectTable(params);
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
    selectChange(val) {
      let params = {
        code: this.listCode,
        memberId: this.userinfo.memberid,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        memberId: this.userinfo.memberid
      };
      this.getProjectTable(params);
    },
    handleCurrentChange(val) {
      let params = {
        code: this.listCode,
        memberId: this.userinfo.memberid,
        pageNum: val,
        pageSize: this.page.pageSize,
        memberId: this.userinfo.memberid,
        keyWord: this.form.keyWord,
        fieldName: this.fieldName,
        content: this.fieldContent,
        multiples: this.advancedMultiples,
        sortFieldName: this.sortFieldName,
        sort: this.sort == "ascending" ? 1 : 2
      };
      this.getProjectTable(params);
    },
    filterHandler(value, row, column) {
      if (column.filteredValue.length != 0) {
        this.fieldName = column.property;
        this.fieldContent = column.filteredValue;

        let params = {
          code: this.listCode,
          memberId: this.userinfo.memberid,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          memberId: this.userinfo.memberid,
          fieldName: column.property,
          content: column.filteredValue,
          multiples: this.advancedMultiples
        };
        this.getProjectTable(params);
        this.$refs.refTable.clearFilter();
      }
    },
    clearFilter() {
      this.$refs.refTable.clearFilter();
      this.form.keyWord = "";
      this.form.dicName = "All";
      this.advancedMultiples = {};
      this.dynamiCheckList = [];
      this.setGJFromModel({
        domains: [{ value: "", value1: [], isDisabled: false }]
      });
      this.setGJFromCheck([]);
      let params = {
        code: "All",
        pageNum: 1,
        pageSize: 20,
        memberId: this.userinfo.memberid,
        multiples: {}
      };
      this.getProjectTable(params);
    },
    handleSortChange(column, prop, order) {
      this.sortFieldName = column.prop;
      this.sort = column.order == "ascending" ? 1 : 2;
      let params = {
        code: this.listCode,
        memberId: this.userinfo.memberid,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        keyWord: this.form.keyWord,
        sortFieldName: column.prop,
        sort: column.order == "ascending" ? 1 : 2,
        multiples: this.advancedMultiples
      };
      this.getProjectTable(params);
    },
    handleSelectionChange(val) {
      localStorage.setItem("projectInfo", JSON.stringify(val));
      if (val) {
        var status = val.auditStatus || "";
        //判断启动是否可点    如果是登记已审核(状态12==已登记)可以启动并且销售经理为登录人
        this.isStart =
          val.audit_status == 12 &&
          this.userinfo.emp_name == val.projectManager;
        //判断项目结项的是否可点条件 状态,启动已审核_22并且实施进度为100%且销售经理为登录人或状态为工作结项待提交_30，工作结项审核中_31 允许点
        var _isFinish =
          (val.percentageComplete * 100 == 100 &&
            val.audit_status == 22 &&
            this.userinfo.emp_name == val.projectManager) ||
          (val.audit_status == 30 &&
            this.userinfo.emp_name == val.projectManager);

        this.isFinish = !_isFinish; //满足条件取反
        //判断合同结项是否可点  回款率和外包支付率100% 销售人员_contractMarket是登录人,
        //审核状态不是待审的（除了登记审核中，启动审核中，工作结项审核中，合同结项审核中，合同结项已审核，异常结项审核中）
        var _isContractFinish =
          Number.parseInt(val.outsourcePaymentRate) == 100 &&
          Number.parseInt(val.returnmoneypercentage) == 1 &&
          val.audit_status != 11 &&
          val.audit_status != 21 &&
          val.audit_status != 31 &&
          val.audit_status != 40 &&
          val.audit_status != 41 &&
          val.audit_status != 42 &&
          val.audit_status != 51;
        this.userinfo.emp_name == val.contractMarket;

        this.isContractFinish = !_isContractFinish;

        //异常结项是否可点条件    (状态>12&&!=21,31,41,50）并且登录人是项目经理异常结项
        var registerUseryc =
          this.userinfo.account_id == "-1814768306395265967"
            ? val.projectManager
            : val.contractMarket; //国图用户异常结项发起是项目经理其他都是销售
        var _isAbnormalJX =
          val.audit_status > 12 &&
          val.audit_status != 21 &&
          val.audit_status != 31 &&
          val.audit_status != 41 &&
          val.audit_status != 50 &&
          val.audit_status != 51 &&
          val.audit_status != 52 &&
          this.userinfo.emp_name == registerUseryc;
        this.isAbnormalJX = !_isAbnormalJX;
      }

      this.multipleSelection = val;
    },
    handleCommandAdd(val) {
      localStorage.removeItem("projectMsg");
      this.setDetailPage(false);
      sessionStorage.setItem("isRevoke", 2);
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      if (val == "a") {
        localStorage.removeItem("businessProjectId");
        localStorage.removeItem("globalParams");
        this.$router.push({
          path: "Businessproject",
          query: {
            judgelogo: val
          }
        });
      } else if (val == "b") {
        localStorage.removeItem("businessProjectId");
        localStorage.removeItem("globalParams");
        this.$router.push({
          path: "Contractproject",
          query: {
            judgelogo: val
          }
        });
      } else if (val == "c") {
        localStorage.removeItem("globalParams");
        localStorage.removeItem("keyWords");
        localStorage.removeItem("keytechnologys");
        localStorage.setItem("proId", this.multipleSelection.id);
        this.$router.push({
          name: "/projectstart",
          params: {
            id: this.multipleSelection.id,
            category: this.multipleSelection.jumpType,
            judgestart: 99
          }
        });
      } else if (val == "d") {
        console.log(this.multipleSelection);
        if (
          this.userinfo.account_id == "-1360422574114386809" ||
          this.userinfo.account_id == "5326994013938795629"
        ) {
          //超图
          this.$router.push({
            path: "nonContractual",
            query: {
              id: this.multipleSelection.id,
              judgelogo: val,
              projectNum: this.multipleSelection.projectNum
            }
          });
        } else if (this.userinfo.account_id == "8416498716893399290") {
          //南康
          this.$router.push({
            path: "gtNonContractual",
            query: {
              id: this.multipleSelection.id,
              judgelogo: val,
              projectNum: this.multipleSelection.projectNum
            }
          });
        } else if (this.userinfo.account_id == "-1814768306395265967") {
          //国图
          this.$router.push({
            path: "gtNonContractual",
            query: {
              id: this.multipleSelection.id,
              judgelogo: val,
              projectNum: this.multipleSelection.projectNum
            }
          });
        }
      }
    },

    //结项
    dropdownJX(val) {
      localStorage.removeItem("projectMsg");
      this.setDetailPage(false);
      sessionStorage.setItem("isRevoke", 2);
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      if (val == "d") {
        //项目结项
        if (
          this.userinfo.account_id == "-1360422574114386809" ||
          this.userinfo.account_id == "5326994013938795629"
        ) {
          //超图
          this.$router.push({
            path: "nonContractual",
            query: {
              id: this.multipleSelection.id,
              judgelogo: val,
              projectNum: this.multipleSelection.projectNum
            }
          });
        } else if (
          this.userinfo.account_id == "8416498716893399290" ||
          this.userinfo.account_id == "-1814768306395265967" ||
          this.userinfo.account_id == "7638091599462351621"
        ) {
          //南康 国图 安图
          this.$router.push({
            path: "gtNonContractual",
            query: {
              id: this.multipleSelection.id,
              judgelogo: val,
              projectNum: this.multipleSelection.projectNum
            }
          });
        }
      } else if (val == "b") {
        //合同结项
        this.$router.push({
          path: "contractFinish",
          query: {
            id: this.multipleSelection.id,
            judgelogo: val,
            projectNum: this.multipleSelection.projectNum
          }
        });
      } else if (val == "c") {
        //异常结项
        this.$router.push({
          path: "abnormalProject",
          query: {
            id: this.multipleSelection.id,
            judgelogo: val,
            projectNum: this.multipleSelection.projectNum
          }
        });
      }
    },
    //启动项目
    startPorject(e) {
      localStorage.removeItem("globalParams");
      localStorage.removeItem("keyWords");
      localStorage.removeItem("keytechnologys");
      localStorage.setItem("proId", this.multipleSelection.id);
      this.$router.push({
        name: "/projectstart",
        params: {
          id: this.multipleSelection.id,
          category: this.multipleSelection.jumpType,
          judgestart: 99
        }
      });
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
              this.isGZ = true;
              this.getProjectTable({
                code: "All",
                pageNum: 1,
                pageSize: 20,
                memberId: this.userinfo.memberid,
                multiples: {}
              });
              this.isGZ = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item, size) {
      if (size == 1) {
        this.dynamicValidateForm.domains.splice(index, 1);
        this.dynamicValidateForm.domains.push({
          value: "",
          value1: "",
          isDisabled: false
        });
        return;
      }
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: ""
      });
      this.dynamicValidateForm.domains.forEach((item, index) => {
        if (this.dynamicValidateForm.domains.length - 1 == index) {
          item.isDisabled = false;
        } else {
          item.isDisabled = true;
        }
      });
    }
  }
};
</script>
<style lang="scss">
  .list-container {
    .el-form-item__content .el-input-group{
      width: 255px;
    }
  }
</style>
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
  padding: 0 15px 10px 15px;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .header {
    .circle-btn {
      border-radius: 5px;
    }
    .one-row {
      margin: 10px 0;
    }
    .header-search {
      float: right;
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
    position: relative;
    .btn-del,
    .btn-plus {
      font-size: 18px;
      color: #409eff;
      top: 2px;
    }
  }
  .pname {
    // max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dialog-wrap {
    display: flex;
    .wrap-left {
      width: 75%;
      display: flex;
      justify-content: center;
      border-right: 1px solid #dbdbdb;
      .el-form-item__content {
        line-height: 2px;
      }
    }
    .wrap-right {
      width: 25%;
      display: flex;
      justify-content: center;
    }
    .bg-purple {
      width: 116px;
    }
    .btn-item {
      margin: 0 0 0 4px;
    }
  }
  .search-form {
    display: flex;
    padding: 20px 0 10px 0;
    .search-left {
      width: 30%;
    }
    .search-right {
      width: 70%;
      text-align: right;
    }
  }
}
</style>
