import cookie from 'vue-cookie'
export default {
  //添加treenode
  addNode(state, node) {
    // var array = state.checkTreeAry.filter(item => {
    //   return item.id != node;
    // });

    // var ary = [];
    // array.forEach(jtem => {
    //   ary.push(jtem.id);
    // });
    // var index = 0;
    // state.checkTreeAry.forEach((t, i) => {
    //   if (t.id == node) {
    //     index = i;
    //   }
    // });
    // state.checkTreeAry.splice(index, 1);
    // debugger
    state.checkTreeAry.push(node.id);
  },
  getUserInfo(state, node) {
    console.log(cookie)
    let userinfoCookie = {
      account_id: cookie.get('account_id'),
      JSESSIONID: cookie.get('JSESSIONID'),
      account_name: cookie.get('account_name'),
      code: cookie.get('code'),
      dept_id: cookie.get('dept_id'),
      dept_name: cookie.get('dept_name'),
      e_mail: cookie.get('e_mail'),
      emp_name: cookie.get('emp_name'),
      login_name: cookie.get('login_name'),
      memberid: cookie.get('memberid'),
      post_id: cookie.get('post_id'),
      post_name: cookie.get('post_name'),
      subdept_id: cookie.get('subdept_id'),
      subdept_name: cookie.get('subdept_name'),
      telnumber: cookie.get('telnumber'),
      token: cookie.get('token'),
    }
    // let personInfor = JSON.parse(localStorage.getItem("personInfor"));
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (cookie.get('memberid') != undefined) {
      state.userinfo = userinfoCookie;
      localStorage.setItem("userinfo", JSON.stringify(userinfoCookie))
      // localStorage.removeItem("menuList")
      // sessionStorage.setItem('loginIdentifier', 0)
    } else {
      state.userinfo = userinfo
    }
  },
  setDetailPage(state, node) {
    state.isDetail = node;
  },
  //缓存查询条件
  setCacheParams(state, node) {
    state.cacheParams = node
  },
  //缓存查询条件-合同列表
  setCacheContractParams(state, node) {
    state.cacheContractParams = node
  },
  //获取到当前选中的所有项目信息
  setAllProMsg(state, node) {
    state.selectedAllProMsg = node
  },
  //存储高级查询formModel表单的值
  setGJFromModel(state, node) {
    state.gjFromModel = node
  },
  //存储高级查询formModel表单的值-合同列表
  setGJFromContractModel(state, node) {
    state.gjFromContractModel = node
  },
  //存储高级查询checkoutlist的值
  setGJFromCheck(state, node) {
    state.gjFromCheckList = node
  },
  //获取待审流程
  setAudittableOneNum(state, node) {
    state.audittableOne = node
  },
  //获取待审流程
  setAudittableThreeNum(state, node) {
    state.audittableThreeDF = node
  },
  //获取已发流程
  setAudittableTwoYFNum(state, node) {
    state.audittableTwoYF = node
  },
  // getMenuListStore(state, node) {
  //   debugger
  //   state.menuListStore = node
  // }
};
