import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
// export const getAssets = (cata, type, params2) =>
//   request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

  /* 
  * 直播流
  * @param id 设备ID
  */
export const queryLiveing = id =>
request.get(`iot/video/queryLiveStreaming?deviceId=${id}`);