<template>
  <div class="bar">
    <chart :options="option" ref="leftChart"></chart>
  </div>
</template>

<script>
import { chart } from "../ECharts";
export default {
  name: "BarEchart",
  components: { chart },
  data() {
    return {
      option: {
        title: {
          text: "逐年项目数与合同额分析",
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
        grid: { left: "12%" },
        legend: {
          data: ["尾款金额", "项目个数"],
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
        series: [
          { data: [59, 32, 202, 428], name: "项目个数" },
          {
            data: [5127.3089, 4987.828, 29011.834016999997, 17507.742141],
            name: "尾款金额"
          }
        ]
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
.bar {
}
</style>