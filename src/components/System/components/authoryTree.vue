<template>
  <div class="child-tree">
    <el-row>
      {{defaultChecked}}
      <el-col :span="13">
        <el-row>
          <el-col :span="15">
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
          :default-checked-keys="defaultChecked"
          @check="handleCheck"
        ></el-tree>
      </el-col>
      <el-col :span="3"></el-col>
    </el-row>
  </div>
</template>

<script>
import Bus from "../../../bus";
import config from "../../../config";
import { submitMemberByRole } from "../../../api/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "authoryTree",
  props: ["treeData", "defaultChecked"],
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
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  watch: {
    filterText(val) {
      this.$refs.childTree.filter(val);
    }
  },

  mounted() {},
  created() {},
  methods: {
    handleCheck(nodes, keys) {},
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    setDefaultCheck(ids) {
      this.$refs.childTree.setCheckedKeys(ids);
    },
    submit() {}
  }
};
</script>

<style lang="scss">
.child-tree {
  overflow-y: auto;
  .tag {
    display: block;
    margin: 10px 0;
    width: 60%;
  }
}
</style>
