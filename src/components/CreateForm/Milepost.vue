<template>
  <div class="Layout">
    <!--里程碑进度Review 里程碑单独组件页面-->

    <!-- 头部区域 -->
    <div class="titleStyle">
      <span class="Title">项目名称：</span>
      <span class="Value">{{projectName}}</span>

      <span class="Title">项目编号：</span>
      <span class="Value">{{projectNumber}}</span>

      <span class="Title" v-if="isContractProject">合同编号：</span>
      <span class="Value" v-if="isContractProject">{{contractNum}}</span>
    </div>

    <!-- 南康显示累计合同额 其他显示合同额 -->
    <div class="titleStyle" v-if="this.userinfo.account_id != '8416498716893399290'">
      <span class="Title" v-if="isContractProject">合同额：</span>
      <span class="Value" v-if="isContractProject">{{value1}} 万元</span>
    </div>
    <div class="titleStyle" v-else>
      <span class="Title" v-if="isContractProject">累计合同额：</span>
      <span class="Value" v-if="isContractProject">{{value1}} 万元</span>
    </div>

    <div class="titleStyle" v-if="this.userinfo.account_id != '8416498716893399290'">
      <span class="Title" v-if="isContractProject">回款额：</span>
      <span class="Value" v-if="isContractProject">{{value2}} 万元</span>
    </div>
    <div class="titleStyle" v-else>
      <span class="Title" v-if="isContractProject">累计回款额：</span>
      <span class="Value" v-if="isContractProject">{{value2}} 万元</span>
    </div>

    <div class="titleStyle">
      <span class="Title" v-if="isContractProject">回款率：</span>
      <span class="Value" v-if="isContractProject">{{value3}}</span>
    </div>

    <div class="titleStyle">
      <span class="Title" v-if="!isContractProject">项目预算：</span>
      <span class="Value" v-if="!isContractProject">{{projectBudget}} 万元</span>
    </div>

    <div class="titleStyle">
      <span class="Title">完成进度：</span>
      <span class="Value">{{currentProgress}}%</span>
    </div>

    <div class="titleStyle">
      <span class="Title">最近review时间：</span>
      <span class="Value">{{reviewtime}}</span>
    </div>

    <div class="titleStyle">
      <span class="Title" v-if="projectValueStatus">项目经费：</span>
      <span class="Value" v-if="projectValueStatus">{{resolution}} 万元</span>
    </div>

    <!-- 按钮操作区域 -->
    <div style="float: right;margin-right: 10px;margin-bottom: 5px">
      <!-- 里程碑变更按钮 && !isChange -->
      <el-button
        v-if="changeBtnShow"
        :disabled="!(!changeBtnStatus && manageStatus && !isChange)"
        type="primary"
        size="mini"
        @click="milepostChangedialogVisible=true"
      >里程碑变更</el-button>

      <!-- 南康历史数据里程碑添加 -->
      <el-button
        v-if="addBtnShow"
        :disabled="!addBtnStatus"
        type="primary"
        size="mini"
        @click="milepostAddialogVisible=true"
      >里程碑添加</el-button>

      <!-- 配置表单字段显示按钮 -->
      <el-popover placement="bottom" width="200" trigger="click" class="popover">
        <el-checkbox v-if="projectValueStatus" v-model="gtItemStatus" class="popover-checkbox">里程碑产值</el-checkbox>
        <el-checkbox v-model="row2" class="popover-checkbox">累计进度</el-checkbox>
        <el-checkbox v-model="row3" class="popover-checkbox">完成百分比</el-checkbox>
        <el-checkbox v-model="row4" class="popover-checkbox">当前状态</el-checkbox>
        <el-checkbox v-model="row41" class="popover-checkbox">当前进展/问题</el-checkbox>
        <el-checkbox v-model="row5" class="popover-checkbox">预计开始时间</el-checkbox>
        <el-checkbox v-model="row6" class="popover-checkbox">预计结束时间</el-checkbox>
        <el-checkbox v-model="row7" class="popover-checkbox">实际完成时间</el-checkbox>
        <el-checkbox v-model="row8" class="popover-checkbox">延期天数</el-checkbox>
        <el-checkbox v-model="row9" class="popover-checkbox">预计工时</el-checkbox>
        <el-checkbox v-model="row10" class="popover-checkbox">实际工时</el-checkbox>
        <el-checkbox v-model="row11" class="popover-checkbox">工时偏差</el-checkbox>
        <el-checkbox v-model="row12" class="popover-checkbox">里程碑描述</el-checkbox>
        <el-button
          type="primary"
          icon="el-icon-menu"
          slot="reference"
          circle
          size="mini"
          class="circle-menu btn-left"
        ></el-button>
      </el-popover>
    </div>
    <div style="clear:right"></div>

    <!-- 里程碑变更弹出框页面 -->
    <el-dialog title="里程碑变更" v-dialogDrag :visible.sync="milepostChangedialogVisible" width="90%">
      <div style="margin-top:-40px">
        <project-milestone ref="projectMilestone" :datas="configDatas"></project-milestone>
      </div>

      <div style="margin-top:20px">
        <div style="float:left;margin-top:8px">
          <span style="color:red">*</span>变更说明
        </div>
        <div style="float:left;width:90%;margin-left:10px">
          <el-input v-model="changeReason" placeholder="请输入变更说明"></el-input>
        </div>
        <div style="clear: left"></div>
      </div>

      <div style="text-align: center;margin-top: 20px">
        <el-button size="mini" @click="milepostChangedialogVisible = false">取 消</el-button>
        <el-button
          :loading="changeBtnloading"
          type="primary"
          size="mini"
          @click="milepostChangeSubmit"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 里程碑添加弹出框页面 -->
    <el-dialog title="里程碑添加" v-dialogDrag :visible.sync="milepostAddialogVisible" width="90%">
      <div style="margin-top:-40px">
        <project-milestone ref="projectMilestone" :datas="configDatas"></project-milestone>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button size="mini" @click="milepostAddialogVisible = false">取 消</el-button>
        <el-button
          :loading="changeBtnloading"
          type="primary"
          size="mini"
          @click="milepostAddSubmit"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!--:default-expand-all="true" 默认展开子表格 -->
    <!-- 表格区域 -->
    <div>
      <el-table
        :data="tableData"
        v-loading="loading"
        ref="rowData"
        :row-key="getRowKeys"
        :expand-row-keys="rowExpands"
        @expand-change="expandChange"
        border
        @current-change="handleSelectionChange"
        :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
        :row-style="{height:'50px'}"
        :cell-style="{padding:0}"
        :span-method="objectSpanMethod"
        :default-expand-all="false"
        :height="browerHeight"
        style="width: 100%"
      >
        <el-table-column label="阶段名称" v-if="row1" width="100" align="center" prop="stageName"></el-table-column>

        <!-- 子表格 数据 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <!--子表格添加背景颜色-->
            <div
              style="border: 1px solid #ecf0f5;margin-left: -50px;margin-top: -20px;background: #ecf0f5;"
            >
              <el-table
                :data="props.row.deliverable"
                border
                :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
                :row-style="{height:'50px'}"
                :cell-style="{padding:0}"
                style="width: 50%;margin-left: -2px;margin-top: 20px;margin-bottom: 20px;"
                ref="sonData"
              >
                <el-table-column
                  label="交付物名称"
                  :show-overflow-tooltip="true"
                  align="center"
                  width="150"
                  prop="deliverableName"
                >
                  <template slot-scope="{row}">
                    <!--erp中交付物，只显示交付物文件名，不提供下载，新的数据提供模板下载-->
                    <!--<span>{{row.deliverableName}}</span>-->
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

                <el-table-column label="上传附件" width="160" align="center" fixed-width>
                  <template slot-scope="{row}">
                    <!--<div-->
                    <!--v-if="(!props.row.statusSelectData.selectStatus || props.row.status == 2) && (memberStatus || manageStatus || !props.row.file_status)">-->
                    <!--<el-upload class="upload-demo" :ref="row.deliverableId" :file-list="row.fileList" action="#"-->
                    <!--:limit="1" :on-change="handleChange" :on-remove="handleRemove" :on-success="handleAvatarSuccess"-->
                    <!--:auto-upload="false">-->
                    <!--<i class="el-icon-upload"></i>-->
                    <!--<el-button slot="trigger" size="mini" type="text" :disabled="row.file_status"-->
                    <!--@click="handleSelectFile(row)">选文件-->
                    <!--</el-button>-->
                    <!--<el-button style="margin-left: 10px;" size="mini" type="primary" @click="submitUpload(row)"-->
                    <!--:disabled="row.upload_status">上传-->
                    <!--</el-button>-->
                    <!--</el-upload>-->
                    <!--</div>-->
                    <!--V2新需求：根据交付物状态判断  v-if="!props.row.statusSelectData.selectStatus && (memberStatus || manageStatus) && !row.file_status"
                    -->
                    <div
                      v-if="!props.row.statusSelectData.selectStatus && (memberStatus || manageStatus) && !row.file_status"
                    >
                      <el-upload
                        class="upload-demo"
                        :ref="row.deliverableId"
                        :file-list="row.fileList"
                        action="#"
                        :limit="1"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :on-success="handleAvatarSuccess"
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
                          v-if="row.status === 3"
                          style="margin-left: 10px;"
                          size="mini"
                          type="primary"
                          icon="el-icon-refresh-left"
                          @click="submitUpload(row)"
                          :disabled="row.upload_status"
                        >更新</el-button>
                        <el-button
                          v-else
                          style="margin-left: 10px;"
                          size="mini"
                          type="primary"
                          icon="el-icon-upload2"
                          @click="submitUpload(row)"
                          :disabled="row.upload_status"
                        >上传</el-button>
                      </el-upload>
                    </div>
                    <div v-else>
                      <el-button size="mini" type="text" :disabled="true">选文件</el-button>
                      <el-button
                        style="margin-left: 10px;"
                        size="mini"
                        icon="el-icon-upload2"
                        type="primary"
                        :disabled="true"
                      >上传</el-button>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  width="70"
                  label="状态"
                  align="center"
                  :formatter="formatstatus"
                  prop="status"
                ></el-table-column>

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
                  width="70"
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
                    <!--进度条-->
                    <div v-show="row.progress_status">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="15"
                        :percentage="row.progress"
                        status="success"
                      ></el-progress>
                    </div>

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

        <!-- v-if=false 隐藏该列 -->
        <el-table-column label="里程碑id" v-if="false" width="100" prop="projectMilestoneId"></el-table-column>

        <el-table-column label="里程碑名称" v-if="row1" width="150" align="center" prop="milestoneName"></el-table-column>
        <el-table-column
          label="里程碑产值(万元)"
          v-if="gtItemStatus"
          width="110"
          align="center"
          :formatter="outValueFormat"
        ></el-table-column>

        <el-table-column label="里程碑权重" v-if="false" align="center" width="110" prop="weight"></el-table-column>

        <el-table-column
          label="累计进度(%)"
          v-if="row2"
          align="center"
          width="110"
          prop="progressPercentage"
        ></el-table-column>

        <el-table-column label="完成百分比(%)" v-if="row3" align="center" width="130">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.accumulatedProgress"
              style="width: 100px"
              controls-position="right"
              :disabled="scope.row.statusSelectData.selectStatus || (!manageStatus && memberStatus)"
              @change="handleAccumulatedProgress(scope.row)"
              :min="scope.row.minValue"
              :max="scope.row.maxValue"
              :step="10"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="当前状态" v-if="row4" align="center" width="120" prop="status">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.status"
              style="width: 90px"
              placeholder="请选择"
              @change="selectChange(scope.row)"
              :disabled="scope.row.statusSelectData.selectStatus || (!manageStatus && memberStatus)"
            >
              <el-option
                v-for="item in scope.row.statusSelectData.options"
                :key="item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="实际完成时间" v-if="row7" align="center" width="160" prop="finishDate">
          <template slot-scope="scope">
            <div v-if="remarksStatus && scope.row.milestoneName == '验收' && scope.row.status == 2 ">
              <el-date-picker
                style="width: 140px"
                v-model="scope.row.finish_date"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div v-else>{{scope.row.finishDate}}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="当前进展/问题"
          v-if="row41"
          align="center"
          width="200"
          prop="currentProblems"
        >
          <template slot-scope="scope">
            <el-input
              type="textarea"
              :rows="1"
              @change="textareaChange(scope.row)"
              v-model="scope.row.currentProblems"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="预计开始时间"
          v-if="row5"
          align="center"
          width="120"
          prop="estimatedStartDate"
        ></el-table-column>

        <el-table-column
          label="预计完成时间"
          v-if="row6"
          align="center"
          width="120"
          prop="estimatedFinishDate"
        ></el-table-column>

        <el-table-column label="延期天数" v-if="row8" align="center" prop="delayDays"></el-table-column>

        <el-table-column label="预计工时(人月)" v-if="row9" align="center" prop="estimatedWorkingHours"></el-table-column>

        <el-table-column label="实际工时(人月)" v-if="row10" align="center" prop="actualHours"></el-table-column>

        <el-table-column label="工时偏差(人月)" v-if="row11" align="center" prop="deviationHours"></el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="里程碑描述"
          v-if="row12"
          width="300"
          prop="description"
        ></el-table-column>
      </el-table>
    </div>

    <div style="text-align: center;margin-top: 30px">
      <div v-if="memberStatus || manageStatus">
        <el-button type="primary" size="mini" @click="handleSubmit">提交</el-button>
      </div>
      <div v-else>
        <el-button type="primary" size="mini" @click="handleSubmit" :disabled="true">提交</el-button>
      </div>
    </div>

    <div v-if="remarksStatus" class="remarks">注：请根据验收文档实际完成时间填写</div>
  </div>
