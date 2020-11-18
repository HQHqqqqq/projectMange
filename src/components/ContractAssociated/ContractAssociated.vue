<template>
	<el-col :span="24" class="projectview">
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">

		</generate-form>



	</el-col>
</template>
<script>
	var select_array = [];
	var all_array = [];
	import Bus from "../../bus";
	import GenerateForm from '@/components/CreateForm/GenerateForm'
	import GenetateFormItem from '@/components/CreateForm/GenerateFormItem'
	import '@/components/CreateForm/styles/FormCreate.css'
	import {
		getData
	} from '../../api/api.js'
	import {
		getMenuList
	} from '../../api/api.js'
	import {
		submitOa
	} from '../../api/api.js'
	import {
		getPersonInfor
	} from '../../api/api.js'
	export default ({
		name: 'CreateFrom_setname',
		components: {
			GenerateForm,
			GenetateFormItem
		},
		data() {
			return {
				// jsonData:{
				// 		"list": "",
				// 		"config":{
				// 			 "labelPosition": "left",
				// 			 "labelWidth": 100,
				// 			 "size":"small"
				// 		},
				// 	
				// },
				jsonData: {
					"list": [{
						"type": "contractassociated",
						"name": "合同关联",
						"icon": "icon-jilianxuanze",
						"options": {
							"defaultValue": [],
							"width": "",
							"placeholder": "",
							"disabled": false,
							"clearable": false,
							"remote": true,
							"remoteOptions": [],
							"url_a": "",
							"props": {
								"value": "value",
								"label": "label",
								"children": "children"
							},
							"remoteFunc": "func_1572579659000_46801"
						},
						"key": "1572579659000_46801",
						"model": "contractassociated_1572579659000_46801",
						"rules": []
					}],
					"config": {
						"labelWidth": 100,
						"labelPosition": "top",
						"size": "small"
					}
				},
				editData: {},
				remoteFuncs: {


				}
			}
		},
		mounted() {

		},
		methods: {
			handleSubmit() {
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
	.projectview {
		overflow-y: auto;
	}
	.aaa{
		color:#fff;
	}
	tr:hover .aaa{
		color: #f5f7fa;
	}
	.el-icon-arrow-right{
		display: none;
	}
</style>
<style>
	@import '../../assets/css/common.css'
</style>
