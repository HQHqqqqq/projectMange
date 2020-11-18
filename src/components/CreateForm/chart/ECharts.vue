<template>
  <div class="echarts" />
</template>
<script>
import debounce from "lodash/debounce";
// import { addListener, removeListener } from 'resize-detector'
import Vue from "vue";
var echarts = require("echarts");
export default {
  name: "chart",
  props: {
    options: Object,
    //y轴刻度的数量，来决定图表的高度
    yCount: {
      type: Number,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return 13;
      }
    }
  },
  computed: {
    // Only recalculated when accessed from JavaScript.
    // Won't update DOM on value change because getters
    // don't depend on reactive values
    width: {
      cache: false,
      get() {
        return this.delegateGet("width", "getWidth");
      }
    },
    height: {
      cache: false,
      get() {
        return this.delegateGet("height", "getHeight");
      }
    }
  },
  watch: {},
  methods: {
    // provide a explicit merge option method
    mergeOptions(options, notMerge, lazyUpdate) {
      this.delegateMethod("setOption", options, notMerge, lazyUpdate);
    },

    resize(options) {
      this.delegateMethod("resize", options);
    },

    showLoading(type, options) {
      this.delegateMethod("showLoading", type, options);
    },
    hideLoading() {
      this.delegateMethod("hideLoading");
    },
    clear() {
      this.delegateMethod("clear");
    },
    dispose() {
      this.delegateMethod("dispose");
    },
    delegateMethod(name, ...args) {
      if (!this.chart) {
        Vue.util.warn(
          `Cannot call [${name}] before the chart is initialized. Set prop [options] first.`,
          this
        );
        return;
      }
      return this.chart[name](...args);
    },
    delegateGet(name, method) {
      if (!this.chart) {
        Vue.util.warn(
          `Cannot get [${name}] before the chart is initialized. Set prop [options] first.`,
          this
        );
      }
      return this.chart[method]();
    },
    getArea() {
      return this.$el.offsetWidth * this.$el.offsetHeight;
    },
    init() {
      if (this.chart) {
        return;
      }
      let chart = echarts.init(this.$el, this.theme, this.initOptions);
      if (this.group) {
        chart.group = this.group;
      }
      // console.log(this.options);
      chart.setOption(this.options, true);
      // chart.getDom().style.height = this.yCount * 30 + "px";
      // chart.getDom().childNodes[0].style.height = this.yCount * 30 + "px";
      // chart
      //   .getDom()
      //   .childNodes[0].childNodes[0].setAttribute("height", this.yCount * 30);
      // chart.getDom().childNodes[0].childNodes[0].style.height =
      //   this.yCount * 30 + "px";
      // chart.resize();
      if (this.autoResize) {
        this.lastArea = this.getArea();
        this.__resizeHandler = debounce(
          () => {
            if (this.lastArea === 0) {
              // emulate initial render for initially hidden charts
              this.mergeOptions({}, true);
              this.resize();
              this.mergeOptions(this.options, true);
            } else {
              this.resize();
            }
            this.lastArea = this.getArea();
          },
          100,
          { leading: true }
        );
        // addListener(this.$el, this.__resizeHandler)
      }
      this.chart = chart;
    },
    destroy() {
      if (this.autoResize) {
        // removeListener(this.$el, this.__resizeHandler)
      }
      this.dispose();
      this.chart = null;
    },
    refresh() {
      this.destroy();
      this.init();
    }
  },
  created() {
    this.$watch(
      "options",
      options => {
        if (!this.chart && options) {
          this.init();
        } else {
          this.chart.setOption(this.options, true);
        }
      },
      { deep: !this.watchShallow }
    );
    let watched = ["theme", "initOptions", "autoResize", "watchShallow"];
    watched.forEach(prop => {
      this.$watch(
        prop,
        () => {
          this.refresh();
        },
        { deep: true }
      );
    });
  },
  mounted() {
    this.$nextTick(() => {
      // auto init if `options` is already provided
      if (this.options) {
        this.init();
      }
    });
  },
  activated() {
    if (this.autoResize) {
      this.chart && this.chart.resize();
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.destroy();
  },
  connect(group) {
    if (typeof group !== "string") {
      group = group.map(chart => chart.chart);
    }
    echarts.connect(group);
  },
  disconnect(group) {
    echarts.disConnect(group);
  },
  registerMap(mapName, geoJSON, specialAreas) {
    echarts.registerMap(mapName, geoJSON, specialAreas);
  },
  registerTheme(name, theme) {
    echarts.registerTheme(name, theme);
  },
  graphic: echarts.graphic
};
</script>

<style lang="scss">
.echarts {
  height: 280px;
}
</style>
