import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) => request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
// 查询首页第一个列表
export const getFirtsListOne = (id, analysis_id, data) => request.post(`/analysis/datasV2?id=${id}&analysis_id=${analysis_id}`, data);
// 查询首页第二个列表
export const getFirtsListTwo = (asset_id) => request.post(`/asset/getAssetData?asset_id=${asset_id}`);
// 政策法规列表
export const getTwoList = (asset_id) => request.post(`/asset/getAssetData?asset_id=${asset_id}`);
// 工作动态列表
export const getThreeList = (asset_id) => request.post(`/asset/getAssetData?asset_id=${asset_id}`);
// 工作动态列表
export const getFourList = (asset_id) => request.post(`/asset/getAssetData?asset_id=${asset_id}`);
// 获取文章详情
export const getDocInfo = (view_id, id) => request.post(`/form/queryApplyDataDetail?view_id=${view_id}&id=${id}`);
// 浏览次数加一
export const browseUp = (serve_id,data) => request.post(`/dataservice/rest/orchestration/${serve_id}`, data);
// 报名查询
export const signUpSearch = (asset_id,data) => request.post(`/form/queryAssetDataWithSort?asset_id=${asset_id}`, data);
// 报名提交
export const formSubmit = (form_id,data) => request.post(`/form/insertApplyData?form_id=${form_id}`, data);
