import request from '@/utils/request'

export function loginByUsername(userName, password) {
  const data = {
    userName,
    password
  }
  return request({
    url: '/auth/jwt/token',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/admin/user/front/info',
    method: 'get',
    params: { token }
  })
}

export function getMenus(token) {
  return request({
    url: '/admin/user/front/menus',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/jwt/invalid',
    method: 'post'
  })
}
//
export function getImage(query) {
  return request({
    url: '/auth/captcha/getImage',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
//
export function check(query) {
  return request({
    url: '/auth/captcha/check',
    method: 'get',
    params: query
  })
}