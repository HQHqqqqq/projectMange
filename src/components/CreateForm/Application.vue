<template>
  <div class="application">
    <div class="navTop" v-if=" this.department!=''" style="float:right">
      <el-row class="el-right mr15 navrig">
        <el-col :span="2" :offset="11" class="monad">单位：万元</el-col>
        <Time :span="4" :name="depname" class="navrtime"></Time>

        <el-radio-group
          v-model="names.screen"
          @change="labScreen"
          style="margin-right: 25px;float:right;margin-top:12px"
        >
          <el-radio v-model="names.screen" :label="3">全部</el-radio>
          <el-radio v-model="names.screen" :label="1">在实施项目</el-radio>
          <el-radio v-model="names.screen" :label="0">验收待结项</el-radio>
        </el-radio-group>
      </el-row>
      <hr />
    </div>
    <div class="cation" :value="index" :key="index" v-for="(item,index) in department ">
      <el-row :gutter="24" class="latabTit">
        <el-col :span="9" :offset="0" :xs="13">{{ department[index].groupName }}</el-col>
      </el-row>

      <el-table
        max-height="600"
        :data="department[index].centresV2"
        style="width: 100%;margin-bottom: 20px;"
        v-loading="loading"
        slot="empty"
        row-key="id"
        border
        :default-expand-all="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :cell-style="{padding:0}"
        :header-cell-style="{fontSize:'14px',color:'#303133',height:'51px',padding:0,backgroundColor:'#ccd1d5'}"
      >
        <el-table-column prop="filed75" label="中心名称" width="185">
          <template slot-scope="scope">
            <el-button
              style="white-space: pre-wrap;"
              type="text"
              @click="transferParameters([scope.row.filed75,names.screen])"
            >{{ scope.row.filed75 }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="filed76" label="项目个数" width="90"></el-table-column>
        <el-table-column prop="filed10" label="合同额" width="110">
          <template slot-scope="scope">
            <p>{{ scope.row.filed10 | formatThousands }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed26" label="预计纯合同额" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.filed26 | formatThousands}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed31" label="预计毛利润" width="110">
          <template slot-scope="scope">
            <p>{{ scope.row.filed31 | formatThousands}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed32" label="预计毛利率" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.filed32 }}%</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed33" label="预计损益" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.filed33 | formatThousands}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed34" label="预计损益收益率" width="130">
          <template slot-scope="scope">
            <p>{{ scope.row.filed34 }}%</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed26" label="实际纯合同额" width="125">
          <template slot-scope="scope">
            <p>{{ scope.row.filed26 | formatThousands}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed35" label="实际毛利润" width="110">
          <template slot-scope="scope">
            <p>{{ scope.row.filed35 | formatThousands}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed36" label="实际毛利率" width="100">
          <template slot-scope="scope">
            <p>{{ scope.row.filed36 }}%</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed37" label="实际损益" width="107">
          <template slot-scope="scope">
            <p>{{ scope.row.filed37| formatThousands }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="filed38" label="实际损益收益率" width="130">
          <template slot-scope="scope">
            <p>{{ scope.row.filed38 }}%</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="popout" v-if=" this.department==''">所管理部门无相关信息或无操作权限</div>
  </div>
</template>
<script>
// import { Articals } from "@/api/index.js";
import Time from "@/components/time/time.vue";
// import accountingCard from "@/components/CreateForm/accountingCard.vue";
import { departmentTabel } from "../../api/api.js";

import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
export default {
  name: "application",
  props: ["widget", "models", "datas"], //从父组件获取数据的参数 datas
  components: {
    Time
    // AccountingCard
  },
  data() {
    return {
      loading: true,
      department: [
        {
          groupName: "应用群",
          centresV2V2: [
            {
              id: "1",
              filed75: "智慧中心",
              filed76: "11",
              filed10: "12",
              filed26: "22",
              filed31: "11",
              filed32: "21",
              filed33: "22",
              filed34: "22",
              filed35: "12",
              filed36: "12",
              filed37: "12",
              filed38: "12",
              children: [
                {
                  id: "11",
                  filed75: "智慧中心",
                  filed76: "11",
                  filed10: "12",
                  filed26: "22",
                  filed31: "11",
                  filed32: "21",
                  filed33: "22",
                  filed34: "22",
                  filed35: "12",
                  filed36: "12",
                  filed37: "12",
                  filed38: "12"
                },
                {
                  id: "12",
                  filed75: "智慧中心",
                  filed76: "11",
                  filed10: "12",
                  filed26: "22",
                  filed31: "11",
                  filed32: "21",
                  filed33: "22",
                  filed34: "22",
                  filed35: "12",
                  filed36: "12",
                  filed37: "12",
                  filed38: "12"
                }
              ]
            }
          ]
        },
        {
          groupName: "应用群",
          centresV2: [
            {
              id: "1",
              filed75: "智慧中心",
              filed76: "11",
              filed10: "12",
              filed26: "22",
              filed31: "11",
              filed32: "21",
              filed33: "22",
              filed34: "22",
              filed35: "12",
              filed36: "12",
              filed37: "12",
              filed38: "12",
              children: [
                {
                  id: "11",
                  filed75: "智慧中心",
                  filed76: "11",
                  filed10: "12",
                  filed26: "22",
                  filed31: "11",
                  filed32: "21",
                  filed33: "22",
                  filed34: "22",
                  filed35: "12",
                  filed36: "12",
                  filed37: "12",
                  filed38: "12"
                },
                {
                  id: "12",
                  filed75: "智慧中心",
                  filed76: "11",
                  filed10: "12",
                  filed26: "22",
                  filed31: "11",
                  filed32: "21",
                  filed33: "22",
                  filed34: "22",
                  filed35: "12",
                  filed36: "12",
                  filed37: "12",
                  filed38: "12"
                }
              ]
            }
          ]
        }
      ],
      depname: "Application",
      names: {
        names: "departments",
        screen: 3
      }
    };
  },
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ])
  },
  created() {
    this.getDepartmentTabel();
  },
  methods: {
    //   点击切换按钮
    labScreen() {
      let params = {
        staffCode: this.userinfo.code,
        status: this.names.screen
      };
      departmentTabel("/accounting/bg/data/v2", params)
        .then(res => {
          this.department = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //   导出
    downloadFile() {},
    // 点击跳转链接
    transferParameters([filed75, status]) {
      // console.log(filed75)
      if (filed75 != "合计") {
        this.$router.push({
          path: "projectAdjust",
          query: {
            payment: filed75,
            status: status
          }
        });
      }
    },
    // 获取列表
    getDepartmentTabel() {
      debugger;
      let params = {
        staffCode: this.userinfo.code,
        status: 3
      };
      departmentTabel("/accounting/bg/data/v2", params)
        .then(res => {
          this.department = res.data.data;
          this.loading = false;
          //  console.log()
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
<style  type="text/css" lang="scss" scoped>
.application {
  margin: 0 20px 0 20px;
  .cation {
    width: 100%;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .navTop {
    width: 100% !important;
    float: right;
    line-height: 40px !important;
    hr {
      width: 98%;
    }
  }
  .popout {
    text-align: center;
    padding-top: 22px;
  }
  .navrig {
    margin-right: 10px;
    margin-top: 10px;
    width: 100%;
    .navrtime {
      // width: 61%;
      float: left;
      text-align: right;
    }
    button {
      float: right;
      margin-right: 15px;
    }
  }
  .latabTit {
    clear: both;
    font-size: 16px;
    font-weight: bold;
    .el-button {
      padding: 0px !important;
    }
  }
}
.el-table td,
.el-table th {
  padding: 4px 0 !important;
}
</style>
<style>
.application .el-table__indent {
  padding-left: 8px !important;
}

.application .el-table [class*="el-table__row--level"] .el-table__expand-icon {
  width: 12px;
}
.application .el-table tr td:first-child > .cell > .el-button--text {
  font-size: 15px;
}
@media screen and (min-width: 900px) and (max-width: 1200px) {
  .navrtime {
    margin-left: 1%;
  }
  .monad{
        margin-left: 35%!important;
  }
}

/* .application .el-table__placeholder{
  display: none;
} */
</style>



