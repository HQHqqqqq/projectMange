<template>
  <div class="Layout">
    <!--tableDataOne:{{this.tableDataOne}}-->
    <!--回款条件review &#45;&#45;项目经理-->
    <div style="font-size: 14px;font-weight: bold;text-align: center">{{ projectName }}</div>

    <div>
      <div
        class="content"
        v-if="contractNumber == '项目未签约'"
        style="color: #f56954"
      >合同编号：{{ contractNumber }}</div>
      <div class="content" v-else>
        合同编号:
        <el-select size="mini" v-model="contractNumber" placeholder="请选择" @change="contractChange">
          <el-option
            v-for="item in nkcontractNumberAry"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="content" style="margin-left:10px">合同金额：{{ contractMoney }} 万元</div>
      <div style="float: right;margin-right: 20px;">
        <!--<el-button type="text" @click="handleSave" :disabled="saveStatus">保存</el-button>-->
        <el-button
          type="primary"
          size="mini"
          @click="handleSave"
          :disabled="roleStatus == true ? saveStatus : true"
        >保存</el-button>
      </div>
      <div style="clear: left"></div>
    </div>

    <!--三个表格数据-->
    <div class="tables" :style="{ maxHeight: browerHeight + 'px' }">
      <div>
        <h4 style="margin-bottom: 0px;margin-top: 10px">回款条件review</h4>
        <el-table
          :data="tableDataOne"
          :summary-method="getSummaries"
          show-summary
          ref="rowData"
          border
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
          <el-table-column label="回款阶段" width="80" align="center" prop="returnedStage"></el-table-column>

          <!-- v-if=false 隐藏该列 -->
          <el-table-column label="id" v-if="false" width="100" prop="id"></el-table-column>

          <el-table-column label="回款条件" width="150" align="center" prop="returnedCondition">
            <template slot-scope="scope">
              <el-input
                type="textarea"
                :rows="1"
                v-model="scope.row.returnedCondition"
                :disabled="disabledStatus"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="回款比例(%)" align="center" width="150" prop="returnedProportion">
            <!--<template slot-scope="scope">-->
            <!--<el-input-number v-model="scope.row.returnedProportion" style="width: 100px" controls-position="right"-->
            <!--:disabled="disabledStatus"-->
            <!--:min="0" :max="100">-->
            <!--</el-input-number>-->
            <!--</template>-->
          </el-table-column>

          <el-table-column
            label="回款金额(万元)"
            :formatter="formatreturnedMoney"
            align="center"
            width="150"
            prop="returnedMoney"
          >
            <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.returnedMoney" :disabled="disabledStatus"></el-input>-->
            <!--</template>-->
          </el-table-column>

          <el-table-column label="回款日期" align="center" width="120" prop="returnedDate">
            <!--<template slot-scope="scope">-->
            <!--<el-date-picker-->
            <!--v-model="scope.row.returnedDate"-->
            <!--:disabled="disabledStatus"-->
            <!--type="date"-->
            <!--style="width: 150px"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--placeholder="选择日期">-->
            <!--</el-date-picker>-->
            <!--</template>-->
          </el-table-column>

          <el-table-column
            label="是否完成"
            :formatter="formatisFinish"
            align="center"
            width="80"
            prop="isFinish"
          ></el-table-column>

          <el-table-column label="是否满足回款条件" align="center" width="140" prop="isSatisfy">
            <template slot-scope="scope">
              <div v-if="scope.row.returnedStage == '总计'"></div>
              <div v-else>
                <el-switch
                  v-model="scope.row.isSatisfy"
                  @change="dateChange(scope.row)"
                  active-value="1"
                  inactive-value="0"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="满足情况描述" align="center" prop="satisfactionDesc">
            <template slot-scope="scope">
              <div v-if="scope.row.returnedStage == '总计'"></div>
              <div v-else>
                <el-input
                  type="textarea"
                  @change="dateChange(scope.row)"
                  :rows="1"
                  v-model="scope.row.satisfactionDesc"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div>
        <h4 style="margin-bottom: 0px;margin-top: 10px">回款记录</h4>
        <el-table
          :data="tableData2"
          :summary-method="getSummaries"
          show-summary
          ref="rowData2"
          border
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
          <!--<el-table-column v-if="sumStatus" label="总计" width="80" align="center" prop="returnedStage">-->
          <!--</el-table-column>-->
          <el-table-column type="index" label="回款记录" width="80" align="center"></el-table-column>

          <el-table-column label="回款日期" align="center" prop="returnedDate"></el-table-column>

          <el-table-column
            label="到款金额(万元)"
            :formatter="formatreturnedMoney"
            align="center"
            prop="returnedMoney"
          ></el-table-column>

          <el-table-column
            label="剩余未回金额(万元)"
            :formatter="formatoutstandingPayment"
            align="center"
            prop="outMoney"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { serverGetHttpMethod, integrationGetMethod } from "../../api/api.js"; //
