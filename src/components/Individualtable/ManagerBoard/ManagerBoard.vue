<template>
  <el-col :span="23" class="generate-content">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
    <!-- <el-button type="primary" @click="handleSubmit">提交</el-button> -->
  </el-col>
</template>

<script>
import axios from "axios";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "ManagerBoard",
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
    ])
  },
  mounted() {
    this.jsonData = {
      list: [
        {
          type: "managementHome",
          name: "",
          icon: "icon-jilianxuanze",
          isShow: "true",
          options: {
            warningName: "",
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
            remoteFunc: "func_1564206574000_60197"
          },
          key: "1564206574000_60197",
          model: "managementHome_1564206574000_60197",
          rules: []
        }
      ],
      config: {
        labelWidth: 100,
        labelPosition: "top",
        size: "small"
      }
    };

    // var params = {
    //   memberId: this.userinfo.memberid,
    //   menuId: 7
    // };
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

<style lang="scss">
@import "../../assets/css/common.css";
.generate-content {
  padding: 20px 0 0 20px;
  .back {
    text-align: left;
    margin-bottom: 0;
    cursor: pointer;
    .back-size {
      font-size: 17px;
    }
  }
}
</style>
