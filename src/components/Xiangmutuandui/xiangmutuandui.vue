<template>
    <el-col :span="24" class="projectview">
      <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        
      </generate-form>

      <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
	
	
    </el-col>
    </template>
    <script>
		var select_array = [];
		var all_array = [];
		import Bus from "../../bus";
		import GenerateForm from '@/components/CreateForm/GenerateForm'
		import GenetateFormItem from '@/components/CreateForm/GenerateFormItem'
		import '@/components/CreateForm/styles/FormCreate.css'
		import {getData} from '../../api/api.js'
		import {getMenuList} from '../../api/api.js'
		import {submitOa} from '../../api/api.js'
		import {getPersonInfor} from '../../api/api.js'
		export default({
			name: 'CreateFrom_setname',
				components: {
				  GenerateForm,
				  GenetateFormItem
				},
        data(){
			return{
				jsonData:{
						"list": "",
						"config":{
							 "labelPosition": "left",
							 "labelWidth": 100,
							 "size":"small"
						},
					
				},
          editData: {},
          remoteFuncs: {
            

          }
		  }
        },
		mounted(){
			//获取项目团队页面
			var userinfo = JSON.parse(localStorage.getItem('userinfo'));
			var memberid = userinfo.memberid;
			var params = {
				memberId : memberid,
				menuId : 15
			}
			getMenuList('/template',params).then(res => {
					var projectCreat = res.data.data.list;
					this.jsonData.list =res.data.data.list;
					
			}).catch(err => {
				console.log(err)
			})
		},
        methods: {
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              // 数据校验成功
              // data 为获取的表单数据
			  console.log(data)

            }).catch(e => {
              // 数据校验失败
			  console.log(e)
            })
          }
        }
      })
    </script>
		<style scoped>
			.el-table--border td, .el-table--border th{
				border-right: none!important;
			}
		</style>
	<style>
		@import '../../assets/css/common.css'
	</style>