<template>
  <div class="audititem">
    <el-col :span="24">
      <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
      <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
    </el-col>
  </div>
</template>

<script>
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
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
  computed: {
    ...mapState([
      "userinfo" //os跳转过来的用户信息值
    ]),
    asideHeight: function() {
      return document.documentElement.clientHeight - 90;
    }
  },
  mounted() {
    var params = {
      memberId: this.userinfo.memberid,
      menuId: 35
    };
    var json = {
      list: [
        {
          type: "tabs",
          name: "",
          icon: "icon-jilianxuanze",
          isShow: "true",
          tabs: [
            {
              name: "我提交待审核的项目"
            },
            {
              name: "待我审核的项目"
            }
          ],
          options: {
            defaultValue: [],
            width: "",
            placeholder: "",
            disabled: false,
            clearable: false,
            remote: true,
            remoteOptions: [],
            url_a: "",
            url_b: "",
            url_c: "",
            url_d: "",
            props: {
              value: "value",
              label: "label",
              children: "children"
            },
            remoteFunc: "func_1564021082000_73055"
          },
          key: "1564021082000_73055",
          model: "tabs_1564021082000_73055",
          rules: []
        }
      ],
      config: {
        labelWidth: 100,
        labelPosition: "top",
        size: "small"
      }
    };
    this.jsonData = json;
    // getMenuList("/template", params)
    //   .then(res => {
    //     this.jsonData = res.data.data;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  },
  methods: {
    handleSubmit() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          // 数据校验成功
          // data 为获取的表单数据
          // console.log(data);
        })
        .catch(e => {
          // 数据校验失败
          console.log(e);
        });
    }
  }
};
</script>

<style  lang="scss">
@import "../../assets/css/common.css";
.audititem {
  overflow: auto;
  .el-tabs__header {
    position: relative;
    padding-left: 20px;
    background: #f9f9f9;
  }
}
</style>
