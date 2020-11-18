<template>
  <div class="table-bar">
    <el-row>
      <h3 class="default">{{tableTitle}}</h3>
    </el-row>
    <el-row :gutter="40" class="con">
      <p class="unit default">单位：个</p>
      <el-col :span="12">
        <el-table
          :data="tableData"
          border
          :summary-method="getSummaries"
          show-summary
          max-height="260"
          :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
          :row-style="{height:'50px'}"
          :cell-style="{padding:0}"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="bLevelUnit" label="经营单位" width="150"></el-table-column>
          <el-table-column prop="badDelay" label="严重延期" align="center">
            <template slot-scope="scope">
              <el-tag size="medium" class="bad-delay">{{ scope.row.badDelay }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="generalDelay" label="一般延期" align="center">
            <template slot-scope="scope">
              <el-tag size="medium" class="general-delay">{{ scope.row.generalDelay }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="normal" label="正常" align="center">
            <template slot-scope="scope">
              <el-tag size="medium" class="normal">{{ scope.row.normal }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="allCount" label="总数" align="center">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.allCount }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="option" ref="chartRef"></chart>
        <div class="smark">
          <el-tooltip class="item" effect="light" :content="tooltip" placement="bottom">
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
import { getMenuList } from "../../api/api.js";
import chart from "../CreateForm/chart/ECharts";
import Bus from "../../bus";
export default {
  name: "TableBar",
  components: {
    chart
  },
  props: ["tableList", "tableTitle", "tooltip"],
  data() {
    return {
      tableData: this.tableList,
      //y轴的数量
      yCount: null,
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["严重延期", "一般延期", "正常"],
          top: "3%",
          left: "40%"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "22px",
          containLabel: true
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisTick: {
            interval: 0
          }
        },
        yAxis: {
          type: "category",
          splitLine: {
            show: false
          },
          axisTick: {
            interval: 0
          },
          axisLabel: {
            interval: 0
          },
          data: []
        },
        series: []
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getBarOption(this.tableList);
    });
  },
  created() {},
  computed: {},
  methods: {
    //堆叠图
    getBarOption(tableList) {
      var result = JSON.parse(JSON.stringify(tableList));
      var badDelayList = []; // 严重延期
      var generalDelayList = []; //一般延期
      var normalList = []; //正常
      var bLevelUnitList = []; //b级单位
      result.forEach(ele => {
        badDelayList.push(ele.badDelay);
        generalDelayList.push(ele.generalDelay);
        normalList.push(ele.normal);
        bLevelUnitList.push(ele.bLevelUnit);
      });
      this.option.series.push({
        color: "#FF9999",
        // itemStyle: { opacity: 0.7, color: "#f56954" },
        name: "严重延期",
        type: "bar",
        stack: "总量",
        label: {
          normal: {
            show: true,
            position: "insideRight",
            color: "#000",
            formatter: function(a, b) {
              if (a.value == 0) {
                return "";
              }
            }
          }
        },
        data: badDelayList.reverse()
      });
      this.option.series.push({
        color: "#ffd699",
        // itemStyle: { opacity: 0.7, color: "#ffd699" },
        name: "一般延期",
        type: "bar",
        stack: "总量",
        label: {
          normal: {
            show: true,
            position: "insideRight",
            color: "#000",
            formatter: function(a, b) {
              if (a.value == 0) {
                return "";
              }
            }
          }
        },
        data: generalDelayList.reverse()
      });
      this.option.series.push({
        color: "#8deb8d",
        // itemStyle: { opacity: 0.7, color: "#8deb8d" },
        name: "正常",
        type: "bar",
        stack: "总量",
        label: {
          normal: {
            show: true,
            position: "insideRight",
            color: "#000",
            formatter: function(a, b) {
              if (a.value == 0) {
                return "";
              }
            }
          }
        },
        data: normalList.reverse()
      });
      this.option.yAxis.data = bLevelUnitList.reverse();
      console.log(this.$refs.chartRef);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "--";
        }
      });

      return sums;
    }
  }
};
</script>

<style lang="scss" scoped>
.table-bar {
  position: relative;
  margin: 20px 0 0 0;
  .default {
    margin: 0;
    position: absolute;
    top: -6px;
  }
  .con {
    overflow: hidden;
    .unit {
      position: absolute;
      left: 44%;
      color: gray;
      font-size: 12px;
    }
  }

  .bad-delay {
    color: #ffffff;
    background: #ff9999;
  }
  .general-delay {
    color: #ffffff;
    background: #ffd699;
  }
  .normal {
    color: #ffffff;
    background: #8deb8d;
  }
  .chart-border {
    position: relative;
    .smark {
      position: absolute;
      right: 48px;
      top: -5px;
      .smark-icon {
        color: gray;
        font-size: 18px;
      }
    }
  }
}
</style>