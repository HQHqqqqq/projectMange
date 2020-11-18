<template>
  <div class="container">
    <div class="category-block">
      <div class="header">
        <i class="el-icon-star-off bg-1" v-if="warningCorlor"></i>
        <i class="el-icon-star-off bg-2" v-else></i>
        <h4>{{datas.options.warningName}}</h4>
      </div>
      <ul class="category-list">
        <li>
          <a>
            <p>{{warningData.stageName|formatNull}}</p>
            <span>{{warningData.delayDays|formatNull}}天</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { debug } from "util";
import { mapState, mapActions } from "vuex";
export default {
  name: "WarningCard",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      iconClass: "",
      warningData: null
    };
  },
  filters: {
    formatNull: function(value) {
      if (value) {
        return value;
      } else {
        return "--";
      }
    }
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        // console.log(this.datas);
        // console.log(this.datas.options.url_a);
      }
    }
  },
  computed: {
    ...mapState([
      "selectedAllProMsg" //项目列表中跳转获取的所有项目信息
    ]),

    warningCorlor: function() {
      if (this.warningData && this.warningData.delayDays > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    let projectNumber = this.selectedAllProMsg.PROJECTNUMBER;
    let contractNumber = this.selectedAllProMsg.CONTRACTNUMBER;
    if (this.datas.model == "progress") {
      this.getProgressWarning(this.datas.options.url_a, projectNumber);
    } else if (this.datas.model == "returnMoney") {
      this.getReturnMoneyWarning(this.datas.options.url_a, contractNumber);
    }
  },
  methods: {
    //获取进度预警信息
    getProgressWarning(url, projectNumber) {
      var url = `${url}?projectNumber=${projectNumber}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          this.warningData = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取回款预警信息
    getReturnMoneyWarning(url, contractNumber) {
      var url = `${url}?contractNumber=${contractNumber}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          debugger;
          this.warningData = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleIcon(e) {
      console.log(e);
      this.iconClass = e.toElement.className;
    }
  }
};
</script>

<style lang="scss">
.container {
  .category-block {
    box-shadow: 0px 7px 16px 0px rgba(0, 0, 0, 0.09);
    padding: 20px 25px;
    border-radius: 3px;
    margin-bottom: 25px;
    .header {
      margin-bottom: 20px;
      border-bottom: 3px solid #f4f7f9;
      text-align: center;
      i {
        margin-right: 6px;
        color: #fff;
        font-size: 13px;
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        margin-bottom: 6px;
        border-radius: 40px;
      }
    }
    .bg-1 {
      background: #fe7e17;
      box-shadow: 0 0 0px 4px rgba(254, 126, 23, 0.35);
    }
    .bg-2 {
      background: #00d372;
      box-shadow: 0 0 0px 4px rgba(0, 211, 114, 0.35);
    }
    .category-list {
      display: block;
      overflow: auto;
      font-size: 14px;
      border-bottom: 1px solid #f4f7f9;
      padding: 10px 0;
      max-height: 200px;
      li {
        display: block;
        font-size: 14px;
        border-bottom: 1px solid #f4f7f9;
        padding: 10px 0;
        a {
          p {
            display: inline-block;
          }
          span {
            float: right;
            font-size: 10px;
            background: #f4f7f9;
            border-radius: 10px;
            padding: 3px 8px;
            margin: 10px 0 0 0;
            color: #84919b;
          }
        }
      }
    }
  }
}
</style>
