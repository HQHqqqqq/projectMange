<template>
    <div>
        <el-table :data="tableData" style="width: 100%;" max-height="250">
            <el-table-column fixed prop="reimbursementSerialNumber" label="报销流水号" width="150"></el-table-column>
            <el-table-column prop="reimbursementTime" label="报销时间" width="150"></el-table-column>
            <el-table-column prop="reimbursement" label="报销人" width="100"></el-table-column>
            <el-table-column prop="attributionDepartment" label="归属部门" width=""></el-table-column>
            <el-table-column prop="associatedProjectName" label="关联项目名称" width="300"></el-table-column>
            <el-table-column prop="reimbursementAmount" label="报销金额" width="150"></el-table-column>
            <el-table-column prop="remark" label="备注" width=""></el-table-column>
        </el-table>
        <el-row class="cumulative">
            <el-col :span="3" class="num">
                <div>累计报销金额(元)</div>
            </el-col>
            <el-col :span="9">
                <div style="padding-left:15px;">{{price}}</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
export default {
  name: "paymentInformation",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      tableData: [],
      price: ''
    };
  },
  created () {
    setTimeout(() => {
      var projectData = JSON.parse(localStorage.getItem("projectData"));
      if(projectData.subcontractPaymentInformationVOList.length > 0){
        this.tableData = projectData.subcontractPaymentInformationVOList;
        var sum = 0;
        for(var i= 0 ;i< this.tableData.length; i++) {
          sum += parseInt(this.tableData[i].reimbursementAmount);
        }
        this.price = sum;
      }
    },500)
    
  },
  methods: {},
};
</script>

<style scoped>
    .cumulative{
        border-bottom: 1px solid #EBEEF5;
        height: 35px;
        line-height: 35px;
    }
    .num{
        border-right: 1px solid #EBEEF5;
    }
</style>
