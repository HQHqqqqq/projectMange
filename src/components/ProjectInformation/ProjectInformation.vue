<template>
	<el-col :span="24">
		<div v-loading="boxLoading">
			<generate-form
				:style="{ maxHeight: browerHeight + 'px' }"
				class="projectInfo"
				:data="jsonData"
				:remote="remoteFuncs"
				:value="editData"
				ref="generateForm"
				:globalParams="globalParams"
			></generate-form>
			<div class="p-btn-group">
				<el-button type="primary" size="mini" v-if="judgeproject == '非合同项目信息'||jump_type=='11'" @click="saveNonProMsg" :disabled="!roleStatus" :loading="nonBtnLoading">
					保存
				</el-button>
				<el-button type="primary" size="mini" v-else @click="saveDate" :loading="btnLoading" :disabled="!roleStatus">保存</el-button>
				<el-button type="primary" size="mini" @click="back">返回</el-button>
			</div>
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
import { getTemplate, serverPostHttpMethod } from '../../api/api.js';
import { getMenuList } from '../../api/api.js';
import { getData } from '../../api/api.js';
import { getProject } from '../../api/api.js';
import { saveDate } from '../../api/api.js';
import { serverGetHttpMethod, serverPutHttpMethod } from '../../api/api.js'; //

export default {
	name: 'ProjectInformation',
	components: {
		GenerateForm,
		GenetateFormItem
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			// console.log(vm.$parent.$parent.$parent.getMenu());
			vm.$parent.$parent.$parent.getMenu();
		});
	},
	beforeRouteUpdate(to, from, next) {
		next();
	},
	beforeRouteLeave(to, from, next) {
		next();
	},
	data() {
		return {
			boxLoading: false,
			btnLoading: false, //保存loign
			nonBtnLoading: false, //非合同项目保存按钮login
			loading: false,
			roleStatus: false, //根据权限控制按钮
			browerHeight: window.innerHeight - 190, //固定高度
			// 项目名称
			projectName: '',
			//项目编号
			projectNumber: '',
			jsonData: {
				list: '',
				config: {
					labelPosition: 'left',
					labelWidth: 120,
					size: 'small'
				}
			},
			addData: '',
			addTableData: '',
			projectId: this.$route.params.id,
			parent_id: this.$route.params.parent_id,
			keywordList: '',
			keytechnologyList: '',
			editData: {},
			globalParams: {},
			remoteFuncs: {},
			jump_type:localStorage.getItem('jump_type'),
		};
	},
	watch: {
		$route: function(to, from) {
			this.$router.go(0);
			// 路由改变时执行
			//console.info("to.path:" + to.path);
		}
	},
	computed: {
		...mapState([
			'userinfo' //oa跳转过来的用户信息值
		]),
		judgeproject() {
			return localStorage.getItem('judgeproject');
		}
	},
	created() {
		this.globalParams.memberId = this.userinfo.memberid;
		this.globalParams.account_id = this.userinfo.account_id;

		localStorage.removeItem('contractList');
		// localStorage.removeItem('projectData');
		var param = this.$route.params;
		let parent_id = this.parent_id;
		//parent_id为空是父项目
		if (parent_id == 'null' || parent_id == undefined) {
			parent_id = null;
		}
		if (parent_id === null) {
			var memberId = '7503529197009650726';
			var menuId = 13;
			var url = '/template?memberId=' + memberId + '&menuId=' + menuId;
			var projectNumber = window.localStorage.projectNumber;
			var jump_type = localStorage.getItem('jump_type');
			if (this.projectId) {
				var projectId = this.projectId;
			} else {
				var projectId = window.localStorage.projectId;
			}
			localStorage.removeItem('projectData');
			if (this.judgeproject == '非合同项目信息' || jump_type == '11') {
				this.getNonContractData(projectId, projectNumber);
			} else {
				this.getParentData(projectId);
			}
		} else {
			// 子项目
			var id = 12;
			var url = '/template/' + id;
			if (this.projectId) {
				var projectId = this.projectId;
			} else {
				var projectId = window.localStorage.projectId;
			}
			localStorage.removeItem('projectData');
			this.getChildData(projectId);
		}
		Bus.$on('projectContent', item => {
			if (item) {
				if (item.parent_id == undefined || item.parent_id == null || item.parent_id == 'null' || item.parent_id == 'undefined') {
					var memberId = '7503529197009650726';
					var menuId = 13;
					var url = '/template?memberId=' + memberId + '&menuId=' + menuId;
				} else {
					var id = 12;
					var url = '/template/' + id;
				}
			}
			this.getMemberRole(); //从接口获取角色信息
		});
		getMenuList(url)
			.then(res => {
				var _this = this;
				var data = {
					list: [
						{
							columns: [
								{
									list: [
										{
											name: '自定义文字',
											icon: 'icon-row',
											options: {
												remoteFunc: 'func_1562572989000_63965',
												defaultValue: '',
												width: '100%',
												pattern: '',
												disabled: false,
												placeholder: '基本信息',
												required: false
											},
											model: 'row2_1562572989000_63965',
											rules: [],
											type: 'row2',
											key: '1562572989000_63965',
											isShow: 'false'
										},
										{
											name: '分割线',
											icon: 'icon-divider',
											options: {
												remoteFunc: 'func_1566453577000_37234',
												defaultValue: '',
												width: '10%',
												pattern: '',
												disabled: false,
												placeholder: '',
												required: false
											},
											model: 'divider_1566453577000_37234',
											rules: [],
											type: 'divider',
											key: '1566453577000_37234',
											isShow: 'false'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1562567055000_79929',
								gutter: 0,
								justify: 'start',
								align: 'top',
								listened: false
							},
							model: 'grid_1562567055000_79929',
							rules: [],
							type: 'grid',
							key: '1562567055000_7992911'
						},
						{
							columns: [
								{
									list: [
										{
											name: '项目名称',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445271000_32253',
												defaultValue: '',
												dataType: 'string',
												width: '75%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'projectname',
											rules: [
												{
													type: 'string',
													message: '项目名称格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1566445271000_32253',
											isShow: 'true'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1562567055000_79929',
								gutter: 0,
								justify: 'start',
								align: 'top'
							},
							model: 'grid_1562567055000_79929',
							rules: [],
							type: 'grid',
							key: '1562567055000_7992922'
						},
						{
							columns: [
								{
									list: [
										{
											name: '项目经理',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1560308218000_58184',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'projectmanager',
											rules: [
												{
													type: 'string',
													message: '项目名称格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1560308218000_58184',
											isShow: 'true'
										},
										{
											name: '实施B级单位',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445154000_34987',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'implementationdepartment',
											rules: [
												{
													type: 'string',
													message: '项目名称格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1566445154000_34987',
											isShow: 'true'
										},
										{
											name: '当前里程碑',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1562567600000_13727',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'currentmilestone',
											rules: [],
											type: 'input',
											url: '',
											key: '1562567600000_13727',
											isShow: 'true'
										},
										{
											name: '当前完成进度',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445386000_52664',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'currentcompletedprogress',
											rules: [],
											type: 'input',
											url: '',
											key: '1566453659000_50195',
											isShow: 'true'
										},
										{
											name: '延期状态',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1562567690000_57506',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'extendedstate',
											rules: [
												{
													type: 'string',
													message: '延期状态格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1562567690000_57506',
											isShow: 'true'
										},
										{
											name: '当前进展/问题',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445386000_52664',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'progress',
											rules: [
												{
													type: 'string',
													message: ''
												}
											],
											type: 'input',
											url: '',
											key: '1566445386000_52664',
											isShow: 'true'
										},
										{
											name: '最近review日期',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1562567930000_4125',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false,
												listened: false
											},
											model: 'reviewdate',
											rules: [
												{
													type: 'string',
													message: '最近review日期格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1562567930000_4125',
											isShow: 'true'
										},
										{
											name: '项目运维期(年)',
											icon: 'icon-select',
											options: {
												remoteFunc: 'operationalperiod',
												filterable: false,
												clearable: false,
												defaultValue: ' ',
												remoteOptions: [
													{
														value: '1'
													},
													{
														value: '2'
													},
													{
														value: '3'
													},
													{
														value: '4'
													},
													{
														value: '5'
													},
													{
														value: ' 无'
													}
												],
												multiple: false,
												remote: true,
												required: false,
												showLabel: false,
												props: {
													label: 'label',
													value: 'value'
												},
												width: '50%',
												options: [],
												disabled: false,
												placeholder: ''
											},
											model: 'operationalperiod',
											rules: [],
											type: 'select',
											config: {
												labelPosition: ''
											},
											url: '',
											key: '1566445425000_75465',
											isShow: 'true'
										}
									],
									span: 12
								},
								{
									list: [
										{
											name: '项目编号',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1560307809000_98970',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'projectnumber',
											rules: [
												{
													type: 'string',
													message: '项目名称格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1560307809000_98970',
											isShow: 'true'
										},
										{
											name: '实施C级单位',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445159000_64777',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'implementationsecondary',
											rules: [
												{
													type: 'string',
													message: '项目名称格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1566445159000_64777',
											isShow: 'true'
										},
										{
											name: '审核状态',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1562567851000_70343',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'reviewstatus',
											rules: [
												{
													type: 'string',
													message: '审核状态格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1562567851000_70343',
											isShow: 'true'
										},
										{
											name: '项目预计开始时间',
											icon: 'icon-date',
											options: {
												remoteFunc: 'func_1566445373000_43253',
												clearable: true,
												defaultValue: '',
												editable: true,
												format: 'yyyy-MM-dd',
												type: 'date',
												required: false,
												readonly: false,
												startPlaceholder: '',
												width: '50%',
												disabled: false,
												placeholder: '',
												endPlaceholder: '',
												timestamp: false
											},
											model: 'projectstartdate',
											rules: [],
											type: 'date',
											key: '1566445373000_43253',
											isShow: 'true'
										},
										{
											name: '项目预计结束时间',
											icon: 'icon-date',
											options: {
												remoteFunc: 'func_1560308823000_14136',
												clearable: true,
												defaultValue: '',
												editable: true,
												format: 'yyyy-MM-dd',
												type: 'date',
												required: false,
												readonly: false,
												startPlaceholder: '',
												width: '50%',
												disabled: false,
												placeholder: '',
												endPlaceholder: '',
												timestamp: false,
												listened: false
											},
											model: 'projectenddate',
											rules: [],
											type: 'date',
											key: '1560308823000_14136',
											isShow: 'true'
										},
										{
											name: '项目级别',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445426000_21526',
												defaultValue: '',
												dataType: 'string',
												width: '50%',
												pattern: '',
												disabled: true,
												placeholder: '',
												required: false
											},
											model: 'projectlevel',
											rules: [
												{
													type: 'string',
													message: '项目级别格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1566445426000_21526',
											isShow: 'true'
										},
										{
											name: '项目类型',
											icon: 'icon-select',
											options: {
												remoteFunc: 'func_1566445427000_93514',
												filterable: false,
												clearable: false,
												defaultValue: '',
												remoteOptions: [],
												multiple: false,
												remote: true,
												required: false,
												showLabel: false,
												props: {
													label: 'label',
													value: 'value'
												},
												width: '50%',
												options: [
													{
														value: '1'
													},
													{
														value: '2'
													},
													{
														value: '3'
													},
													{
														value: '4'
													},
													{
														value: '5'
													},
													{
														value: ' 无'
													}
												],
												disabled: true,
												placeholder: ''
											},
											model: 'projecttype',
											rules: [],
											type: 'select',
											config: {
												labelPosition: ''
											},
											url: '',
											key: '1566445427000_93514',
											isShow: 'true'
										}
									],
									span: 12
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1560307608000_20067',
								gutter: 0,
								justify: 'end',
								align: 'top',
								listened: false
							},
							model: 'grid_1560307608000_20067',
							rules: [],
							type: 'grid',
							key: '1560307608000_20067'
						},
						{
							columns: [
								{
									list: [
										{
											name: '配置库地址',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566445333000_46834',
												defaultValue: '',
												dataType: 'string',
												width: '75%',
												pattern: '',
												disabled: false,
												placeholder: '',
												required: false
											},
											model: 'repositoryaddress',
											rules: [
												{
													type: 'string',
													message: '配置库地址格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1566445333000_46834',
											isShow: 'true'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1562567055000_79929',
								gutter: 0,
								justify: 'start',
								align: 'top'
							},
							model: 'grid_1562567055000_79929',
							rules: [],
							type: 'grid',
							key: '1562567055000_7992933'
						},
						{
							columns: [
								{
									list: [
										{
											name: '项目关键字',
											icon: 'icon-jilianxuanze',
											options: {
												remoteFunc: 'func_1560393096000_73302',
												defaultValue: [],
												width: '',
												pattern: '',
												placeholder: '',
												required: false
											},
											model: 'keyword',
											rules: [],
											type: 'tag',
											url: '',
											key: '1560393096000_73302',
											isShow: 'true'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1560308991000_45798',
								gutter: 0,
								justify: 'start',
								align: 'top'
							},
							model: 'grid_1560308991000_45798',
							rules: [],
							type: 'grid',
							key: '1560308991000_45798'
						},
						{
							columns: [
								{
									list: [
										{
											name: '自定义文字',
											icon: 'icon-row',
											options: {
												remoteFunc: 'func_1566453524000_80213',
												defaultValue: '',
												width: '100%',
												pattern: '',
												disabled: false,
												placeholder: '项目简介',
												required: false
											},
											model: 'row2_1566453524000_80213',
											rules: [],
											type: 'row2',
											key: '1566453524000_80213',
											isShow: 'false'
										},
										{
											name: '分割线',
											icon: 'icon-divider',
											options: {
												remoteFunc: 'func_1562568470000_76745',
												defaultValue: '',
												width: '10%',
												pattern: '',
												disabled: false,
												placeholder: '',
												required: false
											},
											model: 'divider_1562568470000_76745',
											rules: [],
											type: 'divider',
											key: '1566453553000_82455',
											isShow: 'false'
										},
										{
											name: '建设内容',
											icon: 'icon-diy-com-textarea',
											options: {
												remoteFunc: 'func_1562568539000_15100',
												defaultValue: '',
												width: '75%',
												pattern: '',
												placeholder: '',
												url: '',
												required: false,
												listened: false
											},
											model: 'constructioncontent',
											rules: [],
											type: 'textarea',
											url: '',
											key: '1562568539000_15100',
											isShow: 'true'
										},
										{
											name: '拟使用的关键技术',
											icon: 'icon-jilianxuanze',
											options: {
												remoteFunc: 'func_1564109281000_75319',
												clearable: false,
												defaultValue: [],
												width: '85%',
												pattern: '',
												disabled: false,
												placeholder: '',
												required: false
											},
											model: 'keytechnology',
											rules: [],
											type: 'tag',
											url: '',
											key: '1564109281000_75319',
											isShow: 'true'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1562568439000_23304',
								gutter: 0,
								justify: 'start',
								align: 'top'
							},
							model: 'grid_1562568439000_23304',
							rules: [],
							type: 'grid',
							key: '1562568439000_23304'
						}
					],
					config: {
						size: 'small',
						labelPosition: 'left',
						labelWidth: 170
					}
				};
				var nonData = {
					list: [
						{
							columns: [
								{
									list: [
										{
											name: '自定义文字',
											icon: 'icon-row',
											options: {
												remoteFunc: 'func_1566352164000_58397',
												defaultValue: '',
												width: '100%',
												pattern: '',
												disabled: false,
												listened: false,
												placeholder: '项目信息',
												required: false
											},
											model: 'row2_1566352164000_58397',
											rules: [],
											type: 'row2',
											key: '1574908275000_75677',
											isShow: 'false'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1566352146000_47091',
								gutter: 0,
								justify: 'start',
								listened: false,
								align: 'top'
							},
							model: 'grid_1566352146000_47091',
							rules: [],
							type: 'grid',
							key: '1566352146000_47091'
						},
						{
							columns: [
								{
									list: [
										{
											name: '项目名称',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1564644929000_47281',
												defaultValue: '',
												dataType: 'string',
												width: '60%',
												pattern: '',
												disabled: true,
												listened: false,
												placeholder: '',
												required: true
											},
											model: 'projectname',
											rules: [
												{
													type: 'string',
													message: '项目名称格式不正确'
												},
												{
													required: true,
													message: '项目名称必须填写'
												}
											],
											type: 'input',
											url: '',
											key: '1564644929000_47281',
											isShow: 'true'
										},
										{
											name: '项目经理',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1566352387000_42173',
												defaultValue: '',
												dataType: 'string',
												width: '60%',
												pattern: '',
												disabled: true,
												listened: false,
												placeholder: '',
												required: false
											},
											model: 'projectmanagername',
											rules: [
												{
													type: 'string',
													message: '项目经理格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1566352387000_42173',
											isShow: 'true'
										},
										{
											name: '项目预计开始时间',
											icon: 'icon-date',
											options: {
												remoteFunc: 'func_1564647825000_12653',
												clearable: true,
												defaultValue: '',
												editable: true,
												format: 'yyyy-MM-dd',
												type: 'date',
												required: true,
												readonly: false,
												startPlaceholder: '',
												width: '60%',
												disabled: false,
												listened: false,
												placeholder: '',
												endPlaceholder: '',
												timestamp: false
											},
											model: 'expectprojectstartdate',
											rules: [
												{
													required: true,
													message: '项目预计开始时间必须填写'
												}
											],
											type: 'date',
											key: '1564647825000_12653',
											isShow: 'true'
										}
									],
									span: 8
								},
								{
									list: [
										{
											name: '项目编号',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1564644952000_46749',
												defaultValue: '',
												dataType: 'string',
												width: '60%',
												pattern: '',
												disabled: true,
												listened: false,
												placeholder: '',
												required: false
											},
											model: 'projectnumber',
											rules: [
												{
													type: 'string',
													message: '项目经理格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1564644952000_46749',
											isShow: 'true'
										},
										{
											name: '实施B级单位',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1567500253000_41504',
												defaultValue: '',
												dataType: 'string',
												width: '60%',
												pattern: '',
												disabled: true,
												listened: false,
												placeholder: '',
												required: false
											},
											model: 'classunitbname',
											rules: [
												{
													type: 'string',
													message: '实施B级单位格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1567500253000_41504',
											isShow: 'true'
										},
										{
											name: '项目预计结束时间',
											icon: 'icon-date',
											options: {
												remoteFunc: 'func_1573129520000_51723',
												clearable: true,
												defaultValue: '',
												editable: true,
												format: 'yyyy-MM-dd',
												type: 'date',
												required: true,
												readonly: false,
												startPlaceholder: '',
												width: '60%',
												disabled: false,
												listened: false,
												placeholder: '',
												endPlaceholder: '',
												timestamp: false
											},
											model: 'expectprojectenddate',
											rules: [
												{
													required: true,
													message: '项目预计结束时间必须填写'
												}
											],
											type: 'date',
											key: '1573129520000_51723',
											isShow: 'true'
										}
									],
									span: 8
								},
								{
									list: [
										{
											name: '项目类型',
											icon: 'icon-select',
											options: {
												remoteFunc: 'func_1573129513000_25706',
												filterable: false,
												clearable: false,
												defaultValue: '新选项',
												remoteOptions: [],
												multiple: false,
												remote: true,
												required: true,
												showLabel: false,
												listen: [],
												props: {
													label: 'value',
													value: 'value',
													url:
														'`http://192.168.102.101:11104/sgpm/rest/api/server/pm/project/enum/group?param=ProjectType&group_id=${this.arg.account_id}`'
														// '`http://project.supermap.cn:11004/sgpm/rest/api/server/pm/project/enum/group?param=ProjectType&group_id=${this.arg.account_id}`'
														// '`http://1.202.165.59:10004/sgpm/rest/api/server/pm/project/enum/group?param=ProjectType&group_id=${this.arg.account_id}`'
												},
												width: '60%',
												options: [],
												disabled: true,
												listened: false,
												placeholder: ''
											},
											model: 'projecttype',
											rules: [
												{
													required: true,
													message: '项目类型必须填写'
												}
											],
											type: 'select',
											config: {
												labelPosition: ''
											},
											url: '',
											key: '1574905639000_23147',
											isShow: 'true'
										},
										{
											name: '实施C级单位',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1573129471000_17117',
												defaultValue: '',
												dataType: 'string',
												width: '60%',
												pattern: '',
												disabled: true,
												listened: false,
												placeholder: '',
												required: false
											},
											model: 'classunitcname',
											rules: [
												{
													type: 'string',
													message: '实施C级单位格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1573129471000_17117',
											isShow: 'true'
										},
										{
											type: 'input',
											name: '项目预算',
											icon: 'icon-input',
											isShow: 'true',
											url: '',
											options: {
												width: '60%',
												defaultValue: '',
												required: false,
												dataType: 'string',
												pattern: '',
												placeholder: '',
												disabled: false,
												remoteFunc: 'func_1590569279000_22920',
												listened: false
											},
											key: '1590569279000_22920',
											model: 'projectbudget',
											rules: [
												{
													type: 'string',
													message: '项目预算格式不正确'
												}
											]
										}
									],
									span: 8
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1564644868000_65758',
								gutter: 0,
								justify: 'start',
								listened: false,
								align: 'top'
							},
							model: 'grid_1564644868000_65758',
							rules: [],
							type: 'grid',
							key: '1564644868000_65758'
						},
						{
							columns: [
								{
									list: [
										{
											name: '配置库地址',
											icon: 'icon-input',
											options: {
												remoteFunc: 'func_1573111857000_33853',
												defaultValue: '',
												dataType: 'string',
												width: '87%',
												pattern: '',
												disabled: false,
												listened: false,
												placeholder: '',
												required: false
											},
											model: 'repositoryaddress',
											rules: [
												{
													type: 'string',
													message: '配置库地址格式不正确'
												}
											],
											type: 'input',
											url: '',
											key: '1573111857000_33853',
											isShow: 'true'
										},
										{
											name: '建设内容',
											icon: 'icon-diy-com-textarea',
											options: {
												remoteFunc: 'func_1573110328000_18819',
												defaultValue: '',
												width: '87%',
												pattern: '',
												listened: false,
												placeholder:
													'根据整个项目的作业工序和任务性质，XX主要包括五大任务：标准规范与政策体系建设，网络支持环境建设、数据体系建设、1库1平台软件体系建设、5个应用示范系统建设。不超过200字。',
												url: '',
												required: true
											},
											model: 'projectcontent',
											rules: [
												{
													required: true,
													message: '建设内容必须填写'
												}
											],
											type: 'textarea',
											url: '',
											key: '1573110328000_18819',
											isShow: 'true'
										}
									],
									span: 24
								}
							],
							name: '栅格布局',
							icon: 'icon-grid-',
							options: {
								remoteFunc: 'func_1573110202000_38715',
								gutter: 0,
								justify: 'start',
								listened: false,
								align: 'top'
							},
							model: 'grid_1573110202000_38715',
							rules: [],
							type: 'grid',
							key: '1573110202000_38715'
						}
					],
					config: {
						size: 'small',
						labelPosition: 'right',
						labelWidth: 130
					}
				};
				var jump_type = localStorage.getItem('jump_type');
				var projectCreat = data.list;
				if (_this.judgeproject == '非合同项目信息' || jump_type == '11') {
					_this.jsonData.list = nonData.list;
				} else {
					_this.jsonData.list = data.list;
				}

				localStorage.setItem('all_data', JSON.stringify(projectCreat));
				for (var i = 0; i < projectCreat.length; i++) {
					for (var j = 0; j < projectCreat[i].columns.length; j++) {
						for (var q = 0; q < projectCreat[i].columns[j].list.length; q++) {
							all_array.push(projectCreat[i].columns[j].list[q]);
							if (projectCreat[i].columns[j].list[q].type == 'select') {
								select_array.push(projectCreat[i].columns[j].list[q]);
							}
						}
					}
				}
				//修复重复请求枚举接口
				all_array.forEach(item => {
					if (item.model == 'operationalperiod') {
						console.log(item);
					}
				});

				for (let i in all_array) {
					let thats = i;
					for (let j in select_array) {
						if (all_array[thats].name == select_array[j].name) {
							var self = thats;
							index_array.push(self);
							var url_ = all_array[self].model;
						}
					}
				}
			})
			.catch(err => {
				console.log(err);
			});
		//获取角色信息
		this.getMemberRole(); //从接口获取角色信息
	},
	mounted() {
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
	},
	methods: {
		//获取人员的角色信息
		getMemberRole() {
			var userinfo = JSON.parse(localStorage.getItem('userinfo'));
			var projectNumber = localStorage.getItem('projectNumber');
			// var params = {projectNo: 'PM-6920', memberId: '-8349147320885949434'};
			var params = { projectNo: projectNumber, memberId: userinfo.memberid };
			var url = '/sgpm/rest/api/server/pm/project/member/role';
			serverGetHttpMethod(url, params)
				.then(res => {
					var jsonData = res.data.data;
					var memberRole = jsonData.memberRole;
					Bus.$emit('memberRole', memberRole);
					if (memberRole == 1 || memberRole == 3) {
						this.roleStatus = true; //项目经理才能提交
					} else {
						this.roleStatus = false;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},

		saveNonProMsg() {
			this.nonBtnLoading = true;
			this.$refs.generateForm.getData().then(data => {
				var expectprojectstartdate = new Date(data.expectprojectstartdate.replace(/\-/g, '/'));
				var expectprojectenddate = new Date(data.expectprojectenddate.replace(/\-/g, '/'));
				if (expectprojectstartdate >= expectprojectenddate) {
					alert('项目预计开始时间不能大于项目预计结束时间！');
					this.nonBtnLoading = false;
					return false;
				}
				var params = {
					child: 0,
					category: 3,
					username: this.userinfo.emp_name,
					account_name: this.userinfo.account_name,
					project: {
						id: data.id,
						projectName: data.projectname,
						projectNumber: data.projectnumber,
						companyId: this.userinfo.account_id,
						companyName: this.userinfo.account_name,
						classUnitBId: this.userinfo.subdept_id,
						classUnitBName: this.userinfo.subdept_name,
						classUnitCId: this.userinfo.dept_id,
						classUnitCName: this.userinfo.dept_name,
						projectManagerId: this.userinfo.memberid,
						projectManagerName: this.userinfo.emp_name,
						projectType: data.projecttype,
						projectCategory: '非合同类项目',
						repositoryAddress: data.repositoryaddress,
						projectContent: data.projectcontent,
						expectProjectStartDate: data.expectprojectstartdate,
						expectProjectEndDate: data.expectprojectenddate,
						projectBudget: data.projectbudget
					}
				};
				serverPutHttpMethod('/sgpm/rest/api/server/non/pm/gt/project/info', params)
					.then(res => {
						console.log(res);
						if (res.data.code == 200) {
							this.nonBtnLoading = false;
							alert('保存成功!');
						} else if (res.data.code == 201) {
							alert('保存失败!');
						}
					})
					.catch(err => {
						console.log(err);
						this.nonBtnLoading = false;
					});
			}).catch(e => {
          // 数据校验失败
		  console.log(e);
		  this.nonBtnLoading = false;
        });
		},
		//获取父项目信息
		getParentData(id) {
			//加载提升效果
			this.boxLoading = true;
			var data = {
				projectId: Number(id)
			};
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
			getProject('/sgpm/rest/api/server/pm/project/parent', data)
				.then(res => {
					this.boxLoading = false;
					var projectData = res.data.data;
					Bus.$emit('projectData', projectData);
					if (projectData) {
						localStorage.removeItem('projectData');
						localStorage.setItem('projectData', JSON.stringify(projectData));
						localStorage.setItem('keyWords', res.data.data.KEYWORD);
						localStorage.setItem('keytechnologys', res.data.data.KEYTECHNOLOGY);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		//获取非合同项目详细信息
		getNonContractData(id, num) {
			//加载提升效果
			this.boxLoading = true;
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
			getProject(`/sgpm/rest/api/server/non/pm/gt/project/${id}/${num}`)
				.then(res => {
					this.boxLoading = false;
					var projectData = res.data.data.project;
					Bus.$emit('projectData', projectData);
					if (projectData) {
						localStorage.removeItem('projectData');
						localStorage.setItem('projectData', JSON.stringify(projectData));
						localStorage.setItem('keyWords', res.data.data.KEYWORD);
						localStorage.setItem('keytechnologys', res.data.data.KEYTECHNOLOGY);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		//获取子项目信息
		getChildData(id) {
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
			var data = {
				projectId: Number(id)
			};
			getProject('/sgpm/rest/api/server/pm/project/child', data)
				.then(res => {
					var projectData = res.data.data;
					Bus.$emit('projectData', projectData);
					if (projectData) {
						localStorage.removeItem('projectData');
						localStorage.setItem('projectData', JSON.stringify(projectData));
						localStorage.setItem('keyWords', res.data.data.KEYWORD);
						localStorage.setItem('keytechnologys', res.data.data.KEYTECHNOLOGY);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		saveDate() {
			this.btnLoading = true;
			this.$refs.generateForm
				.getData()
				.then(data => {
					// 数据校验成功
					// data 为获取的表单数据
					var child_id = '';
					if (this.$route.params.parent_id) {
						child_id = 1;
					} else {
						child_id = 0;
					}
					var prostartdate = new Date(data.projectstartdate.replace(/\-/g, '/'));
					var proenddate = new Date(data.projectenddate.replace(/\-/g, '/'));
					if (prostartdate >= proenddate) {
						alert('项目预计开始时间不能大于项目预计结束时间！');
						return false;
					}

					var keyword = '';
					var keytechnology = '';
					if (this.keywordList) {
						keyword = this.keywordList.join(',');
					} else {
						keyword = data.keyword;
					}
					if (this.keytechnologyList) {
						keytechnology = this.keytechnologyList.join(',');
					} else {
						keytechnology = data.keytechnology;
					}
					var id = '';
					if (this.$route.params.id) {
						id = this.$route.params.id;
					} else {
						id = localStorage.getItem('projectId');
					}
					var data = {
						id: id,
						project: {
							custom_field_values: {
								23: data.operationalperiod, //项目运维期
								28: data.projectstartdate, //开始时间
								29: data.projectenddate, //结束时间
								32: keyword, //项目关键字
								33: data.repositoryaddress, //配置库地址
								35: data.constructioncontent, //建设内容
								36: keytechnology //使用的关键技术
							},
							project_no: data.projectnumber
						}
					};
					saveDate('/sgpm/rest/api/server/pm/project', data)
						.then(res => {
							console.log(res);
							if (res.data.code == 200) {
								alert('保存成功!');
								this.btnLoading = false;
							} else if (res.data.code == 201) {
								alert('保存失败!');
							}
						})
						.catch(err => {
							console.log(err);
							this.btnLoading = false;
						});
				})
				.catch(e => {
					// 数据校验失败
				});
		},
		//提交
		handleSubmit() {
			this.$refs.generateForm
				.getData()
				.then(data => {
					// 数据校验成功
					// data 为获取的表单数据
				})
				.catch(e => {
					// 数据校验失败
				});
		},
		//返回
		back() {
			this.$router.go(-1); //返回上一层
		}
	}
};
</script>
<style lang="scss">
@import '../../assets/css/common.css';

.el-form--label-top .el-form-item__label {
	float: left;
}

.projectInfo {
   .el-form-item .el-form-item {
	margin-top: 10px;
  }
}
.info {
	padding: 20px;
	width: 100%;
	width: 100%;
}

.back {
	text-align: left;
	margin-bottom: 0;
	cursor: pointer;
	.back-size {
		font-size: 17px;
	}
}
.p-btn-group {
	display: flex;
	justify-content: center;
	margin-top: 0px;
}
</style>

<style scoped>
.projectInfo {
	overflow-y: auto;
	/*border: solid 1px red;*/
}
</style>
