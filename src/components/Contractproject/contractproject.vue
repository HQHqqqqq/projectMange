<template>
	<el-col :span="24" class="projectview">
		<!-- <h1></h1> -->
		<p class="back"><i class="el-icon-back back-size" @click="back"></i></p>
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm" :globalParams="globalParams"></generate-form>
		<div class="btn-item">
			<el-button type="primary" size="mini" @click="saveDate" v-show="isShow" :disabled="isSave">保存</el-button>
			<el-button type="primary" size="mini" @click="handleSubmit" v-show="isShow && isRevoke == 2" :disabled="disabled">提交</el-button>
			<el-button type="primary" size="mini" @click="back">返回</el-button>
		</div>
	</el-col>
</template>
<script>
var select_array = [];
var all_array = [];
var index_array = [];
var projectLevel = [];
import Bus from '../../bus';
import { mapState, mapActions } from 'vuex';
import GenerateForm from '@/components/CreateForm/GenerateForm';
import GenetateFormItem from '@/components/CreateForm/GenerateFormItem';
import '@/components/CreateForm/styles/FormCreate.css';
import { getData } from '../../api/api.js';
import { getMenuList } from '../../api/api.js';
import { submitOa } from '../../api/api.js';
import { getPersonInfor } from '../../api/api.js';
import { serverPostHttpMethod } from '../../api/api.js';
import { updateTime } from '../../api/api.js';
import { getTemplate } from '../../api/api.js';
import { saveDate } from '../../api/api.js';
import { updateDate } from '../../api/api.js';
import { getContract } from '../../api/api.js';
import { projectMsgById } from '../../api/api.js';
import api from "../../api/index"; // 引用url.js
export default {
	name: 'CreateFrom_setname',
	components: {
		GenerateForm,
		GenetateFormItem
	},
	data() {
		return {
			isShow: this.$route.query.isShow == 1 ? false : true, //默认显示 1不显示提交按钮
			isSave: false,
			jsonData: {
				list: '',
				config: {
					labelPosition: 'left',
					labelWidth: 100,
					size: 'small'
				}
			},
			//       jsonData: {
			//   "list": [
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 24,
			//           "list": [
			//             {
			//               "type": "row",
			//               "name": "已签合同立项登记",
			//               "icon": "icon-row",
			//               "isShow": "false",
			//               "options": {
			//                 "width": "100%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "pattern": "",
			//                 "placeholder": "已签合同立项登记",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1566285455000_81509",
			//                 "listened": false
			//               },
			//               "key": "1566285455000_81509",
			//               "model": "row_1560323965000_18846",
			//               "rules": []
			//             },
			//             {
			//               "type": "divider",
			//               "name": "分割线",
			//               "icon": "icon-divider",
			//               "isShow": "false",
			//               "options": {
			//                 "width": "100%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1566285770000_77739"
			//               },
			//               "key": "1566285770000_77739",
			//               "model": "divider_1566285770000_77739",
			//               "rules": []
			//             },
			//             {
			//               "type": "row2",
			//               "icon": "icon-row",
			//               "isShow": "false",
			//               "options": {
			//                 "width": "100%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "pattern": "",
			//                 "placeholder": "合同信息",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1566285275000_70989",
			//                 "listened": false
			//               },
			//               "key": "1566285275000_70989",
			//               "model": "row2_1560323984000_57033",
			//               "rules": []
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1566285254000_45152",
			//         "listened": false
			//       },
			//       "key": "1566285254000_45152",
			//       "model": "grid_1566285254000_45152",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 12,
			//           "list": [
			//             {
			//               "type": "select",
			//               "name": "关联合同",
			//               "icon": "icon-select",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "defaultValue": "",
			//                 "multiple": false,
			//                 "disabled": false,
			//                 "clearable": false,
			//                 "placeholder": "",
			//                 "required": true,
			//                 "showLabel": false,
			//                 "width": "50%",
			//                 "options": [
			//                   {
			//                     "value": "下拉框1"
			//                   },
			//                   {
			//                     "value": "下拉框2"
			//                   },
			//                   {
			//                     "value": "下拉框3"
			//                   }
			//                 ],
			//                 "remote": true,
			//                 "filterable": false,
			//                 "remoteOptions": [],
			//                 "props": {
			//                   "value": "contractNumber",
			//                   "label": "value",
			//                   "url": "`http://project.supermap.cn:11003/sgpm/rest/api/integration/oa/contracts/${this.arg.memberId}`"
			//                 },
			//                 "remoteFunc": "func_1566285249000_83547",
			//                 "listened": true,
			//                 "listen": []
			//               },
			//               "config": {
			//                 "labelPosition": ""
			//               },
			//               "key": "1566285249000_83547",
			//               "model": "contactcontract",
			//               "rules": [
			//                 {
			//                   "required": true,
			//                   "message": "关联合同必须填写"
			//                 }
			//               ]
			//             }
			//           ]
			//         },
			//         {
			//           "span": 12,
			//           "list": []
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1566285245000_22010",
			//         "listened": false
			//       },
			//       "key": "1566285245000_22010",
			//       "model": "grid_1566285245000_22010",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 12,
			//           "list": [
			//             {
			//               "type": "input",
			//               "name": "合同编号",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.CONTRACTNUMBER}`.toString()!='undefined'? `${this.arg.data.CONTRACTNUMBER}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1566286520000_16351",
			//                 "listened": false
			//               },
			//               "key": "1566286520000_16351",
			//               "model": "contractnumber",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "合同编号格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "项目销售",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.CONTRACTMARKET}`.toString()!='undefined'? `${this.arg.data.CONTRACTMARKET}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564643609000_4333",
			//                 "listened": false
			//               },
			//               "key": "1564643609000_4333",
			//               "model": "contractmarket",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "项目销售格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "销售B级单位",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.CUSTOMERCENTER}`.toString()!='undefined'? `${this.arg.data.CUSTOMERCENTER}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564644350000_81685",
			//                 "listened": false
			//               },
			//               "key": "1566286526000_23751",
			//               "model": "customercenter",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "销售B级单位格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "行业",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.INDUSTRY}`.toString()!='undefined'? `${this.arg.data.INDUSTRY}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564644350000_81685",
			//                 "listened": false
			//               },
			//               "key": "1566286708000_4443",
			//               "model": "industry",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "行业格式不正确"
			//                 }
			//               ]
			//             }
			//           ]
			//         },
			//         {
			//           "span": 12,
			//           "list": [
			//             {
			//               "type": "input",
			//               "name": "合同额(万元)",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.CONTRACTMONEY}`.toString()!='undefined'? `${this.arg.data.CONTRACTMONEY}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564643536000_88324",
			//                 "listened": false
			//               },
			//               "key": "1564643536000_88324",
			//               "model": "contractmoney",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "合同额(万元)格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "合同签订时间",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.CONTRACTSIGNINGDATE}`.toString()!='undefined'? `${this.arg.data.CONTRACTSIGNINGDATE}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564643694000_68632",
			//                 "listened": false
			//               },
			//               "key": "1564643694000_68632",
			//               "model": "contractsigningdate",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "合同签订时间格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "销售C级单位",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.CUSTOMERDEPARTMENT}`.toString()!='undefined'? `${this.arg.data.CUSTOMERDEPARTMENT}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564644417000_42298",
			//                 "listened": false
			//               },
			//               "key": "1566286528000_52387",
			//               "model": "customerdepartment",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "销售C级单位格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "区域",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data.REGION}`.toString()!='undefined'? `${this.arg.data.REGION}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564644417000_42298",
			//                 "listened": false
			//               },
			//               "key": "1564644417000_42298",
			//               "model": "region",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "区域格式不正确"
			//                 }
			//               ]
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1564643463000_14300",
			//         "listened": false
			//       },
			//       "key": "1564643463000_14300",
			//       "model": "grid_1564643463000_14300",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 24,
			//           "list": [
			//             {
			//               "type": "row2",
			//               "icon": "icon-row",
			//               "isShow": "false",
			//               "options": {
			//                 "width": "100%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "pattern": "",
			//                 "placeholder": "项目信息",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1566285334000_46144",
			//                 "listened": false
			//               },
			//               "key": "1566285334000_46144",
			//               "model": "row2_1566285334000_46144",
			//               "rules": []
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1566285306000_31062"
			//       },
			//       "key": "1566285306000_31062",
			//       "model": "grid_1566285306000_31062",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 12,
			//           "list": [
			//             {
			//               "type": "input",
			//               "name": "项目名称",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data1.PROJECTNAME}`.toString()!='undefined'? `${this.arg.data1.PROJECTNAME}`:''",
			//                 "required": true,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1564644929000_47281",
			//                 "listened": false
			//               },
			//               "key": "1564644929000_47281",
			//               "model": "projectname",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "项目名称格式不正确"
			//                 },
			//                 {
			//                   "required": true,
			//                   "message": "项目名称必须填写"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "实施B级单位",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564645000000_47527",
			//                 "listened": false
			//               },
			//               "key": "1564645000000_47527",
			//               "model": "impldepartment",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "实施B级单位格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "项目经理",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564645153000_64713",
			//                 "listened": false
			//               },
			//               "key": "1564645153000_64713",
			//               "model": "projectmanager",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "项目经理格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "项目级别",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "parseFloat(`${this.arg.data.CONTRACTMONEY}`.replace(/,/g,''))>=1000?'超大型':parseFloat(`${this.arg.data.CONTRACTMONEY}`.replace(/,/g,''))>=500&&parseFloat(`${this.arg.data.CONTRACTMONEY}`.replace(/,/g,''))<=1000?'大型':parseFloat(`${this.arg.data.CONTRACTMONEY}`.replace(/,/g,''))>=200&&parseFloat(`${this.arg.data.CONTRACTMONEY}`.replace(/,/g,''))<500?'中型':'小型'",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1566287370000_9664",
			//                 "listened": false
			//               },
			//               "key": "1566287370000_9664",
			//               "model": "projectlevel",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "项目级别格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "date",
			//               "name": "项目预计开始时间",
			//               "icon": "icon-date",
			//               "isShow": "true",
			//               "options": {
			//                 "defaultValue": "",
			//                 "readonly": false,
			//                 "disabled": false,
			//                 "editable": true,
			//                 "clearable": true,
			//                 "placeholder": "",
			//                 "startPlaceholder": "",
			//                 "endPlaceholder": "",
			//                 "type": "date",
			//                 "format": "yyyy-MM-dd",
			//                 "timestamp": false,
			//                 "required": true,
			//                 "width": "50%",
			//                 "remoteFunc": "func_1564647825000_12653",
			//                 "listened": false
			//               },
			//               "key": "1564647825000_12653",
			//               "model": "projectstartdate",
			//               "rules": [
			//                 {
			//                   "required": true,
			//                   "message": "项目级别必须填写"
			//                 }
			//               ]
			//             }
			//           ]
			//         },
			//         {
			//           "span": 12,
			//           "list": [
			//             {
			//               "type": "input",
			//               "name": "项目编号",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "50%",
			//                 "defaultValue": "`${this.arg.data1.PROJECTNUMBER}`.toString()!='undefined'? `${this.arg.data1.PROJECTNUMBER}`:''",
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": true,
			//                 "remoteFunc": "func_1564644952000_46749",
			//                 "listened": false
			//               },
			//               "key": "1564644952000_46749",
			//               "model": "projectnumber",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "项目编号格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "select",
			//               "name": "实施C级单位",
			//               "icon": "icon-select",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "defaultValue": "",
			//                 "multiple": false,
			//                 "disabled": false,
			//                 "clearable": false,
			//                 "placeholder": "",
			//                 "required": false,
			//                 "showLabel": false,
			//                 "width": "50%",
			//                 "options": [
			//                   {
			//                     "value": "下拉框1"
			//                   },
			//                   {
			//                     "value": "下拉框2"
			//                   },
			//                   {
			//                     "value": "下拉框3"
			//                   }
			//                 ],
			//                 "remote": true,
			//                 "filterable": false,
			//                 "remoteOptions": [],
			//                 "props": {
			//                   "value": "deptId",
			//                   "label": "deptName",
			//                   "url": "`http://192.168.23.120:11005/sgpm/rest/api/system/second/dept/${this.arg.subdept_id}`"
			//                 },
			//                 "remoteFunc": "func_1567501210000_25667",
			//                 "listened": false,
			//                 "listen": []
			//               },
			//               "config": {
			//                 "labelPosition": ""
			//               },
			//               "key": "1567501210000_25667",
			//               "model": "implementationsecondary",
			//               "rules": []
			//             },
			//             {
			//               "type": "select",
			//               "name": "项目运维期(年)",
			//               "icon": "icon-select",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "defaultValue": "新选项",
			//                 "multiple": false,
			//                 "disabled": false,
			//                 "clearable": false,
			//                 "placeholder": "",
			//                 "required": true,
			//                 "showLabel": false,
			//                 "width": "50%",
			//                 "options": [
			//                   {
			//                     "value": "1"
			//                   },
			//                   {
			//                     "value": "2"
			//                   },
			//                   {
			//                     "value": "3"
			//                   },
			//                   {
			//                     "value": "4"
			//                   },
			//                   {
			//                     "value": "5"
			//                   },
			//                   {
			//                     "value": "无"
			//                   }
			//                 ],
			//                 "remote": false,
			//                 "filterable": false,
			//                 "remoteOptions": [],
			//                 "props": {
			//                   "value": "id",
			//                   "label": "value",
			//                   "url": "`http://project.supermap.cn:11003/sgpm/rest/api/integration/oa/contracts/${this.arg.memberId}`"
			//                 },
			//                 "remoteFunc": "func_1564645404000_720",
			//                 "listened": false,
			//                 "listen": []
			//               },
			//               "config": {
			//                 "labelPosition": ""
			//               },
			//               "key": "1566291696000_33843",
			//               "model": "operationalperiod",
			//               "rules": [
			//                 {
			//                   "required": true,
			//                   "message": "项目运维期(年)必须填写"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "select",
			//               "name": "项目类型",
			//               "icon": "icon-select",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "defaultValue": "新选项",
			//                 "multiple": false,
			//                 "disabled": false,
			//                 "clearable": false,
			//                 "placeholder": "",
			//                 "required": true,
			//                 "showLabel": false,
			//                 "width": "50%",
			//                 "options": [],
			//                 "remote": true,
			//                 "filterable": false,
			//                 "remoteOptions": [],
			//                 "props": {
			//                   "value": "value",
			//                   "label": "value",
			//                   "url": "`http://project.supermap.cn:11004/sgpm/rest/api/server/pm/project/projecttype`"
			//                 },
			//                 "remoteFunc": "func_1564645404000_720",
			//                 "listened": false,
			//                 "listen": []
			//               },
			//               "config": {
			//                 "labelPosition": ""
			//               },
			//               "key": "1564645404000_720",
			//               "model": "projecttype",
			//               "rules": [
			//                 {
			//                   "required": true,
			//                   "message": "项目经理必须填写"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "date",
			//               "name": "项目预计结束时间",
			//               "icon": "icon-date",
			//               "isShow": "true",
			//               "options": {
			//                 "defaultValue": "",
			//                 "readonly": false,
			//                 "disabled": false,
			//                 "editable": true,
			//                 "clearable": true,
			//                 "placeholder": "",
			//                 "startPlaceholder": "",
			//                 "endPlaceholder": "",
			//                 "type": "date",
			//                 "format": "yyyy-MM-dd",
			//                 "timestamp": false,
			//                 "required": true,
			//                 "width": "50%",
			//                 "remoteFunc": "func_1564647831000_14733",
			//                 "listened": false
			//               },
			//               "key": "1564647831000_14733",
			//               "model": "projectenddate",
			//               "rules": [
			//                 {
			//                   "required": true,
			//                   "message": "项目级别必须填写"
			//                 }
			//               ]
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1564644868000_65758"
			//       },
			//       "key": "1564644868000_65758",
			//       "model": "grid_1564644868000_65758",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 24,
			//           "list": [
			//             {
			//               "type": "tag",
			//               "name": "项目关键字",
			//               "icon": "icon-jilianxuanze",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "",
			//                 "defaultValue": [],
			//                 "required": true,
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "remoteFunc": "func_1566287537000_33794",
			//                 "listened": false
			//               },
			//               "key": "1566287537000_33794",
			//               "model": "keyword",
			//               "rules": []
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1566287526000_27292",
			//         "listened": false
			//       },
			//       "key": "1566287526000_27292",
			//       "model": "grid_1566287526000_27292",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 24,
			//           "list": [
			//             {
			//               "type": "row2",
			//               "icon": "icon-row",
			//               "isShow": "false",
			//               "options": {
			//                 "width": "100%",
			//                 "defaultValue": "",
			//                 "required": false,
			//                 "pattern": "",
			//                 "placeholder": "项目简介",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1566285381000_99122",
			//                 "listened": false
			//               },
			//               "key": "1566285381000_99122",
			//               "model": "row2_1566285381000_99122",
			//               "rules": []
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1566285353000_35017",
			//         "listened": false
			//       },
			//       "key": "1566285353000_35017",
			//       "model": "grid_1566285353000_35017",
			//       "rules": []
			//     },
			//     {
			//       "type": "grid",
			//       "name": "栅格布局",
			//       "icon": "icon-grid-",
			//       "columns": [
			//         {
			//           "span": 24,
			//           "list": [
			//             {
			//               "type": "input",
			//               "name": "建设内容",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "76%",
			//                 "defaultValue": "`${this.arg.data1.CONSTRUCTIONCONTENT}`.toString()!='undefined'? `${this.arg.data1.CONSTRUCTIONCONTENT}`:''",
			//                 "required": true,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1564646891000_21555",
			//                 "listened": false
			//               },
			//               "key": "1564646891000_21555",
			//               "model": "constructioncontent",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "建设内容格式不正确"
			//                 },
			//                 {
			//                   "required": true,
			//                   "message": "建设内容必须填写"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "input",
			//               "name": "拟使用的超图系统或模块",
			//               "icon": "icon-input",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "76%",
			//                 "defaultValue": "`${this.arg.data1.BUSINESSSYSTEM}`.toString()!='undefined'? `${this.arg.data1.BUSINESSSYSTEM}`:''",
			//                 "required": false,
			//                 "dataType": "string",
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "disabled": false,
			//                 "remoteFunc": "func_1564646984000_89483",
			//                 "listened": false
			//               },
			//               "key": "1564646984000_89483",
			//               "model": "businesssystem",
			//               "rules": [
			//                 {
			//                   "type": "string",
			//                   "message": "拟使用的超图系统或模块格式不正确"
			//                 }
			//               ]
			//             },
			//             {
			//               "type": "tag",
			//               "name": "拟使用的关键技术",
			//               "icon": "icon-jilianxuanze",
			//               "isShow": "true",
			//               "url": "",
			//               "options": {
			//                 "width": "85%",
			//                 "defaultValue": [],
			//                 "required": false,
			//                 "pattern": "",
			//                 "placeholder": "",
			//                 "remoteFunc": "func_1564647025000_51092",
			//                 "listened": false
			//               },
			//               "key": "1564647025000_51092",
			//               "model": "keytechnology",
			//               "rules": []
			//             }
			//           ]
			//         }
			//       ],
			//       "options": {
			//         "gutter": 0,
			//         "justify": "start",
			//         "align": "top",
			//         "remoteFunc": "func_1564646862000_49031",
			//         "listened": false
			//       },
			//       "key": "1564646862000_49031",
			//       "model": "grid_1564646862000_49031",
			//       "rules": []
			//     }
			//   ],
			//   "config": {
			//     "labelWidth": 100,
			//     "labelPosition": "left",
			//     "size": "small"
			//   }
			// },
			projectData: [],
			pId: '',
			pNum: '',
			projectId: this.$route.query.id,
			contractNumber: this.$route.query.contractNumber,
			editData: {},
			remoteFuncs: {},
			globalParams: {},
			projectInfo: [],
			deptInfo: [],
			disabled: false
		};
	},
	computed: {
		...mapState([
			'userinfo', //oa跳转过来的用户信息值
			'isDetail' //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
		]),
		isRevoke: function() {
			return sessionStorage.getItem('isRevoke');
		}
	},
	// 8.20
	created() {
		var businessProjectId = localStorage.getItem('businessProjectId');
		this.globalParams.account_id = this.userinfo.account_id;
		this.globalParams.memberId = this.userinfo.memberid;
		this.globalParams.subdept_id = this.userinfo.subdept_id;
		this.globalParams.businessProjectId = businessProjectId;
		this.initModule();
		if (businessProjectId) {
			this.initBusinessData(businessProjectId);
		}
		this.initModuleDept();
		this.getDept();
		this.$nextTick(() => {
			Bus.$on('audit', ({ obj, projectId }) => {
				this.globalParams.businessProjectId = projectId;
				this.$set(this.globalParams, 'data', obj);
				this.$set(this.globalParams, 'data1', obj);
				this.globalParams.data = obj;
			});
		});
		if (this.$route.fullPath == '/Contractproject?judgelogo=b') {
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
		}
	},
	mounted() {
		// console.log(this.projectId);
		Bus.$on('contractInfo', item => {
			if (item) {
				this.itemInfo = item;
			}
		});
		Bus.$on('keyword', item => {
			if (item) {
				this.keywordList = item;
			}
		});
		Bus.$on('keytechnology', item => {
			if (item) {
				this.keytechnologyList = item;
			}
		});
		Bus.$on('projectlevel', item => {
			if (item) {
				this.projectlevel = item;
			}
		});
		//获取合同面
		var that = this;
		var id = 2; //商机1，合同2，启动3
		var account_id = this.userinfo.account_id;
		var url = '/template/' + id + '/' + account_id;
		getTemplate(url)
			.then(res => {
				this.jsonData = res.data.data;
			})
			.catch(err => {
				console.log(err);
			});
	},
	methods: {
		getDept() {
			var subdept_id = this.userinfo.subdept_id;
			var url = api.urlPort05+'/sgpm/rest/api/system/second/dept/' + subdept_id;
			this.axios
				.get(url)
				.then(res => {
					this.deptInfo = res.data.data;
				})
				.catch(err => {
					console.log(err);
				});
		},
		//提示信息
		warnMessage() {
			this.$message({
				showClose: true,
				message: '项目关键字不能为空',
				type: 'warning'
			});
		},
		warnMessage2() {
			this.$message({
				showClose: true,
				message: '拟使用的关键技术不能为空',
				type: 'warning'
			});
		},
		// 8.20
		initModule() {
			// let url = "/sgpm/rest/api/integration/oa/contract/wanyuan/";
			localStorage.removeItem('globalParams');
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
			this.$nextTick(() => {
				if (this.contractNumber) {
					localStorage.removeItem('globalParams');
					let url = `/sgpm/rest/api/integration/data/contract/${this.userinfo.account_id}?contractNumber=${this.contractNumber}`; //2020 1,9新
					getContract(url, null).then(res => {
						this.$set(this.globalParams, 'data', res.data.data);
						setTimeout(() => {
							localStorage.setItem('globalParams', JSON.stringify(this.updateJsonData(res.data.data)));
							if (!res.data.data.KEYWORD) {
								res.data.data.KEYWORD = '';
							}
							if (!res.data.data.KEYTECHNOLOGY) {
								res.data.data.KEYTECHNOLOGY = '';
							}
							localStorage.setItem('keyWords', res.data.data.KEYWORD);
							localStorage.setItem('keytechnologys', res.data.data.KEYTECHNOLOGY);
						}, 500);
						this.projectInfo = res.data.data;
					});
				} else {
					Bus.$on('contactcontract', ({ model, val }) => {
						if (/.*[\u4e00-\u9fa5]+.*$/.test(val)) {
							var index = val.lastIndexOf('-');
							val = val.substring(0, index);
							return val;
						}
						let url = `/sgpm/rest/api/integration/data/contract/${this.userinfo.account_id}?contractNumber=${val}`; //2020 1,9新
						getContract(url, null).then(res => {
							this.$set(this.globalParams, 'data', res.data.data);
							this.projectInfo = res.data.data;
						});
					});
				}
			});
		},
		initModuleDept() {
			var that = this;
			this.$nextTick(() => {
				Bus.$on('implementationsecondary', ({ model, val }) => {
					// console.log(val,model)
				});
			});
		},
		initBusinessData(businessProjectId) {
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
			//通过项目id获取项目基本信息
			projectMsgById('/sgpm/rest/api/server/pm/project?projectId=' + businessProjectId, null)
				.then(res => {
					localStorage.removeItem('globalParams');
					localStorage.setItem('keyWords', res.data.data.KEYWORD);
					localStorage.setItem('keytechnologys', res.data.data.KEYTECHNOLOGY);
					this.$set(this.globalParams, 'data', res.data.data);
					localStorage.setItem('globalParams', JSON.stringify(this.updateJsonData(res.data.data)));
					this.$set(this.globalParams, 'data', res.data.data);
					localStorage.setItem('globalParams', JSON.stringify(this.updateJsonData(res.data.data)));
					this.$set(this.globalParams, 'CONTRACTMARKET', res.data.data.CONTRACTMARKET);
					this.$set(this.globalParams, 'PROJECTNAME', res.data.data.PROJECTNAME);
					this.$set(this.globalParams, 'PROJECTNUMBER', res.data.data.PROJECTNUMBER);
					this.$set(this.globalParams, 'CONSTRUCTIONCONTENT', res.data.data.CONSTRUCTIONCONTENT);
					this.$set(this.globalParams, 'BUSINESSSYSTEM', res.data.data.BUSINESSSYSTEM);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//通过projectId获取的数据拆分
		updateJsonData(obj) {
			let result = {};
			for (let item in obj) {
				if (item == 'CONTRACT') {
					for (let jtem in obj[item]) {
						result[jtem] = obj[item][jtem];
					}
				} else {
					result[item] = obj[item];
				}
			}
			return result;
		},

		//提交
		handleSubmit() {
			this.disabled = true;
			this.isSave = true;
			var that = this;
			this.$refs.generateForm
				.getData()
				.then(data => {
					if (this.userinfo.account_id == '-1360422574114386809') {
						//超图
					} else {
						//国图
					}
					// 数据校验成功
					// data 为获取的表单数据
					// console.log(data);
					var level_two_name = '';
					var level_two_id = '';
					if (data.implementationsecondary) {
						this.deptInfo.forEach(item => {
							if (item.deptId == data.implementationsecondary || item.deptName == data.implementationsecondary) {
								level_two_name = item.deptName;
								level_two_id = item.deptId;
							}
						});
					} else {
						level_two_name = '';
						level_two_id = '';
					}
					var prostartdate = new Date(data.projectstartdate.replace(/\-/g, '/'));
					var proenddate = new Date(data.projectenddate.replace(/\-/g, '/'));
					if (prostartdate >= proenddate) {
						alert('项目预计开始时间不能大于项目预计结束时间！');
						this.disabled = false;
						this.isSave = false;
						return false;
					}
					var keyword = '';
					var keytechnology = '';
					var businesssystem = "";
					if(data.businesssystem == undefined){
						businesssystem = '';
					}else{
						businesssystem = data.businesssystem;
					}
					if (that.$route.query.id != undefined && that.$route.query.id != null && that.pId == '') {
						if (this.keywordList) {
							keyword = this.keywordList.join(',');
						} else {
							keyword = data.keyword;
						}
						if (keyword == '') {
							this.warnMessage();
							this.disabled = false;
							this.isSave = false;
							return;
						}
						if (this.keytechnologyList) {
							keytechnology = this.keytechnologyList.join(',');
						} else {
							keytechnology = data.keytechnology;
						}
						if (keytechnology == '') {
							this.warnMessage2();
							this.disabled = false;
							this.isSave = false;
							return;
						}
						var id = '';
						if (that.$route.query.id) {
							id = that.$route.query.id;
						} else {
							id = this.pId;
						}
						var projectNum = '';
						if (data.projectnumber) {
							projectNum = data.projectnumber;
						} else {
							projectNum = this.pNum;
						}
						//编辑
						var data = {
							id: id,
							project: {
								name: data.projectname,
								custom_field_values: {
									13: data.contractnumber,
									16: data.customercenter,
									17: data.contractmarket,
									18: data.contractmoney,
									19: data.contractsigningdate,
									22: data.projectlevel,
									23: data.operationalperiod,
									24: data.industry,
									25: data.region,
									// 26: data.contractprostartdate,
									// 27: data.contractproenddate,
									28: data.projectstartdate,
									29: data.projectenddate,
									30: data.projecttype,
									32: keyword,
									35: data.constructioncontent,
									36: keytechnology,
									41: businesssystem,
									42: 2,
									43: data.customerdepartment
								},
								parent_id: '',
								description: '',
								is_public: '1',
								user_id: that.userinfo.memberid,
								user_name: that.userinfo.emp_name,
								company_name: that.userinfo.account_name,
								company_id: that.userinfo.account_id,
								level_one_name: that.userinfo.subdept_name,
								level_one_id: that.userinfo.subdept_id,
								level_two_name: level_two_name,
								level_two_id: level_two_id,
								sale_name: data.contractmarket,
								sale_id: data.saleid,
								project_no: projectNum
							},
							child: 0,
							category: 2,
							account_name: that.userinfo.account_name,
							username: that.userinfo.login_name,
							workflow_type: 1 //0,商机项目  1，合同项目  2，子项目  3，非合同类项目
						};
					} else {
						//填写
						if (this.keywordList) {
							keyword = this.keywordList.join(',');
						}
						if (keyword == '') {
							this.warnMessage();
							this.disabled = false;
							this.isSave = false;
							return;
						}
						if (this.keytechnologyList) {
							keytechnology = this.keytechnologyList.join(',');
						}
						if (keytechnology == '') {
							this.warnMessage2();
							this.disabled = false;
							this.isSave = false;
							return;
						}
						if (this.projectData.project_id == undefined) {
							this.projectData.project_id = '';
						}
						var data = {
							id: this.projectData.project_id,
							project: {
								name: data.projectname,
								custom_field_values: {
									13: data.contractnumber,
									16: data.customercenter,
									17: data.contractmarket,
									18: data.contractmoney,
									19: data.contractsigningdate,
									22: data.projectlevel,
									23: data.operationalperiod,
									24: data.industry,
									25: data.region,
									// 26: data.contractprostartdate,
									// 27: data.contractproenddate,
									28: data.projectstartdate,
									29: data.projectenddate,
									30: data.projecttype,
									32: keyword,
									35: data.constructioncontent,
									36: keytechnology,
									41: businesssystem,
									42: 2,
									43: data.customerdepartment
								},
								parent_id: '',
								description: '',
								is_public: '1',
								user_id: this.userinfo.memberid,
								user_name: this.userinfo.emp_name,
								company_name: this.userinfo.account_name,
								company_id: this.userinfo.account_id,
								level_one_name: this.userinfo.subdept_name,
								level_one_id: this.userinfo.subdept_id,
								level_two_name: level_two_name,
								level_two_id: level_two_id,
								sale_name: data.contractmarket,
								sale_id: this.projectInfo.FIELD0022,
								project_no: data.projectnumber
							},
							child: 0,
							category: 2,
							account_name: this.userinfo.account_name,
							username: this.userinfo.login_name,
							workflow_type: 1 //0,商机项目  1，合同项目  2，子项目  3，非合同类项目
						};
					}
					submitOa('/sgpm/rest/api/integration/oa/flow', data)
						.then(res => {
							// console.log(res);
							if (res.data.code == 200) {
								this.disabled = true;
								this.isSave = false;
								alert('提交成功!');
								// var params = {
								//   projectId: res.data.data.project_id
								// };
								//判断是否可以提交
								// updateDate("/sgpm/rest/api/server/pm/project", params)
								//   .then(res => {
								//     if (res.data.code == 200) {
								//       if (res.data.data.processId != null) {
								//         this.disabled = true;
								//       } else {
								//         this.disabled = false;
								//       }
								//     }
								//   })
								//   .catch(err => {
								//     console.log(err);
								//   });
								this.$router.push({
									path: 'audititem'
								});
							} else if (res.data.code == 501) {
								this.disabled = false;
								this.isSave = false;
								this.pId = res.data.data.project_id;
								this.pNum = res.data.data.project_no;
								alert('提交失败!');
								// alert("提交失败，可从待发流程列表中编辑该流程重新发起!");
								// this.$router.push({
								//   path: "audititem"
								// });
							} else {
								this.disabled = false;
								this.isSave = false;
								alert('提交失败!');
							}
						})
						.catch(err => {
							console.log(err);
							this.disabled = false;
							this.isSave = false;
							alert('提交失败!');
							// alert("提交失败，可从待发流程列表中编辑该流程重新发起!");
							// this.$router.push({
							//   path: "audititem"
							// });
						});
				})
				.catch(e => {
					// 数据校验失败
					console.log(e);
					this.disabled = false;
					this.isSave = false;
				});
		},

		//保存
		saveDate() {
			this.isSave = true;
			this.disabled = true;
			var that = this;
			this.$refs.generateForm
				.getData()
				.then(data => {
					var level_two_name = '';
					var level_two_id = '';
					if (data.implementationsecondary) {
						this.deptInfo.forEach(item => {
							if (item.deptId == data.implementationsecondary || item.deptName == data.implementationsecondary) {
								level_two_name = item.deptName;
								level_two_id = item.deptId;
							}
						});
					} else {
						level_two_name = '';
						level_two_id = '';
					}
					var prostartdate = new Date(data.projectstartdate.replace(/\-/g, '/'));
					var proenddate = new Date(data.projectenddate.replace(/\-/g, '/'));
					if (prostartdate >= proenddate) {
						alert('项目预计开始时间不能大于项目预计结束时间！');
						this.isSave = false;
						this.disabled = false;
						return false;
					}
					var keyword = '';
					var keytechnology = '';
					if ((that.$route.query.id != undefined && that.$route.query.id != null) || this.pId) {
						if (this.keywordList) {
							keyword = this.keywordList.join(',');
						} else {
							keyword = data.keyword;
						}
						if (keyword == '') {
							this.warnMessage();
							this.isSave = false;
							this.disabled = false;
							return;
						}
						if (this.keytechnologyList) {
							keytechnology = this.keytechnologyList.join(',');
						} else {
							keytechnology = data.keytechnology;
						}
						if (keytechnology == '') {
							this.warnMessage2();
							this.isSave = false;
							this.disabled = false;
							return;
						}
						var id = '';
						if (that.$route.query.id) {
							id = that.$route.query.id;
						} else {
							id = this.pId;
						}
						var projectNum = '';
						if (data.projectnumber) {
							projectNum = data.projectnumber;
						} else {
							projectNum = this.pNum;
						}
						//编辑
						var data = {
							id: id,
							project: {
								name: data.projectname,
								custom_field_values: {
									13: data.contractnumber,
									16: data.customercenter,
									17: data.contractmarket,
									18: data.contractmoney,
									19: data.contractsigningdate,
									22: data.projectlevel,
									23: data.operationalperiod,
									24: data.industry,
									25: data.region,
									// 26: data.contractprostartdate,
									// 27: data.contractproenddate,
									28: data.projectstartdate,
									29: data.projectenddate,
									30: data.projecttype,
									32: keyword,
									35: data.constructioncontent,
									36: keytechnology,
									41: data.businesssystem,
									42: 2,
									43: data.customerdepartment
								},
								parent_id: '',
								description: '',
								is_public: '1',
								user_id: that.userinfo.memberid,
								user_name: that.userinfo.emp_name,
								company_name: that.userinfo.account_name,
								company_id: that.userinfo.account_id,
								level_one_name: that.userinfo.subdept_name,
								level_one_id: that.userinfo.subdept_id,
								level_two_name: level_two_name,
								level_two_id: level_two_id,
								sale_name: data.contractmarket,
								sale_id: data.saleid,
								project_no: projectNum
							},
							child: 0,
							category: 2,
							account_name: that.userinfo.account_name
						};
					} else {
						//填写
						if (this.projectData.project_id == undefined) {
							this.projectData.project_id = '';
						}
						// let keywordLi = this.keywordList;
						// keywordLi = keywordLi.substr(1);
						// let keytechnologyLi = this.keytechnologyList;
						// keytechnologyLi = keytechnologyLi.substr(1);
						if (this.keywordList) {
							keyword = this.keywordList.join(',');
						}
						if (keyword == '') {
							this.warnMessage();
							this.isSave = false;
							this.disabled = false;
							return;
						}
						if (this.keytechnologyList) {
							keytechnology = this.keytechnologyList.join(',');
						} else {
							// console.log(this.keytechnologyList);
							keytechnology = this.keytechnologyList.join(',');
						}
						if (keytechnology == '') {
							this.warnMessage2();
							this.isSave = false;
							this.disabled = false;
							return;
						}
						// console.log(keytechnology);
						var data = {
							id: this.projectData.project_id,
							project: {
								name: data.projectname,
								custom_field_values: {
									13: data.contractnumber,
									16: data.customercenter,
									17: data.contractmarket,
									18: data.contractmoney,
									19: data.contractsigningdate,
									22: data.projectlevel,
									23: data.operationalperiod,
									24: data.industry,
									25: data.region,
									// 26: data.contractprostartdate,
									// 27: data.contractproenddate,
									28: data.projectstartdate,
									29: data.projectenddate,
									30: data.projecttype,
									32: keyword,
									35: data.constructioncontent,
									36: keytechnology,
									41: data.businesssystem,
									42: 2,
									43: data.customerdepartment
								},
								parent_id: '',
								description: '',
								is_public: '1',
								user_id: this.userinfo.memberid,
								user_name: this.userinfo.emp_name,
								company_name: this.userinfo.account_name,
								company_id: this.userinfo.account_id,
								level_one_name: this.userinfo.subdept_name,
								level_one_id: this.userinfo.subdept_id,
								level_two_name: level_two_name,
								level_two_id: level_two_id,
								sale_name: data.contractmarket,
								sale_id: this.projectInfo.FIELD0022,
								project_no: data.projectnumber
							},
							child: 0,
							category: 2,
							account_name: this.userinfo.account_name
						};
					}
					saveDate('/sgpm/rest/api/server/pm/project', data)
						.then(res => {
							// console.log(res);

							if (res.data.code == 200) {
								alert('保存成功!');
								this.isSave = false;
								this.disabled = false;
								var data = res.data.data;
								this.pId = res.data.data.project_id;
								this.pNum = res.data.data.project_no;
								this.projectData = data;
								var project_no = data.project_no;
								var jsonList = this.jsonData.list;
								for (var i = 0; i < jsonList.length; i++) {
									for (var j = 0; j < jsonList[i].columns.length; j++) {
										for (var q = 0; q < jsonList[i].columns[j].list.length; q++) {
											if (jsonList[i].columns[j].list[q].model == 'projectnumber') {
												jsonList[i].columns[j].list[q].options.placeholder = res.data.data.value;
											}
										}
									}
								}
							} else {
								alert('保存失败!');
								this.isSave = false;
								this.disabled = false;
							}
						})
						.catch(err => {
							console.log(err);
							alert('保存失败!');
							this.isSave = false;
							this.disabled = false;
						});
				})
				.catch(e => {
					// 数据校验失败
					console.log(e);
					this.isSave = false;
					this.disabled = false;
				});
		},
		//返回
		back() {
			this.$router.go(-1); //返回上一层
		}
	}
};
</script>
<style>
@import '../../assets/css/common.css';
</style>
<style lang="scss" scoped>
.btn-item {
	text-align: center;
}
.projectview {
	overflow-y: auto;
}

.back {
	text-align: left;
	margin-bottom: 0;
	cursor: pointer;

	.back-size {
		font-size: 17px;
	}
}
</style>
