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
                v-loading="loading"
                element-loading-text="拼命加载中"
                :data="memberTree"
                show-checkbox
                node-key="id"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="childTree"
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
                >{{tag.label}}</el-tag>
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
  getGroupTreeByRole,
  submitMemberByRole
} from "../../../api/api";
export default {
  name: "memberItem",
  components: {},
  data() {
    return {
      memberTree: [],
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
      checkNodes: [],
      loading:true
    };
  },
  mounted() {
    this.getMemberTreeData();
  },
  watch: {
    filterText(val) {
      this.$refs.childTree.filter(val);
    }
  },
  created() {
    Bus.$on("checkNode", item => {
      let obj = JSON.parse(JSON.stringify(item));
      this.RoleId = obj.id;
      this.getMemberByRole(this.RoleId);
    });
  },
  methods: {
    //获取所有成员信息
    getMemberTreeData() {
      getGroupTree("/system/group/tree", null)
        .then(res => {
          this.loading = false
          this.memberTree = res.data.data;

        })
        .catch(err => {
          console.log(err);
        });
    },
    //通过角色获取成员信息
    getMemberByRole(id) {
      getGroupTreeByRole(`/sgpm/rest/api/system/role/member/${id}`, null)
        .then(res => {
          let result = res.data.data;
          // this.checkNodes = [];
          let checkNodes = [];
          let checkKeys = [];
          result.forEach(ele => {
            checkKeys.push(ele.id);
            checkNodes.push(ele);
          });
          this.checkKeys = checkKeys;
          if (this.$refs.childTree) {
            this.$refs.childTree.setCheckedKeys(checkKeys);
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
          id: item.id,
          roleId: this.RoleId,
          type: item.type,
          label: item.label,
          accountId: item.accountId
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

      this.$refs.childTree.setCheckedKeys(ary);
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
      submitMemberByRole("/sgpm/rest/api/system/role/member", param)
        .then(res => {
          if (res.status == "200") {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            localStorage.removeItem("menuList");
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
    max-height: 400px;
    .tag {
      display: block;
      margin: 10px 0;
      width: 60%;
    }
  }
}
</style>
