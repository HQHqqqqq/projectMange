<template>
	<el-col :span="24" class="projectview">
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
						labelWidth: 170,
						size: "small"
					}
				},
				editData: {},
				projectId: this.$route.query.id,
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
				var params = {
					projectId: this.projectId
				};
				var url = "/sgpm/rest/api/server/pm/project";
				postProject(url, params)
					.then(res => {
						this.$set(this.globalParams, "data", res.data.data);
						if (res.data.data.BUSINESS) {
							res.data.data.customercenter = res.data.data.BUSINESS.CUSTOMERCENTER;
							res.data.data.customerdepartment =
								res.data.data.BUSINESS.CUSTOMERDEPARTMENT;
						}

						this.$set(
							this.globalParams,
							"data1",
							this.updateJsonData(res.data.data)
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
						// this.yanzheng(jyjxConclusion);
						if (this.yanzheng(jyjxConclusion) == false) {
							this.isSave = false;
							return;
						} else {
							this.jyjxSave(data.projectnumber);
							var data = {
								id: data.id,
								project: {
									custom_field_values: {
										23: data.operationalperiod,
										33: data.repositoryaddress
									},
									name: data.projectname,
									user_name: data.projectmanager,
									project_no: data.projectnumber,
									returnedRate: data.returnmoneypercentage,
									actualAcceptTime: data.actualaccepttime,
									projectCompeleteShedule: data.percentagecomplete,
									closeReason: data.closereason,
									archivingSituation: data.archivingsituation,
									outsourcePaymentRate: data.outsourcepaymentrate,
									sale_name: data.contractmarket,
									level_one_name: data.implementationdepartment,
									level_two_name: data.implementationsecondary,
									customercenter: data.customercenter,
									customerdepartment: data.customerdepartment,
									audit_status: 30
								},
								username: this.userinfo.login_name
							};
							var url = "/sgpm/rest/api/server/pm/project";
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
						// this.yanzheng(jyjxConclusion);
						if (this.yanzheng(jyjxConclusion) == false) {
							this.disabled = false;
							return;
						} else {
							this.jyjxSave(data.projectnumber);
							var data = {
								id: data.id,
								project: {
									custom_field_values: {
										23: data.operationalperiod,
										33: data.repositoryaddress
									},
									name: data.projectname,
									user_name: data.projectmanager,
									project_no: data.projectnumber,
									returnedRate: data.returnmoneypercentage,
									actualAcceptTime: data.actualaccepttime,
									projectCompeleteShedule: data.percentagecomplete,
									closeReason: data.closereason,
									archivingSituation: data.archivingsituation,
									outsourcePaymentRate: data.outsourcepaymentrate,
									sale_name: data.contractmarket,
									level_one_name: data.implementationdepartment,
									level_two_name: data.implementationsecondary,
									customercenter: data.customercenter,
									customerdepartment: data.customerdepartment
								},
								username: this.userinfo.login_name,
								jY: jyjxConclusion
							};
							var url = "/sgpm/rest/api/integration/oa/close";
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
</style>
