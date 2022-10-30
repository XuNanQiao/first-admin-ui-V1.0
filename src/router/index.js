import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
/*
* 无 meta 或 roles 表示该路由没有权限限制
* roles 能看到路由权限的角色
* */
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/', component: Layout,redirect: '',},
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/questionBank',
    name: 'questionBank',
    component: Layout,
    hidden: true,
    children:[
      {
        path:'managetest',
        component: _import('questionBank/managetest/index'),
      },
      {
        path:'share',
        component: _import('questionBank/share/index'),
      }
    ]
  },
  {
    path: '*',
    component: _import('errorPage/404'), hidden: true
  },
]
export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
  // base: '/api/page/cmricmchain/' // 访问和静态是page，接口是web
})

// 其他非菜单路由
export const otherMenuRouterMap = [
]

export const asyncRouterMap = []
