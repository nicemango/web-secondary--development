import request from "../../api/request";
/**
 * 查询所有数据字典项
 */
export const queryAllDictionary = (params, config) =>
  request.post("standard/dictionary/item/queryAll", params, config);

/**
 * 数据绑定映射调取新的获取资产列表接口
 */
export const getColumnDataByAssetId = (id) =>
  request.get(`form/getColumnsByAssetId4Mapping?asset_id=${id}`);

/**
 * 根据选择的资产id查询资产关联的填报
 */

export const queryFormByAssetId = (id) =>
  request.get(`form/data/queryRelevanceAssetInfo?assetId=${id}`);
