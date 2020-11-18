<template>
	<el-col :span="24" class="projectview">
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm" :globalParams="globalParams"></generate-form>
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
	import {getTemplate} from "../../api/api.js";
	import {getData} from "../../api/api.js";
	import {getMenuList} from "../../api/api.js";
	import {submitOa} from "../../api/api.js";
	import {getPersonInfor} from "../../api/api.js";
	import {mapState,mapActions} from "vuex";
	import {postProject} from "../../api/api.js";
	import {postProjectSubmit} from "../../api/api.js";
	import {jyjxTable} from "../../api/api.js";
	export default {
		name: "CreateFrom_setname",
		components: {
			GenerateForm,
			GenetateFormItem
		},
		data() {
			return {
				isSave: false,
				isShow: this.$route.query.isShow == 1 ? false : true, //默认显示
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
				remoteFuncs: {},
				receivableChange: '',
				returnNote:'',
				payNote:'',
				exCloseReason:'',
				fileSituation:'',
				returnNoteFile:'',
				payNoteFile:'',
				ycclosereason:'',
				fileCase:'',
				payinstructions:'',
				returninstructions:'',
				payinstructionsFile:'',
				returninstructionsFile:'',
				returnNoteFileName:'',
				payNoteFileName:''
			};
		},
		computed: {
			...mapState([
				"userinfo" //oa跳转过来的用户信息值
			])
		},
		created() {
			this.globalParams.account_id = this.userinfo.account_id;
			localStorage.removeItem("jyjxConclusion");
			this.globalParams.memberId = this.userinfo.memberid;
			this.globalParams.projectId = this.projectId;
			this.initPostProject();

		},
		mounted(){
			// Bus.$on("returnNote", item => {
			//   if (item) {
			//     this.returnNote = item;
			// 	console.log(this.returnNote)
			//   }
			// });
			// Bus.$on("payNote", item => {
			//   if (item) {
			//     this.payNote = item;
			//     console.log(this.payNote);
			//   }
			// });
			// Bus.$on("exCloseReason", item => {
			//   if (item) {
			//     this.exCloseReason = item;
			//   }
			// });
			// Bus.$on("fileSituation", item => {
			//   if (item) {
			//     this.fileSituation = item;
			//   }
			// });
			// Bus.$on("returnNoteFile", item => {
			//   if (item) {
			//     this.returnNoteFile = item;
			//   }
			// });
			// Bus.$on("payNoteFile", item => {
			//   if (item) {
			//     this.payNoteFile = item;
			//   }
			// });
			var id = 8;
			//公司id
			var account_id = this.userinfo.account_id;
			var url = "/template/" + id + "/" + account_id;
			getTemplate(url).then(res => {
				this.jsonData.list = res.data.data.list;
			})
			.catch(err => {
				console.log(err);
			});
		},
		methods: {
			//获取表单数据
			initPostProject() {
				localStorage.removeItem("globalParams");
				var params = {
					projectId: this.projectId
				};
				// var url = "/sgpm/rest/api/server/pm/project";
				var url = "/sgpm/rest/api/server/pm/ct/project/close/ex/" + this.projectId;
				postProject(url).then(res => {
					this.$set(this.globalParams, "data", res.data.data);
					localStorage.setItem('abnormalFrom',JSON.stringify(res.data.data));
					this.$set(this.globalParams,"data1",this.updateJsonData(res.data.data));
					localStorage.setItem("globalParams",JSON.stringify(this.updateJsonData(res.data.data)));
				}).catch(err => {
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
					
					if(jyjxConclusion[num].jYCategory == "" && jyjxConclusion[num].jYJiaoXunCategory == "" && jyjxConclusion[num].jYDescription == "" && jyjxConclusion[num].jYContributor == ""){
						this.$message.error('请填写经验教训总结!');
						this.isSave = false;
						return false;
					}else if (
						jyjxConclusion[i].jYCategory != "" && jyjxConclusion[i].jYJiaoXunCategory != "" && jyjxConclusion[i].jYDescription != "" && jyjxConclusion[i].jYContributor != ""
					) {
						// console.log(i);
					}
					 else {
						var check = false;
						index = i;
						var a = i;
						a != 0;
						for (var j in jyjxConclusion[index]) {
							// if (jyjxConclusion[index][j] == "") {
								if(jyjxConclusion[index].jYCategory != "" && jyjxConclusion[index].jYJiaoXunCategory != "" && jyjxConclusion[index].jYDescription != "" && jyjxConclusion[index].jYContributor != ""){
								check = true;
								return;
							}else if(jyjxConclusion[a].jYCategory == "" && jyjxConclusion[a].jYJiaoXunCategory == "" && jyjxConclusion[a].jYDescription == "" && jyjxConclusion[a].jYContributor == ""){
								check = true;
								return;
							}else{
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
			//保存经验教训数据
			jyjxSave(projectnumber,type) {
				var jyjxConclusion = JSON.parse(localStorage.getItem("jyjxConclusion"));
				// this.yanzheng(jyjxConclusion);
				if(type == 'submit'){
					if (this.yanzheng(jyjxConclusion) == false) {
						this.isSave = false;
						this.disabled = false;
						return;
					}else{
						this.saveJyjxDate(jyjxConclusion,projectnumber);
					}
				}else {
					this.saveJyjxDate(jyjxConclusion,projectnumber);
				}
			},
			
			saveJyjxDate(jyjxConclusion,projectnumber){
				jyjxConclusion = jyjxConclusion.map(item => {
					return Object.assign(item, {
						projectNumber: projectnumber
					});
				});
				var url = "/sgpm/rest/api/server/pm/project/experience";
				var data = jyjxConclusion;
				jyjxTable(url, data).then(res => {
					console.log("保存成功");
				}).catch(err => {
					console.log(err);
				});
			},
			
			//附件/支付/回款
			checkFile(){
				var returnNote = localStorage.getItem('returnNote');
				var payNote = localStorage.getItem('payNote');
				var exCloseReason = localStorage.getItem('exCloseReason');
				var fileSituation = localStorage.getItem('fileSituation');
				var returnNoteFile = localStorage.getItem('returnNoteFile');
				var payNoteFile = localStorage.getItem('payNoteFile');
				// if(!this.returninstructionsFile || !returnNoteFile){
				// 	this.$message.error('请上传回款说明附件!');
				// 	return false;
				// }else if(!this.payinstructionsFile || !payNoteFile){
				// 	this.$message.error('请上传支付说明附件!');
				// 	return false;
				// }else if(!this.returninstructions || !returnNote){
				// 	this.$message.error('请填写回款说明!');
				// 	return false;
				// }else if(!this.payinstructions || !payNote){
				// 	this.$message.error('请填写支付说明!');
				// 	return false;
				// }else 
				// if(!this.ycclosereason || !exCloseReason){
				// 	this.$message.error('请填写异常结项原因!');
				// 	return false;
				// }else if(!this.fileCase || !fileSituation){
				// 	this.$message.error('请填写归档情况!');
				// 	return false;
				// }
				
				if(!exCloseReason){
					this.$message.error('请填写异常结项原因!');
					return false;
				}else if(!fileSituation){
					this.$message.error('请填写归档情况!');
					return false;
				}
				
			},
			saveDate() {
				this.isSave = true;
				this.disabled = false;
				this.$refs.generateForm.getData().then(data => {
					var jyjxConclusion = JSON.parse(localStorage.getItem("jyjxConclusion"));
					console.log(this.returnNote);
					// this.ycclosereason = this.exCloseReason ? this.exCloseReason : data.exclosereason;
					// this.fileCase = this.fileSituation ? this.fileSituation : data.filesituation;
					// this.payinstructions = this.payNote ? this.payNote : data.paynote;
					// this.returninstructions = this.returnNote ? this.returnNote : data.returnnote;
					// this.payinstructionsFile = this.payNoteFile ? this.payNoteFile : data.paynoteenclosure;
					// this.returninstructionsFile = this.returnNoteFile ? this.returnNoteFile : data.returnnoteenclosure;
					var returnNote = (localStorage.getItem('returnNote') != "null") ? localStorage.getItem('returnNote') : '';
					var payNote = (localStorage.getItem('payNote') != "null") ? localStorage.getItem('payNote') : '';
					var exCloseReason = localStorage.getItem('exCloseReason');
					var fileSituation = localStorage.getItem('fileSituation');
					var returnNoteFile = (localStorage.getItem('returnNoteFile') != "null") ? localStorage.getItem('returnNoteFile') : '';
					var payNoteFile = (localStorage.getItem('payNoteFile') != "null") ? localStorage.getItem('payNoteFile') : '';
					var type = 'save';
					
					var classunitcid = data.classunitcid;
					var classunitcname = data.classunitcname;
					if(this.checkFile() == false){
						this.isSave = false;
						this.disabled = false;
						return;
					}
					// else if (this.yanzheng(jyjxConclusion) == false) {
					// 	this.isSave = false;
					// 	this.disabled = false;
					// 	return;
					// }
					 else {
						this.jyjxSave(data.projectnum,type);
						var data = {
							projectId: data.projectid,
							projectNum: data.projectnum,
							projectName: data.projectname,
							userId: data.userid,
							userName: data.username,//项目经理
							saleId: data.saleid,
							saleName: data.salename,//项目销售
							projectPeriod: data.projectperiod,//项目周期
							projectRepository: data.projectrepository,//配置库地址
							outsourcingRate: data.outsourcingrate,//外包支付率
							finishSchedule: data.finishschedule,//完成进度
							returnMoneyPercentage: data.returnmoneypercentage,//回款
							exCloseType: data.exclosetype,//异常结项类型
							fileSituation: fileSituation,//归档情况
							returnNote: returnNote,//回款说明
							returnNoteEnclosure: returnNoteFile,//回款附件
							payNote: payNote,//支付说明
							payNoteEnclosure: payNoteFile,//支付说明附件
							exCloseReason: exCloseReason,//异常结项原因
							projectStatus: data.projectstatus,
							auditStatus: 50,
							processId: data.processid,
							experience: jyjxConclusion//经验教训
						};
						if(this.userinfo.account_id == '-1814768306395265967'){
							data.classUnitCId = classunitcid;
							data.classUnitCName = classunitcname;
						}
						var url = "/sgpm/rest/api/server/pm/ct/project/close/ex";
						console.log(data)
						jyjxTable(url, data).then(res => {
							if (res.data.code == 200) {
								alert("保存成功!");
								this.isSave = false;
								this.disabled = false;
							} else {
								alert("保存失败!");
								this.isSave = false;
								this.disabled = false;
							}
						}).catch(err => {
							console.log(err);
							alert("保存失败!");
							this.isSave = false;
							this.disabled = false;
						});
					}
				}).catch(e => {
					// 数据校验失败
					console.log(e);
					this.isSave = false;
					this.disabled = false;
				});
			},
			handleSubmit() {
				this.$refs.generateForm
					.getData()
					.then(data => {
						this.disabled = true;
						// 数据校验成功
						var jyjxConclusion = JSON.parse(localStorage.getItem("jyjxConclusion"));
						// this.ycclosereason = this.exCloseReason ? this.exCloseReason : data.exclosereason;
						// this.fileCase = this.fileSituation ? this.fileSituation : data.filesituation;
						// this.payinstructions = this.payNote ? this.payNote : data.paynote;
						// this.returninstructions = this.returnNote ? this.returnNote : data.returnnote;
						// this.payinstructionsFile = this.payNoteFile ? this.payNoteFile : data.paynoteenclosure;
						// this.returninstructionsFile = this.returnNoteFile ? this.returnNoteFile : data.returnnoteenclosure;\
						
						var returnNote = (localStorage.getItem('returnNote') != "null") ? localStorage.getItem('returnNote') : '';
						var payNote = (localStorage.getItem('payNote') != "null") ? localStorage.getItem('payNote') : '';
						var exCloseReason = localStorage.getItem('exCloseReason');
						var fileSituation = localStorage.getItem('fileSituation');
						var returnNoteFile = (localStorage.getItem('returnNoteFile') != "null") ? localStorage.getItem('returnNoteFile') : '';
						var payNoteFile = (localStorage.getItem('payNoteFile') != "null") ? localStorage.getItem('payNoteFile') : '';
						
						var classunitcid = data.classunitcid;
						var classunitcname = data.classunitcname;
						var type = 'submit';
						if(this.checkFile() == false){
							this.disabled = false;
							return;
						}else if (this.yanzheng(jyjxConclusion) == false) {
							this.disabled = false;
							return;
						} else {
							this.jyjxSave(data.projectnum,type);
							var data = {
								projectId: data.projectid,
								projectNum: data.projectnum,
								projectName: data.projectname,
								userId: data.userid,
								userName: data.username,//项目经理
								saleId: data.saleid,
								saleName: data.salename,//项目销售
								projectPeriod: data.projectperiod,//项目周期
								projectRepository: data.projectrepository,//配置库地址
								outsourcingRate: data.outsourcingrate,//外包支付率
								finishSchedule: data.finishschedule,//完成进度
								returnMoneyPercentage: data.returnmoneypercentage,//回款
								exCloseType: data.exclosetype,//异常结项类型
								fileSituation: fileSituation,//归档情况
								returnNote: returnNote,//回款说明
								returnNoteEnclosure: returnNoteFile,//回款附件
								payNote: payNote,//支付说明
								payNoteEnclosure: payNoteFile,//支付说明附件
								exCloseReason: exCloseReason,//异常结项原因
								projectStatus: data.projectstatus,
								auditStatus: 51,
								processId: data.processid,
								username: this.userinfo.login_name,
								classUnitBId: data.classunitbid,
								classUnitBName: data.classunitbname,
								saleClassUnitBId: data.saleclassunitbid,
								saleClassUnitBName: data.saleclassunitbname,
								experience: jyjxConclusion,//经验教训
								companyId: this.userinfo.account_id,
								companyName: this.userinfo.account_name
							}
							if(this.userinfo.account_id == '-1814768306395265967'){
								data.classUnitCId = classunitcid;
								data.classUnitCName = classunitcname;
							}
							var url = "/sgpm/rest/api/integration/oa/close/ex";
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
<style>
	@import "../../assets/css/common.css";
</style>
<style lang="scss" scoped>
	.projectview {
		overflow-y: auto;
	}

	.btns {
		text-align: center;
	}

	.el-textarea {
		textarea {
			font-style: italic;
		}
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
