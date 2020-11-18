<template>
  <div class="child-tree">
    <el-row>
      <el-col :span="13">
        <el-row>
          <el-col :span="11">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          </el-col>
        </el-row>
        <el-tree
          :data="treeData"
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
      <el-col :span="3">
        <el-button type="primary" @click="submit">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Bus from "../../../bus";
import config from "../../../config";
import { submitMemberByRole } from "../../../api/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "childTree",
  props: ["treeData"],
  components: {},
  computed: {
    ...mapState({
      TreeAryChecked: state => {
        return state.checkTreeAry;
      }
    })
  },
  data() {
    return {
      filterText: "",
      tagAry: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      //当前tree是否选中
      isChecked: false,
      listData: this.treeData,
      //当前树节点的id
      id: null,
      checkKeys: [],
      checkNodes: []
    };
  },

  watch: {
    filterText(val) {
      this.$refs.childTree.filter(val);
    }
  },

  mounted() {
    Bus.$on("memberList", item => {
      this.checkNodes = [];
      item.forEach(ele => {
        this.checkKeys.push(ele.id);
        this.checkNodes.push(ele);
      });
      console.log(this.checkKeys);
      this.$refs.childTree.setCheckedKeys(this.checkKeys);
      console.log(this.checkNodes);
      this.tagAry = this.checkNodes;
    });
  },
  created() {
    Bus.$on("checkNode", item => {
      let obj = JSON.parse(JSON.stringify(item));
      this.id = obj.id;
      //通过角色获取成员，默认让树选中
      // this.$refs.childTree.setCheckedKeys([3]);
    });
  },
  methods: {
    ...mapActions({ addTreeNode: "addNode" }),
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCheck(node, keys) {
      let ary = [];
      keys.checkedNodes.forEach(item => {
        ary.push({
          id: item.id,
          roleId: this.id,
          type: item.type,
          label: item.label,
          accountId: item.accountId
        });
      });
      this.tagAry = ary;
    },
    //给树结构加禁用状态
    addTreeDisabled(ary) {
      ary.forEach(element => {
        element["disabled"] = true;
        if (element.children && element.children.length !== 0) {
          this.addTreeDisabled(element.children);
        }
      });
    },
    setChildrenNode(ary) {
      ary.forEach(item => {
        this.addTreeNode(item.id);
        if (item.children && item.children.length !== 0) {
          this.setChildrenNode(item.children);
        }
      });
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
            roleId: this.id
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" >
.child-tree {
  overflow-y: auto;
  .tag {
    display: block;
    margin: 10px 0;
    width: 60%;
  }
}
</style>
