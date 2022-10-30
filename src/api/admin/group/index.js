import request from '@/utils/request'
// tab
export function getAllGroupTypes() {
  return request({
    url: '/admin/groupType/all',
    method: 'get'
  })
}

// 获取左侧tree列表
export function fetchTree(query) {
  return request({
    url: '/admin/group/tree',
    method: 'get',
    params: query
  })
}
// 新增左侧列表
export function addObj(obj) {
  return request({
    url: '/admin/group',
    method: 'post',
    data: obj
  })
}
// 点击左侧tree获取详情
export function getObj(id) {
  return request({
    url: '/admin/group/' + id,
    method: 'get'
  })
}
// 删除左侧tree节点
export function delObj(id) {
  return request({
    url: '/admin/group/' + id,
    method: 'delete'
  })
}

// 编辑按钮
export function putObj(id, obj) {
  return request({
    url: '/admin/group/' + id,
    method: 'put',
    data: obj
  })
}

// 关联用户
export function getUsers(id) {
  return request({
    url: '/admin/group/' + id + '/user',
    method: 'get'
  })
}
// 关联用户保存按钮
export function modifyUsers(id, data) {
  return request({
    url: '/admin/group/' + id + '/user',
    method: 'put',
    params: data
  })
}
// 权限分配弹窗左侧table取消选中
export function removeElementAuthority(id, data) {
  return request({
    url: '/admin/group/' + id + '/authority/element/remove',
    method: 'post',
    params: data
  })
}
// 权限分配弹窗左侧table选中
export function addElementAuthority(id, data) {
  return request({
    url: '/admin/group/' + id + '/authority/element/add',
    method: 'post',
    params: data
  })
}
// 手动全选删除
export function removeElementAuthorityBatch(id, data) {
  return request({
    url: '/admin/group/' + id + '/authority/element/removeBatch',
    method: 'post',
    params: data
  })
}
// 手动全选增加
export function addElementAuthorityBatch(id, data) {
  return request({
    url: '/admin/group/' + id + '/authority/element/addBatch',
    method: 'post',
    params: data
  })
}
// 权限分配弹窗点击左侧tree获取table选中的
export function getElementAuthority(id) {
  return request({
    url: '/admin/group/' + id + '/authority/element',
    method: 'get'
  })
}

// 权限分配弹窗点击保存按钮
export function modifyMenuAuthority(id, data) {
  return request({
    url: '/admin/group/' + id + '/authority/menu',
    method: 'post',
    params: data
  })
}

// 点击权限分配按钮 弹窗获取左侧tree
export function getMenuAuthority(id) {
  return request({
    url: '/admin/group/' + id + '/authority/menu',
    method: 'get'
  })
}
