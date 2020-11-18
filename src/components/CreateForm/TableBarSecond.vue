<template>
  <div class="table-bar">
    <el-row>
      <h3 class="default">在实施项目回款延期</h3>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="12">
        <p class="unit default">单位：个</p>
        <el-table
          :data="tableData"
          border
          :summary-method="getSummaries"
          show-summary
          max-height="300"
          :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
          :row-style="{height:'50px'}"
          :cell-style="{padding:0}"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="bLevelUnit" label="经营单位"></el-table-column>
          <el-table-column prop="allCount" label="回款延期项目个数"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" class="chart-border">
        <chart :options="option"></chart>
        <div class="smark">
          <el-tooltip
            class="item"
            effect="light"
            content="1）在实施项目：项目启动但未验收关闭；
            2）严重延期：实际回款日期滞后回款计划3个月以上； 
            3）一般延期：实际回款日期滞后回款计划3个月以内；
            4）正常：回款未延期 "
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
import { getMenuList } from "../../api/api.js";
import chart from "../CreateForm/chart/ECharts";
export default {
  name: "TableBarSecond",
  components: {
    chart
  },
  props: ["tableList"],
  data() {
    return {
      tableData: this.tableList,
      option: {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        title: {
          text: "在实施项目回款延期",
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
        grid: { bottom: "20%" },
        // legend: {
        //   data: ["回款延期项目个数"],
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
        series: [
          // {
          //   color: "#65cee8",
          //   itemStyle: { opacity: 0.7, color: "#ade1fb" },
          //   name: "直接访问",
          //   type: "bar",
          //   data: [10, 52, 200, 334]
          // }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {},
  methods: {
    init() {
      this.getBarOption(this.tableList);
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
    },
    //柱状图
    getBarOption(tableList) {
      var result = JSON.parse(JSON.stringify(tableList));
      var bLevelUnitList = []; //b级单位
      var allCountList = []; //回款延期个数
      result.forEach(ele => {
        allCountList.push(ele.allCount);
        bLevelUnitList.push(ele.bLevelUnit);
      });
      this.option.series.push({
        color: "#65cee8",
        itemStyle: { opacity: 0.7, color: "#ade1fb" },
        name: "回款延期项目个数",
        type: "bar",
        data: allCountList,
        label: {
          normal: {
            show: true,
            position: "top",
            color: "#000"
          }
        }
      });
      this.option.xAxis[0].data = bLevelUnitList;
    }
  }
};
</script>

<style lang="scss" scoped>
.table-bar {
  .default {
    margin: 0;
  }
  .unit {
    position: absolute;
    left: 44%;
    color: gray;
    font-size: 12px;
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