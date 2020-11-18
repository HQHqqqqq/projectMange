// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import 'form-making/dist/FormMaking.css'
import Fragment from 'vue-fragment'

Vue.use(Fragment.Plugin)


import Vue from 'vue'
import App from './App'

import ElementUI from 'element-ui';

import axios from 'axios'
import '../config/axios'
import Qs from 'qs'

import request from '@/util/request'


Vue.prototype.axios = axios

Vue.prototype.qs = Qs;

Vue.prototype.$request = request

Vue.use(ElementUI);

import 'element-ui/lib/index.js'
import 'form-making/dist/FormMaking.umd.js'
import router from './router'
import './assets/icon/iconfont.css'
import './util/directives.js'
import util from './util/util.js'

Vue.prototype.util = util


import store from './store/'
import ProjectInformation from './components/ProjectInformation/ProjectInformation'

Vue.component('ProjectInformation', ProjectInformation);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
