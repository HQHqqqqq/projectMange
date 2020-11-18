import axios from "axios"; // 引入axios
import {request} from "./request"; // 引用fetch.js
import api from "./index"; // 引用url.js

// Review下载交付物222
export function getDownLoadUrl(url) {
  return api.urlPort04 + url;
}
// Review上传交付物11
export function fileUpload(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "POST", // 请求方法
    data: data
  });
}
// integration http请求方法
export function integrationGetMethod(url, params) {
  return request({
    url: api.urlPort03 + url,
    method: "GET", // 请求方法
    params: params
  });
}

//sgpm http请求方法 lmg
export function sgpmHttpMethod(url, type, params) {
  return request({
    url: api.urlPort05 + "/sgpm/rest/api" + url,
    method: type, // 请求方法
    params: params
  });
}
//sgpm server post http请求方法
export function serverPostHttpMethod(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "POST", // 请求方法
    data: data
  });
}
//sgpm server put http请求方法
export function serverPutHttpMethod(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "PUT", // 请求方法
    data: data
  });
}
//hb 提交国图审批流 examineSubmit
export function examineSubmit(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "POST", // 请求方法
    data: data
  });
}
//hb 提交超图审批流 examineCTSubmit
export function examineCTSubmit(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "POST", // 请求方法
    data: data
  });
}
//sgpm server get http请求方法
export function serverGetHttpMethod(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "GET", // 请求方法
    params: params
  });
}
//sgpm server delete http请求方法
export function serverDeleteHttpMethod(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "DELETE", // 请求方法
    params: params
  });
}

//sgpm system delete http请求方法
export function systemDeleteHttpMethod(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "DELETE", // 请求方法
    params: params
  });
}

//sgpm sysytem post http请求方法
export function systemPostHttpMethod(url, data) {
  return request({
    url: api.urlPort05 + url,
    method: "POST", // 请求方法
    data: data
  });
}
//sgpm sysytem get http请求方法
export function systemGetHttpMethod(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "GET", // 请求方法
    params: params
  });
}

// 获取枚举
export function getData(url, params) {
  return request({
    url: api.urlPort04 + "/sgpm/rest/api/server/pm/project" + url,
    method: "GET", // 请求方法
    params: params
  });
}
//获取导航/立项登记
export function getMenuList(url, params) {
  return request({
    url: api.urlPort05 + "/sgpm/rest/api/system" + url,
    method: "GET",
    params: params
  });
}
//获取模板
export function getTemplate(url, params) {
  return request({
    url: api.urlPort05 + "/sgpm/rest/api/system" + url,
    method: "GET",
    params: params
  });
}
//关联合同
export function getContract(url, params) {
  return request({
    url: api.urlPort03 + url,
    method: "GET",
    params: params
  });
}
//oa发起流程
export function submitOa(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "POST",
    data: data
  });
}
//个人信息
export function getPersonInfor(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "GET",
    params: params
  });
}
//父项目名称
export function getParentProject(url, params) {
  return request({
    url: api.urlPort04 + "/sgpm/rest/api" + url,
    method: "GET",
    params: params
  });
}

//项目启动
export function getProjectStart(url, params) {
  return request({
    url: api.urlPort04 + "/sgpm/rest/api/server" + url,
    method: "GET",
    params: params
  });
}

//获取所有菜单
export function getProjectMenu(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "get",
    params: params
  });
}
//获取角色下菜单
export function getProjectMenuByRole(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "get",
    params: params
  });
}
//添加/修改菜单
export function addOrEditMenu(url, params, method) {
  return request({
    url: api.urlPort05 + url,
    method: method,
    data: params
  });
}

//添加/修改角色
export function addOrEditRole(url, params, method) {
  return request({
    url: api.urlPort05 + url,
    method: method,
    data: params
  });
}

//通过角色获取成员信息
export function getGroupTreeByRole(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "get",
    params: params
  });
}
//通过角色获取监管部门信息
export function getSuperviseByRoleId(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "get",
    params: params
  });
}

//通过所有成员信息
export function getGroupTree(url, params) {
  return request({
    url: api.urlPort18085 + url,
    method: "get",
    params: params
  });
}

export function getProject(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "GET",
    params: params
  });
}

export function getNav(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "GET",
    params: params
  });
}

