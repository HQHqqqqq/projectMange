<template>
  <div class="menu-item">
    <el-form ref="form" :model="menuBaseForm" :inline="true" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序">{{menuBaseForm.sortIndex}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单名称">
            <el-input v-model="menuBaseForm.label" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单code">
            <el-input v-model="menuBaseForm.code" placeholder="请输入菜单code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否叶子节点">
            <el-switch v-model="menuBaseForm.isLeaf" placeholder="请选择"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否显示">
            <el-switch v-model="menuBaseForm.isShow" placeholder="请选择"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="模板">
            <el-radio v-model="menuBaseForm.saveType" label="1">
              <el-select
                v-model="menuBaseForm.path"
                filterable
                placeholder="请选择模板"
                :disabled="pathDisabled"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in pathSelect"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="模板地址">
            <el-radio v-model="menuBaseForm.saveType" label="2">
              <el-input
                v-model="menuBaseForm.address"
                placeholder="请输入模板地址"
                :disabled="menuBaseForm.saveType=='1'"
              ></el-input>
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" @click="save" :disabled="btnDisabled" size="small">{{btnMsg}}</el-button>
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
import { addOrEditMenu } from "../../../api/api";
export default {
  name: "menuItem",
  components: {},
  data() {
    return {
      menuBaseForm: {
        path: "",
        saveType: "",
        address: ""
      },
      pathSelect: config.templaSelect,
      //树的根节点
      pid: null,
      addOrEditBtn: true,
      btnMsg: "保存",
      id: null,
      btnDisabled: true,
      //模板是否可编辑，如果配置模板地址后，模板选项就不可编辑，并且默认值为暂无模板
      pathDisabled: false,
      //空间id
      companyId: null
    };
  },
  watch: {
    "menuBaseForm.saveType": function(newVal, oldVal) {
      if (newVal == "2") {
        //如果值为2说明是模板地址模板不可编辑
        this.pathDisabled = true;
        // this.menuBaseForm.path = "./externalPage";
      } else {
        this.pathDisabled = false;
        // this.menuBaseForm.address = "";
      }
    }
  },
  mounted() {},
  created() {
    Bus.$on("spaceId", item => {
      this.companyId = item;
    });
    Bus.$on("checkNode", item => {
      let obj = JSON.parse(JSON.stringify(item));
      obj.isLeaf = !!obj.isLeaf;
      obj.isShow = !!obj.isShow;
      this.menuBaseForm = obj;
      this.pid = obj.pid;
      this.id = obj.id;
      this.addOrEditBtn = false;
      this.btnDisabled = false;
      this.btnMsg = "修改";
    });
    Bus.$on("addTree", item => {
      if (item) {
        this.menuBaseForm = {};
        console.log(this.pid);
        //为ture说明是添加
        this.addOrEditBtn = true;
        this.btnDisabled = false;
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
  methods: {
    //保存菜单
    save() {
      //保存时如果没有选中节点就是添加到根节点上
      if (this.pid == null) {
        this.pid = 0;
      }
      var params = {
        moduleCode: this.menuBaseForm.code,
        moduleName: this.menuBaseForm.label,
        sortIndex: 0,
        isShow: this.menuBaseForm.isShow * 1 || 0,
        isLeaf: this.menuBaseForm.isLeaf * 1 || 0,
        icon: "",
        path: this.menuBaseForm.path || "",
        remark: "",
        pid: this.id || 0,
        //选择的空间就是公司id
        companyId: this.companyId,
        showType: null, //0表示当前页面，1表示弹出页面显示
        saveType: this.menuBaseForm.saveType,
        address: this.menuBaseForm.address
      };
      let method = this.addOrEditBtn ? "post" : "put";
      if (method === "put") {
        //修改时需要有自己的id和pid，添加的时候不需要有自己的id
        params["id"] = this.id;
        params.pid = this.pid;
      }
      console.log(params);
      //添加菜单url
      addOrEditMenu("/sgpm/rest/api/system/portal/menus", params, method)
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
      this.menuBaseForm = {};
      this.btnMsg = "保存";
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/css/common.css";
.menu-item {
  padding: 0 0 0 20px;
  height: 200px;
}
</style>
