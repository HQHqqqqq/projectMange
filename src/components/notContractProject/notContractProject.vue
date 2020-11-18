<template>
	<el-col :span="24" class="projectview notContract">
		<!-- <h1></h1> -->
		<p class="back"><i class="el-icon-back back-size" @click="back"></i></p>
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm" :globalParams="globalParams"></generate-form>
		<div class="btns">
			<el-button type="primary" @click="saveDate" size="mini" v-show="isShow" :disabled="isSave">保存</el-button>
			<el-button type="primary" @click="handleSubmit" size="mini" v-show="isShow" :disabled="disabled">提交</el-button>
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
import config from '../../config';
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
import { serverGetHttpMethod } from '../../api/api.js';

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
			projectData: [],
			projectId: this.$route.query.id,
			editData: {},
			remoteFuncs: {},
			globalParams: {},
			projectInfo: [],
			deptInfo: [],
			disabled: false,
			projectNumber: this.$route.query.projectNum,
			keywordList:[],
			projectCodeList: []
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

	created() {
		if (this.$route.fullPath == '/notContractProject?judgelogo=a') {
			localStorage.removeItem('keyWords');
			localStorage.removeItem('keytechnologys');
			localStorage.removeItem('projectCode');
		}
		this.globalParams.memberId = this.userinfo.memberid;
		this.globalParams.account_id = this.userinfo.account_id;
		//超图信息【5326994013938795629】、超图软件【-1360422574114386809】、
		// 南京国图【-1814768306395265967】、河南超图【7034660345998100768】、南康【8416498716893399290】
		// 地图慧【-7975978055853456035】 共用一套流程
		if(this.$route.query.judgelogo == "a"){
			localStorage.removeItem('teamData');
			localStorage.removeItem('teamworkTable');
		}
		if (
			this.projectNumber &&
			(this.userinfo.account_id == '-1814768306395265967' || //南京国图
			this.userinfo.account_id == '5326994013938795629' || //超图信息
			this.userinfo.account_id == '-1360422574114386809' || //超图软件
			this.userinfo.account_id == '8416498716893399290' || //南康
			this.userinfo.account_id == '7034660345998100768' || //河南超图
			this.userinfo.account_id == '-7975978055853456035') ||  //地图慧
			this.userinfo.account_id == '7638091599462351621'
		) {
			this.initNonContractData();
		}
	},
	mounted() {
		var id = 5;
		var account_id = this.userinfo.account_id;
		var url = '/template/' + id + '/' + account_id;
		getTemplate(url)
			.then(res => {
				this.jsonData = res.data.data;
			})
			.catch(err => {
				console.log(err);
			});
		Bus.$on('keyword', item => {
			if (item) {
				this.keywordList = item;
			}
		});
		Bus.$on('projectCode', item => {
			if (item) {
				this.projectCodeList = item;
			}
		});
	},
	methods: {
		initNonContractData(id, projectNumber) {
			//通过项目id获取项目基本信息
			var url = '/sgpm/rest/api/server/non/pm/gt/project/' + this.projectId + '/' + this.projectNumber;
			serverGetHttpMethod(url)
				.then(res => {
					if(res.data.data.project.keyword==null){
						if(this.userinfo.account_id == "8416498716893399290"){
							localStorage.setItem('projectCode', "")
						}else{
							localStorage.setItem('keyWords', "")
						}
					}else{
						if(this.userinfo.account_id == "8416498716893399290"){
							localStorage.setItem('projectCode', res.data.data.project.keyword);
						}else{
							localStorage.setItem('keyWords', res.data.data.project.keyword);
						}
					}
					// )
					localStorage.removeItem('globalParams');
					localStorage.removeItem('teamData');
					// if(res.data.data){
					res.data.data.project.projectBudget = parseFloat(res.data.data.project.projectBudget);
					this.$set(this.globalParams, 'data', res.data.data.project);
					localStorage.setItem('globalParams', JSON.stringify(res.data.data.project));
					localStorage.setItem('teamData', JSON.stringify(res.data.data.teamwork));
					// }
				})
				.catch(err => {
					console.log(err);
				});
		},
		getTeamWork() {
			var teamList = [
				{
					teamworkUserName: '',
					teamworkUserId: '',
					teamworkTwoUnitName: '',
					teamworkTwoUnitId: '',
					teamworkThreeUnitName: '',
					teamworkThreeUnitId: '',
					jobContent: '',
					projectNumber: ''
				},
				{
					teamworkUserName: '',
					teamworkUserId: '',
					teamworkTwoUnitName: '',
					teamworkTwoUnitId: '',
					teamworkThreeUnitName: '',
					teamworkThreeUnitId: '',
					jobContent: '',
					projectNumber: ''
				},
				{
					teamworkUserName: '',
					teamworkUserId: '',
					teamworkTwoUnitName: '',
					teamworkTwoUnitId: '',
					teamworkThreeUnitName: '',
					teamworkThreeUnitId: '',
					jobContent: '',
					projectNumber: ''
				},
				{
					teamworkUserName: '',
					teamworkUserId: '',
					teamworkTwoUnitName: '',
					teamworkTwoUnitId: '',
					teamworkThreeUnitName: '',
					teamworkThreeUnitId: '',
					jobContent: '',
					projectNumber: ''
				},
				{
					teamworkUserName: '',
					teamworkUserId: '',
					teamworkTwoUnitName: '',
					teamworkTwoUnitId: '',
					teamworkThreeUnitName: '',
					teamworkThreeUnitId: '',
					jobContent: '',
					projectNumber: ''
				}
			];
			return teamList;
		},
		saveOrUpdateParams(data, isUpdate) {
			var teamwork = JSON.parse(localStorage.getItem('teamworkTable'));
			var keyword = ''
			if (!teamwork) {
				teamwork = this.getTeamWork();
			}
			var param = null;
			var dateArr = null;
			if(this.userinfo.account_id == "8416498716893399290"){
				if (this.projectCodeList!="") {
					keyword = this.projectCodeList.join(',');
				}else{
					keyword=null
				}
				if (keyword == '') {
					this.warnMessage2();
					this.isSave = false;
					this.disabled = false;
					return;
				}
			}else{
				if (this.keywordList!="") {
					keyword = this.keywordList.join(',');
				}else{
					keyword=null
				}
				if (keyword == '') {
					this.warnMessage();
					this.isSave = false;
					this.disabled = false;
					return;
				}
			}
			if (isUpdate == 'update') {
				dateArr = {
					projectNumber: this.projectData.projectNumber ? this.projectData.projectNumber : this.projectNumber
				};
				teamwork = teamwork.map(item => {
					return Object.assign(item, dateArr);
				});
			
				param = {
					teamwork: teamwork,
					child: 0,
					category: 3,
					account_name: this.userinfo.account_name,
					project: {
						id: this.projectData.id ? this.projectData.id : this.projectId,
						companyId: this.userinfo.account_id,
						companyName: this.userinfo.account_name,
						projectName: data.projectname,
						projectNumber: this.projectData.projectNumber ? this.projectData.projectNumber : this.projectNumber,
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
						projectBudget: data.projectbudget,
						keyword:keyword
					}
				};
			} else {
				dateArr = {
					projectNumber: ''
				};
				teamwork = teamwork.map(item => {
					return Object.assign(item, dateArr);
				});
				param = {
					teamwork: teamwork,
					child: 0,
					category: 3,
					account_name: this.userinfo.account_name,
					project: {
						companyId: this.userinfo.account_id,
						companyName: this.userinfo.account_name,
						projectName: data.projectname,
						projectNumber: data.projectnumber,
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
						projectBudget: data.projectbudget,
						keyword:keyword
					}
				};
			}
			return param;
		},
		//保存
		saveDate() {
			this.isSave = true;
			this.disabled = true;
			this.$refs.generateForm
				.getData()
				.then(data => {
					var expectprojectstartdate = new Date(data.expectprojectstartdate.replace(/\-/g, '/'));
					var expectprojectenddate = new Date(data.expectprojectenddate.replace(/\-/g, '/'));
					if (expectprojectstartdate >= expectprojectenddate) {
						alert('项目预计开始时间不能大于项目预计结束时间！');
						this.isSave = false;
						this.disabled = false;
						return false;
					}

					//重点项目时验证 里程碑信息 必填
					//判断数据是否 全部填写
					var MilestoneParams = JSON.parse(localStorage.getItem('MilestoneParams'));
					if (data.projecttype == '重点项目') {
						var flag = this.checkMilestoneParams(MilestoneParams);
						if (!flag) {
							this.$message.warning('请选里程碑模板并填写全部数据！');
							this.isSave = false;
							this.disabled = false;
							return false;
						}
					}
					// 不是重点项目 但选了里程碑模板 也添加验证
					// if (data.projecttype !== '重点项目' && MilestoneParams) {
					// 	var flag = this.checkMilestoneParams(MilestoneParams);
					// 	if (!flag) {
					// 		this.$message.warning('请填写全部里程碑数据');
					// 		this.isSave = false;
					// 		this.disabled = false;
					// 		return false;
					// 	}
					// }

					if (
						this.userinfo.account_id == '-1814768306395265967' || //南京国图
						this.userinfo.account_id == '5326994013938795629' || //超图信息
						this.userinfo.account_id == '-1360422574114386809' || //超图软件
						this.userinfo.account_id == '8416498716893399290' || //南康
						this.userinfo.account_id == '7034660345998100768' || //河南超图
						this.userinfo.account_id == '-7975978055853456035' || //地图慧
						this.userinfo.account_id == '7638091599462351621' //安图
					) {
						var teamwork = JSON.parse(localStorage.getItem('teamworkTable'));
						if (!teamwork) {
							teamwork = this.getTeamWork();
						}
						console.log(this.projectId);
						console.log(this.projectData.id);
						var params = null;
						if ((this.projectId != undefined && this.projectId != null) || this.projectData.id) {
							//编辑
							params = this.saveOrUpdateParams(data, 'update');
						} else {
							//填写
							params = this.saveOrUpdateParams(data);
						}
						var url = '/sgpm/rest/api/server/non/pm/gt/project';
						serverPostHttpMethod(url, params)
							.then(res => {
								console.log(res);
								if (res.data.code == 200) {
									alert('保存成功!');
									this.isSave = false;
									this.disabled = false;
									var jsonList = this.jsonData.list;
									for (var i = 0; i < jsonList.length; i++) {
										for (var j = 0; j < jsonList[i].columns.length; j++) {
											for (var q = 0; q < jsonList[i].columns[j].list.length; q++) {
												if (jsonList[i].columns[j].list[q].model == 'projectnumber') {
													jsonList[i].columns[j].list[q].options.placeholder = res.data.data.return_project.projectNumber;
												}
											}
										}
									}
									this.projectData = res.data.data.return_project;

									//保存里程碑信息
									console.log('=========项目里程碑数据=========');
									console.log(MilestoneParams);
									if (MilestoneParams && MilestoneParams.length > 0) {
										this.handleSaveProjectMilestone(res.data.data.return_project.projectNumber, MilestoneParams);
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
					}
				})
				.catch(e => {
					// 数据校验失败
					console.log(e);
					this.isSave = false;
					this.disabled = false;
				});
		},
		//提交
		handleSubmit() {
			this.isSave = true;
			this.disabled = true;
			this.$refs.generateForm
				.getData()
				.then(data => {
					var expectprojectstartdate = new Date(data.expectprojectstartdate.replace(/\-/g, '/'));
					var expectprojectenddate = new Date(data.expectprojectenddate.replace(/\-/g, '/'));
					if (expectprojectstartdate >= expectprojectenddate) {
						alert('项目预计开始时间不能大于项目预计结束时间！');
						this.disabled = false;
						this.isSave = false;
						return false;
					}

					//重点项目时验证 里程碑信息 必填
					//判断数据是否 全部填写
					var MilestoneParams = JSON.parse(localStorage.getItem('MilestoneParams'));
					if (MilestoneParams) {
						var Milestone = ['stageName', 'milestoneName', 'progressPercentage', 'isCut', 'expectedBeginTime', 'expectedEndTime', 'workHours', 'description'];
					}
					if (data.projecttype == '重点项目') {
						var flag = this.checkMilestoneParams(MilestoneParams);
						if (!flag) {
							this.$message.warning('请选里程碑模板并填写全部数据！');
							this.disabled = false; //提交按钮
							this.isSave = false; // 保存按钮
							return false;
						}
					}
					// 不是重点项目 但选了里程碑模板 也添加验证
					if (data.projecttype !== '重点项目' && MilestoneParams) {
						var flag = this.checkMilestoneParams(MilestoneParams);
						if (!flag) {
							this.$message.warning('请填写全部里程碑数据');
							this.disabled = false; //提交按钮
							this.isSave = false; // 保存按钮
							return false;
						}
					}

					if (
						this.userinfo.account_id == '-1814768306395265967' || //南京国图
						this.userinfo.account_id == '5326994013938795629' || //超图信息
						this.userinfo.account_id == '-1360422574114386809' || //超图软件
						this.userinfo.account_id == '8416498716893399290' || //南康
						this.userinfo.account_id == '7034660345998100768' || //河南超图
						this.userinfo.account_id == '-7975978055853456035' ||//地图慧
						this.userinfo.account_id == '7638091599462351621'
					) {
						var keyword = ''
						var teamwork = JSON.parse(localStorage.getItem('teamworkTable'));
						if(this.userinfo.account_id == "8416498716893399290"){
							var keyWords = localStorage.getItem('projectCode')||null
						}else{
							var keyWords = localStorage.getItem('keyWords')||null
						}
						
						if (!teamwork) {
							teamwork = this.getTeamWork();
						}
						if(this.userinfo.account_id == "8416498716893399290"){
							if (this.projectCodeList!="") {
								keyword = this.projectCodeList.join(',');
							}else{
								keyword = keyWords;
							}
							if (keyword == '') {
								this.warnMessage2();
								this.isSave = false;
								this.disabled = false;
								return;
							}
						}else{
							if (this.keywordList!="") {
								keyword = this.keywordList.join(',');
							}else{
								keyword = keyWords
							}
							if (keyword == '') {
								this.warnMessage();
								this.isSave = false;
								this.disabled = false;
								return;
							}
						}
						if ((this.projectId != undefined && this.projectId != null) || this.projectData.id) {
							//编辑
							var dateArr = {
								projectNumber: this.projectNumber
							};
							teamwork = teamwork.map(item => {
								return Object.assign(item, dateArr);
							});
							var id = '';
							if (this.projectData.id) {
								id = this.projectData.id;
							} else {
								id = this.projectId;
							}
							var projectnumber = '';
							if (this.projectData.projectNumber) {
								projectnumber = this.projectData.projectNumber;
							} else {
								projectnumber = this.projectNumber;
							}
							var data = {
								teamwork: teamwork,
								milestone: this.getOAMilestone(MilestoneParams),
								child: 0,
								category: 3,
								username: this.userinfo.login_name,
								account_name: this.userinfo.account_name,
								project: {
									id: id,
									projectName: data.projectname,
									projectNumber: projectnumber,
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
									projectBudget: data.projectbudget,
									keyword:keyword
								}
							};
						} else {
							//填写
							var dateArr = {
								projectNumber: ''
							};
							teamwork = teamwork.map(item => {
								return Object.assign(item, dateArr);
							});
							var data = {
								teamwork: teamwork,
								milestone: this.getOAMilestone(MilestoneParams), //里程碑参数
								child: 0,
								category: 3,
								username: this.userinfo.login_name,
								account_name: this.userinfo.account_name,
								project: {
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
									projectBudget: data.projectbudget,
									keyword:keyword
								}
							};
						}
						// var url = 'http://192.168.30.36:11104/sgpm/rest/api/server/non/pm/gt/project/submit';
						var url = '/sgpm/rest/api/server/non/pm/gt/project/submit';
						// this.axios.post(url,data).then(res => {
						serverPostHttpMethod(url, data)
							.then(res => {
								console.log(res);
								if (res.data.code == 200) {
									alert('提交成功!');
									this.disabled = true;
									this.$router.push({
										path: 'audititem'
									});

									//保存里程碑信息
									console.log('=========项目里程碑数据=========');
									console.log(MilestoneParams);
									if (MilestoneParams && MilestoneParams.length > 0) {
										this.handleSaveProjectMilestone(res.data.data.return_project.projectNumber, MilestoneParams);
									}
								} else {
									alert('提交失败!');
									this.disabled = false;
									this.isSave = false;
								}
							})
							.catch(err => {
								console.log(err);
								alert('提交失败');
								this.disabled = false;
								this.isSave = false;
							});
					}
				})
				.catch(e => {
					// 数据校验失败
					console.log(e);
					this.disabled = false;
					this.isSave = false;
				});
		},

		//返回
		back() {
			this.$router.go(-1); //返回上一层
		},
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
				message: '工程代码不能为空',
				type: 'warning'
			});
		},
		//里程碑组件 重新封装到OA数据
		getOAMilestone(tableData) {
			var arr = [];
			if (tableData != null) {
				for (var i = 0; i < tableData.length; i++) {
					var item = tableData[i];
					//添加选中的数据
					if (item.deliverableStatus) {
						var hash = {};
						hash['stageName'] = item.stageName; //阶段名称 新增字段
						hash['milestoneName'] = item.milestoneName;
						hash['progressPercentage'] = item.progressPercentage;
						hash['isCut'] = item.isCut == 1 ? '是' : '否';
						hash['description'] = item.description;
						hash['estimatedStartDate'] = item.expectedBeginTime; //预计开始时间
						hash['estimatedFinishDate'] = item.expectedEndTime; //预计结束时间
						hash['estimatedWorkingHours'] = item.workHours; //预计工时
						// 交付物数据
						var deliverable = item.deliverable;
						var del_str = '';
						deliverable.forEach(del => {
							if (del.checkedStatus) {
								del_str += del.deliverableName + '、';
							}
						});
						hash['delStr'] = del_str.substr(0, del_str.length - 1);
						arr.push(hash);
					}
				}
			}
			console.log('======里程碑OA数据======');
			console.log(arr);
			return arr;
		},
		//保存里程碑信息方法
		handleSaveProjectMilestone(projectNumber, multipleSelection) {
			console.log('项目编号：' + projectNumber);
			var url = '/sgpm/rest/api/server/pm/project/milestones';
			var data = {};
			data['projectNumber'] = projectNumber; //项目编号
			var milestones = [];
			multipleSelection.forEach(item => {
				// 全选bug 修改 item.deliverableStatus true为选中的
				if (item.deliverableStatus) {
					var hash = {};
					hash['milestoneName'] = item.milestoneName;
					hash['isCut'] = item.isCut;
					hash['progressPercentage'] = item.progressPercentage;
					hash['sortIndex'] = 1.0;
					hash['description'] = item.description;
					hash['milestoneTemplateName'] = item.milestoneTemplateName; //里程碑模板名称
					hash['estimatedStartDate'] = item.expectedBeginTime; //预计开始时间
					hash['estimatedFinishDate'] = item.expectedEndTime; //预计结束时间
					hash['finishDate'] = item.actualEndTime; //实际完成时间
					hash['estimatedWorkingHours'] = item.workHours; //预计工时
					hash['delayDays'] = item.delayDays; //延期天数
					hash['status'] = 0;
					hash['stageName'] = item.stageName; //阶段名称 新增字段
					hash['id'] = item.projectMilestoneId; //里程碑id 更新使用
					//交付物
					var deliverable = [];
					item.deliverable.forEach(del => {
						//根据交付物中checkedStatus状态 保存交付物
						if (del.checkedStatus) {
							var ha = {};
							ha['deliverableName'] = del.deliverableName;
							ha['isCut'] = del.isCut;
							ha['auditDeliverable'] = del.auditDeliverable; //新增字段 是否审计
							// 区分更新操作还是添加 有deliverableTemplateId 时为更新操作  否则为添加操作
							if (del['deliverableTemplateId'] == undefined) {
								//添加操作
								ha['deliverableTemplateId'] = del.deliverableId; //交付物模板id 新增字段
							} else {
								//更新操作
								ha['id'] = del.deliverableId;
							}
							//国图新增字段
							ha['contractDeliverable'] = del.contractDeliverable; //是否合同交付物
							// ha["deliverableId"] = del.deliverableId;//交付物id 更新使用
							ha['description'] = del.description;
							// ha["deliverableTemplateId"] = del.deliverableId; //交付物模板id 新增字段
							ha['status'] = 1; //交付物状态 1未上传  2待审核   3审核通过  4驳回
							deliverable.push(ha);
						}
					});
					hash['deliverable'] = deliverable;
					milestones.push(hash);
				}
			});
			data['milestones'] = milestones; //里程碑信息
			console.log('保存参数--里程碑');
			console.log(data);
			serverPostHttpMethod(url, data)
				.then(res => {
					console.log(res.data);
					if (res.data.code == 200) {
						// alert('保存成功')
						Bus.$emit('ProjectMilestoneSave', {
							projectNumber: projectNumber,
							success: true
						});
					} else {
						alert('保存失败');
					}
				})
				.catch(err => {
					console.log(err);
				});
		},

		//里程碑数据 预计开始时间 预计结束时间 预计工时 判断是否全部必填
		checkMilestoneParams(multipleSelection) {
			if (multipleSelection) {
				var flag = true;
				multipleSelection.forEach(item => {
					//针对选择的数据判断
					if (item.deliverableStatus) {
						var d1 = item.expectedBeginTime;
						var d2 = item.expectedEndTime;
						var d3 = item.workHours;
						if (!d1 || !d2 || !d3) {
							flag = false;
						}
					}
				});
				return flag;
			} else {
				// alert('项目里程碑实施计划必须填写!')
				return false;
			}
		}
	}
};
</script>
<style lang="scss">
@import '../../assets/css/common.css';

.btns {
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
.notContract .el-form-item__error {
	left: 142px;
}
</style>
