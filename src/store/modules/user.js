//创建用户相关小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入常量路由
import { constantRoute } from '@/router/routes.js'
//创建用户小仓库
let useUserStore = defineStore('User', {
    //小仓库存储数据
    state: () => {
        return {
            //token
            token: localStorage.getItem("TOKEN"),
            //存储生成菜单的路由数组
            menuRoutes: constantRoute,
            //用户信息
            username: '',
            avatar: '',
            //菜单宽度
            width: 150,

        }
    },
    //异步|逻辑
    actions: {
        //用户登录
        async userLogin(data) {
            let result = await reqLogin(data);
            //成功200,本地持久化存储
            if (result.code == 200) {
                this.token = result.data;
                // console.log(result);

                //本地存储
                localStorage.setItem("TOKEN", result.data);
                //返回成功promise
                return 'ok';
            } else {
                return Promise.reject(new Error(result.data))
            }

            //失败201
        },
        //获取用户信息
        async userInfo() {
            let result = await reqUserInfo(this.token);
            // console.log(result);
            //成功，存储
            if (result.code == 200) {
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        },
        //退出登录
        async userLogout() {
            let result = await reqLogout();
            if (result.code == 200) {
                this.token = '';
                this.username = '';
                this.avatar = '';
                localStorage.removeItem("TOKEN");
                return 'ok';
            }else{
                return Promise.reject(new Error(result.message))
            }
        }
    },
    getters: {

    }
})
//对外暴露
export default useUserStore