<template>
    <div>
        <table style="width: 100%" class="myTable">
            <tr>
                <td class="column">分包合同类别</td>
                <td class="column" colspan="3">{{typeOfSubcontract}}</td>
            </tr>
            <tr v-for="(item,i) in subcontractVOList" :key="i">
                <td class="column">分包合同单价(元)</td>
                <td>{{item.unitPriceOfSubcontract}}</td>
                <td class="column">计价单位名称说明</td>
                <td>{{item.descriptionOfUnitName}}</td>
            </tr>
            <tr>
                <td class="column">分包合同额(元)</td>
                <td class="column" colspan="3">{{subcontractAmount}}</td>
            </tr>
            <tr>
                <td class="column">分包合同付款条件</td>
                <td class="column" colspan="3">{{subcontractPaymentTerms}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
export default {
  name: "contractInformation",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
        typeOfSubcontract: '',
        subcontractAmount: '',
        subcontractPaymentTerms: '',
        subcontractVOList:[]
    };
  },
  created(){
      setTimeout(() => {
        var projectData = JSON.parse(localStorage.getItem("projectData"));
        this.typeOfSubcontract = projectData.typeOfSubcontract;
        this.subcontractAmount = projectData.subcontractAmount;
        this.subcontractPaymentTerms = projectData.subcontractPaymentTerms;
        if(projectData.subcontractVOList.length > 0){
            this.subcontractVOList = projectData.subcontractVOList;
        }
      },500)  
  },
  methods: {

  },
};
</script>

<style scoped>
    .myTable {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
    }
        
    .myTable td,
    .myTable th {
        border: 1px solid #EBEEF5;
        color: #606266;
        padding: 8px 0;
        line-height: 23px;
    }
    .column{
        width: 200px;
    }
</style>
