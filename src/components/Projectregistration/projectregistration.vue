<template>
	<el-col :span="24" class="projectview">
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
		<el-button type="primary" @click="saveDate">保存</el-button>
		<el-button type="primary" @click="handleSubmit">提交</el-button>
	</el-col>
</template>
<script>
	var select_array = [];
	var all_array = [];
	var index_array = [];
	var projectLevel = [];
	import GenerateForm from "@/components/CreateForm/GenerateForm";
	import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
	import "@/components/CreateForm/styles/FormCreate.css";
	import {
		getData
	} from "../../api/api.js";
	import {
		getMenuList
	} from "../../api/api.js";
	import {
		submitOa
	} from "../../api/api.js";
	import {
		getPersonInfor
	} from "../../api/api.js";
	import {serverPostHttpMethod} from "../../api/api.js"
	import {updateTime} from "../../api/api.js"
	import {saveDate} from "../../api/api.js"
	
	
	export default {
		name: "CreateFrom_setname",
		components: {
			GenerateForm,
			GenetateFormItem
		},
		data() {
			return {
				jsonData: {
					list: "",
					config: {
						labelPosition: "left",
						labelWidth: 100,
						size: "small"
					}
				},
				editData: {},
				remoteFuncs: {
					parentproject(resolve) {
						// 主项目名称 parentproject
						// 获取到远端数据后执行回调函数
						// resolve(data)
					},
					parentproject(resolve) {
						// 父项目名称 parentproject
						// 获取到远端数据后执行回调函数
						// resolve(data)
						var parentName = [{
								value: "项目管理系统"
							},
							{
								value: "计划执行系统"
							}
						];
						const parentproject = parentName;
						resolve(parentproject);
					},
					impldepartment(resolve) {
						// 一级部门 impldepartment
						// 获取到远端数据后执行回调函数
						// resolve(data)
					},
					subproject(resolve) {
						// 是否是子项目 subproject
						// 获取到远端数据后执行回调函数
						// resolve(data)
					},
					secondarydept(resolve) {
						// 二级部门 secondarydept
						// 获取到远端数据后执行回调函数
						// resolve(data)
					},

					projectmanager(resolve) {
						// 项目经理 projectmanager
						// 获取到远端数据后执行回调函数
						// resolve(data)
					},

					projectcategory(resolve) {
						// 项目类别 projectcategory
						// projectcategory
						// 获取到远端数据后执行回调函数
					},

					projecttype(resolve) {
						// 项目类型 projecttype
						// 获取到远端数据后执行回调函数
					},

					businesstype(resolve) {
						// 业务类型 businesstype
						// 获取到远端数据后执行回调函数
					},
					//
					projectlevel(resolve) {
						// 项目级别 projectlevel
						// 获取到远端数据后执行回调函数
					},
					supervisorylevel(resolve) {
						// 项目监管级别 supervisorylevel
						// 获取到远端数据后执行回调函数
					},
					businessnumber(resolve) {
						// 商机/合同编号 businessnumber
						// 获取到远端数据后执行回调函数
					}
				}
			};
		},
		mounted() {
			//获取项目立项页面
			var params = {
				memberId: "7503529197009650726",
				menuId: 8
			};
			var that = this;

			getMenuList("/template", params)
				.then(res => {
					var projectCreat = res.data.data.list;
					localStorage.setItem("all_data", JSON.stringify(projectCreat));
					this.jsonData.list = res.data.data.list;
					// console.log(projectCreat);
					for (var i = 0; i < projectCreat.length; i++) {
						for (var j = 0; j < projectCreat[i].columns.length; j++) {
							for (var q = 0; q < projectCreat[i].columns[j].list.length; q++) {
								all_array.push(projectCreat[i].columns[j].list[q]);
								if (projectCreat[i].columns[j].list[q].type == "select") {
									select_array.push(projectCreat[i].columns[j].list[q]);
								}
							}
						}
					}
					for (let i in all_array) {
						let thats = i;
						for (let j in select_array) {
							if (all_array[thats].name == select_array[j].name) {
								var self = thats;
								index_array.push(self);
								var url_ = all_array[self].model;
								// console.log(url_);
								getData("/" + url_)
									.then(res => {
										all_array[thats].options.remoteOptions = res.data.data;
										//that.jsonData.list = all_array;
									})
									.catch(err => {
										console.log(err);
									});
							}
						}
					}
					if (res.data.data.list.length > 0) {
						this.widgetFormSelect = res.data.data.list[0];
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		methods: {
			//提交
			handleSubmit() {
				this.$refs.generateForm
					.getData()
					.then(data => {
						// 数据校验成功
						// data 为获取的表单数据
						// console.log(data);
						var contractMain = JSON.parse(localStorage.getItem("contractList"));

						//oa发起流程
						let isSub;
						isSub = localStorage.getItem("isSubProject");
						if (isSub === 'true') {
							isSub = 1;
						} else {
							isSub = 0;
						}
						let pType = localStorage.getItem("pType");
						var data = {
							projectName: data.projectname, //项目名称
							contractNumber: data.businessnumber, //合同编号
							projectNumber: contractMain.contractNumber, //项目编号
							firstDepartment: contractMain.contractLeaderNumber, //"-2936006500408801087",  //一级部门
							secondDepartment: contractMain.contractLeaderFirstDeptNumber, //"8989240395189601046",  //二级部门
							projectManager: contractMain.projectManager, //"-7670473345159183128",  //项目经理
							contractLeaderFirstDept: contractMain.contractLeaderFirstDept, //所属客户中心
							contractLeader: contractMain.contractLeaderNumber, //所属销售-7670473345159183128
							contractMoney: contractMain.contractAmount, //合同金额1865825
							contractSigningDate: contractMain.contractSigningDate, //合同签订时间
							projectCategory: data.projectcategory, //项目类别
							supervisoryLevel: data.supervisorylevel, //"L1",  //项目监管级别
							projectLevel: data.projectlevel, //项目级别
							projectOperationalPeriod: data.operationalperiod, //项目运维期
							industry: contractMain.industry, //行业
							contractAgreedProjectStartDate: contractMain.contractAgreedProjectStartDate, //合同预计开始时间
							projectAgreedStartDate: data.prostartdate, //项目预计开始时间
							contractAgreedProjectFinishDate: contractMain.contractAgreedProjectFinishDate, //合同预计结束时间
							projectAgreedEndDate: data.proenddate, //项目预计结束时间
							projectType: data.projecttype, //项目类型
							businessType: data.businesstype, //业务类型
							projectKeyword: data.keyword, //关键字
							configRepositoryAddress: data.repositoryaddress, //配置库地址
							province: contractMain.region, //区域
							constructionGoals: data.constructiongoals, //建设目标
							constructionContent: data.constructioncontent, //建设内容
							keyTechnology: data.keytechnology, //使用的关键技术
							contractDeliverable: data.contractagreeddelivery, //合同约定交付物
							projectResults: data.projectresult, //预期项目成果

							registrationType: pType, //registrationType,  //项目登记类型
							isSubProject: isSub, //是否子项目
							username: "lishuaiqiang",
							parentProjectName: data.parentproject.value //父项目名称
						};
						submitOa("/sgpm/rest/api/integration/oa/flow", data)
							.then(res => {
								// console.log(res);
								alert("提交成功!");
								// localStorage.removeItem("contractList");
								// localStorage.removeItem("contractNumber");
							})
							.catch(err => {
								console.log(err);
							});
					})
					.catch(e => {
						// 数据校验失败
						console.log(e);
					});
			},
			//保存
			saveDate() {
				this.$refs.generateForm
					.getData()
					.then(data => {
						console.log(data)
						var contractMain = JSON.parse(localStorage.getItem("contractList"));
						var personInfor = JSON.parse(localStorage.getItem("personInfor"));
						let isSub;
						isSub = localStorage.getItem("isSubProject");
						var pType = localStorage.getItem("pType");
						pType = parseInt(pType);
						if (isSub === 'true') {
							isSub = 1;
						} else {
							isSub = 0;
						}
						var parent_id = '';
						if(data.parentproject == undefined){
							parent_id = "";
						}else{
							parent_id = data.parentproject.parent_id;
						}
						var data = {
							project:{
								name:data.projectname, 
								custom_field_values:{
									13 : data.businessnumber, 
									18 : contractMain.contractAmount, 
									16 : contractMain.contractLeaderFirstDept, 
									19 : contractMain.contractSigningDate,
									20 : data.projectcategory,
									21 : data.supervisorylevel,
									22 : data.projectlevel,
									23 : data.operationalperiod,
									24 : contractMain.industry,
									25 : contractMain.region,
									26 : contractMain.contractAgreedProjectStartDate,
									27 : contractMain.contractAgreedProjectFinishDate,
									28 : data.prostartdate,
									29 : data.proenddate,
									30 : data.projecttype,
									31 : data.businesstype,
									32 : data.keyword,
									33 : data.repositoryaddress,
									34 : data.constructiongoals,
									35 : data.constructioncontent,
									36 : data.keytechnology,
									37 : data.projectresult
								}, 
								parent_id: parent_id,
								description: "", 
								// identifier : data.projectname, 
								is_public : "1",
								user_id : "7503529197009650726",
								user_name : "李闻昊",
								project_no : "",
								sale_name : contractMain.contractLeader,
								sale_id : contractMain.contractLeaderNumber,
								company_name : personInfor.account_name,
								company_id : personInfor.account_id,
								level_one_name : personInfor.subdept_name,
								level_one_id : personInfor.subdept_id,
								level_two_name : personInfor.dept_name,
								level_two_id : personInfor.dept_id
							},
								child : isSub,
								category : pType,
								account_name:"北京超图软件股份有限公司"
						}
							saveDate("/sgpm/rest/api/server/pm/project", data)
								.then(res => {
									console.log(res);
									if(res.data.code == 200){
										alert('保存成功!')
									}else if(res.data.code == 201){
										alert('该项目已立项')
									}
								})
								.catch(err => {
									console.log(err);
								});
								
					})
					.catch(e => {
						// 数据校验失败
						console.log(e);
					});
			}
		}
	};
</script>
<style>
	@import '../../assets/css/common.css'
</style>
