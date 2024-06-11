//品牌管理模块接口
import request from "@/utils/request.js";

const API = {
    TRADEMARK_URL: "/admin/product/baseTrademark/",
    ADDTRADEMARK_URL:"/admin/product/baseTrademark/save",
    UPDATETRADEMARK_URL:"/admin/product/baseTrademark/update",
    DELETE_RUL:"/admin/product/baseTrademark/remove/"
}

//获取品牌接口
export const reqHasTrademark = (page, limit) => request.get(API.TRADEMARK_URL + `${page}/${limit}`);

//添加、修改品牌接口
export const reqAddOrUpdateTrademark = (data)=>{
    //修改已有品牌数据
    if(data.id){
        return request.put(API.UPDATETRADEMARK_URL,data);
    }else{
    //新增品牌
        return request.post(API.ADDTRADEMARK_URL,data);
    }
}

//删除数据接口
export const reqDeleteTrademark = (id)=>request.delete(API.DELETE_RUL+id);

