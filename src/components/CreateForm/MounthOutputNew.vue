<template>
	<div class="mounth-outputNew">
		<el-row :gutter="10" class="search" type="flex" justify="space-between">
			<el-col :xs="8" :sm="6" :md="8" :lg="7" :xl="7">
				<div class="wrap">
					<span class="labal">查看范围</span>
					<el-select v-model="firstSelectvalue" size="mini" placeholder="请选择" @change="changeSearch" class="search-select" clearable>
						<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="SecondSelectvalue" size="mini" placeholder="请选择" @change="changeDep" clearable>
						<el-option v-for="(item, index) in optionsList" :key="index" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="9">
				<div class="grid-content bg-purple-light">
					<div class="wrap dateChoose">
						<span class="labal">日期</span>
						<el-date-picker size="mini" v-model="searchMonth" format="yyyy-MM" value-format="yyyy-MM" type="daterange"
              unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions" @change="pickDateChange">
						</el-date-picker>
					</div>
				</div>
			</el-col>
			<el-col :xs="4" :sm="6" :md="8" :lg="7" :xl="7">
				<div class="grid-content bg-purple-light">
					<div class="wrap">
						<el-input v-model="projectName" style="width:62%;" size="mini" placeholder="项目名称/编号">
							<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
						</el-input>
						<el-button type="primary" size="mini" @click="search">查询</el-button>
						<el-button type="primary" size="mini" @click="exportData" :disabled="isExport">导出</el-button>
						<el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh" circle class="circle-btn"></el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<div class="project">
			<el-table
				:data="tableData"
				max-height="280"
				border
				highlight-current-row
				:header-cell-style="{ fontSize: '14px', color: '#303133', height: '35px', padding: 0, backgroundColor: '#ccd1d5' }"
				:row-style="{ height: '35px' }"
				@header-dragend="headerDragend"
				:cell-style="{ padding: 0 }"
				@current-change="handleCurrentProject"
				 v-loading="loading"
			>
				<el-table-column type="index" width="38" align="center" label="序号" :fixed="true"></el-table-column>
				<el-table-column label="项目名称" width="140" align="center" :fixed="true" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span class="num">{{ scope.row.projectName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="projectNumber" label="项目编号" align="center" :width="170"></el-table-column>
				<el-table-column prop="implementationDepartmentB" label="实施B级单位" align="center" :width="130"></el-table-column>
				<el-table-column prop="implementationDepartmentC" label="实施C级单位" align="center" :width="130">
					<template slot-scope="scope">
						{{ scope.row.implementationDepartmentC | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="projectManager" align="center" label="项目经理"></el-table-column>
				<el-table-column prop="typeOfOutputValueAccounting" align="center" label="产值核算类型" :width="130"></el-table-column>
				<el-table-column prop="projectStatus" align="center" label="项目状态">
					<template slot-scope="scope">
						<span>{{ scope.row.projectStatus || formatIsNull }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="relationStatus" label="关联状态" :width="110">
					<template slot-scope="scope">
						<span>{{ scope.row.relationStatus }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="funding" align="center" label="纯合同额/经费" :width="130"></el-table-column>
				<el-table-column prop="atTheEndOfProgress" align="center" :label="monthProgress" :width="90">
					<template slot-scope="scope">
						{{ scope.row.atTheEndOfProgress | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="thisMonthOutputValue" align="center" :label="monthOutput">
					<template slot-scope="scope">
						{{ scope.row.thisMonthOutputValue | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="residualValue" align="center" label="剩余合同产值" :width="110"></el-table-column>
				<el-table-column prop="outputValue" align="center" label="年度产值">
					<template slot-scope="scope">
						{{ scope.row.outputValue | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="contractNumber" align="center" label="合同编号" :width="200">
					<template slot-scope="scope">
						{{ scope.row.contractNumber | formatIsNull }}
						<!-- <el-tag type="info" size="mini" v-for="(arr, index) in scope.row.contractNumbers" :key="index">{{ arr }}</el-tag> -->
					</template>
				</el-table-column>
				<el-table-column prop="saleBName" align="center" label="销售B级单位" :width="130">
					<template slot-scope="scope">
						{{ scope.row.saleBName | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="saleCName" align="center" label="销售C级单位" :width="130">
					<template slot-scope="scope">
						{{ scope.row.saleCName | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="description" align="center" label="备注" :width="205">
					<template slot-scope="scope">
						{{ scope.row.description | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="atThisStage" align="center" label="当前阶段">
					<template slot-scope="scope">
						{{ scope.row.atThisStage | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="currentMilestone" align="center" label="当前里程碑" :width="130">
					<template slot-scope="scope">
						{{ scope.row.currentMilestone | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="province" label="区域（省）" align="center">
					<template slot-scope="scope">
						{{ scope.row.province | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="city" label="区域（市）" align="center">
					<template slot-scope="scope">
						{{ scope.row.city | formatIsNull }}
					</template>
				</el-table-column>
			</el-table>
			<div style="width: 100%;height: 52px;padding-bottom: 10px;padding-top: 10px;">
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
			
		</div>
		
		<el-row :gutter="20">
		  <el-col :span="12">
		    <div class="list-container">
		      <el-table :data="progressData" :height="asideHeightA" border style="width: 100%"
		        :header-cell-style="{
		          fontSize: '14px',
		          color: '#303133',
		          height: '34px',
		          padding: 0,
		          backgroundColor: '#ccd1d5'
		        }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }">
		        <el-table-column prop="years" width="50" label="年份" align="center" :fixed="true">
		        </el-table-column>
		        <el-table-column prop="progressBeginningOfYear" label="年初初始进度" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.progressBeginningOfYear | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthProgress1" label="1月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress1 | formatIsNull }}
					</template>
		        </el-table-column>
				<el-table-column prop="monthProgress2" label="2月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress2 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress3" label="3月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress3 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress4" label="4月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress4 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress5" label="5月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress5 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress6" label="6月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress6 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress7" label="7月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress7 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress8" label="8月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress8 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress9" label="9月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress9 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress10" label="10月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress10 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress11" label="11月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress11 | formatIsNull }}
					</template>
				</el-table-column>
				<el-table-column prop="monthProgress12" label="12月末进度" width="70" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress12 | formatIsNull }}
					</template>
				</el-table-column>
		      </el-table>
		    </div>
		  </el-col>
		  <el-col :span="12">
		    <div class="">
		
		      <el-table :data="outputData" :height="asideHeightA" border style="width: 100%" :header-cell-style="{
		          fontSize: '14px',
		          color: '#303133',
		          height: '45px',
		          padding: 0,
		          backgroundColor: '#ccd1d5'
		        }" :row-style="{ height: '34px' }" :cell-style="{ padding: 0 }">
		        <el-table-column prop="years" width="50" label="年份" align="center" :fixed="true">
		        </el-table-column>
		        <el-table-column prop="monthProgress1" label="1月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress1 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthProgress2" label="2月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress2 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthProgress3" label="3月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress3 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthProgress4" label="4月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress4 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthProgress5" label="5月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress5 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthProgress6" label="6月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthProgress6 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthValue7" label="7月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthValue7 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthValue8" label="8月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthValue8 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthValue9" label="9月产值" width="80" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthValue9 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthValue10" label="10月产值" width="90" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthValue10 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthValue11" label="11月产值" width="90" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthValue11 | formatIsNull }}
					</template>
		        </el-table-column>
		        <el-table-column prop="monthValue12" label="12月产值" width="90" align="center">
					<template slot-scope="scope">
						{{ scope.row.monthValue12 | formatIsNull }}
					</template>
		        </el-table-column>
		      </el-table>
		    </div>
		  </el-col>
		</el-row>
		
	</div>
</template>

<script>
import api from "../../api/index";
import { getMonthOutput, getdeptByType, getAssociatedOutput } from '../../api/api.js';
import { mapState, mapActions } from "vuex";
export default {
	name: 'MounthOutputNew',
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
				},
				// {
				// 	value: 'SB',
				// 	label: '销售B级单位'
				// },
				// {
				// 	value: 'SC',
				// 	label: '销售C级单位'
				// }
			],
			tableData: [],
			optionsList: [],
			currentPage3: 5,
			currentPage: 1,
			projectName: '',
			searchMonth: '',
			//向后台传开始时间
			minMonthly: '',
			//向后台传结束时间
			maxMonthly: '',
			level: '',
			levelValue: '',
			monthProgress:'',
			monthOutput:'',
			pickerOptions: {
				// disabledDate(time) {
				// 	let date1 = new Date();
				// 	let year = date1.getFullYear();
				// 	let start = new Date(year - 1, 11, 31).getTime();
				// 	let end = new Date(year, 11, 31).getTime();
				// 	return time.getTime() <= start || time.getTime() >= end;
				// },
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
			value1: '',
			progressData:[],
			outputData:[],
			isExport: true
		};
	},
	filters: {
		formatIsNull: function(value) {
			if (value == null || value === "") {
				return '--';
			} else {
				return value;
			}
		}
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
		},
		asideHeightA: function() {
		  return document.documentElement.clientHeight - 530;
		}
	},
	methods: {
		//选中的项目信息
		handleCurrentProject(val){
			if(val){
				var projectNumber = val.projectNumber;
				getAssociatedOutput(`/sgpm/rest/api/server/project/output/progress?projectNumber=${projectNumber}`, null)
					.then(res => {
						if (res.data.code == 200) {
							let result = res.data.data;
							this.progressData = result.progress;
							this.outputData = result.values;
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		pickDateChange(val) {
			if(val){
				this.minMonthly = val[0];
				this.maxMonthly = val[1];
			}
		},
		changeDep(val) {
			this.levelValue = val;
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
		getMonthOutputList(val) {
			this.loading = true;
			//获取项目列表信息
			getMonthOutput(`/sgpm/rest/api/server/project/monthly/output`, val)
				.then(res => {
					if (res.status == 200) {
						let result = res.data.data;

						// result.forEach((ele, index) => {
						// 	if (ele.contractNumbers.indexOf(';') > -1) {
						// 		ele.contractNumbers = ele.contractNumbers.split(';');
						// 	} else if (ele.contractNumbers.indexOf(';') == -1 && ele.contractNumbers != '') {
						// 		var ary = [];
						// 		ary.push(ele.contractNumbers);
						// 		ele.contractNumbers = ary;
						// 	} else {
						// 		ele.contractNumbers = [];
						// 	}
						// });
						this.tableData = result;
						let meta = res.data.meta;
						this.total = meta.totalCount;
						this.loading = false;
					}
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		search() {
			var param = {
				keywords: this.projectName,
				minMonthly: this.minMonthly,
				maxMonthly: this.maxMonthly,
				pageNum: 1,
				pageSize: 10,
				type: 1
			};
			console.log(param)
			if (this.level != '') {
				param[this.level] = this.levelValue;
			}
			this.getMonthOutputList(param);
		},
		//导出
		exportData(){
			// 
			let a = document.createElement("a");
			
			a.href =
			  api.urlPort04 + "/sgpm/rest/api/server/pm/project/excel/export/gt/month/output/value";
			a.download =
			  api.urlPort04 + "/sgpm/rest/api/server/pm/project/excel/export/gt/month/output/value";
			a.click();
			return false;
		},
		refresh() {
			this.searchMonth = '';
			this.firstSelectvalue = '';
			this.minMonthly = '';
			this.maxMonthly = '';
			this.SecondSelectvalue = '';
			this.levelValue = '';
			this.level = '';
			this.projectName = '';
			var params = {
				minMonthly: '',
				maxMonthly: '',
				keywords: '',
				pageNum: 1,
				pageSize: 10,
				type: 1
			};
			this.getMonthOutputList(params);
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			var param = {
				keywords: this.projectName,
				minMonthly: this.minMonthly,
				maxMonthly: this.maxMonthly,
				pageNum: val,
				pageSize: 10,
				type: 1
			};
			if (this.level != '') {
				param[this.level] = this.levelValue;
			}
			this.getMonthOutputList(param);
		}
	},
	mounted() {
		var date = new Date();
		this.monthProgress = (date.getMonth()+1).toString()+'月末进度';
		this.monthOutput = (date.getMonth()+1).toString()+'月产值';
		var param = {
			keywords: this.projectName,
			minMonthly: '',
			maxMonthly: '',
			pageNum: 1,
			pageSize: 10,
			type: 1
		};
		this.getMonthOutputList(param);
		this.isExport = this.userinfo.memberid == '2361372308666271490' || this.userinfo.memberid == '-2214906182493845302' || this.userinfo.memberid == '-2357901482704941730' ? false : true;
	},
	created() {}
};
</script>

<style lang="scss">
.mounth-outputNew {
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
		// margin-top: 10px;
		// margin-bottom: 10px;
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
	.el-table th.gutter{
	    display: table-cell!important;
	}
}
</style>
<style scoped lang="scss">
	.datePicker{
		width: 350px;
	}
	.dateChoose{
		.is-right,.el-date-range-picker__header{
			display: none !important;
		}
	}
</style>
