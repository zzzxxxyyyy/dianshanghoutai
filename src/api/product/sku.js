import request from '@/utils/request';

// 获取sku列表数据
// /admin/product/list/{page}/{limit} get
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架
// GET /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'GET' })

// 下架
// GET /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取信息
// GET /admin/product/getSkuById/{skuId}
export const reqGetSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })

// 删除sku
// DELETE /admin/product/deleteSku/{skuId}
export const reqDeleteSku = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' })