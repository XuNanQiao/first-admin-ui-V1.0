import request from '@/utils/request'

// 权限分配弹窗点击左侧tree获取右侧table列表
export function page(query) {
  return request({
    url: '/admin/element/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/element',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/element/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/element/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/admin/element/' + id,
    method: 'put',
    data: obj
  })
}
