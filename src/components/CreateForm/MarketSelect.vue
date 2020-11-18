<template>
  <div class="market-select">
    <el-form ref="Marketform" :model="Marketform" label-width="120px" style="margin-bottom:0px;">
      <el-form-item :label="this.datas.options.selectName" style="margin-bottom: 22px;">
        <el-select style="width:60%" v-model="Marketform.emp_name" filterable remote reserve-keyword
          placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" @change="changeHandle"
          class="contractMarket">
          <el-option v-for="(item,index) in marksetSelectAry" :key="index" :label="item.empInfo" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.datas.options.inputOne" style="margin-bottom: 22px;">
        <el-input v-model="Marketform.subdept_name" :disabled="isDisabled" style="width:60%"></el-input>
      </el-form-item>
      <el-form-item :label="this.datas.options.inputTwo" style="margin-bottom: 22px;" v-if="showType">
        <el-select v-model="Marketform.dept_name" :disabled="isDisabled" style="width:60%" placeholder
          @change="deptNameChange">
          <el-option :label="item.deptName" :value="item.deptId" v-for="(item,index) in subdeptList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="display: none;">
        <el-input v-model="Marketform.projectSaleId"></el-input>
      </el-form-item>
      <el-form-item style="display: none;">
        <el-input v-model="Marketform.saleClassUnitBId"></el-input>
      </el-form-item>
      <el-form-item style="display: none;">
        <el-input v-model="Marketform.saleClassUnitCId"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
export default {
  name: "MarketSelect",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      loading: true,
      isDisabled: true,
      showType: '',
      Marketform: {
        emp_name: "",
        subdept_name: "",
        dept_name: "",
        projectSaleId: "",
        saleClassUnitBId: "",
        saleClassUnitCId: ""
      },
      marksetSelectAry: [],
      subdeptList: [],
      dept_name: "" //C级部门
    };
  },
  watch: {
    datas: {
      deep: true,
      handler: function (val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      }
    }
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  mounted() {
    if (this.userinfo.account_id == '-1814768306395265967' || this.userinfo.account_id == '7638091599462351621') {
      this.showType = true;
    } else if (this.userinfo.account_id == '8416498716893399290') {
      this.showType = false;
    }
    setTimeout(() => {
      var item = JSON.parse(localStorage.getItem("market"));
      if (item) {
        this.Marketform.emp_name = item.projectSaleName;
        this.Marketform.subdept_name = item.saleClassUnitBName;
        this.Marketform.dept_name = item.saleClassUnitCName;
        this.Marketform.projectSaleId = item.projectSaleId;
        this.Marketform.saleClassUnitBId = item.saleClassUnitBId;
        this.Marketform.saleClassUnitCId = item.saleClassUnitCId;
      }
    }, 1000);
    // Bus.$on("market", item => {
    // 	if(item){
    // 		// let item = JSON.parse(item);
    // 		this.Marketform.emp_name = item.projectSaleName;
    // 		this.Marketform.subdept_name = item.saleClassUnitBName;
    // 		this.Marketform.dept_name = item.saleClassUnitCName;
    // 		this.Marketform.projectSaleId = item.projectSaleId;
    // 		this.Marketform.saleClassUnitBId = item.saleClassUnitBId;
    // 		this.Marketform.saleClassUnitCId = item.saleClassUnitCId;
    // 	}
    // })
    setTimeout(() => {
      Bus.$emit("MarketSelectInfo", this.Marketform);
    }, 500);
  },
  methods: {
    remoteMethod(val) {
      let url = `${this.datas.options.url_a}?accountId=${this.userinfo.account_id}&search=${val}&pageSize=1000&pageNum=1`;
      this.axios
        .get(url)
        .then(res => {
          if (res.status == 200) {
            this.loading = false;
            this.marksetSelectAry = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeHandle(val) {
      let url = `${this.datas.options.url_b}?memberId=${val}`;
      this.axios
        .get(url)
        .then(res => {
          if (res.status == 200) {
            let result = res.data.data;
            this.Marketform = result;
            this.subdeptList = result.departments;
            this.dept_name = result.dept_name;
            if (result.dept_name == "管理团队") {
              this.Marketform.dept_name = "";
              this.$message({
                message: "您属于管理团队请选择c级部门",
                type: "warning"
              });
            }
            console.log(this.Marketform);
            debugger;
            Bus.$emit("MarketSelectInfo", this.Marketform);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deptNameChange(val) {
      let list = this.Marketform.departments;
      let depAry = list.filter(item => {
        if (item.deptId == val) {
          return item.deptName;
        }
      });
      let name = depAry[0].deptName;
      this.Marketform.dept_name = name;
      console.log(this.Marketform);
      Bus.$emit("MarketSelectInfo", this.Marketform);
    }
  },
  created() { }
};
</script>

<style lang="scss">
.el-form--label-top .el-form-item__label {
  float: left;
}
.market-select {
  margin-bottom: -22px;
}
</style>
