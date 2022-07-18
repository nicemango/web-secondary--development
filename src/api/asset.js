import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const getContentData = (obj) =>
  request.post(`exportTemplate/provideThePathTest`, { dataId: obj.dataId, viewId: obj.viewId, formId: obj.formId });
