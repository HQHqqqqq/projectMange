<template>
  <div class="form-config-container">
    <el-form label-position="top">
      <el-form-item label="表格属性">
        <el-checkbox v-if="Object.keys(data).indexOf('border')>=0" v-model="data.border">带边框表格</el-checkbox>
        <el-checkbox v-if="Object.keys(data).indexOf('stripe')>=0" v-model="data.stripe">带斑马纹表格</el-checkbox>
        <el-checkbox v-if="Object.keys(data).indexOf('showIndexCol')>=0" v-model="data.showIndexCol">序号</el-checkbox>
      </el-form-item>
      <el-form-item label="表格按钮">
        <el-checkbox v-if="Object.keys(data).indexOf('showAdd')>=0" v-model="data.showAdd">新增按钮</el-checkbox>
        <el-checkbox v-if="Object.keys(data).indexOf('showEdit')>=0" v-model="data.showEdit">编辑按钮</el-checkbox>
        <el-checkbox v-if="Object.keys(data).indexOf('showRemove')>=0" v-model="data.showRemove">删除按钮</el-checkbox>
        <el-checkbox v-if="Object.keys(data).indexOf('showExport')>=0" v-model="data.showExport">导出按钮</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['data']
}
</script>
