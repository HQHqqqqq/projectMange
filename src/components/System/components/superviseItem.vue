<template>
  <div class="menu-item">
    <el-row>
      <el-col :span="24">
        <!-- <child-tree :tree-data="memberTree"></child-tree> -->
        <div class="child-tree">
          <el-row>
            <el-col :span="13">
              <el-row>
                <el-col :span="11">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                </el-col>
              </el-row>
              <el-tree
                :data="superviseData"
                show-checkbox
                node-key="id"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="superviseTree"
                check-strictly
                @check="handleCheck"
              ></el-tree>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">
                <el-tag
                  v-for="tag in tagAry"
                  :key="tag.id"
                  closable
                  @close="closeTag(tag.id)"
                  class="tag"
                >{{tag.departmentName}}</el-tag>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="3" :push="17">
            <el-button type="primary" @click="submit" size="small">提交</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Bus from "../../../bus";
import config from "../../../config";
import {
  getGroupTree,
  getSuperviseByRoleId,
  submitSuperviseByRole
} from "../../../api/api";
export default {
  name: "superviseItem",
  components: {},
  data() {
    return {
      superviseData: [],
      RoleId: null,
      filterText: "",
      tagAry: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      //当前tree是否选中
      isChecked: false,
      treeData: [],
      //当前树节点的id
      id: null,
      checkKeys: [],
      checkNodes: []
    };
  },
  mounted() {
    this.getMemberTreeData();
  },
  watch: {
    filterText(val) {
      this.$refs.superviseTree.filter(val);
    }
  },
  created() {
    Bus.$on("checkNode", item => {
      let obj = JSON.parse(JSON.stringify(item));
      this.RoleId = obj.id;
      this.getSuperviseByRole(this.RoleId);
    });
  },
  updated() {
    // this.delLeafData(this.superviseData);
  },
  methods: {
    //获取所有成员信息
    getMemberTreeData() {
      getGroupTree("/system/group/tree", null)
        .then(res => {
          let result = res.data.data;
          this.superviseData = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除叶子节点
    delLeafData(list) {
      let that = this;
      list.forEach(item => {
        if (item.children && item.children.length >= 0) {
          this.delLeafData(item.children);
        } else {
          that.$refs.superviseTree.remove(item);
        }
      });
    },

    //通过角色获取监管部门
    getSuperviseByRole(id) {
      getSuperviseByRoleId(
        `/sgpm/rest/api/system/role/scopes?roleId=${this.RoleId}`,
        null
      )
        .then(res => {
          let result = res.data.data;
          // this.checkNodes = [];
          let checkNodes = [];
          let checkKeys = [];
          result.forEach(ele => {
            checkKeys.push(ele.departmentId);
            checkNodes.push(ele);
          });
          this.checkKeys = checkKeys;
          if (this.$refs.superviseTree) {
            this.$refs.superviseTree.setCheckedKeys(checkKeys);
          }

          this.tagAry = checkNodes;
        })
        .catch(err => {
          console.log(err);
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data.label) {
        return data.label.indexOf(value) !== -1;
      }
    },
    handleCheck(node, keys) {
      let ary = [];
      keys.checkedNodes.forEach(item => {
        ary.push({
          roleId: this.RoleId,
          departmentId: item.id,
          departmentName: item.label,
          companyId: item.accountId,
          companyName: item.accountName,
          type: item.type
        });
      });
      this.tagAry = ary;
    },
    closeTag(tag) {
      console.log(this.tagAry);
      var array = this.tagAry.filter(item => {
        return item.id != tag;
      });

      var ary = [];
      array.forEach(jtem => {
        ary.push(jtem.id);
      });
      var index = 0;
      this.tagAry.forEach((t, i) => {
        if (t.id == tag) {
          index = i;
        }
      });

      this.$refs.superviseTree.setCheckedKeys(ary);
      this.tagAry.splice(index, 1);
    },
    submit() {
      var param = this.tagAry;
      if (this.tagAry.length == 0) {
        param = [
          {
            roleId: this.RoleId
          }
        ];
      }
      console.log(param);
      submitSuperviseByRole("/sgpm/rest/api/system/role/scopes", param)
        .then(res => {
          if (res.data.code == "200") {
            this.$message({
              message: "操作成功",
              type: "success"
            });

            localStorage.removeItem("menuList");
          } else {
            this.$message({
              message: "操作失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
.menu-item {
  .child-tree {
    overflow-y: auto;
    max-height: 500px;
    .tag {
      display: block;
      margin: 10px 0;
      width: 60%;
    }
  }
}
</style>
