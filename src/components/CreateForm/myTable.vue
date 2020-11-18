<template>
	<el-table :data="tableData" style="width: 100%;" height="250">
		<template slot="empty">
	   暂无数据
    </template>
		<el-table-column type="index" width="100" label="序号">
    	</el-table-column>
		<el-table-column prop="PROJECTNAME" label="子项目名称">
		</el-table-column>
		<el-table-column prop="PROJECTNUMBER" label="子项目编号">
		</el-table-column>
	</el-table>
</template>

<script>
	import Bus from "../../bus";
	export default {
		name: "myTable",
		props: ["widget", "models", "rules", "remote", "datas"],
		components: {
		},
		data() {
			return {
				tableData: []
			};
		},
		created(){
			Bus.$on("projectData", item => {
			  if (item) {
				this.tableData = item.child_projects;
			  }
			});
		},
		methods: {

		}
	}
</script>

<style>

</style>