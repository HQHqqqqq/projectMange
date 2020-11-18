<template>
  <!--审批列表  待审流程-->
  <div class>
    <!--{{this.tableData}}-->
    <div class="btn-item">
      <el-button type="primary" size="mini" @click="detail" :disabled="showStatus">详情</el-button>
      <el-button type="primary" size="mini" @click="openTemporaryDialog">审批</el-button>
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

        <el-table-column prop="senderName" align="center" width="100" label="提交人"></el-table-column>

        <el-table-column prop="waiterName" align="center" width="250" label="待审人"></el-table-column>

        <el-table-column prop="processStartDate" align="center" label="流程发起时间"></el-table-column>
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

    <el-dialog v-dialogDrag title="提示" :visible.sync="dialogTemporaryVisible" width="30%">
      <span>您接下来的操作，将会跳转oa系统中进行审批，请单击确定执行</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTemporaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="TemporaryConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { integrationGetMethod } from "../../api/api.js"; //
import { projectMsgById } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "audittable-one",
  data() {
    return {
      projectNum: "",
      //添加分页
      currentPage: 1,
      page: {
        //当前页
        pageNum: 1,
        //每页显示条数
        pageSize: 20,
        total: 0
      },

      browerHeight: window.innerHeight - 240,
      dialogTemporaryVisible: false,
      tableData: [],
      showStatus: true //详情按钮 状态
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
    ...mapActions(["setDetailPage", "setCacheParams", "setAudittableOneNum"]),

    //临时到oa里面去审批
    openTemporaryDialog() {
      this.dialogTemporaryVisible = true;
    },
    TemporaryConfirm() {
      this.dialogTemporaryVisible = false;
      window.open("http://oa.supermap.cn/seeyon/main.do?method=main");
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

    //刷新页面
    clearFilter() {
      this.showStatus = true;
      this.tableData = [];
      this.getTableDatas();
    },

    // 当前行选中时
    rowClick(val) {
      console.log(val);
      this.showStatus = false; //详情按钮可点击
      this.multipleSelection = val;
      //商机 合同 页面 从localstorage获取项目id 查询项目信息
      localStorage.setItem("businessProjectId", val.projectId);
      // console.log(this.multipleSelection);

      val["projectNum"] = val.projectNumber;
      localStorage.setItem("projectInfo", JSON.stringify(val));
    },

    //点击详情按钮
    detail() {
      this.setDetailPage(true); //全局设置 isDetail 变量属性
      this.getProjectMsyById();
    },

    //通过项目id获取项目信息进行编辑或者查看
    getProjectMsyById() {
      console.log(this.multipleSelection);
      let projectId = this.multipleSelection.projectId;
      let projectNumber = this.multipleSelection.projectNumber;
      //编辑是根据jumpType来判断跳转那种项目 1，是商机项目，2，是合同项目，3，是子项目
      let jumpType = this.multipleSelection.jumpType;

      //通过项目id获取项目基本信息
      // projectMsgById(
      //   `/sgpm/rest/api/server/pm/project?projectId=${projectId}`,
      //   null
      // )
      //   .then(res => {
      //     let result = res.data.data;
      //     //国图启动页面 参数
      //     result["contractNum"] = result.CONTRACTNUMBER;
      //     result["projectNum"] = result.PROJECTNUMBER;
      //     localStorage.setItem("projectInfo", JSON.stringify(result));
      //     this.projectNum = result.PROJECTNUMBER;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });

      var name = this.multipleSelection.processName.slice(0, 4);
      var projectname = this.multipleSelection.processName.slice(0, 7);
      console.log("=====name======" + name);

      if (name == "项目结项") {
        if (
          this.userinfo.account_id == "-1360422574114386809" ||
          this.userinfo.account_id == "5326994013938795629"
        ) {
          this.$router.push({
            path: "nonContractual?isShow=1",
            query: {
              id: projectId,
              judgelogo: "d",
              projectNum: this.multipleSelection.projectNumber
              // isShow:true
            }
          });
        } else if (
          this.userinfo.account_id == "-1814768306395265967" ||
          this.userinfo.account_id == "8416498716893399290" ||
          this.userinfo.account_id == "7638091599462351621"
        ) {
          this.$router.push({
            path: "gtNonContractual?isShow=1",
            query: {
              id: projectId,
              judgelogo: "d",
              projectNum: this.multipleSelection.projectNumber
              // isShow:true
            }
          });
        }
        return false;
      } else if (name == "合同结项" || name == "南康合同" || name == "项目合同") {
        this.$router.push({
          path: "contractFinish?isShow=1",
          query: {
            id: projectId,
            judgelogo: "d",
            projectNum: this.multipleSelection.projectNumber
            // isShow:true
          }
        });
        return false;
      } else if (
        name == "异常结项" ||
        name == "南康异常" ||
        name == "项目异常"
      ) {
        this.$router.push({
          path: "abnormalProject?isShow=1",
          query: {
            id: projectId,
            judgelogo: "d",
            projectNum: this.multipleSelection.projectNumber
            // isShow:true
          }
        });
        return false;
      }
      if (projectname == "非合同项目结项") {
        this.$router.push({
          path: "nonPostProject",
          query: {
            id: projectId,
            judgelogo: "d",
            projectNum: this.multipleSelection.projectNumber,
            isShow: 1
          }
        });
        return false;
      }

      if (jumpType == 1) {
        //商机项目
        this.$router.push({
          path: "Businessproject",
          query: {
            isShow: 1,
			id: projectId,
			projectNumber: this.multipleSelection.projectNumber
          }
        });
      } else if (jumpType == 2) {
        //合同项目
        this.$router.push({
          path: "contractproject",
          query: {
            isShow: 1,
			id: projectId
          },
        });
      } else if (jumpType == 3) {
        //子项目
        this.$router.push({
          name: "/childproject",
          params: { id: projectId }
        });
      } else if (jumpType == 4) {
        localStorage.setItem("proId", projectId); //启动页面新增条件
        this.$router.push({
          path: "projectstart",
          query: {
            id: projectId,
            category: 1, //跳转类型 1商机项目
            judgestart: 99,
			isShow: 1
          }
        });
      } else if (jumpType == 11) {
        //国图 非合同登记页面
        this.$router.push({
          path: "notContractProject",
          query: {
            isShow: 1,
            id: projectId,
            projectNum: projectNumber
          }
        });
      } else if (jumpType == 20) {
        // 里程碑变更详情页面
        this.$router.push({
          path: "MilepostChangeShow",
          query: {
            projectNum: projectNumber
          }
        });
      } else {
        this.$message({
          message: "不能跳转",
          type: "warning"
        });
      }
    },

    //获取待审核数据
    getTableDatas() {
      var _this = this;
      // console.log(this.userinfo);
      // var params = {memberId: "7503529197009650726"};
      var params = {
        memberId: this.userinfo.memberid,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      };
      var url = "/sgpm/rest/api/integration/oa/pending/process/information";
      integrationGetMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (res.data.code == 200) {
            // console.log("====待审数据===");
            // console.log(jsonData);
            _this.tableData = jsonData;
            _this.page.total = res.data.meta.totalCount;
            _this.$emit("totalCount", res.data.meta.totalCount); //子组件向父组件传值
            if (res.data.meta.totalCount == 0) {
              _this.setAudittableOneNum(res.data.meta.totalCount);
              _this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$children[0].getTableDatas();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });

      // var data=[
      //   {projectId:104297,jumpType:1,projectName:'测试C级01'},
      //   {projectId:104296,jumpType:1,projectName:'测试C级单位'},
      //   {projectId:92654,jumpType:2,projectName:'合同登记1'},
      //   {projectId:92651,jumpType:2,projectName:'测试新合同表单 提交'},
      // ];
      // this.tableData=data;
      // this.$emit("totalCount", this.tableData.length); //子组件向父组件传值
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