import { serverPostHttpMethod } from "../../api/api.js"; //
import Bus from "../../bus";

export default {
  name: "moneyback-two",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  data() {
    return {
      roleStatus: false, //根据权限控制按钮
      disabledStatus: true, //默认不可编辑
      saveStatus: false, //保存 按钮控制
      sumStatus: false,
      browerHeight: window.innerHeight - 250,
      projectName: "", //项目名称
      contractNumber: "", //合同编号
      contractMoney: 0, //合同额 计算使用
      nkcontractNumberAry: [], //南康合同编号select

      //列表数据
      tableDataOne: [], //表格数据从接口获取
      tableData2: [], //表格数据从接口获取
      loading: true
    };
  },

  //解决重复请求bug
  beforeDestroy() {
    Bus.$off("projectContent");
  },

  created() {
    // 从全局变量中获取项目编号
    var storage = window.localStorage;
    this.projectNumber = storage.projectNumber;
    this.projectName = storage.projectName;
    this.projectId = storage.projectId;
    // this.getProjectData();   //获取汇款记录

    this.getMoneyValues(); //从接口获取合同额、回款、回款率数据

    // 切换项目后，更新里程碑信息
    // Bus.$on("projectContent", item => {
    //   if (item) {
    //     // console.log(item.projectNumber);
    //     this.projectNumber = item.projectNumber;
    //     this.projectName = item.projectName;
    //     this.projectId = item.id;
    //     this.getProjectData();
    //   }
    // });
  },
  //解决页面切换到项目信息后 再切换到里程碑页面时，切换项目不更新数据bug
  mounted() {
    Bus.$on("projectContent", item => {
      if (item) {
        // console.log(item.projectNumber);
        this.projectNumber = item.projectNumber;
        this.projectName = item.projectName;
        this.projectId = item.id;
        this.getMoneyValues(); //从接口获取合同额、回款、回款率数据
        // this.getProjectData();
      }
    });
    Bus.$on("memberRole", item => {
      // item=0时没走
      // if (item) {
      console.log("回款条件角色信息：" + item);
      if (item == 1 || item == 3) {
        this.roleStatus = true; //项目经理才能编辑
      } else {
        this.roleStatus = false;
      }
      // }
    });
  },

  methods: {
    //是否满足回款条件值、满足情况描述 变化时
    dateChange(row) {
      row.reviewStatus = true; //记录该数据被修改了
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }

        //计算 剩余未回金额outMoney,将回款记录的最后一个数据赋值
        if (column.property == "outMoney") {
          const values = data.map(item => Number(item[column.property]));
          console.log("====outMoney=222===");
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
            // var value = (sums[index] / 10000).toFixed(2) ;
            // var value = (sums[index] / 1).toFixed(2);
            var value = sums[index] / 1;
            // toFixed()方式不遵守四舍五入规则
            // var value = Math.round(sums[index] * 1000)/1000;
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

    //保存
    handleSave() {
      //访问 保存 接口
      console.log("访问 保存 接口");
      var data = [];
      this.tableDataOne.forEach(item => {
        if (item.isSatisfy == "1") {
          item["isSatisfy"] = 1;
        } else {
          item["isSatisfy"] = 0;
        }
        console.log(item);
        if (item.reviewStatus) {
          //满足情况描述 有内容时才更新
          // if (item.satisfactionDesc != "") {
          data.push(item);
          // }
        }
      });
      console.log(data);
      if (data.length > 0) {
        var url = "/sgpm/rest/api/server/pm/project/return/money/plan";
        serverPostHttpMethod(url, data)
          .then(res => {
            if (res.data.code == 200) {
              alert("保存成功");
              // this.getPlanDatas(); //获取 回款的里程碑计划
              //转换字段
              this.tableDataOne.forEach(item => {
                if (item.isSatisfy == 1) {
                  item["isSatisfy"] = "1";
                } else {
                  item["isSatisfy"] = "0";
                }
              });
            } else {
              alert("保存失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        alert("更新失败！请修改满足条件及描述内容");
        //转换字段
        this.tableDataOne.forEach(item => {
          // if(!item.reviewStatus){
          if (item.isSatisfy == 1) {
            item["isSatisfy"] = "1";
          } else {
            item["isSatisfy"] = "0";
          }
          // }
        });
      }
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
            var sum1 = 0; //总计 回款金额
            var sum2 = 0; //总计 回款比例
            //转换字段
            this.tableDataOne.forEach(item => {
              sum1 += item.returnedMoney;
              sum2 += item.returnedProportion;
              if (item.isSatisfy == 1) {
                item["isSatisfy"] = "1";
              } else {
                item["isSatisfy"] = "0";
              }

              item["reviewStatus"] = false; //review值变化的状态 记录review的数据
            });
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
          // console.log('=========getPlanDatas2===========');
          // console.log(jsonData);

          var contractMoney = this.contractMoney * 10000; //合同额 从接口获取的数据
          // var contractMoney = localStorage.getItem("contractMoney");//合同额
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

    //根据项目id获取项目信息,项目切换时 调用该方法
    getProjectData() {
      var params = { projectId: this.projectId };
      var url = "/sgpm/rest/api/server/pm/project";
      serverGetHttpMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (
            jsonData != null &&
            jsonData.CONTRACTNUMBER != null &&
            jsonData.CONTRACTNUMBER != ""
          ) {
            let numbers = jsonData.CONTRACTNUMBER.split(",");
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
            this.contractNumber = aryNum[0].label; //合同编号
            this.getPlanDatas(); //获取回款的里程碑计划
            this.getPlanDatas2(); //获取 回款记录
            this.getContractData(); // 查询单个合同金额

            //已审核 时不能添加
            // console.log(333333333333333);
            // console.log(this.tableDataOne);
            //有合同编号的
            // this.saveStatus = false;
            // this.submitStatus = false;
            // this.changeStatus = false;
          } else {
            this.contractNumber = "项目未签约"; //没有合同编号的
            this.tableDataOne = [];
            this.tableData2 = [];
            // this.addStatus = true;
            this.saveStatus = true;
            // this.submitStatus = true;
            // this.changeStatus = true;
          }
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
    formatThousands: function(value) {
      // return value;
      value = value / 10000;
      value = value.toFixed(2); //万元单位 保留二位小数点
      // value = Math.round(value*100)/100;
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
        default:
          return "未知";
      }
    },

    //是否满足回款条件 转换
    // formatisSatisfy(row) {
    //   switch (row.isSatisfy) {
    //     case 0:
    //       return '0';
    //       break;
    //     case 1:
    //       return '1';
    //       break;
    //   }
    // },

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
          return "";
      }
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
          } else {
            this.value1 = "--"; //合同额
          }

          this.getProjectData(); //获取汇款记录
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取合同数据 切换合同时查询合同金额
    getContractData() {
      var params = { contractNumber: this.contractNumber };
      var projectData = JSON.parse(localStorage.getItem("projectData"));
      var company_id = projectData.company_id;
      var url = "/sgpm/rest/api/integration/data/contract/" + company_id;
      integrationGetMethod(url, params)
        .then(res => {
          var jsonData = res.data.data;
          if (jsonData != null) {
            this.contractMoney = (jsonData.CONTRACTMONEY / 10000).toFixed(2);
            console.log(jsonData);

            this.getPlanDatas();
            this.getPlanDatas2();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    contractChange(val) {
      this.contractNumber = val;
      // this.getPlanDatas();
      // this.getPlanDatas2();
      this.getContractData();
    }
  }
};
</script>

<style></style>

<style scoped>
.Layout {
  /*margin-top: -10px;*/
  /* margin-left: 200px; */
  /*z-index: 10;*/
  padding-left: 10px;
}

.content {
  float: left;
  font-weight: bold;
}

.tables {
  overflow-y: auto;
  width: 100%;
}
</style>
