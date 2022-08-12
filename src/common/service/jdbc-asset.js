import request from "../../api/request";

/**
 * intl.get('COMM.ABBIQ')
 */
export const queryAsset = (id) => request.get(`asset?asset_id=${id}`);

/**
 * intl.get('COMM.ALDSDMQ')
 */
export const dataSourceDbschemas = (id) =>
  request.get(`dataSource/dbschemas?id=${id}`);

/**
 * intl.get('COMM.ATMQ')
 */
export const assetMetaById = (sourceId, params) =>
  request.post(`asset/tblmeta?id=${sourceId}`, params);

/**
 * intl.get('COMM.DSDTIQ')
 */
export const sourceMetaById = (id, schema) =>
  request.get(`dataSource/dbmeta?id=${id}&schema=${schema}`);

/**
 * intl.get('ANAL.NEW_ASSET') 预览数据
 */
export const assetPreview = (params) =>
  request.post(`asset/previewData`, params);

/**
 * intl.get('COMM.IFQACI')
 */
export const assetConfById = (id) => request.get(`asset/conf?asset_id=${id}`);

/**
 * intl.get('COMM.UAA')
 */
export const updateAssetConf = (params) =>
  request.post(`asset/updateAssetConf`, params);

/**
 * intl.get('COMM.QDMI')
 */
export const assetQueryModel = (id) =>
  request.get(`asset/queryModel?assetId=${id}`);

/**
 * intl.get('COMM.UDM')
 */
export const updateMode = (params) => request.post(`asset/updateModel`, params);

/**
 * intl.get('COMM.QDRI')
 */
export const associations = (id) =>
  request.get(`asset/associations?assetId=${id}`);
/**
 * intl.get('COMM.IAAQDRI')
 */
export const getAssetForeignRelation = (id) =>
  request.get(`asset/getAssetForeignRelation?assetId=${id}`);
/**
 * intl.get('COMM.UDR')
 */
export const updateAssociations = (params) =>
  request.post(`asset/updateAssociations`, params);

/**
 * intl.get('COMM.QDPI')
 */
export const queryAuthByAssetId = (id) =>
  request.get(`asset/auth/queryByAssetId?asset_id=${id}`);

/**
 * intl.get('COMM.UDP')
 */
export const updateAssetASuth = (params) =>
  request.post(`asset/auth/update`, params);

/**
 * intl.get('COMM.TQD')
 */
export const queryQueryConditionValueCount = (viewId, componentId) =>
  request.get(
    `formView/queryQueryConditionValueCount?viewId=${viewId}&componentId=${componentId}`
  );

/**
 * intl.get('EVEN.QUERY_DATA')
 */
export const queryAssetData = (id, params, count) =>
  request.post(
    `asset/getAssetData?asset_id=${id}${
      count || count === 0 ? "&count=" + count : ""
    }`,
    params
  );

/**
 * intl.get('COMM.QDIASLS')token
 */
export const getAssetDataForBigScreen = (id, params, count, token) =>
  request.post(
    `bigscreen/meta/getAssetDataForBigScreen?asset_id=${id}${
      count || count === 0 ? "&count=" + count : ""
    }&token=${token}`,
    params
  );

/**
 * intl.get('EVEN.QUERY_DATA')(去重)
 */
export const queryAssetDataDistinct = (id, code, formId, params) =>
  request.post(
    `form/getAssetData?asset_id=${id}&distinct_column=${code}&form_id=${formId}`,
    params
  );

/**
 * intl.get('EVEN.QUERY_DATA')（排序）
 */
export const queryAssetDataWithSort = (id, params) =>
  request.post(`form/queryAssetDataWithSort?asset_id=${id}`, params);

/**
 * intl.get('EVEN.QUERY_DATA')
 */
export const queryFormAssetData = (
  id,
  form_id,
  params,
  distinct_column,
  config
) =>
  request.post(
    `form/getAssetData?asset_id=${id}&form_id=${form_id}${
      distinct_column ? "&distinct_column=" + distinct_column : ""
    }`,
    params,
    config
  );

/**
 * intl.get('COMM.QOAWBF')
 */
export const onlyQueryAssetDataDistinct = (
  id,
  form_id,
  params,
  form_column_id
) => {
  if (form_column_id) {
    return request.post(
      `form/queryAssetDataDistinct?asset_id=${id}&form_id=${form_id}&form_column_id=${form_column_id}`,
      params
    );
  } else {
    return request.post(
      `form/queryAssetDataDistinct?asset_id=${id}&form_id=${form_id}`,
      params
    );
  }
};

export const getAssetDataByFilter = (id, form_id, params, config) => {
  return request.post(
    `form/assetData/getAssetData?asset_id=${id}&form_id=${form_id}`,
    params,
    config
  );
};

export const getAssetDataByFilterUseCache = (id, form_id, params) => {
  return request.post(
    `form/assetData/getAssetData?asset_id=${id}&form_id=${form_id}`,
    params,
    { useCache: true, cacheDuration: 500 }
  );
};

/**
 * intl.get('COMM.QOAWBF')
 */
export const onlyQueryAssetDataDistinctUseCache = (
  id,
  form_id,
  params,
  form_column_id
) => {
  if (form_column_id) {
    return request.post(
      `form/queryAssetDataDistinct?asset_id=${id}&form_id=${form_id}&form_column_id=${form_column_id}`,
      params
    );
  } else {
    return request.post(
      `form/queryAssetDataDistinct?asset_id=${id}&form_id=${form_id}`,
      params,
      { useCache: true, cacheDuration: 500 }
    );
  }
};

/**
 * intl.get('COMM.QFAF')
 */
export const autoComplete = (id) =>
  request.get(`asset/autoComplete?asset_id=${id}`);

/**
 * intl.get('COMM.UAN')
 */
export const updateName = (id, name) =>
  request.get(`asset/updateName?asset_id=${id}&asset_name=${name}`);

/**
 * intl.get('COMM.UDDF')
 */
export const updateQueryCols = (params) =>
  request.post(`asset/updateQueryCols`, params);

/**
 * intl.get('COMM.UDQF')
 */
export const updateDisplayCols = (params) =>
  request.post(`asset/updateDisplayCols`, params);

/**
 * intl.get('COMM.EXPORT_ASSETS')
 */
export const exportAssetData = (id, key, params) =>
  request.post(
    `asset/assetData/export?asset_id=${id}&fileType=${key}`,
    params,
    {
      responseType: "blob",
    }
  );

/**
 * intl.get('COMM.SYNCHRONIZE_ASSETS')
 */
export const syncModel = (id, syncComment) =>
  request.get(`asset/syncModel?asset_id=${id}&syncComment=${syncComment}`);

export const queryTableNames = (sourceId) =>
  request.get(`/asset/queryTableNames?sourceId=${sourceId}`);

/**
 * intl.get('COMM.BQS')
 */
export const baiduSite = (id) => request.get(`dataSource/baiduSite?id=${id}`);

/**
 * intl.get('ASS.QUERY')xml
 */
export const queryXml = (sourceId) =>
  request.get(`dataSource/xml/queryXml?sourceId=${sourceId}`);

/**
 * intl.get('COMM.QKM')
 */
export const queryGraph = (assetId) =>
  request.get(`/asset/graph/queryGraph?assetId=${assetId}`);

/**
 * intl.get('COMM.CMR')
 */
export const createRelation = (assetId, params) =>
  request.post(`/asset/graph/createRelation?assetId=${assetId}`, params);

/**
 * intl.get('COMM.DAR')
 */
export const deleteRelation = (assetId, params) =>
  request.post(`/asset/graph/deleteRelation?assetId=${assetId}`, params);

/**
 * intl.get('COMM.UMR')
 */
export const updateRelation = (assetId, oldRelationName, params) =>
  request.post(
    `/asset/graph/updateRelation?assetId=${assetId}&oldRelationName=${oldRelationName}`,
    params
  );

/**
 * 保存图谱概念-{intl.get('ASS.CONCEPTUAL_ATTRIBUTES')}
 */
export const updateModel = (params) =>
  request.post(`/asset/updateModel`, params);

/*
 * intl.get('COMM.QFDI')
 * @param {*} id
 * @returns
 */
export const queryById = (id) => request.get(`formView/queryById?viewId=${id}`);

/**
 * intl.get('COMM.FSADL')
 */
// export const queryJoinSearch = (id, keyWord, current, pageSize, type) =>
//   request.get(
//     type
//       ? `asset/queryJoinSearch?assetId=${id}&keyWord=${keyWord}&type=${type}&from=${current}`
//       : `asset/queryJoinSearch?assetId=${id}&keyWord=${keyWord}&from=${current}&size=${pageSize}`
//   );
export const queryJoinSearch = (params) =>
  request.get("asset/queryJoinSearch", { params });

/**
 * intl.get('COMM.ASSOCIATION')
 */
export const thinkKeySearch = (id, keyWord, type) =>
  request.get(
    `asset/thinkKeySearch?assetId=${id}&keyWord=${keyWord}${
      type ? "&type=" + type : ""
    }`
  );

export const getSearchInfo = (id, params) =>
  request.post(`dataservice/rest/serviceSearch/getSearchInfo/${id}`, params);

// intl.get('COMM.ATA')id查询列表生命周期
export const queryLifecycleByAssetId = (id) =>
  request.get(`asset/lifecycle/queryByAssetId?asset_id=${id}`);

// intl.get('COMM.AOUAL')
export const addOrUpdateLifecycle = (params) =>
  request.post(`asset/lifecycle/addOrUpdate`, params);

// 按照id删除生命周期
export const deleteLifecycleById = (id) =>
  request.get(`asset/lifecycle/deleteById?id=${id}`);

// 填报查询资产关联关系
export const queryAssociationsByIds = (masterAssetId, associationIds) =>
  request.get(
    `asset/associations/masterAssetId?masterAssetId=${masterAssetId}&associationIds=${associationIds}`
  );
// 填报保存关联关系
export const updateAssociationsByDataReport = (params) =>
  request.post(`asset/dataReport/updateAssociations`, params);

// 填报查询
export const queryAssociationsByType = (params) =>
  request.post(`asset/associations/masterAssetId`, params);

// 根据资产查询关联关系资产及字段信息
export const queryAssociationsAssetsByIds = (assetId) =>
  request.get(`asset/associations/assets?assetId=${assetId}`);
