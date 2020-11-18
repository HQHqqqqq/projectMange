import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import cookie from 'vue-cookie'
// console.log(cookie)
export function getToken() {
    return cookie.get('token')
  }

// const request = axios.create({
//   withCredentials: false
// })

const request = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})


request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log('error', error)
    return Promise.reject(new Error(error).message)
  }
)

request.interceptors.response.use(
  response => {
    console.log('.....', response)
    return response.data
  },
  error => {
    console.log('error', error)
    return Promise.reject(new Error(error).message)
  }
)


/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
// request.adornUrl = (actionName) => {
//   // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
//   return '192.168.23.249:1004' + actionName
// 	
// }
// console.log(request.adornUrl('name'))
export default request

