import request from "../../api/request";
import axios from "axios";

const MAX_TIMEOUT = 30 * 60 * 1000;

/**
 * intl.get('REPO.QUERY_ASSETS')
 * @param {*} params
 */
export const queryAssets = (params1, catalog, params2, judgeCatalog = true) =>
  request.post(
    catalog
      ? `asset/queryList?cata=${params1}&catalog_id=${catalog}&judgeCatalog=${judgeCatalog}`
      : `asset/queryList?cata=${params1}`,
    params2
  );

/**
 * intl.get('COMM.QAA')
 * @param {*} params
 */
export const queryAllAsset = (params1, catalog, params2) =>
  request.post(`asset/queryAll?cata=${params1}`, params2);

/**
 * intl.get('REPO.QUERY_ASSETS')(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
  request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * intl.get('COMM.QBR')
 */
export const queryBooldAssets = (catalog, params2) =>
  request.post(
    catalog
      ? `lineage/monitor/queryLineageMonitorList?catalog_id=${catalog}`
      : `lineage/monitor/queryLineageMonitorList`,
    params2
  );
/**
 * intl.get('COMM.DRA')
 */
export const deleteXueAssetById = (params) =>
  request.get(
    `lineage/monitor/deleteLineageMonitor?lineageMonitorId=${params}`
  );
/**
 * intl.get('COMM.QAAQ')
 */
export const queryQualities = () => request.get("asset/qualities");

/**
 * intl.get('COMM.QAM')
 */
export const queryAssetMeta = (assetId, params) =>
  request.post(`asset/tblmeta?id=${assetId}`, params);

/**
 * intl.get('COMM.ADD_ASSET')
 */
export const addAsset = (params) => request.post("asset", params);

/**
 * intl.get('COMM.ADV')
 */
export const addAssetView = (params) => request.post("asset/view/add", params);

/**
 * intl.get('COMM.UDV')
 */
export const updateAssetView = (params) =>
  request.post(`asset/view/update`, params);

/**
 * intl.get('COMM.UPDATE_ASSETS')
 */
export const updateAsset = (params) => request.post("asset/update", params);

/**
 * intl.get('COMM.DELETE_ASSET')
 */
export const deleteAssetById = (params) => request.post("asset/delete", params);

/**
 * intl.get('REPO.QUERY_ASSETS')
 */
export const queryAssetById = (id) =>
  request.get("asset", { params: { asset_id: id } });

export const queryAssetDataById = (id, config) =>
  request.post(`asset/data?id=${id}`, undefined, config);
export const queryAssetDataByIdAndBought = (id, querys) =>
  request.post(
    `asset/data?id=${id}&isBought=${querys.bought}&count=${querys.count}`
  );
export const queryAssetByCondition = (id, array) =>
  request.post(`asset/data?id=${id}`, array);

export const queryAssetWithData = (id) =>
  axios.all([queryAssetById(id), queryAssetDataById(id)]);
export const queryAssetWithDataAndBought = (id, querys) =>
  axios.all([queryAssetById(id), queryAssetDataByIdAndBought(id, querys)]);
/**
 * intl.get('COMM.MOBILE_ASSETS')
 */
export const moveAsset = (object_id, newCatalog_id, catalog_type) =>
  request.get("catalog/moveCatalogByObject", {
    params: {
      object_id,
      newCatalog_id,
      catalog_type,
    },
  });

/**
 * intl.get('ANAL.COUNT')
 */
export const countAsset = (params) =>
  request.get("asset/count", { params, timeout: MAX_TIMEOUT });

/**
 * intl.get('ANAL.EXPORT_DATA')
 */
export const exportAssetData = (params) =>
  request.get("asset/data/export", { params });

/**
 * intl.get('COMM.SSD')
 */
export const synchro = (params) =>
  request.get("asset/synchro", { params, timeout: MAX_TIMEOUT });

/**
 * intl.get('COMM.SBAIAD')
 *
 * @param {*} params
 */
export const synchroByCatelog = (params) =>
  request.post("asset/synchroByCatelog", params, { timeout: MAX_TIMEOUT });

/**
 * intl.get('COMM.COPY_ASSETS')
 */
export const copyAsset = (params) =>
  request.post("asset/copyAsset", params, { timeout: MAX_TIMEOUT });

/**
 * intl.get('ASS.UPLOAD')Excel文件
 */
