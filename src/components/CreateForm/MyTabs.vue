<template>
  <div class="container">
    <el-tabs @tab-click="tabClick">
      <el-tab-pane
        :label="item.name"
        v-for="(item,index) in datas.tabs"
        :disabled="!isPmo&&item.name == '监管部门'"
        :key="index"
      >
        <project-information v-if="item.name=='基本信息'"></project-information>
        <project-contract v-if="item.name=='商机/合同'"></project-contract>
        <gt-business-page v-if="item.name=='商机'"></gt-business-page>
        <contract-info v-if="item.name=='合同信息'"></contract-info>

        <milepost v-if="item.name=='里程碑Review'"></milepost>
        <moneyback-one v-if="item.name=='回款里程碑计划'"></moneyback-one>
        <moneyback-two v-if="item.name=='回款条件Review'"></moneyback-two>
        <soft-hardware-review v-if="item.name=='软硬件进度Review'"></soft-hardware-review>

        <audittable-one v-if="item.name=='待审流程'" @totalCount="auditTableOneCount"></audittable-one>
        <audittable-two v-if="item.name=='已发流程'" @totalCount="auditTableTwoCount"></audittable-two>
        <audittable-three v-if="item.name=='待发流程'" @totalCount="auditTableThreeCount"></audittable-three>
        <span slot="label" v-if="item.name=='待审流程'">
          <el-badge :value="auditTableOneValue" class="item">待审流程</el-badge>
        </span>
        <span slot="label" v-if="item.name=='已发流程'">
          <el-badge :value="auditTableTwoValue" class="item">已发流程</el-badge>
        </span>
        <span slot="label" v-if="item.name=='待发流程'">
          <el-badge :value="auditTableThreeValue" class="item">待发流程</el-badge>
        </span>

        <working-hour v-if="item.name=='项目工时'"></working-hour>

        <menu-item v-if="item.name=='菜单信息'"></menu-item>
        <role-item v-if="item.name=='角色信息'"></role-item>
        <!-- <member-item v-if="item.name=='成员信息'"></member-item> -->
        <authority-item v-if="item.name=='菜单授权'"></authority-item>
        <supervise-item v-if="item.name=='监管部门'"></supervise-item>
        <management-home v-if="item.name=='核算'"></management-home>
        <template v-if="warningTab">
          <board-warning v-if="item.name=='预警'"></board-warning>
        </template>
        <template v-if="progressTab">
          <progress-warning v-if="item.name=='进度'"></progress-warning>
        </template>
        <my-audit-list v-if="item.name=='我提交待审核的项目'" @totalCount="myAuditListCount"></my-audit-list>
        <span slot="label" v-if="item.name=='我提交待审核的项目'">
          <el-badge :value="myAuditListBadgeValue" class="item">我提交待审核的项目</el-badge>
        </span>
        <span slot="label" v-if="item.name=='待我审核的项目'">
          <el-badge :value="auditListMeBadgeValue" class="item">待我审核的项目</el-badge>
        </span>
        <audit-list-me v-if="item.name=='待我审核的项目'" @totalCount="auditListMeCount"></audit-list-me>
        <component v-bind:is="memberItem" v-if="item.name=='成员信息'"></component>

        <accoun-ting v-if="item.name=='项目核算'"></accoun-ting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Bus from "../../bus";
import menuItem from "@/components/System/components/menuItem";
import roleItem from "@/components/System/components/roleItem";
import memberItem from "@/components/System/components/memberItem";
import authorityItem from "@/components/System/components/authorityItem";
//里程碑 回款review
import Milepost from "./Milepost"; //里程碑Review
import MoneybackOne from "./MoneybackOne"; //回款里程碑计划Review--销售
import MoneybackTwo from "./MoneybackTwo"; //回款条件Review--项目经理
import SoftHardwareReview from "./SoftHardwareReview"; // 软硬件进度review
import AudittableOne from "./AudittableOne"; //审核列表--待审流程
import AudittableTwo from "./AudittableTwo"; //审核列表--已发流程
import AudittableThree from "./AudittableThree"; //审核列表--待发流程
import ProjectContract from "./ProjectContract"; // 项目列表/项目信息/ 商机-合同
import GtBusinessPage from "./GtBusinessPage"; //合同视图/合同信息  商机
import ContractInfo from "./ContractInfo"; //合同信息
import accounTing from "./Accounting"; // 商机/合同

//监控部门
import superviseItem from "@/components/System/components/superviseItem";
//待我审核的项目
import AuditListMe from "@/components/CreateForm/AuditListMe";
//我提交审核的项目
import MyAuditList from "@/components/CreateForm/MyAuditList";
//看板核算
import ManagementHome from "@/components/CreateForm/ManagementHome";
//看板预警
import BoardWarning from "@/components/CreateForm/BoardWarning";
//看板进度
import ProgressWarning from "@/components/CreateForm/ProgressWarning";
import WorkingHour from "@/components/CreateForm/workingHour";
import Vue from "vue";

export default {
  name: "MyTabs",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {
    GtBusinessPage,
    menuItem,
    roleItem,
    memberItem,
    authorityItem,
    superviseItem,
    Milepost,
    MoneybackOne,
    MoneybackTwo,
    AudittableOne,
    AudittableTwo,
    AudittableThree,
    AuditListMe,
    MyAuditList,
    ManagementHome,
    BoardWarning,
    ProgressWarning,
    ProjectContract,
    ContractInfo,
    WorkingHour,
    accounTing,
    SoftHardwareReview
  },

  data() {
    return {
      remoteFuncs: {},
      editData: {},
      dynaComponents: "",
      isPmo: false,
      //我提交待审核的项目气泡值
      myAuditListBadgeValue: 0,
      //待我审核的项目气泡值
      auditListMeBadgeValue: 0,
      auditTableOneValue: 0, //审批列表 待审流程 气泡值
      auditTableTwoValue: 0, //审批列表 已发流程 气泡值
      auditTableThreeValue: 0, //审批列表 代发流程 气泡值
      warningTab: true,
      progressTab: true
    };
  },
  computed: {
    memberItem() {
      return "memberItem";
    }
  },
  mounted() {},
  created() {
    Bus.$on("isPmo", item => {
      this.isPmo = item;
    });
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      }
    }
  },
  methods: {
    tabClick(val) {
      if (val.label == "预警") {
        this.dynaComponents = "memberItem";
        this.warningTab = false;
        setTimeout(() => {
          this.warningTab = true;
        }, 200);
      } else if (val.label == "进度") {
        this.progressTab = false;
        setTimeout(() => {
          this.progressTab = true;
        }, 200);
      }
    },
    myAuditListCount(val) {
      this.myAuditListBadgeValue = val;
    },
    auditListMeCount(val) {
      this.auditListMeBadgeValue = val;
    },
    //获取子组件传递的数据
    auditTableOneCount(val) {
      this.auditTableOneValue = val;
    },
    auditTableTwoCount(val) {
      this.auditTableTwoValue = val;
    },
    auditTableThreeCount(val) {
      this.auditTableThreeValue = val;
    }
  }
};
</script>

<style lang="scss">
.container {
  text-align: left;
  .el-tabs__active-bar {
    // width: 100% !important;
  }
  .el-badge__content.is-fixed {
    top: 10px;
  }
}
</style>


