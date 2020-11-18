<template>
	<div class="abnormal">
		<el-form :model="form" :rules="rules" ref="form"  label-width="170px">
			<el-form-item :label="this.datas.options.inputOne" prop="returnNote">
				<el-input v-model="form.returnNote" style="width: 50%;float: left;" @change="receivableChange"></el-input>
				<el-upload
				id="scfj"
				 action
				  class="upload-demo"
				  name="回款说明"
				  :headers="httpHeaders"
				  :http-request = "customUpload"
				  :on-change="handleChange"
				  :on-remove="(file,fileList1) => {return handleRemove(file,fileList1,datas.options.inputOne)}"
				  :before-remove="beforeRemove"
				  :on-exceed="handleExceed"
				  multiple
				  :limit="1"
				  :file-list="fileList1">
				  <el-link type="primary" @click="submitFile(datas.options.inputOne)" :disabled="show">上传附件</el-link>
				</el-upload>
				 <a class="attachment" v-show="returnshow"><i class="el-icon-document"></i>{{returnNoteFileName}}</a>
				 <i type="text" @click="open(datas.options.inputOne)" class="el-icon-close" v-show="returnIsShow"></i>
			</el-form-item>
			<el-form-item :label="this.datas.options.inputTwo" style="margin-top: 20px;" prop="payNote">
				<el-input v-model="form.payNote" style="width: 50%;float: left;" @change="receivableChange"></el-input>
				<el-upload
				 action
				  class="upload-demo"
				  name="支付说明"
				  multiple
				  :limit="1"
				  :headers="httpHeaders"
				  :http-request = "customUpload"
				  :on-change="handleChange"
				  :on-remove="(file,fileList) => {return handleRemove(file,fileList,datas.options.inputTwo)}"
				  :before-remove="beforeRemove"
				  :on-exceed="handleExceed"
				  :file-list="fileList">
				  <el-link type="primary" @click="submitFile(datas.options.inputTwo)" :disabled="show">上传附件</el-link>
				</el-upload>
				<a class="attachment" v-show="payshow"><i class="el-icon-document"></i>{{payNoteFileName}}</a>
				<i type="text" @click="open(datas.options.inputTwo)" class="el-icon-close" v-show="payIsShow"></i>
			</el-form-item>
			<el-form-item label="异常结项原因" style="margin-top: 20px;" class="is-required" prop="exCloseReason">
				<el-input type="textarea" v-model="form.exCloseReason" style="width: 75%;height: 100px;font-size: 12px;" @change="receivableChange" :placeholder="closeReason"></el-input>
			</el-form-item>
			<el-form-item label="归档情况" style="margin-top: 20px;" class="is-required" prop="fileSituation">
				<el-input type="textarea" v-model="form.fileSituation" style="width: 75%;height: 100px;font-size: 12px;" @change="receivableChange" :placeholder="fileCase"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {mapState,mapActions} from "vuex";
	import Bus from "../../bus";
	import {postProjectSubmit} from "../../api/api.js";
	export default {
		name: "abnormal",
		props: ["widget", "models", "remote", "datas"],
		computed: {
			...mapState([
				"userinfo" //oa跳转过来的用户信息值
			])
		},
		data() {
			return {
				accessoryName:'',
				show: this.$route.query.judgelogo == 'c' ? false : true,
				returnshow: false,
				payshow: false,
				payIsShow: false,
				returnIsShow: false,
				isShow: this.$route.query.isShow == true ? false : true, //默认显示
				httpHeaders:{ 'Content-Type': 'multipart/form-data' },
				projectId: this.$route.query.id,
				loading: true,
				fileList:[],
				fileList1:[],
				file:{},
				closeReason:'①项目登记后，最终承揽失败。\n②合同因甲方机构调整，不再履约，合同终止。已走合同解除流程。\n③因甲方不组织验收，项目实施工作已完成，与甲方协商一致，不再投入实施并且不再回款和支付。',
				fileCase:'合同解除审批表，已归档档案管理部；\n系统开发代码，已归档至配置库；\n关键文档成果，已归档项目管理系统。',
				form: {
					fileSituation: '',
					exCloseReason:'',
					payNote:'',
					returnNote:''
				},
				returnNoteFile:'',
				payNoteFile:'',
				returnNoteFileName:'',
				payNoteFileName:'',
				rules: {
					// returnNote:[{
					// 	required: true,
					// 	message: '回款说明不能为空',
					// 	trigger: 'blur'
					// }],
					// payNote:[{
					// 	required: true,
					// 	message: '支付说明不能为空',
					// 	trigger: 'blur'
					// }],
					exCloseReason: [{
						required: true,
						message: '异常结项原因不能为空',
						trigger: 'blur'
					}],
					fileSituation: [{
						required: true,
						message: '归档情况不能为空',
						trigger: 'blur'
					}]
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
		mounted() {
			setTimeout(() => {
				let item = JSON.parse(localStorage.getItem('abnormalFrom'));
				if(item){
					this.form.returnNote = item.returnNote;
					this.form.payNote = item.payNote;
					this.form.exCloseReason = item.exCloseReason;
					this.form.fileSituation = item.fileSituation;
					this.returnNoteFile = item.returnNoteEnclosure;
					this.payNoteFile = item.payNoteEnclosure;
					this.returnNoteFileName = item.returnNoteFileName;
					this.payNoteFileName = item.payNoteFileName;
					localStorage.setItem('returnNote',this.form.returnNote);
					localStorage.setItem('payNote',this.form.payNote);
					localStorage.setItem('exCloseReason',this.form.exCloseReason);
					localStorage.setItem('fileSituation',this.form.fileSituation);
					localStorage.setItem('returnNoteFile',this.returnNoteFile);
					localStorage.setItem('payNoteFile',this.payNoteFile);
					
					if(item.returnNoteFileName && this.$route.query.judgelogo == 'c'){
						this.returnshow = true;
						this.returnIsShow = true;
						this.disabled = true;
					}
					if(item.payNoteFileName && this.$route.query.judgelogo == 'c'){
						this.payIsShow = true;
						this.payshow = true;
						this.disabled = true;
					}
					if(item.returnNoteFileName && this.$route.query.judgelogo == 'd'){
						this.returnshow = true;
						this.returnIsShow = false;
						this.disabled = true;
					}
					if(item.payNoteFileName && this.$route.query.judgelogo == 'd'){
						this.payshow = true;
						this.payIsShow = false;
						this.disabled = true;
					}
					
				}		
			},500)
		},
		methods: {
			getConfrim(name){
				this.$confirm('上传新文件将会覆盖旧文件, 是否继续?', '提示', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				    type: 'warning'
				}).then(() => {
					//确定
					this.disabled = false;
				    this.checkfile(name);
				}).catch(() => {
					//取消
					this.disabled = true;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//重新上传附件
			submitFile(name){
				console.log(name)
				this.accessoryName = name
				if(name == '回款说明'){
					if(this.returnNoteFile){
						this.getConfrim(name);
						return;
					}else{
						this.disabled = false;
					}
				}else if(name == '支付说明'){
					if(this.payNoteFile){
						this.getConfrim(name);
						return;
					}else{
						this.disabled = false;
					}
				}
			},
			//删除附件
			open(name) {
			    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
			    }).then(() => {
					this.disabled = false;
					this.checkfile(name);
			        this.$message({
			            type: 'success',
			            message: '删除成功!'
			        });
			    }).catch(() => {
					this.disabled = true;
			        this.$message({
						type: 'info',
			            message: '已取消删除'
			        });          
			    });
			},
			//选择文件
			handleChange(file,fileList){
				console.log(file)
				this.file = file.raw;
			},
			//回款、支付、异常结项原因、归档情况
			receivableChange(){
				console.log(this.form.returnNote)
				localStorage.setItem('returnNote',this.form.returnNote);
				localStorage.setItem('payNote',this.form.payNote);
				localStorage.setItem('exCloseReason',this.form.exCloseReason);
				localStorage.setItem('fileSituation',this.form.fileSituation);
				// Bus.$emit("returnNote", this.form.returnNote);
				// Bus.$emit("payNote", this.form.payNote);
				// Bus.$emit("exCloseReason", this.form.exCloseReason);
				// Bus.$emit("fileSituation", this.form.fileSituation);
			},
			//上传附件
			customUpload(file){
				console.log(file)
				var filename = (file.filename=="回款说明") ? 1 : 2
				this.filename = filename;
				var url = '/sgpm/rest/api/integration/oa/file/upload';
				let param = new FormData();
				param.append("file", this.file);
				param.append("projectId",this.projectId);
				param.append("username", this.userinfo.login_name);
				param.append("type", this.filename);
				postProjectSubmit(url, param).then(res => {
					console.log(res)
					if(res.data.code == 200){
						this.$message({
						    message: '上传成功!',
						    type: 'success'
						});
						if(this.filename == 1){
							// Bus.$emit('returnNoteFile',res.data.data);
							localStorage.setItem('returnNoteFile',res.data.data);
						}else{
							// Bus.$emit('payNoteFile',res.data.data);
							localStorage.setItem('payNoteFile',res.data.data);
						}
					}else if(res.data.code == 204){
						this.$message.warning('您上传的是空文件，请重新上传');
						if(file.filename=='支付说明'){
						  this.fileList = []
						}else{
						this.fileList1 = []
						}
						
					}else{
						this.$message.error('上传失败!');
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//删除附件
			handleRemove(file,fileList,name) {
			    console.log(name);
				this.disabled = false;
				this.checkfile(name);
			},
			checkfile(name){
				if(name == '回款说明'){
					this.returnNoteFile = '';
					localStorage.setItem('returnNoteFile','');
					this.returnshow = false;
					this.returnIsShow = false;
				}else if(name == '支付说明'){
					this.payNoteFile = '';
					localStorage.setItem('payNoteFile','');
					this.payshow = false;
					this.payIsShow = false;
				}
			},
			handlePreview(file) {
			    console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制只能选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
			    return this.$confirm(`确定移除 ${ file.name }？`);
			}
		},
		created() {}
	};
</script>

<style lang="scss" scoped>
	// div {
	// 	color: #f56c6c;
	// 	font-size: 12px;
	// 	line-height: 1;
	// 	padding-top: 4px;
	// }
	.el-icon-document{
		margin-right: 7px;
		color: #909399;
	}
	.upload-demo{
		display: inline-block;
		width: auto;
		padding-left: 10px;
	}
	.attachment{
		cursor: pointer;
		color: #606266;
		display: inline-block;
		// padding-top: 7px;
		font-size: 13.6px;
	}
	.el-icon-close{
		display: inline-block;
		cursor: pointer;
		opacity: .75;
		color: #606266;
	}
</style>
<style lang="scss">
	.abnormal{
		.el-textarea__inner{
			min-height: 100%!important;
		}
		.el-textarea__inner::-webkit-input-placeholder{
			font-style: italic;
		}
		ul.el-upload-list{
			display: inline-block;
			padding-left: 5px;
			padding-top: 1px;
		}
		.upload-demo{
			display: inline-block;
			padding-top: 5px;
			padding-left: 5px;
		}
		.el-upload{
			float: left;
			// padding-top: 7px;
		}
		.el-upload-list__item{
			margin-top: 0;
			line-height: none;
		}
	}
</style>
