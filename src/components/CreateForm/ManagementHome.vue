<template>
  <div class="management-home" :style="{height:asideHeight+'px'}">
    <div class="headline">
      <div class="warp">
        <div><span>{{headlineTitle=="上海南康"?"南康科技":headlineTitle}}</span></div>
        <div>
          <el-button type="text" class="downLoading" @click="downLoad">导出</el-button>
          <span>单位：万元</span>
        </div>
        
        
      </div>
      <p class="titlebz" v-if="headlineTitle=='上海南康'">项目数据起始于2015年</p>
      <p class="titlebz" v-else>项目数据起始于2010年</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="5">
        <div class="card">
          <p class="title">总项目</p>
          <ul>
            <li>
              <span>个数</span>
              <span class="num">{{countCard.count}}</span>
            </li>
            <li>
              <span>合同额</span>
              <span class="num">{{countCard.contractAmount}}</span>
            </li>
            <li>
              <span>已回款</span>
              <span class="num">{{countCard.moneyBack|isNull}}</span>
            </li>
            <li>
              <span>待回款</span>
              <span class="num">{{countCard.waitMoneyBack|isNull}}</span>
            </li>
          </ul>
        </div>
      </el-col>

      <el-col :span="5">
        <div class="card">
          <p class="title">在实施</p>
          <ul>
            <li>
              <span>个数</span>
              <span class="num">{{todoCard.count}}</span>
            </li>
            <li>
              <span>合同额</span>
              <span class="num">{{todoCard.contractAmount}}</span>
            </li>
            <li>
              <span>已回款</span>
              <span class="num">{{todoCard.moneyBack}}</span>
            </li>
            <li>
              <span>待回款</span>
              <span class="num">{{todoCard.waitMoneyBack}}</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="card">
          <p class="title">已验收</p>
          <ul>
            <li>
              <span>个数</span>
              <span class="num">{{unCloseCard.count}}</span>
            </li>
            <li>
              <span>合同额</span>
              <span class="num">{{unCloseCard.contractAmount}}</span>
            </li>
            <li>
              <span>已回款</span>
              <span class="num">{{unCloseCard.moneyBack}}</span>
            </li>
            <li>
              <span>待回款</span>
              <span class="num">{{unCloseCard.waitMoneyBack}}</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="card">
          <p class="title">已关闭</p>
          <ul>
            <li>
              <span>个数</span>
              <span class="num">{{enCloseCard.count}}</span>
            </li>
            <li>
              <span>合同额</span>
              <span class="num">{{enCloseCard.contractAmount}}</span>
            </li>
            <li>
              <span>已回款</span>
              <span class="num">{{enCloseCard.moneyBack|isNull}}</span>
            </li>
            <li>
              <span>待回款</span>
              <span class="num">{{enCloseCard.waitMoneyBack|isNull}}</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="card">
          <p class="title">其他</p>
          <ul>
            <li>
              <span>个数</span>
              <span class="num">{{otherCard.count}}</span>
            </li>
            <li>
              <span>合同额</span>
              <span class="num">{{otherCard.contractAmount}}</span>
            </li>
            <li>
              <span>已回款</span>
              <span class="num">{{otherCard.moneyBack|isNull}}</span>
            </li>
            <li>
              <span>待回款</span>
              <span class="num">{{otherCard.waitMoneyBack|isNull}}</span>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div class="middle">
      <el-row :gutter="50">
        <el-col :span="12" class="chart-border">
          <chart :options="leftChartOption" ref="leftChart"></chart>
          <div class="smark">
            <el-tooltip
              class="item"
              effect="light"
              content="近五年每年新增应用项目的个数和累计合同额"
              placement="bottom"
            >
              <el-button type="text">
                <i class="el-icon-warning-outline smark-icon"></i>
              </el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col :span="12" class="chart-border">
          <chart :options="rightChartOption"></chart>
          <div class="smark">
            <el-tooltip
              class="item"
              effect="light"
              content="未回款完毕且可以回款的项目，按照项目阶段分别统计项目个数和尾款金额"
              placement="bottom"
            >
              <el-button type="text">
                <i class="el-icon-warning-outline smark-icon"></i>
              </el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      class="table"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}"
      :cell-style="{padding:0}"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column width="180" label="经营单位">
        <template slot-scope="scope">
          <!-- {{scope.row.show}} -->
          <router-link
            v-if="headlineTitle!='集团'&&scope.row.show"
            :to="{path:`/projectAdjust?payment=${scope.row.group}`}"
          >
            <span class="num">{{scope.row.group}}</span>
          </router-link>
          <router-link v-else-if="scope.row.show" :to="{path: pathReversal[scope.row.group]}">
            <span class="num">{{scope.row.group}}</span>
          </router-link>
          <span v-else>{{scope.row.group}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="项目状态"></el-table-column>
      <el-table-column prop="count" label="个数"></el-table-column>
      <el-table-column prop="contractAmount" label="合同额"></el-table-column>
      <el-table-column prop="prueContractAmount" label="纯合同额"></el-table-column>
      <el-table-column prop="moneyBack" label="已回款"></el-table-column>
      <el-table-column prop="waitMoneyBack" label="待回款"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getBordTable, returnedChart, projectChart } from "../../api/api.js";
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import chart from "../CreateForm/chart/ECharts";
import BoardWarning from "./BoardWarning";
import { mapState, mapActions } from "vuex";
import api from "../../api/index";
export default {
  name: "ManagementHome",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {
    GenerateForm,
    chart,
    BoardWarning
  },
  data() {
    return {
      tableData: [],
      leftChartOption: {
        title: {
          text: "近五年逐年新增项目分析",
          left: "center"
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            axis: "x",
            crossStyle: {
              color: "#999"
            }
          }
        },
        grid: { left: "12%", top: "25%" },
        legend: {
          data: ["合同额", "项目个数"],
          top: "bottom",
          left: "43%"
        },
        xAxis: [
          {
            type: "category",
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "金额(万元)",
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            name: "个数",
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value} "
            }
          }
        ],
        series: []
      },
      rightChartOption: {
        title: {
          text: "项目各阶段尾款分析",
          left: "center"
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },

        legend: {
          data: ["尾款金额", "项目个数"],
          top: "bottom",
          left: "43%"
        },
        grid: { left: "12%", top: "25%" },
        xAxis: [
          {
            type: "category",
            data: ["启动", "规划", "实施", "收尾"],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "金额(万元)",
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            name: "个数",
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: []
      },
      path: {
        managerBoard: "应用业务群",
        managerBoardGroup: "集团",
        managerBoardPlatform: "平台业务群",
        managerBoardCloud: "云业务群",
        managerBoardInternational: "国际业务群",
        managerBoardResearch: "研究院",
        ManagerBoardGT: "国图信息",
        ManagerBoardNK: "南康科技",
        ManagerBoardAT: "北京世纪安图",
      },
      pathReversal: {
        应用业务群: "managerBoard",
        平台业务群: "managerBoardPlatform",
        云业务群: "managerBoardCloud",
        国际业务群: "managerBoardInternational",
        研究院: "managerBoardResearch",
        国图信息: "ManagerBoardGT",
        南康科技: "ManagerBoardNK",
        北京世纪安图: "ManagerBoardAT",
      },
      headlineTitle: "",
      countCard: {},
      todoCard: {},
      unCloseCard: {},
      enCloseCard: {},
      otherCard: {}
    };
  },
  filters: {
    isNull: function(value) {
      if (value) {
        return value;
      } else {
        return "--";
      }
    }
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    asideHeight: function() {
      return document.documentElement.clientHeight - 150;
    }
  },
  mounted() {
    this.getReturnedChart();
    this.getProjectChart();
    this.getMgBordTable();
  },
  methods: {
    downLoad(){
      const link = document.createElement('a')
      const body = document.querySelector('body')
      let companyId = this.userinfo.account_id

      link.href = api.urlPort04+'/sgpm/rest/api/server/pm/project/excel/export?companyId='+companyId
      // link.download = fileName

      // fix Firefox
      link.style.display = 'none'
      body.appendChild(link)

      link.click()
      body.removeChild(link)
    },
    //获取管理看板表格
    getMgBordTable() {
      console.log(this.$route.path.slice(1));
      var urlParam = this.$route.path.slice(1);
      this.headlineTitle = this.path[urlParam];
      console.log(this.userinfo);
      getBordTable(
        `/board/data/table?group=${this.path[urlParam]}&memberId=${this.userinfo.memberid}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.table;
            this.countCard = res.data.data.countCard;
            this.todoCard = res.data.data.todoCard;
            this.unCloseCard = res.data.data.unCloseCard;
            this.enCloseCard = res.data.data.enCloseCard;
            this.otherCard = res.data.data.otherCard;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //右边柱状图
    getReturnedChart() {
      var urlParam = this.$route.path.slice(1);
      returnedChart(`/board/returned/amount?group=${this.path[urlParam]}`, null)
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let obj = {};
            let ary = [];
            result.forEach(item => {
              if (item.name == "项目个数") {
                item["type"] = "line";
                item["yAxisIndex"] = 1;
                item["lineStyle"] = {
                  color: "#fecb42",
                  shadowOffsetY: 3,
                  shadowColor: "#af8003",
                  shadowBlur: 6
                };
                item["itemStyle"] = {
                  color: "#ffb900"
                };

                obj = item;
                ary.push(obj);
              } else {
                item["type"] = "bar";
                item["color"] = "#65cee8";
                item["label"] = {
                  normal: {
                    show: true,
                    position: "top",
                    color: "#000"
                  }
                };

                item["itemStyle"] = {
                  opacity: 0.7,
                  color: "#ade1fb"
                };
                let dataFix = item.data.map(ele => {
                  return ele.toFixed(2);
                });
                obj = item;
                item.data = dataFix;
                ary.push(obj);
              }
            });
            this.rightChartOption.series = ary.reverse();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //左边柱状图
    getProjectChart() {
      var urlParam = this.$route.path.slice(1);
      projectChart(`/board/project/account?group=${this.path[urlParam]}`, null)
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let obj = {};
            let ary = [];
            result.forEach(item => {
              if (item.name == "合同金额") {
                item["type"] = "bar";
                item["color"] = "#65cee8";
                item["label"] = {
                  normal: {
                    show: true,
                    position: "top",
                    color: "#000"
                  }
                };
                item["itemStyle"] = {
                  opacity: 0.7,
                  color: "#ade1fb"
                };
                let dataFix = item.data.map(ele => {
                  return ele.toFixed(2);
                });
                obj = item;
                item.data = dataFix;
                item.name = "合同额";
                ary.push(obj);
              } else if (item.name == "项目个数") {
                item["type"] = "line";
                item["yAxisIndex"] = 1;
                item["lineStyle"] = {
                  color: "#fecb42",
                  shadowOffsetY: 3,
                  shadowColor: "#af8003",
                  shadowBlur: 6
                };
                item["itemStyle"] = {
                  color: "#ffb900"
                };

                obj = item;
                ary.push(obj);
              }
            });
            this.leftChartOption.series = ary;
            this.leftChartOption.xAxis[0].data = result[2].data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.management-home {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 0 0;
  .card {
    padding: 0 15px;
    height: 200px;
    text-align: center;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #ededed;
    border-radius: 5px;
    background: #f8f7f7;
    & .title {
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
      margin: 10px 0;
    }
    & ul {
      text-align: left;
      list-style: none;
      padding-left: 0px;
      li {
        display: flex;
        justify-content: space-between;
        margin: 4px 0;
        text-align: center;
        & > span:nth-child(1) {
          display: inline-block;
        }
        & > .num {
          background: #e5ecf1;
          border-radius: 8px;
          padding: 2px 10px;
        }
      }
    }
  }
  .headline {
    margin: 0 0 20px 0;
    border-bottom: 1px solid #e7e7e7;
    .warp {
      display: flex;
      justify-content: space-between;
      margin: 0;
      & > span:nth-child(1) {
        font-weight: bold;
      }
      .downLoading{
        margin-right:20px ;
      }
    }
    .titlebz {
      color: gray;
      font-size: 12px;
    }
  }
  .middle {
    margin: 20px 0 0 0;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;
    padding: 30px 0;
  }
  .table {
    .num {
      color: #409eff;
      text-decoration: underline;
    }
  }
  .chart-border {
    position: relative;
    .smark {
      position: absolute;
      right: 53px;
      top: -5px;
      .smark-icon {
        color: gray;
        font-size: 18px;
      }
    }
  }
}
</style>