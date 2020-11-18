<template>
  <div class="board-warning" :style="{height:asideHeight+'px'}">
    <el-row :gutter="50" class="board-row">
      <el-col :span="12" class="chart-border">
        <chart :options="warningOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="1）在实施项目：项目启动但未验收关闭；2）实际损益率=项目损益/回款；
             3）项目损益=纯合同额-项目采购成本支出-实施费用支出-销售费用支出"
            placement="bottom"
          >
            <el-button type="text">
              <i class="el-icon-warning-outline smark-icon"></i>
            </el-button>
          </el-tooltip>
        </div>
        <!-- <p class="remark">备注：项目收益率<30%</p> -->
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="progressOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="1）在实施项目：项目启动但未验收关闭；2）延期率：所处阶段延期天数/总工期；
                     3）  严重延期：延期率〉30% ；4）一般延期：30%>延期率>=10%"
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
      <el-col :span="12" class="chart-border">
        <chart :options="returnedMoneyOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="1）在实施项目：项目启动但未验收关闭；
            2）项目支出：包括采购成本、实施费用、人力成本；  
            3）柱状图：项目支出超出项目回款的累计差额"
            placement="bottom"
          >
            <el-button type="text">
              <i class="el-icon-warning-outline smark-icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="returnedPlanOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="
          1）在实施项目：项目启动但未验收关闭；
          2）回款延期：实际回款滞后回款计划 ；
          3）柱状图：项目实际回款滞后计划回款的累计差额"
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
      <el-col :span="12" class="chart-border">
        <chart :options="overspendOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="
          1）在实施项目：项目启动但未验收关闭；
          2）超支：运营费用、采购成本和人工成本支出超过预算； 
          3）柱状图：累计超支金额
         "
            placement="bottom"
          >
            <el-button type="text">
              <i class="el-icon-warning-outline smark-icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="payOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="
          1）待支付：项目已验收且已全部回款，但项目采购成本未支付完毕 ；
          2）柱状图：待支付项目采购累计金额
         "
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
      <el-col :span="12" class="chart-border">
        <chart :options="depositOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="
          1）保证金未回：项目已验收，履约保证金收入少于履约保证金支出；
          2）柱状图：待回履约保证金累计金额
         "
            placement="bottom"
          >
            <el-button type="text">
              <i class="el-icon-warning-outline smark-icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="hrOption"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="
          项目工时填写率=人力资源填写工时/人力资源应填工时
         "
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
</template>