export function updateTime(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "POST",
    data: data
  });
}

export function saveDate(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "POST",
    data: data
  });
}

//提交修改角色对应的成员信息
export function submitMemberByRole(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "post",
    data: params
  });
}
export function getPage(url, params) {
  return request({
    url: api.urlPort05 + "/sgpm/rest/api/system" + url,
    method: "GET",
    params: params
  });
}
// 提交授权
export function authoritySubmit(url, data) {
  return request({
    url: api.urlPort05 + url,
    method: "post",
    data: data
  });
}

// 删除授权
export function authorityCancel(url, data) {
  return request({
    url: api.urlPort05 + url,
    method: "put",
    data: data
  });
}
//项目成员修改
export function editMember(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "PUT", // 请求方法
    data: data
  });
}
//通过项目id获取项目基本信息
export function projectMsgById(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
//提交监管部门
export function submitSuperviseByRole(url, data) {
  return request({
    url: api.urlPort05 + url,
    method: "post", // 请求方法
    data: data
  });
}
//待我审核的项目驳回或通过
export function summary(url, data) {
  return request({
    url: "http://192.168.30.68:1003" + url,
    method: "post", // 请求方法
    data: data
  });
}

export function updateDate(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "GET",
    params: params
  });
}
//项目列表关注
export function care(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post",
    data: data
  });
}
//获取tooken
export function tooken() {
  return request({
    url: "http://oa.supermap.cn/seeyon/rest/token/lishuaiqiang/123456",
    method: "get" // 请求方法
  });
}
//获取oa审核状态
export function oaStatus(url, params) {
  return request({
    url: "http://oa.supermap.cn/seeyon/rest" + url,
    method: "GET",
    params: params
  });
}
//项目列表数据
export function projectListTabel(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post",
    data: data
  });
}

//合同列表数据
export function contractListTabel(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "post",
    data: data
  });
}

//非合同列表数据
export function notContractListTabel(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post",
    data: data
  });
}

