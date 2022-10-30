import { setToken,removeToken,getToken} from '@/utils/auth'
import { loginByUsername,getUserInfo,getMenus} from '../../api/login'
 
const user = {
  state: {
    token: getToken(),
    name:'',
    menus: undefined, // 菜单权限
    elements: undefined, // 非菜单权限
    permissionMenus: undefined, // 已授权的菜单树
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus
    }
  },
  actions: {
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      commit('SET_TOKEN', '')
      commit('SET_MENUS', undefined)
      commit('SET_ELEMENTS', undefined)
      removeToken()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response
          if (data.status === 500 || !data.token) {
            reject()
          } else {
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({commit,state}) {
      return new Promise((resolve, reject) => {
        getUserInfo(getToken()).then(response => {
          const data = response
          const menus = {}
          commit('SET_NAME', data.username)
          for (let i = 0; i < data.menus.length; i++) {
            menus[data.menus[i].code] = data.menus[i]
          }
          commit('SET_MENUS', menus)
          const elements = {}
          for (let i = 0; i < data.elements.length; i++) {
            elements[data.elements[i].code] = true
          }
          commit('SET_ELEMENTS', elements)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户菜单
    GetMenu({ commit, state }) {
      return new Promise((resolve, reject) => {
        getMenus(state.token).then(response => {
          commit('SET_PERMISSION_MENUS', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        sessionStorage.clear()
        localStorage.clear()
        removeToken()
        resolve()
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   commit('SET_MENUS', undefined)
        //   commit('SET_ELEMENTS', undefined)
        //   commit('SET_PERMISSION_MENUS', undefined)
        //   removeToken()
        //   removeRefreshToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    }
  }
}

export default user

