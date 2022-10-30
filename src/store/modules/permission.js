import { constantRouterMap,otherMenuRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
const componentsMap = {}
function filterAsyncRouter(menus, level) {
  const accessedRouters = []
  for (var i = 0; i < menus.length; i++) {
    var itemlevel = level
    var menu = menus[i]
    let componentObj = null
    if (menu.attr1) {
      if (menu.attr1 === 'Layout') {
        componentObj = Layout
      } else {
        const componentPath = menu.attr1
        componentObj = componentsMap[componentPath]
        if (!componentObj) {
          try {
            componentObj = _import(componentPath)
          } catch (e) {
            console.log('加载' + componentPath + '出错')
          }
          componentsMap[componentPath] = componentObj
        }
      }
    }
    const route = {
      path: level === 1 ? '/' + menu.code : menu.code,
      component: componentObj,
      name: menu.code,
      meta: {
        code: menu.code,
        title: menu.title,
        icon: menu.icon,
        href: menu.href
      }
    }
    if (menu.children && menu.children.length > 1) {
      itemlevel++
      route.children = filterAsyncRouter(menu.children, itemlevel)
    }
    if(menu.children && menu.children.length == 1) {
      var childPath = menu.children[0].code
      route = {
        path: '/' + menu.code ,
        redirect:'/' + menu.code + '/' + childPath,
        component: componentObj,
        name: menu.code,
        meta: {
          code: menu.code,
          title: menu.title,
          icon: menu.icon,
          href: menu.href
        },
        children:[{
          path:  childPath,
          component: _import(`${menu.code}/${childPath}/index`),
          meta:{
          }
        }]
      }
    }
    accessedRouters.push(route)
  }
  return accessedRouters
}


const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
  },
  actions: {
    GenerateRoutes({ commit }, menus) {
      return new Promise(resolve => {
        let accessedRouters = (menus && menus.length > 0) ? filterAsyncRouter(menus[0].children, 1) : otherMenuRouterMap // 数据库配置的菜单转router
        if (accessedRouters && accessedRouters.length) {
          accessedRouters = accessedRouters.concat(otherMenuRouterMap)
        }
        commit('SET_ROUTES', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
