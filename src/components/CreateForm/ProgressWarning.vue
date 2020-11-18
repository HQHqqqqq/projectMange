<template>
  <div class="board-warning" :style="{height:asideHeight+'px'}">
    <el-row :gutter="50" class="board-row">
      <el-col :span="12" class="chart-border">
        <chart :options="implementOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="在实施项目不同项目阶段的个数和累计合同额 "
            placement="bottom"
          >
            <el-button type="text">
              <i class="el-icon-warning-outline smark-icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="implementTypeOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="1）在实施项目：项目启动但未验收关闭；
           2）延期率：所处阶段延期天数/总工期；
           3）严重延期：延期率〉30% ；
            4）一般延期：30%>延期率>=10% ；
            5）正常项目：延期率<10%"
            placement="bottom"
          >
            <el-button type="text">
              <i class="el-icon-warning-outline smark-icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="50" class="board-row">
      <el-col :span="24">
        <table-bar
          :table-list="progressTable"
          table-title="各经营单位在实施项目进度分析"
          tooltip="1）在实施项目：项目启动但未验收关闭； 2）延期率：所处阶段延期天数/总工期；3）严重延期：延期率〉30% ； 4）一般延期：30%>延期率>=10% ；5）正常项目：延期率<10%"
          v-if="isProgressTable"
        ></table-bar>
      </el-col>
      <el-col :span="24">
        <table-bar
          :table-list="checkTable"
          table-title="在实施项目验收延期"
          tooltip="1）验收延期：计划验收但实际未验收的项目；2）严重延期：验收延期三个月以上；3）一般延期：验收延期三个月以内；4）正常：验收未延期"
          v-if="ischeckTable"
        ></table-bar>
      </el-col>
      <el-col :span="24">
        <table-bar
          :table-list="proBiggerTable"
          table-title="500万以上在实施项目进度延期"
          tooltip="1）延期率：所处阶段延期天数/总工期；2）严重延期：延期率〉30% ； 3）一般延期：30%>延期率>=10% ；4）正常项目：延期率<10%"
          v-if="isProBiggerTable"
        ></table-bar>
      </el-col>
      <el-col :span="24">
        <table-bar-second :table-list="backMoneyTable" v-if="isBackMoneyTable"></table-bar-second>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  projectImplementChart,
  projectImplementTypeChart,
  proStatistics,
  proCheck,
  proBigger,
  proBackMoney
} from "../../api/api.js";
import chart from "../CreateForm/chart/ECharts";
import TableBar from "./TableBar";
import TableBarSecond from "./TableBarSecond";
import Bus from "../../bus";
export default {
  name: "ProgressWarning",
  components: {
    chart,
    TableBar,
    TableBarSecond
  },
  data() {
    return {
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
      progressTable: [],
      checkTable: [],
      proBiggerTable: [],
      backMoneyTable: [],
      implementOption: {
        title: {
          text: "在实施项目不同阶段数量和金额分析",
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
        grid: { top: "80" },
        legend: {
          data: ["合同额", "项目个数"],
          top: "10%"
        },
        xAxis: [
          {
            type: "category",
            data: ["启动", "规划", "实施", "收尾"]
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
      implementTypeOption: {
        title: {
          text: "在实施项目进度分析",
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
        grid: { top: "80" },
        xAxis: [
          {
            type: "category",
            data: ["严重延期", "一般延期", "正常"]
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
        series: [
          // {
          //   color: "#65cee8",
          //   itemStyle: { opacity: 0.7, color: "#ade1fb" },
          //   name: "回款额",
          //   type: "bar",
          //   data: [10, 52, 200, 334]
          // },
          // {
          //   type: "line",
          //   yAxisIndex: 1,
          //   name: "项目个数",
          //   lineStyle: {
          //     color: "#fecb42",
          //     shadowOffsetY: 3,
          //     shadowColor: "#af8003",
          //     shadowBlur: 6
          //   },
          //   itemStyle: {
          //     color: "#ffb900"
          //   },
          //   data: [45, 577, 687, 454]
          // }
        ]
      },
      isProgressTable: true,
      ischeckTable: true,
      isProBiggerTable: true,
      isBackMoneyTable: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    asideHeight: function() {
      return document.documentElement.clientHeight - 150;
    }
  },
  methods: {
    init() {
      this.getImplementOptionData();
      this.projectImplementTypeChart();
      this.progressStatisticsTableBar();
      this.proCheck();
      this.proBigger();
      this.getProBackMoney();
    },
    // 在实施项目总览
    getImplementOptionData() {
      var urlParam = this.$route.path.slice(1);
      projectImplementChart(
        `/board/process/project/overview?group=${this.path[urlParam]}`,
        null
      )
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
            this.implementOption.series = ary.reverse();
            this.implementOption.xAxis[0].data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //在实施项目状态总览
    projectImplementTypeChart() {
      var urlParam = this.$route.path.slice(1);
      projectImplementTypeChart(
        `/board/process/project/states?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let countList = res.data.data[0].data;
            let moneyList = res.data.data[1].data;
            let objMoney = { name: "合同额", type: "bar", data: [] };
            let obj = {};
            let ary = [];
            moneyList.forEach((item, index) => {
              if (index == 0) {
                objMoney.data.push({
                  name: "严重延期",
                  value: item,
                  itemStyle: {
                    color: "#FF9999"
                  },
                  label: {
                    normal: {
                      show: true,
                      position: "top",
                      color: "#000"
                    }
                  }
                });
              } else if (index == 1) {
                objMoney.data.push({
                  name: "一般延期",
                  value: item,
                  itemStyle: {
                    color: "#ffd699"
                  },
                  label: {
                    normal: {
                      show: true,
                      position: "top",
                      color: "#000"
                    }
                  }
                });
              } else {
                objMoney.data.push({
                  name: "正常",
                  value: item,
                  itemStyle: {
                    color: "#8deb8d"
                  },
                  label: {
                    normal: {
                      show: true,
                      position: "top",
                      color: "#000"
                    }
                  }
                });
              }
            });
            obj["type"] = "line";
            obj["name"] = "项目个数";
            obj["data"] = countList;
            obj["yAxisIndex"] = 1;
            obj["lineStyle"] = {
              color: "#fecb42",
              shadowOffsetY: 3,
              shadowColor: "#af8003",
              shadowBlur: 6
            };
            obj["itemStyle"] = {
              color: "#ffb900"
            };
            this.implementTypeOption.series.push(obj);
            this.implementTypeOption.series.push(objMoney);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //在实施项目进度状态统计
    progressStatisticsTableBar() {
      this.isProgressTable = false;
      var urlParam = this.$route.path.slice(1);
      proStatistics(
        `/board/process/project/statistics?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            this.isProgressTable = true;
            this.progressTable = result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目验收延期统计
    proCheck() {
      var urlParam = this.$route.path.slice(1);
      this.ischeckTable = false;
      proStatistics(
        `/board/process/project/check?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            this.ischeckTable = true;
            this.checkTable = result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //大型项目延期统计
    proBigger() {
      var urlParam = this.$route.path.slice(1);
      this.isProBiggerTable = false;
      proBigger(
        `/board/process/project/big/check?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            this.isProBiggerTable = true;
            this.proBiggerTable = result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //大型项目延期统计
    getProBackMoney() {
      var urlParam = this.$route.path.slice(1);
      this.isBackMoneyTable = false;
      proBackMoney(
        `/board/process/receiced/delay/statistics?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            this.isBackMoneyTable = true;
            this.backMoneyTable = result;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.board-warning {
  overflow-y: auto;
  overflow-x: hidden;
  .board-row {
    margin: 0;
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
}
</style>