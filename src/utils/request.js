import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_PATH, // api的base_url
  // headers: {
  //     "content-type": "application/json" ,
  // },
  timeout: 300000 // 请求超时时间
})
axios.defaults.timeout = 300000

// request拦截器
service.interceptors.request.use(config => {
  requestUse(config) // 拦截操作
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  return checkResponse(response)
},
error => {
  console.log('err' + error)// for debug
  Message({
    message: '网络异常,请检查网络',
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

/**
 * 请求拦截
 */
function requestUse(config) {
  if (store.getters.token) {
    config.headers['Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
}

function checkResponse(response) {
  /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
  const res = response.data
  if (response.status === 1002) {

  }
  if (res.status === 2003) {
    Message({
      message: '当前用户无相关操作权限！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject('error')
  }
  // 新增用户冻结
  if (res.status === 6002) {
    Message({
      message: res.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject('error')
  }
  if (response.status !== 200) {
    // *暂时注掉，有需要在取消
    // Message({
    //   message: res.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return response.data
    // return Promise.reject('error')
  } else {
    return response.data
  }
}

export default service
