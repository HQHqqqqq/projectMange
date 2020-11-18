<template>
  <div>
    <!-- <h2>里程碑变更编辑页面</h2> -->
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/audititem' }">审批列表</el-breadcrumb-item>
      <el-breadcrumb-item>里程碑变更编辑页</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:10px;background:#ECF0F5"></div>

    <!-- 字段显示区域 -->
    <div class="titleStyle" style="margin-top:10px;margin-bottom:0px;margin-left:5px">
      <span class="Title">项目名称：</span>
      <span class="Value">{{projectName}}</span>

      <span class="Title">项目编号：</span>
      <span class="Value">{{projectNumber}}</span>
    </div>
    <div style="clear:left"></div>

    <!-- 里程碑选择组件 -->
    <project-milestone
      @milepostChangeStatus="getMilepostChangeStatus"
      ref="projectMilestone"
      :datas="configDatas"
    ></project-milestone>

    <div style="margin-top:20px">
      <div style="float:left;margin-top:8px">
        <span style="color:red">*</span>变更说明
      </div>
      <div style="float:left;width:90%;margin-left:10px">
        <el-input v-model="changeReason" placeholder="请输入变更说明"></el-input>
      </div>
      <div style="clear: left"></div>
    </div>

    <!-- 表格区域 -->
    <!-- 原里程碑 -->
    <h3 style="margin-bottom:10px;margin-top:10px;margin-left:5px">原里程碑模板：{{UsedTempName}}</h3>
    <el-table
      border
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}"
      :cell-style="{padding:0}"
      :data="milestoneUsed"
      style="width: 100%"
    >
      <!-- 子表格 数据 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <div
            style="border: 1px solid #ecf0f5;margin-left: -50px;margin-top: -20px;background: #ecf0f5;"
          >
            <el-table
              :data="props.row.deliverable"
              border
              :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
              :row-style="{height:'50px'}"
              :cell-style="{padding:0}"
              style="width: 100%;margin-left: -2px;margin-top: 20px;margin-bottom: 20px;"
            >
              <el-table-column
                label="交付物名称"
                :show-overflow-tooltip="true"
                align="center"
                prop="deliverableName"
              >
                <template slot-scope="{row}">
                  <!--erp中交付物，只显示交付物文件名，不提供下载，新的数据提供模板下载-->
                  <!--添加模板下载url-->
                  <span v-if="row.isDownload == 1">
                    <u>
                      <a
                        :href="row.template_file_url"
                        target="_blank"
                        style="color: dodgerblue"
                      >{{row.deliverableName}}</a>
                    </u>
                  </span>
                  <span v-else>{{row.deliverableName}}</span>
                </template>
              </el-table-column>

              <el-table-column label="状态" align="center" :formatter="formatstatus" prop="status"></el-table-column>

              <el-table-column
                v-if="gtItemStatus"
                label="是否合同交付物"
                width="80"
                align="center"
                :formatter="formatcontractDeliverable"
                prop="contractDeliverable"
              ></el-table-column>

              <el-table-column
                label="是否审计文档"
                align="center"
                :formatter="formatauditDeliverable"
                prop="auditDeliverable"
              ></el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                label="文件名"
                align="center"
                width="150"
                prop="file_name"
              >
                <template slot-scope="{row}">
                  <!--交付物状态 status 1 未上传  2 待审核  3 审核通过  4 驳回-->
                  <span v-if="row.status != 1">
                    <u>
                      <a
                        :href="row.file_url"
                        target="_blank"
                        style="color: dodgerblue"
                      >{{row.file_name}}</a>
                    </u>
                  </span>
                  <span v-else>{{row.file_name}}</span>
                </template>
              </el-table-column>

              <el-table-column :show-overflow-tooltip="true" label="交付物描述" prop="description"></el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="stageName" label="阶段名称"></el-table-column>
      <el-table-column align="center" width="100" prop="milestoneName" label="里程碑名称"></el-table-column>
      <el-table-column
        align="center"
        :formatter="formatprogressPercentage"
        width="80"
        prop="progressPercentage"
        label="累计进度"
      ></el-table-column>
      <el-table-column
        align="center"
        :formatter="formataccumulatedProgress"
        width="100"
        prop="accumulatedProgress"
        label="完成百分比"
      ></el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="status"
        :formatter="formatStatus"
        label="当前状态"
      ></el-table-column>
      <el-table-column align="center" prop="finishDate" label="实际完成时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="currentProblems" label="当前进展/问题"></el-table-column>
      <el-table-column align="center" prop="estimatedStartDate" label="预计开始时间"></el-table-column>
      <el-table-column align="center" prop="estimatedFinishDate" label="预计完成时间"></el-table-column>
      <el-table-column align="center" width="80" prop="estimatedWorkingHours" label="预计工时(人月)"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="description" label="里程碑描述"></el-table-column>
    </el-table>

    <div style="text-align: center;margin-top: 20px">
      <el-button
        :loading="changeBtnloading"
        type="primary"
        size="mini"
        @click="milepostChangeSubmit"
      >提交</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { serverGetHttpMethod, serverPostHttpMethod } from "../../api/api.js"; //
