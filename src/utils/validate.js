// 断是否是IE 11及以下或者其他(其他里包括IE edge)
export function isIE() {
  // if (document.documentMode) return document.documentMode;
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE || isIE11) {
    return true
  } else {
    return false
  }
}
// 注册手机号验证
export function phoneRegeFun(phone) {
  const phoneRege = /^(((13|14|15|16|18|17|19)\d{9}))$/;
  return phoneRege.test(phone)
}
// 注册密码验证
export function paswordRegeFun(val) {
  const paswordRege = /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,8}$/
  return paswordRege.test(val)
}