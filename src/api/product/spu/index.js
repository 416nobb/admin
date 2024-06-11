//属性api
import request from '@/utils/request.js'

const API={
    //获取已有SPU
    HASSPU_URL:'/admin/product/',
    //获取全部品牌
    ALLTRADEMARK_URL:'/admin/product/baseTrademark/getTrademarkList',
    //获取某SPU中商品照片
    IMAGE_URL:'/admin/product/spuImageList/',
    //获取SPU下销售属性
    SPUHASSALEATTR_URL:"/admin/product/spuSaleAttrList/",
    //获取销售属性{颜色，版本，尺码}
    ALLSALEATTR_URL:'/admin/product/baseSaleAttrList',
    //增
    ADDSPU_URL:'/admin/product/saveSpuInfo',
    //改
    UPDATESPU_URL:'/admin/product/updateSpuInfo',
    //追加sku
    ADDSKU_URL:'/admin/product/saveSkuInfo',
    //查看spu下的商品（sku）集合
    SKUINFO_URL:'/admin/product/findBySpuId/',
    //删除SPU
    REMOVESPU_URL:'/admin/product/deleteSpu/'

}

//获取三级分类下SPU
export const reqHasSpu = (page,limit,category3Id)=>request.get(API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`);
//获取全部SPU品牌
export const reqAllTradeMark = ()=>request.get(API.ALLTRADEMARK_URL);
//获取spu下的图片
export const reqSpuImageList = (spuId)=>request.get(API.IMAGE_URL+spuId);
//获取spu现有销售属性
export const reqSpuHasSaleAttr = (spuId)=>request.get(API.SPUHASSALEATTR_URL+spuId);
//获取全部销售属性
export const reqAllSaleAttr = ()=>request.get(API.ALLSALEATTR_URL);

//增删查改  data:SPU对象
export const reqAddOrUpdateSpu = (data)=>{
    //有id，更新
    if(data.id){
        return request.post(API.UPDATESPU_URL,data);
    }else{
    //无id，新增
        return request.post(API.ADDSPU_URL,data);
    }
}
//添加sku
export const reqAddSku = (data)=>request.post(API.ADDSKU_URL,data);
//查看sku
export const reqSkuList = (spuId)=>request.get(API.SKUINFO_URL+spuId);
//删除已有spu
export const reqRemoveSpu = (spuId)=>request.delete(API.REMOVESPU_URL+spuId);