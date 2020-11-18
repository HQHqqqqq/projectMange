<template>
  <div class="accounting">
    <div class="Blockunit">单位：万元</div>
    <el-table max-height="750" :data="cardList" style="width: 100%;" type="index" slot="empty" row-key="id" border
      :default-expand-all="isExpand" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :cell-style="{padding:0}"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'50px',padding:0,backgroundColor:'#ccd1d5'}">
      <el-table-column prop="projectName" fixed label="项目" width="310">
        <template slot-scope="scope">
          <el-button style="white-space: pre-wrap; font-size: 15px;" type="text">{{scope.row.projectName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="projectPhase" label="项目阶段" width="95">
        <template slot-scope="scope">
          <p>{{ scope.row.projectPhase |formatThousands}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="boPhase" label="商机阶段" width="95">
        <template slot-scope="scope">
          <p>{{ scope.row.boPhase |formatThousands }}</p>
        </template>
      </el-table-column>

      <el-table-column prop="boAndProject" label="商机+项目累计" width="130">
        <template slot-scope="scope">
          <p>{{ scope.row.boAndProject |formatThousands}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="projectAbout" label="项目概算" width="96">
              <template slot-scope="scope">
                <p>{{ scope.row.projectAbout |formatThousands}}</p>
              </template>
      </el-table-column>-->
      <el-table-column prop="projectBudget" label="项目预算" width="90">
        <template slot-scope="scope">
          <p>{{ scope.row.projectBudget |formatThousands}}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { DetailsCard } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";

export default {
  name: "accounting",
  data() {
    return {
      isExpand: false,
      cardList: [
        {
          id: "1",
          projectName: "合同额",
          filed76: "12321.2",
          filed77: "3232.34",
          filed78: "2298"
        },
        {
          id: "3",
          projectName: "纯合同额",
          filed76: "4323.32",
          filed77: "3917.22",
          filed78: "7831.23"
        },
        {
          id: "4",
          projectName: "回款",
          filed76: "1211.23",
          filed77: "782.49",
          filed78: "3204.3",
          children: [
            {
              id: "42",
              projectName: "主营业务回款",
              filed76: "3842.33",
              filed77: "8321.29",
              filed78: "9321.22",
              isExpand: true,
              children: [
                {
                  id: "421",
                  projectName: "自有基础软件",
                  filed76: "3842.33",
                  filed77: "8321.29",
                  filed78: "9321.22"
                },
                {
                  id: "422",
                  projectName: "自有应用软件",
                  filed76: "3842.33",
                  filed77: "8321.29",
                  filed78: "9321.22"
                },
                {
                  id: "423",
                  projectName: "自有数据产品",
                  filed76: "3842.33",
                  filed77: "8321.29",
                  filed78: "9321.22"
                }
              ]
            },
            {
              id: "43",
              projectName: "其他业务回款",
              filed76: "4392.29",
              filed77: "3221.11",
              filed78: "3921.78"
            }
          ]
        },
        {
          id: "5",
          projectName: "采购支出",
          filed76: "23321.22",
          filed77: "19876.52",
          filed78: "9845.65",
          children: [
            {
              id: "52",
              projectName: "主营业务采购支出",
              filed76: "3459.44",
              filed77: "8594.54",
              filed78: "2349.3"
            },
            {
              id: "53",
              projectName: "其他业务采购支出",
              filed76: "4323.33",
              filed77: "3223.98",
              filed78: "9844.65"
            }
          ]
        },
        {
          id: "6",
          projectName: "纯回款",
          filed76: "9221.34",
          filed77: "8223.55",
          filed78: "2382.54"
        },
        {
          id: "7",
          projectName: "预扣成本",
          filed76: "4358.39",
          filed77: "9442.33",
          filed78: "4892.44"
        },
        {
          id: "8",
          projectName: "纯收入",
          filed76: "4328.39",
          filed77: "9842.33",
          filed78: "4832.44"
        },
        {
          id: "9",
          projectName: "税金及附加",
          filed76: "4328.39",
          filed77: "9842.33",
          filed78: "4832.44"
        },

        {
          id: "10",
          projectName: "实施费用",
          filed76: "23321.22",
          filed77: "19876.52",
          filed78: "9845.65",
          children: [
            {
              id: "11",
              projectName: "人工费用",
              filed76: "32459.44",
              filed77: "85934.54",
              filed78: "23249.3"
            },
            {
              id: "12",
              projectName: "运营费用",
              filed76: "43293.33",
              filed77: "38223.98",
              filed78: "98144.65"
            }
          ]
        }
      ] //卡片数据
    };
  },
  created() {
    Bus.$on("projectContent", item => {
      this.getAccountData();
    });
  },
  mounted() {
    this.getAccountData();
  },
  filters: {
    formatThousands: function (value) {
      var r = /^[0-9]*[1-9][0-9]*$/; //正整数
      if (r.test(value) == false) {
        return (
          // "¥" +
          value &&
          value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          })
        );
      } else {
        var reg = /\d{1,3}(?=(\d{3})+$)/g;
        // "¥" +
        return (value + "").replace(reg, "$&,");
      }
    }
  },
  methods: {
    getAccountData() {
      let projectNumber = localStorage.getItem("projectNumber");
      var params = {
        projectId: projectNumber
      };
      DetailsCard("/accounting/bg/center/department/data/tree", params)
        .then(res => {
          //   console.log(res.data.data)
          this.cardList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.Blockunit {
  font-size: 14px;
  position: absolute;
  top: 0px;
  z-index: 222;
  right: 20px;
  .el-icon-arrow-right {
    position: relative;
    top: 13px;
  }

  .el-table [class*="el-table__row--level"] .el-table__expand-icon {
    margin-right: -16px;
  }
}
</style>