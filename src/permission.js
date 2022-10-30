import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken} from '@/utils/auth' // getToken from cookie

NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/404', '/401'] // no redirect whitelist
router.afterEach(() => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
})
router.beforeEach(async (to, from, next) => {
    NProgress.start() // 开启Progress
    if (getToken()) {
        if (to.path === '/login') {
          next({path: '/'})
          NProgress.done()
        } else {
            if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
              store.dispatch('GetUserInfo').then(info => { // 拉取user_info
                store.dispatch('GetMenu').then(menus => {
                  store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
                    router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
                  })
                })
              }).catch(() => {
                store.dispatch('LogOut').then(() => {
                  sessionStorage.clear()
                  next({path: '/login'})
                })
              })
          } else {
              next()
          }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到首页
            NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
