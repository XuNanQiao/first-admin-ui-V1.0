
import request from '@/utils/request'

// 获取题库列表
export function getExamQuestionBankShare(query) {
  return request({
    url: '/exam/ExamBQuestionBankShare/getExamQuestionBankShare',
    method: 'get',
    params: query
  })
}
//试题列表
export function getExamBQuestions(query) {
  return request({
    url: '/exam/ExamBQuestion/getExamBQuestions',
    method: 'get',
    params: query
  })
}
//知识点接口
export function getKnowledgepoint(query) {
  return request({
    url: '/exam/ExamBCourseKnowledgepoint/getKnowledgepoint',
    method: 'get',
    params: query
  })
}
//添加试题接口
export function InsertQuestions(obj) {
  return request({
    url: '/exam/ExamBQuestion/InsertQuestions',
    method: 'post',
    data: obj
  })
}

//添加知识点
export function InsertKnowledgepoint(obj) {
  return request({
    url: '/exam/ExamBCourseKnowledgepoint/InsertKnowledgepoint',
    method: 'post',
    data: obj
  })
}

//题库分享列表接口
export function getExamQuestionBankShareByUserName(query) {
  return request({
    url: '/exam/ExamBQuestionBankShare/getExamQuestionBankShareByUserName',
    method: 'get',
    params: query
  })
}
//8) 分享老师选择接口
export function getUsersByTeacher(query) {
  return request({
    url: '/admin/user/getUsersByTeacher',
    method: 'get',
    params: query
  })
}
//题库分享接口
export function InsertQuestionbankshare(obj) {
  return request({
    url: '/exam/ExamBQuestionBankShare/InsertQuestionbankshare',
    method: 'post',
    data: obj
  })
}