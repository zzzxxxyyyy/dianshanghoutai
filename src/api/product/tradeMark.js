// 品牌管理的数据模块
import request from "@/utils/request"
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })


// 新增品牌
// POST /admin/product/baseTrademark/save 携带参数平拍名称和品牌logo
// /admin/product/baseTrademark/save

// 修改品牌
// PUT /admin/product/baseTrademark/update携带参数ID，品牌名名称和品牌logo

export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 修改品牌
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }

}

// 删除品牌
// DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })