import request from '@/utils/request'

export function getDepartmentsByToken(query) {
  return request({
    url: '/admin/BaseDepartment/getDepartmentsByToken',
    method: 'get',
    params: query
  })
}
export function getUsersByDpmt(query) {
  return request({
    url: '/admin/user/getUsersByDpmt',
    method: 'get',
    params: query
  })
}