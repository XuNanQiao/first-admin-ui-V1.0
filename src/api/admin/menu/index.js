import request from '@/utils/request'

// 权限分配接口
export function fetchTree(query) {
  return request({
    url: '/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/admin/menu/all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/admin/menu/' + id,
    method: 'put',
    data: obj
  })
}

export function passObj(obj) {
  return request({
    url: '/baascore/dataDictionary/confirmPassword',
    method: 'post',
    data: obj
  })
}

export function updatePassObj(obj) {
  return request({
    url: '/baascore/dataDictionary/updatePassword',
    method: 'post',
    data: obj
  })
}
