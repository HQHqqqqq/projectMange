<template>
  <el-col :span="20" class="projectview">
    <!--<div id="app">-->
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">

    </generate-form>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </el-col>
  <!--</div>-->
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
              "type": "projectrisk",
              "name": "项目风险组件",
              "icon": "icon-select",
              "isShow": "true",
              "url": "",
              "options": {
                "defaultValue": [],
                "disabled": false,
                "clearable": false,
                "required": true,
                "width": "",
                "remote": false,
                "filterable": false,
                "remoteOptions": [],
                "url_a": "",
                "url_b": "",
                "props": {"value": "value", "label": "label"},
                "remoteFunc": "func_1559101378000_25675"
              },
              "config": {"labelPosition": "left"},
              "key": "1559101378000_25675",
              "model": "projectrisk_1559101378000_25675",
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
