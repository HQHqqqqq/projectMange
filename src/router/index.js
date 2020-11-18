import Vue from "vue";
import Router from "vue-router";
import { getToken } from '@/util/request'
import HelloWorld from "@/components/HelloWorld";
import Individualtable from "@/components/Individualtable/individualtable";
import Projectview from "@/components/Projectview/projectview";
import Worksheet from "@/components/Worksheet/worksheet";
import Manageview from "@/components/Manageview/manageview";
import Projectregistration from "@/components/Projectregistration/projectregistration";
import Xiangmutuandui from "@/components/Xiangmutuandui/xiangmutuandui";
import Projectstart from "@/components/Projectstart/projectstart";
import projectitem from "@/components/projectitem/projectitem";
import Contractitem from "@/components/contractitem/contractitem";
import projectChange from "@/components/projectChange/projectChange";
import audititem from "@/components/audititem/audititem";
import AuditTable from "@/components/audititem/AuditTable";
import Businessproject from "@/components/Businessproject/Businessproject";
import Contractproject from "@/components/Contractproject/Contractproject";
import SysMenu from "@/components/System/sysMenu";
import SysRole from "@/components/System/sysRole";
import SysAuthority from "@/components/System/sysAuthority";
import ProjectInformation from "@/components/ProjectInformation/ProjectInformation";
import ProjectInfo from "@/components/ProjectInformation/ProjectInfo";
import Login from "@/components/Login/index";
import LoginLine from "@/components/Login/indexline";
import Childproject from "@/components/Childproject/childproject";
import ErrorPage from "@/components/error/error";
import ProjectHome from "@/components/ProjectHome/ProjectHome";
import Application from "@/components/Application/Application";
import ProjectAdjust from "@/components/ProjectAdjust/ProjectAdjust";
import TaskObject from "@/components/TaskObject/TaskObject";
import ManagerBoard from "@/components/ManagerBoard/ManagerBoard";
import ManagerBoardGT from "@/components/ManagerBoardGT/ManagerBoardGT";
import ManagerBoardNK from "@/components/ManagerBoardNK/ManagerBoardNK";
import ManagerBoardAT from "@/components/ManagerBoardAT/ManagerBoardAT";
import ManagerBoardGroup from "@/components/ManagerBoardGroup/ManagerBoardGroup";
import ManagerBoardPlatform from "@/components/ManagerBoardPlatform/ManagerBoardPlatform";
import ManagerBoardCloud from "@/components/ManagerBoardCloud/ManagerBoardCloud";
import ManagerBoardInternational from "@/components/ManagerBoardInternational/ManagerBoardInternational";
import ManagerBoardResearch from "@/components/ManagerBoardResearch/ManagerBoardResearch";
import ExternalPage from "@/components/ExternalPage/ExternalPage";
import NonContractual from "@/components/NonContractual/NonContractual";
import ContractAssociated from "@/components/ContractAssociated/ContractAssociated";
import notContractitem from "@/components/notContractitem/notContractitem";
import notContractProject from "@/components/notContractProject/notContractProject";
import nonPostProject from "@/components/nonPostProject/nonPostProject";
import mounthOutputItem from "@/components/outputItem/mounthOutputItem";
import residueOutputItem from "@/components/outputItem/residueOutputItem";
import associatedOutputItem from "@/components/outputItem/associatedOutputItem";
import notAssociatedOutputItem from "@/components/outputItem/notAssociatedOutputItem";
import BudgetItem from "@/components/budgetItem/budgetItem";
import gtNonContractual from "@/components/NonContractual/gtNonContractual";
import contractFinish from "@/components/contractFinish/contractFinish";
import pendingDocument from "@/components/DocumentItem/docitem";
import cashDepositItem from "@/components/cashDepositItem/cashDepositItem";
import abnormalProject from "@/components/abnormalProject/abnormalProject";
import subPackageItem from "@/components/subPackageItem/subPackageItem";

import watermark from '@/util/watermark'

import Home from "@/Home";
import LeftNav from "@/view/leftNav";
import TopNav from "@/view/topNav";

import cookie from "vue-cookie";

// import Statistical from '@/components/Statistical/statistical'

