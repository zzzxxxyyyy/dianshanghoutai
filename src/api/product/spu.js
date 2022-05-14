import request from '@/utils/request';


// 获取SPU列表数据的接口
// /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获得SPU信息
// GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'GET' })


// 获得品牌信息
// GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'GET' })

// 获得SPU图标的接口
// /admin/product/spuImageList/{spuId}
export const reqImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'GET' })

// 获得平台全部销售属性
// GET /admin/product/baseSaleAttrList
export const reqbaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'GET' })


// 进行修改或者添加的接口
// POST /admin/product/saveSpuInfo
// POST /admin/product/updateSpuInfo
export const reqAddOrUpdate = (spuInfo) => {
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'POST', data: spuInfo })
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'POST', data: spuInfo })
    }

}

// 删除spu
// DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })


// 获取图片的数据
// /admin/product/spuImageList/{spuId} get
export const reqSkuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'GET' })

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })


// 获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get 
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加sku
// /admin/product/saveSkuInfo post
export const reqAddSkuInfo = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取sku列表数据的接口
// GET /admin/product/findBySpuId/{spuId}
export const findBySpuId = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'GET' })