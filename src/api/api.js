import http from './http'

export const success_code = 0
export const failed_code = 40000

// const baseUrl = 'http://localhost:88/api'

const ossUrl = 'http://localhost:777/api'

//分类列表
export const categoryList = () => {
  return http.requestGet('/product(backup)/category/list/tree');
}
//删除分类
export const deleteCategory = (catId) => {
  return http.requestDelete(baseUrl+'/product(backup)/category/delete/'+catId);
}
//创建分类
export const postCategory = (category) => {
  return http.requestPost(baseUrl+'/product(backup)/category/save',category);
}
//更新分类
export const upDateCategory = (category) => {
  return http.requestPut(baseUrl+'/product(backup)/category/update',category);
}

//更新分类状态
export const upDateBrandStatus = (brand) => {
  return http.requestPut(baseUrl+'/product(backup)/brand/update/status',brand);
}

//获取签名
export const policy = () => {
  return http.requestGet(baseUrl+'/thirdparty/oss/party');
}

