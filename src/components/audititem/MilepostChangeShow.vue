<template>
  <div>
    <!-- <h2>里程碑变更查看页面</h2> -->
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/audititem' }">审批列表</el-breadcrumb-item>
      <el-breadcrumb-item>里程碑变更详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="height:10px;background:#ECF0F5"></div>

    <!-- 字段显示区域 -->
    <div class="titleStyle" style="margin-top:10px;margin-bottom:20px;margin-left:5px">
      <span class="Title">项目名称：</span>
      <span class="Value">{{projectName}}</span>

      <span class="Title">项目编号：</span>
      <span class="Value">{{projectNumber}}</span>

      <span class="Title">版本号：</span>
      <span class="Value">{{versionNumber}}</span>
    </div>
    <div style="clear:left"></div>

    <!-- 表格区域 -->
    <!-- 新里程碑 -->
    <h3 style="margin-bottom:10px;margin-left:5px">新里程碑模板：{{ArrayTempName}}</h3>
    <el-table
      border
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'50px'}"
      :cell-style="{padding:0}"
      :data="milestoneArray"
      style="width: 100%;margin-bottom:20px"
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
              <el-table-column label="交付物名称" :show-overflow-tooltip="true" prop="deliverableName">
                <template slot-scope="{row}">
                  <span v-if="row.filePath == '' || row.filePath == null ">{{row.deliverableName}}</span>
                  <span v-else>
                    <u>
                      <a
                        :href="row.file_url"
                        target="_blank"
                        style="color: dodgerblue"
                      >{{row.deliverableName}}</a>
                    </u>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="交付物描述" prop="description"></el-table-column>

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

              <el-table-column label="是否可裁剪" align="center" :formatter="formatisCut" prop="isCut"></el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="stageName" label="阶段名称"></el-table-column>
      <el-table-column align="center" prop="milestoneName" label="里程碑名称"></el-table-column>
      <el-table-column
        align="center"
        width="100"
        :formatter="formatprogressPercentage"
        prop="progressPercentage"
        label="对应百分比"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="isCut"
        width="100"
        :formatter="formatisCut"
        label="是否可裁剪"
      ></el-table-column>
      <el-table-column align="center" width="130" prop="estimatedStartDate" label="预计开始时间"></el-table-column>
      <el-table-column align="center" width="130" prop="estimatedFinishDate" label="预计完成时间"></el-table-column>
      <el-table-column align="center" width="80" prop="estimatedWorkingHours" label="预计工时(人月)"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="description" label="里程碑描述"></el-table-column>
    </el-table>

    <!-- 原里程碑 -->
    <h3 style="margin-bottom:10px;margin-left:5px">原里程碑模板：{{UsedTempName}}</h3>
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
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { serverGetHttpMethod } from "../../api/api.js"; //
export default {
  data() {
    return {
      milestoneArray: [],
      milestoneUsed: [],
      projectName: "",
      projectNumber: this.$route.query.projectNum,
      gtItemStatus: false, //配置国图显示的字段
      versionNumber: "", //版本号
      ArrayTempName: "",
      UsedTempName: ""
    };
  },
  created() {
    this.getTableData();
    //新需求 国图 显示 是否合同交付物字段
    if (this.userinfo.account_id == "-1814768306395265967") {
      this.gtItemStatus = true;
    } else {
      this.gtItemStatus = false;
    }
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  methods: {
    getTableData() {
      var url = "/sgpm/rest/api/server/milestone/change";
      var params = { projectNumber: this.projectNumber };
      serverGetHttpMethod(url, params)
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.milestoneArray = res.data.data.milestoneArray;
            this.milestoneUsed = res.data.data.milestoneUsed;
            this.projectName = res.data.data.projectName;
            this.versionNumber = res.data.data.versionNumber;
            this.ArrayTempName =
              res.data.data.milestoneArray[0].milestoneTemplateName;
            this.UsedTempName =
              res.data.data.milestoneUsed[0].milestoneTemplateName;
          } else {
            this.$message.error("获取数据失败");
          }
        })
        .catch(err => {
          console.log(err);
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
<style lang="scss" scoped>
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
</style>>

