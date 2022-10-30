const getters = {
  token: state => state.user.token,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menus: state => state.user.menus,
  elements: state => state.user.elements,
  name: state => state.user.name,
  permissionMenus: state => state.user.permissionMenus,
}
export default getters
