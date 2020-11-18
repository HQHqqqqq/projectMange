<template>
  <el-form class="tableClass">
    <el-button class="addRow" type="primary" @click="addRow(tableData)">添加</el-button>
    <el-table
      :data="tableData"
      height="250"
      border
      style="width: 100%;border-top: 1px solid #EBEEF5;"
      class="tb-edit"
      :header-cell-style="{fontSize:'14px',color:'#303133',height:'34px',padding:0,backgroundColor:'#ccd1d5'}"
      :row-style="{height:'34px'}"
      :cell-style="{padding:0}"
      highlight-current-row
      v-model="tableData"
      @row-click="handleCurrentChange"
    >
      <el-table-column type="index" label="序号" width="38"></el-table-column>
      <el-table-column prop="id" label="id" width="0" v-if="show"></el-table-column>
      <el-table-column prop="LMName" align="center" label="*姓名" width="100">
        <template slot="header">
          <span class="start">*</span>
          <span>姓名</span>
        </template>
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.LMName"
            placeholder="请输入内容"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
          <span>{{scope.row.LMName}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="CustomName" label="客户单位名称" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.CustomName"
            placeholder="请输入内容"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
          <span>{{scope.row.CustomName}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="PostInfo" label="职务" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.PostInfo"
            placeholder="请输入内容"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
          <span>{{scope.row.PostInfo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="Email">
        <template slot="header">
          <span class="start">*</span>
          <span>电子邮箱地址</span>
        </template>
        <template slot-scope="scope">
          <!-- <el-form-item prop="Email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }]"> -->
          <el-input
            size="mini"
            v-model="scope.row.Email"
            placeholder="请输入内容"
            @change="handleEdit(scope.$index, scope.row)"
            @blur="handleEditEmail(scope.$index, scope.row)"
          ></el-input>
          <span>{{scope.row.Email}}</span>
          <!-- </el-form-item> -->
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header">
          <span class="start">*</span>
          <span>通讯地址</span>
        </template>
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.FAddress"
            placeholder="请输入内容"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
          <span>{{scope.row.FAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ZipCode" label="邮编" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.ZipCode"
            placeholder="请输入内容"
            @change="handleEdit(scope.$index, scope.row)"
          ></el-input>
          <span>{{scope.row.ZipCode}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="MobilePhont" align="center">
        <template slot="header">
          <span class="start">*</span>
          <span>手机号/固定电话</span>
        </template>
        <template slot-scope="scope">
          <el-form-item prop="MobilePhont" style="margin-bottom: 0px;margin-top:0px;">
            <el-input
              type="number"
              size="mini"
              v-model="scope.row.MobilePhont"
              placeholder="请输入内容"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span style="font-size: 12px;">{{scope.row.MobilePhont}}</span>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header">
          <span class="start">*</span>
          <span>客户成员角色</span>
        </template>
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.BusRole"
            filterable
            placeholder="请选择"
            @change="handleEdit(scope.$index, scope.row)"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
          <span>{{scope.row.BusRole}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">
            <i class="el-icon-delete-solid" style="font-size: 20px;color: #409EFF"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import Bus from "../../bus";
import { mapState, mapActions } from "vuex";
import { getMenuList } from "../../api/api.js";
import { editMember } from "../../api/api.js";
import { getTemplate } from "../../api/api.js";
import { getProject } from "../../api/api.js";
import { serverPostHttpMethod } from "../../api/api.js";
import { serverDeleteHttpMethod } from "../../api/api.js";
export default {
  name: "customercontact",
  props: ["widget", "models", "rules", "remote", "datas"],
  components: {},
  data() {
    return {
      // email: '',
      search: "",
      input1: "",
      value1: "",
      value2: "",
      infiledList: [],
      show: false,
      options: [
        {
          value: "选项1",
          label: "满意度调查人"
        },
        {
          value: "选项2",
          label: "询证函联系人"
        },
        {
          value: "选项3",
          label: "直接负责人"
        },
        {
          value: "选项4",
          label: "领导"
        },
        {
          value: "选项5",
          label: "干系人客户"
        }
      ],
      value: "",
      tableData: [],
      tableList: ""
    };
  },
  computed: {
    ...mapState([
      "userinfo" //oa跳转过来的用户信息值
    ])
  },
  created() {
    Bus.$on("bussnessnumber", item => {
      if (item) {
        this.bussnessnumber = item;
      }
    });
    setTimeout(() => {
      this.getMemberTable();
    }, 2000);
    // 启动页面保存后更新表格数据
    Bus.$on("customercontactSave", item => {
      if (item) {
        this.getMemberTable();
      }
    });
  },
  methods: {
    dateChangebirthday(val) {
      console.log(val);
      this.value11 = val;
    }
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        console.log(this.datas);
      }
    }
  },
  methods: {
    handleEditEmail(index, row) {
      var reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (row.Email === "") {
        this.warnMessageEmail();
        return false;
      } else if (!reg.test(row.Email)) {
        this.validationEmail();
        return false;
      }
    },
    warnMessageEmail() {
      this.$message({
        showClose: true,
        message: "电子邮箱地址不能为空!",
        type: "warning"
      });
    },
    validationEmail() {
      this.$message({
        showClose: true,
        message: "电子邮箱地址格式不正确!",
        type: "warning"
      });
    },
    //获取客户干系人表格
    getMemberTable() {
      // console.log(this.bussnessnumber)
      // if(this.bussnessnumber){
      var id = "";
      if (this.$route.query.id) {
        id = this.$route.query.id;
      } else {
        id = localStorage.getItem("proId");
      }
      var params = {
        projectId: id
      };
      getProject("/sgpm/rest/api/server/pm/project/customercontact", params)
        .then(res => {
          // console.log(res)
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            localStorage.removeItem("addData");
            this.tableData = this.tableData.map(item => {
              return Object.assign(item, {
                ProjectId: id
              });
            });
            localStorage.setItem("addData", JSON.stringify(this.tableData));
            Bus.$emit("addTableData", res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
      // }
    },

    addRow(tableData, event) {
      //新增一行

      var size = this.tableData.length;
      if (size == 0) {
        tableData.push({
          LMName: "",
          CustomName: "",
          BusRole: "",
          Email: "",
          FAddress: "",
          ZipCode: "",
          MobilePhont: "",
          PostInfo: ""
        });
      } else if (
        (size > 0 && this.tableData[size - 1].LMName == "") ||
        this.tableData[size - 1].Email == "" ||
        this.tableData[size - 1].FAddress == "" ||
        this.tableData[size - 1].MobilePhont == "" ||
        this.tableData[size - 1].BusRole == ""
      ) {
        this.warnMessage();
        return;
      } else {
        tableData.push({
          LMName: "",
          CustomName: "",
          BusRole: "",
          Email: "",
          FAddress: "",
          ZipCode: "",
          MobilePhont: "",
          PostInfo: ""
        });
      }
    },

    //提示信息
    warnMessage() {
      this.$message({
        showClose: true,
        message:
          "姓名/电子邮箱地址/通讯地址/手机号/固定电话/客户成员角色不能为空",
        type: "warning"
      });
    },
    handleCurrentChange(row, event, column) {
      // console.log(this.tableData)
      var tableDataInfo = this.tableData;
      for (var i = 0; i < tableDataInfo.length; i++) {
        if (!tableDataInfo[i].id) {
          tableDataInfo[i].id = "";
        }
        // if(!tableDataInfo[i].businessNumber){
        // 	tableDataInfo[i].businessNumber = this.bussnessnumber;
        // 	}
        if (tableDataInfo[i].id) {
          delete tableDataInfo.id;
        }
      }
      let addData = tableDataInfo;
      var projectid = "";
      if (this.$route.query.id) {
        projectid = this.$route.query.id;
      } else {
        projectid = localStorage.getItem("proId");
      }
      addData = addData.map(item => {
        return Object.assign(item, {
          ProjectId: projectid
        });
      });
      console.log(addData);
      localStorage.removeItem("addData");
      localStorage.setItem("addData", JSON.stringify(addData));
      Bus.$emit("addData", addData);
      // console.log(row, event, column, event.currentTarget);
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.handleCurrentChange(); //值变化时更新localStorage数据
    },
    handleDelete(index, row) {
      console.log(index, row);
      //删除
      this.tableData.splice(index, 1);
      var params = {
        id: row.id
      };
      serverDeleteHttpMethod(
        "/sgpm/rest/api/server/pm/project/customercontact",
        params
      )
        .then(res => {
          console.log(res);
          this.getProject(this.bussnessnumber);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item .el-form-item {
	margin-bottom: 0px;
}
.tb-edit .el-select {
  display: none;
}

.tb-edit .current-row .el-select {
  display: block;
}

.tb-edit .current-row .el-select + span {
  display: none;
}

.tb-edit .el-input {
  display: none;
}

.tb-edit .current-row .el-input {
  display: block;
}

.tb-edit .current-row .el-input + span {
  display: none;
}

.addRow {
  float: right;
  margin-bottom: 10px;
  padding: 9px 15px;
  font-size: 12px;
}

.el-table--border th,
.el-table--border td {
  border-right: none !important;
}

.el-table {
  height: 419px !important;
}

.start {
  color: red;
}
</style>
<style lang="scss">
.tableClass {
  .el-form-item__error {
    position: relative !important;
  }
}
</style>
