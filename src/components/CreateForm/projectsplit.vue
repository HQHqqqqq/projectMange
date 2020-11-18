<template>
  <el-form>
    <el-button class="add" size="mini" type="primary" @click="addRow(tableData)">添加</el-button>
    <el-table :data="tableData" border size="mini"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}" :cell-style="{padding:0}" style="width: 100%;margin-bottom: 10px;min-height: 200px;"
      class="tb-edit" highlight-current-row @row-click="handleCurrentChange">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="id" label="id" width="0" v-if="show"></el-table-column>
      <el-table-column prop="classUnitBId" label="classUnitBId" width="0" v-if="show"></el-table-column>
      <el-table-column prop="classUnitCId" label="classUnitCId" width="0" v-if="show"></el-table-column>
      <el-table-column prop="projectManagerId" label="projectManagerId" width="0" v-if="show"></el-table-column>
      <el-table-column prop="projectNumber" label="项目编号" width="170">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.projectNumber" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="projectManagerName" align="" label="*实施项目经理" width="130">
        <template slot="header">
          <span class="start">*</span>
          <span>实施项目经理</span>
        </template>

        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.projectManagerName" filterable remote reserve-keyword
            placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading"
            @change="handleEdit(scope.$index, scope.row)">
            <el-option v-for="(item,index) in projectManagerName" :key="index" :label="item.empInfo"
              :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="classUnitBName" label="*实施B级单位" width="130">
        <template slot="header">
          <span class="start">*</span>
          <span>实施B级单位</span>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.classUnitBName" disabled></el-input>
          <!-- <el-select
            v-model="scope.row.subdeptname"
            filterable
            placeholder="请选择"
            @change="handleEditsub(scope.$index, scope.row)"
          >
            <el-option
              v-for="item in subdeptname"
              :key="item.firstDeptName"
              :label="item.firstDeptName"
              :value="item.firstDeptName"
            ></el-option>
          </el-select>-->
        </template>
      </el-table-column>
      <el-table-column prop="classUnitCName" label="实施C级单位" width="130" v-if="showType">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.classUnitCName" filterable placeholder="请选择"
            @change="handleEditCname(scope.$index, scope.row)">
            <el-option v-for="(item,index) in classUnitCName" :key="index" :label="item.deptName"
              :value="item.deptName"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="*项目名称" width="230">
        <template slot="header">
          <span class="start">*</span>
          <span>项目名称</span>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.projectName" @change="handleEditSelect(scope.$index, scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="expectContributions" width="120" label="*合同额(经费)">
        <template slot="header">
          <span class="start">*</span>
          <span>合同额(经费)</span>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" type="number" min="0" v-model="scope.row.expectContributions"
            @blur="UpdateTaskName($event,scope.$index, scope.row)" @change="handleEditSelect(scope.$index, scope.row)">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="milestoneWeight" label="*进度权重(%)" width="120">
        <template slot="header">
          <span class="start">*</span>
          <span>进度权重(%)</span>
        </template>
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.milestoneWeight" style="width:90px;" controls-position="right"
            :min="1" :max="100" :step="5" @change="handleChange"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="projectLevel" width="100" label="*项目级别">
        <template slot="header">
          <span class="start">*</span>
          <span>项目级别</span>
        </template>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.projectLevel" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="projectType" label="*项目类型" width="140">
        <template slot="header">
          <span class="start">*</span>
          <span>项目类型</span>
        </template>
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.projectType" filterable placeholder="请选择"
            @change="handleEditSelect(scope.$index, scope.row)" @focus="proType(scope.$index, scope.row)">
            <el-option v-for="(item,index) in projectType" :key="item.id" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="projectContent" width="180" label="*项目建设内容">
        <template slot="header">
          <span class="start">*</span>
          <span>项目建设内容</span>
        </template>
        <template slot-scope="scope">
          <el-input type="textarea" size="mini" v-model="scope.row.projectContent"
            @change="handleEditSelect(scope.$index, scope.row)">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="projectChildType" width="160" label="*项目子类" v-if="showType">
        <template slot="header">
          <span class="start">*</span>
          <span>项目子类</span>
        </template>
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.projectChildType" filterable placeholder="请选择"
            @change="handleEditSelect(scope.$index, scope.row)" @focus="childType(scope.$index, scope.row)">
            <el-option v-for="(item,index) in projectChildType" :key="item.id" :label="item.value"
              :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="professionalWorkTypes" width="160" label="*业务类型" v-if="showType">
        <template slot="header">
          <span class="start">*</span>
          <span>业务类型</span>
        </template>
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.professionalWorkTypes" filterable placeholder="请选择"
            @change="handleEditSelect(scope.$index, scope.row)" @focus="busType(scope.$index, scope.row)">
            <el-option v-for="(item,index) in professionalWorkTypes" :key="item.id" :label="item.value"
              :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="64">
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="deleteRow(scope.$index, tableData)">
            <i class="el-icon-delete-solid" style="font-size: 18px;color:'#409EFF'"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
import { getSubdeptWay } from "../../api/api.js";
import { systemGetHttpMethod } from "../../api/api.js";
import { serverGetHttpMethod, delProjectById } from "../../api/api.js";
export default {
  name: "projectsplit",
  components: {},
  data() {
    return {
      classUnitCId: "",
      classUnitBId: "",
      projectManagerId: "",
      show: false,
      showType: "",
      loading: true,
      projectNumber: "",
      classUnitCName: "",
      projectManagerName: "",
      form: {
        emp_name: ""
      },
      projectName: "",
      projectContent: "",
      expectContributions: "",
      milestoneWeight: "",
      //业务类型
      professionalWorkTypes: [],
      professionalWorkTypes_copy: [],
      //项目子类
      projectChildType: [],
      ProjectChildType_List: [],
      //实施B级单位
      classUnitBName: [],
      projectLevel: "",
      //项目类型
      projectType: [],
      projectType_A: [],
      options: [
        {
          value: "选项1",
          label: "项目监控"
        },
        {
          value: "选项2",
          label: "项目策划"
        },
        {
          value: "选项3",
          label: "需求"
        },
        {
          value: "选项4",
          label: "设计与开发"
        },
        {
          value: "选项6",
          label: "评审和测试"
        },
        {
          value: "选项7",
          label: "度量"
        },
        {
          value: "选项8",
          label: "质量保证"
        },
        {
          value: "选项9",
          label: "集成"
        },
        {
          value: "选项10",
          label: "风险"
        },
        {
          value: "选项11",
          label: "配置"
        },
        {
          value: "选项5",
          label: "培训"
        },
        {
          value: "选项5",
          label: "其他"
        }
      ],
      tableData: [],
      busTypeIndex: -1,
      proTypeIndex: -1,
      childTypeIndex: -1
    };
  },
  computed: {
    ...mapState([
      "userinfo" //oa跳转过来的用户信息值
    ])
  },
  created() {
    console.log(this.tableData);
    if (this.userinfo.account_id == "-1814768306395265967") {
      this.showType = true;
    } else if (this.userinfo.account_id == "8416498716893399290") {
      this.showType = false;
    }
  },
  mounted() {
    localStorage.removeItem("quanzhongAdd");
    this.getProjectType();
    var item = JSON.parse(localStorage.getItem("gtProjectSplit"));
    if (item) {
      this.tableData = item;
      for (var i = 0; i < this.tableData.length; i++) {
        for (var j = 0; j < item.length; j++) {
          if (this.tableData[i].projectName == item[j].projectName) {
            this.tableData[i].projectNumber = item[j].projectNumber;
            this.tableData[i].id = item[j].id;
            this.getBusinesstype(this.tableData[i].classUnitBId);
            this.getProjectType(this.tableData[i].classUnitBId);
            this.getProjectChildType(this.tableData[i].classUnitBId);
          }
        }
      }
      localStorage.removeItem("projectSplit");
      localStorage.setItem("projectSplit", JSON.stringify(this.tableData));
    }

    Bus.$on("gtProjectSplit", item => {
      if (item) {
        item = JSON.parse(item);
        this.tableData = item;
        for (var i = 0; i < this.tableData.length; i++) {
          for (var j = 0; j < item.length; j++) {
            if (this.tableData[i].projectName == item[j].projectName) {
              this.tableData[i].projectNumber = item[j].projectNumber;
              this.tableData[i].id = item[j].id;
            }
          }
        }
        localStorage.removeItem("projectSplit");
        localStorage.setItem("projectSplit", JSON.stringify(this.tableData));
      }
    });
  },
  methods: {
    handleChange(value) {
      console.log(value);
      console.log(this.tableData);
      localStorage.setItem("projectSplit", JSON.stringify(this.tableData));
      localStorage.setItem("quanzhongDate", JSON.stringify(this.tableData));
    },
    //项目子类
    getProjectChildType(sub, index) {
      var that = this;
      var url =
        "/sgpm/rest/api/server/pm/project/enum/group?param=ProjectChild&group_id=" +
        sub;
      serverGetHttpMethod(url)
        .then(res => {
          var arr = [];
          arr.push(res.data.data);
          if (that.ProjectChildType_List[index]) {
            that.ProjectChildType_List.splice(index, arr.length, arr);
          } else {
            that.ProjectChildType_List.push(arr);
          }
          console.log(that.ProjectChildType_List);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目类型
    getProjectType(sub, index) {
      var url = "/sgpm/rest/api/server/pm/project/ProjectType";
      serverGetHttpMethod(url)
        .then(res => {
          // this.projectType = res.data.data;

          var arr = [];
          arr.push(res.data.data);
          if (this.projectType_A[index]) {
            this.projectType_A.splice(index, arr.length, arr);
          } else {
            this.projectType_A.push(arr);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加
    addRow(tableData, event) {
      tableData.push({
        id: "",
        projectNumber: "",
        classUnitBName: "",
        classUnitCName: "",
        projectLevel: "",
        professionalWorkTypes: "",
        projectManagerName: "",
        projectName: "",
        projectType: "",
        projectContent: "",
        expectContributions: "",
        milestoneWeight: ""
      });
    },
    //删除
    deleteRow(index, rows) {
      console.log(index, rows);
      if (rows.length <= 1) {
        this.$message({
          message: "最后一条数据，暂时不能删除!",
          type: "warning"
        });

        return;
      }
      for (var i = 0; i < rows.length; i++) {
        if (index == i) {
          if (rows[i].id) {
            delProjectById(`/sgpm/rest/api/server/pm/gt/project/${rows[i].id}`)
              .then(res => {
                if (res.status == 200) {
                  rows.splice(index, 1);
                  localStorage.removeItem("projectSplit");
                  localStorage.setItem(
                    "projectSplit",
                    JSON.stringify(this.tableData)
                  );
                  localStorage.setItem(
                    "quanzhongDate",
                    JSON.stringify(this.tableData)
                  );
                }
              })
              .catch(err => {
                console.log(err);
              });
            return;
          } else {
            rows.splice(index, 1);
            localStorage.removeItem("projectSplit");
            localStorage.setItem(
              "projectSplit",
              JSON.stringify(this.tableData)
            );
            localStorage.setItem(
              "quanzhongDate",
              JSON.stringify(this.tableData)
            );
          }
        }
      }

      // localStorage.removeItem('projectSplit');
      // localStorage.setItem('projectSplit',JSON.stringify(this.tableData));
    },
    //项目经理模糊查询
    remoteMethod(val) {
      var field = val;
      var url =
        "/sgpm/rest/api/system/user/info/fuzzy/search?accountId=" +
        this.userinfo.account_id +
        "&search=" +
        field +
        "&pageSize=10&pageNum=1";
      systemGetHttpMethod(url)
        .then(res => {
          if (res.status == 200) {
            console.log(res.data.data);
            this.loading = false;
            this.projectManagerName = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //项目预计金额分摊->项目级别
    UpdateTaskName(e, index, row) {
      var money = e.target.value;
      if (!isNaN(money)) {
        var projectlevel = "";
        var contractMoney = parseFloat(e.target.value);
        if (contractMoney >= 1000) {
          projectlevel = "超大型";
        } else if (contractMoney >= 500 && contractMoney < 1000) {
          projectlevel = "大型";
        } else if (contractMoney >= 200 && contractMoney < 500) {
          projectlevel = "中型";
        } else if (contractMoney < 200) {
          projectlevel = "小型";
        }
        for (var i = 0; i < this.tableData.length; i++) {
          if (i == index) {
            this.tableData[i].projectLevel = projectlevel;
          }
        }
      } else {
        alert("项目预计金额分摊必须是数字!");
        return;
      }
    },
    //进度权重不能大于100%
    handleCurrentChange(row, event, column) {
      localStorage.removeItem("quanzhongAdd");
      var tableDataInfo = this.tableData;
      var quanzhong = [];
      for (var i = 0; i < tableDataInfo.length; i++) {
        if (
          tableDataInfo[i].milestoneWeight != "" &&
          tableDataInfo[i].milestoneWeight != undefined
        ) {
          quanzhong.push(tableDataInfo[i].milestoneWeight);
        }
      }
      var quanzhongAdd = eval(quanzhong.join("+"));
      if (quanzhongAdd > 100) {
        alert("所有项目占合同里程碑进度权重不能大于100%!");
        row.milestoneWeight = row.milestoneWeight - 5;
        localStorage.setItem("quanzhongDate", JSON.stringify(this.tableData));
        return;
      }

      localStorage.removeItem("projectSplit");
      localStorage.setItem("projectSplit", JSON.stringify(this.tableData));
    },
    //业务类型
    getBusinesstype(sub, index) {
      console.log(index);
      var that = this;
      var url =
        "/sgpm/rest/api/server/pm/project/enum/group?param=BusinessType&group_id=" +
        sub;
      serverGetHttpMethod(url)
        .then(res => {
          // that.professionalWorkTypes = res.data.data;
          var arr = [];
          arr.push(res.data.data);
          if (that.professionalWorkTypes_copy[index]) {
            that.professionalWorkTypes_copy.splice(index, arr.length, arr);
          } else {
            that.professionalWorkTypes_copy.push(arr);
          }
          console.log(that.professionalWorkTypes_copy);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //B级 C级单位
    handleEdit(index, row) {
      console.log(row);
      var url = "/sgpm/rest/api/system/user/" + row.projectManagerName;
      systemGetHttpMethod(url)
        .then(res => {
          if (res.status == 200) {
            let result = res.data.data;
            console.log(result);
            this.getProjectType(result.subdept_id, index);
            this.getBusinesstype(result.subdept_id, index);
            this.getProjectChildType(result.subdept_id, index);
            for (var i = 0; i < this.tableData.length; i++) {
              if (i == index) {
                this.tableData[i].projectManagerName = result.emp_name;
                this.tableData[i].projectManagerId = result.memberid;
                this.tableData[i].classUnitBId = result.subdept_id;
                this.tableData[i].classUnitCId = result.dept_id;
                if (result.classUnitCName == "管理团队") {
                  this.tableData[i].classUnitCName = "";
                } else {
                  this.tableData[i].classUnitCName = result.dept_name;
                }
                this.tableData[i].classUnitBName = result.subdept_name;
              }
            }
            localStorage.removeItem("projectSplit");
            localStorage.setItem(
              "projectSplit",
              JSON.stringify(this.tableData)
            );
            //C级
            var cUrl =
              "/sgpm/rest/api/system/user/department/part?memberId=" +
              result.memberid;
            systemGetHttpMethod(cUrl)
              .then(res => {
                console.log(res);
                this.classUnitCName = res.data.data.departments;
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEditCname(index, row) {
      console.log(row);
      localStorage.removeItem("projectSplit");
      localStorage.setItem("projectSplit", JSON.stringify(this.tableData));
      localStorage.setItem("quanzhongDate", JSON.stringify(this.tableData));
    },
    handleEditSelect(index, row) {
      localStorage.removeItem("projectSplit");
      localStorage.setItem("projectSplit", JSON.stringify(this.tableData));
      localStorage.setItem("quanzhongDate", JSON.stringify(this.tableData));
    },
    busType(index, row) {
      console.log(row);
      console.log(index);
      this.busTypeIndex = index;
      this.professionalWorkTypes = this.professionalWorkTypes_copy[index][0];
    },
    proType(index, row) {
      this.proTypeIndex = index;
      this.projectType = this.projectType_A[index][0];
    },
    childType(index, row) {
      this.childTypeIndex = index;
      this.projectChildType = this.ProjectChildType_List[index][0];
    }
  }
};
</script>

<style scoped>
.add {
  float: right;
  margin: 0 0 20px 0;
}

.el-input-number__decrease,
.el-input-number__increase {
  width: 20px !important;
}

.start {
  color: red;
}

/* .add:nth-child(2){
	margin-right: 10px;
} */
/* .tb-edit .el-select {
  display: none;
}
.tb-edit .current-row .el-select {
  display: block;
}
.tb-edit .current-row .el-select + span {
  display: none;
}
.tb-edit .el-input{
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
} */
</style>
