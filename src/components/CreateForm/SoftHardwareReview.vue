<template>
  <div class="Layout">
    <!-- <h2>软硬件进度review组件</h2> -->
    <!-- 头部区域 -->
    <div class="titleStyle">
      <span>项目名称：</span>
      {{projectName}}
      <!-- 添加一个间距 -->
      <span style="margin-right:10px"></span>
      <span>项目编号：</span>
      {{projectNumber}}
      <span style="margin-right:10px"></span>
      <span>合同编号：</span>
      <!-- {{contractNum? contractNum : '--'}} -->
      <el-select size="mini" v-model="contractNum" placeholder="请选择" @change="contractChange">
        <el-option
          v-for="item in nkcontractNumberAry"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div style="float: right;margin-right: 10px;">
      <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
    </div>
    <div style="clear: right"></div>

    <!-- 表格内容区 -->
    <div class="content" :style="{maxHeight:browerHeight + 'px'} ">
      <el-table
        :default-expand-all="true"
        :header-cell-style="headerStyle"
        :row-style="{height:'50px'}"
        :cell-style="{padding:0}"
        border
        :data="saftHardList"
      >
        <!-- 表格数据 -->
        <el-table-column align="center" prop="projectMileStoneName" label="里程碑名称" width="100"></el-table-column>
        <el-table-column
          align="center"
          prop="subItemContractMoney"
          :formatter="formatSubItemContractMoney"
          label="分项合同额"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          :formatter="formatcompletePercentage"
          prop="completePercentage"
          label="完成百分比"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          :formatter="formatDeliverableAuditDeliverable"
          prop="auditDeliverable"
          width="70"
          label="是否审计文档"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="finishDate"
          width="110"
          :formatter="formatFinishDate"
          label="实际完成时间"
        ></el-table-column>
        <el-table-column align="center" prop="currentProblems" width="120" label="当前进展/问题">
          <template slot-scope="scope">
            <el-input type="textarea" v-model="scope.row.currentProblems" :rows="1"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="deliverableName" label="文档名称" width="110"></el-table-column>
        <el-table-column align="center" label="上传文档" width="160">
          <template slot-scope="{row}">
            <!-- 状态为 待审核2、审核通过的3 不可再上传文件 -->
            <div v-if="row.status == 2 || row.status == 3 || !row.id">
              <el-button size="mini" type="text" :disabled="true">选文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="primary" :disabled="true">上传</el-button>
            </div>
            <div v-else>
              <el-upload
                :ref="row.id"
                :file-list="row.fileList"
                action="#"
                :limit="1"
                :auto-upload="false"
              >
                <el-button
                  slot="trigger"
                  size="mini"
                  type="text"
                  :disabled="row.file_status"
                  @click="handleSelectFile(row)"
                >选文件</el-button>
                <el-button
                  style="margin-left: 10px;"
                  size="mini"
                  type="primary"
                  @click="submitUpload(row)"
                  :disabled="row.upload_status"
                >上传</el-button>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          width="80"
          :formatter="formatDeliverableStatus"
          label="文档状态"
        ></el-table-column>
        <el-table-column align="center" :show-overflow-tooltip="true" label="文件名">
          <template slot-scope="{row}">
            <!--进度条-->
            <div v-show="row.progress_status">
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="row.progress"
                status="success"
              ></el-progress>
            </div>
            <!--文档状态 status 0已上传 1未上传  2待审核  3审核通过  4驳回-->
            <span v-if="row.status != 1">
              <u>
                <a :href="row.file_url" target="_blank" style="color: dodgerblue">{{row.fileName}}</a>
              </u>
            </span>
            <span v-else>{{row.fileName}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  serverGetHttpMethod,
  serverPostHttpMethod,
  getDownLoadUrl,
  examineCTSubmit
} from "../../api/api";
import { mapState, mapActions } from "vuex";
import axios from "axios"; // 引入axios
let Base64 = require("js-base64").Base64; // 引入base64
export default {
  data() {
    return {
      // 软硬件进度表格数据
      saftHardList: [],
      projectName: "",
      projectNumber: "",
      contractNum: "",
      // 项目所属公司id
      companyId: "",
      // 项目所属公司名称
      companyName: "",
      // 项目经理id
      userId: "",
      browerHeight: window.innerHeight - 200,
      nkcontractNumberAry: [] //南康合同编号select
    };
  },

  created() {
    // this.$nextTick(()=>{
    this.initData();
    this.getSaftHardList();
    // })
  },
  // 计算属性
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },

  methods: {
    // 文档上传
    //选文件
    handleSelectFile(row) {
      row.upload_status = false; //上传按钮可点击
    },

    // 手动点击上传文件
    submitUpload(row) {
      // 权限控制项目经理才能上传
      if (this.userId !== this.userinfo.memberid) {
        this.$refs[row.id].clearFiles(); //清空文件列表
        return this.$message.warning("项目经理才能上传操作");
      }
      console.log(this.$refs[row.id].uploadFiles);
      //获取单行要上传的文件
      if (this.$refs[row.id].uploadFiles.length == 0) {
        return this.$message.warning("请选择文件");
      }
      this.uploadFile(row);
    },

    //抽取上传文件方法
    uploadFile(row) {
      var file = this.$refs[row.id].uploadFiles[0].raw; //要上传的文件（获取单行的数据）
      var fileSize = file.size / 1024 / 1024;
      if (fileSize > 50) {
        return this.$message.warning("请选择50M以下的文件");
      }

      this.$refs[row.id].clearFiles(); //清空文件列表
      // 点击上传按钮后，控制不可再点击
      row.upload_status = true;
      row.file_status = true;
      row.progress_status = true; //显示进度条
      row.fileName = "上传中....";
      let param = new FormData();
      param.append("file", file);
      param.append("projectName", this.projectName);
      param.append("id", row.id);
      //新需求 从项目信息中获取公司信息
      param.append("company", this.companyName);
      //新需求 新增字段
      param.append("uploadPeople", this.userinfo.memberid); //上传人id
      param.append("projectNumber", this.projectNumber); //项目编号
      //新需求 实现上传进度条
      var config = {
        onUploadProgress: progressEvent => {
          var complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          if (complete < 100) {
            row.progress = complete;
          }
        }
      };
      //V2 实现进度条
      var uploadUrl = getDownLoadUrl(
        "/sgpm/rest/api/server/pm/project/deliverable/soft/hard/upload"
      );
      axios.post(uploadUrl, param, config).then(response => {
        if (response.data.code == 200) {
          row.progress = 100;
          // this.$message.success("文档上传成功");
          //局部更新数据
          row.fileName = file.name;
          row.status = 0; // 1未上传 0已上传  2待审核   3审核通过  4驳回
          row.file_url = this.get_download_file_url(row);
          // 提交文档审批
          this.submitFileAudit(row);
        } else {
          this.$message.error("文档上传失败");
        }
        row.upload_status = true; //上传按钮不可点击
        row.progress = 0; //上传进度恢复0
        row.progress_status = false; //隐藏进度条
      });
    },

    // 提交文档审核
    submitFileAudit(row) {
      var obj = {
        deliverableId: row.id,
        username: Base64.encode(this.userinfo.login_name),
        projectNumber: this.projectNumber
      };
      examineCTSubmit(
        "/sgpm/rest/api/integration/oa/deliverable/soft/hard/flow",
        obj
      )
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("提交审批流程成功");
            row.status = 2; // 1未上传 0已上传  2待审核   3审核通过  4驳回
            row.file_status = true; //选文件按钮不可点击
          } else {
            this.$message.error("提交审批流程失败");
            row.file_status = false; //选文件按钮可点击
            row.status = 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取文件下载的url
    get_download_file_url(del) {
      //新需求 从项目信息中获取公司信息
      var company = this.companyName;
      var file_url =
        getDownLoadUrl(
          "/sgpm/rest/api/server/pm/project/deliverable/soft/hard/download?id="
        ) +
        del.id +
        "&company=" +
        company;
      return file_url;
    },

    // 初始化参数
    initData() {
      var projectData = JSON.parse(window.localStorage.getItem("projectData"));
      if (projectData) {
        // this.contractNum = projectData.CONTRACTNUMBER;
        this.projectName = projectData.PROJECTNAME;
        this.projectNumber = projectData.PROJECTNUMBER;
        this.companyId = projectData.company_id;
        this.companyName = projectData.company_name;
        this.userId = projectData.user_id;
        let numbers = projectData.contractNumber;
        if (numbers) {
          numbers = numbers.split(",");
          let aryNum = [];
          numbers.forEach((item, index) => {
            aryNum.push(
              Object.assign(
                {},
                {
                  value: item,
                  label: item
                }
              )
            );
          }); //南康里程碑选择合同
          this.nkcontractNumberAry = aryNum;
          this.contractNum = aryNum[0].label; //合同编号
        }
      }
    },
    // 完成百分比 值变化触发函数
    // completePercentageChange(row) {
    //   if (row.completePercentage == 100) {
    //     row.finishDate = this.util.getNowDate();
    //   } else {
    //     row.finishDate = "";
    //   }
    // },
    // 保存
    handleSave() {
      if (!this.contractNum) {
        return this.$message.warning("合同未签约暂不能保存");
      }
      // 权限控制项目经理才能保存
      if (this.userId !== this.userinfo.memberid) {
        return this.$message.warning("项目经理才能保存操作");
      }
      // 没数据时不能保存
      if (this.saftHardList.length == 0) {
        return this.$message.warning("没数据暂不能保存");
      }

      // 进行保存操作
      serverPostHttpMethod(
        "/sgpm/rest/api/server/pm/project/sh",
        this.saftHardList
      )
        .then(res => {
          if (res.data.code !== 200) return this.$message.error("保存数据失败");
          this.$message.success("保存成功");
          this.getSaftHardList();
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 完成百分比 转换
    formatcompletePercentage(row) {
      return row.completePercentage + "%";
    },
    // 实际完成时间 转换
    formatFinishDate(row) {
      return row.finishDate == "" ? "--" : row.finishDate;
    },
    // 分项合同额 保留1位小数
    formatSubItemContractMoney(row) {
      return row.subItemContractMoney.toFixed(1);
    },
    // 是否审计文档 转换
    formatDeliverableAuditDeliverable(row) {
      switch (row.auditDeliverable) {
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
        default:
          return "--";
      }
    },
    // 文档状态转换 // 1未上传 2待审核   3审核通过  4驳回
    formatDeliverableStatus(row) {
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
    },

    // 获取表格数据
    getSaftHardList() {
      this.saftHardList = [];
      var params = { contractNum: this.contractNum };
      serverGetHttpMethod(
        `/sgpm/rest/api/server/pm/project/sh/${this.companyId}/${this.projectNumber}`,
        params
      )
        .then(res => {
          if (res.data.data === null) {
            // return this.$message.error("软硬件进度Review获取数据失败");
            return;
          }
          var data = res.data.data;
          // 处理返回的数据添加字段
          data.forEach(item => {
            item["file_status"] = false; //选文件按钮默认可用
            item["progress_status"] = false; //控制进度条显示 默认false不显示
            item["upload_status"] = true; //上传按钮默认禁用
            item["fileList"] = []; //上传文件列表 新增字段
            item["progress"] = 0; //上传文件列表 新增字段  上传进度条
            // 添加文档下载路径
            if (item.fileName) {
              item["file_url"] = this.get_download_file_url(item);
            }
          });

          this.saftHardList = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    contractChange(val) {
      this.contractNum = val;
      this.getSaftHardList();
    },
    // 表头样式
    headerStyle() {
      return {
        fontSize: "14px",
        color: "#303133",
        height: "51px",
        padding: 0,
        backgroundColor: "#ccd1d5"
      };
    }
  }
};
</script>
<style scoped>
/* 整体添加一个内边距 */
.Layout {
  padding-left: 10px;
}
/* 表头样式 */
.titleStyle {
  margin-bottom: 10px;
  float: left;
  font-size: 14px;
  font-weight: bold;
}
.titleStyle span {
  font-size: 10px;
  color: #909399;
}
/* 内容取样式 */
.content {
  overflow-y: auto;
  width: 100%;
}
</style>