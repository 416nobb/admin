import { createApp } from 'vue'
import App from '@/App.vue'


//引入模版的全局样式
import '@/styles/index.scss'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'


//获取应用实例
const app = createApp(App)
//国际化
app.use(ElementPlus, {
    locale: zhCn,
  })

//引入自定义插件对象，注册全局组件
import gloalComponent from '@/components'



// axios({
//   url: '/api/user/login',
//   method: 'post',
//   data: {
//     username: 'admin', password: '111111'
//   }
// })






  //安装自定义全局组件
app.use(gloalComponent);
//安装仓库
app.use(pinia)
//注册模版路由
app.use(router);
//引入路由鉴权
import './premission';

app.mount('#app');
