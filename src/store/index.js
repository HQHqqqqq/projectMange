import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'


Vue.use(Vuex)

const state = {
  leftNavState: '',
  //选中的树节点
  checkTreeAry: [],
  //登录人的信息
  userinfo: {},
  //审核页面跳转到详情
  isDetail: false,
  //缓存查询条件，在每次返回的时候记住查询条件
  cacheParams: {
    code: "All",
    pageNum: 1,
    pageSize: 20
  },
  //缓存查询条件，在每次返回的时候记住查询条件-合同列表
  cacheContractParams: {
  },
  //获取到当前选中的所有项目信息
  selectedAllProMsg: {},
  //高级刷选formModel的的值-项目列表
  gjFromModel: {
    domains: [{
      value: "",
      value1: "",
      isDisabled: false
    }]
  },
  //高级刷选formModel的的值-合同列表
  gjFromContractModel: {
    domains: [{
      value: "",
      value1: "",
      isDisabled: false
    }]
  },
  //高级刷选复选框里的值
  gjFromCheckList: [],
  //待审流程审批列表数字
  audittableOne: null,
  //待发流程审批列表数字
  audittableThreeDF: null,
  //已发流程审批列表数字
  audittableTwoYF: null,
  //如果没有登录的情况，正式环境中获取到userinf就直接进入系统不需要登录
  // menuListStore: []
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
