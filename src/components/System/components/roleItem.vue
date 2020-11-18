<template>
  <div class="menu-item">
    <el-form ref="form" :model="roleBaseForm" :inline="true" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色名称">
            <el-input v-model="roleBaseForm.label" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色code">
            <el-input v-model="roleBaseForm.roleCode" placeholder="请输入角色code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色备注">
            <el-input v-model="roleBaseForm.remark" placeholder="请输入角色备注"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否PMO">
            <el-switch v-model="roleBaseForm.isPmo"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" @click="save" :disabled="btnDisabled" size="small">确定</el-button>
            <el-button @click="cancel" size="small">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Bus from "../../../bus";
import config from "../../../config";
import { addOrEditRole } from "../../../api/api";
export default {
  name: "roleItem",
  components: {},
  data() {
    return {
      roleBaseForm: {
        isPmo: true
      },
      btnMsg: "保存",
      btnDisabled: true,
      addOrEditBtn: true,
      id: null,
      pid: null
    };
  },
  watch: {
    "roleBaseForm.isPmo": {
      handler(newName, oldName) {
        Bus.$emit("isPmo", newName);
      }
    }
  },
  mounted() {
    if (this.roleBaseForm.isPmo) {
      Bus.$emit("isPmo", this.roleBaseForm.isPmo);
    }
  },
  created() {
    Bus.$on("checkNode", item => {
      let obj = JSON.parse(JSON.stringify(item));
      this.roleBaseForm = obj;
      this.roleBaseForm.isPmo = obj.isPmo == 1 ? true : false;
      this.btnDisabled = false;
      this.addOrEditBtn = false;
      this.pid = obj.pid;
      this.id = obj.id;
      this.btnMsg = "修改";
    });
    Bus.$on("addTree", item => {
      if (item) {
        this.roleBaseForm = {};
        this.btnDisabled = false;
        //为ture说明是添加
        this.addOrEditBtn = true;
        this.btnMsg = "保存";
        if (this.pid === null) {
          this.$message({
            message: "请选择菜单节点，如果不选择默认添加一级菜单",
            type: "warning"
          });
        }
      }
    });
  },
  computed: {},
  methods: {
    pmoChange(val) {},
    //保存角色
    save() {
      //保存时如果没有选中节点就是添加到根节点上
      if (this.pid == null) {
        this.pid = 0;
      }
      var params = {
        roleCode: this.roleBaseForm.roleCode,
        name: this.roleBaseForm.label,
        sortIndex: 0,
        remark: this.roleBaseForm.remark,
        pid: this.id || 0,
        isPmo: this.roleBaseForm.isPmo ? 1 : 0
      };
      let method = this.addOrEditBtn ? "post" : "put";
      if (method === "put") {
        //修改时需要有自己的id和pid，添加的时候不需要有自己的id
        params["id"] = this.id;
        params.pid = this.pid;
      }

      console.log(params);
      //添加/修改角色
      addOrEditRole("/sgpm/rest/api/system/role", params, method)
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          //重新加载菜单树
          Bus.$emit("reloadTree", true);
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.roleBaseForm = {};
    }
  }
};
</script>

<style lang="scss">
.menu-item {
}
</style>
