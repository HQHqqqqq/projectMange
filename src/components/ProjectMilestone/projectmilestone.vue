<template>
	<el-col :span="24" class="projectview">
  <!-- <div id="app"> -->
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">

    </generate-form>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  <!-- </div> -->
	</el-col>
</template>
<script>
  import GenerateForm from '@/components/CreateForm/GenerateForm'

  export default ({
    name: 'CreateFrom_setname',
    components: {
      GenerateForm
    },
    data() {
      return {
        jsonData: {
          "list": [
            {
              "type": "milestone",
              "icon": "icon-select",
              "isShow": "true",
              "url": "",
              "options": {
                "defaultValue": [],
                "switch":{isFinished:true,delayDays:true,workHours:true,head:false,sonSelect:false,time1:true,time2:true,time3:true},  //配置显示开关  false 不显示
                "moduleName":"milestone", //区分组件使用的场景
                "disabled": false,
                "clearable": false,
                "required": false,
                "width": "",
                "remote": false,
                "filterable": false,
                "remoteOptions": [],
                "props": {"value": "value", "label": "label"},
                "remoteFunc": "func_1558593015000_28108"
              },
              "config": {"labelPosition": "left"},
              "key": "1558593015000_28108",
              "model": "milestone_1558593015000_28108",
              "rules": []
            }], "config": {"labelWidth": 100, "labelPosition": "top", "size": "small"}
        },
        editData: {},
        remoteFuncs: {}
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.generateForm.getData().then(data => {
          console.log('获取的表单数据');
          console.log(data);
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
	@import '../../assets/css/common.css';
</style>
