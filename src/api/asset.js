import request from "./request";

export const getAssetData = id =>
  request.post(`asset/data?id=${id}`);

/**
 * 查询资产
 * @param id 资产ID
 */
 export const queryAssetById = (id) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=99999&pageNum=1&pageSize=9999`, [])
  