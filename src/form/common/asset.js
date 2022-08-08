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
export const callBackDoc = (name_en,
  protocal_id,
  doc,) => request.get(`ext/sipingApi/callBack?name_en=${name_en}&protocal_id=${protocal_id}&doc=${doc}`);
// 上传签章文件
export const docsignUpload = (params) =>
  request.post(`/ext/sipingApi/docsignUpload`, params);