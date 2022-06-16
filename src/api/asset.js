import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`);
export const GetpicYzm = () =>
  request.get(`/system/authority/getAuthPic?module=123141241221`, {
    responseType: 'arraybuffer',
  })
export const Phoneyzm = (picyzm, mobile) =>
  request.post(`/system/register/sendSms?type=create&authPicCode=${picyzm}`, mobile);
export const register = (sjyzm, name, phone) =>
  request.post(`dmzp/register?code=${sjyzm}`, { name: name, phone: phone });
export const Login = (sjyzm, phone) =>
  request.get(`/dmzp/login?phone=${phone}&code=${sjyzm}`);

