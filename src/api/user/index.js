//统一管理项目用户相关接口
import request from '@/utils/request.js'
//统一管理接口
const API = {
    LOGIN_URL: '/admin/acl/index/login',
    USERINFO_URL: '/admin/acl/index/info',
    LOGOUT_URL: '/admin/acl/index/logout'
}
//暴露请求函数
//登录接口方法
export const reqLogin = (data) => {
    return request.post(API.LOGIN_URL, data)
  }
  
  //获取用户信息接口方法
  export const reqUserInfo = () => {
    return request.get(API.USERINFO_URL)
  }
  
  //退出登录
  export const reqLogout = () => {
    return request.post(API.LOGOUT_URL)
  }


//登录接口方法(旧)
// export const reqLogin = (data => request.post(API.LOGIN_URL, data));
// //获取用户信息接口方法
// export const reqUserInfo = ((data) => request.get(API.USERINFO_URL, { params: { token: data } }));
