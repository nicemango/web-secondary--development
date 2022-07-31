import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);


/**
 * 查询资产
 * @param id 资产ID
 */
 export const queryByDatappId = (id, type) =>
 request.get(`/datapp/menu/queryByDatappId?datappId=${id}&entryType=${type}`);
