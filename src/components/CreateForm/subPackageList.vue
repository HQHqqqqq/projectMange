<template>
  <div class="sub-list">
    <div class="header">
      <el-form ref="form" :model="form" size="mini" :inline="true" class="search-form">
        <div class="search-right">
          <el-form-item>
            <el-input v-model="form.keyWord" placeholder="外包项目编号/项目名称" size="mini">
              <!-- <el-button slot="append" icon="el-icon-search" ></el-button> -->
            </el-input>
          </el-form-item>
          <el-button size="mini" type="primary" @click="searchHandle()">查询</el-button>
          <el-button size="mini" type="primary" v-show="exportBtn" @click="exportHandle()">导出</el-button>
        </div>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      highlight-current-row border 
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
    <el-table-column type="index" width="38" align="center" label="序号" :fixed="true"></el-table-column>
      <el-table-column
        label="外包项目编号"
        width="140"
        align="center"
        :fixed="true"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <router-link
            :to="{
              name: '/projectInformation',
              query: {judgeproject: '分包项目信息', id: scope.row.id,category: scope.row.jumpType,
                projectName: scope.row.projectName,
                projectNumber: scope.row.projectNumber,
                company_id: scope.row.company_id
              }
            }"
          >
            <span class="num">{{ scope.row.outsourcingNumber }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(val, index) in listConfig"
        :prop="val.key"
        :label="val.label"
        :key="index"
        :width="val.width"
      ></el-table-column>
    </el-table>
    <div class=" right">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="1"
        :page-sizes="[20]" layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  projectListTabel,
} from "../../api/api.js";
import api from "../../api/index";
import { mapState, mapActions } from "vuex";
export default {
  name: "subPackageList",
  props: [],
  data() {
    return {
      page: {
        //当前页
        pageNum: 1,
        //每页显示条数
        pageSize: 20,
        total: 0
      },
      currentPage: 1,
      form: {
        keyWord: ""
      },

      tableData: [],
      listConfig: [
        // { key: "outsourcingNumber", label: "外包项目编号",width:"100" },
        { key: "outsourcingName", label: "外包项目名称", width: "120" },
        { key: "purchaseContractNumber", label: "采购合同编号", width: "120" },
        { key: "purchaseContractName", label: "采购合同名称", width: "120" },
        { key: "affiliation", label: "所属机构", width: "100" },
        { key: "affiliatedCenter", label: "所属中心", width: "100" },
        { key: "department", label: "所属部门", width: "100" },
        {
          key: "subcontractingBusinessType",
          label: "分包业务类型",
          width: "120",
        },
        { key: "subcontractingTheWay", label: "分包方式", width: "100" },
        { key: "subcontractAmount", label: "分包合同额", width: "100" },
        { key: "partyBUnit", label: "乙方单位", width: "100" },
        { key: "salesContractNumber", label: "关联销售合同编号", width: "150" },
        { key: "salesContractName", label: "关联销售合同名称", width: "150" },
        { key: "salesContractAmount", label: "关联销售合同额", width: "140" },
        { key: "projectNumber", label: "关联项目编号", width: "120" },
        { key: "projectName", label: "关联项目名称", width: "120" },
        { key: "projectStartTime", label: "项目开始时间", width: "120" },
        { key: "projectEndTime", label: "项目结束时间", width: "120" },
        { key: "relatedProjectFunding", label: "关联项目经费", width: "120" },
        {
          key: "subcontractingProjectProgress",
          label: "分包项目进度",
          width: "120",
        },
        { key: "satisfactionEvaluation", label: "满意度评价", width: "120" },
        {
          key: "cumulativeReimbursementAmount",
          label: "累计报销金额",
          width: "120",
        },
        { key: "updateTime", label: "更新时间", width: "120" },
      ],
    };
  },
  computed: {
    ...mapState([
      "userinfo", //os跳转过来的用户信息值
      "cacheParams", //项目列表查询条件缓存条件
      "gjFromModel",
      "gjFromCheckList"
    ]),
    exportBtn(){
      //只有葛晨慧、刘会芬、曹喃、南飞、张金星有权限下载
      let memberid = this.userinfo.memberid
      if(
      memberid=='2361372308666271490'||
      memberid=='-2214906182493845302'||
      memberid=='1762700266460431602'||
      memberid=='-8308384141194738542'||
      memberid=='7603819741782557558'
      ){
        return true
      }else{
        return false
      }
    }
  },
  watch: {
    
  },
  methods: {
    searchHandle(){
      this.getProjectTable({
         pageNum:this.page.pageNum,
         pageSize:20,
         keyword:this.form.keyWord,
         memberId:this.userinfo.memberid,
         author:this.userinfo.subdept_id,
      })
    },
    init(){
      this.getProjectTable({
         pageNum:1,
         pageSize:20,
         keyword:this.form.keyWord,
         memberId:this.userinfo.memberid,
         author:this.userinfo.subdept_id,
      })
    },
     handleCurrentChange(val) {
      this.page.pageNum = val
      this.getProjectTable({
         pageNum:val,
         pageSize:20,
         keyword:this.form.keyWord,
         memberId:this.userinfo.memberid,
         author:this.userinfo.subdept_id,
      })
    },
    //获取分包项目列表表格
    getProjectTable(params) {
      //获取项目列表信息
      projectListTabel("/sgpm/rest/api/server/gt/subcontract/project/item", params)
        .then(res => {
          if(res.data.code==200){
             this.tableData = res.data.data
             this.page.total = res.data.meta.totalCount
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    exportHandle(){
      let baseURL = api.urlPort04
      let href = `${baseURL}/sgpm/rest/api/server/pm/project/excel/export/outsourcing/project?memberId=${this.userinfo.memberid}&author=${this.userinfo.subdept_id}&keyword=${this.form.keyWord}`
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', href)
      a.click()
    }
  },
  created() {
    this.init()
  },
};
</script>

<style lang="scss">
.sub-list {
  padding: 0 15px 0 15px;
  .num {
    color: #409eff;
    text-decoration: underline;
  }
  .search-form {
    display: flex;
    padding: 20px 0 10px 0;
    .search-right {
      width: 100%;
      text-align: right;
      height: 30px;
    }
  }
  .right {
    float: right;
  }
}
</style>
