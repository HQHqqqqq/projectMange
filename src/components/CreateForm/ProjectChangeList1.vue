<template>
  <div class="list-container">
    dddd
    <div class="header">
      <el-form ref="form" :model="form" :inline="true" size="mini" class="list-form">
        <el-row :gutter="5" type="flex" justify="space-between" class="one-row"></el-row>
        <el-row :gutter="5" type="flex" justify="space-between">
          <el-col :md="24" :xl="24" :sm="14" :lg="24">
            <div class="header-search">
              <el-form-item>
                <el-input v-model="form.keyWord" placeholder="项目名称/项目/合同编号" size="mini">
                  <el-button slot="append" @click="keyWordSearch">
                    <i class="icon-search"></i>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-button size="mini" type="primary" @click="advancedDialogOpen">高级查询</el-button>
              <el-button type="primary" size="mini" @click="managerChange">项目经理变更</el-button>
              <el-button type="primary" size="mini" @click="statusChange">项目状态变更</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" circle class="circle-btn"
                @click="clearFilter"></el-button>
              <el-popover placement="right" width="200" trigger="click" class="popover" @show="popoverShow"
                @hide="popoverHide">
                <el-checkbox v-model="item.isShow" v-for="item in listConfig" :key="item.key" class="popover-checkbox">
                  {{item.label}}</el-checkbox>
                <!-- <el-button size="mini" type="primary" slot="reference">显示字段</el-button> -->
                <el-button type="primary" icon="el-icon-menu" slot="reference" size="mini" circle class="circle-btn">
                </el-button>
              </el-popover>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" class="father-pro-table" highlight-current-row border :height="asideHeight"
      ref="refTable" v-loading="tableLoading"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}" :cell-style="{padding:0}" @header-dragend="headerDragend"
      @current-change="handleSelectionChange" @sort-change="handleSortChange" @select="selectHandle"
      @select-all="selectAllHandle" style="width: 100%;margin-bottom: 10px;min-height: 400px;" row-key="id"
      default-expand-all :tree-props="{children: 'son_project', hasChildren: 'hasChildren'}">
      <el-table-column type="selection" width="34" align="center"></el-table-column>
      <el-table-column type="index" width="38" align="center" label="序号" :fixed="checkFixed"></el-table-column>

      <el-table-column :width="btnMaxWidth" label="项目名称" align="center" :fixed="checkFixed">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.name" placement="right">
            <el-button :class="{pname:isPname}" :style="{maxWidth: btnMaxWidth-30 + 'px'}" type="text">
              <router-link
                :to="{name:'/projectInformation', params:{ id: scope.row.id,category: scope.row.jumpType,projectName:scope.row.name,projectNumber:scope.row.projectNum,parent_id:scope.row.parent_id,judgeproject:'项目信息'}}">
                <span class="num">{{scope.row.name}}</span>
              </router-link>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="38" label="进度" align="center">
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
      <el-table-column width="38" label="关注" align="center">
        <template slot-scope="scope">
          <i class="el-icon-star-on startGrey"
            :class="{'el-icon-star-on':isCared?isCared:scope.row.isCare,'startYellow':isCared?isCared:scope.row.isCare}"></i>
        </template>
      </el-table-column>

      <el-table-column width="110" label="审核进度" align="center">
        <template slot-scope="scope">
          <span>{{auditConfig[scope.row.audit_status]}}</span>
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
      <el-table-column :prop="val.key" :label="val.label" v-for="(val,index) in listConfig" :key="index" align="center"
        v-if="val.isShow" :sortable="val.sortable?val.sortable:null" :filters="val.filters?val.filters:null"
        :filter-method="val.filters?filterHandler:null ">
        <template slot-scope="scope">
          <span
            v-if="val.isShow&&val.isQfw==1">{{ scope.row[val.key]==null?'--': scope.row[val.key]| formatThousands}}</span>
          <span v-if="val.isShow&&val.isPercent">{{ scope.row[val.key]==null?'--': scope.row[val.key]*100+'%'}}</span>
          <span
            v-if="val.isShow&&val.isQfw!=1&&!val.isPercent">{{ scope.row[val.key]==null?'--': scope.row[val.key]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="高级筛选" :visible.sync="advancedDialog" width="51%" center>
      <div class="dialog-wrap">
        <div class="wrap-left">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="200px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key"
              :prop="'domains.' + index + '.value'" size="mini">
              <el-select v-model="domain.value" placeholder="请选择查询字段" @change="advancedChange(domain.value,index)">
                <el-option :label="item.label" :value="item.value" v-for="(item,index) in advancedOptions" :key="index">
                </el-option>
              </el-select>
              <el-select v-model="domain.value1" :disabled="domain.isDisabled" filterable multiple placeholder="请选择">
                <el-option v-for="(item,index) in advancedList" :key="index" :label="item.label" size="mini"
                  :value="item.label"></el-option>
              </el-select>
              <el-button type="text" @click.prevent="removeDomain(domain,dynamicValidateForm.domains.length)"
                class="btn-item">
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
        <el-button @click="advancedDialog=false" size="mini">取消</el-button>
        <el-button type="primary" @click="advancedConfirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <div class="page right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="currentPage" :page-size="1" :page-sizes="[20]"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
    </div>
    <el-dialog title="项目经理变更" :visible.sync="managerChangeDialog" width="50%" center @close="managerChangeDialogClose"
      class="manager-dialog">
      <con-change @MarketSelectInfo="MarketSelectInfo" v-if="conditionManger"></con-change>

      <el-form ref="form" :model="managerForm" label-width="170px">
        <el-form-item label="公司名称">
          <el-input v-model="account_name" :disabled="true" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="subdept_name" :disabled="true" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="变更原因">
          <el-input v-model="managerForm.change_reason" style="width:60%"></el-input>
        </el-form-item>
        <p class="p-red" v-if="reminder">您选择的是管理团队，请选择实施C级单位</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="managerChangeDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="managerConfirm" :loading="btnLoding" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="项目状态变更" :visible.sync="statusChangeDialog" width="50%" center @close="statusChangeDialogClose"
      class="manager-dialog">
      <el-form ref="form" :model="statusForm" label-width="160px">
        <el-form-item label="项目状态">
          <el-select v-model="statusForm.after_name" placeholder="请选择项目状态" style="width:60%">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in statusOptionList" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更原因">
          <el-input v-model="statusForm.change_reason" placeholder="请输入变更原因" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusChangeDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="statusChangeConfirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
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
  userByMemberId,
  managerSubmit,
  statusSubmit
} from "../../api/api.js";
import config from "../../config";
import { mapState, mapActions } from "vuex";
import conChange from "../projectChange/components/conChange";
import Bus from "../../bus";

export default {
  name: "ProjectList",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {
    conChange
  },
  data() {
    return {
      isPname: true,
      depName: "",
      //经理名称
      btnMaxWidth: 190,
      empName: "",
      btnLoding: false,
      account_name: "", //公司名称
      subdept_name: "", //部门名称
      conditionManger: true,
      managerForm: {
        level_two_id: "",
        level_one_name: "",
        level_one_id: "",
        level_two_name: "",
        change_reason: ""
      },
      statusForm: {},
      form: {
        dicName: "All"
      },
      subdeptList: [],
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
        ]
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
        { key: "contractNumber", label: "合同编号", isShow: true },
        { key: "projectNum", label: "项目编号", isShow: false },
        { key: "levelOneName", label: "实施B级单位", isShow: true },
        { key: "levelTwoName", label: "实施C级单位", isShow: true },
        { key: "projectManager", label: "项目经理", isShow: true },
        { key: "customerCenter", label: "销售B级单位", isShow: true },
        { key: "customerDepartment", label: "销售C级单位", isShow: false },
        { key: "contractMarket", label: "销售人员", isShow: true },
        { key: "documentUpload", label: "文档是否上传", isShow: true },
        {
          key: "projectType",
          label: "项目类型",
          isShow: false,
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
          isShow: false,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "backMoney",
          label: "回款额",
          isShow: false,
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
          isShow: false,
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
          isShow: false,
          isPercent: true, //是否为百分比
          sortable: "custom"
        },

        {
          key: "totalBudget",
          label: "总预算",
          isShow: false,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "totalCost",
          label: "总成本",
          isShow: false,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "predictGrossProfit",
          label: "预计毛利润",
          isShow: false,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "curGrossProfit",
          label: "当前毛利润",
          isShow: false,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "predictNetPorfit",
          label: "预计净利润",
          isShow: false,
          isQfw: 1,
          sortable: "custom"
        },
        {
          key: "curNetPorfit",
          label: "当前净利润",
          isShow: false,
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
        { key: "ALevelCompany", label: "A级单位", isShow: false }

        // { key: "description", label: "项目描述", isShow: true },
        // { key: "contractType", label: "合同类型", isShow: true },
        // { key: "milestone", label: "当前里程碑", isShow: true },
      ],
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
        32: "工作结项已审核"
      },
      managerChangeDialog: false,
      //列表多选框list
      selectCheckoutAry: [],
      companyBaseInfo: {},
      statusChangeDialog: false,
      //项目状态list
      statusOptionList: [
        {
          value: 0,
          label: "已登记"
        },
        {
          value: 1,
          label: "运行中"
        },
        {
          value: 3,
          label: "暂停"
        },
        {
          value: 2,
          label: "完成"
        },
        {
          value: 4,
          label: "关闭"
        },
        {
          value: 5,
          label: "异常关闭"
        }
      ],
      reminder: false
    };
  },
  filters: {
    formatThousands: function (value) {
      if (value == "--") {
        return "--";
      }
      value = value / 10000;
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
    },
    formatTip: function (value) {
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
      handler: function (val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
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
      return this.form.dicName;
    },
    asideHeight: function () {
      return document.documentElement.clientHeight - 200;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions(["setDetailPage", "setCacheParams"]),
    init() {
      this.getProjectTable();
      //下拉选框
      this.getSelectList();
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.btnMaxWidth = newWidth;
      if (newWidth > 200) {
        this.isPname = false;
      } else {
        this.isPname = true;
        this.btnMaxWidth = 200;
      }
    },

    advancedConfirm() {
      this.setCacheParams({});
      let array = this.dynamicValidateForm.domains;
      let obj = {};
      array.forEach(item => {
        obj[item.value] = item.value1;
      });
      this.advancedMultiples = obj;
      this.getProjectTable();
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
        keyWord: this.form.keyWord,
        //每页显示条数
        pageSize: this.page.pageSize,
        fieldName: this.fieldName != "" ? this.fieldName : undefined,
        content: this.fieldContent != "" ? this.fieldContent : undefined,
        sortFieldName:
          this.sortFieldName != "" ? this.sortFieldName : undefined,
        sort: this.sort != null ? this.sort : undefined,
        multiples: this.advancedMultiples
      };
      if (this.cacheParams.fieldName && this.cacheParams.fieldName != "") {
        this.form.dicName = this.cacheParams.code;
        params = this.cacheParams;
      } else if (
        this.cacheParams.multiples != undefined &&
        JSON.stringify(this.cacheParams.multiples) != "{}"
      ) {
        params = this.cacheParams;
      } else if (this.cacheParams.code) {
        this.form.dicName = this.cacheParams.code;
        params.code = this.cacheParams.code;
      }
      // if (Object.keys(this.cacheParams).length > 0) {
      //   //判断对象是否为空
      //   this.form.dicName = this.cacheParams.code;
      //   params = this.cacheParams;
      // } else {
      //   params = params;
      // }
      //获取项目列表信息
      projectListTabel("/sgpm/rest/api/server/pm/projects/item/dynamic", params)
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
      this.getProjectTable();
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
      this.setCacheParams({});
      this.page.pageNum = val;
      this.getProjectTable();
    },
    filterHandler(value, row, column) {
      if (column.filteredValue.length != 0) {
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
      this.form.keyWord = "";
      this.fieldContent = undefined;
      this.fieldName = undefined;
      this.sort = undefined;
      this.sortFieldName = undefined;
      this.form.dicName = "All";
      this.dynamicValidateForm = {
        domains: [
          {
            value: "",
            value1: ""
          }
        ]
      };
      this.advancedMultiples = undefined;
      this.setCacheParams({});
      this.getProjectTable();
    },
    handleSortChange(column, prop, order) {
      this.sortFieldName = column.prop;
      this.sort = column.order == "ascending" ? 1 : 2;
      this.fieldName = undefined;
      this.fieldContent = undefined;
      this.getProjectTable();
      console.log(this.listConfig);
    },
    handleSelectionChange(val) {
      localStorage.setItem("projectInfo", JSON.stringify(val));

      if (val) {
        this.isPass = false;
        this.isReject = false;
        var status = val.auditStatus || "";
        this.editorBtnMark = status;
        //如果是登记已审核可以启动
        this.isStart =
          val.audit_status == 12 &&
          this.userinfo.emp_name == val.projectManager;
        this.isRecall = status !== "审核中";
        if (
          (val.audit_status == 30 ||
            val.audit_status == 31 ||
            val.audit_status == 32) &&
          this.userinfo.emp_name == val.projectManager
        ) {
          this.isFinish = true;
        } else if (
          val.percentageComplete * 100 == 100 &&
          (val.audit_status == 12 || val.audit_status == 22) &&
          this.userinfo.emp_name == val.projectManager
        ) {
          this.isFinish = false;
        } else {
          this.isFinish = true;
        }

        this.isWaitMeBtn = false;
      }
      if (status == "登记待提交") {
        this.isEditor = false;
      } else {
        this.isEditor = true;
      }
      this.multipleSelection = val;
      console.log(this.multipleSelection);
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
        console.log(this.multipleSelection);
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
        this.$router.push({
          path: "nonContractual",
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
      console.log(this.multipleSelection);
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
      if (cell.cellIndex === 4) {
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
    removeDomain(item) {
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
    },
    managerChange() {
      this.managerChangeDialog = true;
      this.conditionManger = true;
      this.managerForm = {};
    },
    //项目状态变更
    statusChange() {
      this.statusChangeDialog = true;
    },
    managerInfo(obj) {
      //companyBaseInfo 是公司部门用户的基本信息
      this.companyBaseInfo = obj;
      if (obj.departmentName == "管理团队") {
        this.reminder = true;
      } else {
        this.reminder = false;
      }
      console.log(obj);
      userByMemberId(
        `/sgpm/rest/api/system/user/department/part?memberId=${obj.memberId}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            this.managerForm.level_two_id =
              obj.departmentName != "管理团队" ? result.dept_id : "";
            this.managerForm.level_one_name = result.subdept_name; // B级部门
            this.managerForm.level_one_id = result.subdept_id; //B级部门id
            this.managerForm.level_two_name = result.dept_name;
            this.subdeptList = result.departments;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //勾选列表的多选框触发方法
    selectHandle(selection, row) {
      let projectIds = [];
      let levelTwoNameList = [];
      selection.forEach(item => {
        projectIds.push(item.id);
        levelTwoNameList.push(item.levelTwoName);
      });
      this.selectCheckoutAry = projectIds;
      if (selection.length == 1) {
        this.account_name = selection[0].levelTwoName;
        this.subdept_name = selection[0].levelOneName;
      } else {
        let names = Array.from(new Set(levelTwoNameList));
        if (names.length == 1) {
          this.account_name = selection[0].levelTwoName;
          this.subdept_name = selection[0].levelOneName;
        } else {
          this.account_name = "";
          this.subdept_name = "";
        }
      }
    },
    //全选
    selectAllHandle(selection) {
      let projectIds = [];
      selection.forEach(item => {
        projectIds.push(item.id);
      });
      this.selectCheckoutAry = projectIds;
    },
    managerConfirm() {
      this.btnLoding = true;
      if (this.selectCheckoutAry.length == 0) {
        this.$message({
          message: "请选择项目再提交",
          type: "warning"
        });
        this.btnLoding = false;
        return;
      } else if (this.depName == "管理团队") {
        this.$message({
          message: "您属于管理团队请选择c级部门再提交",
          type: "warning"
        });
        this.btnLoding = false;
        return;
      } else if (this.empName == "") {
        this.$message({
          message: "请选择变更经理",
          type: "warning"
        });
        this.btnLoding = false;
        return;
      }
      let obj = {
        project_ids: this.selectCheckoutAry,
        user_id: this.companyBaseInfo.memberId,
        operation_person: this.userinfo.emp_name
      };
      obj = Object.assign(obj, this.managerForm);
      managerSubmit(`/sgpm/rest/api/server/pm/project/manager/change`, obj)
        .then(res => {
          if (res.data.code == 200) {
            this.btnLoding = false;
            var result = res.data.data;
            this.$message({
              message: result,
              type: "success"
            });
            this.managerChangeDialog = false;
            this.getProjectTable();
          } else {
            // this.$message({
            //   message: result,
            //   type: "error"
            // });
            this.btnLoding = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deptNameChange(val) {
      let { level_one_id, level_one_name } = this.managerForm;
      this.subdeptList.filter(item => {
        if (item.deptId == val) {
          this.managerForm = {
            level_two_name: item.deptName,
            level_two_id: val,
            level_one_id,
            level_one_name
          };
        }
      });
      this.reminder = false;
    },
    statusChangeConfirm() {
      if (this.selectCheckoutAry.length == 0) {
        this.$message({
          message: "请选择项目再提交",
          type: "warning"
        });

        return;
      }

      let obj = {
        project_ids: this.selectCheckoutAry,
        operation_person: this.userinfo.emp_name
      };
      obj = Object.assign(obj, this.statusForm);
      statusSubmit(`/sgpm/rest/api/server/pm/project/status/change`, obj)
        .then(res => {
          if (res.data.code == 200) {
            var result = res.data.data;
            this.$message({
              message: result,
              type: "success"
            });
            this.statusChangeDialog = false;
            this.getProjectTable();
          } else {
            this.$message({
              message: result,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    statusChangeDialogClose() {
      this.statusForm = {};
    },
    managerChangeDialogClose() {
      this.conditionManger = false;
      this.conditionManger = false;
      this.reminder = false;
      this.account_name = "";
      this.subdept_name = "";
      this.$refs.refTable.clearSelection();
    },
    clearManagerForm() {
      this.managerForm = {};
    },
    MarketSelectInfo(val) {
      this.empName = val.emp_name;
      this.subdept_name = val.subdept_name;
      this.account_name = val.account_name;
      this.managerForm.user_id = val.memberid; // 登录用户id
      this.managerForm.operation_person = val.emp_name; // 登录用户
      this.managerForm.level_one_id = val.subdept_id; // 实施B级单位id
      this.managerForm.level_one_name = val.subdept_name; // 实施B级单位name
      this.managerForm.level_two_id = val.dept_id; // 实施C级单位ID
      this.managerForm.level_two_name = val.dept_name; // 实施C级单位name
      this.depName = val.dept_name;
      if (val.dept_name == "管理团队") {
        this.reminder = true;
      } else {
        this.reminder = false;
      }
    }
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
  padding: 0 15px 0 15px;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 9px;
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
  .manager-dialog {
    .conceal {
      display: none;
    }
    .p-red {
      color: red;
      font-size: 12px;
    }
  }
  .pname {
    // max-width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
