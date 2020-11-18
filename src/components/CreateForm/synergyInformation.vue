<template>
  <el-table :data="tableData" class="tb-edit" highlight-current-row @row-click="handleCurrentChange"
    style="width: 100%">
    <el-table-column type="index" label="序号" width="50">
    </el-table-column>
    <el-table-column prop="teamworkUserId" label="teamworkUserId" width="0" v-if="show"></el-table-column>
    <el-table-column prop="teamworkTwoUnitId" label="teamworkTwoUnitId" width="0" v-if="show"></el-table-column>
    <el-table-column prop="teamworkThreeUnitId" label="teamworkThreeUnitId" width="0" v-if="show"></el-table-column>
    <el-table-column prop="teamworkUserName" label="*负责人" width="150">
      <template slot-scope="scope">
        <el-select v-model="scope.row.teamworkUserName" filterable remote reserve-keyword placeholder="请输入关键词"
          :remote-method="remoteMethod" :loading="loading" @change="handleEdit(scope.$index, scope.row)">
          <el-option v-for="(item,index) in teamworkUserName" :key="index" :label="item.empInfo" :value="item.value">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="teamworkTwoUnitName" label="*协同B级单位" width="180">
      <template slot-scope="scope">
        <el-input v-model="scope.row.teamworkTwoUnitName" @change="handleEditTeam(scope.$index, scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="teamworkThreeUnitName" label="协同C级单位" width="180">
      <template slot-scope="scope">
        <el-select v-model="scope.row.teamworkThreeUnitName" filterable placeholder="请选择"
          @change="handleEditTeam(scope.$index, scope.row)">
          <el-option v-for="(item,index) in teamworkThreeUnitName" :key="index" :label="item.deptName"
            :value="item.deptName"></el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column prop="jobContent" label="*工作内容">
      <template slot-scope="scope">
        <el-input v-model="scope.row.jobContent" @change="handleEditTeam(scope.$index, scope.row)"></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
import { getProjectMenu, systemGetHttpMethod } from "../../api/api.js";
import { setInterval } from "timers";

export default {
  name: "synergyInformation",
  components: {},
  data() {
    return {
      form: {
        emp_name: ""
      },
      show: false,
      loading: true,
      teamworkUserId: "",
      teamworkTwoUnitId: "",
      teamworkThreeUnitId: "",
      teamworkUserName: "",
      teamworkTwoUnitName: "",
      teamworkThreeUnitName: "",
      jobContent: "",
      projectNumber: this.$route.query.projectNum,
      tableData: [
        {
          teamworkUserName: "",
          teamworkUserId: "",
          teamworkTwoUnitName: "",
          teamworkTwoUnitId: "",
          teamworkThreeUnitName: "",
          teamworkThreeUnitId: "",
          jobContent: ""
        },
        {
          teamworkUserName: "",
          teamworkUserId: "",
          teamworkTwoUnitName: "",
          teamworkTwoUnitId: "",
          teamworkThreeUnitName: "",
          teamworkThreeUnitId: "",
          jobContent: ""
        },
        {
          teamworkUserName: "",
          teamworkUserId: "",
          teamworkTwoUnitName: "",
          teamworkTwoUnitId: "",
          teamworkThreeUnitName: "",
          teamworkThreeUnitId: "",
          jobContent: ""
        },
        {
          teamworkUserName: "",
          teamworkUserId: "",
          teamworkTwoUnitName: "",
          teamworkTwoUnitId: "",
          teamworkThreeUnitName: "",
          teamworkThreeUnitId: "",
          jobContent: ""
        },
        {
          teamworkUserName: "",
          teamworkUserId: "",
          teamworkTwoUnitName: "",
          teamworkTwoUnitId: "",
          teamworkThreeUnitName: "",
          teamworkThreeUnitId: "",
          jobContent: ""
        }
      ]
    };
  },
  computed: {
    ...mapState([
      "userinfo" //oa跳转过来的用户信息值
    ])
  },
  created() {
    console.log(this.projectNumber);
    if (
      this.projectNumber &&
      (this.userinfo.account_id == "-1814768306395265967" || //南京国图
      this.userinfo.account_id == "5326994013938795629" || //超图信息
      this.userinfo.account_id == "-1360422574114386809" || //超图软件
      this.userinfo.account_id == "8416498716893399290" || //南康
      this.userinfo.account_id == "7034660345998100768" || //河南超图
      this.userinfo.account_id == "-7975978055853456035" || //地图慧
      this.userinfo.account_id == "7638091599462351621"  //安图
      ) 
    ) {
      setTimeout(() => {
        if (localStorage.getItem("teamData") != "undefined") {
          this.tableData = JSON.parse(localStorage.getItem("teamData"));
        }
      }, 800);
    }
  },
  methods: {
    //项目经理模糊查询
    remoteMethod(val) {
      var field = val;
      var url =
        "/sgpm/rest/api/system/user/info/fuzzy/search?accountId=" +
        this.userinfo.account_id +
        "&search=" +
        field +
        "&pageSize=10&pageNum=1";
      getProjectMenu(url)
        .then(res => {
          if (res.status == 200) {
            console.log(res.data.data);
            this.loading = false;
            this.teamworkUserName = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //B级 C级单位
    handleEdit(index, row) {
      console.log(row);
      var url = "/sgpm/rest/api/system/user/" + row.teamworkUserName;
      systemGetHttpMethod(url)
        .then(res => {
          if (res.status == 200) {
            let result = res.data.data;
            console.log(result);
            for (var i = 0; i < this.tableData.length; i++) {
              if (i == index) {
                this.tableData[i].teamworkUserName = result.emp_name;
                this.tableData[i].teamworkUserId = result.memberid;
                this.tableData[i].teamworkTwoUnitId = result.subdept_id;
                this.tableData[i].teamworkThreeUnitId = result.dept_id;
                if (result.teamworkThreeUnitName == "管理团队") {
                  this.tableData[i].teamworkThreeUnitName = "";
                } else {
                  this.tableData[i].teamworkThreeUnitName = result.dept_name;
                }
                this.tableData[i].teamworkTwoUnitName = result.subdept_name;
              }
            }
            localStorage.removeItem("teamworkTable");
            localStorage.setItem(
              "teamworkTable",
              JSON.stringify(this.tableData)
            );
            console.log(this.tableData);
            //C级
            var cUrl =
              "/sgpm/rest/api/system/user/department/part?memberId=" +
              result.memberid;
            systemGetHttpMethod(cUrl)
              .then(res => {
                console.log(res);
                this.teamworkThreeUnitName = res.data.data.departments;
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
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget);
    },
    handleEditTeam(index, row) {
      console.log(this.tableData);
      localStorage.removeItem("teamworkTable");
      localStorage.setItem("teamworkTable", JSON.stringify(this.tableData));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
