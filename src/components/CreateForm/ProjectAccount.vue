<template>
  <div>
    <!--<div style="text-align: center;font-size: 15px;font-weight: bold;color: #000">项目核算信息</div>-->
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        fontSize: '12px',
        color: '#303133',
        height: '51px',
        padding: 0,
        backgroundColor: '#ccd1d5'
      }"
      :row-style="{ height: '50px' }"
      :cell-style="{ padding: 0 }"
      style="width: 100%;font-size: 10px"
    >
      <el-table-column prop="expendItem" align="center" label="预计支出事项">
      </el-table-column>

      <el-table-column
        prop="budgetMoney"
        :formatter="formatbudgetMoney"
        align="center"
        label="预算金额(万元)"
      >
      </el-table-column>
    </el-table>
    <span
      style="font-size: 12px;color: #606666;font-family: '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif"
      >注：项目预算需由项目经理确认，如与合同预算不符需要变更，需发起合同预算变更审批流程。</span
    >
  </div>
</template>

<script>
import Bus from "../../bus";
import { integrationGetMethod } from "../../api/api.js"; //
import { mapState, mapActions } from "vuex";
export default {
  name: "project-account",
  data() {
    return {
      contractNumber: "", //合同编号
      tableData: [
        { expendItem: "实施费用预算", budgetMoney: "" },
        { expendItem: "--人工费用预算", budgetMoney: "" },
        { expendItem: "--运营费用预算", budgetMoney: "" },
        { expendItem: "销售费用预算", budgetMoney: "" },
        { expendItem: "项目采购成本预算", budgetMoney: "" },
        { expendItem: "项目总预算", budgetMoney: "" }
      ]
    };
  },

  created() {
    // 清除localStorage 中的ProjectAccountParams参数
    if (localStorage.getItem("ProjectAccountParams")) {
      var params = JSON.parse(localStorage.getItem("ProjectAccountParams"));
      if (params) {
        localStorage.removeItem("ProjectAccountParams");
      }
    }

    this.gettableData();

    //启动项目时  GenerateForm中getProjectStart方法发送
    // Bus.$on("projectInfo", item => {
    //   debugger
    //   if (item) {
    //     console.log("==projectInfo===项目预算=======");
    //     console.log(item);
    //     this.contractNumber = item.contractNumber;
    //     this.gettableData(this.contractNumber);
    //   }
    // });

    //启动 选择合同时,初始化页面时才会调用
    // Bus.$on("accountTableData", item => {
    //   if (item) {
    //     console.log("==============accountTableData========")
    //     console.log(item)
    //     this.tableData = item
    //   }
    // });
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ])
  },
  //启动页面 选择合同时
  mounted() {
    Bus.$on("accountTableData", item => {
      if (item) {
        console.log("=========获取预算数据=====accountTableData========");
        console.log(item);
        this.tableData = item;
      }
    });
  },

  methods: {
    // 预算金额(万元) 转换
    formatbudgetMoney(row) {
      return this.formatThousands(row.budgetMoney);
    },
    //将数字转为 金额格式
    formatThousands: function(value) {
      value = value / 10000;
      value = value.toFixed(2); //万元单位 保留二位小数点
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

    //获取表格数据
    gettableData() {
      var params = JSON.parse(localStorage.getItem("projectInfo"));
      var contractNumber = params.contractNum;
      console.log("====核算合同编号====" + contractNumber);
      // contractNumber= 'SM-XS-JSKF-ZS-2012-4659';
      var params = { contractNumber: contractNumber };
      if (contractNumber) {
        // var url = '/sgpm/rest/api/integration/oa/budgets/information';
        var url = `/sgpm/rest/api/integration/data/budgets/information/${this.userinfo.account_id}?contractNumber=${contractNumber}`; // 2020 1.9 新
        integrationGetMethod(url, null)
          .then(res => {
            var jsonData = res.data.data;
            console.log(jsonData);
            this.tableData[0].budgetMoney = jsonData.shishifeiyongBudget; //实施费用预算
            this.tableData[1].budgetMoney = jsonData.rengongfeiyongBudget; //人工费用预算
            this.tableData[2].budgetMoney = jsonData.yunyingfeiyongBudget; //运营费用预算
            this.tableData[3].budgetMoney = jsonData.xiaoshoufeiyongBudget; //销售费用预算
            this.tableData[4].budgetMoney = jsonData.caigouchengbenBudget; //项目采购成本预算
            this.tableData[5].budgetMoney = jsonData.totalBudget; //项目总预算

            //存到localstorage
            var Params = JSON.stringify(this.tableData);
            localStorage.setItem("ProjectAccountParams", Params);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style scoped></style>
