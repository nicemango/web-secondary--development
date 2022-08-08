import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryBasicInfoById = (id, listType) => request.get(
  `/flow/instance/queryBasicInfoById?id=${id}&listType=${listType}`
);

export const queryBasicInfo4Form = params =>
  request.post(`/flow/instance/queryBasicInfo4Form`, params);

export const queryApplyDataDetail = id =>
  request.get(`form/queryApplyDataDetail?form_id=6f33cabca75e4e6594e1b9c0394f169c&id=0391cb6d947e4f58bb0ad349cb0bec4e&show_value=true`, []);

export const queryFlowDiagram = params =>
  request.post(`/flow/instance/queryFlowDiagram`, params);

export const apply = params => request.post(`flow/instance/apply`, params);

export const modifyFormData = params =>
  request.post(`flow/instance/modifyFormData`, params);

export const rejectHandleTask = rejectHandleTaskId =>
  request.get(`flow/instanceTask/rejectHandleTask?id=${rejectHandleTaskId}`);

export const handleAndModify = params =>
  request.post(`flow/instance/handleAndModify`, params);

export const queryByFormId = id => request.get(`flow/queryById?formId=${id}`);

export const queryComponents = id => request.get(`form/queryById?id=${id}`);

export const queryApplyDataDetailFormId = ({
  formId,
  id,
  isOriginal = false,
}) => request.post(
  `/form/queryApplyDataDetail?form_id=${formId}&id=${id}&show_value=${isOriginal}&child=true`
);

/**
 * 查询省份
 */
export const getProvinceArea = () =>
  request.get('area/queryProvince')

/**
 * 查询城市
 */
export const getAreaByParent = (id) =>
  request.get(`area/queryByParent?parent_id=${id}`)

/**
 * 根据条件查询
 */
export const getDataWithSort = (id, dataForm) =>
  request.post(`form/queryAssetDataWithSort?asset_id=${id}`, dataForm)




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