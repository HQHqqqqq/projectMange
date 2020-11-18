<template>
  <div style>
    <div class="selectDiv">
      <span>公司名称</span>
      <el-select
        filterable
        placeholder="请选择"
        @change="companySelectChange"
        v-model="compValue"
        id="compName"
        size="mini"
      >
        <el-option
          v-for="item in firstDeptName"
          :key="item.firstDeptName + '-label'"
          :label="item.firstDeptName"
          :value="item.firstDeptName"
          :id="item.firstDeptId"
          v-model="item.firstDeptId"
        ></el-option>
      </el-select>
      <!-- <span>部门名称</span>
			<el-select v-model="deptValue" placeholder="请选择" filterable v-if="nkOpitonDept.length > 0" @change="getdeptName" id="deptName" size="mini">
				<el-option v-for="item in nkOpitonDept" :key="item.firstDeptId" :label="item.firstDeptName" :value="item.firstDeptId"></el-option>
			</el-select>
			<el-select v-else v-model="deptValue" filterable placeholder="请选择" @change="getdeptName" id="deptName" size="mini">
				<el-option-group v-for="(group, index) in optiondept" :key="index" :label="group.firstDeptName" :id="group.firstDeptId">
					<el-option
						v-for="item in group.secondDepts"
						:key="item.secondDeptName + '-label2'"
						:label="item.secondDeptName"
						:value="item.secondDeptName"
						:id="item.secondDeptId"
						v-model="item.secondDeptId"
					></el-option>
				</el-option-group>
      </el-select>-->
      <el-form ref="form" :model="form" style="display:inline-block;width:25%;">
        <el-form-item label="部门名称" class="deptClass">
          <el-select
            v-model="deptValue"
            placeholder="请选择"
            filterable
			style="width:60%"
            v-if="nkOpitonDept.length > 0"
            @change="getdeptName"
            id="deptName"
            size="mini"
          >
            <el-option
              v-for="item in nkOpitonDept"
              :key="item.firstDeptId"
              :label="item.firstDeptName"
              :value="item.firstDeptId"
            ></el-option>
          </el-select>
          <el-select
		  	v-else
            id="deptName"
			class="deptC"
            :filter-method="filterMethodDepart"
            filterable
            v-model="form.departmentId"
            style="width:70%;height:28px;"
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
      </el-form>
      <span>人员</span>
      <el-select
        v-model="people"
        filterable
        placeholder="请选择"
        @change="changememeber($event)"
        id="memberName"
        size="mini"
      >
        <el-option
          v-for="item in optionpeople"
          :key="item.id"
          :label="item.emp_name"
          :value="item.emp_name"
          v-model="item.memberid"
          :memberid="item.memberid"
        ></el-option>
      </el-select>
      <span>角色</span>
      <el-select
        v-model="role"
        filterable
        placeholder="请选择"
        @change="getRole"
        id="role"
        size="mini"
      >
        <el-option
          v-for="item in optionrole"
          :key="item.id"
          :label="item.value"
          :value="item.value"
          :id="item.id"
          :type="item.enu_type"
          v-model="item.value"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        @click="handleDelete"
        class="addRow"
        :disabled="memberRole"
        size="mini"
      >移除</el-button>
      <el-button
        type="primary"
        @click="addPeople"
        class="addRow"
        :disabled="memberRole"
        size="mini"
      >添加</el-button>
    </div>
    <el-table
      :data="projectMember"
      :height="asideHeight"
      border
      style="width: 100%;border-top: 1px solid #EBEEF5;"
      :header-cell-style="{
				fontSize: '14px',
				color: '#303133',
				height: '34px',
				padding: 0,
				backgroundColor: '#ccd1d5'
			}"
      :row-style="{ height: '34px' }"
      :cell-style="{ padding: 0 }"
      class="tb-edit"
      highlight-current-row
      @row-click="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="id" label="id" v-if="show"></el-table-column>
      <el-table-column type="index" label="序号" width="38"></el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="user_name" label="项目成员" width="78"></el-table-column>

      <el-table-column label="角色" width="96">
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.role"
            filterable
            placeholder="请选择"
            @change="editRole(scope.$index, scope.row)"
            :disabled="memberRole"
          >
            <el-option
              v-for="item in optionrole"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="员工状态" width="80"></el-table-column>
      <el-table-column label="预计加入时间" width="110">
        <template slot-scope="scope">
          <el-date-picker
            size="mini"
            class="date-picker"
            v-model="value1"
            type="date"
            placeholder="预计加入时间"
            value-format="yyyy-MM-dd"
            @change="handleEdit(scope.$index, scope.row)"
            :disabled="memberRole"
          ></el-date-picker>
          <span>{{ scope.row.enter_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计离开时间" width="110">
        <template slot-scope="scope">
          <el-date-picker
            size="mini"
            class="date-picker"
            v-model="value2"
            type="date"
            placeholder="预计离开时间"
            value-format="yyyy-MM-dd"
            @change="handleEdit(scope.$index, scope.row)"
            :disabled="memberRole"
          ></el-date-picker>
          <span>{{ scope.row.leave_time }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit_name" label="A级单位"></el-table-column>
      <el-table-column prop="level_one" label="B级单位"></el-table-column>
      <el-table-column prop="level_two" label="C级单位"></el-table-column>
      <el-table-column prop="duty" label="工作职责">
        <template slot="header">
          <span class="start">*</span>
          <span>工作职责</span>
        </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.duty"
            @change="handleEdit(scope.$index, scope.row)"
            size="mini"
            :disabled="memberRole"
            @blur="validateJyh(scope.row.duty)"
          ></el-input>
          <span>{{ scope.row.duty }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_leave" label="是否离开" width="78">
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.is_leave"
            filterable
            placeholder="请选择"
            @change="handleEdit(scope.$index, scope.row)"
            :disabled="memberRole"
          >
            <el-option
              v-for="item in isleave"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>{{ scope.row.is_leave == '0' ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.note"
            @change="handleEdit(scope.$index, scope.row)"
            size="mini"
            :disabled="memberRole"
          ></el-input>
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="person_type" label="雇佣类型" v-if="show"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Bus from "../../bus";
import { getMenuList } from "../../api/api.js";
import { editMember } from "../../api/api.js";
import { getTemplate } from "../../api/api.js";
import { isPermissions } from "../../api/api.js";
import { departmentList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "myteam",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {},
  computed: {
    ...mapState([
      "userinfo", //os跳转过来的用户信息值
    ]),
  },
  data() {
    return {
      compValue: "",
      deptValue: "",
      people: "",
      role: "",
      id: "",
      show: false,
      firstDeptName: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      value1: "",
      value2: "",
      nkOpitonDept: [],
      optiondept: [],
      secondDept: [],
      optionpeople: [],
      optionrole: [],
      value: "",
      options_memberA: {}, //选择人员信息
      options_roles: {},
      projectMember: [], //项目成员表格
      url_b: "",
      url_c: "",
      url_e: "",
      projectId: "",
      memberRole: false,
      is_leave: "",
      note: "",
      duty: "",
      isleave: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ],
      form: {
        companyId: "",
        departmentId: "",
        memberId: "",
        departmentName: "", //部门名称
      },
      companyOptions: [],
      //部门option
      departmentOptions: [],
      //部门option的备份
      departmentOptionsCopy: [],
      //经理option
      memberOptions: [],
      _clear: this.clear,
    };
  },
  computed: {
    asideHeight: function () {
      if (this.$route.path == "/xiangmutuandui") {
        return document.documentElement.clientHeight - 200;
      } else {
        return document.documentElement.clientHeight - 340;
      }
    },
  },
  created() {
    this.isPermissionsA();

    var that = this;
    // var id = 3;
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    var memberid = userinfo.memberid;
    var params = {
      memberId: memberid,
      menuId: 15,
    };
    // var url = '/template/' + id;
    getTemplate("/template", params)
      .then((res) => {
        var projectCreat = res.data.data.list;
        // console.log(projectCreat)
        this.url_b = projectCreat[0].options.url_b;
        this.url_c = projectCreat[0].options.url_c;
        this.url_e = projectCreat[0].options.url_e;
        // console.log(this.url_e)
        //获取公司名称
        this.axios
          .get(projectCreat[0].options.url_a)
          .then((res) => {
            this.firstDeptName = res.data.data;
            this.compValue = userinfo.account_id;
            // this.chickvalue();
            this.companySelectChange(this.compValue);
          })
          .catch((err) => {
            console.log(err);
          });
        //获取角色
        if (userinfo.account_id == "-1814768306395265967") {
          var url =
            "/enum/group?param=ProjectRole&group_id=-1814768306395265967";
          isPermissions(url)
            .then((res) => {
              this.optionrole = res.data.data;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.axios
            .get(projectCreat[0].options.url_d)
            .then((res) => {
              // console.log(res)
              this.optionrole = res.data.data;
            })
            .catch((err) => {
              console.log(err);
            });
        }

        Bus.$on("projectContent", (item) => {
          if (item) {
            this.projectId = item.id;
            this.getMemberTable(item.id);
          }
        });
        //项目成员表格
        if (this.$route.query.id) {
          var projectId = this.$route.query.id;
        } else if (this.$route.name == "/xiangmutuandui") {
          var projectId = JSON.parse(localStorage.getItem("projectData"));
          projectId = projectId.ID;
        } else if (this.$route.name == "/projectstart") {
          var projectId = localStorage.getItem("proId");
        }
        this.getMemberTable(projectId);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
    datas: {
      deep: true,
      handler: function (val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      },
    },
  },
  methods: {
    validateJyh(code) {
      if (code == "" || code == null) {
        this.$message.error("请输入工作职责");
      }
    },
    //判断是否有编辑的权限
    isPermissionsA() {
      var that = this;
      var projectNo = "";
      var params = JSON.parse(localStorage.getItem("projectInfo"));
      if (this.$route.name == "/xiangmutuandui") {
        projectNo = localStorage.getItem("projectNumber");
      } else if (this.$route.name == "/projectstart") {
        projectNo = params.projectNum;
      }
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      var memberid = userinfo.memberid;
      var params = {
        projectNo: projectNo,
        memberId: memberid,
      };
      isPermissions("/member/role", params)
        .then((res) => {
          var memberRoleNum = res.data.data.memberRole;
          if (memberRoleNum == 1 || memberRoleNum == 3) {
            that.memberRole = false;
          } else {
            that.memberRole = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取项目成员表格
    getMemberTable(id) {
      var projectId = id;
      var url = this.url_e + "/" + projectId;
      this.axios
        .get(url)
        .then((res) => {
          this.projectMember = res.data.data;
          localStorage.removeItem("projectMember");
          localStorage.setItem(
            "projectMember",
            JSON.stringify(this.projectMember)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取部门名称
    chickvalue() {
      this.deptValue = "";
      this.people = "";
      var id = this.compValue;
      var url = this.url_b + "/" + id;
      this.axios
        .get(url)
        .then((res) => {
          if (
            this.compValue == "7034660345998100768" ||
            this.compValue == "8416498716893399290"
          ) {
            //南康科技没有二级单位
            this.nkOpitonDept = res.data.data;
          } else {
            this.nkOpitonDept = [];
            this.optiondept = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //部门
    companySelectChange(val) {
      departmentList(`/sgpm/rest/api/server/pm/project/groups/${val}`, null)
        .then((res) => {
          if (res.status == 200) {
            if (
              this.compValue == "7034660345998100768" ||
              this.compValue == "8416498716893399290"
            ) {
              //南康科技没有二级单位
              this.nkOpitonDept = res.data.data;
            } else {
              this.nkOpitonDept = [];
              this.departmentOptions = res.data.data;
              this.departmentSelectChange(this.form.departmentId);
              this.departmentOptionsCopy = [...this.departmentOptions];
            }

            this.form.departmentId = "";
            this.form.memberId = "";
            this.$emit("clearForm", true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //成员
    departmentSelectChange(val) {
      let depatName = "";
      this.departmentOptions.find((item) => item.id === val);
      this.departmentOptions.forEach((item) => {
        item.secondDepts.filter((jtem) => {
          if (val == jtem.secondDeptId) {
            depatName = jtem.secondDeptName;
          }
        });
      });
      this.form.departmentName = depatName;
      departmentList(`/sgpm/rest/api/server/pm/project/group/${val}`, null)
        .then((res) => {
          if (res.status == 200) {
            // this.memberOptions = res.data.data;
            this.optionpeople = res.data.data;
            this.form.memberId = "";
            this.$emit("clearForm", true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    filterMethodDepart(val) {
      let reg = new RegExp(val, "gi");
      let dep = this.departmentOptionsCopy;
      let depAarry = [];
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
            let secondAry = []
            for (let j = 0; j < def.length; j++) {
              if(def[j].secondDeptName.indexOf(val)>-1){
                secondAry.push(def[j])
              }
            }
            if(secondAry.length>0){
              dep[i]["secondDepts"] = secondAry
              depAarry.push(dep[i])
            }
          }
        }
      }
      this.departmentOptions = depAarry;
    },

    //获取人员
    getdeptName() {
      this.people = "";
      var id = this.deptValue;
      var url = this.url_c + "/" + id;
      console.log(url);
      this.axios
        .get(url)
        .then((res) => {
          this.optionpeople = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取人员 个人信息id
    changememeber(val) {
      this.options_memberA = {};
      console.log(val);
      console.log(this.optionpeople);
      for (var i = 0; i < this.optionpeople.length; i++) {
        if (this.optionpeople[i].memberid.indexOf(val) != -1) {
          console.log(this.optionpeople[i]);
          this.options_memberA = this.optionpeople[i];
          console.log(this.options_memberA);
        }
      }
    },
    //获取选中的角色id
    getRole(val) {
      this.options_roles = {};
      for (var i = 0; i < this.optionrole.length; i++) {
        if (this.optionrole[i].value.indexOf(val) != -1) {
          console.log(this.optionrole[i]);
          this.options_roles = this.optionrole[i];
        }
      }
    },
    // 时间戳转换
    formatDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d;
    },
    //提示信息
    warnMessage() {
      this.$message({
        showClose: true,
        message: "请选择公司名称/部门名称/人员/角色",
        type: "warning",
      });
    },
    //添加项目成员
    addPeople(val) {
      console.log();

      if (
        document.getElementById("compName").value == "" ||
        document.getElementById("memberName").value == "" ||
        document.getElementById("deptName").value == "" ||
        document.getElementById("role").value == ""
      ) {
        this.warnMessage();
        return;
      }
      var user_name = this.people;
      var role = this.role;
      //获取当前日期
      var myDate = new Date();
      myDate.getYear();
      myDate.getFullYear();
      myDate.getMonth();
      myDate.getDate();
      var nowDate = this.formatDateTime(myDate);
      if (this.$route.query.id) {
        var projectId = this.$route.query.id;
      } else {
        var projectId = window.localStorage.projectId;
      }
      console.log(this.projectId);
      console.log(this.options_memberA.memberid);
	  // var projectId = window.localStorage.projectId;
	  console.log(this.options_memberA)
      var data = {
        projectId: projectId,
        member: {
          user_name: this.options_memberA.emp_name,
          user_id: this.options_memberA.memberid,
          role: role,
          role_id: this.options_roles.id,
          status: "在职",
          unit_name: this.options_memberA.account_name,
          level_one: this.options_memberA.subdept_name,
          level_two: this.options_memberA.dept_name,
          // "duty": this.options_member.post_name,
          enter_time: nowDate,
          leave_time: "",
          is_leave: "0",
          note: "备注",
          duty: "工作职责",
        },
      };
      // var url = 'http://192.168.30.68:1004/sgpm/rest/api/server/pm/project/members';
      // this.axios.post(url,data).then((res) => {
      this.axios
        .post(this.url_e, data)
        .then((res) => {
          if (res.data.code == 200) {
            // alert('添加成功');
            this.getMemberTable(projectId);
            // this.compValue = "";
            // this.deptValue = "";
            this.people = "";
            this.role = "";
          } else if (res.data.code == 201) {
            alert("请勿重复添加!");
            // this.compValue = "";
            // this.deptValue = "";
            this.people = "";
            this.role = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
      this.value1 = row.enter_time;
      this.value2 = row.leave_time;
      console.log(row);
    },
    //修改
    editRole(index, row) {
      console.log(row);
      var data = {
        id: row.id,
        member: {
          user_name: row.user_name,
          user_id: row.user_id,
          role: row.role,
          status: row.status,
          unit_name: row.unit_name,
          level_one: row.level_one,
          level_two: row.level_two,
          enter_time: row.enter_time,
          leave_time: row.leave_time,
          person_type: row.person_type,
        },
      };
      editMember("/sgpm/rest/api/server/pm/project/members/member", data)
        .then((res) => {
          console.log(res);
          localStorage.removeItem("projectMember");
          localStorage.setItem(
            "projectMember",
            JSON.stringify(this.projectMember)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //修改
    handleEdit(index, row) {
      this.value1 = this.value1;
      this.value2 = this.value2;
      row.enter_time = this.value1;
      row.leave_time = this.value2;
      console.log(index, row);
      var data = {
        id: row.id,
        member: {
          user_name: row.user_name,
          user_id: row.user_id,
          role: row.role,
          status: row.status,
          unit_name: row.unit_name,
          level_one: row.level_one,
          level_two: row.level_two,
          enter_time: row.enter_time,
          leave_time: row.leave_time,
          person_type: row.person_type,
          is_leave: row.is_leave,
          note: row.note,
          duty: row.duty,
        },
      };
      editMember("/sgpm/rest/api/server/pm/project/members/member", data)
        .then((res) => {
          console.log(res);
          localStorage.removeItem("projectMember");
          localStorage.setItem(
            "projectMember",
            JSON.stringify(this.projectMember)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取id
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      if (this.multipleSelection.length <= 0) return;
      // console.log(this.multipleSelection)
      var idList = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        idList.push(this.multipleSelection[i].id);
        this.idLi = idList;
      }
      this.id = this.multipleSelection[0].id;
    },
    //删除
    handleDelete() {
      var id = this.idLi;
      if (!id) {
        alert("请先选择一条信息!");
        return;
      }
      for (var i = 0; i < id.length; i++) {
        var url = this.url_e + "/" + id[i];
        this.axios
          .delete(url)
          .then((res) => {
            if ((res.data.code = "200")) {
              // alert('删除成功');
              if (this.$route.query.id) {
                var projectId = this.$route.query.id;
              } else {
                var projectId = localStorage.getItem("projectId");
              }
              this.getMemberTable(projectId);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item__label{
	line-height: 25px!important;
}
.start {
  color: red;
}
.tb-edit .el-select {
  display: none;
}
.tb-edit .current-row .el-select {
  display: block;
}
.tb-edit .current-row .el-select + span {
  display: none;
}
.tb-edit .date-picker {
  display: none;
}
.tb-edit .current-row .date-picker {
  display: block;
}
.tb-edit .current-row .date-picker + span {
  display: none;
}
.selectDiv .el-select {
  width: 16%;
  margin-bottom: 10px;
}
.tb-edit {
  overflow-y: auto;
}
.tb-edit {
  /* height: 275px!important; */
}
.el-select {
  margin-left: 10px;
  margin-right: 10px;
}
.del {
  margin-right: 0;
}
.selectDiv {
  text-align: inherit;
}
.selectDiv span {
  font-size: 13px;
}
.el-select-group .el-select-dropdown__item {
  padding-left: 46px;
}
.date-picker {
  width: 100%;
}
/* .addRow {
  padding: 9px 15px;
  font-size: 12px;
} */
.el-table--border td,
.el-table--border th {
  /* border-right: none !important; */
}
.tb-edit .el-select {
  display: none;
}

.tb-edit .current-row .el-select {
  display: block;
}

.tb-edit .current-row .el-select + span {
  display: none;
}

.tb-edit .el-input {
  display: none;
}

.tb-edit .current-row .el-input {
  display: block;
}

.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
<style lang="scss">
.el-table th.gutter {
  display: table-cell !important;
}
.deptClass{
	label{
		line-height: 25px;
		font-size: 13px;
	}
}
.deptC{
	.el-input__inner{
		height: 28px;
	}
	// .el-input__suffix{
	// 	top: 27%;
	// }
	.el-input__icon{
		line-height: 28px;
	}
}
</style>
