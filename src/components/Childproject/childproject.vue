<template>
  <el-col :span="24" class="projectview">
    <p class="back">
      <i class="el-icon-back back-size" @click="back"></i>
    </p>
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
    <el-button type="primary" @click="saveDate" v-show="!isDetail">保存</el-button>
    <el-button type="primary" @click="handleSubmit" v-show="!isDetail&&isRevoke==2" :disabled="disabled">提交</el-button>
    <el-button type="primary" @click="back">返回</el-button>
  </el-col>
</template>
<script>
var select_array = [];
var all_array = [];
var index_array = [];
var projectLevel = [];
var personInfor = JSON.parse(localStorage.getItem("personInfor"));
import Bus from "../../bus";
import GenerateForm from "@/components/CreateForm/GenerateForm";
import GenetateFormItem from "@/components/CreateForm/GenerateFormItem";
import "@/components/CreateForm/styles/FormCreate.css";
import { getData } from "../../api/api.js";
import { getMenuList } from "../../api/api.js";
import { submitOa } from "../../api/api.js";
import { getPersonInfor } from "../../api/api.js";
import { serverPostHttpMethod } from "../../api/api.js";
import { updateTime } from "../../api/api.js";
import { getTemplate } from "../../api/api.js";
import { saveDate } from "../../api/api.js";
import { updateDate } from "../../api/api.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "CreateFrom_setname",
  components: {
    GenerateForm,
    GenetateFormItem
  },
  data() {
    return {
      jsonData: {
        list: "",
        config: {
          labelPosition: "left",
          labelWidth: 100,
          size: "small"
        }
      },
      parentList: [],
      projectData: [],
      keytechnologyList: "",
      editData: {},
      remoteFuncs: {},
			disabled: false
    };
  },
  computed: {
    ...mapState([
      "userinfo", //oa跳转过来的用户信息值
      "isDetail" //是否是详情页面，详情页面操作按钮不显示，只显示返回按钮
    ]),
    isRevoke: function() {
      return sessionStorage.getItem("isRevoke");
    }
  },
  mounted() {
    Bus.$on("parentProject", item => {
      if (item) {
        this.parentList = item;
      }
    });
    Bus.$on("keytechnology", item => {
      if (item) {
        this.keytechnologyList = item;
      }
    });
    //获取子项目
    var that = this;
    var id = 10;
    var url = "/template/" + id;
    getTemplate(url)
      .then(res => {
        var projectCreat = res.data.data.list;
        localStorage.setItem("all_data", JSON.stringify(projectCreat));
        this.jsonData.list = res.data.data.list;
        for (var i = 0; i < projectCreat.length; i++) {
          for (var j = 0; j < projectCreat[i].columns.length; j++) {
            for (var q = 0; q < projectCreat[i].columns[j].list.length; q++) {
              all_array.push(projectCreat[i].columns[j].list[q]);
              if (projectCreat[i].columns[j].list[q].type == "select") {
                select_array.push(projectCreat[i].columns[j].list[q]);
              }
            }
          }
        }
        for (let i in all_array) {
          let thats = i;
          for (let j in select_array) {
            if (all_array[thats].name == select_array[j].name) {
              var self = thats;
              index_array.push(self);
              var url_ = all_array[self].model;
              // console.log(url_);
              getData("/" + url_)
                .then(res => {
                  all_array[thats].options.remoteOptions = res.data.data;
                  //that.jsonData.list = all_array;
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        }
        if (res.data.data.list.length > 0) {
          this.widgetFormSelect = res.data.data.list[0];
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    //提交
    handleSubmit() {
      var that = this;
      this.$refs.generateForm
        .getData()
        .then(data => {
          // 数据校验成功
          // data 为获取的表单数据
          var prostartdate = new Date(
            data.projectstartdate.replace(/\-/g, "/")
          );
          var proenddate = new Date(data.projectenddate.replace(/\-/g, "/"));
          if (prostartdate >= proenddate) {
            alert("项目预计开始时间不能大于项目预计结束时间！");
            return false;
          }
          var keytechnology = "";
          if (
            that.$route.params.id != undefined &&
            that.$route.params.id != null
          ) {
            //编辑
            if (this.keytechnologyList) {
              keytechnology = this.keytechnologyList.join(",");
            } else {
              keytechnology = data.keytechnology;
            }
            var data = {
              id: that.$route.params.id,
              project: {
                name: data.projectname,
                custom_field_values: {
                  28: data.projectstartdate,
                  29: data.projectenddate,
                  30: data.projecttype,
                  35: data.constructioncontent,
                  36: keytechnology,
                  40: data.childprojectmoneh,
                  42: 3,
                  41: data.businesssystem
                },
                parent_id: data.parentid,
                description: "",
                is_public: "1",
                user_id: that.userinfo.memberid,
                user_name: that.userinfo.emp_name,
                company_name: that.userinfo.account_name,
                company_id: that.userinfo.account_id,
                level_one_name: that.userinfo.subdept_name,
                level_one_id: that.userinfo.subdept_id,
                level_two_name: that.userinfo.dept_name,
                level_two_id: that.userinfo.dept_id,
                project_no: data.projectnumber
              },
              child: 1,
              category: 3,
              account_name: that.userinfo.account_name,
              username: that.userinfo.login_name,
              workflow_type: 2,
              parent_number: data.parentprojectnumber,
              parent_name: data.parentproject
            };
          } else {
            //填写
            if (this.keytechnologyList) {
              keytechnology = this.keytechnologyList.join(",");
            } else {
              keytechnology = this.keytechnologyList.join(",");
            }
            if (this.projectData.project_id == undefined) {
              this.projectData.project_id = "";
            }
            var data = {
              id: this.projectData.project_id,
              project: {
                name: data.projectname,
                custom_field_values: {
                  28: data.projectstartdate,
                  29: data.projectenddate,
                  30: data.projecttype,
                  35: data.constructioncontent,
                  36: keytechnology,
                  40: data.childprojectmoneh,
                  42: 3,
                  41: data.businesssystem
                },
                parent_id: this.parentList.parent_id,
                description: "",
                is_public: "1",
                user_id: this.userinfo.memberid,
                user_name: this.userinfo.emp_name,
                company_name: this.userinfo.account_name,
                company_id: this.userinfo.account_id,
                level_one_name: this.userinfo.subdept_name,
                level_one_id: this.userinfo.subdept_id,
                level_two_name: this.userinfo.dept_name,
                level_two_id: this.userinfo.dept_id,
                project_no: this.projectData.project_no
              },
              child: 1,
              category: 3,
              account_name: this.userinfo.account_name,
              username: this.userinfo.login_name,
              workflow_type: 2,
              parent_number: this.parentList.project_num,
              parent_name: this.parentList.value
            };
          }
          submitOa("/sgpm/rest/api/integration/oa/flow", data).then(res => {
            if (res.data.code == 200) {
							this.disabled = false;
              alert("提交成功!");
              // var params = {
              //   projectId: res.data.data.project_id
              // };
              // //判断是否可以提交
              // updateDate("/sgpm/rest/api/server/pm/project", params)
              //   .then(res => {
              //     if (res.data.code == 200) {
              //       if (res.data.data.processId != null) {
              //         this.disabled = true;
              //       } else {
              //         this.disabled = false;
              //       }
              //     }
              //   })
              //   .catch(err => {
              //     console.log(err);
              //   });
              this.$router.push({
                path: "audititem"
              });
            } else if (res.data.code == 201) {
              alert("提交失败!");
							this.disabled = true;
            }
          });
        })
        .catch(e => {
          // 数据校验失败
          console.log(e);
					this.disabled = true;
        });
    },
    //保存
    saveDate() {
      var that = this;
      this.$refs.generateForm.getData().then(data => {
        var prostartdate = new Date(data.projectstartdate.replace(/\-/g, "/"));
        var proenddate = new Date(data.projectenddate.replace(/\-/g, "/"));
        if (prostartdate >= proenddate) {
          alert("项目预计开始时间不能大于项目预计结束时间！");
          return false;
        }
        var keytechnology = "";
        if (
          that.$route.params.id != undefined &&
          that.$route.params.id != null
        ) {
          if (this.keytechnologyList) {
            keytechnology = this.keytechnologyList.join(",");
          } else {
            keytechnology = data.keytechnology;
          }
          var data = {
            id: that.$route.params.id,
            project: {
              name: data.projectname,
              custom_field_values: {
                28: data.projectstartdate,
                29: data.projectenddate,
                30: data.projecttype,
                35: data.constructioncontent,
                36: keytechnology,
                40: data.childprojectmoneh,
                42: 3,
                41: data.businesssystem
              },
              parent_id: data.parentid,
              description: "",
              is_public: "1",
              user_id: that.userinfo.memberid,
              user_name: that.userinfo.emp_name,
              company_name: that.userinfo.account_name,
              company_id: that.userinfo.account_id,
              level_one_name: that.userinfo.subdept_name,
              level_one_id: that.userinfo.subdept_id,
              level_two_name: that.userinfo.dept_name,
              level_two_id: that.userinfo.dept_id,
              project_no: data.projectnumber
            },
            child: 1,
            category: 3,
            account_name: this.userinfo.account_name
          };
        } else {
          if (this.projectData.project_id == undefined) {
            this.projectData.project_id = "";
          }
          if (this.keytechnologyList) {
            keytechnology = this.keytechnologyList.join(",");
          } else {
            keytechnology = this.keytechnologyList.join(",");
          }
          var data = {
            id: "",
            project: {
              name: data.projectname,
              custom_field_values: {
                28: data.projectstartdate,
                29: data.projectenddate,
                30: data.projecttype,
                35: data.constructioncontent,
                36: keytechnology,
                40: data.childprojectmoneh,
                42: 3,
                41: data.businesssystem
              },
              parent_id: this.parentList.parent_id,
              description: "",
              is_public: "1",
              user_id: this.userinfo.memberid,
              user_name: this.userinfo.emp_name,
              company_name: this.userinfo.account_name,
              company_id: this.userinfo.account_id,
              level_one_name: this.userinfo.subdept_name,
              level_one_id: this.userinfo.subdept_id,
              level_two_name: this.userinfo.dept_name,
              level_two_id: this.userinfo.dept_id,
              project_no: this.projectData.project_no
            },
            child: 1,
            category: 3,
            account_name: this.userinfo.account_name
          };
        }
        saveDate("/sgpm/rest/api/server/pm/project", data)
          .then(res => {
            if (res.data.code == 200) {
              alert("保存成功!");
              var data = res.data.data;
              this.projectData = data;
              var project_no = data.project_no;
              var jsonList = this.jsonData.list;
              for (var i = 0; i < jsonList.length; i++) {
                for (var j = 0; j < jsonList[i].columns.length; j++) {
                  for (var q = 0; q < jsonList[i].columns[j].list.length; q++) {
                    if (
                      jsonList[i].columns[j].list[q].model == "projectnumber"
                    ) {
                      jsonList[i].columns[j].list[q].options.placeholder =
                        res.data.data.value;
                    }
                  }
                }
              }
            } else if (res.data.code == 201) {
              alert("保存失败!");
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //返回
    back() {
      this.$router.go(-1); //返回上一层
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/css/common.css";
.back {
  text-align: left;
  margin-bottom: 0;
  cursor: pointer;
  .back-size {
    font-size: 17px;
  }
}
</style>
