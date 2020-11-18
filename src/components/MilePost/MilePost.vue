<template>
  <el-col :span="24">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
  </el-col>
</template>

<script>
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { serverPostHttpMethod } from "../../api/api.js"; //
import Bus from "../../bus";

export default {
  name: "CreateFrom_setname",
  components: {
    GenerateForm
  },

  //离开当前页面提示
  beforeRouteLeave(to, from, next) {
    if (!this.fileStatus) {
      next();
    } else {
      const answer = window.confirm(
        "系统可能不会保存您所做的更改，确定要离开吗?"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    }
  },

  destroyed() {
    window.onbeforeunload = null;
  },
  created() {},

  mounted() {
    // 交付物未上传完离开页面添加提示
    Bus.$on("fileUploadFiles", item => {
      if (item && item.length > 0) {
        console.log(item);
        this.fileStatus = true;

        //刷新页面验证
        window.onbeforeunload = function(e) {
          e = e || window.event;
          // 兼容IE8和Firefox 4之前的版本
          if (e) {
            e.returnValue = "关闭提示";
          }
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return "关闭提示";
        };
      } else {
        this.fileStatus = false;
        window.onbeforeunload = null; //取消刷新页面验证
      }
    });
    // 非合同列表进入添加判断
    if (
      localStorage.getItem("judgeproject") == "非合同项目信息" ||
      localStorage.getItem("jump_type") == "11"
    ) {
      this.initNotProjectInfo();
    } else {
      this.initProjectInfo();
    }
  },

  data() {
    return {
      fileStatus: false, //文件是否全部上传完的状态 true未全部上传  false已全部上传完
      currentProgress: 0,
      jsonData: {},
      // jsonData: {
      //   list: [
      //     {
      //       type: "tabs",
      //       name: "",
      //       icon: "icon-jilianxuanze",
      //       isShow: "true",
      //       tabs: [
      //         {
      //           name: "里程碑Review"
      //         },
      //         // {
      //         //   "name": "回款里程碑计划"
      //         // },
      //         {
      //           name: "回款条件Review"
      //         },
      //         {
      //           name: "软硬件进度Review"
      //         }
      //       ],
      //       options: {
      //         defaultValue: [],
      //         width: "",
      //         placeholder: "",
      //         disabled: false,
      //         clearable: false,
      //         remote: true,
      //         remoteOptions: [],
      //         url_a: "",
      //         url_b: "",
      //         url_c: "",
      //         url_d: "",
      //         props: {
      //           value: "value",
      //           label: "label",
      //           children: "children"
      //         },
      //         remoteFunc: "func_1563958033000_83495"
      //       },
      //       key: "1563958033000_83495",
      //       model: "tabs_1563958033000_83495",
      //       rules: []
      //     }
      //   ],
      //   config: {
      //     labelWidth: 100,
      //     labelPosition: "top",
      //     size: "small"
      //   }
      // },
      editData: {},
      remoteFuncs: {}
    };
  },
  methods: {
    // 合同项目信息页面json
    initProjectInfo() {
      this.jsonData = {
        list: [
          {
            type: "tabs",
            name: "",
            icon: "icon-jilianxuanze",
            isShow: "true",
            tabs: [
              {
                name: "里程碑Review"
              },
              // {
              //   "name": "回款里程碑计划"
              // },
              {
                name: "回款条件Review"
              },
              {
                name: "软硬件进度Review"
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
              remoteFunc: "func_1563958033000_83495"
            },
            key: "1563958033000_83495",
            model: "tabs_1563958033000_83495",
            rules: []
          }
        ],
        config: {
          labelWidth: 100,
          labelPosition: "top",
          size: "small"
        }
      };
    },
    // 非合同项目信息页面json
    initNotProjectInfo() {
      this.jsonData = {
        list: [
          {
            type: "tabs",
            name: "",
            icon: "icon-jilianxuanze",
            isShow: "true",
            tabs: [
              {
                name: "里程碑Review"
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
              remoteFunc: "func_1563958033000_83495"
            },
            key: "1563958033000_83495",
            model: "tabs_1563958033000_83495",
            rules: []
          }
        ],
        config: {
          labelWidth: 100,
          labelPosition: "top",
          size: "small"
        }
      };
    }
  }
};
</script>

<style scoped>
</style>