Vue.use(Router);

let router = new Router({
  // mode: 'history',
  routes: [
    {
      path: "/",
      component: Home,
      redirect: "/loginLine",
      children: [
        {
          path: "/individualtable",
          name: "individualtable",
          component: Individualtable
        },
        {
          path: "/projectview",
          name: "projectview",
          component: Projectview
        },
        {
          path: "/worksheet",
          name: "worksheet",
          component: Worksheet
        },
        {
          path: "/projectChange",
          name: "projectChange",
          component: projectChange
        },
        {
          path: "/manageview",
          name: "manageview",
          component: Manageview
        },
        {
          path: "/projectregistration",
          name: "/projectregistration",
          component: Projectregistration
        },
        {
          path: "/xiangmutuandui",
          name: "/xiangmutuandui",
          component: Xiangmutuandui
        },
        {
          path: "/projectstart",
          name: "/projectstart",
          component: Projectstart
        },
        {
          path: "/projectitem",
          name: "projectitem",
          component: projectitem,
          beforeEnter: (to, from, next) => {
            var storage = window.localStorage;
            let list = JSON.parse(storage.menuList);
            var projectNamearray = [];
            list.forEach(jtem => {
              if (jtem.name == "项目视图") {
                projectNamearray.push(jtem);
              }
            });
            var menuCodeAry = projectNamearray[0].children;
            var localStorageProjectName = localStorage.getItem("projectName");
            if (JSON.stringify(to.params) == "{}") {
              menuCodeAry.forEach(item => {
                if (item.code == "YIZHANGTUGONGXIANGPINGTAI") {
                  item.name = localStorageProjectName
                    ? localStorageProjectName
                    : "未指定项目";
                }
              }); //选中项目更新导航
              next();
              // localStorage.removeItem("menuList")
            }
            localStorage.setItem("menuList", JSON.stringify(list));
            next();
            // ...
          }
        },
        {
          path: "/contractitem",
          name: "contractitem",
          component: Contractitem
        },
        {
          path: "/notContractitem",
          name: "notContractitem",
          component: notContractitem
        },
        {
          path: "/audititem",
          name: "audititem",
          // component: audititem //测试用
          component: AuditTable // 系统现用的这个
        },
        // 里程碑变更详情页
        {
          path: "/MilepostChangeShow",
          component: () => import("@/components/audititem/MilepostChangeShow")
        },
        // 里程碑变更编辑页
        {
          path: "/MilepostChangeEdit",
          component: () => import("@/components/audititem/MilepostChangeEdit")
        },
        {
          path: "/application",
          name: "Application",
          component: Application
        },
        {
          path: "/taskObject",
          name: "TaskObject",
          component: TaskObject
        },
        {
          path: "/projectAdjust",
          name: "ProjectAdjust",
          component: ProjectAdjust
        },
        {
          path: "/sysMenu",
          name: "sysMenu",
          component: SysMenu
        },
        {
          path: "/sysAuthority",
          name: "sysAuthority",
          component: SysAuthority
        },
        // {
        //   path: '/projectmilestone',
        //   name: '/projectmilestone',
        //   component: () => import('@/components/ProjectMilestone/projectmilestone'),
        // },
        {
          path: "/projectInformation",
          name: "/projectInformation",
          // component: ProjectInformation,
          component: ProjectInfo,
          beforeEnter: (to, from, next) => {
            var storage = window.localStorage;
            let list = JSON.parse(storage.menuList);
            var projectNamearray = [];
            list.forEach(jtem => {
              if (jtem.name == "项目视图") {
                projectNamearray.push(jtem);
              }
            });
            var menuCodeAry = projectNamearray[0].children;
            var localStorageProjectName = localStorage.getItem("projectName");
            if (JSON.stringify(to.params) == "{}" && JSON.stringify(to.query) == "{}") {
              menuCodeAry.forEach(item => {
                if (item.code == "YIZHANGTUGONGXIANGPINGTAI") {
                  item.name = localStorageProjectName
                    ? localStorageProjectName
                    : "未指定项目";
                }
              }); //选中项目更新导航
              next();
              // localStorage.removeItem("menuList")
            } else {
              storage.projectNumber = to.params.projectNumber || to.query.projectNumber;
              storage.projectName = to.params.projectName || to.query.projectName;
              storage.companyId = to.params.company_id || to.query.company_id;
              storage.projectId = to.params.id || to.query.id; //项目id
              storage.parent_id = to.params.parent_id;
              if (to.params.judgeproject == "项目信息") {
                storage.jump_type = "1";
              } else {
                storage.jump_type = "11";
              }

              storage.judgeproject = to.params.judgeproject || to.query.judgeproject;
              menuCodeAry.forEach(item => {
                if (item.code == "YIZHANGTUGONGXIANGPINGTAI") {
                  item.name = to.params.projectName || to.query.projectName;
                }
              }); //选中项目更新导航
            }
            localStorage.setItem("menuList", JSON.stringify(list));
            next();
            // ...
          }
        },
        {
          path: "/projectrisk",
          name: "/projectrisk",
          component: () => import("@/components/ProjectRisk/ProjectRisk")
        },
        //里程碑单独页面组件
        {
          path: "/sysRole",
          name: "sysRole",
          component: SysRole
        },
        {
          path: "/Businessproject",
          name: "/Businessproject",
          component: Businessproject
        },
        // 项目信息重构页面
        {
          path: "/ProjectInfo",
          name: "/ProjectInfo",
          component: ProjectInfo
        },
        {
          path: "/contractproject",
          name: "/contractproject",
          component: Contractproject
        },

        {
          path: "/childproject",
          name: "/childproject",
          component: Childproject
        },
        {
          path: "/subPackageItem",
          name: "/subPackageItem",
          component: subPackageItem
        },
        {
          path: "/errorPage",
          name: "/errorPage",
          component: ErrorPage
        },
        {
          path: "/projectHome",
          name: "/projectHome",
          component: ProjectHome,
          beforeEnter: (to, from, next) => {
            var storage = window.localStorage;
            if (JSON.stringify(to.params) == "{}") {
              next();
              // localStorage.removeItem("menuList")
            } else {
              storage.projectNumber = to.params.projectNumber;
              storage.projectName = to.params.projectName;
              storage.projectId = to.params.id; //项目id
              storage.parent_id = to.params.parent_id;
              storage.judgeproject = to.params.judgeproject;
              let list = JSON.parse(storage.menuList);
              var projectNamearray = list.filter(item => {
                return item.name == "项目视图";
              });
              console.log(this.projectName);
              projectNamearray[0].children[3].name = to.params.projectName; //选中项目更新导航
              localStorage.setItem("menuList", JSON.stringify(list));
            }

            next();
            // ...
          }
        },
        {
          path: "/projectmilestone",
          name: "/milepost",
          component: () => import("@/components/MilePost/MilePost")
        },
        {
          path: "/ContractMilestone",
          name: "/ContractMilestone",
          component: () =>
            import("@/components/ContractMilestone/ContractMilestone") //合同里程碑
        },

        {
          path: "/ContractInformation",
          name: "/ContractInformation",
          component: () =>
            import("@/components/ContractInformation/ContractInformation"), //合同信息
          beforeEnter: (to, from, next) => {
            var storage = window.localStorage;
            if (JSON.stringify(to.params) == "{}") {
              next();
              // localStorage.removeItem("menuList")
            } else {
              storage.contractName = to.params.contractName;
              storage.contractNumber = to.params.contractNumber;
              storage.contractMoney = to.params.contractMoney;
              storage.businessNumber = to.params.businessNumber;
              let list = JSON.parse(storage.menuList);
              //找到 合同视图 菜单
              var contractView = list.filter(item => {
                return item.code == "HETONG_VIEW";
              });
              //找到合同视图下的 未指定合同 菜单
              var menuName = contractView[0].children.filter(item => {
                return item.code == "HT_ROOT";
              });
              menuName[0].name = to.params.contractName;
              // contractView[0].children[3].name = to.params.projectName; //选中项目更新导航
              localStorage.setItem("menuList", JSON.stringify(list));
            }
            next();
          }
        },
        {
          path: "/table",
          name: "/table",
          component: () => import("@/components/ProjectRisk/tableDemo")
        },
        {
          path: "/milestoneTemplate",
          name: "/milestoneTemplate",
          component: () => import("@/components/System/milestoneTemplate")
        },
        {
          path: "/managerBoard",
          name: "/managerBoard",
          component: ManagerBoard
        },
        {
          path: "/managerBoardGroup",
          name: "/ManagerBoardGroup",
          component: ManagerBoardGroup
        },
        {
          path: "/ManagerBoardGT",
          name: "/ManagerBoardGT",
          component: ManagerBoardGT
        },
        {
          path: "/ManagerBoardAT",
          name: "/ManagerBoardAT",
          component: ManagerBoardAT
        },
        {
          path: "/ManagerBoardNK",
          name: "/ManagerBoardNK",
          component: ManagerBoardNK
        },
        {
          path: "/managerBoardPlatform",
          name: "/managerBoardPlatform",
          component: ManagerBoardPlatform
        },
        {
          path: "/managerBoardCloud",
          name: "/managerBoardCloud",
          component: ManagerBoardCloud
        },
        {
          path: "/managerBoardInternational",
          name: "/managerBoardInternational",
          component: ManagerBoardInternational
        },
        {
          path: "/managerBoardResearch",
          name: "/managerBoardResearch",
          component: ManagerBoardResearch
        },
        {
          path: "/externalPage",
          name: "/externalPage",
          component: ExternalPage
        },
        {
          path: "/NonContractual",
          name: "/NonContractual",
          component: NonContractual
        },
        {
          path: "/ContractAssociated",
          name: "/ContractAssociated",
          component: ContractAssociated
        },
        {
          path: "/notContractProject",
          name: "/notContractProject",
          component: notContractProject
        },
        {
          path: "/nonPostProject",
          name: "/nonPostProject",
          component: nonPostProject
        },
        {
          path: "/mounthOutputItem",
          name: "/mounthOutputItem",
          component: mounthOutputItem
        },
        {
          path: "/residueOutputItem",
          name: "/residueOutputItem",
          component: residueOutputItem
        },
        {
          path: "/associatedOutputItem",
          name: "/associatedOutputItem",
          component: associatedOutputItem
        },
        {
          path: "/notAssociatedOutputItem",
          name: "/notAssociatedOutputItem",
          component: notAssociatedOutputItem
        },
        {
          path: "/budgetItem",
          name: "/budgetItem",
          component: BudgetItem
        },
        {
          path: "/contractFinish",
          name: "/contractFinish",
          component: contractFinish
        },
        {
          path: "/gtNonContractual",
          name: "/gtNonContractual",
          component: gtNonContractual
        },
        {
          path: "/pendingDocument",
          name: "/pendingDocument",
          component: pendingDocument
        },
        {
          path: "/cashDepositItem",
          name: "/cashDepositItem",
          component: cashDepositItem
        },
        {
          path: "/abnormalProject",
          name: "/abnormalProject",
          component: abnormalProject
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/loginLine",
      name: "LoginLine",
      component: LoginLine
    }
  ]
});

router.beforeEach((to, from, next) => {
  console.log("to:" + to.path);
  if (to.path == "/loginLine") {
    next();
  } else {
    let user = JSON.parse(window.localStorage.getItem("userinfo"));
    var userToken = getToken();
    if (!user && to.name != "login"&&!userToken) {
      next({
        path: "/"
      });
    } else {
      next();
    }
  }
});



router.afterEach((to) => {
  if (to.name=="/ManagerBoardGroup"
      ||to.name=="/managerBoard"
      ||to.name=="/managerBoardPlatform"
      ||to.name=="/managerBoardCloud"
      ||to.name=="/managerBoardInternational"
      ||to.name=="/managerBoardResearch"
      ||to.name=="/ManagerBoardGT"
      ||to.name=="/ManagerBoardNK"
      ||to.name=="/ManagerBoardAT"
  ) {
    let user = JSON.parse(window.localStorage.getItem("userinfo"));
    watermark.set('',user.emp_name) // 设置水印title
  } else {
    watermark.out() // 清除水印
  }
})

export default router;
