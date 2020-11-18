<template>
  <div class="edit" :style="{ minHeight: asideHeight + 'px' }">
    <transition name="mytable">
      <div :class="[showCardList ? 'tablistActive' : 'tablist']">
        <el-row :gutter="20" class="row-tittle">
          <el-col :md="14" :lg="7" class="tittle title-position">
            <i class="el-icon-back back-size" @click="back"></i>
            &nbsp;&nbsp;&nbsp;{{ designation }}
          </el-col>
          <el-col :md="14" :lg="3" class="unit">单位：万元</el-col>
        </el-row>
        <el-row style="background: #ffffff;padding-bottom: 14px">
          <!-- <el-col :md="10" :xl="5" :sm="18" :lg="8">
            <el-radio-group
              :xs="20"
              style=" float:left;margin-top: 9px"
              v-model="names.radio"
              @change="implementation( [names.radio,designation,names.value,names.Projectaccountingcheck])"
            >
              <el-radio v-model="names.radio" :label="3">全部</el-radio>
              <el-radio v-model="names.radio" :label="1" style="margin-left:20px">在实施项目</el-radio>
              <el-radio v-model="names.radio" :label="0" style="margin-left: 20px">验收待回款</el-radio>
            </el-radio-group>
          </el-col>-->
          <el-col :md="6" :xl="5" :sm="12" :lg="6">
            <div style="white-space:nowrap; float:left; padding-top:4px;margin-right:10px">
              项目状态
            </div>
            <el-select :class="[showCardList ? 'please' : '']" v-model="pmStatusVal" @change="
                implementation([
                  pmStatusVal,
                  designation,
                  names.value,
                  names.Projectaccountingcheck
                ])
              " clearable placeholder="请选择" size="small">
              <el-option v-for="item in pmStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>

          <el-col :md="6" :xl="5" :sm="12" :lg="6">
            <div style="white-space:nowrap; float:left; padding-top:4px;margin-right:10px">
              查找范围
            </div>
            <el-select :class="[showCardList ? 'please' : '']" v-model="names.value" @change="
                searchscope([
                  names.value,
                  designation,
                  names.Projectaccountingcheck,
                  names.radio
                ])
              " clearable placeholder="请选择" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :md="7" :sm="10">
            <div style="white-space:nowrap; float:left; padding-top:4px;margin-right:10px">
              查询条件
            </div>
            <el-input style=" float:left;width:65%" v-model="names.Projectaccountingcheck" placeholder="项目名称/合同编号"
              @keyup.enter.native="
                searchEnterFun([
                  names.Projectaccountingcheck,
                  designation,
                  names.value,
                  names.radio
                ])
              " size="small"></el-input>
          </el-col>
          <el-col :span="1" :xs="6" class="search">
            <el-button type="primary" size="small" style=" margin-left:6px; float: right; margin-right: 10px" @click="
                Projectaccountingchecks([
                  names.Projectaccountingcheck,
                  designation,
                  names.value,
                  names.radio
                ])
              ">查询
            </el-button>
          </el-col>
        </el-row>
        <!-- :row-class-name="tableRowClassName"
        :row-style="selectedHighlight"-->
        <!-- @current-change="handleRowChange" -->
        <el-table max-height="605" :data="content" border v-loading="loading" style="width: 100%"
          :summary-method="getSummaries" show-summary :cell-style="{ padding: 0 }" :header-cell-style="{
            fontSize: '14px',
            color: '#303133',
            height: '51px',
            padding: 0,
            backgroundColor: '#ccd1d5'
          }" :default-sort="{ prop: 'date', order: 'descending' }"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="序号" fixed type="index" width="50" align="center">
            <template slot-scope="scope">
              <span @click.stop="particulars(scope.row.filed19)"
                style="margin-left: 4px;cursor: pointer;color:#409EFF">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="详情" fixed type="index" width="50">
            <template slot-scope="scope">
              <i
                @click.stop="particulars(scope.row.filed19)"
                style="font-size: 18px;margin-left: 4px"
                class="el-icon-thumb"
              ></i>
            </template>
          </el-table-column>-->

          <el-table-column prop="filed1" fixed label="项目名称" width="230">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.filed1" placement="right">
                <el-button class="pname" type="text" @click="projectNames(scope.row.filed19)">{{ scope.row.filed1 }}
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="filed2" label="合同编号（简）" width="130"></el-table-column>
          <el-table-column prop="filed17" label="项目经理" width="80">
            <template slot-scope="scope">
              <p>{{ scope.row.filed17 == null ? "--" : scope.row.filed17 }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="filed18" label="销售负责人" width="92">
            <template slot-scope="scope">
              <p>{{ scope.row.filed18 == null ? "--" : scope.row.filed18 }}</p>
            </template>
          </el-table-column>

          <el-table-column prop="filed3" label="合同额" width="75">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed3 == null
                    ? "0"
                    : scope.row.filed3 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed4" label="纯合同额" width="80">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed4 == null
                    ? "0"
                    : scope.row.filed4 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed5" label="回款" width="75">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed5 == null
                    ? "0"
                    : scope.row.filed5 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed6" label="采购支出" width="80">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed6 == null
                    ? "0"
                    : scope.row.filed6 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed7" label="纯回款" width="80">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed7 == null
                    ? "0"
                    : scope.row.filed7 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed8" label="预扣成本" width="80">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed8 == null
                    ? "0"
                    : scope.row.filed8 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed9" label="纯收入" width="80">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed9 == null
                    ? "0"
                    : scope.row.filed9 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed10" label="税金及附加" width="95">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed10 == null
                    ? "0"
                    : scope.row.filed10 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed11" label="实施费用" width="90">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed11 == null
                    ? "0"
                    : scope.row.filed11 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed12" label="毛利润" width="80">
            <template slot-scope="scope">
              <p>{{ scope.row.filed12 == null ? "0" : scope.row.filed12 }}</p>
            </template>
          </el-table-column>

          <el-table-column prop="filed13" label="毛利率" width="80">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed13 == null
                    ? "0"
                    : (scope.row.filed13 + "%") | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed14" label="销售费用" width="90">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed14 == null
                    ? "0"
                    : scope.row.filed14 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed15" label="项目损益" width="90">
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.filed15 == null
                    ? "0"
                    : scope.row.filed15 | formatThousands
                }}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="filed16" label="项目收益率" width="95">
            <template slot-scope="scope">
              <p>
                {{ scope.row.filed16 == null ? "0" : scope.row.filed16 + "%" }}
              </p>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration"></span>
          <el-pagination @current-change="handleCurrentChange" :current-page="pager.currentPage"
            :page-sizes="[10, 20, 30]" :page-size="1" layout="total, sizes, prev, pager, next, jumper"
            :total="pager.totalCount"></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogFormVisible">
          <div id="tables" class="over" style="overflow: auto;display:inline-block;height: 495px;">
            <table>
              <el-row>
                <el-col :span="24" :xs="24">
                  <div
                    style="font-size: 16px; margin-left:8px; font-weight: 600;color: #606266;;text-align: center;line-height:40px">
                    {{ accountingindices }}
                  </div>
                </el-col>
              </el-row>

              <div style="width: 100%; display: inline-block">
                <table style="cursor:pointer; ">
                  <tr>
                    <td class="TitleColor">合同编号（简）</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed1 == null ? "--" : tabulardata.filed1
                      }}
                    </td>
                    <td class="TitleColor">合同签订日期</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed2 == null ? "--" : tabulardata.filed2
                      }}
                    </td>
                    <td class="TitleColor">合同我方签约主体</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed3 == null ? "--" : tabulardata.filed3
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="TitleColor">合同对方签约主体</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed4 == null ? "--" : tabulardata.filed4
                      }}
                    </td>
                    <td class="TitleColor">最终用户</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.Filed6 == null ? "--" : tabulardata.Filed6
                      }}
                    </td>
                    <td class="TitleColor">区域</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed7 == null ? "--" : tabulardata.filed7
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="TitleColor">行业</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.Filed8 == null ? "--" : tabulardata.Filed8
                      }}
                    </td>
                    <td class="TitleColor">币种</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.Filed9 == null ? "--" : tabulardata.Filed9
                      }}
                    </td>
                    <td class="TitleColor">合同额</td>
                    <td class="Tablestyle">
                      ￥{{
                        tabulardata.filed10 == null ? "--" : tabulardata.filed10
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="TitleColor">项目编号</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed11 == null ? "--" : tabulardata.filed11
                      }}
                    </td>
                    <!-- <td class="TitleColor">项目名称</td>
                    <td class="Tablestyle">{{tabulardata.filed12==null?"--":tabulardata.filed12}}</td>-->
                    <td class="TitleColor">项目里程碑</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed23 == null ? "--" : tabulardata.filed23
                      }}
                    </td>
                    <td class="TitleColor">项目经理</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed14 == null ? "--" : tabulardata.filed14
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="TitleColor">实施B级单位</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed16 == null ? "--" : tabulardata.filed16
                      }}
                    </td>
                    <td class="TitleColor">销售负责人</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed20 == null ? "--" : tabulardata.filed20
                      }}
                    </td>
                    <td class="TitleColor">销售B级单位</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed22 == null ? "--" : tabulardata.filed22
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="TitleColor">项目进度百分比</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed24 == null ? "--" : tabulardata.filed24
                      }}
                    </td>
                    <td class="TitleColor">项目验收日期</td>
                    <td class="Tablestyle">
                      {{
                        tabulardata.filed25 == null ? "--" : tabulardata.filed25
                      }}
                    </td>
                  </tr>
                </table>
              </div>
            </table>
          </div>
        </el-dialog>
      </div>
    </transition>
    <transition name="mybox">
      <div class="supernatantCar" v-show="showCardList">
        <div class="supernatant">
          <el-row style="padding-top:15px">
            <el-col :span="10" class="Blockunit"></el-col>
            <el-col :span="14">
              <div class="close" @click="closeBtn">
                <i class="el-icon-close"></i>
              </div>
            </el-col>
          </el-row>
          <el-table max-height="535" :data="cardList" style="width: 100%;margin-top:41px" type="index" slot="empty"
            row-key="id" border :default-expand-all="isExpand"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :cell-style="{ padding: 0 }"
            :header-cell-style="{
              fontSize: '14px',
              color: '#303133',
              height: '50px',
              padding: 0,
              backgroundColor: '#ccd1d5'
            }">
            <el-table-column prop="projectName" fixed label="财务指标" width="140">
              <template slot-scope="scope">
                <el-button style="white-space: pre-wrap; font-size: 15px;color:#000" type="text">
                  <p>{{ scope.row.projectName }}</p>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="boAndProject" label="商机+项目累计" width="80">
              <template slot-scope="scope">
                <p>{{ scope.row.boAndProject | formatThousands }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="projectPhase" label="项目阶段" width="75">
              <template slot-scope="scope">
                <p>{{ scope.row.projectPhase | formatThousands }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="boPhase" label="商机阶段" width="75">
              <template slot-scope="scope">
                <p>{{ scope.row.boPhase | formatThousands }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="projectBudget" label="项目预算" width="70">
              <template slot-scope="scope">
                <p>{{ scope.row.projectBudget | formatThousands }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  detailedaccounting,
  projecttabledata,
  DetailsCard,
  CheckList
} from "../../api/api.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "Adjust",
  data() {
    return {
      isExpand: false,
      showCardList: false, //右边弹框的显示
      names: {
        names: "edit",
        radio: 0,
        value: "",
        Projectaccountingcheck: ""
      },
      pmStatus: [
        {
          value: "0",
          label: "总项目"
        },
        {
          value: "1",
          label: "在实施"
        },
        {
          value: "2",
          label: "已验收-未关闭"
        },
        {
          value: "3",
          label: "已关闭"
        },
        {
          value: "4",
          label: "其他"
        }
      ], //项目状态
      pmStatusVal: "",
      dialogFormVisible: false,
      popout: [],
      loading: true,
      getIndex: -1,
      content: [],
      tabulardatas: [],
      tabulardata: [],
      actualGross: [],

      //上级传过来的部门名称
      designation: [],
      currentRow: null, //点击变色
      //核算指标
      accountingindices: "基本指标",
      options: [
        {
          value: "1",
          label: "我作为项目经理的项目"
        },
        {
          value: "2",
          label: "我销售的项目"
        },
        {
          value: "3",
          label: "我作为项目成员的项目"
        },
        {
          value: "4",
          label: "我监管的项目"
        },
        {
          value: "0",
          label: "所有项目"
        }
      ],
      //每页显示10条
      row: 10,
      //当前页
      num: 1,
      currentPage: 1,
      pager: {
        totalCount: 10,
        currentPage: 1,
        pagesize: 1
      },
      cardList: [
        {
          id: "1",
          projectName: "合同额",
          filed76: "12321.2",
          filed77: "3232.34",
          filed78: "2298"
        },
        {
          id: "3",
          projectName: "纯合同额",
          filed76: "4323.32",
          filed77: "3917.22",
          filed78: "7831.23"
        },
        {
          id: "4",
          projectName: "回款",
          filed76: "1211.23",
          filed77: "782.49",
          filed78: "3204.3",
          children: [
            {
              id: "42",
              projectName: "主营业务回款",
              filed76: "3842.33",
              filed77: "8321.29",
              filed78: "9321.22",
              isExpand: true,
              children: [
                {
                  id: "421",
                  projectName: "自有基础软件",
                  filed76: "3842.33",
                  filed77: "8321.29",
                  filed78: "9321.22"
                },
                {
                  id: "422",
                  projectName: "自有应用软件",
                  filed76: "3842.33",
                  filed77: "8321.29",
                  filed78: "9321.22"
                },
                {
                  id: "423",
                  projectName: "自有数据产品",
                  filed76: "3842.33",
                  filed77: "8321.29",
                  filed78: "9321.22"
                }
              ]
            },
            {
              id: "43",
              projectName: "其他业务回款",
              filed76: "4392.29",
              filed77: "3221.11",
              filed78: "3921.78"
            }
          ]
        },
        {
          id: "5",
          projectName: "采购支出",
          filed76: "23321.22",
          filed77: "19876.52",
          filed78: "9845.65",
          children: [
            {
              id: "52",
              projectName: "主营业务采购支出",
              filed76: "3459.44",
              filed77: "8594.54",
              filed78: "2349.3"
            },
            {
              id: "53",
              projectName: "其他业务采购支出",
              filed76: "4323.33",
              filed77: "3223.98",
              filed78: "9844.65"
            }
          ]
        },
        {
          id: "6",
          projectName: "纯回款",
          filed76: "9221.34",
          filed77: "8223.55",
          filed78: "2382.54"
        },
        {
          id: "7",
          projectName: "预扣成本",
          filed76: "4358.39",
          filed77: "9442.33",
          filed78: "4892.44"
        },
        {
          id: "8",
          projectName: "纯收入",
          filed76: "4328.39",
          filed77: "9842.33",
          filed78: "4832.44"
        },
        {
          id: "9",
          projectName: "税金及附加",
          filed76: "4328.39",
          filed77: "9842.33",
          filed78: "4832.44"
        },

        {
          id: "10",
          projectName: "实施费用",
          filed76: "23321.22",
          filed77: "19876.52",
          filed78: "9845.65",
          children: [
            {
              id: "11",
              projectName: "人工费用",
              filed76: "32459.44",
              filed77: "85934.54",
              filed78: "23249.3"
            },
            {
              id: "12",
              projectName: "运营费用",
              filed76: "43293.33",
              filed77: "38223.98",
              filed78: "98144.65"
            }
          ]
        }
      ], //卡片数据
      pmStatusValNum: "0" //新加参数
    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    asideHeight: function() {
      return document.documentElement.clientHeight - 100;
    }
  },
  components: {},

  mounted() {
    this.init();
    this.designation = this.$route.query.payment;
    // console.log(this.$route.query.payment)
  },
  filters: {
    formatThousands: function(value) {
      var r = /^[0-9]*[1-9][0-9]*$/; //正整数
      if (r.test(value) == false) {
        return (
          // "¥" +
          value &&
          value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
          })
        );
      } else {
        var reg = /\d{1,3}(?=(\d{3})+$)/g;
        // "¥" +
        return (value + "").replace(reg, "$&,");
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pager.currentPage = val;
      this.loading = true;
      this.getIndex = -1;
      // this.createBlock();
      this.tabulardata = [];
      var num = val;
      var param = {
        status: this.names.radio,
        range: this.names.value,
        select: this.names.Projectaccountingcheck,
        centerName: this.$route.query.payment,
        num: num,
        row: this.row,
        staffCode: this.userinfo.code
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            // this.circulation(data);
            // console.log(data);
            this.content = data;
            this.sumDataTwo(num);
            this.pager.totalCount = Number(res.data.msg) * 10;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    init() {
      if (null == this.$route.query.status) {
        this.names.radio = 0;
      } else {
        this.names.radio = this.$route.query.status;
      }
      //      console.log(radio)
      //        this.names.radio=null
      (this.options.value = 0),
        (this.num = 1),
        (this.names.value = ""),
        (this.names.Projectaccountingcheck = "");

      var param = {
        centerName: this.$route.query.payment,
        num: 1,
        row: this.row,
        staffCode: this.userinfo.code,
        status: this.names.radio
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            // console.log(res.data.data);
            // this.circulation(data);
            this.pager.totalCount = Number(res.data.msg) * 10;
            this.content = data;
            this.sumData();
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sortChange1(a, b) {
      //排序
      return a.account - b.account;
    },

    //合计
    getSummaries(param) {
      const columns = param.columns;
      const data = this.content;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));

        if (
          column.property === "filed3" ||
          column.property === "filed4" ||
          column.property === "filed5" ||
          column.property === "filed6" ||
          column.property === "filed7" ||
          column.property === "filed8" ||
          column.property === "filed9" ||
          column.property === "filed10" ||
          column.property === "filed11" ||
          column.property === "filed12" ||
          column.property === "filed14" ||
          column.property === "filed13" ||
          column.property === "filed15" ||
          column.property === "filed16"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const values = Number(curr);
            if (!isNaN(values)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        } else {
          sums[index] = "--";
        }
      });

      for (var i = 5; i < columns.length; i++) {
        if (i == 15 || i == 18) {
          sums[i] = parseFloat(sums[i] / data.length).toFixed(0) + "%";
        } else {
          //  "¥" +
          sums[i] = this.thousall(parseFloat(sums[i]).toFixed(2));
        }
      }
      var sumAry = sums.map(item => {
        if (item.indexOf("¥") > -1) {
          var num = item.substring(1);
          num = this.fomatQfw(num);
          // "¥" +
          return num;
        } else {
          return item;
        }
      });
      // console.log(sumAry);
      // return sumAry;
      return sumAry;
    },
    fomatQfw(value) {
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
    //初始化合计
    sumData() {
      var param = {
        centerName: this.$route.query.payment,
        num: 1,
        row: this.row,
        staffCode: this.userinfo.code,
        count: 1,
        status: this.names.radio
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            this.tabulardatas = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    poname() {},
    //点击分页器合计
    sumDataTwo(num) {
      var param = {
        status: this.names.radio,
        range: this.names.value,
        select: this.names.Projectaccountingcheck,
        centerName: this.$route.query.payment,
        num: num,
        row: this.row,
        staffCode: this.userinfo.code,
        count: 1
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            this.tabulardatas = res.data.data;
            // this.getSummaries();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击实施验收项目
    implementation(radiose) {
      // console.log(this.pmStatusVal)
      // console.log(this.pmStatusValNum);
      // pmStatusVal
      // this.pmStatusValNum = radiose[0]; //新加
      this.pmStatusValNum = this.pmStatusVal; //新加

      this.pager.currentPage = 1;
      this.loading = true;
      this.getIndex = -1;
      this.tabulardata = [];
      // this.createBlock();
      var param = {
        staffCode: this.userinfo.code,
        // status: radiose[0],

        status: this.pmStatusValNum, //8.28
        centerName: radiose[1],
        range: radiose[2],
        select: radiose[3],
        num: 1,
        row: this.row
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            var data = res.data.data;
            this.content = res.data.data;
            this.sumDataimplementation(radiose);
            this.loading = false;
            this.currentPage = 1;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击实施验收项目合计
    sumDataimplementation(radiose) {
      // console.log(this.pmStatusValNum);
      var param = {
        staffCode: this.userinfo.code,
        // status: radiose[0],
        status: this.pmStatusValNum, //8.28
        centerName: radiose[1],
        range: radiose[2],
        select: radiose[3],
        count: 1,
        num: 1,
        row: this.row
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            this.tabulardatas = res.data.data;
            this.pager.totalCount = Number(res.data.msg) * 10;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击查找范围
    searchscope(value) {
      this.getIndex = -1;
      // this.createBlock();
      this.tabulardata = [];
      // console.log(this.pmStatusValNum);
      var param = {
        staffCode: this.userinfo.code,
        range: value[0],
        centerName: value[1],
        select: value[2],
        // status: value[3]
        status: this.pmStatusValNum //8.28
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            this.loading = false;
            var data = res.data.data;
            // this.circulation(data);
            this.content = res.data.data;
            // console.log(this.content);
            this.sumDatasearchscope(value);
            this.pager.totalCount = Number(res.data.msg) * 10;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击查找范围合计
    sumDatasearchscope(value) {
      // console.log(this.pmStatusValNum);
      var param = {
        staffCode: this.userinfo.code,
        range: value[0],
        centerName: value[1],
        select: value[2],
        count: 1,
        // status: value[3]
        status: this.pmStatusValNum //8.28
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            this.tabulardatas = res.data.data;
            this.pager.totalCount = Number(res.data.msg) * 10;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击查询
    Projectaccountingchecks(inquire) {
      // console.log(this.pmStatusValNum);
      this.loading = true;
      this.getIndex = -1;
      // this.createBlock();
      this.tabulardata = [];
      var param = {
        staffCode: this.userinfo.code,
        select: inquire[0],
        centerName: inquire[1],
        range: inquire[2],
        // status: inquire[3]
        status: this.pmStatusValNum //8.28
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            // console.log(data)
            // this.circulation(data);
            this.content = res.data.data;
            this.sumDataProjectaccountingchecks(inquire);
            this.pager.totalCount = Number(res.data.msg) * 10;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    },
    //点击查询合计
    sumDataProjectaccountingchecks(inquire) {
      var param = {
        staffCode: this.userinfo.code,
        select: inquire[0],
        centerName: inquire[1],
        range: inquire[2],
        // status: inquire[3],
        status: this.pmStatusValNum, //8.28
        count: 1
      };
      detailedaccounting("/accounting/bg/center/data", param)
        .then(res => {
          if (res.data.code == 200) {
            this.tabulardatas = res.data.data;
            // this.pager.totalCount = Number(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //      回车键添加
    searchEnterFun: function(inquire) {
      var keyCode = window.event ? inquire.keyCode : inquire.which;
      //  console.log('回车搜索',keyCode,e);
      this.Projectaccountingchecks(inquire);
    },

    //点击获取表格信息
    projectNames(pnumVal) {
      // console.log(projectNames);
      // this.getIndex = projectNames[3].index;
      // console.log(projectNames[0])
      // this.accountingindices = projectNames[0];
      // var params = {
      //   contractId: projectNames[0],
      //   projectId: projectNames[1]
      // };
      // projecttabledata("/accounting/bg/center/department/data", params)
      //   .then(res => {
      //     this.showCardList = false;
      //     this.dialogFormVisible = true;
      //     this.tabulardata = res.data.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // console.log(pnumVal);
      var params = {
        projectNumber: pnumVal
      };
      CheckList("/sgpm/rest/api/server/pm/project/part/information", params)
        .then(res => {
          if (res.data.code == 200) {
            localStorage.setItem("projectNumber", pnumVal);
            this.$router.push({
              name: "/projectInformation",
              params: {
                id: res.data.data.ID,
                category: res.data.data.JUMPTYPE,
                projectName: res.data.data.PROJECTNAME,
                projectNumber: res.data.data.PROJECTNUMBER,
                parent_id: res.data.data.parent_id,
                judgeproject: "项目信息"
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击哪行哪行变色
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
      // console.log(rowIndex)
    },
    selectedHighlight({ row, rowIndex }) {
      if (this.getIndex === rowIndex) {
        return {
          "background-color": "#ECF5FF"
        };
      }
    },
    // 总计千分位
    thousall(money) {
      if (money == null) {
        return 0;
      }
      return (
        money &&
        money.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        })
      );
    },
    // 关闭弹框
    closeBtn() {
      this.showCardList = false;
    },
    //点击行
    handleRowChange(row, val) {
      // this.currentRow = val;
      // console.log(row)
      // console.log(row.filed19);
      // this.showCardList = true; //右边显示
      // var params = {
      //   projectId: row.filed19
      // };
      // DetailsCard("/accounting/bg/center/department/data/tree", params)
      //   .then(res => {
      //     // console.log(res.data.data)
      //     this.cardList = res.data.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    // 详情
    particulars(val) {
      this.showCardList = true; //右边显示
      var params = {
        projectId: val
      };
      DetailsCard("/accounting/bg/center/department/data/tree", params)
        .then(res => {
          // console.log(res.data.data)
          this.cardList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
    // indexMethod(index) {
    //   //设置序列号
    //   return index + 1;
    // }
  },
  watch: {
    isExpand(nval) {}
  }
};
</script>
<style type="text/css" lang="scss" scoped>
.el-table td,
.el-table th {
  padding: 2px 0 !important ;
}
.row-tittle {
  margin: 10px 0;
}
.tittle {
  font-weight: bold;
  font-size: 16px !important;
}
.title-position {
  text-align: left;
}
.edit {
  margin: 0 20px 0 20px;
  position: relative;
}
.edit .el-dialog {
  width: 90% !important;
}
.edit .query {
  margin: 10px 0 0 0;
}
.rgb196 {
  background: rgb(196, 196, 196);
}
.bacColor317eb0 {
  background: #317eb0;
}
.bacColorf4984e {
  background: #f4984e;
}
//表格标题颜色样式
.TitleColor {
  width: 18%;
  font-size: 14px;
  color: #909399;
  font-weight: bold;
  border: solid 1.5px #ebeef5;
  padding-left: 7px;
}
//表格钱数样式
.Tablestyle {
  width: 16%;
  padding: 5px 0px;

  border: solid 1.5px #ebeef5;
  padding-left: 2px;
}
@media screen and (min-width: 319px) and (max-width: 750px) {
  #table {
    height: 342px !important;
  }
  .header-lists {
    width: 390px !important;
  }
  .width {
    width: 270%;
  }
  // .acceptance {
  //   margin-left: 50px;
  // }
  #block {
    width: 383px !important;
  }
  .seek {
    display: none;
  }
  .seeks {
    display: none;
  }
  .please {
    width: 90% !important;
    margin-left: 4px !important;
    font-size: 12px;
  }
  .search {
    margin-top: 7px !important;
    margin-left: 5px !important;
  }
  .over {
    width: 100%;
    height: 480px !important;
  }
  table {
    width: 120%;
  }
}
.exports {
  position: absolute;
  right: 0;
  bottom: 34px;
}
.block {
  display: flex;
  margin: 10px 0 0 0;
  justify-content: flex-end;
}
.el-dialog__header {
  padding: 0 !important;
}
.tablist {
  width: 100%;
}
.tablistActive {
  width: calc(100% - 273px);
}
.please {
  width: 63% !important;
}
@media screen and (min-width: 750px) and (max-width: 1960px) {
  table {
    width: 99%;
  }
  td {
    border: 1px solid #293444;
  }

  .exports {
    position: absolute;
    right: 0;
    bottom: 34px;
  }
}
@media screen and (min-width: 1400px) and (max-width: 1450px) {
  // .seek {
  //   width: 35%;
  //   clear: both;
  //   margin-left: 1%;
  //   margin-top: 10px;
  // }
  // .search{
  // width: 35%;
  //   margin-left: 1%;
  //   margin-top: 10px;
  // }
}
@media screen and (min-width: 1201px) and (max-width: 1350px) {
  .edit .el-select {
    width: 56% !important;
  }
  .supernatantCar {
    width: 300px !important;
    right: -50px !important;
  }
  .supernatant .close {
    font-size: 24px;
    margin-right: 30px !important;
  }
  .supernatant .close i {
    font-size: 24px;
  }
  .tablistActive {
    width: calc(100% - 250px);
  }
}
@media screen and (min-width: 1100px) and (max-width: 1200px) {
  .edit .el-select {
    width: 50% !important;
  }
  .supernatantCar {
    width: 300px !important;
    right: -70px !important;
  }
  .supernatant .close {
    margin-right: 35px !important;
  }
  .tablistActive[data-v-321db484] {
    width: calc(100% - 230px);
  }
  .edit .el-radio {
    margin-right: 8px;
  }
  .acceptance {
    width: 42% !important;
  }

  .querys {
    width: 24% !important;
  }
  .querys .el-input {
    width: 55% !important;
  }
}

@media screen and (min-width: 900px) and (max-width: 1100px) {
  .edit .el-select {
    width: 60% !important;
  }
  .supernatantCar {
    width: 310px !important;
  }
  .supernatant .close {
    margin-right: 15px;
  }
  .tablistActive[data-v-321db484] {
    width: calc(100% - 250px);
  }
}

// 卡片样式
.supernatantCar {
  width: 300px;
  min-height: 760px;
  position: absolute;
  right: -30px;
  background: #fff;

  top: 0;
  z-index: 888999;
  box-shadow: 1px 3px 3px 2px #d0cbcb;
  border-radius: 3px;
  .supernatant {
    width: 96%;
    margin: 0 auto;
    .close {
      float: right;
      margin: 15px 0;
      font-size: 14px;
      margin-right: 15px;
      padding: 0 5px;
      i {
        font-size: 20px;
      }
    }
  }
}
.Blockunit {
  font-size: 14px;
  float: left;
  margin-top: 15px;
}
.el-radio {
  margin-right: 20px;
}
.mybox-leave-active,
.mybox-enter-active {
  transition: all 1s ease-in-out;
}
.mybox-leave-active,
.mybox-enter {
  right: -500px !important;
}
.mybox-leave,
.mybox-enter-active {
  right: -70px;
}
.mytable-leave-active,
.mytable-enter-active {
  transition: all 2s ease-in-out;
}
.mytable-leave-active,
.mytable-enter {
  width: 100%;
}
.mytable-leave,
.mytable-enter-active {
  width: 72%;
}
.el-table--scrollable-y .el-table__body-wrapper {
  z-index: 2 !important;
}
.el-table__body-wrapper,
.is-scrolling-middle {
  z-index: 2 !important;
}
.pname {
  max-width: 220px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.unit {
  text-align: right;
  float: right;
  font-size: 16px;
  padding-right: 15px !important;
}
</style>
