<template>
  <div class="list-container">
    <div class="header">
      <el-form ref="form" :model="form" size="mini" :inline="true" class="search-form">
        <div class="search-left">
          <el-form-item label="查看范围">
            <el-select v-model="form.dicName" size="mini" placeholder="查看范围" @change="selectChange">
              <el-option
                :label="item.dicName"
                :value="item.dicCode"
                v-for="item in selectAry"
                :key="item.dicCode"
              ></el-option>
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
          <el-button
            type="primary"
            size="mini"
            @click="managerChange"
            :disabled="isChangeBtn"
          >项目经理变更</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="statusChange"
            :disabled="isStatusChange"
          >项目状态变更</el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="mini"
            circle
            class="circle-btn"
            @click="clearFilter"
          ></el-button>
          <el-popover
            placement="right"
            width="200"
            trigger="click"
            class="popover"
            @show="popoverShow"
            @hide="popoverHide"
          >
            <el-checkbox
              v-model="item.isShow"
              v-for="item in listConfig"
              :key="item.key"
              class="popover-checkbox"
            >{{ item.label }}</el-checkbox>
            <el-button
              type="primary"
              icon="el-icon-menu"
              slot="reference"
              size="mini"
              circle
              class="circle-btn"
            ></el-button>
          </el-popover>
        </div>
        <!-- <el-row :gutter="5" type="flex" justify="space-between" class="one-row"></el-row>
        <el-row :gutter="5" type="flex" justify="space-between">
          <el-col :md="10" :xl="9" :sm="10" :lg="8">
            <el-form-item label="查看范围">
              <el-select v-model="form.dicName" size="mini" placeholder="查看范围" @change="selectChange">
                <el-option :label="item.dicName" :value="item.dicCode" v-for="item in selectAry" :key="item.dicCode">
                </el-option>
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
        </el-row>-->
      </el-form>
    </div>

    <el-table
      :data="tableData"
      class="father-pro-table"
      highlight-current-row
      border
      :max-height="asideHeight"
      ref="refTable"
      v-loading="tableLoading"
      :header-cell-style="{
        fontSize: '14px',
        color: '#303133',
        height: '51px',
        padding: 0,
        backgroundColor: '#ccd1d5'
      }"
      :row-style="{ height: '50px' }"
      :cell-style="{ padding: 0 }"
      @cell-click="handleCell"
      @current-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @header-dragend="headerDragend"
      style="width: 100%;margin-bottom: 10px;"
      row-key="id"
      default-expand-all
      @select="selectHandle"
      @select-all="selectAllHandle"
      :tree-props="{ children: 'son_project', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column width="50"></el-table-column> -->
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column type="index" width="38" align="center" label="序号" :fixed="checkFixed"></el-table-column>

      <el-table-column
        label="项目名称"
        width="140"
        align="center"
        :fixed="checkFixed"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="{
              name: '/projectInformation',
              params: {
                id: scope.row.id,
                category: scope.row.jumpType,
                projectName: scope.row.name,
                projectNumber: scope.row.projectNum,
                parent_id: scope.row.parent_id,
                judgeproject: '项目信息'
              }
            }"
          >
            <span class="num">{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="38" label="进度" align="center">
        <!-- <template slot-scope="scope">
          <div class="progress" :title="scope.row.name"></div>
        </template>-->
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.delayPercentage | formatTip"
            placement="right"
          >
            <div class="progress progress-red" v-if="scope.row.color == 1"></div>
            <div class="progress progress-yellow" v-if="scope.row.color == 2"></div>
            <div class="progress progress-green" v-if="scope.row.color == 3"></div>
            <div class="progress" v-if="scope.row.color == null"></div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="38" label="关注" align="center">
        <template slot-scope="scope">
          <i
            class="el-icon-star-on startGrey"
            :class="{
              'el-icon-star-on': isCared ? isCared : scope.row.isCare,
              startYellow: isCared ? isCared : scope.row.isCare
            }"
          ></i>
        </template>
      </el-table-column>

      <el-table-column width="110" label="审核进度" align="center">
        <template slot-scope="scope">
          <span>{{ auditConfig[scope.row.audit_status] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :prop="val.key"
        :label="val.label"
        v-for="(val, index) in listConfig"
        :key="index"
        width="140"
        align="center"
        v-if="val.isShow"
        :sortable="val.sortable ? val.sortable : null"
        :filters="val.filters ? val.filters : null"
        :filter-method="val.filters ? filterHandler : null"
      >
        <template slot-scope="scope">
          <span v-if="val.isShow && val.isQfw == 1">
            {{
            scope.row[val.key] == null
            ? "--"
            : scope.row[val.key] | formatThousands
            }}
          </span>
          <span v-if="val.isShow && val.isPercent">
            {{
            scope.row[val.key] == null
            ? "--"
            : Math.round(scope.row[val.key] * 100) + "%"
            }}
          </span>
          <span v-if="val.isShow && val.isPercentNot100">
            {{
            scope.row[val.key] == null
            ? "--"
            : Math.round(scope.row[val.key]) + "%"
            }}
          </span>
          <span
            v-if="
              val.isShow &&
                val.isQfw != 1 &&
                !val.isPercent &&
                !val.isPercentNot100
            "
          >{{ scope.row[val.key] == null ? "--" : scope.row[val.key] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="高级筛选" v-dialogDrag :visible.sync="advancedDialog" width="51%" center>
      <div class="dialog-wrap">
        <div class="wrap-left">
          <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-width="200px"
            class="demo-dynamic"
          >
            <el-form-item
              v-for="(domain, index) in dynamicValidateForm.domains"
              :key="domain.key"
              :prop="'domains.' + index + '.value'"
              size="mini"
            >
              <el-select
                v-model="domain.value"
                placeholder="请选择查询字段"
                @change="advancedChange(domain.value, index)"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in advancedOptions"
                  :key="index"
                ></el-option>
              </el-select>
              <el-select
                v-model="domain.value1"
                :disabled="domain.isDisabled"
                filterable
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in advancedList"
                  :key="index"
                  :label="item.label"
                  size="mini"
                  :value="item.label"
                ></el-option>
              </el-select>
              <el-button
                type="text"
                @click.prevent="
                  removeDomain(domain, dynamicValidateForm.domains.length)
                "
                class="btn-item"
              >
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

    <el-dialog
      title="项目经理变更"
      v-dialogDrag
      :destroy-on-close="true"
      :visible.sync="managerChangeDialog"
      width="50%"
      center
      @close="managerChangeDialogClose"
      class="manager-dialog"
    >
      <el-row type="flex" class="row-wrap" justify="space-between">
        <el-col :span="11">
          <h4 class="title">
            <el-checkbox v-model="checkedU" @change="changeCur(checkedU)"></el-checkbox>&nbsp;&nbsp;当前项目经理
          </h4>
          <div class="old-form">
            <el-form
              ref="formOld"
              :model="formOld"
              :disabled="true"
              size="mini"
              label-width="75px"
              style="width:100%"
            >
              <el-form-item label="项目经理">
                <el-input v-model="formOld.projectManager" style="width:64%"></el-input>
              </el-form-item>
              <el-form-item label="A级单位">
                <el-input v-model="formOld.company_name" style="width:64%"></el-input>
              </el-form-item>
              <el-form-item label="实施B级单位">
                <el-input v-model="formOld.levelOneName" style="width:64%"></el-input>
              </el-form-item>
              <el-form-item label="实施C级单位">
                <el-input v-model="formOld.levelTwoName" style="width:64%"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="11">
          <h4 class="title" style="margin: 0px 0 0 16px;">变更后项目经理</h4>
          <con-change @MarketSelectInfo="MarketSelectInfo" labelName="项目经理" ref="formNew"></con-change>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-wrap" justify="space-between">
        <el-col :span="11">
          <h4 class="title" v-if="isShowText">
            <span class="ht-check">
              <el-checkbox v-model="checkedD" @change="changeHT(checkedD)"></el-checkbox>
            </span>
            &nbsp;&nbsp;合同项目经理
            <el-tooltip placement="right">
              <div slot="content">
                是否选择对合同项目经理进行变更，如:<br>
                 "勾选" 确定对合同项目经理变更;<br> "不勾选" 仅对子项目经理变更;
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </h4>
          <div class="old-form" v-show="isShowHtCon">
            <el-form
              ref="formHTOld"
              :model="formHTOld"
              :disabled="true"
              size="mini"
              label-width="75px"
              style="width:100%"
            >
              <el-form-item label="项目经理">
                <el-input v-model="formHTOld.projectManager" style="width:64%"></el-input>
              </el-form-item>
              <el-form-item label="A级单位">
                <el-input v-model="formHTOld.company_name" style="width:64%"></el-input>
              </el-form-item>
              <el-form-item label="实施B级单位">
                <el-input v-model="formHTOld.levelOneName" style="width:64%"></el-input>
              </el-form-item>
              <el-form-item label="实施C级单位">
                <el-input v-model="formHTOld.levelTwoName" style="width:64%"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="11" v-show="isShowHtCon">
          <h4 class="title" style="margin: 0px 0 0 16px;">变更后合同项目经理</h4>
          <con-change @MarketSelectInfo="MarketSelectHTInfo" labelName="合同项目经理" ref="formNewHT"></con-change>
        </el-col>
      </el-row>
      <div class="reason">
        <span class="label">变更原因</span>
        <el-input
          type="textarea"
          size="mini"
          :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入变更原因"
          v-model="reason"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="managerChangeDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="managerConfirm" :loading="btnLoding" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="项目状态变更"
      v-dialogDrag
      :visible.sync="statusChangeDialog"
      width="45%"
      center
      @close="statusChangeDialogClose"
      class="manager-dialog"
    >
      <div class="status-wrap">
        <el-form ref="form" :model="statusForm" size="mini" label-width="130px">
          <el-form-item label="项目状态">
            <el-select v-model="statusForm.after_name" placeholder="请选择项目状态" style="width:60%">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in statusOptionList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变更原因">
            <el-input
              type="textarea"
              size="mini"
              :autosize="{ minRows: 4, maxRows: 8 }"
              v-model="statusForm.change_reason"
              placeholder="请输入变更原因"
              style="width:60%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusChangeDialog = false" size="mini">取 消</el-button>
        <el-button
          type="primary"
          @click="statusChangeConfirm"
          :loading="statusBtnLoding"
          size="mini"
        >确 定</el-button>
      </span>
    </el-dialog>
    <div class="page right">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="1"
        :page-sizes="[20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
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
  managerSubmit,
  statusSubmit,
  getHTMangeMsg
} from "../../api/api.js";
import config from "../../config";
import conChange from "../projectChange/components/conChange";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "ProjectList",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {
    conChange
  },
  data() {
    return {
      isShowHtCon:false,
      checkedU: true, //当前项目经理默认
      checkedD: false, //合同项目经理
      statusForm: {
        after_name: "",
        change_reason: ""
      },
      statusChangeDialog: false,
      managerForm: {},
      managerFormHT: {},//合同项目经理form
      reason: "", //变更原因
      depName: "", //管理团队
      // isChangeBtn: true,
      isStatusChange: true,
      empName: "", //项目经理名称
      empNameHT: "", //合同项目经理名称
      formOld: {
        projectManager: "",
        company_name: "",
        levelOneName: "",
        levelTwoName: ""
      },
      formHTOld: {
        projectManager: "",
        company_name: "",
        levelOneName: "",
        levelTwoName: ""
      },
      isPname: true,
      btnMaxWidth: 180,
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
      btnLoding: false,
      statusBtnLoding: false,
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
        },
        {
          value: 6,
          label: "验收"
        }
      ],
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
        { key: "keyword", label: "关键字", isShow: true },
        { key: "contractNumber", label: "合同编号", isShow: true },
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
          isPercentNot100: true, //是否为百分比
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
      managerChangeDialog: false,
      //列表多选框list
      selectCheckoutAry: [],
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
      },
      selectList:[],
      curProManage:true//是否勾选当前项目经理
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
    isShowText(){
      //通过登录人判断是否显示合同项目经理变更 南康和国图的显示其他不显示
      if(this.userinfo.account_id==="8416498716893399290"||this.userinfo.account_id==="-1814768306395265967"){
        return true
      }else{
        return false
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
    },
    isChangeBtn() {
      if (this.selectCheckoutAry.length == 0) {
        return true;
      } else {
        return false;
      }
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
    changeCur(val){
      if(!val){
        this.formOld= {
        projectManager: "",
        company_name: "",
        levelOneName: "",
        levelTwoName: ""
      }
      this.curProManage = val
      this.$refs["formNew"].resetForm();
      this.empName=""
     }else{
       this.selectHandle(this.selectList)
       this.curProManage = val
     }
     console.log(this.curProManage)
    },
    changeHT(val) {
      this.isShowHtCon = true
      if(!val){
        this.formHTOld= {
        projectManager: "",
        company_name: "",
        levelOneName: "",
        levelTwoName: ""
      }
      this.$refs["formNewHT"].resetForm();
       this.empNameHT=""
      this.managerFormHT = {}
      this.isShowHtCon = false
      }else{
        if(this.selectCheckoutAry.length>1){
          this.$message({
            message: '变更合同项目经理暂不能选择多个项目，请重新选择',
            type: 'warning'
          });
          return false
        }
        let id = this.selectCheckoutAry[0]
        getHTMangeMsg(`/sgpm/rest/api/server/pm/project/parent/manager/change?id=${id}`, null)
        .then(res => {
          let result = res.data.data
          if(result==null){
            this.$message({
            message: '没有查到合同项目经理',
            type: 'warning'
          }); 
          }else{
            this.formHTOld.projectManager  = result.userName
            this.formHTOld.company_name  = result.companyName
            this.formHTOld.levelOneName  = result.classUnitBName
            this.formHTOld.levelTwoName  = result.classUnitCName
          }
          
        })
        .catch(err => {
          console.log(err);
        });
      }
      
    },
    //勾选列表的多选框触发方法
    selectHandle(selection, row) {
      this.selectList = selection
      // this.isChangeBtn = false;
      this.isStatusChange = false;
      let projectIds = [];
      let levelTwoNameList = [];
      selection.forEach(item => {
        projectIds.push(item.id);
        levelTwoNameList.push(item.levelTwoName);
      });
      this.selectCheckoutAry = projectIds;
      if (selection.length == 1) {
        this.formOld.projectManager = selection[0].projectManager;
        this.formOld.company_name = selection[0].company_name;
        this.formOld.levelOneName = selection[0].levelOneName;
        this.formOld.levelTwoName = selection[0].levelTwoName;
      } else {
        let names = Array.from(new Set(levelTwoNameList));
        if (names.length == 1) {
          this.formOld.projectManager = selection[0].projectManager;
          this.formOld.company_name = selection[0].company_name;
          this.formOld.levelOneName = selection[0].levelOneName;
          this.formOld.levelTwoName = selection[0].levelTwoName;
        } else {
          this.formOld.projectManager = "";
          this.formOld.company_name = "";
          this.formOld.levelOneName = "";
          this.formOld.levelTwoName = "";
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
    init() {
      if (
        this.userinfo.account_id == "-1814768306395265967" ||
        this.userinfo.account_id == "8416498716893399290"
      ) {
        //说明是国图的人
        this.isAlready = true;
      } else {
        this.isAlready = false;
      }
      this.getProjectTable();
      //下拉选框
      this.getSelectList();
    },
    managerChangeDialogClose() {
      this.$refs["formNew"].resetForm();
      this.$refs["formNewHT"].resetForm();
      this.reason = "";
      this.$refs.refTable.clearSelection();
      this.empName = ""
      this.empNameHT = ""
      this.selectCheckoutAry = [];
      this.isStatusChange = true;
      this.checkedD=false,
      this.isShowHtCon =  false
      this.curProManage = true
      this.managerFormHT = {}
      this.formHTOld= {
        projectManager: "",
        company_name: "",
        levelOneName: "",
        levelTwoName: ""
      }
    },
    advancedConfirm() {
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
    managerChange() {
      this.checkedU = true
      this.$nextTick(() => {
        if (this.$refs["formNew"]) {
          this.$refs["formNew"].resetForm();
        }
      });
      this.managerChangeDialog = true;
    },
    //获取项目列表表格
    getProjectTable(val) {
      this.tableLoading = true;
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
        keyWord: this.form.keyWord,
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
        this.isPass = false;
        this.isReject = false;
        var status = val.auditStatus || "";
        this.editorBtnMark = status;
        //如果是登记已审核可以启动并且销售经理为登录人
        this.isStart =
          val.audit_status == 12 &&
          this.userinfo.emp_name == val.projectManager;
        this.isRecall = status !== "审核中";
        if (
          //30工作结项待提交，31工作结项审核中，工作结项已审核
          (val.audit_status == 30 ||
            val.audit_status == 31 ||
            val.audit_status == 32) &&
          this.userinfo.emp_name == val.projectManager
        ) {
          this.isFinish = true;
        } else if (
          //22启动已审核
          val.percentageComplete * 100 == 100 &&
          // (val.audit_status == 12 || val.audit_status == 22) &&
          val.audit_status == 22 &&
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

    //结项
    dropdownJX(val) {
      if (val == "a") {
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
    MarketSelectInfo(val) {
      this.empName = val.emp_name;
      this.depName = val.dept_name;
      this.managerForm = val;
      if (val.dept_name == "管理团队") {
        this.$notify({
          title: "请指定实施C级单位",
          message: "实施C级单位不能为管理团队",
          duration: 9000
        });
      }
    },
    MarketSelectHTInfo(val) {
      this.empNameHT = val.emp_name;
      // this.depName = val.dept_name;
      this.managerFormHT = val;
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
              this.getProjectTable();
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

    removeDomain(item, size) {
      if (size == 1) {
        this.$notify({
          title: "最后一条啦"
          // message: '最后一条啦',
          // type: 'warning'
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
    },
    managerConfirm(val) {
      this.btnLoding = true;
      if (this.depName == "管理团队") {
        this.$notify({
          title: "请指定实施C级单位",
          message: "实施C级单位不能为管理团队",
          duration: 9000
        });
        this.btnLoding = false;
        return;
      } else if (this.empName == ""&&this.checkedU) {
        this.$notify({
          title: "请选择变更经理",
          // message: '请选择变更经理',
          type: "warning"
        });
        this.btnLoding = false;
        return;
      }else if(this.checkedD&&this.empNameHT == ""){
          this.$notify({
          title: "如果勾选合同项目经理，需要选择变更的合同项目经理进行提交",
          // message: '请选择变更经理',
          type: "warning"
        });
        this.btnLoding = false;
        return 
      }
      let parentProject = {
        userName: this.managerFormHT.emp_name,
        userId:this.managerFormHT.memberid,
        level_one_name: this.managerFormHT.subdept_name,
        level_one_id: this.managerFormHT.subdept_id,
        level_two_name: this.managerFormHT.dept_name,
        level_two_id: this.managerFormHT.dept_id,
      }
      let obj = {
        project_ids: this.selectCheckoutAry,
        user_id:this.curProManage? this.managerForm.memberid:"",
        operation_person: this.userinfo.emp_name,
        level_one_id: this.managerForm.subdept_id,
        level_two_id: this.managerForm.dept_id,
        level_one_name: this.managerForm.subdept_name,
        level_two_name: this.managerForm.dept_name,
        change_reason: this.reason,
        user_name: this.managerForm.emp_name,
        company_id: this.managerForm.account_id,
        company_name: this.managerForm.account_name,
        parentProject:parentProject
      };
      if(!this.curProManage){//勾选掉默认当前项目经理说明是只变更主项目经理
        obj = {
          project_ids: this.selectCheckoutAry,
          user_id:this.curProManage? this.managerForm.memberid:"",
          operation_person: this.userinfo.emp_name,
          company_id: this.userinfo.account_id,
          company_name: this.userinfo.account_name,
          parentProject:parentProject
        }
      }
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
            this.btnLoding = false;
             this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    statusChangeConfirm() {
      this.statusBtnLoding = true;
      if (this.statusForm.after_name === "") {
        this.$notify({
          title: "请选择要变更的项目状态",
          // message: '请选择要变更的项目状态',
          type: "warning"
        });
        this.statusBtnLoding = false;
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
            this.statusBtnLoding = false;
            var result = res.data.data;
            this.$message({
              message: result,
              type: "success"
            });
            this.statusChangeDialog = false;
            this.getProjectTable();
          } else {
            this.statusBtnLoding = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    statusChangeDialogClose() {
      this.statusForm = {};
      this.$refs.refTable.clearSelection();
      // this.isChangeBtn = true;
      this.isStatusChange = true;
    },
    //项目状态变更
    statusChange() {
      this.statusChangeDialog = true;
    }
  }
};
</script>
<style lang="scss">
.ht-check {
  .el-checkbox {
    margin-right: -4px !important;
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
  padding: 0 15px 0 15px;
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
  .manager-dialog {
    .wrap {
      padding: 0 30px;
      display: flex;
      .w-left,
      .w-right {
        border: 1px solid;
        h4 {
          padding: 0 0 0 24px;
        }
        flex: 1;
        .old-form {
          display: flex;
          justify-content: center;
        }
      }
    }
    .reason {
      padding: 0px 39px 0 23px;
      font-size: 13px;
      .label {
        display: inline-block;
        font-size: 13px;
        width: 60px;
        text-align: right;
      }
    }
  }
  .row-wrap {
    padding: 0 30px;
    .title {
      margin: 0;
      padding: 0 0 10px 0;
    }
  }
  .status-wrap {
    padding: 0 30px;
    width: 95%;
    margin: 0 auto;
  }
}
</style>