import ProjectMilestone from "../../components/CreateForm/ProjectMilestone"; // 引入里程碑选择组件
import Bus from "../../bus";
export default {
  data() {
    return {
      id: "", // 里程碑变更id
      classUnitBId: "",
      classUnitCId: "",
      MilepostChangeStatus: false, // 区分更新还是重新添加 true为添加操作
      milestoneArray: [],
      milestoneUsed: [],
      projectName: "",
      changeBtnloading: false, // 变更页面确定按钮样式
      projectNumber: this.$route.query.projectNum,
      //   projectNumber: "RJ-H-2020-0102",
      gtItemStatus: false, //配置国图显示的字段
      changeReason: "",
      UsedTempName: "", // 原里程碑模板名称
      // 里程碑选择组件配置参数
      configDatas: {
        options: {
          switch: {
            head: true,
            sonSelect: true,
            isContractDeliverable: true,
            sonSelect: true,
            time3: false,
            workHours: true
          }
        }
      }
    };
  },
  created() {
    this.getTableData();
    //新需求 国图 显示 是否合同交付物字段
    if (this.userinfo.account_id == "-1814768306395265967") {
      this.gtItemStatus = true;
      this.configDatas.options.switch.isContractDeliverable = true;
    } else {
      this.gtItemStatus = false;
      this.configDatas.options.switch.isContractDeliverable = false;
    }
  },
  components: {
    ProjectMilestone
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  methods: {
    getMilepostChangeStatus(msg) {
      this.MilepostChangeStatus = msg;
    },
    getTableData() {
      var url = "/sgpm/rest/api/server/milestone/change";
      var params = { projectNumber: this.projectNumber };
      serverGetHttpMethod(url, params)
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.id = res.data.data.id; // id 更新使用
            this.milestoneArray = res.data.data.milestoneArray;
            this.milestoneUsed = res.data.data.milestoneUsed;
            this.projectName = res.data.data.projectName;
            this.versionNumber = res.data.data.versionNumber;
            // this.ArrayTempName =
            //   res.data.data.milestoneArray[0].milestoneTemplateName;
            this.UsedTempName =
              res.data.data.milestoneUsed[0].milestoneTemplateName; // 原里程碑模板名称
            this.changeReason = res.data.data.changeDescription; // 获取上次变更原因
            this.classUnitBId = res.data.data.classUnitBId;
            this.classUnitCId = res.data.data.classUnitCId;
            // 将数据用Bus发送到里程碑组件
            Bus.$emit("milestoneArray", res.data.data.milestoneArray);
          } else {
            this.$message.error("获取数据失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 里程碑变更确定操作
    milepostChangeSubmit() {
      var MilestoneParams = JSON.parse(localStorage.getItem("MilestoneParams"));
      if (!MilestoneParams) {
        return this.$message.warning("请选一个里程碑模板");
      }
      var flag = this.$refs.projectMilestone.checkMilestoneParams(
        MilestoneParams
      );
      if (!flag) {
        return this.$message.warning("请填写全部里程碑数据");
      }
      if (!this.changeReason) {
        return this.$message.warning("请填写变更原因");
      }
      console.log(MilestoneParams);
      console.log(this.changeReason);
      this.changeBtnloading = true;
      // 封装参数
      var data = {};
      // 更新时添加id参数，重新添加时不加id参数 MilepostChangeStatus:true是重新添加 false 更新
      if (!this.MilepostChangeStatus) {
        data.id = this.id; // id 更新使用
      }
      data.projectNumber = this.projectNumber;
      data.projectName = this.projectName;
      data.classUnitBId = this.classUnitBId; // 项目的实施B级部门id
      data.classUnitCId = this.classUnitCId; // 项目的实施C级部门id
      data.username = this.userinfo.login_name; // 登录人的
      data.companyId = this.userinfo.account_id; // 登录人的
      data.changeDescription = this.changeReason;
      var milestoneArray = []; // 新里程碑
      MilestoneParams.forEach(item => {
        if (item.deliverableStatus) {
          var hash = {};
          hash["stageName"] = item.stageName;
          hash["milestoneName"] = item.milestoneName;
          hash["estimatedStartDate"] = item.expectedBeginTime;
          hash["estimatedFinishDate"] = item.expectedEndTime;
          hash["estimatedWorkingHours"] = item.workHours;
          hash["progressPercentage"] = item.progressPercentage; // 对应百分比
          hash["sortIndex"] = 1.0;
          hash["isCut"] = item.isCut;
          hash["status"] = 0;
          hash["description"] = item.description;
          hash["milestoneTemplateName"] = item.milestoneTemplateName; // 模板名称
          hash["milestoneTemplateId"] = item.milestoneTemplateId; // 模板id
          //交付物
          var deliverable = [];
          item.deliverable.forEach(del => {
            if (del.checkedStatus) {
              var ha = {};
              ha["deliverableName"] = del.deliverableName;
              ha["isCut"] = del.isCut;
              ha["auditDeliverable"] = del.auditDeliverable; //新增字段 是否审计
              ha["deliverableTemplateId"] = del.deliverableId; //交付物模板id 新增字段
              //国图新增字段
              ha["contractDeliverable"] = del.contractDeliverable; //是否合同交付物
              ha["description"] = del.description;
              ha["status"] = 1; //交付物状态  1未上传  2待审核   3审核通过  4驳回
              // 添加文件能否下载链接
              ha["fileName"] = del.fileName;
              ha["filePath"] = del.filePath;
              ha["file_url"] = del.file_url;
              deliverable.push(ha);
            }
          });
          hash["deliverable"] = deliverable;
          milestoneArray.push(hash);
        }
      });

      var milestoneUsed = []; // 原里程碑
      this.milestoneUsed.forEach(item => {
        var hash = {};
        hash["stageName"] = item.stageName;
        hash["milestoneName"] = item.milestoneName;
        hash["estimatedStartDate"] = item.expectedBeginTime;
        hash["estimatedFinishDate"] = item.expectedEndTime;
        hash["estimatedWorkingHours"] = item.workHours;
        hash["currentProblems"] = item.currentProblems;
        hash["progressPercentage"] = item.progressPercentage; // 累计进度
        hash["accumulatedProgress"] = item.accumulatedProgress; // 完成百分比
        hash["isCut"] = item.isCut;
        hash["status"] = item.status;
        hash["description"] = item.description;
        hash["finishDate"] = item.finishDate == "--" ? "" : item.finishDate;
        hash["milestoneTemplateName"] = item.milestoneTemplateName; // 模板名称
        hash.deliverable = item.deliverable;
        milestoneUsed.push(hash);
      });

      data.milestoneArray = milestoneArray;
      data.milestoneUsed = milestoneUsed;
      console.log(data);

      // 调接口
      var url = "/sgpm/rest/api/server/milestone/change";
      serverPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("提交成功");
            this.$router.push("/audititem");
          } else {
            this.$message.error("提交失败");
          }
          this.changeBtnloading = false;
          this.milepostChangedialogVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.changeBtnloading = false;
          this.milepostChangedialogVisible = false;
        });
    },
    // 累计进度/对应百分比 转换
    formatprogressPercentage(row) {
      return row.progressPercentage + "%";
    },
    // 完成百分比 转换
    formataccumulatedProgress(row) {
      return row.accumulatedProgress + "%";
    },
    //转换字段数据 1 可裁剪  0 不可裁剪
    formatisCut(row, column) {
      switch (row.isCut) {
        case 1:
          return "是";
          break;
        case 0:
          return "否";
          break;
        default:
          return "未知";
      }
    },
    //是否审计文档 转换
    formatauditDeliverable(row) {
      switch (row.auditDeliverable) {
        case "0":
          return "否";
          break;
        case "1":
          return "是";
          break;
        default:
          return "否";
      }
    },

    //是否合同交付物转换
    formatcontractDeliverable(row) {
      switch (row.contractDeliverable) {
        case "0":
          return "否";
          break;
        case "1":
          return "是";
          break;
        default:
          return "否";
      }
    },

    // 里程碑当前状态转换 // 0未完成 1进行中  2已完成
    formatStatus(row) {
      switch (row.status) {
        case 0:
          return "未完成";
          break;
        case 1:
          return "进行中";
          break;
        case 2:
          return "已完成";
          break;
        default:
          return "未知";
      }
    },

    // 交付物状态转换 // 1未上传 2待审核   3审核通过  4驳回
    formatstatus(row) {
      switch (row.status) {
        case 1:
          return "未上传";
          break;
        case 0:
          return "已上传";
          break;
        case 2:
          return "待审核";
          break;
        case 3:
          return "审核通过";
          break;
        case 4:
          return "驳回";
          break;
        default:
          return "未知";
      }
    }
  }
};
</script>
<style  scoped>
.el-breadcrumb {
  margin-bottom: 10px;
  margin-left: 5px;
  margin-top: 10px;
}
/* 表头样式 */
.titleStyle {
  float: left;
  font-size: 14px;
  font-weight: bold;
}
.Title {
  font-size: 12px;
  color: #909399;
}
.Value {
  margin-right: 10px;
  font-size: 14px;
}
</style>
