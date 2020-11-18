<template>
	<div class="mounth-output">
		<el-row :gutter="10" class="search" type="flex" justify="space-between">
			<el-col :xs="8" :sm="6" :md="8" :lg="7" :xl="7">
				<div class="wrap">
					<span class="labal">查看范围</span>
					<el-select v-model="firstSelectvalue" size="mini" placeholder="请选择" @change="changeSearch" class="search-select" clearable>
						<el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="SecondSelectvalue" size="mini" placeholder="请选择" @change="changeDep" clearable>
						<el-option v-for="(item,index) in optionsList" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="9">
				<div class="grid-content bg-purple-light">
					<div class="wrap">
						<span class="labal">日期</span>
						<el-date-picker
							size="mini"
							v-model="searchMonth"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							type="daterange"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions"
							@change="pickDateChange"
						></el-date-picker>
					</div>
				</div>
			</el-col>
			<el-col :xs="4" :sm="6" :md="8" :lg="7" :xl="7">
				<div class="grid-content bg-purple-light">
					<div class="wrap">
						<el-input v-model="projectName" style="width:62%;" size="mini" placeholder="合同名称/编号/部门">
							<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
						</el-input>
						<el-button type="primary" size="mini" @click="search">查询</el-button>
						<el-button type="primary" size="mini" @click="exportData" :disabled="isExport">导出</el-button>
						<el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh" circle class="circle-btn"></el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-table
			:data="tableData"
			:height="asideHeight"
			border
			:header-cell-style="{
				fontSize: '14px',
				color: '#303133',
				height: '51px',
				padding: 0,
				backgroundColor: '#ccd1d5'
			}"
			:row-style="{ height: '50px' }"
			@header-dragend="headerDragend"
			:cell-style="{ padding: 0 }"
			v-loading="loading"
		>
			<el-table-column type="index" width="38" align="center" label="序号"></el-table-column>
			<el-table-column prop="contractNumber" label="合同编号" align="center" :width="160"></el-table-column>
			<el-table-column prop="contractName" label="合同名称" align="center" :width="170" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="saleBName" label="销售B级单位" align="center" :width="130"></el-table-column>
			<el-table-column prop="saleCName" label="销售C级单位" align="center" :width="130"></el-table-column>
			<el-table-column prop="contractLevelCName" label="合同实施部门" align="center" :width="130" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="contractSignDate" label="合同登记日期" align="center" :width="130"></el-table-column>
			<el-table-column prop="levelBName" label="未关联B级部门" align="center" :width="130"></el-table-column>
			<el-table-column prop="levelCName" label="未关联C级部门" align="center" :width="130"></el-table-column>
			<el-table-column prop="outputValue" label="剩余合同产值" align="center"></el-table-column>
		</el-table>
		<el-pagination
			class="page"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10]"
			:page-size="100"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>
	</div>
</template>

