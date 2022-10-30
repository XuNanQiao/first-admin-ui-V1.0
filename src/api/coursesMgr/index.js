import request from '@/utils/request'

// 课程管理
export function getExamACourse(query) {
  return request({
    url: '/exam/ExamACourse/getExamACourse',
    method: 'get',
    params: query
  })
}

// 学期选项查询
export function getExamATerm(query) {
  return request({
    url: '/exam/ExamATerm/getExamATerm',
    method: 'get',
    params: query
  })
}

// 班级查询
export function getQueryClass(query) {
  return request({
    url: '/exam/BaseDepartment/getQueryClass',
    method: 'get',
    params: query
  })
}

// 本学期开设科目查询
export function getTermSubjectQuery(query) {
  return request({
    url: '/exam/ExamACourseTerm/getTermSubjectQuery',
    method: 'get',
    params: query
  })
}

// 老师教授的课程查询接口
export function getTeacherByExamACourseTerm(query) {
  return request({
    url: '/exam/ExamACourseTerm/getTeacherByExamACourseTerm',
    method: 'get',
    params: query
  })
}

//新增课程接口
export function InstallExamACourseTerm(obj) {
  return request({
    url: '/exam/ExamACourseTerm/InstallExamACourseTerm',
    method: 'post',
    data: obj
  })
}