export const uploadFile = (form, type) =>
  request.post(`asset/importFile?fileType=${type}`, form, {
    timeout: MAX_TIMEOUT,
  });

/**
 * 根据选中的sheet{intl.get('ASS.IMPORT')}Excel文件
 */
export const saveFile = (assets, path, file_type) =>
  request.post(`asset/saveFile?path=${path}&fileType=${file_type}`, assets, {
    timeout: MAX_TIMEOUT,
  });

/**
 * intl.get('ASS.UPLOAD')Csv文件
 */
export const uploadCsv = (form) =>
  request.post("asset/importCsv", form, { timeout: MAX_TIMEOUT });

/**
 * intl.get('ASS.IMPORT')csv文件资产
 */
export const saveCsv = (data, path) =>
  request.post(`asset/saveCsv?path=${path}`, data, { timeout: MAX_TIMEOUT });

/**
 * intl.get('COMM.QTATRTA')
 *
 * @param {*} asset_id
 */
export const queryRelatedAnalyzers = (asset_id) =>
  request.get("asset/relation", { params: { asset_id } });

/**
 * intl.get('COMM.DIRECTORY_COUNT')
 */
export const countByCatalogId = (params) =>
  request.get("asset/countByCatalogId", { params, timeout: MAX_TIMEOUT });

/**
 * intl.get('COMM.VERIFICATION_CUSTOMIZATION')sql的语法
 */
export const checkSqlSyntax = (params) =>
  request.post("asset/checkSqlSyntax", params);

/**
 * intl.get('DISP.ASSET_AUDIT')
 * @param {*} id
 */
export const assetAudit = (id) =>
  request.get("asset/quality/report", { params: { asset_id: id } });

/**
 * intl.get('COMM.QAAL')
 * @param {*} id
 */
export const queryAssetsAudit = (id) =>
  request.get("asset/quality/reports", { params: { asset_id: id } });

/**
 * intl.get('ASS.UPLOAD')Dbf文件
 */
export const uploadDbf = (form) =>
  request.post("asset/importDBF", form, { timeout: MAX_TIMEOUT });

/**
 * intl.get('ASS.IMPORT')Dbf文件资产
 */
export const saveDbf = (data, path) =>
  request.post(`asset/saveDBF?path=${path}`, data, { timeout: MAX_TIMEOUT });

/**
 * intl.get('COMM.CAM')
 */
export const updateAssetModel = (params) =>
  request.post(`asset/updateModel`, params);

/**
 * intl.get('COMM.REPLACE_DATA')
 */
export const overwriteData = (id, data) =>
  request.post(`asset/data/overwrite?assetId=${id}`, data);

/**
 * intl.get('COMM.QSLD')
 */
export const queryOne = (assetId, objectId) =>
  request.get(`/asset/data/queryOne?assetId=${assetId}&objectId=${objectId}`);

/**
 * intl.get('COMM.QAUWCP')
 */
export const queryUserOfficeTree = (assetId, authId) =>
  request.get(
    authId
      ? `/asset/auth/queryUserOfficeTree?asset_id=${assetId}&auth_id=${authId}`
      : `/asset/auth/queryUserOfficeTree?asset_id=${assetId}`
  );

/**
 * intl.get('COMM.ALPS')--新增接口
 */
export const authInsert = (params) =>
  request.post(`/asset/auth/insert`, params);

/**
 * 资产库权限设置--{intl.get('COMM.UPDATE_INTERFACE')}
 */
export const authUpdate = (params) =>
  request.post(`/asset/auth/update`, params);

/**
 * intl.get('COMM.ALPS')--查询权限接口
 */
export const queryByAssetId = (id) =>
  request.get(`/asset/auth/queryByAssetId?asset_id=${id}`);

/**
 * intl.get('COMM.ALPS')--删除接口
 */
export const deleteUpdate = (id) => request.get(`/asset/auth/delete?id=${id}`);

/**
 * intl.get('COMM.SHARE_QUERY')
 */
export const queryShareAssetByToken = (token) =>
  request.get(`asset/share/queryByToken?token=${token}`);

/**
 * intl.get('COMM.AET')
 */
export const datareporting = (asset_id) =>
  request.get(`datareporting/data/exportTemplate?asset_id=${asset_id}`);

/**
 * intl.get('COMM.ADE')
 */
