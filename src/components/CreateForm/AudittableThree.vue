<template>
  <!--审批列表  待发流程-->
  <div>
    <div class="btn-item">
      <el-button type="primary" size="mini" @click="detail" :disabled="showStatus">编辑</el-button>
      <el-button
        type="primary"
        icon="el-icon-refresh"
        size="mini"
        circle
        class="circle-menu btn-left"
        @click="clearFilter"
      ></el-button>
    </div>
    <div class="wrap">
      <el-table
        :data="tableData"
        border
        :max-height="browerHeight"
        highlight-current-row
        @row-click="rowClick"
        :header-cell-style="{
          fontSize: '14px',
          color: '#303133',
          height: '51px',
          padding: 0,
          backgroundColor: '#ccd1d5'
        }"
        :row-style="{ height: '50px' }"
        :cell-style="{ padding: 0 }"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="processName"
          label="流程名称"
          align="center"
        ></el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="projectName"
          align="center"
          label="项目名称"
        ></el-table-column>

        <el-table-column prop="auditStatus" align="center" width="100" label="审核状态"></el-table-column>

        <el-table-column prop="submitName" align="center" width="100" label="提交人"></el-table-column>
        <el-table-column prop="needDate" align="center" label="修改时间"></el-table-column>
      </el-table>

      <div class="page right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="1"
          :page-sizes="[20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { integrationGetMethod } from "../../api/api.js"; //
