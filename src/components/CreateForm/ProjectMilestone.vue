<template>
  <div class="Layout">
    <!--启动页面 里程碑组件/非合同项目登记 里程碑组件 lmg-->
    <div class="selectModule">
      <!-- 按钮操作区-->
      <div style="text-align: left" v-show="datas.options.switch.head">
        <span style="font-size: 15px;font-weight: bold">选择项目里程碑模板&nbsp&nbsp</span>
        <el-select
          filterable
          :disabled="!isShow"
          v-model="milestoneTemplateId"
          @change="selectTrigger"
          placeholder="请选择"
          class="select"
        >
          <el-option
            style="width:500px"
            v-for="item in milestoneTemplates.options"
            :key="item.milestoneTemplateId"
            :label="item.milestoneTemplateName"
            :value="item.milestoneTemplateId"
          ></el-option>
        </el-select>

        <!--<el-button type="primary" @click="testhandleSave">保存</el-button>-->
      </div>
    </div>

    <div style="margin: 10px"></div>
    <!--:default-expand-all="true" 默认展开子表格 -->
    <el-table
      :data="tableData"
      ref="rowData"
      :height="500"
      :default-expand-all="false"
      @selection-change="handleSelectionChange"
      border
      :header-cell-style="{
        fontSize: '12px',
        color: '#303133',
        height: '51px',
        padding: 0,
        backgroundColor: '#ccd1d5'
      }"
      :row-style="{ height: '50px' }"
      :cell-style="{ padding: 0 }"
      style="width: 100%;font-size: 10px"
    >
      <!-- 子表格 数据 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.deliverable"
            ref="sonData"
            @selection-change="handleSonSelectionChange"
            :header-cell-style="{
              fontSize: '12px',
              color: '#303133',
              height: '51px',
              padding: 0,
              backgroundColor: '#ccd1d5'
            }"
            :row-style="{ height: '50px' }"
            :cell-style="{ padding: 0 }"
            style="width: 100%;font-size: 10px"
          >
            <!--子表格选择框-->
            <el-table-column width="40" v-if="datas.options.switch.sonSelect">
              <template slot="header" slot-scope="{ row }">
                <el-checkbox
                  @change="handleCheckAllChange(props.row)"
                  :checked="true"
                  v-model="props.row.sonSelectStatus"
                ></el-checkbox>
              </template>
              <template slot-scope="{ row }">
                <el-checkbox
                  @change="handleChecked(row)"
                  v-model="row.checkedStatus"
                  :disabled="row.isCut == 0 ? true : false"
                ></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label="交付物名称" prop="deliverableName">
              <template slot-scope="{ row }">
                <span v-if="row.filePath == '' || row.filePath == null">
                  {{
                  row.deliverableName
                  }}
                </span>
                <span v-else>
                  <u>
                    <a
                      :href="row.file_url"
                      target="_blank"
                      style="color: dodgerblue"
                    >{{ row.deliverableName }}</a>
                  </u>
                </span>
              </template>
            </el-table-column>

            <el-table-column label="交付物描述" prop="description"></el-table-column>

            <el-table-column
              v-if="datas.options.switch.isContractDeliverable"
              label="是否合同交付物"
              :formatter="formatisCut"
              prop="isContractDeliverable"
            >
              <template slot-scope="{ row }">
                <el-switch
                  @change="switchChange(row)"
                  v-model="row.contractDeliverable"
                  active-text="是"
                  inactive-text="否"
                  inactive-value="0"
                  active-value="1"
                ></el-switch>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              width="100"
              label="是否为审计"
              :formatter="formatauditDeliverable"
              prop="auditDeliverable"
            ></el-table-column>

            <el-table-column align="center" label="是否可裁剪" :formatter="formatisCut" prop="isCut"></el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <!-- v-if=false 隐藏该列 -->
      <el-table-column label="里程碑id" v-if="false" width="100" prop="milestoneId"></el-table-column>

      <!--重写 父表格 选择框-->
      <el-table-column width="40">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            v-if="datas.options.switch.sonSelect"
            @change="handleFatherCheckAllChange(fatherStatus)"
            v-model="fatherStatus"
          ></el-checkbox>
        </template>

        <template slot-scope="scope">
          <!--立项登记页面 sonSelect:true-->
          <el-checkbox
            v-if="datas.options.switch.sonSelect"
            @change="handleFatherChecked(scope.row)"
            v-model="scope.row.deliverableStatus"
            :disabled="scope.row.isCut == 0 ? true : false"
          ></el-checkbox>

          <!--里程碑review页面 sonSelect:false-->
          <el-checkbox
            v-else
            @change="handleFatherChecked(scope.row)"
            v-model="scope.row.deliverableStatus"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="阶段名称" width="80" align="center" prop="stageName"></el-table-column>

      <el-table-column label="里程碑名称" width="150" align="center" prop="milestoneName"></el-table-column>

      <el-table-column
        label="对应百分比"
        align="center"
        :formatter="formatprogressPercentage"
        width="100"
        prop="progressPercentage"
      ></el-table-column>

      <el-table-column label="是否完成" align="center" v-if="false" width="100" prop="isFinished"></el-table-column>

      <el-table-column
        label="是否可裁剪"
        align="center"
        :formatter="formatisCut"
        width="100"
        prop="isCut"
      ></el-table-column>

      <el-table-column label="预计开始时间" align="center" width="200" prop="expectedBeginTime">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.expectedBeginTime"
            :disabled="!scope.row.deliverableStatus"
            type="date"
            @change="selectChange(scope.row)"
            style="width: 150px"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column label="预计完成时间" align="center" width="200" prop="expectedEndTime">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.expectedEndTime"
            :disabled="!scope.row.deliverableStatus"
            type="date"
            @change="endTimeChange(scope.row)"
            style="width: 150px"
            value-format="yyyy-MM-dd"
            :picker-options="scope.row.pickerOptions"
            placeholder="选择日期"
          ></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column
        label="实际完成时间"
        align="center"
        width="200"
        v-if="datas.options.switch.time3"
        prop="actualEndTime"
      >
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.actualEndTime"
            type="date"
            style="width: 150px"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </template>
      </el-table-column>

      <el-table-column label="延期天数" align="center" v-if="false" prop="delayDays">
        <template slot-scope="scope">
          <el-input v-model="scope.row.delayDays"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="预计工时(人月)"
        align="center"
        width="150"
        v-if="datas.options.switch.workHours"
        prop="workHours"
      >
        <template slot-scope="scope">
          <!--<el-input v-model="scope.row.workHours" min="1" max="10" type="text" @change="selectChange"></el-input>-->
          <el-input-number
            v-model="scope.row.workHours"
            style="width: 100px"
            @change="selectChange"
            :min="0"
            :max="100"
            :step="workHourStep"
            :disabled="!scope.row.deliverableStatus"
            controls-position="right"
          ></el-input-number>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" label="里程碑描述" width="300" prop="description"></el-table-column>
    </el-table>
    <!--<div>reviewData2：{{this.reviewData.length}}</div>-->
  </div>
