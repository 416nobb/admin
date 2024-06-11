//封装axios
import axios from 'axios'
import { ElMessage } from 'element-plus';
//引入用户仓库
import useUserStore from '@/store/modules/user';

//1.利用axios对象的create方法创建实例对象
let request = axios.create({
    //基础路径
    baseURL: '/api',
    //baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,//超时时间
    // responseType: 'json' ,
});
//2.request实例添加请求和响应拦截器
request.interceptors.request.use((config) => {
    //config配置独享，headers属性请求头，给服务器携带参数
    //返回配置对象
    // console.log(config);
    let userStore = useUserStore();
    if(userStore.token){
        config.headers.token = userStore.token;
    }

    return config;
})

//3.响应拦截器
request.interceptors.response.use((response) => {
    //成功回调
    //简化数据
    return response.data;
}, (error) => {
    //失败回调：处理http网络错误
    //定义错误信息变量
    let message = '';
    let status = error.response.status;
    switch (status) {
        case 401:
            message = "TOKEN过期";
            break;
        case 403:
            message = '无权访问';
            break;
        case 404:
            message = '请求地址错误';
            break;
        case 500:
            message = '服务器出现问题';
            break;
        default:
            message = "网络出现问题";
            break;
    }
    //提示错误信息
    ElMessage({
        type: 'error',
        message
    });

    return Promise.reject(error);
})

//对外暴露
export default request;