import { projectMsgById } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "audittable-three",
  data() {
    return {
      //添加分页
      currentPage: 1,
      page: {
        //当前页
        pageNum: 1,
        //默认每页显示条数
        pageSize: 20,
        total: 0
      },
      projectNum: "",
      browerHeight: window.innerHeight - 230,
      showStatus: true, //编辑按钮 状态
      tableData: []
    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  created() {
    this.getTableDatas();
  },

  methods: {
    ...mapActions(["setDetailPage", "setCacheParams", "setAudittableThreeNum"]),

    //刷新页面
    clearFilter() {
      this.showStatus = true;
      this.tableData = [];
      this.getTableDatas();
    },

    //添加分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getTableDatas();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getTableDatas();
    },

    // 当前行选中时
    rowClick(val) {
      console.log(val);
      this.showStatus = false; //详情按钮可点击
      this.multipleSelection = val;
      //商机 合同 页面 从localstorage获取项目id 查询项目信息
      localStorage.setItem("businessProjectId", val.projectId);

      val["projectNum"] = val.projectNumber;
      localStorage.setItem("projectInfo", JSON.stringify(val));

      // console.log(this.multipleSelection);
      //通过项目id获取项目基本信息
      // 	if(val.jumpType == '11'){
      // 		var url = '/sgpm/rest/api/server/non/pm/gt/project/'+val.projectId + '/' + val.projectNumber;
      // 	}else{
      // 		// var url = '/sgpm/rest/api/server/pm/project?projectId=${val.projectId}';
      // 		var url = '/sgpm/rest/api/server/pm/project?projectId='+val.projectId;
      // 	}

      // var url = '/sgpm/rest/api/server/pm/project?projectId='+val.projectId;
      // projectMsgById(url,null)
      //   .then(res => {
      //     let result = res.data.data;
      //     // console.log("====项目信息=====");
      //     result["contractNum"] = result.CONTRACTNUMBER;  //启动预算使用，待启动有保存操作后添加
      //     result["projectNum"] = result.PROJECTNUMBER;
      //     this.projectNum = result.PROJECTNUMBER;
      //     // console.log(result);
      //     localStorage.setItem("projectInfo", JSON.stringify(result));
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },

    //点击编辑按钮
    detail() {
      this.setDetailPage(false); //全局设置 isDetail 变量属性
      sessionStorage.setItem("isRevoke", 2);
      this.getProjectMsyById();
    },

    //通过项目id获取项目信息进行编辑或者查看
    getProjectMsyById() {
      console.log(this.multipleSelection);
      let projectId = this.multipleSelection.projectId;
      let projectNumber = this.multipleSelection.projectNumber;
      //编辑是根据jumpType来判断跳转那种项目 1，是商机项目，2，是合同项目，3，是子项目
      let jumpType = this.multipleSelection.jumpType;
      let audit_status = this.multipleSelection.auditStatusNumber;

      if (!jumpType) {
        this.$message({
          message: "不能跳转",
          type: "warning"
        });
        return false;
      }
      if (jumpType == 1 && audit_status == 10) {
        //商机项目
        this.$router.push({
          // name: "/Businessproject",
          // params: { id: projectId, projectNumber: projectNumber },
			path: "Businessproject",
			query: { id: projectId, projectNumber: projectNumber },
        });
      } else if (jumpType == 2 && audit_status == 10) {
        //合同项目
        this.$router.push({
          path: "contractproject",
          query: { id: projectId }
        });
      } else if (jumpType == 3 && audit_status == 10) {
        //子项目
        this.$router.push({
          name: "/childproject",
          params: { id: projectId }
        });
      } else if (jumpType == 11 && audit_status == 10) {
        this.$router.push({
          path: "notContractProject",
          query: {
            id: projectId,
            projectNum: projectNumber
          }
        });
      } else if (audit_status == 30 && jumpType != 11) {
        //项目结项
        //跳转到结项页面
        if (
          this.userinfo.account_id == "-1360422574114386809" ||
          this.userinfo.account_id == "5326994013938795629"
        ) {
          this.$router.push({
            path: "nonContractual",
            query: {
              id: projectId,
              judgelogo: "d",
              projectNum: projectNumber
            }
          });
        } else if (
          this.userinfo.account_id == "-1814768306395265967" ||
          this.userinfo.account_id == "8416498716893399290" ||
          this.userinfo.account_id == "7638091599462351621"
        ) {
          this.$router.push({
            path: "gtNonContractual",
            query: {
              id: projectId,
              judgelogo: "d",
              projectNum: projectNumber
            }
          });
        }
      } else if (audit_status == 30 && jumpType == 11) {
        //非合同结项
        this.$router.push({
          path: "nonPostProject",
          query: {
            id: projectId,
            judgelogo: "d",
            projectNum: projectNumber
          }
        });
      } else if (audit_status == 20) {
        //跳转到启动页面
        localStorage.setItem("proId", projectId); //启动页面新增条件
        this.$router.push({
          path: "projectstart",
          query: {
            id: projectId,
            category: this.multipleSelection.jumpType,
            judgestart: 99
          }
        });
      } else if (this.multipleSelection.auditStatusNumber == 40) {
        this.$router.push({
          path: "contractFinish",
          query: {
            id: projectId,
            // judgelogo: val,
            projectNum: projectNumber
          }
        });
      } else if (audit_status == 50) {
        this.$router.push({
          path: "abnormalProject",
          query: {
            id: projectId,
            judgelogo: "c",
            projectNum: projectNumber
          }
        });
      } else if (jumpType == 20) {
        // 里程碑变更详情页面
        this.$router.push({
          path: "MilepostChangeEdit",
          query: {
            projectNum: projectNumber
          }
        });
      }
    },

    //获取待发流程数据
    getTableDatas() {
      var _this = this;
      var params = {
        memberId: this.userinfo.memberid,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      };
      var url =
        "/sgpm/rest/api/integration/oa/wait/sending/process/information";

      integrationGetMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (res.data.code == 200) {
            // console.log("====待发流程数据===");
            // console.log(jsonData);
            _this.tableData = jsonData;
            _this.page.total = res.data.meta.totalCount;
            _this.$emit("totalCount", res.data.meta.totalCount); //子组件向父组件传值
            if (res.data.meta.totalCount == 0) {
              _this.setAudittableThreeNum(res.data.meta.totalCount);
              //再次更新左侧菜单已发审批
              _this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$children[0].getTableDatasDF();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.circle-menu {
  border-radius: 5px;
}

.btn-left {
  margin: 0 5px 0 2px;
}

.right {
  float: right;
}
.page {
  margin: 10px 0 0 0;
}
.btn-item {
  text-align: right;
  padding: 0 5px 5px 5px;
}
.wrap {
}
</style>
