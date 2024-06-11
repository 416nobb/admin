//SKU模块api
import request from '@/utils/request.js'
//地址
const API = {
    //获取sku数据
    SKU_URL: '/admin/product/list/',
    //上架、下架 商品
    ON_SALE_URL: '/admin/product/onSale/',
    CANCEL_SALE_URL: '/admin/product/cancelSale/',
    //获取sku详情
    SKUINFO_URL: '/admin/product/getSkuInfo/',
    //删除sku
    DELETESKU_URL: '/admin/product/deleteSku/',

}

//获取sku接口
export const reqSkuList = (page, limit) => request.get(API.SKU_URL + `${page}/${limit}`);
//上架
export const reqSaleSku = (skuId) => request.get(API.ON_SALE_URL + skuId);
//下架
export const reqCancelSale = (skuId) => request.get(API.CANCEL_SALE_URL + skuId);
//获取商品详情
export const reqSkuInfo = (skuId) => request.get(API.SKUINFO_URL + skuId);
//删除
export const reqRemoveSku = (skuId) => request.delete(API.DELETESKU_URL + skuId);
