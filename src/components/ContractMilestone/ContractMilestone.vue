<template>
  <!--合同里程碑页面-->
  <!--<el-col :span="23" class="main projectview">-->
  <el-col :span="24">
    <generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></generate-form>
  </el-col>
</template>

<script>
import GenerateForm from "@/components/CreateForm/GenerateForm";
import { serverPostHttpMethod } from "../../api/api.js"; //
import Bus from "../../bus";

export default {
  name: "ContractMilestone",
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
  },

  data() {
    return {
      fileStatus: false, //文件是否全部上传完的状态 true未全部上传  false已全部上传完
      currentProgress: 0,
      jsonData: {
        // "list": [
        //   {
        //     "type": "milepost",
        //     "name": "",
        //     "icon": "icon-select",
        //     "isShow": "true",
        //     "url": "",
        //     "options": {
        //       "defaultValue": [],
        //       "disabled": false,
        //       "clearable": false,
        //       "required": false,
        //       "width": "",
        //       "remote": false,
        //       "filterable": false,
        //       "remoteOptions": [],
        //       "url_a": "",
        //       "url_b": "",
        //       "props": {"value": "value", "label": "label"},
        //       "remoteFunc": "func_1560127205000_9527"
        //     },
        //     "config": {"labelPosition": "left"},
        //     "key": "1560127205000_9527",
        //     "model": "milepost_1560127205000_9527",
        //     "rules": []
        //   }], "config": {"labelWidth": 100, "labelPosition": "top", "size": "small"}

        list: [
          {
            type: "tabs",
            name: "",
            icon: "icon-jilianxuanze",
            isShow: "true",
            tabs: [
              // {
              //   "name": "里程碑Review"
              // },
              {
                name: "回款里程碑计划"
              }
              // {
              //   "name": "回款条件Review"
              // }
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
      },
      editData: {},
      remoteFuncs: {}
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          // 获取全局数据
          var json = localStorage.getItem("MilepostParams");
          var tableData = JSON.parse(json);
          console.log(tableData);
          // 更新数据
          this.updateData(tableData);
          this.saveReviewlog(tableData); //保存review记录

          // 数据校验成功
          // data 为获取的表单数据
        })
        .catch(e => {
          // 数据校验失败
        });
    },

    updateData(tableData) {
      console.log("====更新里程碑信息=====");
      var url = "/sgpm/rest/api/server/pm/project/milestones";
      var data = {};
      var milestones = [];
      tableData.forEach(item => {
        var hash = {};
        hash["id"] = item.projectMilestoneId; //里程碑id
        hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
        hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
        // hash["finishDate"] = item.actualEndTime;             //实际完成时间
        hash["estimatedWorkingHours"] = item.workHours; //预计工时
        // hash["delayDays"] = item.delayDays;                 //延期天数

        hash["currentProblems"] = item.currentProblems; //当前问题
        hash["accumulatedProgress"] = item.accumulatedProgress; //累计进度
        hash["status"] = item.status; //里程碑中 status: 0 未完成  1 进行中  2 已完成

        // 选择完成时 添加实际完成时间
        if (item.status == 2) {
          var date = new Date();
          var year = date.getFullYear();
          var month = (date.getMonth() + 1).toString();
          var day = date.getDate().toString();
          if (month.length == 1) {
            month = "0" + month;
          }
          if (day.length == 1) {
            day = "0" + day;
          }
          var dateTime = year + "-" + month + "-" + day;
          hash["finishDate"] = dateTime; //实际完成时间

          // 根据实际完成时间计算延期天数
          var beginDate = new Date(Date.parse(item.expectedEndTime));
          var endDate = new Date(Date.parse(dateTime));
          var delayDays = (endDate - beginDate) / (1000 * 24 * 3600); //获取天数
          hash["delayDays"] = delayDays; //延期天数
        }
        //交付物
        var deliverable = [];
        item.deliverable.forEach(del => {
          var ha = {};
          ha["id"] = del.deliverableId; //交付物id
          ha["deliverableName"] = del.deliverableName;
          ha["fileName"] = del.fileName;
          ha["filePath"] = del.filePath;
          ha["description"] = del.description;
          ha["status"] = del.status; //erp中交付物状态 1未上传 2待审核   3审核通过   4驳回
          deliverable.push(ha);
        });
        hash["deliverable"] = deliverable;
        milestones.push(hash);
      });
      data["milestones"] = milestones; //里程碑信息
      serverPostHttpMethod(url, data)
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            alert("保存成功");

            Bus.$emit("MilePostSave", { code: 200, success: true });
          } else {
            alert("保存失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //保存review记录
    saveReviewlog(tableData) {
      console.log("=====保存review记录======");
      this.getCurrentProgress(tableData);
      console.log("aaa:" + this.currentProgress);
      console.log("aaa111:" + this.currentProgress / 100);
      var arr = []; //记录所有review操作的数据
      for (var i = 0; i < tableData.length; i++) {
        var item = tableData[i];
        if (item.changeStatus) {
          arr.push(item);
        }
      }
      if (arr.length > 0) {
        var item = arr[arr.length - 1];
        var url = "/sgpm/rest/api/server/pm/project/reviewlog";
        var data = {};
        data["percentageComplete"] = this.currentProgress / 100; //当前进度
        data["currentStatus"] = item.status;
        data["progressProblems"] = item.currentProblems;
        data["projectMilestoneId"] = item.projectMilestoneId;
        serverPostHttpMethod(url, data)
          .then(res => {
            console.log(res.data);
            if (res.data.code == 200) {
            } else {
              alert("保存失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //计算当前进度
    getCurrentProgress(tableData) {
      var a = 0;
      tableData.forEach(item => {
        a += item.weight * item.accumulatedProgress;
      });
      console.log("a:" + a / 100);
      this.currentProgress = Math.round(a / 100); //四舍五入
    }
  }
};
</script>
