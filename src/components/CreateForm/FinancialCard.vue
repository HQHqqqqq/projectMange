<template>
  <div class="container">
    <div class="card">
      <div class="card-left" :style="{ background: datas.options.financialLeftColor}">
        <i :class="datas.options.financialIconClass" class="card-left-icon"></i>
      </div>
      <div class="card-right">
        <ul>
          <li>{{datas.options.financialText}}</li>
          <li>{{amountNum|formatThousands}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { debug } from "util";
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
export default {
  name: "FinancialCard",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      iconClass: "",
      curProMsg: null,
      //金额
      amountNum: null
    };
  },

  computed: {
    ...mapState([
      "selectedAllProMsg" //项目列表中跳转获取的所有项目信息
    ])
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      }
    }
  },
  created() {},
  mounted() {
    let contractNumber = this.selectedAllProMsg.CONTRACTNUMBER;
    let projectNumber = this.selectedAllProMsg.PROJECTNUMBER;
    let businessNumber = this.selectedAllProMsg.BUSINESSNUMBER;
    let projectId = this.selectedAllProMsg.ID;
    let contractmoney = this.selectedAllProMsg.CONTRACTMONEY;

    // 合同额
    if (this.datas.model == "contractAmount") {
      this.getContractAmount(this.datas.options.url_a, contractNumber);
      //回款额
    } else if (this.datas.model == "amountCashed") {
      this.getAountCashed(this.datas.options.url_a, contractNumber);
      //项目总支出
    } else if (this.datas.model == "allExpense") {
      this.getAllExpense(
        this.datas.options.url_a,
        projectNumber,
        businessNumber,
        projectId
      );
      //项目总预算
    } else if (this.datas.model == "allBudget") {
      this.getAllBudget(this.datas.options.url_a, contractNumber);
      //实际净利润
    } else if (this.datas.model == "profits") {
      this.getProfits(
        this.datas.options.url_a,
        contractNumber,
        projectNumber,
        businessNumber,
        contractmoney
      );
    }
  },
  methods: {
    //合同额
    getContractAmount(url, contractNumber) {
      var url = `${url}/${contractNumber}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          this.amountNum = result.CONTRACTMONEY;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //回款金额
    getAountCashed(url, contractNumber) {
      var url = `${url}?contractNumber=${contractNumber}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          this.amountNum = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目总支出
    getAllExpense(url, projectNumber, businessNumber, projectId) {
      var url = `${url}?projectNumber=${projectNumber}&businessNumber=${businessNumber}&projectId=${projectId}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          this.amountNum = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目总支出
    getAllBudget(url, contractNumber) {
      var url = `${url}?contractNumber=${contractNumber}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          this.amountNum = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //实际净利润
    getProfits(
      url,
      contractNumber,
      projectNumber,
      businessNumber,
      contractmoney
    ) {
      var url = `${url}?contractNumber=${contractNumber}&projectNumber=${projectNumber}&businessNumber=${businessNumber}&contractMoney=${contractmoney}`;
      this.axios
        .get(url)
        .then(res => {
          var result = res.data.data;
          this.amountNum = result.toFixed(2);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .card {
    display: flex;
    width: 100%;
    height: 100px;
    box-shadow: 0px 7px 16px 0px rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    .card-left {
      width: 30%;
      height: 100%;
      background: "#3397FF";
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      .card-left-icon {
        font-size: 40px;
        color: white;
      }
    }
    .card-right {
      width: 70%;
      text-align: center;
      ul {
        padding: 0 0 0 0;
        li {
          list-style: none;
        }
      }
    }
  }
}
</style>
