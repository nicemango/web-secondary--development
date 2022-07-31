import request from "./request";

export const getAssetJSONForProduct = id =>
  request.get(`iot/product/getAssetJSONForProduct?productId=${id}`);

export const downloadAssetJSONForProduct = id =>
  request.get(`iot/product/downloadAssetJSONForProduct?productId=${id}`);

export const batchOperation = (dataForm) => 
  request.post(`iot/device/updateDeviceCacheStatus`, dataForm);