//路由鉴权
import router from '@/router'
//引入全局标题
import setting from './setting';
//进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false });
//获取仓库
import useUserStore from '@/store/modules/user'
import pinia from '@/store'
let userStore = useUserStore(pinia);
let username = userStore.username



//全局守卫
router.beforeEach(async (to, from, next) => {
    // to and from are both route objects. must call `next`.
    //更改标题
    document.title =` ${setting.title}-${to.meta.title}`;
    nprogress.start();
    //获取token
    let token = userStore.token;
    if (token) {
        //登录成功,不能访问login
        if (to.path == '/login') {
            next({ path: '/' });
        } else {
            if (username) {
                next();
            } else {
                try {
                    await userStore.userInfo();
                    next();
                } catch (e) {
                    //token过期/用户修改token  
                    //退出登录
                    await userStore.userLogout();
                    next({ path: '/login', query: { redirect: to.path } });
                }


            }
        }
    } else {
        //未登录
        if (to.path == '/login') {
            next();
        } else {
            console.log("请登录");
            // console.log("5.27 登录失效，手动鉴权通过，记得来修");
            //强行登录(接口好了删掉)
            // next();
            //正常取消登录(接口好了恢复)
            next({ path: '/login', query: { redirect: to.path } });
        }
    }
})

router.afterEach((to, from) => {
    // to and from are both route objects.
    nprogress.done();
})