//项目列表下拉选数据
export function projectListSelect(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "GET",
    params: params
  });
}
//应用列表 table
export function departmentTabel(url, data) {
  return request({
    // url: 'http://plan51.supermap.cn:18085' + url,
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//项目核算详情表格
export function detailedaccounting(url, data) {
  return request({
    // url: 'http://192.168.23.207:18085' + url,
    url: api.urlPortplan51 + url,
    method: "post", // 请求方法
    data: data
  });
}
//项目核算详情表格
export function projecttabledata(url, data) {
  return request({
    // url: 'http://192.168.23.207:18085' + url,
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//获取审批列表表格数据
export function auditRecord(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "get", // 请求方法
    params: data
  });
}

//填写审核意见并保存
export function saveAuditRecord(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "post", // 请求方法
    data: data
  });
}

//获取管理看板表格
export function getBordTable(url, data) {
  return request({
    // url: 'http://plan51.supermap.cn:18085' + url,
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//右边图表
export function returnedChart(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//左边图表
export function projectChart(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}

//项目核算详情卡片数据
export function DetailsCard(url, data) {
  return request({
    // url: api.urlPortplan51 + url,
    url: 'http://192.168.23.207:8085' + url,
    method: "get", // 请求方法
    params: data
  });
}

//项目核算跳转项目信息
export function CheckList(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: data
  });
}

//进度-在实施项目总览
export function projectImplementChart(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//进度-在实施项目状态展览
export function projectImplementTypeChart(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//进度-在实施项目进度状态统计-表格和堆叠图
export function proStatistics(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//进度-项目验收延期统计-表格和堆叠图
export function proCheck(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//进度-大型项目延期统计-表格和堆叠图
export function proBigger(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//进度-回款进度延期统计-表格和柱状图
export function proBackMoney(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}

//预警-项目超支预警
export function earlyWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//预警-项目回款预警
export function repaymentWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//预警-项目回款滞后计划预警
export function repaymentPlanWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//预警-项目支付预警
export function payWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//预警-保证金预警
export function earnestMoneyWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//预警-保证金预警
export function processWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}
//预警-保证金预警
export function profitWarning(url, data) {
  return request({
    url: api.urlPortplan51 + url,
    method: "get", // 请求方法
    params: data
  });
}

//项目信息查询工时
export function queryWorkSheet(url, data) {
  return request({
    url: api.urlPort8686 + url,
    method: "get", // 请求方法
    params: data
  });
}
//项目信息查询工时
export function workSheetStatistics(url, data) {
  return request({
    url: api.urlPort8686 + url,
    method: "get", // 请求方法
    params: data
  });
}
//项目信息查询工时
export function advancedCondition(url, data) {
  return request({
    // url: 'http://192.168.30.21:11104' + url,
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: data
  });
}

export function isPermissions(url, data) {
  return request({
    url: api.urlPort04 + "/sgpm/rest/api/server/pm/project" + url,
    method: "get", // 请求方法
    params: data
  });
}
//登录
export function login(url, data) {
  return request({
    url: api.urlPort05 + "/sgpm/rest/api/system" + url,
    method: "post", // 请求方法
    data: data
  });
}

export function postProject(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}

export function jyjxTable(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}

export function postProjectSubmit(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "post", // 请求方法
    data: data
  });
}

export function postProjectPeople(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
// 获取项目变更中的所有公司列表
export function companyList(url, data) {
  return request({
    url: api.urlPort05 + url,
    // url: 'http://192.168.30.36:1005' + url,
    method: "post", // 请求方法
    data: data
  });
}
// 获取项目变更中的所有部门列表
export function departmentList(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
// 获取项目变更中的所有部门下的成员
export function memberList(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
// 获取所有销售
export function getAllSeller(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "get", // 请求方法
    params: params
  });
}
// 通过销售员id获取b级和C级部门
export function getinfoBySellerId(url, params) {
  return request({
    url: api.urlPort05 + url,
    method: "get", // 请求方法
    params: params
  });
}

// 拖拽菜单接口
export function dragMenu(url, data) {
  return request({
    url: api.urlPort05 + url,
    method: "post", // 请求方法
    data: data
  });
}

//根据memberId获取员工信息及该员工所在中心的下辖部门
export function userByMemberId(url, params) {
  return request({
    url: api.urlPort05 + url,
    // url: 'http://192.168.30.36:1005' + url,
    method: "get", // 请求方法
    params: params
  });
}

//项目经理变更提交
export function managerSubmit(url, data) {
  return request({
    url: api.urlPort04 + url,
    // url: 'http://192.168.30.36:1004' + url,
    method: "post", // 请求方法
    data: data
  });
}
//项目经理变更提交
export function statusSubmit(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}

//获取月度产值表格
export function getMonthOutput(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}
//已关联已分配 剩余合同产值表格
export function getAssociatedOutput(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
//在建项目剩余合同产值表格
export function getResidueOutput(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}

//查询具体部门 产值
export function getdeptByType(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
//项目拆分根据合同项目编号获取合同信息
export function getListBycontractProjectNum(url, params) {
  return request({
    url: api.urlPort03 + url,
    method: "get", // 请求方法
    params: params
  });
}
//通过合同动态获取项目拆分
export function getItemByContractNumber(url, params) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: params
  });
}
//拆分的项目保存
export function saveSplit(url, data) {
  return request({
    // url: jiexiangUrl + url,
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}

//系统管理模板接口
export function systemInterface(url, data) {
  return request({
    url: api.urlPort05 + url,
    method: "get", // 请求方法
    params: data
  });
}

//文档管理

export function documentationItem(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}

// 获取审批模板
export function examine(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "get", // 请求方法
    params: data
  });
}
// 获取审批模板提交
export function examinetj(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "post", // 请求方法
    data: data
  });
}

// 获取审核意见
export function examinationReport(url, data) {
  return request({
    url: api.urlPort03 + url,
    method: "get", // 请求方法
    params: data
  });
}


// 获取审核意见
export function getBlevelList(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    params: data
  });
}
// 获取保证金综合查询列表
export function getCashList(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "post", // 请求方法
    data: data
  });
}

// 项目登记中删除项目
export function delProjectById(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "delete", // 请求方法
    data: data
  });
}
// 项目经理变更获取合同项目经理信息
export function getHTMangeMsg(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "get", // 请求方法
    data: data
  });
}
// 文档管理优秀文档
export function excellent(url, data) {
  return request({
    url: api.urlPort04 + url,
    method: "put", // 请求方法
    data: data
  });
}