<script>
import api from "../../api/index";
import { getAssociatedOutput, getdeptByType } from '../../api/api.js';
import { mapState, mapActions } from "vuex";
export default {
	name: 'notAssociatedOutput',
	props: ['widget', 'models', 'rules', 'remote', 'datas'],
	data() {
		return {
			loading:false,
			firstSelectvalue: '',
			SecondSelectvalue: '',
			//总条数
			total: 0,
			pageNum: 1,
			pageSize: 10,
			isPname: true,
			btnMaxWidth: 160,
			monthly: '',
			projectStatusConfig: {
				0: '已登记',
				1: '运行中',
				2: '暂停',
				3: '完成',
				4: '关闭',
				5: '异常关闭'
			},
			associatedStatesConfig: {
				0: '已关联未分配',
				1: '已关联已分配',
				2: '未关联',
				3: '合同终止时间已到',
				4: '无需关联'
			},
			options: [
				{
					value: 'IB',
					label: '实施B级单位'
				},
				{
					value: 'IC',
					label: '实施C级单位'
				}
				// {
				//   value: "SB",
				//   label: "销售B级单位"
				// },
				// {
				//   value: "SC",
				//   label: "销售C级单位"
				// }
			],
			optionsList: [],
			tableData: [],
			currentPage3: 5,
			currentPage: 1,
			projectName: '',
			searchMonth: '',
			level: '',
			levelValue: '',
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}
				]
			},
			beginDate:'',
			endDate:'',
			isExport: true
		};
	},
	watch: {
		datas: {
			deep: true,
			handler: function(val) {
				console.log(this.datas);
				console.log(this.datas.options.url_a);
			}
		}
	},
	computed: {
		...mapState([
      		"userinfo", //os跳转过来的用户信息值
    	]),
		asideHeight: function() {
			return document.documentElement.clientHeight - 205;
		}
	},
	methods: {
		pickDateChange(val) {
			if(val){
				this.minMonthly = val[0];
				this.maxMonthly = val[1];
				this.searchMonth = val;
			}
		},
		changeDep(val) {
			this.levelValue = val;
			console.log(val);
		},
		changeSearch(val) {
			this.optionsList = [];
			this.SecondSelectvalue = '';
			this.level = val;
			getdeptByType(`/sgpm/rest/api/server/project/output/dept?deptType=${val}`, null)
				.then(res => {
					if (res.status == 200) {
						let result = res.data.data;
						this.optionsList = result;
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		headerDragend(newWidth, oldWidth, column, event) {
			this.btnMaxWidth = newWidth;
			if (newWidth > 200) {
				this.isPname = false;
			} else {
				this.isPname = true;
				this.btnMaxWidth = 200;
			}
		},
		getNotAssociatedOutputList(val) {
			this.loading = true;
			this.tableData = [];
			//获取项目列表信息
			getAssociatedOutput(`/sgpm/rest/api/server/contract/residual/value`, val)
				.then(res => {
					if (res.status == 200) {
						let result = res.data.data;
						this.tableData = result;
						let meta = res.data.meta;
						this.total = meta.totalCount;
						this.currentPage = meta.pageNo;
						this.loading = false;
					}
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		refresh() {
			this.searchMonth = '';
			this.firstSelectvalue = '';
			this.SecondSelectvalue = '';
			this.levelValue = '';
			this.level = '';
			this.projectName = '';
			var params = {
				keyword: '',
				pageNum: 1,
				pageSize: 10,
				beginDate: this.beginDate,
				endDate: this.endDate,
				levelBId: this.SecondSelectvalue,
				levelCId: this.SecondSelectvalue
			};
			this.getNotAssociatedOutputList(params);
		},
		search() {
			var param = {
				keyword: this.projectName,
				pageNum: 1,
				pageSize: 10,
				beginDate: this.minMonthly? this.minMonthly: this.beginDate,
				endDate: this.maxMonthly? this.maxMonthly : this.endDate,
				levelBId: '',
				levelCId: this.SecondSelectvalue
			};
			// if (this.level != "") {
			//   param[this.level] = this.levelValue;
			// }
			console.log(param);
			this.getNotAssociatedOutputList(param);
		},
		//导出
		exportData(){
			var beginDate = this.minMonthly? this.minMonthly: this.beginDate;
			var endDate = this.maxMonthly? this.maxMonthly : this.endDate;
			let a = document.createElement("a");
			
			a.href =
			  api.urlPort04 + "/sgpm/rest/api/server/pm/project/excel/export/gt/contract_surplus_output_value?levelCId=" + this.SecondSelectvalue + '&keyword=' + this.projectName + '&beginDate=' + beginDate + '&endDate=' +endDate + '&levelBId=';
			a.download =
			  api.urlPort04 + "/sgpm/rest/api/server/pm/project/excel/export/gt/contract_surplus_output_value?levelCId=" + this.SecondSelectvalue + '&keyword=' + this.projectName + '&beginDate=' + beginDate + '&endDate=' +endDate + '&levelBId=';
			a.click();
			return false;
		},
		handleCurrentChange(val) {
			var params = {
				keyword: this.projectName,
				pageNum: val,
				pageSize: 10,
				beginDate: this.minMonthly? this.minMonthly: this.beginDate,
				endDate: this.maxMonthly? this.maxMonthly : this.endDate,
				levelBId: '',
				levelCId: this.SecondSelectvalue
			};
			// if (this.level != "") {
			//   param[this.level] = this.levelValue;
			// }
			this.getNotAssociatedOutputList(params);
		}
	},
	mounted() {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateNow = date.getDate();
		this.beginDate = year + '-' + month + '-' + '1';
		this.endDate = year + '-' + month + '-' + dateNow;
		var param = {
			keyword: this.projectName,
			pageNum: 1,
			pageSize: 10,
			beginDate: this.beginDate,
			endDate: this.endDate,
			levelBId: this.SecondSelectvalue,
			levelCId: this.SecondSelectvalue
		};
		this.getNotAssociatedOutputList(param);
		this.isExport = this.userinfo.memberid == '2361372308666271490' || this.userinfo.memberid == '-2214906182493845302' || this.userinfo.memberid == '-2357901482704941730' ? false : true;
	},
	created() {}
	//每个组件都要增加销毁前重置EventBus
};
</script>

<style lang="scss">
.mounth-output {
	padding: 0 15px 0 15px;
	.search {
		margin: 20px 0;
		.wrap {
			display: flex;
			.labal {
				font-size: 12px;
				padding: 0 2%;
				width: 100px;
				text-align: right;
			}
		}
		.search-select {
			margin: 0 5px 0 0;
		}
	}
	.page {
		float: right;
		margin-top: 10px;
	}
	.pname {
		// max-width: 100px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.circle-btn {
		border-radius: 5px;
	}
}
</style>
