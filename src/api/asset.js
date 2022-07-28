import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const getContentData = (obj) =>
  request.post(`exportTemplate/provideThePathTest`, obj);
// 获取accessToken
export const accessToken = (obj) =>
  request.post(`ext/sipingApi/getAccessToken?url=${obj}`, obj);
// 上传文档
export const upload = (obj) => request.post(`docsign/api/fore/doc/upload`, obj);
// 签章完成回调接口
export const callBackDoc = (obj) => request.get(`ext/sipingApi/callBack`, {obj});
