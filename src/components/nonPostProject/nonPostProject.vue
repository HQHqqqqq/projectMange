<template>
	<el-col :span="24" class="projectview">
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
import Bus from '../../bus';
import { mapState, mapActions } from 'vuex';
import GenerateForm from '@/components/CreateForm/GenerateForm';
import GenetateFormItem from '@/components/CreateForm/GenerateFormItem';
import config from '../../config';
import '@/components/CreateForm/styles/FormCreate.css';
import { getData } from '../../api/api.js';
import { postProject } from '../../api/api.js';
import { saveDate } from '../../api/api.js';
import { postProjectSubmit } from '../../api/api.js';
import { jyjxTable } from '../../api/api.js';
import { getTemplate } from '../../api/api.js';

export default {
	name: 'nonPostProject',
	components: {
		GenerateForm,
		GenetateFormItem
	},
	data() {
		return {
			jsonData: {
				list: '',
				config: {
					labelPosition: 'left',
					labelWidth: 100,
					size: 'small'
				}
			},
			projectId: this.$route.query.id,
			globalParams: {},
			editData: {},
			remoteFuncs: {},
			isSave: false,
			disabled: false,
			isShow: this.$route.query.isShow == true ? false : true, //默认显示
		};
	},
	computed: {
		...mapState([
			'userinfo', //oa跳转过来的用户信息值
			'isDetail' //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
		])
	},

	created() {
		this.initPostProject();
	},
	mounted() {
		var id = 9;
    	//公司id
    	var account_id = this.userinfo.account_id;
    	var url = "/template/" + id + "/" + account_id;
    	getTemplate(url).then((res) => {
        	this.jsonData = res.data.data;
      	})
      	.catch((err) => {
        	console.log(err);
      	});
	},
	methods: {
		//获取表单数据
		initPostProject() {
			console.log(this.projectId);
			localStorage.removeItem('globalParams');
			var url = '/sgpm/rest/api/server/non/pm/gt/project/close?projectId=' + this.projectId;
			// var url = "/sgpm/rest/api/server/non/pm/gt/project/close?projectId=101336";
			postProject(url)
				.then(res => {
					console.log(res);
					localStorage.setItem('globalParams', JSON.stringify(this.updateJsonData(res.data.data)));
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
						projectNumber: projectnumber,
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
		saveDate(){
			this.isSave = true;
			this.disabled = true;
			this.$refs.generateForm.getData().then(data => {
				var jyjxConclusion = JSON.parse(localStorage.getItem("jyjxConclusion"));
				if(jyjxConclusion){
					if (this.yanzheng(jyjxConclusion) == false) {
						this.isSave = false;
						this.disabled = false;
						return;
					}else{
						this.jyjxSave(data.projectnumber);
						var data = {
							id: data.id,
							closeReason: data.closereason,
							auditStatus: 30
						}
						saveDate('/sgpm/rest/api/server/non/pm/gt/project/close', data).then(res => {
							console.log(res);
							if (res.data.code == 200) {
								alert("保存成功!");
								this.isSave = false;
								this.disabled = false;
							} else {
								alert("保存失败!");
								this.isSave = false;
								this.disabled = false;
							}
						// }
					}).catch(err => {
						console.log(err);
						alert('保存失败!');
						this.isSave = false;
						this.disabled = false;
					});
					}
				}else{
					this.$message.error('请填写经验教训总结!');
					this.isSave = false;
					this.disabled = false;
					return false;
				}

			}).catch(e => {
				// 数据校验失败
				console.log(e);
			});
		},
		handleSubmit(){
			this.$refs.generateForm.getData().then(data => {
				var jyjxConclusion = JSON.parse(localStorage.getItem("jyjxConclusion"));
				if(jyjxConclusion){
					if (this.yanzheng(jyjxConclusion) == false) {
						this.isSave = false;
						this.disabled = false;
						return;
					}else{
						var data = {
							jumpType: data.jumptype,
							acceptanceDate: data.acceptancedate,
							totalWorkingHours: data.totalworkinghours,
							projectContent: data.projectcontent,
							projectManagerName: data.projectmanagername,
							classUnitBName: data.classunitbname,
							projectNumber: data.projectnumber,
							projectType: data.projecttype,
							expectProjectEndDate: data.expectprojectenddate,
							classUnitCId: data.classunitcid,
							repositoryAddress: data.repositoryaddress,
							classUnitBId: data.classunitbid,
							paymentAmount: data.paymentamount,
							expectProjectStartDate: data.expectprojectstartdate,
							percentageComplete: data.percentagecomplete,
							projectCategory: data.projectcategory,
							classUnitCName: data.classunitcname,
							auditStatus: 31,
							projectManagerId: data.projectmanagerid,
							projectBudget: data.projectbudget,
							id: data.id,
							projectName: data.projectname,
							closeReason: data.closereason,
							workflowId: data.workflowid,
							username: this.userinfo.login_name,
							companyId: this.userinfo.account_id,
							experience:jyjxConclusion
						}
						var url = '/sgpm/rest/api/integration/oa/non/close';
						postProjectSubmit(url, data).then(res => {
							if (res.data.code == 200) {
								alert("提交成功!");
								this.disabled = false;
								this.isSave = false;
								this.$router.push({
									path: "audititem"
								});
							} else {
								alert("提交失败!");
								this.disabled = false;
								this.isSave = false;
							}
						}).catch(err => {
							console.log(err);
							this.disabled = false;
							this.isSave = false;
							alert("提交失败!");
						})
					}
				}else{
					this.$message.error('请填写经验教训总结!');
					this.isSave = false;
					this.disabled = false;
					return false;
				}


			}).catch(e => {
				// 数据校验失败
				console.log(e);
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
</style>
