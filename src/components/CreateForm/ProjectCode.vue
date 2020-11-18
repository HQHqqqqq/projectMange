<template>
	<div class="ProjectCode">
		<el-form ref="form" :model="form" label-width="170px">
			<el-form-item prop="code"><el-input v-model="form.code" style="width: 60%;" @blur="validateJyh(form.code)"></el-input></el-form-item>
		</el-form>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Bus from "../../bus";
export default {
	name: 'ProjectCode',
	props: ['widget', 'models', 'remote', 'datas'],
	data() {
		return {
			loading: true,
			form: {
				code: ''
			}
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
	methods: {
		remoteMethod(val) {
			debugger;
		},
		validateJyh(code){//校验关联交易号 
		    var reg = /^[A-Za-z0-9]{1,12}$/; 
		    if(!reg.test(code)){ 
		     this.$message.error("字符限制为最大12位，包含：数字、字母（支持大小写）"); 
			 this.form.code = '';
		    } 
		   },
	},
	created() {},
};
</script>

<style lang="scss">
.el-form--label-top .el-form-item__label {
	float: left;
}
.market-select {
}
</style>
