<template>
  <div class="condition-change">
    <el-form ref="Marketform" :model="Marketform" size="mini" label-width="75px" style="width:100%">
      <el-form-item :label="labelName">
        <el-select style="width:64%" v-model="Marketform.emp_name" filterable remote reserve-keyword
          placeholder="请输入项目经理" :remote-method="remoteMethod" :loading="loading" loading-text="请输入项目经理"
          @change="changeHandle">
          <el-option v-for="(item,index) in marksetSelectAry" :key="index" :label="item.empInfo" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="A级单位">
        <el-input v-model="Marketform.account_name" style="width:64%"></el-input>
      </el-form-item>
      <el-form-item label="实施B级单位">
        <el-input v-model="Marketform.subdept_name" style="width:64%"></el-input>
      </el-form-item>
      <el-form-item label="实施C级单位">
        <el-select v-model="Marketform.dept_id" placeholder="" style="width:64%" @change="deptNameChange">
          <el-option :label="item.deptName" :value="item.deptId" v-for="(item,index) in subdeptList" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Bus from "../../../bus";
import { getAllSeller, getinfoBySellerId } from "../../../api/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "conChange",

  props: {
     labelName: {
      type: String,
      default: '项目经理'
    },
  },
  data() {
    return {
      loading: true,
      Marketform: {
        emp_name: "",
        subdept_name: "",
        dept_id: "",
        account_name: "" //a级单位
      },
      subdeptList: [],
      marksetSelectAry: [],
      dept_name: "" //C级单位
    };
  },
  mounted() {},
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  created() {},
  methods: {
    remoteMethod(val) {
      getAllSeller(
        `/sgpm/rest/api/system/user/info/fuzzy/search?memberId=${this.userinfo.memberid}&search=${val}&pageSize=1000&pageNum=1`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            this.loading = false;
            this.marksetSelectAry = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeHandle(val) {
      getAllSeller(
        `/sgpm/rest/api/system/user/department/part?memberId=${val}`,
        null
      )
        .then(res => {
          if (res.data.code == 200) {
            let result = res.data.data;
            this.Marketform = result;
            this.subdeptList = result.departments;
            this.dept_name = result.dept_name;
            if (result.dept_name == "管理团队") {
              this.Marketform.dept_id = "";
            }
            this.$emit("MarketSelectInfo", this.Marketform);
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
      this.$emit("MarketSelectInfo", this.Marketform);
    },
    resetForm() {
      this.$nextTick(() => {
        this.Marketform.emp_name = "";
        this.Marketform.account_name = "";
        this.Marketform.subdept_name = "";
        this.Marketform.dept_id = "";
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.condition-change {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
}
</style>
