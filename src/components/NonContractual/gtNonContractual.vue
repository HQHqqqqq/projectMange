<template>
	<el-col :span="24" class="projectview gtNon">
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
		<div class="btns">
			<el-button type="primary" size="mini" @click="saveDate" v-show="isShow" :disabled="isSave">保存</el-button>
			<el-button type="primary" size="mini" @click="handleSubmit" v-show="isShow" :disabled="disabled">提交</el-button>
		</div>

	</el-col>
</template>
<script>
	var select_array = [];
	var all_array = [];
	import Bus from "../../bus";
	import GenerateForm from "@/components/CreateForm/GenerateForm";
	import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
	import "@/components/CreateForm/styles/FormCreate.css";
	import {
		getTemplate
	} from "../../api/api.js";
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
	import {
		mapState,
		mapActions
	} from "vuex";
	import {
		postProject
	} from "../../api/api.js";
	import {
		postProjectSubmit
	} from "../../api/api.js";
	import {
		jyjxTable
	} from "../../api/api.js";
	export default {
		name: "CreateFrom_setname",
		components: {
			GenerateForm,
			GenetateFormItem
		},
		data() {
			return {
				isSave: false,
				isShow: this.$route.query.isShow == true ? false : true, //默认显示
				jsonData: {
					list: "",
					config: {
						labelPosition: "right",
						labelWidth: 120,
						size: "small"
					}
				},
				editData: {},
				projectId: this.$route.query.id,
				projectNumber: this.$route.query.projectNum,
				globalParams: {},
				disabled: false,
				isSub: false,
				remoteFuncs: {}
			};
		},
		computed: {
			...mapState([
				"userinfo" //oa跳转过来的用户信息值
			])
		},
		created() {
			var id = 4;
			//公司id
			var account_id = this.userinfo.account_id;
			var url = "/template/" + id + "/" + account_id;
			getTemplate(url)
				.then(res => {
					this.jsonData.list = res.data.data.list;
				})
				.catch(err => {
					console.log(err);
				});
			localStorage.removeItem("jyjxConclusion");
			this.globalParams.memberId = this.userinfo.memberid;
			this.globalParams.projectId = this.projectId;
			this.initPostProject();
		},
		methods: {
			//获取表单数据
			initPostProject() {
				localStorage.removeItem("globalParams");
				var url =
					"/sgpm/rest/api/server/pm/gt/project/" +
					this.projectId +
					"/" +
					this.projectNumber;
				postProject(url)
					.then(res => {
						console.log(res);
						res.data.data.outsourcePaymentRate = parseFloat(
							res.data.data.outsourcePaymentRate
						);
						localStorage.setItem(
							"globalParams",
							JSON.stringify(this.updateJsonData(res.data.data))
						);
					})
					.catch(err => {
						console.log(err);
					});
			},
			//通过projectId获取的数据拆分
			updateJsonData(obj) {
				let result = {};
				for (let item in obj) {
					if (item == "CONTRACT") {
						for (let jtem in obj[item]) {
							result[jtem] = obj[item][jtem];
						}
					} else {
						result[item] = obj[item];
					}
				}
				return result;
			},
			//验证数据是否完整
			yanzheng(jyjxConclusion) {
				var index = "";
				var num = 0;
				for (var i = 0; i < jyjxConclusion.length; i++) {

					if (jyjxConclusion[num].jYCategory == "" && jyjxConclusion[num].jYJiaoXunCategory == "" && jyjxConclusion[num].jYDescription ==
						"" && jyjxConclusion[num].jYContributor == "") {
						this.$message.error('请填写经验教训总结!');
						this.isSave = false;
						return false;
					} else if (
						jyjxConclusion[i].jYCategory != "" && jyjxConclusion[i].jYJiaoXunCategory != "" && jyjxConclusion[i].jYDescription !=
						"" && jyjxConclusion[i].jYContributor != ""
					) {
						// console.log(i);
					} else {
						var check = false;
						index = i;
						var a = i;
						a != 0;
						for (var j in jyjxConclusion[index]) {
							// if (jyjxConclusion[index][j] == "") {
							if (jyjxConclusion[index].jYCategory != "" && jyjxConclusion[index].jYJiaoXunCategory != "" && jyjxConclusion[
									index].jYDescription != "" && jyjxConclusion[index].jYContributor != "") {
								check = true;
								return;
							} else if (jyjxConclusion[a].jYCategory == "" && jyjxConclusion[a].jYJiaoXunCategory == "" && jyjxConclusion[a].jYDescription ==
								"" && jyjxConclusion[a].jYContributor == "") {
								check = true;
								return;
							} else {
								console.log("-=-" + i + "ddd" + j); //未填的值
								check = false;
							}
						}
						console.log(index); // 这个值就是  需要完善的当前那一行索引
						var indexa = parseInt(index) + 1;
						this.$message.error('请将经验教训总结第' + indexa + '行的数据填写完整!');
						this.isSave = false;
						return false;
					}
				}
			},
			//保存表格数据
			jyjxSave(projectnumber) {
				var jyjxConclusion = JSON.parse(localStorage.getItem("jyjxConclusion"));
				// this.yanzheng(jyjxConclusion);
				if (this.yanzheng(jyjxConclusion) == false) {
					this.isSave = false;
					this.disabled = false;
					return;
				} else {
					jyjxConclusion = jyjxConclusion.map(item => {
						return Object.assign(item, {
							projectNumber: projectnumber
						});
					});
					var url = "/sgpm/rest/api/server/pm/project/experience";
					var data = jyjxConclusion;
					jyjxTable(url, data)
						.then(res => {
							console.log("保存成功");
						})
						.catch(err => {
							console.log(err);
						});
				}
			},
			saveDate() {
				this.isSave = true;
				this.$refs.generateForm
					.getData()
					.then(data => {
						var jyjxConclusion = JSON.parse(
							localStorage.getItem("jyjxConclusion")
						);
						if (this.yanzheng(jyjxConclusion) == false) {
							this.isSave = false;
							return;
						} else {
							if (this.userinfo.account_id == "-1814768306395265967" || this.userinfo.account_id == "7638091599462351621") {
								var data = {
									id: data.id,
									project: {
										custom_field_values: {
											23: data.operationalperiod,
											33: data.repositoryaddress
										},
										project_no: data.projectnumber,
										name: data.projectname,
										user_name: data.projectmanager,
										user_id: data.user_id,
										sale_name: data.contractmarket,
										sale_id: data.saleid,
										returnedRate: data.returnmoneypercentage,
										outsourcePaymentRate: data.outsourcepaymentrate,
										level_one_name: data.implementationdepartment,
										level_one_id: data.level_one_id,
										level_two_name: data.implementationsecondary,
										level_two_id: data.level_two_id,
										company_name: data.company_name,
										company_id: data.company_id,
										projectCompeleteShedule: data.percentagecomplete,
										actualAcceptTime: data.reviewtime,
										closeReason: data.closereason,
										archivingSituation: data.archivingsituation,
										customercenter: data.customercenter,
										customercenternumber: data.customercenternumber,
										customerdepartment: data.customerdepartment,
										customerdepartmentnumber: data.customerdepartmentnumber,
										audit_status: 30
									},
									username: this.userinfo.login_name,
									jY: jyjxConclusion
								};
							} else if (this.userinfo.account_id == "8416498716893399290") {
								var data = {
									id: data.id,
									project: {
										custom_field_values: {
											23: data.operationalperiod,
											33: data.repositoryaddress
										},
										project_no: data.projectnumber,
										name: data.projectname,
										user_name: data.projectmanager,
										user_id: data.user_id,
										sale_name: data.contractmarket,
										sale_id: data.saleid,
										returnedRate: data.returnmoneypercentage,
										outsourcePaymentRate: data.outsourcepaymentrate,
										level_one_name: data.implementationdepartment,
										level_one_id: data.level_one_id,
										// level_two_name: data.implementationsecondary,
										// level_two_id: data.level_two_id,
										company_name: data.company_name,
										company_id: data.company_id,
										projectCompeleteShedule: data.percentagecomplete,
										actualAcceptTime: data.reviewtime,
										closeReason: data.closereason,
										archivingSituation: data.archivingsituation,
										customercenter: data.customercenter,
										customercenternumber: data.customercenternumber,
										// customerdepartment: data.customerdepartment,
										// customerdepartmentnumber: data.customerdepartmentnumber,
										audit_status: 30
									},
									username: this.userinfo.login_name,
									jY: jyjxConclusion
								};
							}

							var url = "/sgpm/rest/api/server/pm/gt/project/closing/save";
							jyjxTable(url, data)
								.then(res => {
									if (res.data.code == 200) {
										alert("保存成功!");
										this.isSave = true;
									} else {
										alert("保存失败!");
										this.isSave = false;
									}
								})
								.catch(err => {
									console.log(err);
									alert("保存失败!");
									this.isSave = false;
								});
						}
					})
					.catch(e => {
						// 数据校验失败
						console.log(e);
						this.isSave = false;
					});
			},
			handleSubmit() {
				this.$refs.generateForm
					.getData()
					.then(data => {
						this.disabled = true;
						// 数据校验成功
						// data 为获取的表单数据
						console.log(data);
						var jyjxConclusion = JSON.parse(
							localStorage.getItem("jyjxConclusion")
						);
						if (this.yanzheng(jyjxConclusion) == false) {
							this.disabled = false;
							return;
						} else {
							if (this.userinfo.account_id == "-1814768306395265967" || this.userinfo.account_id == "7638091599462351621") {
								var data = {
									id: data.id,
									project: {
										custom_field_values: {
											23: data.operationalperiod,
											33: data.repositoryaddress
										},
										project_no: data.projectnumber,
										name: data.projectname,
										user_name: data.projectmanager,
										user_id: data.user_id,
										sale_name: data.contractmarket,
										sale_id: data.saleid,
										returnedRate: data.returnmoneypercentage,
										outsourcePaymentRate: data.outsourcepaymentrate,
										level_one_name: data.implementationdepartment,
										level_one_id: data.level_one_id,
										level_two_name: data.implementationsecondary,
										level_two_id: data.level_two_id,
										company_name: data.company_name,
										company_id: data.company_id,
										projectCompeleteShedule: data.percentagecomplete,
										actualAcceptTime: data.reviewtime,
										closeReason: data.closereason,
										archivingSituation: data.archivingsituation,
										customercenter: data.customercenter,
										customercenternumber: data.customercenternumber,
										customerdepartment: data.customerdepartment,
										customerdepartmentnumber: data.customerdepartmentnumber,
										audit_status: 30
									},
									username: this.userinfo.login_name,
									jY: jyjxConclusion
								};
							} else if (this.userinfo.account_id == "8416498716893399290") {
								var data = {
									id: data.id,
									project: {
										custom_field_values: {
											23: data.operationalperiod,
											33: data.repositoryaddress
										},
										project_no: data.projectnumber,
										name: data.projectname,
										user_name: data.projectmanager,
										user_id: data.user_id,
										sale_name: data.contractmarket,
										sale_id: data.saleid,
										returnedRate: data.returnmoneypercentage,
										outsourcePaymentRate: data.outsourcepaymentrate,
										level_one_name: data.implementationdepartment,
										level_one_id: data.level_one_id,
										// level_two_name: data.implementationsecondary,
										// level_two_id: data.level_two_id,
										company_name: data.company_name,
										company_id: data.company_id,
										projectCompeleteShedule: data.percentagecomplete,
										actualAcceptTime: data.reviewtime,
										closeReason: data.closereason,
										archivingSituation: data.archivingsituation,
										customercenter: data.customercenter,
										customercenternumber: data.customercenternumber,
										// customerdepartment: data.customerdepartment,
										// customerdepartmentnumber: data.customerdepartmentnumber,
										audit_status: 30
									},
									username: this.userinfo.login_name,
									jY: jyjxConclusion
								};
							}
							if (this.userinfo.account_id == "-1814768306395265967" || this.userinfo.account_id == "7638091599462351621") {
								var url = "/sgpm/rest/api/integration/oa/gt/workflow/finish";
							} else if (this.userinfo.account_id == "8416498716893399290") {
								var url = "/sgpm/rest/api/integration/oa/nk/workflow/finish";
							}
							postProjectSubmit(url, data)
								.then(res => {
									if (res.data.code == 200) {
										alert("提交成功!");
										this.disabled = true;
										this.$router.push({
											path: "audititem"
										});
									} else {
										this.disabled = false;
										alert("提交失败!");
									}
								})
								.catch(err => {
									console.log(err);
									this.disabled = false;
									alert("提交失败!");
								});
						}
					})
					.catch(e => {
						// 数据校验失败
						console.log(e);
						this.disabled = false;
					});
			}
		}
	};
</script>
<style scoped>
	.projectview {
		overflow-y: auto;
	}

	.btns {
		text-align: center;
	}
</style>
<style>
	@import "../../assets/css/common.css";
	.gtNon	.el-form-item__error{
			left: 130px!important;
		}
</style>
