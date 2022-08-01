import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id: string) =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);
/**
 * 登录
 */
export const login = (params: object) =>
  request.post(`/system/authority/loginAccount4Application`, params);
/**
 * 判断是否已登录
 */
export const isLogin = () => request.get(`/system/authority/isLogin`);
