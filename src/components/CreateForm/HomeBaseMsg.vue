<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="140px">
      <el-row>
        <el-col :span="4" :push="20">
          <el-form-item>更多</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称">
            <span class="form-con">{{form.PROJECTNAME|formatNull}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目编号">
            <span class="form-con">{{form.PROJECTNUMBER|formatNull}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目实施部门">
            <span class="form-con">{{form.implementationdepartment}}</span>
            <span class="form-con">{{form.implementationsecondary|formatNull}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目所属客户中心">
            <span class="form-con">{{form.CUSTOMERCENTER|formatNull}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目经理">
            <span class="form-con">{{form.PROJECTMANAGER|formatNull}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目销售">
            <span class="form-con">{{form.CONTRACTMARKET|formatNull}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="监管级别">
            <span class="form-con">{{form.ITEMSUPERVISISELEVEL|formatNull}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { projectMsgById } from "../../api/api.js";
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
export default {
  name: "HomeBaseMsg",
  props: ["widget", "models", "rules", "remote", "datas"],

  data() {
    return {
      iconClass: "",
      form: {},
      projectId: this.$route.params.id
    };
  },
  mounted() {
    this.init(this.projectId);
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        // console.log(this.datas);
        // console.log(this.datas.options.url_a);
      }
    }
  },
  filters: {
    formatNull: function(value) {
      if (value == "" || value == null) {
        return "--";
      } else {
        return value;
      }
    }
  },
  methods: {
    ...mapActions(["setAllProMsg"]),
    init(projectId) {
      projectMsgById(
        `/sgpm/rest/api/server/pm/project?projectId=${projectId}`,
        null
      )
        .then(res => {
          let result = res.data.data;
          console.log(this.updateJsonData(result));
          let lastResult = this.updateJsonData(result);
          this.form = lastResult;
          this.setAllProMsg(lastResult);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //通过projectId获取的数据拆分
    updateJsonData(obj) {
      let result = {};
      for (let item in obj) {
        if (item == "CONTRACT" || item == "BUSINESS") {
          for (let jtem in obj[item]) {
            result[jtem] = obj[item][jtem];
          }
        } else {
          result[item] = obj[item];
        }
      }
      return result;
    }
  }
};
</script>

<style lang="scss">
.container {
  .form-con {
    font-size: 12px;
  }
}
</style>
