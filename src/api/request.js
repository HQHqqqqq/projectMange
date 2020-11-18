import axios from 'axios' // 引入axios
import { getToken } from '@/util/request'
export function request(options) {
  return new Promise((resolve, reject) => {
     var userToken = getToken();
      const instance = axios.create({ // instance创建一个axios实例，可以自定义配置，可在 axios文档中查看详情
        // 所有的请求都会带上这些配置，比如全局都要用的身份信息等。
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          'Authorization': userToken,//token从全局变量那里传过来
        },
        timeout: 30 * 1000 // 30秒超时
      })
      instance(options)
        .then(res => { // then 请求成功之后进行什么操作
          resolve(res) // 把请求到的数据发到引用请求的地方
        })
        .catch(err => {
          console.log('请求异常信息：' + err)
          reject(err)
        })
    

    // 			instance.interceptors.request.use(config => {
    //     // console.log(config.data.status)
    //     // console.log(store.state.User.token)
    //     // 让每个请求携带自定义token
    // 				if (config.method === 'post') {
    // 						config.data = qs.stringify(config.data)
    // 				}
    // 
    // 				return config
    // 			}, error => {
    // 				console.log(error)
    // 				Promise.reject(error)
    // 			})

    //用qs解析，jsonToForm
    // 				axios.interceptors.request.use(config => {
    // 					if(config.type == 'formData' || config.method != 'post'){
    // 						return config
    // 					}
    // 					config.data = qs.stringify(config.data)
    // 					return config
    // 				}, (err) =>{
    // 					Message.error({
    // 						message: '加载超时'
    // 					});
    // 					return Promise.reject(err);
    // 				})

  })
}
