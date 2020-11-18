<template>
	<div class="mounth-output">
		<el-row :gutter="10" class="search" type="flex" justify="space-between">
			<el-col :xs="8" :sm="6" :md="8" :lg="7" :xl="7">
				<div class="wrap">
					<span class="labal">查看范围</span>
					<el-select v-model="firstSelectvalue" size="mini" placeholder="请选择" @change="changeSearch" class="search-select">
						<el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="SecondSelectvalue" size="mini" placeholder="请选择" @change="changeDep">
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
						<el-input v-model="projectName" size="mini" placeholder="项目名称/编号">
							<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
						</el-input>
						<el-button type="primary" size="mini" @click="search">查询</el-button>
						<el-button type="primary" size="mini">导出</el-button>
						<el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh" circle class="circle-btn"></el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-table
			:data="tableData"
			:max-height="asideHeight"
			border
			:header-cell-style="{ fontSize: '14px', color: '#303133', height: '51px', padding: 0, backgroundColor: '#ccd1d5' }"
			:row-style="{ height: '50px' }"
			@header-dragend="headerDragend"
			:cell-style="{ padding: 0 }"
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
					<span>{{ projectStatusConfig[scope.row.projectStatus] }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="associatedStates" label="关联状态">
				<template slot-scope="scope">
					<span>{{ associatedStatesConfig[scope.row.associatedStates] }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="funding" align="center" label="纯合同额/经费" :width="130"></el-table-column>
			<el-table-column prop="atTheBegin" align="center" label="月初进度">
				<template slot-scope="scope">
					{{ scope.row.atTheBegin | formatIsNull }}
				</template>
			</el-table-column>
			<el-table-column prop="atTheEndOfProgress" align="center" label="月末进度">
				<template slot-scope="scope">
					{{ scope.row.saleDepartmentB | formatIsNull }}
				</template>
			</el-table-column>
			<el-table-column prop="thisMonthOutputValue" align="center" label="本月产值">
				<template slot-scope="scope">
					{{ scope.row.saleDepartmentB | formatIsNull }}
				</template>
			</el-table-column>
			<el-table-column prop="residualValue" align="center" label="剩余产值"></el-table-column>
			<el-table-column align="center" label="合同编号" :width="200">
				<template slot-scope="scope">
					<el-tag type="info" size="mini" v-for="(arr, index) in scope.row.contractNumbers" :key="index">{{ arr }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="saleDepartmentB" align="center" label="销售B级单位" :width="130">
				<template slot-scope="scope">
					{{ scope.row.saleDepartmentB | formatIsNull }}
				</template>
			</el-table-column>
			<el-table-column prop="saleDepartmentC" align="center" label="销售C级单位" :width="130">
				<template slot-scope="scope">
					{{ scope.row.saleDepartmentC | formatIsNull }}
				</template>
			</el-table-column>
			<el-table-column prop="desc" align="center" label="备注">
				<template slot-scope="scope">
					{{ scope.row.desc | formatIsNull }}
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
			<el-table-column prop="area" label="区域（省）" align="center">
				<template slot-scope="scope">
					{{ scope.row.area | formatIsNull }}
				</template>
			</el-table-column>
			<el-table-column prop="address" label="区域（市）" align="center">
				<template slot-scope="scope">
					{{ scope.row.address | formatIsNull }}
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			class="page"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[20]"
			:page-size="100"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>
	</div>
</template>

<script>
import { getMonthOutput, getdeptByType } from '../../api/api.js';
export default {
	name: 'MounthOutput',
	props: ['widget', 'models', 'rules', 'remote', 'datas'],
	data() {
		return {
			firstSelectvalue: '',
			SecondSelectvalue: '',
			//总条数
			total: 0,
			pageNum: 1,
			pageSize: 20,
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
				{
					value: 'SB',
					label: '销售B级单位'
				},
				{
					value: 'SC',
					label: '销售C级单位'
				}
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
			// pickerOptions1: {
			// 	disabledDate(time) {
			// 		let date1 = new Date();
			// 		let year = date1.getFullYear();
			// 		let start = new Date(year - 1, 11, 31).getTime();
			// 		let end = new Date(year, 11, 31).getTime();
			// 		return time.getTime() <= start || time.getTime() >= end;
			// 	}
			// },
			value1: ''
		};
	},
	filters: {
		formatIsNull: function(value) {
			if (value == null || value == '') {
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
		asideHeight: function() {
			return document.documentElement.clientHeight - 205;
		}
	},
	methods: {
		pickDateChange(val) {
			this.minMonthly = val[0];
			this.maxMonthly = val[1];
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
			//获取项目列表信息
			getMonthOutput(`/sgpm/rest/api/server/project/monthly/output`, val)
				.then(res => {
					if (res.status == 200) {
						let result = res.data.data;

						result.forEach((ele, index) => {
							if (ele.contractNumbers.indexOf(';') > -1) {
								ele.contractNumbers = ele.contractNumbers.split(';');
							} else if (ele.contractNumbers.indexOf(';') == -1 && ele.contractNumbers != '') {
								var ary = [];
								ary.push(ele.contractNumbers);
								ele.contractNumbers = ary;
							} else {
								ele.contractNumbers = [];
							}
						});
						this.tableData = result;
						let meta = res.data.meta;
						this.total = meta.totalCount;
					}
				})
				.catch(err => {
					console.log(err);
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
		var param = {
			keywords: this.projectName,
			minMonthly: '',
			maxMonthly: '',
			pageNum: 1,
			pageSize: 10,
			type: 1
		};
		this.getMonthOutputList(param);
	},
	created() {}
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
<style scoped lang="scss">
	.datePicker{
		width: 350px;
	}
	.dateChoose{
		.is-right,.el-date-range-picker__header{
			display: none !important;
		}
	}
	// .el-picker-panel__content .el-date-range-picker__content {
	// 	display: none!important;
	// }
</style>