</template>
<script>
import { serverPostHttpMethod } from "../../api/api.js"; //
import { systemGetHttpMethod } from "../../api/api.js"; //
import { serverGetHttpMethod } from "../../api/api.js"; //
import { serverDeleteHttpMethod } from "../../api/api.js"; //
import { getDownLoadUrl } from "../../api/api.js"; //
import Bus from "../../bus";

export default {
  name: "project-milestone",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  data() {
    return {
      isShow: true, //true启动页面  false详情页面
      fatherStatus: true, //父表格 全选按钮状态
      //新增数据
      dataForm: {
        name: "",
        milestoneName: "", //里程碑名称
        progressPercentage: "", //百分比
        desc: "" //描述
      },

      dialogStatus: "", //弹出框的表头
      textMap: {
        update: "Edit",
        create: "Create"
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
      multipleSelection: [], //父表格 选中的数据 立项登记页面使用
      sonmultipleSelection: [], //子表格 选中的数据 立项登记页面使用
      dialogVisible: false, //默认不显示弹出框

      //里程碑模板数据
      milestoneTemplates: {
        value: "运维项目里程碑模板",
        options: [] //从接口获取数据
      },
      milestoneTemplateId: null, // 模板id
      milestoneTemplateName: "", // 模板名称
      //列表数据
      tableData: [], //表格数据从接口获取
      saveData: [], //已保存的里程碑数据
      projectNumber: "" //项目编号
    };
  },

  //解决重复请求bug
  beforeDestroy() {
    Bus.$off("projectInfo");
  },

  created() {
    // 清除localStorage 中的MilestoneParams参数
    var params = JSON.parse(localStorage.getItem("MilestoneParams"));
    if (params) {
      localStorage.removeItem("MilestoneParams");
    }
    // //清除缓存数据
    // var projectInfo = JSON.parse(localStorage.getItem("projectInfo"));
    // if (projectInfo) {
    //   localStorage.removeItem("projectInfo")
    // }

    //项目启动中 里程碑组件
    this.getTemplates(); //从接口获取模板数据
    this.getMileStoneDatas(); //获取已保存的里程碑信息
  },

  mounted() {
    //启动/非合同登记 保存后 更新里程碑数据
    Bus.$on("ProjectMilestoneSave", item => {
      if (item) {
        console.log(item);
        this.projectNumber = item.projectNumber;
        this.getSavedMilestons(item.projectNumber);
      }
    });
  },
  computed: {
    // 新需求：南康工时步进为0.1 其他公司0.5
    workHourStep() {
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      if (userinfo.account_id == "8416498716893399290") {
        return 0.1;
      } else {
        return 0.5;
      }
    }
  },

  methods: {
    //是否合同交付物 值变化时
    switchChange() {
      this.sendData();
    },

    //获取 已保存的里程碑信息，根据项目编号
    getMileStoneDatas() {
      //从非合同列表页面进入，不查询已保存的里程碑数据
      if (this.$route.query.judgelogo == "a") {
        return false;
      }
      // 里程碑review页面变更页面不查询
      if (this.$route.path == "/projectmilestone") {
        return;
      }
      //详情页面，控制里程碑模板不可选
      if (this.$route.query.isShow == "1") {
        this.isShow = false; //true启动页面  false详情页面
      }
      // 里程碑变更编辑页面
      if (this.$route.path == "/MilepostChangeEdit") {
        Bus.$on("milestoneArray", item => {
          this.initMilestoneArray(item);
        });
        return;
      }
      //从审批列表 进入 查询已保存的里程碑数据
      var params = JSON.parse(localStorage.getItem("projectInfo"));
      if (params) {
        var projectNumber = params.projectNum;
        this.projectNumber = projectNumber;
        this.getSavedMilestons(projectNumber);
      }
    },
    // 里程碑变更页面数据处理(展现使用)
    initMilestoneArray(jsonData) {
      this.tableData = []; //先清空原数据
      // 模板名称赋值
      this.milestoneTemplateId = jsonData[0].milestoneTemplateId;
      // 已保存里程碑赋值
      for (var i = 0; i < jsonData.length; i++) {
        var item = jsonData[i];
        var hash = {};
        hash["stageName"] = item.stageName;
        hash["milestoneName"] = item.milestoneName;
        hash["progressPercentage"] = item.progressPercentage;
        hash["isCut"] = item.isCut;
        hash["status"] = 0;
        hash["description"] = item.description;
        hash["milestoneTemplateName"] = item.milestoneTemplateName; // 模板名称
        hash["milestoneTemplateId"] = item.milestoneTemplateId; // 模板id
        hash["expectedBeginTime"] = item.estimatedStartDate; //预计开始时间
        hash["expectedEndTime"] = item.estimatedFinishDate; //预计结束时间
        hash["workHours"] = item.estimatedWorkingHours; //预计工时
        hash["deliverableStatus"] = true; //新增字段 父表格checkbox选中状态
        hash["sonSelectStatus"] = true; //新增字段 子表格 全选按钮状态

        //交付物 添加默认选中状态字段
        var deliverable = [];
        item["deliverable"].forEach(del => {
          var ha = {};
          ha["deliverableName"] = del.deliverableName;
          ha["isCut"] = del.isCut;
          ha["contractDeliverable"] = del.contractDeliverable; //是否合同交付物
          ha["description"] = del.description;
          // 添加文件能否下载链接
          ha["fileName"] = del.fileName;
          ha["filePath"] = del.filePath;
          ha["file_url"] = del.file_url;

          ha["deliverableTemplateId"] = del.deliverableTemplateId;
          ha["auditDeliverable"] = del.auditDeliverable;
          ha["checkedStatus"] = true; //默认全部选中
          ha["contractDeliverable"] = del.contractDeliverable + ""; //是否合同交付物 转为字符串
          deliverable.push(ha);
        });
        hash["deliverable"] = deliverable;
        this.tableData.push(hash);
      }
      //将已保存的数据存到localstorage中
      var Params = JSON.stringify(this.tableData);
      if (this.tableData.length > 0) {
        // this.checked(); //父表格 默认全部选中
        localStorage.setItem("MilestoneParams", Params);
      }
    },

    getSavedMilestons(projectNumber) {
      this.tableData = []; //先清空原数据
      var params = { projectNumber: projectNumber };
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          for (var i = 0; i < jsonData.length; i++) {
            var item = jsonData[i];
            item["expectedBeginTime"] = item.estimatedStartDate; //预计开始时间
            item["expectedEndTime"] = item.estimatedFinishDate; //预计结束时间
            item["workHours"] = item.estimatedWorkingHours; //预计工时

            item["deliverableStatus"] = true; //新增字段 父表格checkbox选中状态
            item["sonSelectStatus"] = true; //新增字段 子表格 全选按钮状态

            //交付物 添加默认选中状态字段
            var deliverable = item["deliverable"];
            deliverable.forEach(item => {
              item["checkedStatus"] = true; //默认全部选中
              item["contractDeliverable"] = item.contractDeliverable + ""; //是否合同交付物 转为字符串
            });

            this.tableData.push(item);
            this.saveData.push(item); //存储已保存的数据
          }
          console.log(this.tableData);
          //将已保存的数据存到localstorage中
          var Params = JSON.stringify(this.tableData);
          if (this.tableData.length > 0) {
            this.checked(); //父表格 默认全部选中
            localStorage.setItem("MilestoneParams", Params);
            //区分 更新操作 还是添加操作 用二个参数名
            // localStorage.setItem("savedMilestoneParams", Params);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置默认全选
    checked() {
      //首先el-table添加ref="rowData"引用标识
      //父表格全部选中
      this.$refs.rowData.toggleAllSelection(true);
    },

    //测试 保存操作
    testhandleSave() {
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      var data = {};
      // data["projectNumber"] = "RJ-H-2019-0010"; //项目编号
      data["projectNumber"] = this.projectNumber; //项目编号
      var milestones = [];
      this.multipleSelection.forEach(item => {
        var hash = {};
        hash["milestoneName"] = item.milestoneName;
        hash["isCut"] = item.isCut;
        hash["progressPercentage"] = item.progressPercentage;
        hash["sortIndex"] = 1.0;
        hash["description"] = item.description;
        hash["milestoneTemplateName"] = item.milestoneTemplateName; //里程碑模板名称
        // hash["milestoneTemplateName"] = this.milestoneTemplates.value.label;  //里程碑模板名称
        hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
        hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
        hash["finishDate"] = item.actualEndTime; //实际完成时间
        hash["estimatedWorkingHours"] = item.workHours; //预计工时
        hash["delayDays"] = item.delayDays; //延期天数
        hash["status"] = 0;
        hash["stageName"] = item.stageName; //阶段名称 新增字段
        //交付物
        var deliverable = [];
        item.deliverable.forEach(del => {
          //根据交付物中checkedStatus状态 保存交付物
          if (del.checkedStatus) {
            var ha = {};
            ha["deliverableName"] = del.deliverableName;
            ha["isCut"] = del.isCut;
            ha["description"] = del.description;
            ha["deliverableTemplateId"] = del.deliverableId; //交付物模板id 新增字段
            ha["status"] = 1; //交付物状态 1未上传  2待审核   3审核通过  4驳回
            deliverable.push(ha);
          }
        });
        hash["deliverable"] = deliverable;
        milestones.push(hash);
      });
      data["milestones"] = milestones; //里程碑信息
      serverPostHttpMethod(url, data)
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            alert("保存成功");
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //提示信息
    warnMessage() {
      this.$message({
        showClose: true,
        message: "预计完成时间要大于预计开始时间！",
        type: "warning"
      });
    },

    //将tableData存到全局变量中
    sendData() {
      console.log("=====MileStone=====sendData========");
      //bug 修改 2019-11-6 父表格全选时 this.multipleSelection 选中的数据有bug
      // var Params = JSON.stringify(this.multipleSelection);
      var Params = JSON.stringify(this.tableData);
      localStorage.setItem("MilestoneParams", Params);
    },
    // 值变化时发送表格数据
    selectChange(row) {
      //控制 预计结束时间 大于 预计开始时间
      if (Date.parse(row.expectedBeginTime) > Date.parse(row.expectedEndTime)) {
        // alert("请重新选择预计结束时间");
        this.warnMessage();
        row.expectedEndTime = "";
      }
      // if (row.expectedBeginTime != null) {
      //   console.log(row.expectedBeginTime);
      //   row.pickerOptions = {
      //     disabledDate(time) {
      //       return time.getTime() < (Date.parse(row.expectedBeginTime) - 24 * 3600 * 1000);
      //     },
      //   };
      // }
      this.sendData();
    },

    //新需求 预计完成时间作为下一行的预计开始时间
    endTimeChange(row) {
      if (Date.parse(row.expectedBeginTime) > Date.parse(row.expectedEndTime)) {
        this.warnMessage();
        row.expectedEndTime = "";
      }

      //V1 第一行禁用时 有bug 2019-11-6 lmg
      // var index = this.multipleSelection.indexOf(row);
      // console.log(index);
      // if(index < this.multipleSelection.length-1){
      //   var next_item = this.multipleSelection[index+1];
      //   var table_index = this.tableData.indexOf(next_item);
      //   console.log(this.tableData[table_index]);
      //   this.tableData[table_index].expectedBeginTime = row.expectedEndTime;
      // }
      // V2
      var index = this.tableData.indexOf(row);
      // 找到下一行是选中的数据
      for (var i = index + 1; i < this.tableData.length; i++) {
        if (this.tableData[i].deliverableStatus) {
          var next_item = this.tableData[i];
          break;
        }
      }
      if (index < this.tableData.length - 1) {
        // var next_item = this.tableData[index+1];//下一行数据
        var table_index = this.tableData.indexOf(next_item);
        this.tableData[table_index].expectedBeginTime = row.expectedEndTime;
      }

      this.sendData();
    },

    //下拉选值变化时触发的函数，填充表格数据
    selectTrigger() {
      // console.log(val);
      // console.log('父组件的数据：datas');    //获取到父组件的数据
      // console.log(this.datas);
      console.log(this.milestoneTemplateId);
      var val = this.milestoneTemplateId;

      // 有保存的数据时，添加提示
      if (this.saveData.length > 0) {
        this.$confirm("确定重新选择里程碑模板吗？")
          .then(_ => {
            this.tableData = [];
            this.getMilestones(val); //获取单个里程碑模板数据
            //删除已保存的里程碑
            this.deleteMilestones(); //删除原里程碑数据
            this.saveData = [];
          })
          .catch(_ => {});
      } else {
        this.getMilestones(val); //获取单个里程碑模板数据
      }
      // 里程碑变更页面this.$route.path
      if (this.$route.path == "/MilepostChangeEdit") {
        // 向父组件发送一个标识
        this.$emit("milepostChangeStatus", true);
      }
    },

    // 删除已保存的里程碑
    deleteMilestones() {
      // //删除数据库中的数据
      if (this.projectNumber != "") {
        var params = { projectNumber: this.projectNumber };
        var url = "/sgpm/rest/api/server/pm/project/milestones";
        serverDeleteHttpMethod(url, params)
          .then(res => {
            if (res.data.code == 200) {
              // alert('删除成功');
            } else {
              alert("删除失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //获取单个里程碑模板数据
    getMilestones(val) {
      this.tableData = []; //清空父表格数据
      this.sonmultipleSelection = []; //清空子表格数据
      this.milestoneTemplates.options.forEach(item => {
        if (item.milestoneTemplateId == this.milestoneTemplateId) {
          this.milestoneTemplateName = item.milestoneTemplateName;
        }
      });

      var url = "/sgpm/rest/api/system/milestones/" + val;
      systemGetHttpMethod(url)
        .then(res => {
          var jsonData = res.data.data;
          console.log(jsonData);
          for (var i = 0; i < jsonData.length; i++) {
            var item = jsonData[i]; //模板信息
            var deliverable = item.deliverable; //交付物信息 数组形式
            var table_data = {};
            table_data["milestoneId"] = item.milestoneId;
            table_data["milestoneName"] = item.milestoneName;
            table_data["progressPercentage"] = item.progressPercentage;
            table_data["isFinished"] = "未完成";
            table_data["isCut"] = item.isCut;
            table_data["description"] = item.description;
            table_data["stageName"] = item.stageName; //阶段名称 新增字段
            table_data["milestoneTemplateName"] = this.milestoneTemplateName; //里程碑模板名称
            table_data["milestoneTemplateId"] = this.milestoneTemplateId; //里程碑模板id

            table_data["deliverableStatus"] = true; //新增字段 父表格checkbox选中状态
            table_data["sonSelectStatus"] = true; //新增字段 子表格全选状态

            table_data["expectedBeginTime"] = ""; //新增字段 预计开始时间
            table_data["expectedEndTime"] = ""; //新增字段 预计结束时间
            table_data["pickerOptions"] = {
              disabledDate(time) {
                // return time.getTime() < Date.now();
              }
            };

            var deliverableStr = [];
            deliverable.forEach(item => {
              item["checkedStatus"] = true; //新增字段
              item["contractDeliverable"] = "0"; //新增 国图 是否合同交付物
              var userinfo = JSON.parse(localStorage.getItem("userinfo"));
              if (userinfo) {
                var company = userinfo.account_name;
              }
              var file_url = getDownLoadUrl(
                "/sgpm/rest/api/server/pm/project/deliverable/download/template?id=" +
                  item.deliverableId +
                  "&company=" +
                  company
              );
              item["file_url"] = file_url; //模板下载地址
              deliverableStr.push(item);
            });
            // table_data['deliverable'] = deliverable;
            table_data["deliverable"] = deliverableStr;
            this.tableData.push(table_data);

            deliverableStr.forEach(item => {
              this.sonmultipleSelection.push(item);
            });
            // this.checked(); //父表格 默认全部选中
          }
          this.checked(); //父表格 默认全部选中
        })
        .catch(err => {
          console.log(err);
        });
    },

    //从接口获取模板数据
    getTemplates() {
      var userinfo = JSON.parse(localStorage.getItem("userinfo"));
      var deptId = userinfo.dept_id;
      var subDeptId = userinfo.subdept_id;
      var accountId = userinfo.account_id;
      var memberId = userinfo.memberid;
      var url =
        "/sgpm/rest/api/system/milestone/templates?memberId=" +
        memberId +
        "&deptId=" +
        deptId +
        "&subDeptId=" +
        subDeptId +
        "&accountId=" +
        accountId;
      systemGetHttpMethod(url)
        .then(res => {
          var jsonData = res.data.data;
          console.log(jsonData);
          for (var i = 0; i < jsonData.length; i++) {
            var item = jsonData[i];
            this.milestoneTemplates.options.push({
              milestoneTemplateId: item.milestoneTemplateId,
              milestoneTemplateName: item.milestoneTemplateName
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除操作
    deleteData() {
      console.log("delete");
      if (this.multipleSelection.length == 0) {
        alert("至少选择一个");
      } else {
        var a = this.tableData;
        var b = this.multipleSelection;
        //计算差集
        var c = a.filter(function(v) {
          return b.indexOf(v) == -1;
        });
        this.tableData = c;
      }
    },

    //重置表单内容
    restForm() {
      this.dataForm = {
        milestoneName: "",
        progressPercentage: "",
        desc: ""
      };
    },

    //点击 编辑 按钮操作
    handleUpdate() {
      if (this.multipleSelection.length != 1) {
        alert("请选择一个");
      } else {
        this.dialogStatus = "update";
        this.dialogVisible = true;
        this.restForm(); //重置表单内容

        var item = this.multipleSelection[0];
        this.dataForm.milestoneName = item.milestoneName;
        this.dataForm.progressPercentage = item.progressPercentage;
        this.dataForm.desc = item.desc;
      }
    },

    // //编辑 保存操作
    // updateData() {
    //   this.dialogVisible = false;
    //   //更新tableData中的数据
    //   const index = this.tableData.indexOf(this.multipleSelection[0]);
    //   console.log(index);
    //   var item = this.tableData[index];
    //   item.milestoneName = this.dataForm.milestoneName;
    //   item.progressPercentage = this.dataForm.progressPercentage;
    //   item.desc = this.dataForm.desc;
    // },

    // //添加 保存操作
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       // alert('submit!');
    //       this.dataForm.isFinished = '未完成';
    //       this.dataForm.isCut = 1;
    //
    //       this.tableData.unshift(this.dataForm);
    //       this.dialogVisible = false; //隐藏模态框
    //       this.$notify({
    //         title: 'Success',
    //         message: '添加成功！',
    //         type: 'success',
    //         duration: 2000 //显示时间 2秒
    //       })
    //
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },

    //父表格 获取选择的数据 默认全选使用
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      this.sendData();
    },

    //子表格 获取选择的数据
    handleSonSelectionChange(val) {
      console.log(val);
      this.sonmultipleSelection = val;
    },
    //父表格 全选操作
    handleFatherCheckAllChange(fatherStatus) {
      if (fatherStatus) {
        this.tableData.forEach(data => {
          if (data.isCut == 1) {
            data.deliverableStatus = true;
            this.multipleSelection.push(data);
          }
        });
      } else {
        this.tableData.forEach(data => {
          if (data.isCut == 1) {
            data.deliverableStatus = false;
            var index = this.multipleSelection.indexOf(data); //获取元素下标
            this.multipleSelection.splice(index, 1); //去掉当前数据 index删除的开始下标 1 删除的个数
          }
        });
      }
      this.sendData();
    },

    //父表格 单选 操作
    handleFatherChecked(val) {
      console.log(val);
      if (val.deliverableStatus) {
        this.multipleSelection.push(val);
        // if (this.reviewData.length > 0) {
        // this.reviewData.push(val);
        // var delete_data = this.reviewData.shift(); //移除数组中第一个元素，返回第一个元素
        // var delete_data = this.tableData.shift(); //移除数组中第一个元素，返回第一个元素
        // var index = this.tableData.indexOf(delete_data);
        // this.tableData[index].deliverableStatus = false;
        // } else {
        // this.reviewData.push(val)
        // }
      } else {
        var index = this.multipleSelection.indexOf(val); //获取元素下标
        this.multipleSelection.splice(index, 1); //去掉当前数据 index删除的开始下标 1 删除的个数

        // //移除review中选中的数据
        // var index2 = this.reviewData.indexOf(val);
        // this.reviewData.splice(index2, 1)
      }

      this.sendData();
    },

    //子表格 手动全选 操作
    handleCheckAllChange(val) {
      console.log(val.deliverable);
      console.log(val.sonSelectStatus);
      if (val.sonSelectStatus) {
        val.deliverable.forEach(data => {
          if (data.isCut == 1) {
            data.checkedStatus = true;
            this.sonmultipleSelection.push(data);
          }
        });
      } else {
        val.deliverable.forEach(data => {
          if (data.isCut == 1) {
            data.checkedStatus = false;
            var index = this.sonmultipleSelection.indexOf(data); //获取元素下标
            this.sonmultipleSelection.splice(index, 1);
          }
        });
      }
      this.sendData();
    },
    //子表格 手动单选操作
    handleChecked(row) {
      console.log(row);
      console.log(row.checkedStatus);
      if (row.checkedStatus) {
        this.sonmultipleSelection.push(row);
      } else {
        var index = this.sonmultipleSelection.indexOf(row); //获取元素下标
        this.sonmultipleSelection.splice(index, 1); //去掉当前数据 index删除的开始下标 1 删除的个数
      }
      this.sendData();
    },

    //百分比数据转换
    formatprogressPercentage(row) {
      return row.progressPercentage + "%";
    },

    //里程碑数据 预计开始时间 预计结束时间 预计工时 判断是否全部必填
    checkMilestoneParams(multipleSelection) {
      if (multipleSelection) {
        var flag = true;
        multipleSelection.forEach(item => {
          //针对选择的数据判断
          if (item.deliverableStatus) {
            var d1 = item.expectedBeginTime;
            var d2 = item.expectedEndTime;
            var d3 = item.workHours;
            if (!d1 || !d2 || !d3) {
              flag = false;
            }
          }
        });
        return flag;
      } else {
        // alert('项目里程碑实施计划必须填写!')
        return false;
      }
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
    //是否审计文档
    formatauditDeliverable(row, column) {
      switch (row.auditDeliverable) {
        case "1":
          return "是";
          break;
        case "0":
          return "否";
          break;
        default:
          return "未知";
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
</style>

<style scoped>
.Layout {
  margin-top: 20px;
  /* margin-left: 200px; */
  z-index: 10;
}

.content {
  float: left;
  margin-left: 30px;
  color: #0d6aad;
  font-weight: bold;
}

.title {
  text-align: left;
  margin-left: 10px;
  color: #0d6aad;
  font-weight: bold;
}
</style>
