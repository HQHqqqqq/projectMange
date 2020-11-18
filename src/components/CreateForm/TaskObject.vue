<template>
  <div class="complete">
    <div class="tablist">
      <el-row :gutter="24" class="latabtask">
        <Time :name="taskname"></Time>
      </el-row>
      <el-table
        v-loading="loading"
        max-height="650"
        current-row-key
        append
        type="index"
        slot="empty"
        :data="targetnum"
        border
        style="width: 100%"
        :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      >
        <el-table-column prop="deptName" fixed label="部门名称" width="180"></el-table-column>
        <el-table-column prop="lenNum" label="1-11月完成">
          <el-table-column prop="totalPayments" label="总回款(万元)" width="140">
            <template slot-scope="scope">
              <p>{{ scope.row.totalPayments |formatThousands }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="purePayments" label="纯回款(万元)" width="140">
            <template slot-scope="scope">
              <p>{{ scope.row.purePayments |formatThousands }}</p>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="contract" label="2018年">
          <el-table-column prop="purePaymentsTarget" label="纯回款目标(万元)" width="150">
            <template slot-scope="scope">
              <p>{{ scope.row.purePaymentsTarget |formatThousands }}</p>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="purePaymentsGap" label="纯回款任务缺口(万元)" width="160">
          <template slot-scope="scope">
            <p>{{ scope.row.purePaymentsGap |formatThousands }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="contract" label="1-11月完成" width="170">
          <div>
            <el-table-column prop="pureContractAmount" label="纯合同额(万元)" width="150">
              <template slot-scope="scope">
                <p>{{ scope.row.pureContractAmount |formatThousands }}</p>
              </template>
            </el-table-column>
          </div>
        </el-table-column>
        <el-table-column prop="contract" label="2018年">
          <div>
            <el-table-column prop="pureContractAmountTarget" label="纯合同额目标(万元)" width="170">
              <template slot-scope="scope">
                <p>{{ scope.row.pureContractAmountTarget |formatThousands }}</p>
              </template>
            </el-table-column>
          </div>
        </el-table-column>
        <el-table-column prop="contractTaskGap" label="合同任务缺口(万元)" width="160">
          <template slot-scope="scope">
            <div
              type="index"
              :class="Number(scope.row.contractTaskGap)> 0 ? 'active':'actives'"
            >{{scope.row.contractTaskGap  | formatThousands  }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="popout" v-if=" this.targetnum==''" >
      所管理部门无相关信息或无操作权限
    </div>-->
  </div>
</template>
<script>
import Time from "@/components/time/time.vue";
import { departmentTabel } from "../../api/api.js";

import { mapState, mapActions } from "vuex";
export default {
  name: "taskobject",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  components: {
    Time
  },
  data() {
    return {
      targetnum: [],
      loading: true,
      taskname: "taskobject"
    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  created() {
    this.taskTab();
  },
  mounted() {},
  methods: {
    taskTab() {
      let params = {
        staffCode: this.userinfo.code
      };
      departmentTabel("/accounting/tc/info", params)
        .then(res => {
          this.targetnum = res.data.data;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  filters: {
    formatThousands: function(value) {
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
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
.tablist {
  width: 98%;
  margin: auto;
  margin-bottom: 15px;
}

.popout {
  font-size: 26px;
  text-align: center;
}
.latabtask {
  height: 60px;
  line-height: 60px;
  color: #606266;
  font-size: 15px;
  font-weight: 600;
  width: calc(100% - 2px);
  margin-left: 1px !important;
  background: #fff;
}
.el-table td,
.el-table th {
  padding: 4px 0 !important;
}
.el-table__row > td:first-child > div:first-child {
  text-align: left !important;
  padding: 0;
  padding-left: 3px;
}
// .el-table .cell{
//   line-height: 18px!important;
// }
.el-table .cell {
  padding: 4px !important;
}
.textCon {
  clear: both;
  text-align: center;
}
@media screen and (max-width: 800px) and (min-width: 300px) {
  .latabtask {
    line-height: 50px;
  }
  .complete .el-table--border td:first-child .cell {
    padding-left: 4px !important;
    text-align: center !important;
  }
}
.is-scroll-left {
  min-height: 300px !important;
}
.activer {
  color: red;
}
.active {
  color: #f56954!important;
}
.actives {
  color: #00ff00!important;
}
@media screen and (min-width: 319px) and (max-width: 750px) {
  .exports {
    position: absolute;
    right: 0;
    bottom: 60px !important;
  }
}
.exports {
  position: absolute;
  right: 0;
  bottom: 65px;
}
</style>




