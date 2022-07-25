import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (ids,params) => {
  return request.post(`/asset/getAssetData?asset_id=${ids.id}&count=99999&pageNum=${ids.pageNum}&pageSize=${ids.pageSize}`, params);
}
  /* 
  * 直播流
  * @param id 设备ID
  */
export const queryLiveing = id =>
  request.get(`iot/video/queryLiveStreaming?deviceId=${id}`);

  /* 
  * 告警事件图片接口
  * @param deviceId：设备ID
  * @param eventId：事件ID
  */
export const queryWarnPicture = params =>
  request.get(`iot/video/queryWarnPicture?deviceId=${params.devId}&eventId=${params.eveId}`);