</template>
<script>
import {
  serverPostHttpMethod,
  examineSubmit,
  examineCTSubmit
} from "../../api/api.js"; //
import { systemGetHttpMethod } from "../../api/api.js"; //
import { serverGetHttpMethod } from "../../api/api.js"; //
import { fileUpload } from "../../api/api.js"; //
import { getDownLoadUrl } from "../../api/api.js"; //
import { projectMsgById } from "../../api/api.js";
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
import axios from "axios"; // 引入axios
let Base64 = require("js-base64").Base64; // 引入base64
import ProjectMilestone from "./ProjectMilestone"; // 引入里程碑选择组件

export default {
  name: "milepost",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  data() {
    return {
      dialog1: false,
      dialog2: false,
      isContractProject: false, // 是否合同项目
      milepostChangedialogVisible: false, // 控制里程碑变更页面显示
      milepostAddialogVisible: false, // 控制里程碑添加页面显示
      changeBtnloading: false, // 变更页面确定按钮样式
      changeReason: "", // 变更原因
      projectBudget: "", // 项目预算（非合同项目）
      isChange: false, // 控制里程碑变更后不能再变更 true不能变更 false可以变更
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
      },

      fileUploadFiles: [], //记录所有的待上传文件
      fileUploadStatus: false, //文件是否上传完毕状态，未上传 离开页面提示
      gtItemStatus: false, //配置国图显示的字段
      remarksStatus: false, //控制提示文字的显示
      reviewtime: "--", //最近review时间
      submitStatus: false, //控制提交按钮,默认可编辑
      memberStatus: false, // 控制成员角色 true不可编辑进度，默认false是可编辑的
      manageStatus: false, //控制经理角色
      rowExpands: [], //默认展开的行
      // 获取row的key值，默认展开行使用
      getRowKeys(row) {
        return row.projectMilestoneId;
      },
      span1: [], //合并单元格 错位问题使用
      // 上传的文件
      file: {},
      // spanArr:[ 2, 0, 1],  //合并单元格   1 2 1 1 1 0
      // spanArr:[1,2,0,1,1,0],  //合并单元格
      spanArr: [], //合并单元格
      browerHeight: window.innerHeight - 300,
      dialogVisible: false,
      // projectNumber: 'RJ-H-2019-0006',
      projectNumber: "", //项目编号
      contractNum: "--", // 合同编号
      projectName: "", //项目名称
      currentProgress: 0, //当前进度
      value1: "--", //合同额
      value2: "--", //回款
      value3: "--", //回款率
      resolution: "--", // 项目经费
      checkAll: false,
      row1: true,
      row2: true,
      row3: true,
      row4: true,
      row41: true,
      row5: true,
      row6: true,
      row7: true,
      row8: true,
      row9: true,
      row10: true,
      row11: true,
      row12: true,
      isIndeterminate: true,

      //review 状态选择数据
      statusSelectData: {
        value: "",
        options: [
          { value: 0, label: "未完成" },
          { value: 1, label: "进行中" },
          { value: 2, label: "已完成" }
        ]
      },

      //规则
      rules: {
        milestoneName: [
          { required: true, message: "请填写里程碑名称", trigger: "change" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        progressPercentage: [
          { required: true, message: "请填写百分比", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请填写里程碑描述", trigger: "blur" }]
      },
      multipleSelection: [], //父表格 选中的数据

      //列表数据
      tableData: [], //表格数据从接口获取
      loading: true,
      expands: [] //展开行数据，控制展开单行使用
    };
  },

  components: {
    ProjectMilestone
  },

  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    // 超图显示里程碑变更按钮、其他子公司不显示
    changeBtnShow() {
      if (
        this.userinfo.account_id == "-1360422574114386809" ||
        this.userinfo.account_id == "5326994013938795629"
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 南康里程碑添加按钮 是否显示
    addBtnShow() {
      var re = /NK-[HN]-*-*-*/;
      var re_at = /AT-[HN]-*-*-*/;
      if (this.userinfo.account_id == "8416498716893399290") {
        if (re.test(this.projectNumber)) {
          return false;
        } else {
          return true;
        }
      } else if (this.userinfo.account_id == "7638091599462351621") {
        // 安图 历史数据 显示里程碑添加按钮
        if (re_at.test(this.projectNumber)) {
          return false; // 正常项目不显示
        } else {
          return true; // 历史数据显示
        }
      } else {
        return false;
      }
    },
    // 南康里程碑添加按钮 是否禁用（添加里程碑后禁用）
    addBtnStatus() {
      // 如果里程碑有数据 禁用
      if (this.tableData.length > 0) {
        return false;
      }
      // 添加正则验证，老项目显示，新项目不显示
      var re = /NK-[HN]-*-*-*/;
      var re_at = /AT-[HN]-*-*-*/;
      if (this.userinfo.account_id == "8416498716893399290") {
        if (re.test(this.projectNumber)) {
          return false;
        } else {
          return true;
        }
      } else if (this.userinfo.account_id == "7638091599462351621") {
        // 安图 历史数据 显示里程碑添加按钮
        if (re_at.test(this.projectNumber)) {
          return false; // 正常项目
        } else {
          return true; // 历史数据
        }
      } else {
        return false;
      }
    },
    changeBtnStatus() {
      // 非合同列表进入添加判断,非合同里程碑禁止变更
      if (
        localStorage.getItem("judgeproject") == "非合同项目信息" ||
        localStorage.getItem("jump_type") == "11"
      ) {
        return true;
      }

      // 没有里程碑时
      if (!this.tableData[0]) {
        return true;
      }
      // 有里程碑时
      if (
        this.tableData[0] &&
        this.tableData[0].accumulatedProgress == 100 &&
        this.tableData[0].status == 2
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 国图项目经费是否显示
    projectValueStatus() {
      if (this.userinfo.account_id == "-1814768306395265967") {
        return true;
      } else {
        return false;
      }
    }
  },

  created() {
    // 从全局变量中获取项目编号
    var storage = window.localStorage;
    this.projectNumber = storage.projectNumber;
    this.projectName = storage.projectName;
    this.projectId = storage.projectId;

    // 非合同项目添加判断
    if (
      localStorage.getItem("judgeproject") == "非合同项目信息" ||
      localStorage.getItem("jump_type") == "11"
    ) {
      this.isContractProject = false; // false非合同项目
    } else {
      this.isContractProject = true;
      this.getMoneyValues(); //从接口获取合同额、回款、回款率数据
    }

    this.getMemberData(this.projectId);
    this.getMileStoneDatas(); //从接口获取项目保存的里程碑信息
    this.getMemberRole(); //从接口获取角色信息
    this.getProjectMsg(this.projectId);

    //新需求 国图 显示 是否合同交付物字段
    if (this.userinfo.account_id == "-1814768306395265967") {
      this.gtItemStatus = true;
      this.configDatas.options.switch.isContractDeliverable = true;
    } else {
      this.gtItemStatus = false;
      this.configDatas.options.switch.isContractDeliverable = false;
    }

    //清除localStorage 中MilepostParams参数数据
    var params = JSON.parse(localStorage.getItem("MilepostParams"));
    if (params) {
      localStorage.removeItem("MilepostParams");
    }
  },

  //解决页面切换到项目信息后 再切换到里程碑页面时，切换项目不更新数据bug
  mounted() {
    // 切换项目后，更新里程碑信息
    Bus.$on("projectContent", item => {
      if (item) {
        this.projectNumber = item.projectNumber;
        this.projectName = item.projectName;
        this.projectId = item.id;

        // 非合同项目添加判断
        if (localStorage.getItem("judgeproject") == "非合同项目信息") {
          this.isContractProject = false; // false非合同项目
        } else {
          this.isContractProject = true;
          this.getMoneyValues(); //从接口获取合同额、回款、回款率数据
        }
        this.getMemberData(this.projectId);
        this.getMileStoneDatas(); //从接口获取项目保存的里程碑信息
        this.getMemberRole(); //从接口获取角色信息
        this.getProjectMsg(this.projectId);
      }
    });
  },

  methods: {
    //里程碑产值计算
    outValueFormat(row) {
      var outValue = 0;
      if (this.resolution !== "--") {
        outValue = (
          (this.resolution * row.weight * row.accumulatedProgress) /
          10000
        ).toFixed(2);
      }
      return outValue;
    },
    // 里程碑添加确定操作
    milepostAddSubmit() {
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
      this.changeBtnloading = true;
      // 封装参数
      var data = {};
      data["projectNumber"] = this.projectNumber; //项目编号
      var milestones = [];
      MilestoneParams.forEach(item => {
        if (item.deliverableStatus) {
          var hash = {};
          hash["milestoneName"] = item.milestoneName;
          hash["isCut"] = item.isCut;
          hash["progressPercentage"] = item.progressPercentage;
          hash["sortIndex"] = 1.0;
          hash["description"] = item.description;
          hash["milestoneTemplateName"] = item.milestoneTemplateName; //里程碑模板名称
          hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
          hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
          hash["finishDate"] = item.actualEndTime; //实际完成时间
          hash["estimatedWorkingHours"] = item.workHours; //预计工时
          hash["delayDays"] = item.delayDays; //延期天数
          hash["status"] = 0;
          hash["stageName"] = item.stageName; //阶段名称 新增字段
          hash["id"] = item.projectMilestoneId; //里程碑id 更新使用
          //交付物
          var deliverable = [];
          item.deliverable.forEach(del => {
            //根据交付物中checkedStatus状态 保存交付物
            if (del.checkedStatus) {
              var ha = {};
              ha["deliverableName"] = del.deliverableName;
              ha["isCut"] = del.isCut;
              ha["auditDeliverable"] = del.auditDeliverable; //新增字段 是否审计
              // 区分更新操作还是添加 有deliverableTemplateId 时为更新操作  否则为添加操作
              if (del["deliverableTemplateId"] == undefined) {
                //添加操作
                ha["deliverableTemplateId"] = del.deliverableId; //交付物模板id 新增字段
              } else {
                //更新操作
                ha["id"] = del.deliverableId;
              }
              //国图新增字段
              ha["contractDeliverable"] = del.contractDeliverable; //是否合同交付物
              ha["description"] = del.description;
              ha["status"] = 1; //交付物状态 1未上传  2待审核   3审核通过  4驳回
              deliverable.push(ha);
            }
          });
          hash["deliverable"] = deliverable;
          milestones.push(hash);
        }
      });
      data["milestones"] = milestones; //里程碑信息
      console.log(data);
      // 调接口
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      serverPostHttpMethod(url, data)
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message.success("添加成功");
            this.getMileStoneDatas(); //从接口获取项目保存的里程碑信息
          } else {
            this.$message.error("添加失败");
          }
          this.changeBtnloading = false;
          this.milepostAddialogVisible = false;
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
      var projectData = JSON.parse(localStorage.getItem("projectData"));
      data.projectNumber = this.projectNumber;
      data.projectName = this.projectName;
      data.classUnitBId = projectData.level_one_id; // 项目的实施B级部门id
      data.classUnitCId = projectData.level_two_id; // 项目的实施C级部门id
      data.username = this.userinfo.login_name; // 登录人的
      data.companyId = this.userinfo.account_id; // 登录人的
      data.changeDescription = this.changeReason;
      data.contractAmount = this.value1; // 合同金额 新增
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
      this.tableData.forEach(item => {
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
            // 控制不能再点击变更按钮
            this.isChange = true;
          } else {
            this.$message.error("提交失败");
          }
          this.changeBtnloading = false;
          this.milepostChangedialogVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("接口报错");
          this.changeBtnloading = false;
          this.milepostChangedialogVisible = false;
        });
    },
    //提示信息
    warnMessage(message) {
      this.$message({
        showClose: true,
        message: message,
        type: "success"
      });
    },
    getProjectMsg(projectId) {
      //通过项目id获取项目基本信息
      projectMsgById(
        `/sgpm/rest/api/server/pm/project?projectId=${projectId}`,
        null
      )
        .then(res => {
          let result = res.data.data;
          localStorage.setItem("projectData", JSON.stringify(result));
          // 更新review时间
          if (result.reviewtime) {
            this.reviewtime = result.reviewtime;
          } else {
            this.reviewtime = "--";
          }
          // 更新项目预算
          if (result.projectBudget) {
            this.projectBudget = result.projectBudget;
          } else {
            this.projectBudget = "--";
          }
          // 更新合同编号
          if (result.CONTRACTNUMBER) {
            this.contractNum = result.CONTRACTNUMBER;
          } else {
            this.contractNum = "--";
          }
          // 判断是否能变更 isChange 1可以变更  0不能变更
          if (result.isChange == 0) {
            this.isChange = true;
          } else {
            this.isChange = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleSubmit() {
      // 更新数据
      this.updateData(this.tableData);
      // this.saveReviewlog(this.tableData); //保存review记录
    },

    //获取当前时间
    getNowDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    updateData(tableData) {
      // 没数据时不能保存
      if (tableData.length == 0) {
        return this.$message.warning("没数据暂不能提交");
      }
      var flag = true;
      // console.log("====更新里程碑信息=====");
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      var data = {};
      var milestones = [];
      tableData.forEach(item => {
        var hash = {};
        hash["id"] = item.projectMilestoneId; //里程碑id
        hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
        hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
        hash["estimatedWorkingHours"] = item.workHours; //预计工时
        hash["currentProblems"] = item.currentProblems; //当前问题
        hash["accumulatedProgress"] = item.accumulatedProgress; //累计进度
        hash["status"] = item.status; //里程碑中 status: 0 未完成  1 进行中  2 已完成

        //bug修改 erp数据 已完成 且有完成时间时
        // if (item.status == 2 && item.finishDate != null){
        //   hash["finishDate"] = item.finishDate
        // }
        //进行中/未完成  有完成时间 的数据 保留原完成时间
        if (item.finishDate != "--") {
          hash["finishDate"] = item.finishDate;
        }
        // 选择完成时 添加实际完成时间，只添加处于修改状态的数据
        if (item.status == 2 && !item.statusSelectData.selectStatus) {
          var dateTime = this.getNowDate();
          // console.log(item);
          hash["finishDate"] = dateTime; //实际完成时间
          // 根据实际完成时间计算延期天数
          var beginDate = new Date(Date.parse(item.expectedEndTime));
          var endDate = new Date(Date.parse(dateTime));
          var delayDays = (endDate - beginDate) / (1000 * 24 * 3600); //获取天数
          hash["delayDays"] = delayDays > 0 ? delayDays : 0; //延期天数
        }

        //新需求，手动选择完成时间
        if (
          item.status == 2 &&
          !item.statusSelectData.selectStatus &&
          item.milestoneName == "验收"
        ) {
          hash["finishDate"] = item.finish_date; //选择的实际完成时间
          console.log(item.finish_date);
          // 未选完成时间 添加判断
          if (item.finish_date === undefined) {
            flag = false;
          }
          // 根据实际完成时间计算延期天数
          var beginDate = new Date(Date.parse(item.expectedEndTime));
          var endDate = new Date(Date.parse(item.finish_date));
          var delayDays = (endDate - beginDate) / (1000 * 24 * 3600); //获取天数
          hash["delayDays"] = delayDays > 0 ? delayDays : 0; //延期天数
        }

        //交付物
        var deliverable = [];
        item.deliverable.forEach(del => {
          var ha = {};
          ha["id"] = del.deliverableId; //交付物id
          ha["deliverableName"] = del.deliverableName;
          ha["fileName"] = del.fileName;
          ha["filePath"] = del.filePath;
          ha["description"] = del.description;
          ha["status"] = del.status; //erp中交付物状态 1未上传 2待审核   3审核通过   4驳回
          deliverable.push(ha);
        });
        hash["deliverable"] = deliverable;
        console.log(hash);
        milestones.push(hash);
      });
      data["milestones"] = milestones; //里程碑信息

      if (!flag) return this.$message.warning("请选择实际完成时间");
      serverPostHttpMethod(url, data)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("保存成功");
            this.remarksStatus = false; //完成时间 不可再选

            this.saveReviewlog(tableData); //保存review记录
            this.getMileStoneDatas(); //从接口获取项目保存的里程碑信息

            //this.saveReviewlog(this.tableData); //保存review记录
          } else {
            this.$message.error("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //保存review记录
    saveReviewlog(tableData) {
      var projectId = localStorage.getItem("projectId");
      this.getCurrentProgress(tableData);
      var arr = []; //记录所有review操作的数据
      for (var i = 0; i < tableData.length; i++) {
        var item = tableData[i];
        if (item.changeStatus) {
          arr.push(item);
        }
      }
      if (arr.length > 0) {
        //新需求 保存所有修改的记录V2
        var arr_data = [];
        arr.forEach(item => {
          var data = {};
          data["percentageComplete"] = this.currentProgress / 100; //当前进度
          data["currentStatus"] = item.status;
          data["progressProblems"] = item.currentProblems;
          data["projectMilestoneId"] = item.projectMilestoneId;
          data["projectId"] = projectId; //项目id 新增字段
          arr_data.push(data);
        });
        var url = "/sgpm/rest/api/server/pm/project/reviewlog";
        serverPostHttpMethod(url, arr_data)
          .then(res => {
            // console.log(res.data);
            if (res.data.code == 200) {
              this.reviewtime = this.getNowDate(); //局部更新review时间
            } else {
              alert("保存失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //将数字转为 金额格式
    formatThousands(value) {
      value = value / 10000;
      value = value.toFixed(2); //万元单位 保留二位小数点
      var r = /^[0-9]*[1-9][0-9]*$/; //正整数
      if (r.test(value) == false) {
        return (
          value &&
          value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
          })
        );
      } else {
        var reg = /\d{1,3}(?=(\d{3})+$)/g;
        return (value + "").replace(reg, "$&,");
      }
    },

    //点击某行数据时
    handleSelectionChange(row) {
      console.log(row);
    },

    //控制只展开一行数据
    expandChange(row, expandedRows) {
      var that = this;
      var flag = false;
      if (expandedRows.length > 1) {
        that.expands = [];
        if (row) {
          that.expands.push(row);
        }
        this.$refs.rowData.toggleRowExpansion(expandedRows[0]);
      } else {
        that.expands = [];
      }

      //展开错位问题解决
      if (expandedRows.length != 0) {
        flag = true;
      }

      //有二个合并单元格时
      if (this.span1.length == 2) {
        var d1 = this.span1[0];
        var d2 = this.span1[1];
        var stageName1 = this.tableData[d1.index].stageName;
        var stageName2 = this.tableData[d2.index].stageName;

        // 合并的阶段名称 第一个是实施 第二个是收尾
        if (stageName1 == "实施" && stageName2 == "收尾") {
          //恢复初始状态
          if (this.spanArr[d1.index] != d1.value) {
            this.spanArr[d1.index] = d1.value;
          }

          if (flag && row.stageName == "实施" && stageName1 == "实施") {
            this.spanArr[d1.index] = d1.value + 1;
          } else if (!flag && row.stageName == "实施" && stageName1 == "实施") {
            this.spanArr[d1.index] = d1.value;
          }

          if (flag && row.stageName == "收尾" && stageName2 == "收尾") {
            this.spanArr[d2.index] = d2.value + 1;
          } else if (!flag && row.stageName == "收尾" && stageName2 == "收尾") {
            this.spanArr[d2.index] = d2.value;
          }
        }
      }

      //一个合并单元格时  erp数据
      if (this.span1.length == 1) {
        var d1 = this.span1[0];
        //恢复初始状态
        if (this.spanArr[d1.index] != d1.value) {
          this.spanArr[d1.index] = d1.value;
        }

        var stageName1 = this.tableData[d1.index].stageName;
        if (stageName1 == "实施") {
          if (flag && row.stageName == "实施" && stageName1 == "实施") {
            this.spanArr[d1.index] = d1.value + 1;
          } else if (!flag && row.stageName == "实施" && stageName1 == "实施") {
            this.spanArr[d1.index] = d1.value;
          }
        }

        if (stageName1 == "启动") {
          if (flag && row.stageName == "启动" && stageName1 == "启动") {
            this.spanArr[d1.index] = d1.value + 1;
          } else if (!flag && row.stageName == "启动" && stageName1 == "启动") {
            this.spanArr[d1.index] = d1.value;
          }
        }

        // 阶段名称为 规划 展开错位问题
        if (stageName1 == "规划") {
          if (flag && row.stageName == "规划" && stageName1 == "规划") {
            this.spanArr[d1.index] = d1.value + 1;
          } else if (!flag && row.stageName == "规划" && stageName1 == "规划") {
            this.spanArr[d1.index] = d1.value;
          }
        }
      }
    },

    //合并单元格
    getSpanArr(data) {
      this.spanArr = []; //清空原数据
      this.span1 = []; //切换里程碑时清空数据

      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].stageName === data[i - 1].stageName) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
      //展开错位问题解决
      for (var i = 0; i < this.spanArr.length; i++) {
        var item = this.spanArr[i];
        if (item > 1) {
          var hash = { index: i, value: item };
          this.span1.push(hash);
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并第一列
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]; // [ 1, 2, 1, 1, 1, 0 ]
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },

    //将tableData存到全局变量中
    sendData() {
      console.log("=====MilePost=====sendData========");
      var MilepostParams = JSON.stringify(this.tableData);
      localStorage.setItem("MilepostParams", MilepostParams);
    },

    // 当前问题输入值变化时
    textareaChange(row) {
      row.changeStatus = true; //记录当前行被review
      this.sendData();
    },

    // 当前状态 下拉选变化时
    selectChange(row) {
      row.changeStatus = true; //记录当前行被review
      //新需求：当选择已完成时，完成百分比自动更新为100
      //新需求：交付物未全部上传，选择已完成时，添加提示
      if (row.status == 2) {
        var fileStatus = this.getFileStatus(row);
        if (!fileStatus) {
          this.$message.warning("待交付物文档全部审核通过才能完成");
          row.status = 1;
        } else {
          row.accumulatedProgress = 100;
        }
        this.getCurrentProgress(this.tableData); //计算当前进度
      }
      //新需求：验收里程碑 完成时 完成时间手动输入并添加提示
      if (row.status == 2 && row.milestoneName == "验收") {
        this.remarksStatus = true; //显示提示文字
      } else {
        this.remarksStatus = false;
      }
      //bug优化，当进度为100，,再选进行中或未完成时添加提示
      if (
        (row.status == 1 || row.status == 0) &&
        row.accumulatedProgress == 100
      ) {
        this.$message.warning(
          "选择 未完成/进行中时，完成百分比不能为100，请先修改完成百分比"
        );
        row.status = 2;
      }

      this.sendData();
    },

    // 累计进度值变化时，传值到全局变量
    handleAccumulatedProgress(row) {
      row.changeStatus = true; //记录当前行被review

      //新需求：交付物未全部上传时，只能选择90%
      if (row.accumulatedProgress == 100) {
        row.status = 2;
      } else if (
        row.accumulatedProgress >= 10 &&
        row.accumulatedProgress < 100
      ) {
        row.status = 1;
      }

      //新需求：验收里程碑 完成时 完成时间手动输入并添加提示
      if (row.accumulatedProgress == 100 && row.milestoneName == "验收") {
        this.remarksStatus = true; //显示提示文字
      } else {
        this.remarksStatus = false;
      }

      this.getCurrentProgress(this.tableData); //计算当前进度
      // 传值到全局变量 localStorage
      this.sendData();
    },
    //计算当前进度
    getCurrentProgress(tableData) {
      var a = 0;
      tableData.forEach(item => {
        a += item.weight * item.accumulatedProgress;
      });
      console.log("计算当前进度a:" + a / 100);
      // this.currentProgress = Math.round(a / 100); //四舍五入
      this.currentProgress = a / 100; //四舍五入有bug
    },

    // 上传文件变化值，获取文件流
    handleChange(file, fileList) {
      // this.file = file.raw;
      this.fileUploadFiles.push(file);
      //将数据传给父组件 判断文件是否已全部上传
      Bus.$emit("fileUploadFiles", this.fileUploadFiles);
      // this.fileList = fileList;
    },
    //移除文件时
    handleRemove(file, fileList) {
      console.log(file);
      var index = this.fileUploadFiles.indexOf(file);
      this.fileUploadFiles.splice(index, 1);
      //将数据传给父组件 判断文件是否已全部上传
      Bus.$emit("fileUploadFiles", this.fileUploadFiles);
    },
    //选文件
    handleSelectFile(row) {
      row.upload_status = false; //上传按钮可点击
    },

    //文件上传成功时的钩子方法
    handleAvatarSuccess(res, file) {},

    // 手动点击上传文件
    submitUpload(row) {
      console.log(this.$refs[row.deliverableId].uploadFiles);
      //获取单行要上传的文件
      if (this.$refs[row.deliverableId].uploadFiles.length == 0) {
        this.warnMessage("请选择文件");
        return false;
      }
      this.uploadFile(row);
    },

    //抽取上传文件方法
    uploadFile(row) {
      // //获取单行要上传的文件
      // if (this.$refs[row.deliverableId].uploadFiles.length == 0) {
      //   this.warnMessage("请选择文件");
      //   return false;
      // }

      var file = this.$refs[row.deliverableId].uploadFiles[0].raw; //要上传的文件（获取单行的数据）
      // var fileSize = this.file.size / 1024 / 1024;  //bug 只能单个上传
      var fileSize = file.size / 1024 / 1024;
      if (fileSize > 100) {
        alert("文件太大，请选择100M以下的文件");
      } else {
        this.$refs[row.deliverableId].clearFiles(); //清空文件列表
        // 点击上传按钮后，控制不可再点击
        row.upload_status = true;
        row.file_status = true;
        row.progress_status = true; //显示进度条
        row.file_name = "上传中....";
        let param = new FormData();
        // param.append("file", this.file); //bug 只能单个上传
        param.append("file", file);
        param.append("projectName", localStorage.getItem("projectName"));
        param.append("id", row.deliverableId);
        //新需求 从项目信息中获取公司信息
        var projectData = JSON.parse(localStorage.getItem("projectData"));
        var company = projectData.company_name;
        param.append("company", company);
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
          "/sgpm/rest/api/server/pm/project/deliverable/upload"
        );
        axios.post(uploadUrl, param, config).then(response => {
          if (response.data.code == 200) {
            row.progress = 100;
            //局部更新数据
            row.file_name = file.name;
            // row.fileName = response.data.data.fileName; //解决 上传图片后 提交 文件名称没保存
            row.fileName = file.name; //解决 上传图片后 提交 文件名称没保存
            row.file_url = this.get_download_file_url(row);
            // row.status = 2; // 1未上传 0已上传  2待审核   3审核通过  4驳回
            // 上传图片后更新当前状态数据
            this.updateStatus(); //更新表格 当前状态数据
            this.sendData(); //解决上传图片后 提交 没反应
            //新需求
            this.fileUploadFiles.forEach(item => {
              if (item.uid == file.uid) {
                var index = this.fileUploadFiles.indexOf(item);
                this.fileUploadFiles.splice(index, 1);
              }
            });
            //将数据传给父组件 判断文件是否已全部上传
            Bus.$emit("fileUploadFiles", this.fileUploadFiles);
            //hubo添加是否走审批流
            console.log(row);

            //V1:添加确认框提示
            // this.$confirm("已经上传成功，是否提交审批流?")
            //   .then(_ => {
            //     // row.status = 2; // 1未上传 0已上传  2待审核   3审核通过  4驳回
            //     // row.file_status = true; //恢复选文件按钮不可点击
            //     // var projectData = JSON.parse(localStorage.getItem("projectData"));
            //     var obj = {
            //       deliverableId: row.deliverableId,
            //       username: this.userinfo.login_name,
            //       projectNumber: this.projectNumber
            //     };
            //     if (
            //       this.userinfo.account_id == "-1360422574114386809" ||
            //       this.userinfo.account_id == "5326994013938795629"
            //     ) {
            //       //超图软件、超图信息
            //       this.examineCTSubmit(obj, row);
            //     } else if (this.userinfo.account_id == "-1814768306395265967") {
            //       //国图
            //       this.examineGTSubmit(obj, row);
            //     } else if (this.userinfo.account_id == "8416498716893399290") {
            //       //南康
            //       this.examineNKSubmit(obj, row);
            //     } else {
            //       row.file_status = false;
            //       row.status = 0;
            //       this.warnMessage("该公司还在开发中，暂不能提交审批文档");
            //     }
            //   })
            //   .catch(_ => {
            //     row.file_status = false; //恢复选文件按钮可点击
            //     row.status = 0; // 1未上传 0已上传  2待审核   3审核通过  4驳回
            //   });

            //V2:取消确认框提示
            this.submitFileAudit(row);
          } else {
            alert("上传失败");
          }
          row.upload_status = true; //上传按钮不可点击
          // row.file_status = false; //恢复选文件按钮可点击
          row.progress = 0; //上传进度恢复0
          row.progress_status = false; //隐藏进度条
        });

        //V1
        // fileUpload(
        //   "/sgpm/rest/api/server/pm/project/deliverable/upload",
        //   param,config
        // ).then(response => {
        //   // console.log(response);
        //   if (response.data.code == 200) {
        //     alert("上传成功");
        //     //局部更新数据
        //     row.file_name = this.file.name;
        //     // row.fileName = response.data.data.fileName; //解决 上传图片后 提交 文件名称没保存
        //     row.fileName = this.file.name; //解决 上传图片后 提交 文件名称没保存
        //     row.file_url = this.get_download_file_url(row);
        //     row.status = 3; // 1未上传 2待审核   3审核通过  4驳回
        //     // 上传图片后更新当前状态数据
        //     this.updateStatus(); //更新表格 当前状态数据
        //     this.sendData(); //解决上传图片后 提交 没反应
        //   } else {
        //     alert("上传失败");
        //   }
        //   row.upload_status = true; //上传按钮不可点击
        //   row.file_status = false; //恢复选文件按钮可点击
        // });
      }
    },
    // 文档提交
    submitFileAudit(row) {
      var obj = {
        deliverableId: row.deliverableId,
        username: Base64.encode(this.userinfo.login_name),
        projectNumber: this.projectNumber
      };
      if (
        this.userinfo.account_id == "-1360422574114386809" ||
        this.userinfo.account_id == "5326994013938795629"
      ) {
        //超图软件、超图信息
        this.examineCTSubmit(obj, row);
      } else if (
        this.userinfo.account_id == "-1814768306395265967" ||
        this.userinfo.account_id == "7638091599462351621"
      ) {
        //国图 安图
        this.examineGTSubmit(obj, row);
      } else if (this.userinfo.account_id == "8416498716893399290") {
        //南康
        this.examineNKSubmit(obj, row);
      } else {
        row.file_status = false;
        row.status = 0;
        this.warnMessage("该公司还在开发中，暂不能提交审批文档");
      }
    },

    //lmg 提交文档审批流(南康)
    examineNKSubmit(obj, row) {
      examineSubmit(`/sgpm/rest/api/integration/oa/nk/deliverable/flow`, obj)
        .then(res => {
          if (res.data.code == 200) {
            this.warnMessage("提交审批流程成功");
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

    //hubo 提交审批流(国图)
    examineGTSubmit(obj, row) {
      examineSubmit(`/sgpm/rest/api/integration/oa/gt/deliverable/flow`, obj)
        .then(res => {
          if (res.data.code == 200) {
            this.warnMessage("提交审批流程成功");
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
    //hubo 提交审批流(超图)CT
    examineCTSubmit(obj, row) {
      examineCTSubmit(`/sgpm/rest/api/integration/oa/deliverable/flow`, obj)
        .then(res => {
          if (res.data.code == 200) {
            this.warnMessage("提交审批流程成功");
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
    //更新当前状态数据 交付物全部上传可以点击已完成
    updateStatus() {
      this.tableData.forEach(item => {
        var fileStatus = this.getFileStatus(item);
        //新需求：交付物没有全部上传时，只能选择到90%
        if (fileStatus) {
          item.maxValue = 100;
        } else {
          item.maxValue = 90;
        }

        //进行中
        if (item.status == 1) {
          //交付物上传文件判断
          if (fileStatus) {
            var statusSelectData = {
              value: "",
              selectStatus: true,
              options: [
                { value: 0, label: "未完成", disabled: true },
                { value: 1, label: "进行中", disabled: false },
                { value: 2, label: "已完成", disabled: false }
              ]
            };
          } else {
            var statusSelectData = {
              value: "",
              selectStatus: true,
              options: [
                { value: 0, label: "未完成", disabled: true },
                { value: 1, label: "进行中", disabled: false },
                // {value: 2, label: '已完成', disabled: true}
                { value: 2, label: "已完成", disabled: false }
              ]
            };
          }
        }

        //已完成
        if (item.status == 2) {
          if (fileStatus) {
            var statusSelectData = {
              value: "",
              selectStatus: true,
              options: [
                { value: 0, label: "未完成", disabled: true },
                { value: 1, label: "进行中", disabled: true },
                { value: 2, label: "已完成", disabled: false }
              ]
            };
          } else {
            var statusSelectData = {
              value: "",
              selectStatus: true,
              options: [
                { value: 0, label: "未完成", disabled: true },
                { value: 1, label: "进行中", disabled: true },
                { value: 2, label: "已完成", disabled: true }
              ]
            };
          }
        }

        //未完成
        if (item.status == 0) {
          if (fileStatus) {
            var statusSelectData = {
              value: "",
              selectStatus: true,
              options: [
                { value: 0, label: "未完成", disabled: false },
                { value: 1, label: "进行中", disabled: false },
                { value: 2, label: "已完成", disabled: false }
              ]
            };
          } else {
            var statusSelectData = {
              value: "",
              selectStatus: true,
              options: [
                { value: 0, label: "未完成", disabled: false },
                { value: 1, label: "进行中", disabled: false },
                { value: 2, label: "已完成", disabled: false }
              ]
            };
          }
        }
        item["statusSelectData"] = statusSelectData;
      });
      this.setReviewRow(this.tableData); //阶段控制
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
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
        default:
          return "否";
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
    },

    // 获取文件下载的url
    get_download_file_url(del) {
      //新需求 从项目信息中获取公司信息
      var projectData = JSON.parse(localStorage.getItem("projectData"));
      var company = projectData.company_name;
      console.log(company);
      var file_url =
        getDownLoadUrl(
          "/sgpm/rest/api/server/pm/project/deliverable/download?id="
        ) +
        del.deliverableId +
        "&company=" +
        company;
      return file_url;
    },

    //获取人员的角色信息
    getMemberRole() {
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      // var params = {projectNo: 'PM-6920', memberId: '-8349147320885949434'};
      var params = {
        projectNo: this.projectNumber,
        memberId: userinfo.memberid
      };
      var url = "/sgpm/rest/api/server/pm/project/member/role";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          // console.log("=======角色信息======");
          // console.log(jsonData);
          var memberRole = jsonData.memberRole;
          Bus.$emit("memberRole", memberRole);
          if (memberRole == 0 || memberRole == 2) {
            //0 什么也不是  2 销售
            // this.submitStatus = true; //不是项目经理
            this.manageStatus = false;
            //新需求 项目成员可以提交上传交付物，不可以修改进度
            //判断是否是成员(不是项目经理的情况下判断)
            // debugger
            // this.memberStatus = false;//初始化变量
            // this.memberData.forEach(item => {
            //   if (item.user_id == this.userinfo.memberid) {
            //     this.submitStatus = false;
            //     this.memberStatus = true; //memberStatus true 不可修改进度
            //   }
            // })
          } else {
            // this.submitStatus = false;//项目经理才能提交
            this.manageStatus = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getMemberData(projectId) {
      //获取项目的成员数据
      this.memberStatus = false;
      var url = "/sgpm/rest/api/server/pm/project/members/" + projectId;
      serverGetHttpMethod(url)
        .then(res => {
          var jsonData = res.data.data;
          console.log("===成员数据==");
          console.log(jsonData);
          if (jsonData.length > 0) {
            jsonData.forEach(item => {
              if (item.user_id == this.userinfo.memberid) {
                this.submitStatus = false;
                this.memberStatus = true; //memberStatus true 不可修改进度
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取合同额 数据
    getMoneyValues() {
      var params = { projectId: this.projectId };
      var url = "/sgpm/rest/api/server/pm/project/return/money/percentage";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (jsonData != null) {
            this.value1 = jsonData.contractAmount; //合同额
            this.value2 = jsonData.returnMoney; //回款额
            // this.value1 = this.formatThousands(jsonData.contractAmount); //合同额
            // this.value2 = this.formatThousands(jsonData.returnMoney);    //回款额
            // this.value3 = jsonData.returnMoneyPercentage * 100 + "%"; //回款率
            this.value3 =
              Math.round(jsonData.returnMoneyPercentage * 100) + "%"; //回款率
            // this.resolution = jsonData.resolution.toFixed(2); // 项目经费
            this.resolution = jsonData.resolution; // 项目经费
          } else {
            this.value1 = "--"; //合同额
            this.value2 = "--"; //回款额
            this.value3 = "--"; //回款率
            this.resolution = "--"; // 项目经费
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取 保存的里程碑信息，根据项目编号
    getMileStoneDatas() {
      this.tableData = []; //先清空原数据
      var params = { projectNumber: this.projectNumber };
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      serverGetHttpMethod(url, params)
        .then(res => {
          debugger;
          var jsonData = res.data.data;
          this.loading = false;
          // console.log(jsonData);
          for (var i = 0; i < jsonData.length; i++) {
            var item = jsonData[i];
            item["workHours"] = item.estimatedWorkingHours; //预计工时
            item["expectedBeginTime"] = item.estimatedStartDate; //预计开始时间
            item["expectedEndTime"] = item.estimatedFinishDate; //预计结束时间
            item["currentProblems"] = item.currentProblems; //当前问题/进度
            item["accumulatedProgress"] = item.accumulatedProgress; //累计进度
            item["projectMilestoneId"] = item.projectMilestoneId; //里程碑id
            item["finishDate"] =
              item.finishDate == null ? "--" : item.finishDate; //实际完成时间

            item["changeStatus"] = false; //review值变化的状态 记录review的数据
            //动态计算延期天数
            this.createDelayDays(item);

            var weight = 0;
            if (i == 0) {
              weight = item.progressPercentage;
            } else {
              weight =
                jsonData[i].progressPercentage -
                jsonData[i - 1].progressPercentage;
            }
            item["weight"] = weight; //里程碑权重
            item["actualHours"] = "--"; //实际工时  从别的接口获取数据
            item["deviationHours"] = "--"; //工时偏差

            item.deliverable.forEach(del => {
              // 添加上传按钮控制变量
              del["file_status"] = false; //选文件按钮
              del["progress_status"] = false; //控制进度条显示 默认false不显示
              del["upload_status"] = true; //上传按钮
              del["fileList"] = []; //上传文件列表 新增字段
              del["progress"] = 0; //上传文件列表 新增字段  上传进度条

              // 修改交付物中文件名
              if (del.fileName && del.status != 1) {
                del["file_name"] = del.fileName;
                //从项目中获取公司信息,获取文件下载路径
                del["file_url"] = this.get_download_file_url(del);
              } else if (
                del.filePath != null &&
                del.deliverableTemplateId == null
              ) {
                //erp数据没文件名,添加默认下载名
                del["file_name"] = "下载文件";
                del["file_url"] = del.filePath;
              }

              //添加交付物 模板下载url isDownload=1模板可以下载  0不可下载
              if (del.isDownload == 1) {
                var userinfo = JSON.parse(localStorage.getItem("userinfo"));
                if (userinfo) {
                  var company = userinfo.account_name;
                }
                var template_file_url = getDownLoadUrl(
                  "/sgpm/rest/api/server/pm/project/deliverable/download/template?id=" +
                    del.deliverableTemplateId +
                    "&company=" +
                    company
                );
                del["template_file_url"] = template_file_url; //模板下载地址
              }

              //添加交付物 模板下载url isDownload=1模板可以下载  0不可下载
              if (del.isDownload == 1) {
                var userinfo = JSON.parse(localStorage.getItem("userinfo"));
                if (userinfo) {
                  var company = userinfo.account_name;
                }
                var template_file_url = getDownLoadUrl(
                  "/sgpm/rest/api/server/pm/project/deliverable/download/template?id=" +
                    del.deliverableTemplateId +
                    "&company=" +
                    company
                );
                del["template_file_url"] = template_file_url; //模板下载地址
              }
            });

            // 里程碑状态只能往前选择，不能往后选择 0未完成 1进行中 2已完成
            // 交付物全部上传 里程碑状态才能选择完成
            // erp中交付物状态 1未上传  2待审核   3审核通过   4驳回

            //新需求：交付物没有全部上传时，只能选择到90%
            //新需求：erp数据完成百分比100时 不做控制
            if (item.accumulatedProgress == 100) {
              item["maxValue"] = 100;
            } else {
              var fileStatus = this.getFileStatus(item);
              if (fileStatus) {
                item["maxValue"] = 100; //新增字段 控制每行 完成百分比 最大值
              } else {
                item["maxValue"] = 90;
              }
            }
            // 2020-04-14 新需求：完成百分比修改时最小值为已保存的完成百分比
            item["minValue"] =
              item.accumulatedProgress != null ? item.accumulatedProgress : 0; //完成百分比最小值

            //进行中
            if (item.status == 1) {
              //交付物上传文件判断
              // var fileStatus = this.getFileStatus(item);
              if (fileStatus) {
                var statusSelectData = {
                  value: "",
                  selectStatus: true,
                  options: [
                    { value: 0, label: "未完成", disabled: true },
                    { value: 1, label: "进行中", disabled: false },
                    { value: 2, label: "已完成", disabled: false }
                  ]
                };
              } else {
                var statusSelectData = {
                  value: "",
                  selectStatus: true,
                  options: [
                    { value: 0, label: "未完成", disabled: true },
                    { value: 1, label: "进行中", disabled: false },
                    // {value: 2, label: '已完成', disabled: true}
                    { value: 2, label: "已完成", disabled: false }
                  ]
                };
              }
            }

            //已完成
            if (item.status == 2) {
              // var fileStatus = this.getFileStatus(item);
              if (fileStatus) {
                var statusSelectData = {
                  value: "",
                  selectStatus: true,
                  options: [
                    { value: 0, label: "未完成", disabled: true },
                    { value: 1, label: "进行中", disabled: true },
                    { value: 2, label: "已完成", disabled: false }
                  ]
                };
              } else {
                var statusSelectData = {
                  value: "",
                  selectStatus: true,
                  options: [
                    { value: 0, label: "未完成", disabled: true },
                    { value: 1, label: "进行中", disabled: true },
                    // {value: 2, label: '已完成', disabled: true}
                    { value: 2, label: "已完成", disabled: false }
                  ]
                };
              }
            }

            //未完成
            if (item.status == 0) {
              // var fileStatus = this.getFileStatus(item);
              if (fileStatus) {
                var statusSelectData = {
                  value: "",
                  selectStatus: true,
                  options: [
                    { value: 0, label: "未完成", disabled: false },
                    { value: 1, label: "进行中", disabled: false },
                    { value: 2, label: "已完成", disabled: false }
                  ]
                };
              } else {
                var statusSelectData = {
                  value: "",
                  selectStatus: true,
                  options: [
                    { value: 0, label: "未完成", disabled: false },
                    { value: 1, label: "进行中", disabled: false },
                    // {value: 2, label: '已完成', disabled: true}
                    { value: 2, label: "已完成", disabled: false }
                  ]
                };
              }
            }
            item["statusSelectData"] = statusSelectData;
            this.tableData.push(item);
          }
          this.getSpanArr(this.tableData); //合并单元格
          this.getCurrentProgress(this.tableData); //计算当前进度
          this.setReviewRow(this.tableData); //设置Review从前往后,根据阶段控制
          this.setRowFile(this.tableData); //未完成的里程碑 控制不可上传附件
        })
        .catch(err => {
          console.log(err);
        });
    },
    //百分比数据转换
    // formatprogressPercentage(row) {
    //   return (row.progressPercentage * 100) + '%'
    // },
    //交付物上传文件状态判断 fileStatus true全部上传了
    //新需求：全部为 审核通过3 时才算全部上传OK
    getFileStatus(item) {
      var fileStatus = true;
      item.deliverable.forEach(del => {
        if (del.status != 3) {
          fileStatus = false;
        }
      });
      return fileStatus;
    },

    // erp数据生成阶段名称
    createstageName(item) {
      if (item.stageName == null) {
      }
    },

    //未完成 的里程碑控制不可上传附件 file_status
    //statusSelectData.selectStatus false时可编辑  true不可编辑
    setRowFile(tableData) {
      tableData.forEach(item => {
        //新需求：交付物状态为 待审核2、审核通过的3 不可再上传文件
        // v2020-05-12需求：恢复原来的
        item.deliverable.forEach(del => {
          if (del.status == 2 || del.status == 3) {
            del.file_status = true; //交付物 选文件按钮 不可操作
          }
          // v2020-04-16需求 审核通过的 还可以上传文档
          // if (del.status == 2) {
          //   del.file_status = true;
          // }
        });
      });
    },

    //设置Review只能从前往后编辑
    //新需求 当前阶段完成，才能进行下一阶段review,同一阶段内的里程碑可以同时review
    setReviewRow(tableData) {
      var flag1 = true;
      var flag2 = true;
      var flag3 = true;
      for (var i = 0; i < tableData.length; i++) {
        var row1 = tableData[i];
        //erp数据添加阶段名称
        //启动
        if (row1.stageName == "启动" && row1.status != 2) {
          row1.statusSelectData.selectStatus = false;
          flag1 = false;
          flag2 = false;
          flag3 = false;
        }

        //规划
        if (row1.stageName == "规划" && row1.status != 2 && flag1) {
          row1.statusSelectData.selectStatus = false;
          flag2 = false;
          flag3 = false;
        }

        //实施
        if (row1.stageName == "实施" && row1.status != 2 && flag2) {
          row1.statusSelectData.selectStatus = false;
          flag3 = false;
        }

        //收尾
        if (row1.stageName == "收尾" && row1.status != 2 && flag3) {
          row1.statusSelectData.selectStatus = false;
        }

        //原逻辑 只控制单行编辑
        // if (row1.status != 2) {
        //   row1.statusSelectData.selectStatus = false;
        //   break;
        // }
      }
    },

    //动态生成延期天数
    createDelayDays(item) {
      // console.log("=====动态生成延期天数======");
      var delayDays = 0;
      var beginDate = new Date(Date.parse(item.expectedEndTime));
      var date = new Date();
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var nowTime = year + "-" + month + "-" + day; //当前日期
      var endDate = new Date(Date.parse(nowTime));

      //有完成日期时
      if (item.finishDate != "--") {
        var endDate = new Date(Date.parse(item.finishDate));
        if (endDate > beginDate) {
          delayDays = (endDate - beginDate) / (1000 * 24 * 3600); //获取天数
        }
      } else if (item.finishDate == "--" && endDate > beginDate) {
        delayDays = (endDate - beginDate) / (1000 * 24 * 3600);
      }
      item.delayDays = delayDays;
    }
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
/*确认框样式*/
.el-message-box__header {
  background: #f8f8f8;
  height: 50px;
}
.el-message-box {
  height: 160px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px;
}
.el-message-box__btns {
  text-align: center;
  font-size: 12px;
  margin-top: 15px;
}
</style>


<style scoped>
.Layout {
  /*margin-top: -10px;*/
  /* margin-left: 200px; */
  /*z-index: 10;*/
  padding-left: 10px;
}

.remarks {
  font-size: 12px;
  /*color: #606666;*/
  color: indianred;
  font-family: "微软雅黑", "Avenir", Helvetica, Arial, sans-serif;
}

.circle-menu {
  border-radius: 2px;
}

.content {
  float: left;
  margin-left: 15px;
  font-weight: bold;
}
.refreshPic {
  width: 25px;
  height: 25px;
  position: relative;
  top: 7px;
  right: -5px;
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
