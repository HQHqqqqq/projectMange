function findRemoteFunc(list, funcList, tokenFuncList, blankList) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === 'grid') {
      list[i].columns.forEach(item => {
        findRemoteFunc(item.list, funcList, tokenFuncList, blankList)
      })
    } else {
      if (list[i].type === 'blank') {
        if (list[i].model) {
          blankList.push({
            name: list[i].model,
            label: list[i].name
          })
        }
      } else if (list[i].type === 'imgupload') {
        if (list[i].options.tokenFunc) {
          tokenFuncList.push({
            func: list[i].options.tokenFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      } else {
        if (list[i].options.remote && list[i].options.remoteFunc) {
          funcList.push({
            func: list[i].options.remoteFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      }
    }
  }
}

export default function(data) {
  const funcList = []

  const tokenFuncList = []

  const blankList = []

  findRemoteFunc(JSON.parse(data).list, funcList, tokenFuncList, blankList)

  let funcTemplate = ''

  let blankTemplate = ''

  for (let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              // ${funcList[i].label} ${funcList[i].model}
              // 获取到远端数据后执行回调函数
              // resolve(data)
              getCodeList('${funcList[i].label}').then(response => { resolve(response.data) })
            },
    `
  }

  for (let i = 0; i < tokenFuncList.length; i++) {
    funcTemplate += `
            ${tokenFuncList[i].func} (resolve) {
              // ${tokenFuncList[i].label} ${tokenFuncList[i].model}
              // 获取到token数据后执行回调函数
              // resolve(token)
            },
    `
  }

  for (let i = 0; i < blankList.length; i++) {
    blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label} -->
          <!-- 通过 v-model="scope.model.${blankList[i].name}" 绑定数据 -->
        </template>
    `
  }

  return `<template>
  <div>
    <app-container>
      <generate-form ref="generateForm" :data="jsonData" :remote="remoteFuncs" :value="editData" >
        ${blankTemplate}
      </generate-form>
      <div class="generate-block">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button type="primary">重置</el-button>
      </div>
    </app-container>
    <app-container>
      <generate-table ref="generateTable" :data="jsonData" :remote="remoteFuncs" :value="editData">
         <!--自定义新增编辑页面内容-->
         <!--<template slot="table_dialog" slot-scope="scope">-->
          <!--<generate-form :ref="scope.form" :data="jsonData" :remote="remoteFuncs" :value="scope.data"/>-->
        <!--</template>-->
      </generate-table>
     </app-container> 
  </div>
</template>
<script>
import GenerateForm from '@/components/CreateForm/GenerateForm'
import '@/components/CreateForm/styles/FormCreate.css'
import { getCodeList } from '@/api/codelist'
import GenerateTable from '@/components/CreateTable/GenerateTable'
export default {
  name: 'CreateFrom_setname',
  components: {
    GenerateForm,
    GenerateTable
  },
  data(){
		return{
			jsonData: ${data},
			editData: {},
			values: {},
			remoteFuncs: {
				${funcTemplate}
			},
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
}
</script>`
}