<script>
import {
  earlyWarning,
  repaymentWarning,
  payWarning,
  earnestMoneyWarning,
  processWarning,
  profitWarning,
  repaymentPlanWarning
} from "../../api/api.js";
import chart from "../CreateForm/chart/ECharts";
export default {
  name: "BoardWarning",
  components: {
    chart
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
      warningOption: {
        title: {
          text: "在实施项目实际损益率低于30%",
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
        grid: { left: "12%", bottom: "18%", top: "80" },
        // legend: {
        //   data: ["个数"],
        //   top: "10%"
        // },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
            }
          }
        ],
        yAxis: [
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
      progressOption: {
        title: {
          text: "在实施项目进度延期",
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
        grid: { left: "12%", bottom: "18%", top: "80" },
        // legend: {
        //   data: ["个数"],
        //   top: "10%",
        //   left: "43%"
        // },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
            }
          }
        ],
        yAxis: [
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
      returnedMoneyOption: {
        title: {
          text: "在实施项目支出超过回款",
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
        grid: { left: "12%", bottom: "18%", top: "80" },
        legend: {
          data: ["差额", "个数"],
          top: "10%"
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
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
              formatter: "{value} "
            }
          }
        ],
        series: []
      },
      returnedPlanOption: {
        title: {
          text: "在实施项目回款延期",
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
        grid: { left: "12%", bottom: "18%", top: "80" },
        legend: {
          data: ["差额", "个数"],
          top: "10%"
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
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
              formatter: "{value} "
            }
          }
        ],
        series: []
      },
      planOption: {
        title: {
          text: "项目回款预警-回款滞后计划",
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
        grid: { left: "12%", bottom: "25%" },
        legend: {
          data: ["回款额", "项目个数"],
          top: "bottom",
          left: "43%"
        },
        xAxis: [
          {
            type: "category",
            data: ["专用工程中心", "环境工程中心", "智慧中心", "城市网络中心"],
            axisLabel: {
              rotate: 40
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
              formatter: "{value} "
            }
          }
        ],
        series: [
          {
            color: "#65cee8",
            itemStyle: { opacity: 0.7, color: "#ade1fb" },
            name: "回款额",
            type: "bar",
            data: [10, 52, 200, 334]
          },
          {
            type: "line",
            yAxisIndex: 1,
            name: "项目个数",
            lineStyle: {
              color: "#fecb42",
              shadowOffsetY: 3,
              shadowColor: "#af8003",
              shadowBlur: 6
            },
            itemStyle: {
              color: "#ffb900"
            },
            data: [45, 577, 687, 454]
          }
        ]
      },
      //超支预警
      overspendOption: {
        title: {
          text: "在实施项目支出超过预算",
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
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          type: "scroll",
          top: "8%",
          width: "80%",
          data: [
            "运营费用超支个数",
            "采购成本超支个数",
            "人工成本超支个数",
            "运营费用超支金额",
            "采购成本超支金额",
            "人工成本超支金额"
          ]
        },
        grid: {
          top: "100",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
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
            },
            offset: 12
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
      //项目支付预警
      payOption: {
        title: {
          text: "已验收已100%回款待支付",
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
        grid: { left: "12%", bottom: "15%", top: "80" },
        legend: {
          data: ["待支付金额", "待支付项目个数"],
          top: "10%"
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
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
              formatter: "{value} "
            }
          }
        ],
        series: []
      },
      //项目保证金预警
      depositOption: {
        title: {
          text: "已验收履约保证金未回",
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
        grid: { left: "12%", bottom: "18%", top: "80" },
        legend: {
          data: ["应回未回金额", "应回未回个数"],
          top: "10%"
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 20
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
              formatter: "{value} "
            }
          }
        ],
        series: []
      },
      hrOption: {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        title: {
          text: "项目工时填写率小于30%（示意图）",
          left: "center"
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
        grid: { left: "12%", bottom: "15%", top: "80" },
        // legend: {
        //   data: ["闲置率"],
        //   top: "10%"
        // },
        xAxis: [
          {
            type: "category",
            data: [
              "专用工程中心",
              "智慧城市工程中心",
              "城市网格工程中心",
              "智慧设施工程中心"
            ],
            axisLabel: {
              rotate: 20
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: " %",
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            color: "#65cee8",
            itemStyle: { opacity: 0.9, color: "#FF9999" },
            name: "填写率",
            type: "bar",
            data: [3, 12, 21, 29]
          }
        ]
      }
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
      this.getProgressWarning();
      this.getOverSpendWarning();
      this.getrepaymenWarning();
      this.getPayWarning();
      this.getEarnestMoneyWarning();
      this.getProfitWarning();
      this.getRepaymenPlanWarning();
    },

    // 项目超支预警
    getOverSpendWarning() {
      var urlParam = this.$route.path.slice(1);
      earlyWarning(
        `/board/over/expend/early/warning?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let nameList = [];
            let caigouBalanceList = [];
            let caigouCountList = [];
            let rengongBalanceList = [];
            let rengongCountList = [];
            let yunyingBalanceList = [];
            let yunyingCountList = [];
            result.forEach(ele => {
              nameList.push(ele.name);
              caigouBalanceList.push(ele.caigouBalance);
              caigouCountList.push(ele.caigouCount);
              rengongBalanceList.push(ele.rengongBalance);
              rengongCountList.push(ele.rengongCount);
              yunyingBalanceList.push(ele.yunyingBalance);
              yunyingCountList.push(ele.yunyingCount);
            });
            this.overspendOption.series.push({
              name: "运营费用超支金额",
              type: "bar",
              // stack: "广告",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              data: yunyingBalanceList
            });
            this.overspendOption.series.push({
              name: "采购成本超支金额",
              type: "bar",
              // stack: "广告",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FFC266" },
              data: caigouBalanceList
            });
            this.overspendOption.series.push({
              name: "人工成本超支金额",
              type: "bar",
              // stack: "广告",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FFFF00" },
              data: rengongBalanceList
            });
            this.overspendOption.series.push({
              name: "运营费用超支个数",
              symbolSize: 4,
              symbol: "circle",
              type: "line",
              yAxisIndex: 1,
              itemStyle: {
                color: "#FF9999"
              },
              lineStyle: {
                color: "#FF9999",
                shadowOffsetY: 3,
                shadowColor: "#af8003",
                shadowBlur: 6
              },
              data: yunyingCountList
            });
            this.overspendOption.series.push({
              name: "采购成本超支个数",
              symbolSize: 4,
              symbol: "circle",
              type: "line",
              yAxisIndex: 1,
              itemStyle: {
                color: "#f4a351"
              },
              lineStyle: {
                color: "#FFC266",
                shadowOffsetY: 3,
                shadowColor: "#833d02",
                shadowBlur: 6
              },
              data: caigouCountList
            });
            this.overspendOption.series.push({
              name: "人工成本超支个数",
              symbolSize: 4,
              symbol: "circle",
              type: "line",
              yAxisIndex: 1,
              itemStyle: {
                color: "#FFFF00"
              },
              lineStyle: {
                color: "#FFFF00",
                shadowOffsetY: 3,
                shadowColor: "#f56954",
                shadowBlur: 6
              },
              data: rengongCountList
            });
            this.overspendOption.xAxis[0].data = nameList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 项目支付预警
    getPayWarning() {
      var urlParam = this.$route.path.slice(1);
      payWarning(`/board/warning/pay?group=${this.path[urlParam]}`, null)
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let allCountList = [];
            let waitPayMoneyList = [];
            let bLevelUnitList = [];
            result.forEach(ele => {
              allCountList.push(ele.allCount);
              waitPayMoneyList.push(ele.waitPayMoney);
              bLevelUnitList.push(ele.bLevelUnit);
            });
            this.payOption.series.push({
              color: "#FF9999",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              name: "待支付金额",
              type: "bar",
              data: waitPayMoneyList
            });
            this.payOption.series.push({
              type: "line",
              yAxisIndex: 1,
              name: "待支付项目个数",
              lineStyle: {
                color: "#fecb42",
                shadowOffsetY: 3,
                shadowColor: "#af8003",
                shadowBlur: 6
              },
              itemStyle: {
                color: "#ffb900"
              },
              data: allCountList
            });
            this.payOption.xAxis[0].data = bLevelUnitList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保证金预警
    getEarnestMoneyWarning() {
      var urlParam = this.$route.path.slice(1);
      earnestMoneyWarning(
        `/board/warning/earnestmoney?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let allCountList = [];
            let moneyList = [];
            let bLevelUnitList = [];
            result.forEach(ele => {
              allCountList.push(ele.allCount);
              moneyList.push(ele.money);
              bLevelUnitList.push(ele.bLevelUnit);
            });
            this.depositOption.series.push({
              color: "#65cee8",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              name: "应回未回金额",
              type: "bar",
              data: moneyList
            });
            this.depositOption.series.push({
              type: "line",
              yAxisIndex: 1,
              name: "应回未回个数",
              lineStyle: {
                color: "#fecb42",
                shadowOffsetY: 3,
                shadowColor: "#af8003",
                shadowBlur: 6
              },
              itemStyle: {
                color: "#ffb900"
              },
              data: allCountList
            });
            this.depositOption.xAxis[0].data = bLevelUnitList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 项目回款预警
    getrepaymenWarning() {
      var urlParam = this.$route.path.slice(1);
      repaymentWarning(
        `/board/early/warning/repayment?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let allCountList = [];
            let paymentDifferenceList = [];
            let centerNameList = [];
            result.forEach(ele => {
              allCountList.push(ele.allCount);
              paymentDifferenceList.push(ele.paymentDifference);
              centerNameList.push(ele.name);
            });
            this.returnedMoneyOption.series.push({
              color: "#65cee8",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              name: "差额",
              type: "bar",
              data: paymentDifferenceList
            });
            this.returnedMoneyOption.series.push({
              type: "line",
              yAxisIndex: 1,
              name: "个数",
              lineStyle: {
                color: "#fecb42",
                shadowOffsetY: 3,
                shadowColor: "#af8003",
                shadowBlur: 6
              },
              itemStyle: {
                color: "#ffb900"
              },
              data: allCountList
            });
            this.returnedMoneyOption.xAxis[0].data = centerNameList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 项目回款滞后华预警
    getRepaymenPlanWarning() {
      var urlParam = this.$route.path.slice(1);
      repaymentPlanWarning(
        `/board/early/warning/payment/delay?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let allCountList = [];
            let paymentDifferenceList = [];
            let centerNameList = [];
            result.forEach(ele => {
              allCountList.push(ele.allCount);
              paymentDifferenceList.push(ele.paymentDifference);
              centerNameList.push(ele.name);
            });
            this.returnedPlanOption.series.push({
              color: "#65cee8",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              name: "差额",
              type: "bar",
              data: paymentDifferenceList
            });
            this.returnedPlanOption.series.push({
              type: "line",
              yAxisIndex: 1,
              name: "个数",
              lineStyle: {
                color: "#fecb42",
                shadowOffsetY: 3,
                shadowColor: "#af8003",
                shadowBlur: 6
              },
              itemStyle: {
                color: "#ffb900"
              },
              data: allCountList
            });
            this.returnedPlanOption.xAxis[0].data = centerNameList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目进度预警
    getProgressWarning() {
      var urlParam = this.$route.path.slice(1);
      processWarning(
        `/board/process/plan/warning?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let countList = [];
            let centerNameList = [];
            result.forEach(ele => {
              centerNameList.push(ele.centerName);
              countList.push(ele.count);
            });
            this.progressOption.series.push({
              color: "#65cee8",
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              name: "个数",
              type: "bar",
              data: countList
            });
            this.progressOption.xAxis[0].data = centerNameList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目利润预警
    getProfitWarning() {
      var urlParam = this.$route.path.slice(1);
      profitWarning(
        `/board/process/profit/warning?group=${this.path[urlParam]}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            let countList = [];
            let centerNameList = [];
            result.forEach(ele => {
              centerNameList.push(ele.centerName);
              countList.push(ele.count);
            });
            this.warningOption.series.push({
              color: "#65cee8",
              itemStyle: { opacity: 0.9, color: "#FF9999" },
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#000"
                }
              },
              name: "个数",
              type: "bar",
              data: countList
            });
            this.warningOption.xAxis[0].data = centerNameList;
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
    margin: 0 0 14px 0;
    .remark {
      margin: 0;
      text-align: center;
      font-size: 12px;
      color: #b2b2b2;
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
}
</style>