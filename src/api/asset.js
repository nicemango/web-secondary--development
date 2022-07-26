import request from "./request";

/**
 * 请求资产 支持条件查询
 */
 export const queryAssetById = (id) =>
    request.post(`/asset/getAssetData?asset_id=${id}`);

/**
 * 请求资产 支持条件查询
 */
 export const delectData = (key, dataForm) =>
    request.post(`/dataservice/rest/common/${key}`, dataForm);