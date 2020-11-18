<template>
  <div class="Layout">
    <!--tableDataOne:{{this.tableData2}}-->
    <!--addStatus:{{this.addStatus}}-->
    <!--saveStatus:{{this.saveStatus}}-->
    <!--合同视图/合同里程碑/回款里程碑计划-->
    <!--回款Review--销售-->
    <div style="font-size: 14px;font-weight: bold;text-align: center">
      {{projectName}}
    </div>

    <div>
      <div class="content" v-if="contractNumber == '项目未签约'" style="color: #f56954">合同编号：{{contractNumber}}</div>
      <div class="content" v-else>合同编号：{{contractNumber}}</div>
      <div class="content">合同额：{{value1}} 万元</div>

      <div style="float: right;margin-right: 20px;">
        <el-button type="primary" size="mini" @click="handleAdd" :disabled="addStatus">添加</el-button>
        <el-button type="primary" size="mini" @click="handleChange" :disabled="changeStatus">变更</el-button>
        <el-button type="primary" size="mini" @click="handleSave" :disabled="saveStatus">保存</el-button>
        <el-button type="primary" size="mini" @click="handleSubmit" :disabled="submitStatus">提交</el-button>
        <!--添加权限控制-->
        <!--<el-button type="text" @click="handleAdd" :disabled="roleStatus == true? addStatus : true">添加</el-button>-->
        <!--<el-button type="text" @click="handleChange" :disabled="roleStatus == true? changeStatus : true">变更</el-button>-->
        <!--<el-button type="text" @click="handleSave" :disabled="roleStatus == true? saveStatus : true">保存</el-button>-->
        <!--<el-button type="text" @click="handleSubmit" :disabled="roleStatus == true? submitStatus : true">提交</el-button>-->
      </div>
      <div style="clear: left"></div>
    </div>

    <!--三个表格数据-->
    <!--22222:{{browerHeight}}-->
    <div class="tables" :style="{maxHeight:browerHeight + 'px'}">
      <div>
        <h4 style="margin-bottom: 0px;margin-top: 10px">回款里程碑计划</h4>
        <el-table :data="tableDataOne" :summary-method="getSummaries" show-summary ref="rowData" border
          :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
          :row-style="{height:'50px'}" :cell-style="{padding:0}" style="width: 100%">

          <el-table-column label="回款阶段" width="80" align="center" prop="returnedStage">
          </el-table-column>

          <!-- v-if=false 隐藏该列 -->
          <el-table-column label="id" v-if=false width="100" prop="id">
          </el-table-column>

          <el-table-column label="回款条件" width="150" align="center" prop="returnedCondition">
            <template slot-scope="scope">
              <el-input type="textarea" :rows="1" v-model="scope.row.returnedCondition"
                :disabled="scope.row.disabledStatus2"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="回款比例(%)" align="center" width="120" prop="returnedProportion">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.returnedProportion" style="width: 100px" controls-position="right"
                :disabled="scope.row.disabledStatus2" @change="selectChange(scope.row)" :min="0" :max="100" :step="10">
              </el-input-number>
            </template>
            <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.returnedProportion" :disabled="scope.row.disabledStatus2"></el-input>-->
            <!--</template>-->
          </el-table-column>

          <!--formatter无法转换templete中的数据-->
          <el-table-column label="回款金额(万元)" :formatter="formatreturnedMoney" align="center" width="150"
            prop="returnedMoney">
            <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.returnedMoney" :disabled="scope.row.disabledStatus2"></el-input>-->
            <!--</template>-->
          </el-table-column>

          <el-table-column label="是否完成" :formatter="formatisFinish" align="center" width="80" prop="isFinish">
          </el-table-column>

          <el-table-column label="审核状态" :formatter="formatStatus" align="center" width="80" prop="status">
          </el-table-column>

          <el-table-column label="预计回款日期" align="center" width="180" prop="returnedDate">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.returnedDate" :disabled="dateStatus" @change="dateChange(scope.row)"
                type="date" style="width: 150px" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>

          <el-table-column label="变更原因" align="center" prop="changReason">
            <template slot-scope="scope">
              <el-input type="textarea" @change="changReasonChange(scope.row)" :rows="1" v-model="scope.row.changReason"
                :disabled="scope.row.changeResonStatus"></el-input>
              <!--<el-input type="textarea" :rows="1" v-model="scope.row.changReason" :disabled="dateStatus"></el-input>-->
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div>
        <h4 style="margin-bottom: 0px;margin-top: 10px">回款记录</h4>
        <el-table :data="tableData2" :summary-method="getSummaries" show-summary ref="rowData2" border
          :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
          :row-style="{height:'50px'}" :cell-style="{padding:0}" style="width: 100%">

          <el-table-column type="index" label="回款记录" width="80" align="center">
          </el-table-column>

          <el-table-column label="回款日期" align="center" prop="returnedDate">
          </el-table-column>

          <el-table-column label="到款金额(万元)" align="center" :formatter="formatreturnedMoney" prop="returnedMoney">
          </el-table-column>

          <el-table-column label="剩余未回金额(万元)" align="center" :formatter="formatoutstandingPayment" prop="outMoney">
          </el-table-column>

        </el-table>
      </div>

      <div>
        <h4 style="margin-bottom: 0px;margin-top: 10px">回款计划变更记录</h4>
        <el-table :data="tableData3" ref="rowData3" border
          :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
          :row-style="{height:'50px'}" :cell-style="{padding:0}" style="width: 100%">

          <el-table-column label="回款阶段" width="80" align="center" prop="returnedStage">
          </el-table-column>

          <el-table-column label="回款条件" width="200" align="center" prop="returnedCondition">
          </el-table-column>

          <el-table-column label="变更前回款日期" align="center" width="200" prop="expectedDate">
          </el-table-column>

          <el-table-column label="变更后回款日期" align="center" width="200" prop="changPaymentDate">
          </el-table-column>

          <el-table-column label="变更原因" align="center" prop="changReason">
          </el-table-column>
        </el-table>
      </div>

    </div>

  </div>
