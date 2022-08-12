import request from "../../api/request";

/**
 * 查询目录
 * @param {} params
 */
export const queryCatalogs = params => request.get('catalog', { params });

/**
 * 根据目录Id删除目录
 */
export const deleteCatalogById = (status, params) =>
  request.post('catalog/delete?deleteFlag=' + status, params);

/**
 * 更新目录
 */
export const updateCatalog = params => request.post('catalog/update', params);

/**
 * 移动目录
 */

export const changeCatalog = params =>
  request.get('catalog/changeCatalog', { params });

/**
 * 新增目录
 */
export const addCatalog = (params, is_private) =>
  is_private
    ? request.post('catalog?is_private=true', params)
    : request.post('catalog', params);

/**
 * 移动目录
 */
export const moveCatalog = (id, parentId) =>
  request.get(
    `catalog/moveCatalog?catalog_id=${id}&newParentCatalog_id=${parentId}`
  );

/**
 * 移动卡片
 */
export const moveCard = (id, catalogId, catalogType) =>
  request.get(
    `catalog/moveCatalogByObject?object_id=${id}&newCatalog_id=${catalogId}&catalog_type=${catalogType}`
  );

/**
 * 查询分区域目录
 * @param {} params
 */
export const queryByPartition = catalog_type =>
  request.get(`catalog/queryByPartition?catalog_type=${catalog_type}`);

/**
 * 查询目录
 * @param {} params
 */
export const queryAllPrivate = type =>
  request.get(`/catalog/queryPrivateAndTeam?catalog_type=${type}`);

/**
 * 根据目录Id删除目录
 */
export const batchMoveCatalogByObject = (catalog_type, catalog_id, params) =>
  request.post(
    `catalog/batchMoveCatalogByObject?catalog_type=${catalog_type}&newCatalog_id=${catalog_id}`,
    params
  );

/**
 * 查询分区域一级目录
 * @param {} params
 */
export const queryTopCatalogByPartition = catalog_type =>
  request.get(
    `catalog/queryByPartition?catalog_type=${catalog_type}&queryTopCatalog=true`
  );
