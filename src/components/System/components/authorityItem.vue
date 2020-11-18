<template>
  <div class="authority-item">
    <el-row>
      <div class="authorityTree">
        <el-tree :data="menuData" ref="menuRef" show-checkbox node-key="id" check-on-click-node :props="defaultProps"
          @check="handleCheck"></el-tree>
      </div>
      <el-col :span="3" :push="17">
        <el-button type="primary" @click="submit" size="small">提交</el-button>
      </el-col>

      <!-- <el-col :span="8" :push="2">
        <el-tree
          :data="childMmenuData"
          ref="childMmenuRef"
          :default-expand-all="false"
          node-key="id"
        ></el-tree>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import Bus from "../../../bus";
import config from "../../../config";
import {
  getProjectMenu,
  getProjectMenuByRole,
  authoritySubmit,
  authorityCancel
} from "../../../api/api";
import authoryTree from "@/components/System/components/authoryTree";
import { mapState, mapActions } from "vuex";
export default {
  name: "authorityItem",
  components: { authoryTree },
  data() {
    return {
      menuData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //角色id
      roleId: "",
      //当前角色拥有的菜单，筛选后的数据
      childMmenuData: [],
      checkedKeys: [],
      checkParam: [],
      delTreeIds: [],
      spaceOptions: config.spaceOptions,
      companyId: "5326994013938795629"
    };
  },
  mounted() {
    this.getAllMenu(this.companyId);
  },
  computed: {},
  created() {
    Bus.$on("spaceId", item => {
      this.companyId = item;
      this.getAllMenu(this.companyId);
    });
    Bus.$on("checkNode", item => {
      let obj = JSON.parse(JSON.stringify(item));
      this.roleId = obj.id;
      this.getMenuByRollId(this.roleId, this.companyId);
    });
  },
  methods: {
    //获取所有菜单
    getAllMenu(companyId) {
      getProjectMenu(
        "/sgpm/rest/api/system/portal/menus?companyId=" + companyId,
        null
      )
        .then(res => {
          let result = res.data.data.element;
          this.changeAttribute(result);
          this.menuData = result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //通过角色获取菜单,companyId选中的公司id
    getMenuByRollId(id, companyId) {
      let ids = [];
      let that = this;
      getProjectMenuByRole(
        `/sgpm/rest/api/system/portal/menus/role/${id}/${companyId}`,
        null
      )
        .then(res => {
          let result = res.data.data.element;
          result.forEach(item => {
            ids.push(item.id);
          });
          that.checkedKeys = ids;
          if (that.$refs.menuRef) {
            that.$refs.menuRef.setCheckedKeys(ids);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取所有选中的node
    getCheckNodeByRole() {
      let checkedNodes = this.$refs.menuRef.getCheckedNodes(true, false);
      // console.log(checkedNodes);
      // let resultAry = [];
      // let tempId = [];
      // checkedNodes.forEach(ele => {
      //   if (this.checkedKeys.indexOf(ele.id) > -1) {
      //     if (tempId.indexOf(ele.id) == -1) {
      //       resultAry.push(ele);
      //       tempId.push(ele.id);
      //       if (ele.children && ele.children.length > 0) {
      //         ele.children.forEach(jtem => {
      //           tempId.push(jtem.id);
      //         });
      //       }
      //     }
      //   }
      // });
      this.childMmenuData = checkedNodes;
      console.log(checkedNodes);
    },
    handleCheck(cur, node) {
      // if (node.checkedKeys.indexOf(cur.id) == -1) {
      //   let array = [];
      //   array.push(cur);
      //   this.delTreeIds = [];
      //   this.getDelCheckId(array);
      //   let param = [];
      //   this.delTreeIds.forEach(id => {
      //     param.push(
      //       Object.assign(
      //         {},
      //         {
      //           roleId: this.roleId,
      //           moduleId: id
      //         }
      //       )
      //     );
      //   });
      //   console.log(param);
      //   debugger;
      //   this.cancelAuthority(param);
      // }
      let allNode = node.checkedNodes.concat(node.halfCheckedNodes);
      this.checkParam = this.setModuleObj(allNode);
      console.log(this.checkParam);
    },
    //取消授权
    cancelAuthority(param) {
      authorityCancel(`/sgpm/rest/api/system/portal/menus/role/relation`, param)
        .then(res => {
          // this.$message({
          //   message: "取消授权成功",
          //   type: "success"
          // });
          localStorage.removeItem("menuList");
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit() {
      //首先获取当前被选中的节点
      let curChecked = this.$refs.menuRef.getCheckedNodes();
      let param = this.checkParam;
      if (this.checkParam.length == 0 && curChecked.length == 0) {
        param = [{ roleId: this.roleId }];
      } else if (this.checkParam.length == 0 && curChecked.length != 0) {
        param = this.setModuleObj(curChecked);
      } else {
        param = this.checkParam;
      }
      param.sort(function(a, b) {
        return a.moduleId - b.moduleId;
      });
      console.log(JSON.stringify(param));
      authoritySubmit(`/sgpm/rest/api/system/portal/menus/role/relation`, param)
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          localStorage.removeItem("menuList");
          localStorage.removeItem("userinfo");
          // this.$router.push({
          //   path: "/"
          // });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取删除授权节点的id
    getDelCheckId(ary) {
      ary.forEach(item => {
        this.delTreeIds.push(item.id);
        if (item.children && item.children.length != 0) {
          this.getDelCheckId(item.children);
        }
      });
    },
    setModuleObj(list) {
      let ary = [];
      list.forEach(item => {
        ary.push(
          Object.assign(
            {},
            {
              roleId: this.roleId,
              moduleId: item.id
            }
          )
        );
      });
      return ary;
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
    //空间选择
    spaceChange(val) {
      this.getAllMenu(val);
    }
  }
};
</script>

<style lang="scss">
.authority-item {
  .authorityTree {
    overflow-y: auto;
    max-height: 450px;
  }
}
</style>
