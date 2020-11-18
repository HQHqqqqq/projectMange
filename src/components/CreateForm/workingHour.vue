<template>
  <div class="work-sheet" >
    <div class="table1" v-if="table1nK">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="3"><div class="grid-content bg-purple"><p class="titile">查询工时</p></div></el-col>
        <el-col :span="2" class="unit"><div class="grid-content bg-purple-light">单位：月</div></el-col>
     </el-row>
      <el-table :data="tableData1"
        :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
        :row-style="{height:'50px'}" :cell-style="{padding:0}" stripe style="width: 100%" border height="250">
        <el-table-column type="index" width="38" label="序号"></el-table-column>
        <el-table-column prop="staffname" label="姓名" width="60"></el-table-column>
        <el-table-column label="工时描述">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.taskDesc" placement="bottom">
              <span class="project-name">{{scope.row.taskDesc}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="工作类型" width="100">
          <template slot-scope="scope">
            <span class="project-name">{{projectTypeNameConfig[scope.row.projectTypeName]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workSheet" label="实际工时" width="80"></el-table-column>
        <el-table-column label="工时占比" width="80">
          <template slot-scope="scope">
            <span class="project-name">{{scope.row.hourScale*100+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="80">
          <template slot-scope="scope">
            <span class="project-name">{{dismissedSuggestionsConfig[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dismissedSuggestions" label="审核内容" width="100"></el-table-column>
        <el-table-column prop="msgdatetime" label="时间" width="90"></el-table-column>
      </el-table>
    </div>
    <div class="table-work">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="3"><div class="grid-content bg-purple"><p class="titile">项目工时统计</p></div></el-col>
        <el-col :span="2" class="unit">单位：{{table1nK?"月":"天"}}</el-col>
    </el-row>
      
      <el-table :data="tableData2"
        :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
        :row-style="{height:'50px'}" :cell-style="{padding:0}" stripe style="width: 100%" border show-summary
        :summary-method="getSummaries" max-height="250">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column :prop="item.key" :label="item.label" v-for="item in listConfig" :key="item.val">
          <!-- <template slot-scope="scope">
            <span class="project-name">{{scope.row[val.key]}}</span>
          </template>-->
        </el-table-column>
        <el-table-column :prop="item.key" :label="item.label" v-for="item in dataConfig" :key="item.val">
          <!-- <template slot-scope="scope">
            <span class="project-name">{{scope.row[val.key]}}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="littleHour" label="小计"></el-table-column>
        <el-table-column prop="countHour" label="总工时合计" width="100"></el-table-column>
        <!-- <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="subDeptName" label="B级单位"></el-table-column>
        <el-table-column prop="deptName" label="C级单位"></el-table-column>
        <el-table-column prop="staffName" label="姓名"></el-table-column>

        <el-table-column prop="littleHour" label="小计"></el-table-column>
        <el-table-column prop="countHour" label="总工时合计"></el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryWorkSheet, workSheetStatistics } from "../../api/api.js"; //
import { mapState, mapActions } from "vuex";
import Bus from "../../bus.js";
export default {
  name: "WorkingHour",
  data() {
    return {
      tableData1: [],
      tableData2: [],
      dateList: [],
      dataConfig: [],
      dismissedSuggestionsConfig: {
        0: "未编写",
        1: "已保存",
        2: "已提交",
        3: "已评价"
      },
      projectTypeNameConfig: {
        1: "技术工作",
        2: "管理沟通工作",
        3: "人员培养团队建设工作",
        4: "默认技术工作,行政事务",
        5: "售前支持",
        6: "员工培养",
        7: "个人学习",
        8: "默认行政事务"
      }
    };
  },

  created() {
    Bus.$on("projectContent", item => {
      this.queryWorkSheetTable();
      this.WorkSheetStatisticsTable();
    });
  },
  mounted() {
    this.queryWorkSheetTable();
    this.WorkSheetStatisticsTable();
    // console.log(this.dataConfig);
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    table1nK(){
      if(this.userinfo.account_id=="8416498716893399290"){
        return false
      }else{
        return true
      }
    },
    listConfig(){
      let ary = [
        // { key: "projectName", label: "项目名称" },
        { key: "subDeptName", label: "B级单位" },
        { key: "deptName", label: "C级单位" },
        { key: "staffName", label: "姓名" }
      ]
      if(this.userinfo.account_id=="8416498716893399290"){
        ary.splice(1,1)
      }else{
        ary
      }
      return ary
    }
  },
  methods: {
    //查询工时
    queryWorkSheetTable() {
      var storage = window.localStorage;
      queryWorkSheet(
        `/worksheet/hours/item/project?projectId=${storage.projectNumber}&staffCode=${this.userinfo.code}`,
        null
      )
        .then(res => {
          var result = res.data.data;
          this.tableData1 = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //工时分布情况统计
    WorkSheetStatisticsTable() {
      var storage = window.localStorage;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var strDate = date.getDate();
      var curDate = year + "-" + month + "-" + strDate;
      workSheetStatistics(
        `/worksheet/project/hours/query?projectId=${storage.projectNumber}&startTime=2019-01-01&endTime=${curDate}&staffCode=${this.userinfo.code}&accountId=${storage.companyId}`,
        null
      )
        .then(res => {
          this.dataConfig = [];
          var result = res.data.data;
          let mounth = this.getNowFormatDate();
          let allDate = [];
          let tableResult = [];
          for (var i = 0; i < mounth; i++) {
            allDate.push(`2020-0${i + 1}`);
          }
          this.dateList = allDate;
          allDate.forEach((item, index) => {
            this.dataConfig.push({
              key: index + 1 + "月",
              label: index + 1 + "月"
            });
          });
          result.forEach((item, index) => {
            var newMonth = [];
            for (var i = 0; i < allDate.length; i++) {
              item.month.filter(ztem => {
                if (ztem.msgTime == allDate[i]) {
                  newMonth.push(ztem);
                  i++;
                }
              });
              newMonth.push({
                hours: 0,
                msgTime: allDate[i]
              });
            }
            let cObj = {};
            newMonth.forEach((item, index) => {
              cObj[index + 1 + "月"] = item.hours;
            });
            tableResult.push({
              projectName: item.projectName,
              subDeptName: item.subDeptName,
              deptName: item.deptName,
              staffName: item.staffName,
              littleHour: item.littleHour,
              countHour: item.countHour,
              ...cObj
            });
          });
          console.log(tableResult);

          this.tableData2 = tableResult;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //截取2019-01 月份 返回01
    jqDate(str) {
      return Number(str.match(/-(\S*)/)[1]);
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = month;
      return currentdate;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
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
          sums[index] += "";
        } else {
          sums[index] = "--";
        }
      });
      return sums;
    }
  }
};
</script>

<style scoped lang="scss">
.work-sheet {
  margin: 0 20px 0 20px;
  .titile {
    padding: 0;
    margin: 10px 0;
    font-weight: bold;
  }
  .table1 {
    .project-name {
      width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .unit{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table-work{
    padding-bottom: 10px;
  }
}
</style>
