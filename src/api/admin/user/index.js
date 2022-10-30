import request from '@/utils/request'
// 关联用户弹窗数据获取
export function page(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function addObjS(obj) {
  console.log(obj)
  return request({
    url: '/admin/user/addByPhone',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/admin/user/' + id,
    method: 'put',
    data: obj
  })
}
