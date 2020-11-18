<template>
  <div class="budget-content">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="project">
          <el-row :gutter="20" type="flex" justify="space-between">
            <el-col :span="4">
              <h4>项目列表</h4>
            </el-col>
            <el-col :span="3">
              <el-checkbox v-model="checkedChoose" @change="checkedChooseProject">仅显示未关联项目</el-checkbox>
            </el-col>
          </el-row>
          <el-table :data="tableDataPro" style="width:100%;" height="205" row-key="id" border
            :span-method="objectSpanMethod" :header-cell-style="{
              fontSize: '14px',
              color: '#303133',
              height: '34px',
              padding: 0,
              backgroundColor: '#ccd1d5'
            }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }" highlight-current-row
            @current-change="handleCurrentChangeProject">
            <el-table-column label width="35" align="center">
              <template slot-scope="scope">
                <el-radio v-model="checked" :label="scope.row.index" v-if="scope.row.show" style="color: #fff;">&nbsp;
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="index" label="序号" width="50" :formatter="formatxuhao" align="center">
            </el-table-column>

            <el-table-column prop="projectName" label="项目名称" width="280" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="projectNumber" label="项目编号" width="160"></el-table-column>
            <el-table-column prop="classUnitBName" label="实施B级单位"></el-table-column>
            <el-table-column prop="classUnitCName" label="实施C级单位"></el-table-column>
            <el-table-column prop="projectManagerName" label="项目经理"></el-table-column>
            <el-table-column prop="relationStatus" label="关联状态"></el-table-column>
          </el-table>
          <div class="page right">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="1"
              :page-sizes="[5]" layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <!-- <div style="height:600px;overflow: auto;">{{tableData1}}</div> -->

        <div class="grid-content bg-purple">
          <el-row :gutter="20" type="flex" justify="space-between">
            <el-col :span="4">
              <h4>合同列表</h4>
            </el-col>
            <el-col :span="2">
              <span class="unit">单位：元</span>
            </el-col>
          </el-row>
          <el-table :header-cell-style="{
              fontSize: '14px',
              color: '#303133',
              height: '26px',
              padding: 0,
              backgroundColor: '#ccd1d5'
            }" :row-style="{ height: '26px' }" :cell-style="{ padding: 0 }" :data="tableData"
            style="width: 100%;margin-bottom: 20px;" row-key="id" border max-height="200" default-expand-all
            @row-click="contractRowClick" @current-change="changeHanle"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <!-- <el-table-column label width="50" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="contractChecked"
                  :label="scope.row.number"
                >{{scope.row.number=="合计"?scope.row.number:''}}</el-radio>
              </template>
            </el-table-column>-->
            <el-table-column label width="35" align="center">
              <template slot-scope="scope">
                <el-radio v-model="contractChecked" v-if="scope.row.number != '合计'" :label="scope.row.CONTRACTNUMBER"
                  style="color: #fff;">
                  &nbsp;
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column width="55" label="序号" align="center">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.number }}</span>
              </template>
            </el-table-column>

            <el-table-column label="合同编号" sortable width="180">
              <template slot-scope="scope">{{
                scope.row.CONTRACTNUMBER != null
                  ? scope.row.CONTRACTNUMBER
                  : "--"
              }}</template>
            </el-table-column>
            <el-table-column label="合同名称" sortable width="150">
              <template slot-scope="scope">{{
                scope.row.CONTRACTNAME != null ? scope.row.CONTRACTNAME : "--"
              }}</template>
            </el-table-column>
            <el-table-column label="合同额" align="right">
              <template slot-scope="scope">{{
                scope.row.CONTRACTMONEY != null ? scope.row.CONTRACTMONEY : "--"
              }}</template>
            </el-table-column>
            <el-table-column label="销售B级单位">
              <template slot-scope="scope">{{
                scope.row.LEVELTWONAME != null ? scope.row.LEVELTWONAME : "--"
              }}</template>
            </el-table-column>
            <el-table-column label="销售">
              <template slot-scope="scope">{{
                scope.row.PROJECTMANAGERNAME != null
                  ? scope.row.PROJECTMANAGERNAME
                  : "--"
              }}</template>
            </el-table-column>
            <el-table-column prop="relationStatus" label="关联状态">
              <template slot-scope="scope">{{
                scope.row.relationStatus != null
                  ? correConfig[scope.row.relationStatus]
                  : "--"
              }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="split">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-row :gutter="20" type="flex" justify="space-between">
            <el-col :span="8">
              <h4>合同预算分配表</h4>
            </el-col>
            <el-col :span="2">
              <span class="unit">单位：元</span>
            </el-col>
          </el-row>

          <el-table size="mini" :header-cell-style="{
              fontSize: '14px',
              color: '#303133',
              height: '34px',
              padding: 0,
              backgroundColor: '#ccd1d5'
            }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }" :data="tableData1"
            style="width: 100%;margin-bottom: 20px;" row-key="id" border :height="430" default-expand-all
            @cell-mouse-leave="cellLeave" @cell-click="cellClick" @row-click="rowClick"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="splitType" label="预算类别" align="left" width="250"></el-table-column>
            <el-table-column prop="budgetTotal" label="预算" align="right" width="150"></el-table-column>

            <el-table-column :label="item.label" align="right" v-for="(item, index) in budgeConfig" :key="index">
              <template slot-scope="scope">
                <el-input class="budge-input" size="mini" type="number" :disabled="scope.row.isDisable"
                  v-model.number="scope.row[item.key]" @blur="blueInput(scope.row, item.key)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="4">
        <el-button type="primary" size="mini" @click="save">保存</el-button>
        <el-button type="primary" size="mini">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getProject,
  getListBycontractProjectNum,
  getItemByContractNumber,
  saveSplit
} from "../../api/api.js";
import { mapState, mapActions } from "vuex";
// Vue.directive("num", {
//   inserted(el, binding, vnode) {
//     el.oninput = function(e) {
//       let value = e.target.value;
//       if (isNaN(value)) {
//         vnode.context.num = e.target.value = "";
//         return;
//       } else {
//         vnode.context.num = value;
//       }
//     };
//   }
// });
export default {
  name: "BudgetAllocation",
  props: ["widget", "models", "rules", "remote", "datas"],

  data() {
    return {
      correConfig: {
        0: "已关联",
        2: "未关联"
      },
      currentPageContract: 1,
      currentPage: 1,
      checked: null,
      contractChecked: null,
      //项目列表
      tableDataPro: [],
      //合同列表
      conTableData: [],
      checkedChoose: true,
      checkedChooseContract: true,
      page: {
        //当前页
        pageNum: 1,
        //每页显示条数
        pageSize: 5,
        total: 0
      },
      pageContract: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      //合同项目num
      contractProjectNum: "",
      tableDataContract: [],
      associatedListData: [],
      listContractNumber: "",
      projectId: "",
      spanArr: [],
      pos: 0,
      contractNum: "",
      tableData: [],
      // budgeConfig: [
      //   {
      //     key: "project1",
      //     label: "测试1"
      //   },
      //   { key: "project2", label: "测试2" },
      //   { key: "project3", label: "测试3" },
      //   { key: "project4", label: "测试第四个" },
      //   { key: "project5", label: "测试第五个" },
      //   { key: "project6", label: "测试第六个" },
      //   { key: "projectCenter", label: "项目管理中心" }
      // ],
      budgeConfig: [{ key: "projectCenter", label: "" }],
      tableData1: [
        {
          id: 1,
          splitType: "合同额（经费）",
          budgetTotal: "--",
          isDisable: true,
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null,
          children: [
            {
              id: 2,
              splitType: "自有基础软件",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 3,
              splitType: "自有应用软件",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 4,
              splitType: "自有数据产品",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 5,
              splitType: "第三方产品",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 6,
              splitType: "技术开发",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 7,
              splitType: "技术服务",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 8,
              splitType: "其他",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            }
          ]
        },
        {
          id: 9,
          splitType: "采购支出",
          budgetTotal: "--",
          isDisable: true,
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null,
          children: [
            {
              id: 10,
              splitType: "正常采购",
              budgetTotal: "--",
              isDisable: true,
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null,
              children: [
                {
                  id: 11,
                  splitType: "软件产品（研究院）",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 12,
                  splitType: "软件产品（其他）",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 13,
                  splitType: "硬件产品",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 14,
                  splitType: "数据产品",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 15,
                  splitType: "技术服务1",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 16,
                  splitType: "其他",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                }
              ]
            },
            {
              id: 17,
              splitType: "客户指定采购或合作协议采购",
              isDisable: true,
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null,
              children: [
                {
                  id: 18,
                  splitType: "软件产品",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 19,
                  splitType: "硬件产品",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 20,
                  splitType: "数据产品",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 21,
                  splitType: "技术服务1",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 22,
                  splitType: "技术服务2",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                },
                {
                  id: 23,
                  splitType: "其他",
                  budgetTotal: "--",
                  project1: null,
                  project2: null,
                  project3: null,
                  project4: null,
                  project5: null,
                  project6: null,
                  projectCenter: null
                }
              ]
            }
          ]
        },
        {
          id: 24,
          splitType: "纯合同额（经费）",
          isDisable: true,
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        },
        {
          id: 25,
          splitType: "保证金",
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        },
        {
          id: 26,
          splitType: "实施费用",
          budgetTotal: "--",
          isDisable: true,
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null,
          children: [
            {
              id: 27,
              splitType: "人工费用",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 28,
              splitType: "运营费用",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            }
          ]
        },
        {
          id: 29,
          splitType: "毛利润",
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        },
        {
          id: 30,
          splitType: "毛利率",
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        },
        {
          id: 31,
          splitType: "销售费用",
          budgetTotal: "--",
          isDisable: true,
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null,
          children: [
            {
              id: 32,
              splitType: "人工费用",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            },
            {
              id: 33,
              splitType: "运营费用",
              budgetTotal: "--",
              project1: null,
              project2: null,
              project3: null,
              project4: null,
              project5: null,
              project6: null,
              projectCenter: null
            }
          ]
        },
        {
          id: 34,
          splitType: "中标服务费",
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        },
        {
          id: 35,
          splitType: "项目损益",
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        },
        {
          id: 36,
          splitType: "项目收益率",
          budgetTotal: "--",
          project1: null,
          project2: null,
          project3: null,
          project4: null,
          project5: null,
          project6: null,
          projectCenter: null
        }
      ]
    };
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ]),
    //保证金第一个项目
    bzjPro1() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].project1;
      }
    },
    bzjPro2() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].project2;
      }
    },
    bzjPro3() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].project3;
      }
    },
    bzjPro4() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].project4;
      }
    },
    bzjPro5() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].project5;
      }
    },
    bzjPro6() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].project6;
      }
    },
    bzjProCenter() {
      if (this.tableData1.length > 0) {
        return this.tableData1[2].projectCenter;
      }
    }
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {}
    },
    //保证金第一个项目
    bzjPro1(newval, oldVal) {
      //保证金的计算公式保证金=第一个项目/纯合同额经费预算总额*保证金总预算额
      // var tempVal = (
      //   (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
      //   this.tableData1[3].budgetTotal
      // ).toFixed(2);
      // tempVal = parseFloat(tempVal);
      // if (oldVal == "" || oldVal == null) {
      //   this.tableData1[3].project1 = tempVal;
      //   this["bzjPro1Num"] = tempVal;
      // } else if (newval != oldVal) {
      //   if (
      //     this.tableData1[3].project1 != null ||
      //     this.tableData1[3].project1 != ""
      //   ) {
      //     this.tableData1[3].project1 = tempVal;
      //     this["bzjPro1Num"] = tempVal;
      //   } else if (this.tableData1[3].project1 == this["bzjPro1Num"]) {
      //     this.tableData1[3].project1 = tempVal;
      //     this["bzjPro1Num"] = tempVal;
      //   }
      // }
      if (this.tableData1.length > 0) {
        var tempVal = (
          (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].project1",
          "bzjPro1Num"
        );
        //人工为费用的第一个项目
        var tempVal = (
          (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].project1",
          "rgfyPro1Num"
        );

        //运营费用的第一个项目
        var tempVal = (
          (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].project1",
          "yyfyPro1Num"
        );

        //人工费用第一个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].project1",
          "rgfyXSPro1Num"
        );

        //运营费用第一个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].project1",
          "yyfyXSPro1Num"
        );

        //中标服务费第一个项目
        var tempVal = (
          (this.tableData1[2].project1 / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].project1",
          "zbfwfPro1Num"
        );
      }
    },
    //保证金第二个项目
    bzjPro2(newval, oldVal) {
      if (this.tableData1.length > 0) {
        var tempVal = (
          (this.tableData1[2].project2 / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].project2",
          "bzjPro2Num"
        );

        //人工为费用的第二个项目
        var tempVal = (
          (this.tableData1[2].project2 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].project2",
          "rgfyPro2Num"
        );

        //运营费用的第二个项目
        var tempVal = (
          (this.tableData1[2].project2 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].project2",
          "yyfyPro2Num"
        );

        //人工费用第二个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project2 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].project2",
          "rgfyXSPro2Num"
        );

        //运营费用第二个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project2 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].project2",
          "yyfyXSPro2Num"
        );

        //中标服务费第二个项目
        var tempVal = (
          (this.tableData1[2].project2 / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].project2",
          "zbfwfPro2Num"
        );
      }
    },
    //保证金第三个项目
    bzjPro3(newval, oldVal) {
      if (this.tableData1.length > 0 && this.tableData1[2].project3) {
        var tempVal = (
          (this.tableData1[2].project3 / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].project3",
          "bzjPro3Num"
        );

        //人工为费用的第三个项目
        var tempVal = (
          (this.tableData1[2].project3 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].project3",
          "rgfyPro3Num"
        );

        //运营费用的第三个项目
        var tempVal = (
          (this.tableData1[2].project3 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].project3",
          "yyfyPro3Num"
        );

        //人工费用第三个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project3 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].project3",
          "rgfyXSPro3Num"
        );

        //运营费用第三个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project3 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].project3",
          "yyfyXSPro3Num"
        );

        //中标服务费第三个项目
        var tempVal = (
          (this.tableData1[2].project3 / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].project3",
          "zbfwfPro3Num"
        );
      }
    },
    //保证金第四个项目
    bzjPro4(newval, oldVal) {
      if (this.tableData1.length > 0 && this.tableData1[2].project4) {
        var tempVal = (
          (this.tableData1[2].project4 / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].project4",
          "bzjPro4Num"
        );

        //人工为费用的第四个项目
        var tempVal = (
          (this.tableData1[2].project4 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].project4",
          "rgfyPro4Num"
        );

        //运营费用的第四个项目
        var tempVal = (
          (this.tableData1[2].project4 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].project4",
          "yyfyPro4Num"
        );

        //人工费用第寺个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project4 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].project4",
          "rgfyXSPro4Num"
        );

        //运营费用第四个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project4 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].project4",
          "yyfyXSPro4Num"
        );

        //中标服务费第四个项目
        var tempVal = (
          (this.tableData1[2].project4 / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].project4",
          "zbfwfPro4Num"
        );
      }
    },
    //保证金第五个项目
    bzjPro5(newval, oldVal) {
      if (this.tableData1.length > 0 && this.tableData1[2].project5) {
        var tempVal = (
          (this.tableData1[2].project5 / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].project5",
          "bzjPro5Num"
        );

        //人工为费用的第五个项目
        var tempVal = (
          (this.tableData1[2].project5 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].project5",
          "rgfyPro5Num"
        );

        //运营费用的第五个项目
        var tempVal = (
          (this.tableData1[2].project5 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].project5",
          "yyfyPro5Num"
        );

        //人工费用第五个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project5 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].project5",
          "rgfyXSPro5Num"
        );

        //运营费用第五个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project5 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].project5",
          "yyfyXSPro5Num"
        );

        //中标服务费第五个项目
        var tempVal = (
          (this.tableData1[2].project5 / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].project5",
          "zbfwfPro5Num"
        );
      }
    },
    //保证金第六个项目
    bzjPro6(newval, oldVal) {
      if (this.tableData1.length > 0 && this.tableData1[2].project6) {
        var tempVal = (
          (this.tableData1[2].project6 / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].project6",
          "bzjPro6Num"
        );

        //人工为费用的第六个项目
        var tempVal = (
          (this.tableData1[2].project6 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].project6",
          "rgfyPro6Num"
        );

        //运营费用的第六个项目
        var tempVal = (
          (this.tableData1[2].project6 / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].project6",
          "yyfyPro6Num"
        );

        //人工费用第六个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project6 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].project6",
          "rgfyXSPro6Num"
        );

        //运营费用第六个项目（销售费用）
        var tempVal = (
          (this.tableData1[2].project6 / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].project6",
          "yyfyXSPro6Num"
        );

        //中标服务费第六个项目
        var tempVal = (
          (this.tableData1[2].project6 / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].project6",
          "zbfwfPro6Num"
        );
      }
    },

    //项目管理固定项目
    bzjProCenter(newval, oldVal) {
      if (this.tableData1.length > 0 && this.tableData1[2].projectCenter) {
        var tempVal = (
          (this.tableData1[2].projectCenter / this.tableData1[2].budgetTotal) *
          this.tableData1[3].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[3].projectCenter",
          "bzjProCenterNum"
        );

        //人工为费用的项目管理中心
        var tempVal = (
          (this.tableData1[2].projectCenter / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[0].projectCenter",
          "rgfyProCenterNum"
        );

        //运营费用的项目管理中心
        var tempVal = (
          (this.tableData1[2].projectCenter / this.tableData1[2].budgetTotal) *
          this.tableData1[4].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[4].children[1].projectCenter",
          "yyfyProCenterNum"
        );

        //人工费用项目管理中心（销售费用）
        var tempVal = (
          (this.tableData1[2].projectCenter / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[0].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[0].projectCenter",
          "rgfyXSProCenterNum"
        );

        //运营费用项目管理中心（销售费用）
        var tempVal = (
          (this.tableData1[2].projectCenter / this.tableData1[2].budgetTotal) *
          this.tableData1[7].children[1].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[7].children[1].projectCenter",
          "yyfyXSProCenterNum"
        );

        //中标服务费项目管理中心
        var tempVal = (
          (this.tableData1[2].projectCenter / this.tableData1[2].budgetTotal) *
          this.tableData1[8].budgetTotal
        ).toFixed(2);
        this.computedValue(
          newval,
          oldVal,
          tempVal,
          "tableData1[8].projectCenter",
          "zbfwfProCenterNum"
        );
      }
    },

    tableData1: {
      deep: true,
      handler: function(newVal, oldVal, val) {
        //正常采购的总数第一个项目总和
        var normalCgSum1 = 0;
        var normalCgSum2 = 0;
        var normalCgSum3 = 0;
        var normalCgSum4 = 0;
        var normalCgSum5 = 0;
        var normalCgSum6 = 0;
        var normalCgSumCenter = 0;
        //正常采购下面的子项目
        if (this.tableData1.length > 0) {
          var normalCgList = this.tableData1[1].children[0].children;
          normalCgList.forEach((item, index) => {
            normalCgSum1 +=
              item.project1 && item.project1 != "" ? item.project1 : 0;
            normalCgSum2 +=
              item.project2 && item.project2 != "" ? item.project2 : 0;
            normalCgSum3 +=
              item.project3 && item.project3 != "" ? item.project3 : 0;
            normalCgSum4 +=
              item.project4 && item.project4 != "" ? item.project4 : 0;
            normalCgSum5 +=
              item.project5 && item.project5 != "" ? item.project5 : 0;
            normalCgSum6 +=
              item.project6 && item.project6 != "" ? item.project6 : 0;
            normalCgSumCenter +=
              item.projectCenter && item.projectCenter != ""
                ? item.projectCenter
                : 0;
          });
          //正常采购第一个项目综合
          this.tableData1[1].children[0].project1 = normalCgSum1;
          this.tableData1[1].children[0].project2 = normalCgSum2;
          this.tableData1[1].children[0].project3 = normalCgSum3;
          this.tableData1[1].children[0].project4 = normalCgSum4;
          this.tableData1[1].children[0].project5 = normalCgSum5;
          this.tableData1[1].children[0].project6 = normalCgSum6;
          this.tableData1[1].children[0].projectCenter = normalCgSumCenter;

          // 客户指定采购或合作协议采购
          var zdcgList = this.tableData1[1].children[1].children; //指定采购
          var zdcgSum1 = 0,
            zdcgSum2 = 0,
            zdcgSum3 = 0,
            zdcgSum4 = 0,
            zdcgSum5 = 0,
            zdcgSum6 = 0,
            zdcgSumCenter = 0;
          zdcgList.forEach((item, index) => {
            zdcgSum1 +=
              item.project1 && item.project1 != "" ? item.project1 : 0;
            zdcgSum2 +=
              item.project2 && item.project2 != "" ? item.project2 : 0;
            zdcgSum3 +=
              item.project3 && item.project3 != "" ? item.project3 : 0;
            zdcgSum4 +=
              item.project4 && item.project4 != "" ? item.project4 : 0;
            zdcgSum5 +=
              item.project5 && item.project5 != "" ? item.project5 : 0;
            zdcgSum6 +=
              item.project6 && item.project6 != "" ? item.project6 : 0;
            zdcgSumCenter +=
              item.projectCenter && item.projectCenter != ""
                ? item.projectCenter
                : 0;
          });
          this.tableData1[1].children[1].project1 = zdcgSum1;
          this.tableData1[1].children[1].project2 = zdcgSum2;
          this.tableData1[1].children[1].project3 = zdcgSum3;
          this.tableData1[1].children[1].project4 = zdcgSum4;
          this.tableData1[1].children[1].project5 = zdcgSum5;
          this.tableData1[1].children[1].project6 = zdcgSum6;
          this.tableData1[1].children[1].projectCenter = zdcgSumCenter;

          //采购支出
          var cgzcSum1 = 0,
            cgzcSum2 = 0,
            cgzcSum3 = 0,
            cgzcSum4 = 0,
            cgzcSum5 = 0,
            cgzcSum6 = 0,
            cgzcSumCenter = 0;
          var cgzcList = this.tableData1[1].children; //指定采购
          cgzcList.forEach((item, index) => {
            cgzcSum1 +=
              item.project1 && item.project1 != "" ? item.project1 : 0;
            cgzcSum2 +=
              item.project2 && item.project2 != "" ? item.project2 : 0;
            cgzcSum3 +=
              item.project3 && item.project3 != "" ? item.project3 : 0;
            cgzcSum4 +=
              item.project4 && item.project4 != "" ? item.project4 : 0;
            cgzcSum5 +=
              item.project5 && item.project5 != "" ? item.project5 : 0;
            cgzcSum6 +=
              item.project6 && item.project6 != "" ? item.project6 : 0;
            cgzcSumCenter +=
              item.projectCenter && item.projectCenter != ""
                ? item.projectCenter
                : 0;
          });
          this.tableData1[1].project1 = cgzcSum1;
          this.tableData1[1].project2 = cgzcSum2;
          this.tableData1[1].project3 = cgzcSum3;
          this.tableData1[1].project4 = cgzcSum4;
          this.tableData1[1].project5 = cgzcSum5;
          this.tableData1[1].project6 = cgzcSum6;
          this.tableData1[1].projectCenter = cgzcSumCenter;

          //合同额经费
          var prohtSum1 = 0,
            prohtSum2 = 0,
            prohtSum3 = 0,
            prohtSum4 = 0,
            prohtSum5 = 0,
            prohtSum6 = 0,
            prohtSumCenter = 0;
          var prohtList = this.tableData1[0].children;
          prohtList.forEach((item, index) => {
            prohtSum1 +=
              item.project1 && item.project1 != "" ? item.project1 : 0;
            prohtSum2 +=
              item.project2 && item.project2 != "" ? item.project2 : 0;
            prohtSum3 +=
              item.project3 && item.project3 != "" ? item.project3 : 0;
            prohtSum4 +=
              item.project4 && item.project4 != "" ? item.project4 : 0;
            prohtSum5 +=
              item.project5 && item.project5 != "" ? item.project5 : 0;
            prohtSum6 +=
              item.project6 && item.project6 != "" ? item.project6 : 0;
            prohtSumCenter +=
              item.projectCenter && item.projectCenter != ""
                ? item.projectCenter
                : 0;
          });
          this.tableData1[0].project1 = Number.parseFloat(prohtSum1.toFixed(2));
          this.tableData1[0].project2 = Number.parseFloat(prohtSum2.toFixed(2));
          this.tableData1[0].project3 = Number.parseFloat(prohtSum3.toFixed(2));
          this.tableData1[0].project4 = Number.parseFloat(prohtSum4.toFixed(2));
          this.tableData1[0].project5 = Number.parseFloat(prohtSum5.toFixed(2));
          this.tableData1[0].project6 = Number.parseFloat(prohtSum6.toFixed(2));
          this.tableData1[0].projectCenter = Number.parseFloat(
            prohtSumCenter.toFixed(2)
          );

          //实施费用
          var ssfySum1 = 0,
            ssfySum2 = 0,
            ssfySum3 = 0,
            ssfySum4 = 0,
            ssfySum5 = 0,
            ssfySum6 = 0,
            ssfySumCenter = 0;
          var ssfyList = this.tableData1[4].children;
          ssfyList.forEach((item, index) => {
            ssfySum1 +=
              item.project1 && item.project1 != "" ? item.project1 : 0;
            ssfySum2 +=
              item.project2 && item.project2 != "" ? item.project2 : 0;
            ssfySum3 +=
              item.project3 && item.project3 != "" ? item.project3 : 0;
            ssfySum4 +=
              item.project4 && item.project4 != "" ? item.project4 : 0;
            ssfySum5 +=
              item.project4 && item.project5 != "" ? item.project5 : 0;
            ssfySum6 +=
              item.project6 && item.project6 != "" ? item.project6 : 0;
            ssfySumCenter +=
              item.projectCenter && item.projectCenter != ""
                ? item.projectCenter
                : 0;
          });
          this.tableData1[4].project1 = Number.parseFloat(ssfySum1.toFixed(2));
          this.tableData1[4].project2 = Number.parseFloat(ssfySum2.toFixed(2));
          this.tableData1[4].project3 = Number.parseFloat(ssfySum3.toFixed(2));
          this.tableData1[4].project4 = Number.parseFloat(ssfySum4.toFixed(2));
          this.tableData1[4].project5 = Number.parseFloat(ssfySum5.toFixed(2));
          this.tableData1[4].project6 = Number.parseFloat(ssfySum6.toFixed(2));
          this.tableData1[4].projectCenter = Number.parseFloat(
            ssfySumCenter.toFixed(2)
          );

          //销售费用
          var xsfySum1 = 0,
            xsfySum2 = 0,
            xsfySum3 = 0,
            xsfySum4 = 0,
            xsfySum5 = 0,
            xsfySum6 = 0,
            xsfySumCenter = 0;
          var sxfyList = this.tableData1[7].children;
          sxfyList.forEach((item, index) => {
            xsfySum1 += item.project && item.project1 != "" ? item.project1 : 0;
            xsfySum2 +=
              item.project2 && item.project2 != "" ? item.project2 : 0;
            xsfySum3 +=
              item.project3 && item.project3 != "" ? item.project3 : 0;
            xsfySum4 +=
              item.project4 && item.project4 != "" ? item.project4 : 0;
            xsfySum5 +=
              item.project5 && item.project5 != "" ? item.project5 : 0;
            xsfySum6 +=
              item.project6 && item.project6 != "" ? item.project6 : 0;
            xsfySumCenter +=
              item.projectCenter && item.projectCenter != ""
                ? item.projectCenter
                : 0;
          });
          this.tableData1[7].project1 = Number.parseFloat(xsfySum1.toFixed(2));
          this.tableData1[7].project2 = Number.parseFloat(xsfySum2.toFixed(2));
          this.tableData1[7].project3 = Number.parseFloat(xsfySum3.toFixed(2));
          this.tableData1[7].project4 = Number.parseFloat(xsfySum4.toFixed(2));
          this.tableData1[7].project5 = Number.parseFloat(xsfySum5.toFixed(2));
          this.tableData1[7].project6 = Number.parseFloat(xsfySum6.toFixed(2));
          this.tableData1[7].projectCenter = Number.parseFloat(
            xsfySumCenter.toFixed(2)
          );

          //纯合同额（经费）计算  纯合同额=项目对应的合同额-项目采购支出总数
          this.tableData1[2].project1 =
            this.tableData1[0].project1 - this.tableData1[1].project1;
          this.tableData1[2].project2 =
            this.tableData1[0].project2 - this.tableData1[1].project2;
          this.tableData1[2].project3 =
            this.tableData1[0].project3 - this.tableData1[1].project3;
          this.tableData1[2].project4 =
            this.tableData1[0].project4 - this.tableData1[1].project4;
          this.tableData1[2].project5 =
            this.tableData1[0].project5 - this.tableData1[1].project5;
          this.tableData1[2].project6 =
            this.tableData1[0].project6 - this.tableData1[1].project6;
          this.tableData1[2].projectCenter =
            this.tableData1[0].projectCenter - this.tableData1[1].projectCenter;

          //毛利润 合同额-采购支出-实施费用（人工费用预算及运营费用预算
          this.tableData1[5].project1 = Number.parseFloat(
            (
              this.tableData1[0].project1 -
              this.tableData1[1].project1 -
              this.tableData1[4].project1
            ).toFixed(2)
          );
          this.tableData1[5].project2 = Number.parseFloat(
            (
              this.tableData1[0].project2 -
              this.tableData1[1].project2 -
              this.tableData1[4].project2
            ).toFixed(2)
          );
          this.tableData1[5].project3 = Number.parseFloat(
            (
              this.tableData1[0].project3 -
              this.tableData1[1].project3 -
              this.tableData1[4].project3
            ).toFixed(2)
          );
          this.tableData1[5].project4 = Number.parseFloat(
            (
              this.tableData1[0].project4 -
              this.tableData1[1].project4 -
              this.tableData1[4].project4
            ).toFixed(2)
          );
          this.tableData1[5].project5 = Number.parseFloat(
            (
              this.tableData1[0].project5 -
              this.tableData1[1].project5 -
              this.tableData1[4].project5
            ).toFixed(2)
          );
          this.tableData1[5].project6 = Number.parseFloat(
            (
              this.tableData1[0].project6 -
              this.tableData1[1].project6 -
              this.tableData1[4].project6
            ).toFixed(2)
          );
          this.tableData1[5].projectCenter = Number.parseFloat(
            (
              this.tableData1[0].projectCenter -
              this.tableData1[1].projectCenter -
              this.tableData1[4].projectCenter
            ).toFixed(2)
          );

          //毛利率 毛利润/合同额

          this.tableData1[6].project1 = Math.round(
            (this.tableData1[5].project1 / this.tableData1[0].project1) * 100
          );
          this.tableData1[6].project2 = Math.round(
            (this.tableData1[5].project2 / this.tableData1[0].project2) * 100
          );
          this.tableData1[6].project3 = Math.round(
            (this.tableData1[5].project3 / this.tableData1[0].project3) * 100
          );
          this.tableData1[6].project4 = Math.round(
            (this.tableData1[5].project4 / this.tableData1[0].project4) * 100
          );
          this.tableData1[6].project5 = Math.round(
            (this.tableData1[5].project5 / this.tableData1[0].project5) * 100
          );
          this.tableData1[6].project6 = Math.round(
            (this.tableData1[5].project6 / this.tableData1[0].project6) * 100
          );
          this.tableData1[6].projectCenter = Math.round(
            (this.tableData1[5].projectCenter /
              this.tableData1[0].projectCenter) *
              100
          );

          //项目损益 预计毛利润-销售费用预算
          this.tableData1[9].project1 = Number.parseFloat(
            (this.tableData1[5].project1 - this.tableData1[7].project1).toFixed(
              2
            )
          );
          this.tableData1[9].project2 = Number.parseFloat(
            (this.tableData1[5].project2 - this.tableData1[7].project2).toFixed(
              2
            )
          );
          this.tableData1[9].project3 = Number.parseFloat(
            (this.tableData1[5].project3 - this.tableData1[7].project3).toFixed(
              2
            )
          );
          this.tableData1[9].project4 = Number.parseFloat(
            (this.tableData1[5].project4 - this.tableData1[7].project4).toFixed(
              2
            )
          );
          this.tableData1[9].project5 = Number.parseFloat(
            (this.tableData1[5].project5 - this.tableData1[7].project5).toFixed(
              2
            )
          );
          this.tableData1[9].project6 = Number.parseFloat(
            (this.tableData1[5].project6 - this.tableData1[7].project6).toFixed(
              2
            )
          );
          this.tableData1[9].projectCenter = Number.parseFloat(
            (
              this.tableData1[5].projectCenter -
              this.tableData1[7].projectCenter
            ).toFixed(2)
          );

          //项目收益率损益/合同额
          this.tableData1[10].project1 = Number.parseFloat(
            (this.tableData1[9].project1 / this.tableData1[0].project1).toFixed(
              2
            )
          );
          this.tableData1[10].project2 = Number.parseFloat(
            (this.tableData1[9].project2 / this.tableData1[0].project2).toFixed(
              2
            )
          );
          this.tableData1[10].project3 = Number.parseFloat(
            (this.tableData1[9].project3 / this.tableData1[0].project3).toFixed(
              2
            )
          );
          this.tableData1[10].project4 = Number.parseFloat(
            (this.tableData1[9].project4 / this.tableData1[0].project4).toFixed(
              2
            )
          );
          this.tableData1[10].project5 = Number.parseFloat(
            (this.tableData1[9].project5 / this.tableData1[0].project5).toFixed(
              2
            )
          );
          this.tableData1[10].project6 = Number.parseFloat(
            (this.tableData1[9].project6 / this.tableData1[0].project6).toFixed(
              2
            )
          );
          this.tableData1[10].projectCenter = Number.parseFloat(
            (
              this.tableData1[9].projectCenter /
              this.tableData1[0].projectCenter
            ).toFixed(2)
          );
        }
      }
    }
  },
  methods: {
    //计算可修改输入框值
    /**
     *newval 手动修改的值
     *oldVal 自动计算的值
     tempVal 通过公式计算例如保证金的计算公式保证金=第一个项目/纯合同额经费预算总额*保证金总预算额
     curInputCon 当前被计算输入框的坐标 例如 this.tableData1[3].project1
     tempComptuedVal 需要把自动计算的值存起来，以便以后和手动输入的值进行对比
     */
    computedValue(newval, oldVal, tempVal, curInputCon, tempComptuedVal) {
      tempVal = parseFloat(tempVal);
      if (oldVal == "" || oldVal == null) {
        eval(`this.${curInputCon}=${tempVal}`);
        this[tempComptuedVal] = tempVal;
      } else if (newval != oldVal) {
        if (
          eval(`this.${curInputCon}`) != null ||
          eval(`this.${curInputCon}`) != ""
        ) {
          eval(`this.${curInputCon}=${tempVal}`);
          this[tempComptuedVal] = tempVal;
        } else if (eval(`this.${curInputCon}`) == this[tempComptuedVal]) {
          eval(`this.${curInputCon}=${tempVal}`);
          this[tempComptuedVal] = tempVal;
        }
      }
    },

    formatxuhao(row) {
      return (row.index =
        row.show == false ? (row.index = "") : (row.index = row.index));
    },
    cellLeave(val) {},
    cellClick(val) {},
    changeInput(obj, val, index) {
      // console.log(obj);
      if (index == this.budgeConfig.length - 2) {
        let bjs = obj.budgetTotal; // 被减数
        for (var i = 0; i < index + 1; i++) {
          obj[this.budgeConfig[index + 1].key] =
            bjs - obj[this.budgeConfig[i].key];
          bjs = bjs - obj[this.budgeConfig[i].key];
        }
      }
    },
    blueInput(curRow, key) {
      // var obj = curRow;
      // delete obj.id;
      // delete obj.splitType;
      // for (var ele in obj) {
      //   if (obj[ele] == null) {
      //     obj[ele] = 0;
      //   } else {
      //     obj[ele] = Number.parseFloat(obj[ele]);
      //   }
      // }
      // debugger;
      // console.log(obj);
      this.computedRowSum(curRow);
    },
    init() {},
    // 计算每行是否大于总数
    computedRowSum(curRow) {
      var sum = 0;
      this.budgeConfig.forEach((item, index) => {
        for (var ele in curRow) {
          if (item.key == ele) {
            if (curRow[ele] == null || curRow[ele] == "") {
              sum += 0;
            } else {
              sum += curRow[ele];
            }
            // sum += curRow[ele] == null ? 0 : curRow[ele];
          }
        }
      });
      var cha= null
      if(typeof(curRow.budgetTotal)=='number'){
       cha  = curRow.budgetTotal - sum;
      }else{
       cha = "--"
      }
      if (curRow.budgetTotal - sum == 0) {
        // this.$message({
        //   showClose: true,
        //   message: "恭喜你，分配成功",
        //   type: "success"
        // });
      } else {
        this.$message({
          showClose: true,
          message: `分配金额不等于总金额，请继续分配(还差${cha})`,
          type: "warning"
        });
      }
    },
    rowClick(row, column, event) {},
    //合并列
    getSpanArr(data) {
      console.log(data); //从后台获取的数据
      this.spanArr = [];
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1);
            this.pos = 0;
          } else {
            if (data[i].conId === data[i - 1].conId) {
              // 如果useName相等就累加，并且push 0
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              // 不相等push 1
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
        console.log(this.spanArr);
      }
    },
    //合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    //选中项目列表
    handleCurrentChangeProject(val) {
      if (val) {
        console.log(val);
        this.checked = val.index;
        this.contractChecked = "";
        //根据项目列表里面的contractProjectNum
        this.projectId = val.conId;
        this.contractProjectNum = val.contractProjectNum;
        this.getConTableList(val.contractProjectNum);
      }
    },
    changeHanle(val) {
      this.contractChecked = val.CONTRACTNUMBER;
    },
    //项目列表分页
    handleCurrentChange(val) {
      console.log(val);
      this.getTable(val);
    },
    //项目列表 仅显示
    checkedChooseProject(val) {
      var pageNum = 1;
      var checkedChoose = val;
      if (checkedChoose == true) {
        checkedChoose = 0;
      } else {
        checkedChoose = 1;
      }
      this.getTable(pageNum, checkedChoose);
    },
    //项目列表
    getTable(pageNum, checkedChoose) {
      var relation = "";
      if (checkedChoose) {
        relation = checkedChoose;
      } else {
        if (this.checkedChoose == true) {
          relation = 0;
        } else {
          relation = 1;
        }
      }
      var url =
        "/sgpm/rest/api/server/pm/gt/project?relation=" +
        relation +
        "&memberId=" +
        this.userinfo.memberid +
        "&pageNum=" +
        pageNum +
        "&pageSize=5";
      getProject(url)
        .then(res => {
          var result = res.data.data;
          this.getSpanArr(result);
          if (result) {
            for (var i = 0; i < result.length; i++) {
              if (result[i].relationStatus == 0) {
                result[i].relationStatus = "已关联";
              } else if (result[i].relationStatus == 2) {
                result[i].relationStatus = "未关联";
              }
            }
          }
          this.tableDataPro = res.data.data;
          this.page.total = res.data.meta.totalCount;
          this.currentPage = res.data.meta.pageNo;
          for (var i = 0; i < this.tableDataPro.length; i++) {
            this.tableDataPro[i].show = true;
            var arr = [];
            for (var i = 0; i < this.tableDataPro.length; i++) {
              if (i === 0) {
                arr.push(1);
              } else {
                if (
                  this.tableDataPro[i].index === this.tableDataPro[i - 1].index
                ) {
                  this.tableDataPro[i].show = false;
                } else {
                  this.tableDataPro[i].show = true;
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取合同列表
    getConTableList(num) {
      getListBycontractProjectNum(
        `/sgpm/rest/api/integration/contracts/${num}?companyId=${this.userinfo.account_id}`,
        null
      )
        .then(res => {
          if (res.status == 200) {
            var result = res.data.data;
            this.tableData = result;
            var sum = null;
            this.tableData.forEach((ele, index) => {
              ele["number"] = index + 1;
              sum += ele.CONTRACTMONEY;
            });

            var obj = {
              number: "合计",
              CONTRACTMONEY: sum,
              relationStatus: null,
              CONTRACTNUMBER: null
            };
            this.tableData.push(obj);
            console.log(this.tableData);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    contractRowClick(val) {
      this.contractNum = val.CONTRACTNUMBER;
      this.contractChecked = val.CONTRACTNUMBER;
      console.log(this.tableData);
      let contractNumber = this.tableData[1].CONTRACTNUMBER;
      let type = 0;
      if (val.number == "合计") {
        type = 1;
        contractNumber = contractNumber;
      } else {
        type = 0;
        contractNumber = val.CONTRACTNUMBER;
      }
      getItemByContractNumber(
        `/sgpm/rest/api/server/project/distribution/budget?contractNumber=${contractNumber}&type=${type}&companyId=${this.userinfo.account_id}`,
        null
      )
        .then(res => {
          if (res.status == 200) {
            let result = res.data.data;
            console.log(Object.keys(result).length);
            if (Object.keys(result).length == 0) {
              this.tableData1 = [];
              this.budgeConfig = [
                {
                  key: "project1",
                  label: ""
                }
              ];
              return;
            }
            this.budgeConfig = result.projects;
            this.tableData1 = result.totalTable;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 合并合计第一行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [1, 0];
        }
      }
    },
    save() {
      console.log(this.tableData1);
      let ary = [];
      var list = JSON.parse(JSON.stringify(this.tableData1));
      this.budgeConfig.forEach((ele, index) => {
        var obj = {};
        Object.assign(obj, {
          projectName: ele.label,
          projectNumber: ele.projectNumber,
          contractNumber: this.contractNum,
          userName: this.userinfo.emp_name,
          userId: this.userinfo.memberid
        });
        list.forEach((item, jdex) => {
          if (item.splitType == "合同额（经费）") {
            Object.assign(obj, {
              contractMoney: item[ele.key] || 0
            });
            item.children.forEach((jtem, zindex) => {
              if (jtem.splitType == "自有基础软件") {
                Object.assign(obj, {
                  ownBasicSoftware: jtem[ele.key] || 0
                });
              }
              if (jtem.splitType == "自有应用软件") {
                Object.assign(obj, {
                  ownApplicationSoftware: jtem[ele.key] || 0
                });
              }
              if (jtem.splitType == "自有数据产品") {
                Object.assign(obj, {
                  ownDataProduct: jtem[ele.key] || 0
                });
              }
              if (jtem.splitType == "第三方产品") {
                Object.assign(obj, {
                  thirdPartyProducts: jtem[ele.key] || 0
                });
              }
              if (jtem.splitType == "技术开发") {
                Object.assign(obj, {
                  technologyDevelopment: jtem[ele.key] || 0
                });
              }
              if (jtem.splitType == "技术服务") {
                Object.assign(obj, {
                  technicalService: jtem[ele.key] || 0
                });
              }
              if (jtem.splitType == "其他") {
                Object.assign(obj, {
                  other: jtem[ele.key] || 0
                });
              }
            });
          } else if (item.splitType == "采购支出") {
            Object.assign(obj, {
              procurementCosts: item[ele.key] || 0
            });
            item.children.forEach((ztem, qindex) => {
              if (ztem.splitType == "正常采购") {
                Object.assign(obj, {
                  procurementCostsNormal: ztem[ele.key] || 0
                });
                ztem.children.forEach((ytem, yindx) => {
                  if (ytem.splitType == "软件产品（研究院）") {
                    Object.assign(obj, {
                      normalSoftwareProductInstitute: ytem[ele.key] || 0
                    });
                  }
                  if (ytem.splitType == "软件产品（其他）") {
                    Object.assign(obj, {
                      normalSoftwareProductOther: ytem[ele.key] || 0
                    });
                  }
                  if (ytem.splitType == "硬件产品") {
                    Object.assign(obj, {
                      normalHardwareProduct: ytem[ele.key] || 0
                    });
                  }
                  if (ytem.splitType == "数据产品") {
                    Object.assign(obj, {
                      normalDataProduct: ytem[ele.key] || 0
                    });
                  }
                  if (ytem.splitType == "技术服务1") {
                    Object.assign(obj, {
                      normalTechnicalServices1: ytem[ele.key] || 0
                    });
                  }
                  if (ytem.splitType == "其他") {
                    Object.assign(obj, {
                      normalOfOther: ytem[ele.key] || 0
                    });
                  }
                });
              } else if (ztem.splitType == "客户指定采购或合作协议采购") {
                Object.assign(obj, {
                  procurementCostsDesignated: ztem[ele.key] || 0
                });
                ztem.children.forEach((rtem, rindex) => {
                  if (rtem.splitType == "软件产品") {
                    Object.assign(obj, {
                      designatedSoftwareProduct: rtem[ele.key] || 0
                    });
                  }
                  if (rtem.splitType == "硬件产品") {
                    Object.assign(obj, {
                      designatedHardwareProduct: rtem[ele.key] || 0
                    });
                  }
                  if (rtem.splitType == "数据产品") {
                    Object.assign(obj, {
                      designatedDataProduct: rtem[ele.key] || 0
                    });
                  }
                  if (rtem.splitType == "技术服务1") {
                    Object.assign(obj, {
                      designatedTechnicalServices1: rtem[ele.key] || 0
                    });
                  }
                  if (rtem.splitType == "技术服务2") {
                    Object.assign(obj, {
                      designatedTechnicalServices2: rtem[ele.key] || 0
                    });
                  }
                  if (rtem.splitType == "其他") {
                    Object.assign(obj, {
                      designatedPurchaseOfOther: rtem[ele.key] || 0
                    });
                  }
                });
              }
            });
          } else if (item.splitType == "纯合同额（经费）") {
            Object.assign(obj, {
              pureContractsCanBe: item[ele.key] || 0
            });
          } else if (item.splitType == "保证金") {
            Object.assign(obj, {
              margin: item[ele.key] || 0
            });
          } else if (item.splitType == "实施费用") {
            Object.assign(obj, {
              implementationOfCost: item[ele.key] || 0
            });
            item.children.forEach((utem, uidex) => {
              if (utem.splitType == "人工费用") {
                Object.assign(obj, {
                  implementationLaborCost: utem[ele.key] || 0
                });
              }
              if (utem.splitType == "运营费用") {
                Object.assign(obj, {
                  implementationOperatingExpense: utem[ele.key] || 0
                });
              }
            });
          } else if (item.splitType == "毛利润") {
            Object.assign(obj, {
              grossProfitMargin: Number.parseFloat(item[ele.key]) || 0
            });
          } else if (item.splitType == "毛利率") {
            Object.assign(obj, {
              grossRateMargin: item[ele.key] || 0
            });
          } else if (item.splitType == "销售费用") {
            Object.assign(obj, {
              costOfSales: item[ele.key] || 0
            });
            item.children.forEach((etem, eindex) => {
              if (etem.splitType == "人工费用") {
                Object.assign(obj, {
                  salesLaborCost: etem[ele.key] || 0
                });
              }
              if (etem.splitType == "运营费用") {
                Object.assign(obj, {
                  salesOperatingExpenses: etem[ele.key] || 0
                });
              }
            });
          } else if (item.splitType == "中标服务费") {
            Object.assign(obj, {
              biddingServiceFee: item[ele.key] || 0
            });
          } else if (item.splitType == "项目损益") {
            Object.assign(obj, {
              projectProfitAndLoss: item[ele.key] || 0
            });
          } else if (item.splitType == "项目收益率") {
            Object.assign(obj, {
              projectReturn: item[ele.key] || 0
            });
          }
        });
        ary.push(obj);
        console.log(ary);
      });
      saveSplit(`/sgpm/rest/api/server/project/distribution/budget`, ary)
        .then(res => {
          if (res.status == 200) {
            if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    var pageNum = 1;
    var checkedChoose = this.checkedChoose;
    if (checkedChoose == true) {
      checkedChoose = 0;
    } else {
      checkedChoose = 1;
    }
    this.getTable(pageNum, checkedChoose);
    var relation = this.checkedChooseContract;
    if (relation == true) {
      relation = 0;
    } else {
      relation = 1;
    }
  },
  filters:{
    formatThousandYuan(val){
      if(val!=null){
        return val/10000
      }else{
        return '--'
      }
    }
  }
};
</script>

<style lang="scss">
.budget-content {
  // max-height: 700px;
  .el-table [class*="el-table__row--level"] .el-table__expand-icon {
    margin-right: -19px;
  }
  .el-table [class*="el-table__row--level"] .el-table__expand-icon {
    position: relative;
    left: -15px;
  }
  .split {
    .el-table .cell,
    .el-table th div,
    .el-table--border td:first-child .cell,
    .el-table--border th:first-child .cell {
      padding-left: 30px;
    }
  }
}
.budge-input {
  .el-input__inner {
    text-align: right;
  }
}
</style>
<style lang="scss" scoped>
.budget-content {
  height: 100%;
  .unit {
    font-size: 12px;
  }
  h4 {
    padding: 0;
    margin: 0;
  }
  padding: 20px;
  .project {
    .page {
      margin: 10px 0 0 0;
    }

    .right {
      float: right;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #fff;
    }
  }
  .el-icon-arrow-right {
    position: relative;
    top: 13px;
  }

  .el-table [class*="el-table__row--level"] .el-table__expand-icon {
    margin-right: -16px;
  }
}
</style>
