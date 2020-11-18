<template>
	<el-form>
		<!-- <el-button class="add" type="primary" @click="addRow(tableData)">添加</el-button> -->
		<el-table :data="tableData" class="tb-edit" highlight-current-row @row-click="handleCurrentChange" style="width: 100%">
			<el-table-column type="index" label="序号" width="50"></el-table-column>
			<el-table-column prop="jYCategory" label="分类" width="180">
				<template slot="header">
				  <span class="start">*</span>
				  <span>分类</span>
				</template>
				<template slot-scope="scope">
					<el-select v-model="scope.row.jYCategory" filterable placeholder="请选择" @change="handleEdit(scope.$index, scope.row)" clearable>
						<el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label"></el-option>
					</el-select>
					<span>{{scope.row.jYCategory}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="jYJiaoXunCategory" label="经验教训分类" width="180">
				<template slot="header">
				  <span class="start">*</span>
				  <span>经验教训分类</span>
				</template>
				<template slot-scope="scope">
					<el-select v-model="scope.row.jYJiaoXunCategory" filterable placeholder="请选择" @change="handleEdit(scope.$index, scope.row)" clearable>
						<el-option v-for="item in jyjxOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
					</el-select>
					<span>{{scope.row.jYJiaoXunCategory}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="jYDescription" label="描述" width="550">
				<template slot="header">
				  <span class="start">*</span>
				  <span>描述</span>
				</template>
				<template slot-scope="scope">
					<el-input v-model="scope.row.jYDescription" @change="handleEdit(scope.$index, scope.row)"></el-input>
					<span>{{scope.row.jYDescription}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="jYContributor" label="贡献人">
				<template slot="header">
				  <span class="start">*</span>
				  <span>贡献人</span>
				</template>
				<template slot-scope="scope">
					<el-select v-model="scope.row.jYContributor" filterable placeholder="请选择" id="contributor" @change="handleEdit(scope.$index, scope.row)" clearable>
						<el-option v-for="item in contribution" :key="item.name" :label="item.name" :value="item.name"></el-option>
					</el-select>
					<span>{{scope.row.jYContributor}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="projectNumber" label="projectNumber" width="0" v-if="show"></el-table-column>
			<!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
		</el-table>
	</el-form>
</template>

<script>
	import Bus from "../../bus";
	import {
		mapState,
		mapActions
	} from "vuex";
	import {
		postProject
	} from "../../api/api.js";
	import GenerateForm from "@/components/CreateForm/GenerateForm";
	import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
	import {
		postProjectPeople
	} from "../../api/api.js";
	export default {
		name: "conclusion",
		props: ["widget", "models", "rules", "remote", "datas"],
		components: {
			GenerateForm,
			GenetateFormItem
		},
		data() {
			return {
				show: false,
				projectId: this.$route.query.id,
				projectNum: this.$route.query.projectNum,
				jYContributor: "",
				globalParams: {},
				options: [{
						value: "选项1",
						label: "项目监控"
					},
					{
						value: "选项2",
						label: "项目策划"
					},
					{
						value: "选项3",
						label: "需求"
					},
					{
						value: "选项4",
						label: "设计与开发"
					},
					{
						value: "选项6",
						label: "评审和测试"
					},
					{
						value: "选项7",
						label: "度量"
					},
					{
						value: "选项8",
						label: "质量保证"
					},
					{
						value: "选项9",
						label: "集成"
					},
					{
						value: "选项10",
						label: "风险"
					},
					{
						value: "选项11",
						label: "配置"
					},
					{
						value: "选项5",
						label: "培训"
					},
					{
						value: "选项5",
						label: "其他"
					}
				],
				jyjxOptions: [{
						value: "选项1",
						label: "经验"
					},
					{
						value: "选项2",
						label: "教训"
					},
					{
						value: "选项3",
						label: "改进建议"
					}
				],
				contribution: [],
				tableData: [{
						jYCategory: "",
						jYJiaoXunCategory: "",
						jYDescription: "",
						jYContributor: "",
						projectNumber: ""
					},
					{
						jYCategory: "",
						jYJiaoXunCategory: "",
						jYDescription: "",
						jYContributor: "",
						projectNumber: ""
					},
					{
						jYCategory: "",
						jYJiaoXunCategory: "",
						jYDescription: "",
						jYContributor: "",
						projectNumber: ""
					},
					{
						jYCategory: "",
						jYJiaoXunCategory: "",
						jYDescription: "",
						jYContributor: "",
						projectNumber: ""
					},
					{
						jYCategory: "",
						jYJiaoXunCategory: "",
						jYDescription: "",
						jYContributor: "",
						projectNumber: ""
					}
				],
				projectNumber:''
			};
		},
		created() {
			// console.log(this.projectId)
			this.postProjectPeople();
			setTimeout(() => {
				if (this.userinfo.account_id == '-1360422574114386809' || this.userinfo.account_id == '5326994013938795629') {
					this.getTable();
				} else if (this.userinfo.account_id == '-1814768306395265967' || this.userinfo.account_id == '8416498716893399290' || this.userinfo.account_id == '7638091599462351621') {
					this.getGtTable();
				}
			}, 500);
			// this.initPostProject();
		},
		computed: {
			...mapState([
				"userinfo" //oa跳转过来的用户信息值
			])
		},
		methods: {
			// initPostProject() {
			// 	var params = {
			// 		projectId: this.$route.query.id
			// 	}
			// 	var url = '/sgpm/rest/api/server/pm/project'
			// 	postProject(url, params).then(res => {
			// 		console.log(res)
			// 		for(var i = 0;i < this.tableData.length; i++){
			// 			this.tableData[i].jYContributor = res.data.data.PROJECTMANAGER;
			// 		}
			// 	}).catch(err => {
			// 		console.log(err);
			// 	})
			// },
			//贡献人
			postProjectPeople() {
				// var url ="/sgpm/rest/api/server/pm/project/members/experience/101336";
				var url = "/sgpm/rest/api/server/pm/project/members/experience/" + this.projectId;
				var params = {
					manager: this.userinfo.emp_name
				};
				postProjectPeople(url, params)
					.then(res => {
						this.contribution = res.data.data;
					})
					.catch(err => {
						console.log(err);
					});
			},
			//表格内容
			//超图
			getTable() {
				console.log(this.$route.query.projectNum)
				localStorage.removeItem("jyjxConclusion");
				var url = "/sgpm/rest/api/server/pm/project/experience";
				var data = {
					projectNumber: this.$route.query.projectNum
				};
				postProject(url, data)
					.then(res => {
						this.tableData = res.data.data;
						localStorage.setItem(
							"jyjxConclusion",
							JSON.stringify(this.tableData)
						);
					})
					.catch(err => {
						console.log(err);
					});
			},
			//国图表格
			getGtTable() {
				localStorage.removeItem("jyjxConclusion");
				var url = "/sgpm/rest/api/server/pm/gt/project/" + this.projectId + "/" + this.projectNum;
					postProject(url)
					.then(res => {
						this.tableData = res.data.data.jY;
						console.log(res.data.data.jY)
						localStorage.setItem(
							"jyjxConclusion",
							JSON.stringify(this.tableData)
						);
					})
					.catch(err => {
						console.log(err);
					});
			},
			//添加
			// addRow(tableData,event){
			// 		tableData.push({ date: '', name: '',address:''})
			// 	},
			//删除
			// handleDelete(index, row) {
			//   console.log(index, row);
			// },
			//编辑
			handleEdit(index, row) {
				// console.log(index,row);
				var tableDataInfo = this.tableData;
				localStorage.removeItem("jyjxConclusion");
				localStorage.setItem("jyjxConclusion", JSON.stringify(tableDataInfo));
			},
			handleCurrentChange(row, event, column) {
				console.log(row, event, column, event.currentTarget);
				var params = {
					projectId: this.$route.query.id,
				};
				var url = "/sgpm/rest/api/server/pm/project";
				postProject(url, params)
					.then(res => {
						console.log(res);
						for (var i = 0; i < this.tableData.length; i++) {
							row.jYContributor = res.data.data.PROJECTMANAGER;
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	};
</script>

<style scoped>
	.add {
		float: right;
	}

	.tb-edit .el-select {
		display: none;
	}

	.tb-edit .current-row .el-select {
		display: block;
	}

	.tb-edit .current-row .el-select+span {
		display: none;
	}

	.tb-edit .el-input {
		display: none;
	}

	.tb-edit .current-row .el-input {
		display: block;
	}

	.tb-edit .current-row .el-input+span {
		display: none;
	}
	.start {
	  color: red;
	}
</style>
