import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import live2d from './live2d.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//全局对象
const allGlobalComponents={SvgIcon,Pagination,live2d,Category}
//对外暴露插件对象
export default{
    //务必叫install，固定传入应用实例对象app
    install(app){
        Object.keys(allGlobalComponents).forEach(key => {
                //注册全局组件
                app.component(key,allGlobalComponents[key])
        })
        
        //全局图标
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
          }
        
    }
}