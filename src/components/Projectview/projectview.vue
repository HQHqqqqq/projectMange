<template>
    <el-col :span="20" class="projectview">
      <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        
      </generate-form>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-col>
    </template>
    <script>
		import axios from 'axios'
		import GenerateForm from '@/components/CreateForm/GenerateForm'
		import '@/components/CreateForm/styles/FormCreate.css'
		import {getData} from '../../api/api.js'
		export default({
			name: 'CreateFrom_setname',
				components: {
				  GenerateForm
				},
        data(){
			return{
          jsonData: {"list":[{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":24,"list":[{"type":"row","name":"","icon":"icon-row","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"项目立项登记表","disabled":false,"remoteFunc":"func_1555331685000_33135"},"key":"1555331685000_33135","model":"row_1555331685000_33135","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555331674000_34871"},"key":"1555331674000_34871","model":"grid_1555331674000_34871","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":3,"list":[{"type":"row","name":"自定义文字","icon":"icon-row","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"项目基本信息","disabled":false,"remoteFunc":"func_1555331897000_59656"},"key":"1555331897000_59656","model":"row_1555331897000_59656","rules":[]}]},{"span":6,"list":[{"type":"checkboxSingle","name":"复选框","icon":"icon-check-box","isShow":"false","url":"","options":{"defaultValue":"","width":"","remoteFunc":"func_1555331740000_71866"},"props":{"value":"value","label":"label"},"remoteFunc":"","key":"1555331740000_71866","model":"subproject","rules":[]}]},{"span":15,"list":[]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555331720000_49524"},"key":"1555331720000_49524","model":"grid_1555331720000_49524","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":24,"list":[{"type":"divider","name":"分割线","icon":"icon-divider","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1555332079000_4281"},"key":"1555332079000_4281","model":"divider_1555332079000_4281","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555332073000_12404"},"key":"1555332073000_12404","model":"grid_1555332073000_12404","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"select","name":"主项目名称","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":false,"showLabel":false,"width":"77%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"parentproject"},"config":{"labelPosition":""},"key":"1555332105000_35875","model":"parentproject","rules":[]}]},{"span":12,"list":[]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555332082000_64752"},"key":"1555332082000_64752","model":"grid_1555332082000_64752","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"input","name":"项目名称","icon":"icon-input","isShow":"true","url":"","options":{"width":"77%","defaultValue":"","required":true,"dataType":"string","pattern":"","placeholder":"请输入内容","disabled":false,"remoteFunc":"func_1555332175000_315"},"key":"1555332175000_315","model":"projectname","rules":[{"type":"string","message":"项目名称格式不正确"},{"required":true,"message":"项目名称必须填写"}]}]},{"span":12,"list":[{"type":"input","name":"项目编号","icon":"icon-input","isShow":"true","url":"","options":{"width":"77%","defaultValue":"","required":true,"dataType":"string","pattern":"","placeholder":"请输入内容","disabled":true,"remoteFunc":"func_1555332176000_27169"},"key":"1555332176000_27169","model":"projectnumber","rules":[{"type":"string","message":"项目编号格式不正确"},{"required":true,"message":"项目编号必须填写"}]}]}],"options":{"gutter":5,"justify":"start","align":"top","remoteFunc":"func_1555332164000_12331"},"key":"1555332164000_12331","model":"grid_1555332164000_12331","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"select","name":"实施部门","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"77%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"impldepartment"},"config":{"labelPosition":""},"key":"1555332316000_69984","model":"impldepartment","rules":[{"required":true,"message":"项目名称必须填写"}]}]},{"span":6,"list":[{"type":"select","name":"项目经理","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"53%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"projectmanager"},"config":{"labelPosition":""},"key":"1555332451000_27659","model":"projectmanager","rules":[{"required":true,"message":"项目经理必须填写"}]}]},{"span":6,"list":[{"type":"input","name":"项目运维期","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":true,"dataType":"string","pattern":"","placeholder":"请输入内容","disabled":false,"remoteFunc":"func_1555332320000_76710"},"key":"1555332320000_76710","model":"operationalperiod","rules":[{"type":"string","message":"项目运维期格式不正确"},{"required":true,"message":"项目经理必须填写"}]}]}],"options":{"gutter":5,"justify":"start","align":"top","remoteFunc":"func_1555332275000_73740"},"key":"1555332275000_73740","model":"grid_1555332275000_73740","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":6,"list":[{"type":"select","name":"项目类别","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"53%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"projectcategory"},"config":{"labelPosition":""},"key":"1555332603000_66925","model":"projectcategory","rules":[{"required":true,"message":"项目类别必须填写"}]}]},{"span":6,"list":[{"type":"select","name":"项目类型","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"53%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"projecttype"},"config":{"labelPosition":""},"key":"1555332605000_42826","model":"projecttype","rules":[{"required":true,"message":"项目类型必须填写"}]}]},{"span":6,"list":[{"type":"select","name":"业务类型","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"53%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"businesstype"},"config":{"labelPosition":""},"key":"1555332608000_32058","model":"businesstype","rules":[{"type":"string","message":"项目监管级别格式不正确"},{"required":true,"message":"业务类型必须填写"}]}]},{"span":6,"list":[]}],"options":{"gutter":5,"justify":"start","align":"top","remoteFunc":"func_1555332571000_63293"},"key":"1555332571000_63293","model":"grid_1555332571000_63293","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":6,"list":[{"type":"select","name":"项目监管级别","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"53%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"supervisorylevel"},"config":{"labelPosition":""},"key":"1555376684000_98278","model":"supervisorylevel","rules":[{"required":true,"message":"项目编号必须填写"}]}]},{"span":6,"list":[{"type":"select","name":"项目级别","icon":"icon-select","isShow":"true","url":"","options":{"defaultValue":"","multiple":false,"disabled":false,"clearable":false,"placeholder":"请选择","required":true,"showLabel":false,"width":"53%","options":[{"value":"下拉框1"},{"value":"下拉框2"},{"value":"下拉框3"}],"remote":true,"filterable":false,"remoteOptions":[],"props":{"value":"value","label":"label"},"remoteFunc":"projectlevel"},"config":{"labelPosition":""},"key":"1555376497000_57970","model":"projectlevel","rules":[{"required":true,"message":"项目级别必须填写"}]}]},{"span":6,"list":[{"type":"date","name":"项目预计开始时间","icon":"icon-date","isShow":"true","options":{"defaultValue":"","readonly":false,"disabled":false,"editable":true,"clearable":true,"placeholder":"请选择日期","startPlaceholder":"","endPlaceholder":"","type":"date","format":"yyyy-MM-dd","timestamp":false,"required":false,"width":"53%","remoteFunc":"func_1555376816000_38737"},"key":"1555376816000_38737","model":"prostartdate","rules":[]}]},{"span":6,"list":[{"type":"date","name":"项目预计结束时间","icon":"icon-date","isShow":"true","options":{"defaultValue":"","readonly":false,"disabled":false,"editable":true,"clearable":true,"placeholder":"请选择日期","startPlaceholder":"","endPlaceholder":"","type":"date","format":"yyyy-MM-dd","timestamp":false,"required":false,"width":"53%","remoteFunc":"func_1555377083000_9763"},"key":"1555377083000_9763","model":"proenddate","rules":[]}]}],"options":{"gutter":5,"justify":"start","align":"top","remoteFunc":"func_1555332942000_21880"},"key":"1555332942000_21880","model":"grid_1555332942000_21880","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":18,"list":[{"type":"input","name":"项目关键字","icon":"icon-input","isShow":"true","url":"","options":{"width":"85%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"请输入内容","disabled":false,"remoteFunc":"func_1555377183000_8816"},"key":"1555377183000_8816","model":"keyword","rules":[{"type":"string","message":"单行文本格式不正确"}]},{"type":"input","name":"配置库地址","icon":"icon-input","isShow":"true","url":"","options":{"width":"85%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"http://","disabled":false,"remoteFunc":"func_1555377232000_15677"},"key":"1555377232000_15677","model":"repositoryaddress","rules":[]}]},{"span":6,"list":[]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555377164000_60758"},"key":"1555377164000_60758","model":"grid_1555377164000_60758","rules":[{"type":"string","message":"项目监管级别格式不正确"}]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":6,"list":[{"type":"row","name":"","icon":"icon-row","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"项目合同信息","disabled":false,"remoteFunc":"func_1555377348000_72312"},"key":"1555377348000_72312","model":"row_1555377348000_72312","rules":[]}]},{"span":12,"list":[]},{"span":3,"list":[]},{"span":3,"list":[{"type":"button","name":"按钮","icon":"icon-diy-com-textarea","isShow":"false","url":"","options":{"width":"","defaultValue":"","required":false,"pattern":"","placeholder":"关联合同","remoteFunc":"func_1555377393000_76053"},"key":"1555377393000_76053","model":"contract","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555377321000_88744"},"key":"1555377321000_88744","model":"grid_1555377321000_88744","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":24,"list":[{"type":"divider","name":"分割线","icon":"icon-divider","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1555377431000_66947"},"key":"1555377431000_66947","model":"divider_1555377431000_66947","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555377419000_10448"},"key":"1555377419000_10448","model":"grid_1555377419000_10448","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"input","name":"合同编号","icon":"icon-input","isShow":"true","url":"","options":{"width":"77%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377464000_86195"},"key":"1555377464000_86195","model":"contractnumber","rules":[{"type":"string","message":"项目编号格式不正确"}]}]},{"span":12,"list":[]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555377457000_10674"},"key":"1555377457000_10674","model":"grid_1555377457000_10674","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":6,"list":[{"type":"input","name":"所属客户中心","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377693000_29441"},"key":"1555377693000_29441","model":"customercenter","rules":[{"type":"string","message":"单行文本格式不正确"}]},{"type":"input","name":"行业","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377865000_2394"},"key":"1555377865000_2394","model":"industry","rules":[{"type":"string","message":"行业格式不正确"}]}]},{"span":6,"list":[{"type":"input","name":"所属销售","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377699000_92533"},"key":"1555377699000_92533","model":"contractmarket","rules":[{"type":"string","message":"单行文本格式不正确"}]},{"type":"input","name":"区域","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377867000_51075"},"key":"1555377867000_51075","model":"region","rules":[]}]},{"span":6,"list":[{"type":"input","name":"合同金额","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377701000_24017"},"key":"1555377701000_24017","model":"contractmoney","rules":[]},{"type":"input","name":"合同预计开始时间","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377870000_97083"},"key":"1555377870000_97083","model":"contractstartdate","rules":[]}]},{"span":6,"list":[{"type":"input","name":"合同签订时间","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377703000_64533"},"key":"1555377703000_64533","model":"contractsigningdate","rules":[]},{"type":"input","name":"合同预计结束时间","icon":"icon-input","isShow":"true","url":"","options":{"width":"53%","defaultValue":"","required":false,"dataType":"string","pattern":"","placeholder":"","disabled":true,"remoteFunc":"func_1555377872000_25736"},"key":"1555377872000_25736","model":"contractenddate","rules":[{"type":"string","message":"合同预计结束时间格式不正确"}]}]}],"options":{"gutter":5,"justify":"start","align":"top","remoteFunc":"func_1555377665000_4717"},"key":"1555377665000_4717","model":"grid_1555377665000_4717","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":12,"list":[{"type":"row","name":"自定义文字","icon":"icon-row","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"项目简介","disabled":false,"remoteFunc":"func_1555378126000_55900"},"key":"1555378126000_55900","model":"row_1555378126000_55900","rules":[]}]},{"span":12,"list":[]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555378121000_9928"},"key":"1555378121000_9928","model":"grid_1555378121000_9928","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":24,"list":[{"type":"divider","name":"分割线","icon":"icon-divider","isShow":"false","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"","disabled":false,"remoteFunc":"func_1555378143000_45149"},"key":"1555378143000_45149","model":"divider_1555378143000_45149","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555378135000_62210"},"key":"1555378135000_62210","model":"grid_1555378135000_62210","rules":[]},{"type":"grid","name":"栅格布局","icon":"icon-grid-","columns":[{"span":24,"list":[{"type":"textarea","name":"建设目标","icon":"icon-diy-com-textarea","isShow":"true","url":"","options":{"width":"80%","defaultValue":"","pattern":"","placeholder":"请输入建设目标","url":"","remoteFunc":"func_1555378182000_90972","required":true},"key":"1555378182000_90972","model":"constructiongoals","rules":[{"required":true,"message":"建设目标必须填写"}]},{"type":"textarea","name":"建设内容","icon":"icon-diy-com-textarea","isShow":"true","url":"","options":{"width":"80%","defaultValue":"","pattern":"","placeholder":"请输入建设内容","url":"","remoteFunc":"func_1555378229000_25260","required":true},"key":"1555378229000_25260","model":"constructioncontent","rules":[{"required":true,"message":"建设内容必须填写"}]},{"type":"textarea","name":"使用的关键技术","icon":"icon-diy-com-textarea","isShow":"true","url":"","options":{"width":"80%","defaultValue":"","pattern":"","placeholder":"请输入使用的关键技术","url":"","remoteFunc":"func_1555378329000_17603"},"key":"1555378329000_17603","model":"keytechnology","rules":[]},{"type":"textarea","name":"预期项目成果","icon":"icon-diy-com-textarea","isShow":"true","url":"","options":{"width":"80%","defaultValue":"","pattern":"","placeholder":"请输入预期项目成果","url":"","remoteFunc":"func_1555378381000_54153","required":false},"key":"1555378381000_54153","model":"projectresult","rules":[]},{"type":"textarea","name":"合同约定交付物","icon":"icon-diy-com-textarea","isShow":"true","url":"","options":{"width":"80%","defaultValue":"","pattern":"","placeholder":"请输入合同约定交付物","url":"","remoteFunc":"func_1555378454000_75394"},"key":"1555378454000_75394","model":"contractagreeddelivery","rules":[]}]}],"options":{"gutter":0,"justify":"start","align":"top","remoteFunc":"func_1555378145000_30158"},"key":"1555378145000_30158","model":"grid_1555378145000_30158","rules":[]}],"config":{"labelWidth":100,"labelPosition":"left","size":"small"}},
          editData: {},
          remoteFuncs: {
            
            parentproject (resolve) {
              // 主项目名称 parentproject
              // 获取到远端数据后执行回调函数
              // resolve(data)
            },
    
            impldepartment (resolve) {
              // 实施部门 impldepartment
              // 获取到远端数据后执行回调函数
              // resolve(data)
            },
    
            projectmanager (resolve) {
              // 项目经理 projectmanager
              // 获取到远端数据后执行回调函数
              // resolve(data)
            },
    
            projectcategory (resolve) {
				// 项目类别 projectcategory
				// 获取到远端数据后执行回调函数
				// resolve(data)
				getData('/category').then(res => {
					// console.log(res)
					const projectcategory = res.data.data;
					resolve(projectcategory)
				}).catch(err => {
					console.log(err)
				})

            },
    
            projecttype (resolve) {
				// 项目类型 projecttype
				// 获取到远端数据后执行回调函数
				// resolve(data)
				getData('/projecttype').then(res => {
					// console.log(res)
					const projecttype = res.data.data;
					resolve(projecttype)
				}).catch(err => {
					console.log(err)
				})

            },
    
            businesstype (resolve) {
				// 业务类型 businesstype
				// 获取到远端数据后执行回调函数
				// resolve(data)
				getData('/businesstype').then(res => {
					// console.log(res)
					const businesstype = res.data.data;
					resolve(businesstype)
				}).catch(err => {
					console.log(err)
				})
            },
			
            projectlevel (resolve) {
				// 项目级别 projectlevel
				// 获取到远端数据后执行回调函数
				// resolve(data)
				getData('/projectLevel').then(res => {
					// console.log(res)
					const projectLevel = res.data.data;
					resolve(projectLevel)
				}).catch(err => {
					console.log(err)
				})
            },
			supervisorylevel (resolve) {
				// 项目监管级别 supervisorylevel
				// 获取到远端数据后执行回调函数
				// resolve(data)
				getData('/supervisorylevel').then(res => {
					// console.log(res)
					const supervisorylevel = res.data.data;
					resolve(supervisorylevel)
				}).catch(err => {
					console.log(err)
				})
            },
          },
		  values:{
			  
		  }
		  }
        },
        methods: {
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              // 数据校验成功
              // data 为获取的表单数据
			  
            }).catch(e => {
              // 数据校验失败
            })
          }
        }
      })
    </script>
	<style>
		.grid-content{
			text-align: left;
			height: auto;
			border:none;
			width: auto;
		}
		.el-form-item__content{
			margin-left: 0!important;
		}
	</style>
	<style scoped>
		/* .el-form-item__content{
			margin-left: 0!important;
		} */
		.el-form-item__label{
			width: 116px!important;
			padding: 0;
		}
		.grid-content{
			height: auto;
			border:none;
			width: auto;
			text-align: left;
		}
		.projectview{
			margin-top: 61px;
			margin-left: 200px;
			z-index: 10;
			padding-left: 20px;
		}
		.el-col-24:first-child .grid-content:first-child{
			font-size: 28px;
		}
	</style>
