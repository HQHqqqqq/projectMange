<template>
  <div class="condition-change">
    <el-form ref="form" :model="form" label-width="160px">
      <el-form-item label="公司名称">
        <el-select
          v-model="form.companyId"
          style="width:60%"
          placeholder="请选择公司"
          @change="companySelectChange"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.company_id"
            :label="item.company_name"
            :value="item.company_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称">
        <el-select
          :filter-method="filterMethodDepart"
          filterable
          v-model="form.departmentId"
          style="width:60%"
          placeholder="请选择部门"
          @change="departmentSelectChange"
        >
          <el-option-group
            v-for="group in departmentOptions"
            :key="group.firstDeptId"
            :label="group.firstDeptName"
          >
            <el-option
              v-for="item in group.secondDepts"
              :key="item.secondDeptId"
              :label="item.secondDeptName"
              :value="item.secondDeptId"
            ></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="经理">
        <el-select
          filterable
          v-model="form.memberId"
          style="width:60%"
          placeholder="请选择经理"
          @change="managerSelectChange"
        >
          <el-option
            v-for="item in memberOptions"
            :key="item.memberid"
            :label="item.emp_name"
            :value="item.memberid"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Bus from "../../../bus";
import { companyList, departmentList, memberList } from "../../../api/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "conditionChange",
  props: {},
  data() {
    return {
      form: {
        companyId: "",
        departmentId: "",
        memberId: "",
        departmentName: "" //部门名称
      },
      companyOptions: [],
      //部门option
      departmentOptions: [],
      //部门option的备份
      departmentOptionsCopy: [],
      //经理option
      memberOptions: [],
      _clear: this.clear
    };
  },
  mounted() {
    //获取公司列表
    this.getCompanyList();
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  created() {},
  methods: {
    getCompanyList() {
      let params = {
        memberid: this.userinfo.memberid,
        account_id: this.userinfo.account_id,
        subdept_id: this.userinfo.subdept_id,
        dept_id: this.userinfo.dept_id
      };
      companyList(`/sgpm/rest/api/system/role/pmo/scope`, params)
        .then(res => {
          if (res.status == 200) {
            this.companyOptions = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    companySelectChange(val) {
      departmentList(`/sgpm/rest/api/server/pm/project/groups/${val}`, null)
        .then(res => {
          if (res.status == 200) {
            this.departmentOptions = res.data.data;
            this.departmentOptionsCopy = [...this.departmentOptions];
            this.form.departmentId = "";
            this.form.memberId = "";
            this.$emit("clearForm", true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    departmentSelectChange(val) {
      let depatName = "";
      this.departmentOptions.find(item => item.id === val);
      this.departmentOptions.forEach(item => {
        item.secondDepts.filter(jtem => {
          if (val == jtem.secondDeptId) {
            depatName = jtem.secondDeptName;
          }
        });
      });
      this.form.departmentName = depatName;
      memberList(`/sgpm/rest/api/server/pm/project/group/${val}`, null)
        .then(res => {
          if (res.status == 200) {
            this.memberOptions = res.data.data;
            this.form.memberId = "";
            this.$emit("clearForm", true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    managerSelectChange(val) {
      this.$emit("managerInfo", this.form);
    },
    filterMethodDepart(val) {
      let reg = new RegExp(val, "gi");
      let dep = this.departmentOptionsCopy;
      let depAarry = [];
      //debugger;
      if (val == "") {
        this.departmentOptions = this.departmentOptionsCopy;
        return false;
      }
      for (let i = 0; i < dep.length; i++) {
        if (reg.test(dep[i].firstDeptName)) {
          depAarry.push(dep[i]);
          continue;
        } else {
          let def = dep[i].secondDepts;
          if (def.length == 0) {
            continue;
          } else {
            for (let j = 0; j < def.length; j++) {
              if (reg.test(def[j].secondDeptName)) {
                depAarry.push({
                  accountId: dep[i].accountId,
                  accountName: dep[i].accountName,
                  firstDeptId: dep[i].firstDeptId,
                  firstDeptName: dep[i].firstDeptName,
                  secondDepts: [
                    {
                      accountId: def[j].accountId,
                      accountName: def[j].accountName,
                      secondDeptId: def[j].secondDeptId,
                      secondDeptName: def[j].secondDeptName
                    }
                  ]
                });
                break;
              }
            }
          }
        }
      }
      this.departmentOptions = depAarry;
    }
  }
};
</script>

<style lang="scss" scoped>
.condition-change {
}
</style>
