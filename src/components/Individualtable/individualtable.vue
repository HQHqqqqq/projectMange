<template>
	<el-col :span="20" class="projectview">
		<generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        
		</generate-form>
		<el-button type="primary" @click="handleSubmit">提交</el-button>
	</el-col>
    </template>
    <script>
			import GenerateForm from '@/components/CreateForm/GenerateForm'
			import '@/components/CreateForm/styles/FormCreate.css'
      export default({
        name: 'indivdualtable',
				components: {
				  GenerateForm
				},
        data(){
					return{
						jsonData: {"list":[{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"input","name":"单行文本","icon":"icon-input","isShow":"true","url":"","options":{"width":"100%","defaultValue":"","required":true,"dataType":"string","pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1556089126000_64703"},"key":"1556089126000_64703","model":"input_1556089126000_64703","rules":[{"type":"string","message":"单行文本格式不正确"},{"required":true,"message":"单行文本必须填写"}]}]},{"span":12,"list":[{"type":"select","name":"下拉选择框","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"","required":false,"showLabel":false,"width":"","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":false,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"func_1556089132000_46498"},"config":{"labelPosition":""},"key":"1556089132000_46498","model":"select_1556089132000_46498","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1556089124000_56334"},"key":"1556089124000_56334","model":"grid_1556089124000_56334","rules":[]}],"config":{"labelWidth":100,"labelPosition":"top","size":"small"}},
						editData: {},
						remoteFuncs: {
							func_1554774527000_80223(resolve){
								// setTimeout(() => {
                    const options = this.jsonA;
                    // 获取到的值和标签可以通过配置页远端配置
                    // 值:id  标签：name
                    resolve(options) // 将后端获取的数据放入回调函数中
                  // }, 2000)
							}
						}
					}
					
          
        },
				created(){
					this.axios.get('http://1.202.165.51:8989/plan/subordinates?staffCode=10307')
						.then(function (response) {
						// console.log(response);
						// console.log(response.data.data)
						var list = response.data.data;
						var list = JSON.stringify(list)
						var list = list.replace(/"staffName"/g,"value")
						let jsonA = eval ("(" + list + ")");
						return jsonA;
						// this.options = jsonA;
						// console.log(this.jsonA)
						})
						.catch(function (error) {
						// console.log(error);
						});
					
					
					
				},
        methods: {
					
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              // 数据校验成功
              // data 为获取的表单数据
							console.log(data)
            }).catch(e => {
              // 数据校验失败
            })
          }
        }
      })
    </script>
	<style scoped>
		@import '../../assets/css/common.css'
	</style>