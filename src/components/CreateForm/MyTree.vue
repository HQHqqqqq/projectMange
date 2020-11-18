<template>
  <div class="container">
    <el-row v-if="datas.options.isSpace==1" class="space">
      <el-select v-model="spaceVal" placeholder="请选择空间" @change="spaceChange">
        <el-option v-for="item in spaceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-row>
    <el-row class="search" justify="space-between	">
      <el-col :span="13">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      </el-col>
      <!--datas.options.isShowBtn 1 显示按钮，2不显示按钮-->
      <el-col :span="11" v-if="datas.options.isShowBtn==1" class="btn-item">
        <el-button size="mini" plain type="primary" icon="el-icon-plus" @click="addTree"></el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="delTree"></el-button>
      </el-col>
    </el-row>
    <!--datas.options.radio===1是单选，2，是多选-->
    <el-tree v-if="datas.options.radio==1" class="filter-tree" :data="treeData" :props="defaultProps" node-key="id"
      show-checkbox check-strictly :filter-node-method="filterNode" @node-click="handleNodeClick" ref="treeSingle"
      draggable @node-drop="handleDrop" :style="{height:asideHeight+'px'}" @check="handleSingleCheck"></el-tree>
    <el-tree v-if="datas.options.radio==2" class="filter-tree" :data="treeData" :props="defaultProps" node-key="id"
      show-checkbox :filter-node-method="filterNode" @node-click="handleNodeClick" ref="treeMultiple" draggable
      :style="{height:asideHeight+'px'}" @check="handleMultipleCheck"></el-tree>
  </div>
</template>

<script>
import config from "../../config";
import Bus from "../../bus";
import { dragMenu, systemInterface } from "../../api/api.js";
export default {
  name: "MyTree",
  props: ["widget", "models", "rules", "remote", "datas"],
  data() {
    return {
      //菜单树数据
      treeData: [],
      treeDataUrl: "",
      filterText: "",
      spaceVal: "5326994013938795629",
      defaultProps: {
        children: "children",
        label: "label"
      },
      curTreeNode: {},
      spaceOptions: config.spaceOptions
    };
  },
  watch: {
    datas: {
      deep: true,
      handler: function(val) {
        console.log(this.datas);
        console.log(this.datas.options.url_a);
      }
    },
    filterText(val) {
      this.$refs.treeSingle.filter(val);
    }
  },
  computed: {
    asideHeight: function() {
      return document.documentElement.clientHeight - 260;
    }
  },
  mounted() {
    // this.treeData = config.roleTreeData;
    this.getTreeData(this.spaceVal);
    Bus.$emit("spaceId", this.spaceVal);
  },
  created() {
    Bus.$on("reloadTree", item => {
      if (item) {
        this.getTreeData(this.spaceVal);
      }
    });
  },
  destroyed() {
    Bus.$off("addTree");
  },
  methods: {
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(this.treeData);
      dragMenu("/sgpm/rest/api/system/portal/menus/sort", this.treeData)
        .then(res => {
          if (res.status == 200) {
            // this.getTreeData(this.spaceVal);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取树  数据
    getTreeData(val) {
      var params = {};
      //菜单树 url
      this.treeDataUrl = this.datas.options.url_a;
      systemInterface(`${this.treeDataUrl}?companyId=${val}`, null)
        .then(res => {
          this.treeData = res.data.data.element;
          this.changeAttribute(this.treeData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //把name改成labal
    changeAttribute(list) {
      list.forEach(element => {
        element["label"] = element["name"];
        delete element["name"];
        if (element.children && element.children.length !== 0) {
          this.changeAttribute(element.children);
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(curNode, Node, self) {
      this.$refs.treeSingle.setCheckedKeys(Array.of(curNode.id));
      var treeNode = curNode;
      treeNode["parentNodeLabel"] = Node.parent.label;
      Bus.$emit("checkNode", treeNode);
      this.curTreeNode = curNode;
    },
    addTree() {
      Bus.$emit("addTree", true);
    },
    delTree() {
      console.log(this.curTreeNode);
    },
    //单选树
    handleSingleCheck(curNode, node) {
      if (node.checkedKeys.length > 0) {
        this.$refs.treeSingle.setCheckedKeys([curNode.id]);
        var treeNode = curNode;
        // treeNode["parentNodeLabel"] = node.parent.label;
        Bus.$emit("checkNode", treeNode);
        this.curTreeNode = curNode;
      }
    },
    //多选树
    handleMultipleCheck(Nodes, Keys) {},
    //空间选择
    spaceChange(val) {
      this.getTreeData(val);
      Bus.$emit("spaceId", val);
      this.$refs.treeSingle.setCheckedKeys([]);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .space {
    padding-bottom: 10px;
    border-bottom: 1px solid #d4d6d8;
    .el-select {
      display: block;
    }
  }
  .search {
    margin: 10px 0 0 0;
  }
  .filter-tree {
    overflow-y: auto;
  }
  .btn-item {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
