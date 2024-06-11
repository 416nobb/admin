//属性api
import request from '@/utils/request.js'

const API={
    //获取一级分类接口地址
    Category_1_URL:'/admin/product/getCategory1',
    //获取二级分类接口地址
    Category_2_URL:'/admin/product/getCategory2/',
    //获取三级分类接口地址
    Category_3_URL:'/admin/product/getCategory3/',
    //获取分类下属性和属性值
    ATTR_URL:'/admin/product/attrInfoList/',
    ///增、改属性接口
    ADDORUPDATEATTR_URL:'/admin/product/saveAttrInfo',
    //删除已有属性
    DELETEATTR_URL:'/admin/product/deleteAttr/'

}

export const reqC1 = ()=> request.get(API.Category_1_URL);
export const reqC2 = (C1_id)=> request.get(API.Category_2_URL+C1_id);
export const reqC3 = (C2_id)=> request.get(API.Category_3_URL+C2_id);
export const reqAttr = (id1,id2,id3)=>request.get(API.ATTR_URL+`${id1}/${id2}/${id3}`);
export const reqAddOrUpdateAttr = (data)=>request.post(API.ADDORUPDATEATTR_URL,data);
//删除api
export const reqRemoveAttr = (attrId)=>request.delete(API.DELETEATTR_URL+attrId);;

