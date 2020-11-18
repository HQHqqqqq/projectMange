<template>
  <el-col :span="23">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
    <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
  </el-col>
</template>

<script>
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
export default {
  name: "project-test",
  components: {
    GenerateForm
  },
  data() {
    return {
      jsonData: {
        list: [],
        config: {
          labelPosition: "left",
          labelWidth: 100,
          size: "small"
        }
      },
      editData: {},
      remoteFuncs: {}
    };
  },
  mounted() {
    var params = {
      memberId: "7503529197009650726",
      menuId: 35
    };
    getMenuList("/template", params)
      .then(res => {
        this.jsonData = res.data.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    handleSubmit() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          // 数据校验成功
          // data 为获取的表单数据
          console.log(data);
        })
        .catch(e => {
          // 数据校验失败
          console.log(e);
        });
    }
  }
};
</script>

<style>
@import "../../assets/css/common.css";
</style>
