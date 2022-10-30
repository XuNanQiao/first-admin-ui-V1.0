import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters' // global filters
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './permission'
import './utils/myFlexible'
import 'babel-polyfill'
import './assets/iconfont/iconfont.css'
import './style/font.less'
import './style/index.less'
Vue.use(Element)
Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
