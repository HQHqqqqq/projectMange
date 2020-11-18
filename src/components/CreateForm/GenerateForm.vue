<template>
  <div>
    <!-- {{rules}} -->
    <!-- {{data.config.labelWidth}} -->
    <!-- :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'" -->
    <!-- {{models}} -->
    <el-form ref="generateForm" :model="models" :rules="rules" :label-position="data.config.labelPosition || 'left'"
      :label-width="data.config.labelWidth + 'px'">
      <!-- <el-form ref="generateForm" :size="data.config.size" :model="models" :rules="rules" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'"> -->
      <template v-for="(item, index) in data.list">
        <template v-if="item.type == 'grid'">
          <el-row :key="item.key" :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify" :align="item.options.align" type="flex">
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.list">
                <el-form-item v-if="citem.type=='blank'" :label="citem.name" :prop="citem.model" :key="citem.key">
                  <slot :name="citem.model" :model="models" />
                </el-form-item>
                <genetate-form-item v-else :key="citem.key" :models.sync="models" :remote="remote" :rules="rules"
                  :widget="citem" :globalParams="globalParams" />
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models" />
          </el-form-item>
        </template>

        <template v-else>
          <genetate-form-item :key="item.key" :models.sync="models" :rules="rules" :widget="item" :remote="remote"
            :globalParams="globalParams" />
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import Bus from "../../bus";
import GenetateFormItem from "./GenerateFormItem";
import { getMenuList } from "../../api/api.js";
import { getContract } from "../../api/api.js";
import { mapState, mapActions } from "vuex";
import { getParentProject } from "../../api/api.js";
import { getProjectStart } from "../../api/api.js";
import { getProject } from "../../api/api.js";
import { serverGetHttpMethod } from "../../api/api.js";
export default {
  name: "FmGenerateForm",
  components: {
    GenetateFormItem
  },
  beforeRouteEnter(to, from, next) {
    // console.log(this);
    next(vm => {
      console.log(vm.$parent.$parent.$parent.getMenu());
    });
  },
  // eslint-disable-next-line vue/require-prop-types
  // props: ['data', 'remote', 'value','insite'],
  props: {
    data: {
      default: () => {
        return {
          list: "",
          config: {
            labelPosition: "left",
            labelWidth: 100
          }
        };
      }
    },
    remote: {
      default: []
    },
    value: {
      default: []
    },
    globalParams: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      models: {},
      rules: {},
      list: [],
      projectId: this.$route.params.id,
      judgelogo: this.$route.query.judgelogo,
      judgestart: this.$route.params.judgestart,
      // globalParams: this.globalParams,
      tagArr: ""
    };
  },
  watch: {
    data(newData) {
      // console.log(newData);
    },
    value: {
      deep: true,
      handler(val) {
        // console.log(JSON.stringify(val));
        this.models = { ...this.models, ...val };
      }
    }
  },
  mounted() {
    // this.getBusinesstype(this.userinfo.subdept_id);
    setTimeout(() => {
      var param = this.$route.params;
      this.parent_id = param.parent_id;
      this.judgeproject = param.judgeproject;
      Bus.$on("contractList", item => {
        if (item) {
          console.log(item);
          this.item = item;
          this.getprojectData();
        }
      });
      //项目审批列表修改的默认值
      if (this.judgestart == "99") {
        // this.getStartDate();
      } else if (
        this.judgeproject == "项目信息" ||
        this.$route.name == "/projectInformation"
      ) {
        //项目信息
        Bus.$on("projectContent", item => {
          if (item) {
            if (
              item.parent_id == undefined ||
              item.parent_id == null ||
              item.parent_id == "null" ||
              item.parent_id == "undefined"
            ) {
              this.getParentData(item.id);
            } else {
              this.getChildData(item.id);
            }
          }
        });
        this.getprojectData();
      } else if (
        this.judgelogo == "a" ||
        this.judgelogo == "b" ||
        this.$route.name == "/Businessproject" ||
        this.$route.name == "/Contractproject" ||
        this.$route.name == "/contractproject"
      ) {
        // this.setDefaultProUpdate();
      }
    }, 200);
  },
  computed: {
    ...mapState([
      "userinfo" //oa跳转过来的用户信息值
    ])
  },
  // 柴跃华   增加Bus销毁事件
  beforeDestroy() {
    Bus.$off();
  },
  created() {
    if (
      this.$route.name == "/NonContractual" ||
      this.userinfo.account_id == "-1814768306395265967" ||
			this.$route.name == "/gtNonContractual" ||
			this.$route.name == "/nkNonContractual" ||
			this.$route.name == "/contractFinish" ||
			this.$route.name == '/abnormalProject' || 
			this.$route.name == '/nonPostProject'
    ) {
      this.setBusinessProUpdate();
    } else if (
      this.$route.name == "/projectstart" &&
      this.userinfo.account_id == "-1814768306395265967"
    ) {
      this.setBusinessProUpdate();
    }
  },
  methods: {
    getBusinesstype(sub) {
      var url =
        "/sgpm/rest/api/server/pm/project/enum/group?param=BusinessType&group_id=" +
        sub;
      serverGetHttpMethod(url)
        .then(res => {
          Bus.$emit("businesstype", JSON.stringify(res.data.data));
        })
        .catch(err => {
          console.log(err);
        });
    },
    setBusinessProUpdate(widget) {
      setTimeout(() => {
        let aa = JSON.parse(localStorage.getItem("globalParams"));
        // _this.models[_this.widget.model] = '2120-移动网络规划软件'
        let objResult = {};
        for (let item in aa) {
          let labelLower = item.toLowerCase();
          objResult[labelLower] = aa[item];
        }
        this.models = objResult;
      }, 1500);
    },
    //通过projectId获取的数据拆分
    updateJsonData(obj) {
      let result = {};
      for (let item in obj) {
        if (item == "CONTRACT") {
          for (let jtem in obj[item]) {
            result[jtem] = obj[item][jtem];
          }
        } else {
          result[item] = obj[item];
        }
      }
      return result;
    },
    //合同额保留两位小数
    keepTwoDecimalFull(num) {
      var result = parseFloat(num);
      if (isNaN(result)) {
        alert("传递参数错误，请检查！");
        return false;
      }
      result = Math.round(num * 100) / 100;
      var s_x = result.toString();
      var pos_decimal = s_x.indexOf(".");
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += ".";
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += "0";
      }
      return s_x;
    },
    //获取父项目信息
    getParentData(id) {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      // });
      var data = {
        projectId: Number(id)
      };
      getProject("/sgpm/rest/api/server/pm/project/parent", data)
        .then(res => {
          // console.log(res)
          var projectData = res.data.data;
          localStorage.setItem("projectData", JSON.stringify(projectData));

          this.getprojectData();
          // loading.close();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取子项目信息
    getChildData(id) {
      var data = {
        projectId: Number(id)
      };
      getProject("/sgpm/rest/api/server/pm/project/child", data)
        .then(res => {
          // console.log(res)
          var projectData = res.data.data;
          localStorage.setItem("projectData", JSON.stringify(projectData));
          this.getprojectData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatThousands(value) {
      // console.log(value);
      var r = /^[0-9]*[1-9][0-9]*$/; //正整数
      if (r.test(value) == false) {
        return (
          value &&
          value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + ",";
          })
        );
      } else {
        var reg = /\d{1,3}(?=(\d{3})+$)/g;
        return (value + "").replace(reg, "$&,");
      }
    },
    //项目信息赋值
    getprojectData(widget) {
      setTimeout(() => {
        localStorage.removeItem("projectMsg");
        let projectRowMsg = JSON.parse(localStorage.getItem("projectData"));
        let objResult = {};
        for (let label in projectRowMsg) {
          let labelLower = label.toLowerCase();
          objResult[labelLower] = projectRowMsg[label];
          if (label == "KEYWORD") {
            Bus.$emit("keyWords", projectRowMsg[label]);
          } else if (label == "KEYTECHNOLOGY") {
            Bus.$emit("keytechnologys", projectRowMsg[label]);
          }
        }
        this.models = objResult;
        if (this.item) {
          this.models.contractnumber = this.item.CONTRACTNUMBER;
          this.models.contractsigningdate = this.item.CONTRACTSIGNINGDATE;
          this.models.contractmarket = this.item.CONTRACTMARKET;
          this.models.customercenter = this.item.CUSTOMERCENTER;
          this.models.customerdepartment = this.item.CUSTOMERDEPARTMENT;
          this.models.contractprostartdate = this.item.CONTRACTPROSTARTDATE;
          this.models.contractproenddate = this.item.CONTRACTPROENDDATE;
          this.models.contractstate = this.item.CONTRACTSTATE;
          this.models.filestatus = this.item.FILESTATUS;
          this.models.customername = this.item.CUSTOMERNAME;
          this.models.industry = this.item.INDUSTRY;
          this.models.region = this.item.REGION;
        }
      }, 1500);
    },
    generateModle(genList) {
      var genList = JSON.parse(localStorage.getItem("all_data"));

      for (var i = 0; i < genList.length; i++) {
        if (Object.keys(this.value).indexOf(genList[i].model) >= 0) {
          this.models[genList[i].model] = this.value[genList[i].model];
        } else {
          if (genList[i].type === "blank") {
            this.models[genList[i].model] =
              genList[i].options.defaultType === "String"
                ? ""
                : genList[i].options.defaultType === "Object"
                  ? {}
                  : [];
          } else {
            this.models[genList[i].model] = genList[i].options.defaultValue;
          }
        }

        if (this.rules[genList[i].model]) {
          this.rules[genList[i].model] = [
            ...this.rules[genList[i].model],
            ...genList[i].rules
          ];
        } else {
          this.rules[genList[i].model] = [...genList[i].rules];
        }
        // 	if (genList[i].type === 'grid') {
        // 		genList[i].columns.forEach(item => {
        // 			this.generateModle(item.list)
        // 		})
        // 	} else {
        // 		if (Object.keys(this.value).indexOf(genList[i].model) >= 0) {
        // 			this.models[genList[i].model] = this.value[genList[i].model]
        // 		} else {
        // 			if (genList[i].type === 'blank') {
        // 				this.models[genList[i].model] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType ===
        // 					'Object' ? {} : [])
        // 			} else {
        // 				this.models[genList[i].model] = genList[i].options.defaultValue
        // 			}
        // 		}
        //
        // 		if (this.rules[genList[i].model]) {
        // 			this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules]
        // 		} else {
        // 			this.rules[genList[i].model] = [...genList[i].rules]
        // 		}
        // 	}
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          console.log(valid);
          localStorage.setItem("valid", valid);
          if (valid) {
            resolve(this.models);
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    refresh() { }
  }
};
</script>