</template>
<script>
import { serverGetHttpMethod } from "../../api/api.js"; //
import { serverPostHttpMethod } from "../../api/api.js"; //
import { integrationGetMethod } from "../../api/api.js"; //
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "milepost",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  data() {
    return {
      isChange: false, //是否变更
      disabledStatus: true, //变更原因  默认不可编辑，点击变更按钮后可编辑
      dateStatus: true, //控制 预计回款日期

      roleStatus: false, //根据权限控制按钮

      addStatus: false, //添加 按钮控制
      saveStatus: false, //保存 按钮控制
      submitStatus: false, //提交 按钮控制
      changeStatus: false, //变更 按钮控制
      browerHeight: window.innerHeight - 250,
      projectNumber: "", //项目编号
      projectName: "", //项目名称
      value1: "--", //合同额
      contractMoney: 0, //合同额 计算使用
      contractNumber: "", //合同编号

      //列表数据
      tableDataOne: [], //表格数据从接口获取
      tableData2: [], //表格数据从接口获取
      tableData3: [], //表格数据从接口获取
      loading: true
    };
  },

  //解决重复请求bug
  beforeDestroy() {
    Bus.$off("projectContent");
  },

  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ])
  },
  created() {
    // 从全局变量中获取项目编号
    var storage = window.localStorage;
    // this.projectNumber = storage.projectNumber;
    // this.projectName = storage.projectName;
    // this.projectId = storage.projectId;
    //测试数据
    // this.projectId=103657;
    // this.projectNumber = "PM-5137";
    // this.projectName = "贵安新区重点投资项目智能监控系统试点项目";
    // this.getMoneyValues();   //从接口获取合同额、回款、回款率数据
    // this.getProjectData();   //获取汇款记录

    //国图修改
    this.contractNumber = storage.contractNumber;
    this.projectName = storage.contractName;
    // this.getData(this.contractNumber);

    this.contractMoney = storage.contractMoney; //合同额 计算使用
    this.value1 = storage.contractMoney; //合同额（万元）
    this.getPlanDatas(); //获取回款的里程碑计划
    this.getPlanDatas2(); //获取 回款记录
    this.getPlanDatas3(); //获取 回款变更记录
  },

  //解决页面切换到项目信息后 再切换到里程碑页面时，切换项目不更新数据bug
  mounted() {
    Bus.$on("projectContent", item => {
      if (item) {
        // this.projectNumber = item.projectNumber;
        // this.projectName = item.projectName;
        // this.projectId = item.id;
        // this.getMoneyValues();   //从接口获取合同额、回款、回款率数据
      }
    });
    Bus.$on("memberRole", item => {
      // debugger
      console.log("回款里程碑计划角色信息：" + item);
      // if (item) {
      if (item == 2 || item == 3) {
        this.roleStatus = true; //销售才能编辑
      } else {
        this.roleStatus = false;
      }
      // }
    });
  },

  methods: {
    //回款比例值变化值
    selectChange(row) {
      console.log(row);
      console.log("=========row====");
      // row.returnedMoney = row.returnedProportion * this.contractMoney / 100
      row.returnedMoney = row.returnedProportion * this.contractMoney * 100;
    },

    //求和计算方法
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }

        // 计算 剩余未回金额outMoney,将回款记录的最后一个数据赋值
        if (column.property == "outMoney") {
          const values = data.map(item => Number(item[column.property]));
          console.log("====outMoney=111===");
          console.log(values);
          var last = values[values.length - 1];
          sums[index] = this.formatThousands(last);
          return;
        }

        //计算 回款金额
        if (column.property == "returnedMoney") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 万元';
            var value = (sums[index] / 1).toFixed(2);
            value = this.formatThousands(value);
            // sums[index] = value + '万元';
            sums[index] = value + "";
          }
        }

        //计算 回款比例
        if (column.property == "returnedProportion") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' %';
          }
        }
      });
      return sums;
    },

    //添加
    handleAdd() {
      var index = this.tableDataOne.length;
      var item = {};
      item["id"] = null;
      item["returnedStage"] = index + 1; //回款阶段
      item["contractNumber"] = this.contractNumber; //合同编号
      item["returnedCondition"] = ""; //回款条件
      item["returnedMoney"] = 0; //回款金额
      item["returnedProportion"] = 0; //回款比例
      item["returnedDate"] = ""; //回款日期         可修改
      item["isFinish"] = 0; //是否完成     可修改
      item["status"] = 0; //状态 0 已保存  1审核中 2已审核    可修改
      item["returnedType"] = 32; //类型
      this.tableDataOne.push(item);

      console.log(this.tableDataOne);
      this.tableDataOne.forEach(item => {
        if (item.status != 2) {
          this.dateStatus = false;
        }
        item["changeResonStatus"] = true; //新增记录 不可操作变更原因
      });
    },

    //保存
    handleSave() {
      //访问 变更 更新接口
      if (this.isChange) {
        console.log("访问 变更 更新接口");
        var data = [];
        this.tableDataOne.forEach(item => {
          //只保存 有修改的数据
          console.log(item.changReason);
          // if (item.reviewStatus && item.changReason) {
          //保存时变更原因可以不写
          if (item.reviewStatus) {
            item["changPaymentDate"] = item.returnedDate; //变更后日期
            item["returnedPlanId"] = item.id; //变更计划id
            item["contractNumber"] = this.contractNumber; //合同编号
            data.push(item);
          }
        });
        // var data = this.tableDataOne;
        console.log("保存/更新 的记录数据");
        console.log(data);
        if (data.length > 0) {
          var url = "/sgpm/rest/api/server/pm/project/return/money/chang";
          serverPostHttpMethod(url, data)
            .then(res => {
              if (res.data.code == 200) {
                alert("保存成功");
                this.getPlanDatas(); //获取 回款的里程碑计划
                this.getPlanDatas3(); //获取 回款计划变更记录
              } else {
                alert("保存失败");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // alert('更新失败！请更改回款日期并填写更新原因')
          alert("更新失败！请修改预计回款日期");
        }
      }

      //访问 保存 接口
      if (!this.isChange) {
        console.log("访问 保存 接口");
        var data = [];
        //修改回款比例参数 以小数形式
        this.tableDataOne.forEach(item => {
          // item["returnedProportion"] = item["returnedProportion"] / 100
          //回款日期必填
          if (item["returnedDate"] != "") {
            data.push(item);
          }
        });
        console.log(data);
        if (data.length > 0) {
          var url = "/sgpm/rest/api/server/pm/project/return/money/plan";
          serverPostHttpMethod(url, data)
            .then(res => {
              if (res.data.code == 200) {
                alert("保存成功");
                this.getPlanDatas(); //获取 回款的里程碑计划
              } else {
                alert("保存失败");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          alert("请选择回款日期！");
        }
      }
    },
    //提交
    handleSubmit() {
      //访问 变更 更新接口
      if (this.isChange) {
        console.log("访问 变更 更新接口");
        var data = [];
        this.tableDataOne.forEach(item => {
          // item.status = 1;  //变更提交时 审核状态 修改为审核中，整体提交
          // item.status = 2;  //现在没审批流 直接更改为已审核（现在状态就是已审核）
          if (item.reviewStatus && item.changReason) {
            item["changPaymentDate"] = item.returnedDate; //变更后日期
            item["returnedPlanId"] = item.id; //变更计划id
            item["contractNumber"] = this.contractNumber; //合同编号
            data.push(item);
          }
        });
        if (data.length > 0) {
          var url = "/sgpm/rest/api/server/pm/project/return/money/chang";
          serverPostHttpMethod(url, data)
            .then(res => {
              if (res.data.code == 200) {
                alert("保存成功");
                this.getPlanDatas(); //获取 回款的里程碑计划
                this.getPlanDatas3(); //获取 回款计划变更记录
              } else {
                alert("保存失败");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          alert("更新失败！请修改预计回款日期并填写变更原因");
        }
      }

      //访问 保存 接口
      if (!this.isChange) {
        console.log("访问 保存 更新接口");
        this.tableDataOne.forEach(item => {
          item.status = 2; //提交时 审核状态 修改为已审核
        });
        var data = this.tableDataOne;
        var url = "/sgpm/rest/api/server/pm/project/return/money/plan";
        serverPostHttpMethod(url, data)
          .then(res => {
            if (res.data.code == 200) {
              alert("保存成功");
              this.getPlanDatas(); //获取 回款的里程碑计划
            } else {
              alert("保存失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //变更
    handleChange() {
      this.dateStatus = false; //点变更时 预计回款日期 可操作
      this.isChange = true;
      this.tableDataOne.forEach(item => {
        item["changeResonStatus"] = false; //变更原因 可编辑
      });
    },

    //预计回款日期 值变化时，变更原因 可编辑，且必填
    dateChange(row) {
      row.reviewStatus = true; //记录该数据被修改了
      // row.changeResonStatus = false;
      // console.log(row)
      // console.log(this.tableDataOne)
    },

    //获取回款里程碑计划数据
    getPlanDatas() {
      this.tableDataOne = [];
      var params = { contractNumber: this.contractNumber };
      var url = "/sgpm/rest/api/server/pm/project/return/money/plan";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          this.loading = false;
          if (jsonData != null) {
            this.tableDataOne = jsonData;
          } else if (jsonData == null) {
            //有合同编号 没数据时，不能 变更操作，只能 添加 保存 提交
            this.changeStatus = true;
          }

          //已审核 的不能在添加操作，可以再提交
          if (this.tableDataOne[0] && this.tableDataOne[0].status == 2) {
            this.addStatus = true;
            this.submitStatus = false; //已审核的 可以提交 ============>
            this.dateStatus = true; // 已审核的 预计回款日期默认不可编辑
            this.changeStatus = false; //已审核的 可以变更
          } else if (this.tableDataOne[0] && this.tableDataOne[0].status == 1) {
            //审核中的 不能添加 保存 变更
            this.addStatus = true;
            this.submitStatus = true;
            this.changeStatus = true;
            this.saveStatus = true;
          } else {
            this.addStatus = false; //已保存的   可以添加
            this.submitStatus = false; //已保存的 可以提交
            this.changeStatus = true; //已保存的 不可以变更
            this.dateStatus = false; // 已保存的 预计回款日期默认可编辑
          }

          for (var i = 0; i < this.tableDataOne.length; i++) {
            var item = this.tableDataOne[i];
            item["expectedPaymentDate"] = item.returnedDate;
            item["changeResonStatus"] = true; //控制 变更原因
            item["reviewStatus"] = false; //review值变化的状态 记录review的数据

            if (item.id != null) {
              item["disabledStatus2"] = true; //控制回款条件 回款比例 回款金额
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取 回款记录
    getPlanDatas2() {
      this.tableData2 = [];
      var params = { contractNumber: this.contractNumber };
      var url = "/sgpm/rest/api/server/pm/project/return/money/item";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          console.log("=========getPlanDatas2===========");
          console.log(jsonData);

          var contractMoney = this.contractMoney * 10000; //合同额
          console.log("=====contractMoney==========" + contractMoney);
          // outstandingPayment 新需求 前端计算剩余未回款金额，动态变化的
          jsonData.forEach(item => {
            contractMoney -= item.returnedMoney;
            console.log(contractMoney);
            item["outMoney"] = contractMoney; //剩余未回款金额
          });

          this.tableData2 = jsonData;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取 回款变更记录
    getPlanDatas3() {
      this.tableData3 = [];
      var params = { contractNumber: this.contractNumber };
      var url = "/sgpm/rest/api/server/pm/project/return/money/chang";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          console.log("=========getPlanDatas3===========");
          console.log(jsonData);
          this.tableData3 = jsonData;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //根据项目id获取项目信息,项目切换时 调用该方法
    getProjectData() {
      var params = { projectId: this.projectId };
      var url = "/sgpm/rest/api/server/pm/project";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (jsonData != null && jsonData.CONTRACTNUMBER != null) {
            this.contractNumber = jsonData.CONTRACTNUMBER; //合同编号
            this.getPlanDatas(); //获取回款的里程碑计划
            this.getPlanDatas2(); //获取 回款记录
            this.getPlanDatas3(); //获取 回款变更记录

            //已审核 时不能添加
            console.log(333333333333333);
            console.log(this.tableDataOne);
            //有合同编号的
            this.saveStatus = false;
            this.submitStatus = false;
            this.changeStatus = false;
          } else {
            this.contractNumber = "项目未签约"; //没有合同编号的
            this.tableDataOne = [];
            this.tableData2 = [];
            this.tableData3 = [];
            this.addStatus = true;
            this.saveStatus = true;
            this.submitStatus = true;
            this.changeStatus = true;
          }

          // //添加 按钮控制 没有合同编号的不能添加
          // if( this.contractNumber == '项目未签约'){
          //   this.saveStatus=true;
          //   this.submitStatus=true;
          //   this.addStatus=true;
          //   this.changeStatus=true;
          // }else if(this.contractNumber != '项目未签约'){
          //   this.addStatus=true;
          // }else{
          //   this.saveStatus=false;
          //   this.submitStatus=false;
          //   this.addStatus=false;
          //   this.changeStatus=false;
          // }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 剩余未回款金额 转换
    formatoutstandingPayment(row) {
      return this.formatThousands(row.outMoney);
    },

    // 回款金额 转换
    formatreturnedMoney(row) {
      return this.formatThousands(row.returnedMoney);
    },
    //将数字转为 金额格式
    formatThousands(value) {
      // return value
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

    // 回款比例 格式转换
    formatreturnedProportion(row) {
      return row.returnedProportion * 100 + "%";
    },
    //审核状态 转换
    formatStatus(row) {
      switch (row.status) {
        case 0:
          return "已保存";
          break;
        case 1:
          return "审核中";
          break;
        case 2:
          return "已审核";
          break;
        case 3:
          return "已提交";
          break;
        default:
          return "未知";
      }
    },

    //是否完成 状态转换
    formatisFinish(row) {
      switch (row.isFinish) {
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
        default:
          return "未知";
      }
    },

    //判断hash是否为空
    checkData(data) {
      for (var i in data) {
        return true;
      }
      return false;
    },

    //获取合同数据
    getData(contractNumber) {
      // var url = '/sgpm/rest/api/integration/contract/' + contractNumber;
      var url = `/sgpm/rest/api/integration/contract/${contractNumber}?companyId=${this.userinfo.account_id}`;
      integrationGetMethod(url)
        .then(res => {
          console.log(res.data.data);
          //判断合同数据是否存
          if (this.checkData(res.data.data)) {
            this.contractMoney = res.data.data.contractMoneyWanYuan; //合同额 计算使用
            this.value1 = res.data.data.contractMoneyWanYuan; //合同额（万元）
          }
        })
        .catch(err => {
          console.log(err);
        });

      this.getPlanDatas(); //获取回款的里程碑计划
      this.getPlanDatas2(); //获取 回款记录
      this.getPlanDatas3(); //获取 回款变更记录
    },

    //获取合同额 数据
    getMoneyValues() {
      var params = { projectId: this.projectId };
      var url = "/sgpm/rest/api/server/pm/project/return/money/percentage";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (jsonData != null) {
            // this.value1 = this.formatThousands(jsonData.contractAmount); //合同额
            this.value1 = jsonData.contractAmount; //合同额
            this.contractMoney = jsonData.contractAmount;
            // localStorage.setItem("contractMoney",this.contractMoney*10000)
          } else {
            this.value1 = "--"; //合同额
          }

          this.getProjectData(); //获取汇款记录
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>

<style scoped>
.Layout {
  /*margin-top: -10px;*/
  /* margin-left: 200px; */
  /*z-index: 10;*/
  padding-left: 10px;
}

.content {
  float: left;
  margin-left: 15px;
  font-weight: bold;
}

.tables {
  overflow-y: auto;
  width: 100%;
}
</style>
