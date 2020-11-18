<template>
	<el-col :span="24" class="projectview">
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
		<div class="btns">
			<!-- <el-button type="primary" size="mini" @click="saveDate" v-show="isShowSave" :disabled="isSave">保存</el-button> -->
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
				isShowSave: false,
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
			var id = 7;
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
			this.globalParams.memberId = this.userinfo.memberid;
			this.globalParams.projectId = this.projectId;
			this.initPostProject();
		},
		methods: {
			//获取表单数据
			initPostProject() {
				console.log(this.projectId);
				localStorage.removeItem("globalParams");
				var url = '/sgpm/rest/api/server/pm/ct/project/close/contract/' + this.projectId;
				// var url = "/sgpm/rest/api/server/pm/project?projectId=" + this.projectId;
				postProject(url)
					.then(res => {
						console.log(res);
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
			handleSubmit() {
				this.$refs.generateForm
					.getData()
					.then(data => {
						this.disabled = true;
						// 数据校验成功
						// data 为获取的表单数据
						console.log(data);
							var data = {
								projectId: data.projectid,
								projectNum: data.projectnum,
								projectName: data.projectname,
								userId: data.userid,
								userName: data.username,
								saleId: data.saleid,
								saleName: data.salename,
								outsourcingRate: data.outsourcingrate,
								returnMoneyPercentage: data.returnmoneypercentage,
								projectCloseFinishSituation: data.projectclosefinishsituation,
								classUnitBId: data.classunitbid,
								classUnitBName: data.classunitbname,
								classUnitCId: data.classunitcid,
								classUnitCName: data.classunitcname,
								saleClassUnitBId: data.saleclassunitbid,
								saleClassUnitBName: data.saleclassunitbname,
								saleClassUnitCId: data.saleclassunitcid,
								saleClassUnitCName: data.saleclassunitcname,
								username: this.userinfo.login_name,
								projectStatus: 2,
								companyId: this.userinfo.account_id,
								companyName: this.userinfo.account_name
							}
						var url = "/sgpm/rest/api/integration/oa/contract/close";
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
					})
					.catch(e => {
						// 数据校验失败
						console.log(e);
					});
			}
		}
	};
</script>
<style scoped lang="scss" scoped>
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