export const exports = (id, key) =>
  request.get(`asset/data/export?asset_id=${id}&fileType=${key}`);

/**
 * intl.get('COMM.ADE')
 */
export const exportByCondition = (id, type, params) =>
  request.post(
    `asset/data/exportByCondition?asset_id=${id}&fileType=${type}`,
    params,
    {
      responseType: "blob",
    }
  );

/**
 * restapi{intl.get('COMM.PDI')}
 */
export const restApiDatapreview = (params) =>
  request.post(`asset/restApiDatapreview`, params);

/**
 * intl.get('COMM.NDLC')
 */
export const addOrUpdateDataList = (params, id) =>
  request.post(`asset/dataList/addOrUpdate?assetId=${id}`, params);

/**
 * intl.get('COMM.QDLC')
 */
export const queryByAssetIdDataList = (id) =>
  request.get(`asset/dataList/queryByAssetId?assetId=${id}`);

/**
 * intl.get('COMM.QDLD')
 */
export const queryDataByAssetId = (params, id) =>
  request.post(`asset/dataList/queryDataByAssetId?assetId=${id}`, params);

/**
 * intl.get('COMM.QDFAM')
 */
export const queryMappings = (id) =>
  request.get(`/standard/queryMappings?assetId=${id}`);

/**
 * intl.get('ASS.ASSOCIATION_STANDARD')
 */
export const mapStandard = (params) =>
  request.post(`/standard/mapStandard`, params);

/**
 * intl.get('QUA.DISASSOCIATE')
 */
export const cancelMap = (assetId, colName) =>
  request.get(`/standard/cancelMap?assetId=${assetId}&colName=${colName}`);

/**
 * intl.get('ANAL.EXPORT_DATA')
 */
export const exportCatalogAssest = (catalogId, code) =>
  request.get(
    `asset/data/exportAWholeCatalog?catalog_id=${catalogId}&asset_cata=${code}`
  );

/**
 * intl.get('COMM.QFAAUAD')
 */
export const queryAllDataByCatalogId = (cata, type, catalogId, params) =>
  request.post(
    `asset/queryAllData?cata=${cata}&type=${type}&catalog_id=${catalogId}`,
    params
  );

/**
 * intl.get('ASS.DGR')-获取配置信息
 */
export const queryDataAnalysisSettingByAssetId = (assetId) =>
  request.get(`/asset/dataAnalysis/queryByAssetId?assetId=${assetId}`);
// /**
//  * intl.get('ASS.DGR')-获取数据库配置分析结果
//  */
// export const queryDataAnalysisResultByAssetId = assetId =>
//   request.get(`/asset/dataAnalysis/analysisAll?assetId=${assetId}`);
/**
 * intl.get('ASS.DGR')-获取数据库配置分析结果
 */
export const analysisByTypeAndAssetId = (assetId, type) =>
  request.get(
    `/asset/dataAnalysis/analysisByTypeAndAssetId?assetId=${assetId}&type=${type}`
  );
/**
 * intl.get('ASS.DGR')-分析
 */
export const analysisData = (type, params) =>
  request.post(`/asset/dataAnalysis/analysis?type=${type}`, params);

/**
 * intl.get('ASS.DGR')-保存配置信息
 */
export const addOrUpdateAnalysisSetting = (params) =>
  request.post(`/asset/dataAnalysis/addOrUpdate`, params);
// intl.get('COMM.QHVUA')
export const queryVersionListByAsset = (assetId) =>
  request.get(`meta/queryVersionListByAsset?assetId=${assetId}`);
/**
 * intl.get('COMM.QUALITY_INSPECTION')-查询数据属性分析数据
 * @param {*} assetId
 * @returns
 */
export const queryDataInspectionPropertyData = (assetId) =>
  request.get(`/asset/quality/property/analyse?asset_id=${assetId}`);
/**
 * intl.get('COMM.QUALITY_INSPECTION')-查询数据关联分析数据
 * @param {*} assetId
 * @returns
 */
export const queryDataInspectionCorrelateData = (assetId) =>
  request.get(`/asset/quality/correlate/analyse?asset_id=${assetId}`);
/**
 * intl.get('COMM.QUALITY_INSPECTION')-查询数据分类分析数据
 * @param {*} assetId
 * @returns
 */
export const queryDataInspectionClassificationData = (assetId) =>
  request.get(`/asset/quality/classification/detect?asset_id=${assetId}`);
