import {
  getNav,
  login
} from "@/api/api.js";
import config from "../config";
export default {
  addNode({
    commit,
    state
  }, node) {
    commit('addNode', node)
  },
  getUserInfo({
    commit,
    state
  }, node) {
    commit('getUserInfo', node)
  },
  setDetailPage({
    commit,
    state
  }, node) {
    commit('setDetailPage', node)
  },
  setCacheParams({
    commit,
    state
  }, node) {
    commit('setCacheParams', node)
  },
  setCacheContractParams({
    commit,
    state
  }, node) {
    commit('setCacheContractParams', node)
  },
  setAllProMsg({
    commit,
    state
  }, node) {
    commit('setAllProMsg', node)
  },
  setGJFromModel({
    commit,
    state
  }, node) {
    commit('setGJFromModel', node)
  },
  setGJFromContractModel({
    commit,
    state
  }, node) {
    commit('setGJFromContractModel', node)
  },
  setGJFromCheck({
    commit,
    state
  }, node) {
    commit('setGJFromCheck', node)
  },
  setAudittableOneNum({
    commit,
    state
  }, node) {
    commit('setAudittableOneNum', node)
  },
  setAudittableThreeNum({
    commit,
    state
  }, node) {
    commit('setAudittableThreeNum', node)
  },
  setAudittableTwoYFNum({
    commit,
    state
  }, node) {
    commit('setAudittableTwoYFNum', node)
  },
  // async getMenuListStore({
  //   commit
  // }) {
  //   var userinfo = JSON.parse(localStorage.getItem("userinfo"));
  //   await getNav(
  //       `/sgpm/rest/api/system/portal/menus/${userinfo.memberid}?deptId=${userinfo.dept_id}&subDeptId=${userinfo.subdept_id}&accountId=${userinfo.account_id}`
  //     )
  //     .then(res => {
  //       debugger
  //       var menu = res.data.data;
  //       console.log(menu);
  //       this.menuList = config.menuList;
  //       commit('getMenuListStore', config.menuList);
  //       localStorage.setItem("menuList", JSON.stringify(config.menuList));
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // },
}
