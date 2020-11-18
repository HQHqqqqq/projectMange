<template>
  <el-row class="sys-main" :style="{height:asideHeight+'px'}">
    <el-col :span="24">
      <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
    </el-col>
  </el-row>
</template>

<script>
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { getMenuList } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "sysAuthority",
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
    asideHeight: function () {
      return document.documentElement.clientHeight - 90;
    }
  },
  mounted() {
    var params = {
      memberId: this.userinfo.memberid,
      menuId: 7
    };
    var json = {
      list: [
        {
          type: "grid",
          name: "栅格布局",
          icon: "icon-grid-",
          columns: [
            {
              span: 8,
              list: [
                {
                  type: "tree",
                  name: "树组件",
                  icon: "icon-jilianxuanze",
                  isShow: 1,
                  isLeaf: 0,
                  path: "",
                  code: "",
                  label: "",
                  options: {
                    defaultValue: [],
                    width: "",
                    placeholder: "",
                    disabled: false,
                    clearable: false,
                    remote: true,
                    remoteOptions: [],
                    radio: "1",
                    isShowBtn: "0",
                    isSpace: "1",
                    url_a: "/sgpm/rest/api/system/role",
                    url_b: "",
                    url_c: "",
                    url_d: "",
                    props: {
                      value: "value",
                      label: "label",
                      children: "children"
                    },
                    remoteFunc: "func_1560388835000_79413"
                  },
                  key: "1560388835000_79413",
                  model: "tree_1560388835000_79413",
                  rules: []
                }
              ]
            },
            {
              span: 16,
              list: [
                {
                  type: "tabs",
                  name: "",
                  icon: "icon-jilianxuanze",
                  isShow: "true",
                  tabs: [
                    {
                      name: "菜单授权"
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
                    remoteFunc: "func_1560388840000_55484"
                  },
                  key: "1560388840000_55484",
                  model: "tabs_1560388840000_55484",
                  rules: []
                }
              ]
            }
          ],
          options: {
            gutter: 20,
            justify: "start",
            align: "top",
            remoteFunc: "func_1560388822000_9569"
          },
          key: "1560388822000_9569",
          model: "grid_1560388822000_9569",
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
.sys-main {
  padding: 20px;
  width: 87%;
  .el-tabs__header {
    position: relative;
    padding-left: 0px;
    background: #f9f9f9;
  }
}
</style>
