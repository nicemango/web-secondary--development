import intl from "react-intl-universal";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spin, Radio, Input, message, List, Avatar, Modal } from "antd";
import { Scrollbars } from "react-custom-scrollbars";

import { Icon } from "sdata-ui";
import { getAssets } from "../../../common/service/asset";
import * as CatalogService from "../../../common/service/catalog";
import "../../../common/style/assetModal.less";
import { format as formatNumeric } from "../../../common/utils/numeric";
import { formatDistanceToNow } from "../../../common/utils/date";
import AssetTypeImages from "../../../common/images/asset-type";
import { assetType as AssetTypes } from "../../../common/Constant";
import SiderCatalogMenu from "../../../common/components/sider-catalog-menu-new";
import ScrollableList from "../../../common/components/scrollable-list";
import { ErrorMessage } from "../../../common/errorMessage";

const Search = Input.Search;

class ChooseAssetModal extends Component {
  static propTypes = {
    location: PropTypes.object,
    block: PropTypes.object,
    objectId: PropTypes.string,
    type: PropTypes.string,
    saveAsset: PropTypes.func,
    chooseAsset: PropTypes.func,
    visible: PropTypes.bool,
  };

  state = {
    loading: true,
    assetType: "1",
    assetData: [],
    searchValue: "",
    catalogId: null,
    paging: {
      next: 1,
      size: 20,
      hasMore: true,
    },
    treeData: [],
    totalCount: 0,
    currentAsset: {
      assetId: this.props.option_assetId,
    },
    showSource: false,
    catalogs: [],
  };

  componentDidMount() {
    this.loadData();
    this.getCatalogs();
  }
  addSearchName = (results) => {
    const { catalogs } = this.state;
    if (catalogs && catalogs.length > 0) {
      const searchList = catalogs
        .reduce((a, b) => [...a, ...b])
        .filter((k) => results.find((v) => v.catalog_id === k.catalog_id));
      if (searchList.length > 0) {
        results.forEach((t) => {
          searchList.forEach((i) => {
            if (t.catalog_id === i.catalog_id) {
              console.log(i.catalog_name);
              t.catalog_name = i.catalog_name;
            }
          });
        });
      }
    }
    return results;
  };

  async loadData() {
    try {
      this.setState({
        loading: true,
      });
      const { pageNum, pageSize, results, totalCount } =
        await this.getCardsData();
      const paging = {
        next: pageNum + 1,
        size: 20,
        hasMore: totalCount > 20 * (pageNum - 1) + pageSize,
      };
      this.addSearchName(results);
      this.setState({
        loading: false,
        assetData: results || [],
        paging,
        totalCount: totalCount,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });
      ErrorMessage({ error: err });
    }
  }

  getCardsData = async () => {
    const { paging, assetType, type } = this.state;
    const orderBy = this.getOrderBy();
    const { data } = await getAssets(assetType, type || "favorite", {
      pageNum: paging.next,
      pageSize: paging.size,
      ...orderBy,
      queryParams: this.getQueryParams(),
    });
    return data;
  };

  getOrderBy() {
    const { orderBy, orderSort } = this.state;
    if (orderBy && orderSort) {
      return {
        orderBy,
        orderSort,
      };
    }
    return {
      orderBy: "last_modify_time",
      orderSort: "DESC",
    };
  }

  getQueryParams() {
    const { searchValue, catalogId } = this.state;
    const params = [];
    params.push({
      colName: "asset_type",
      type: 1,
      value: "",
    });
    const defaultCatalog = ["favorite", "bought", "share"];
    if (catalogId && !defaultCatalog.includes(catalogId)) {
      params.push({
        colName: "catalog_id", // 模糊查询字段名
        type: 2, // 模糊查询类型 0{intl.get('REPO.BY')}LIKE 1{intl.get('REPO.BY')}IN
        value: catalogId,
      });
    }
    if (searchValue) {
      params.push({
        colName: "asset_name", // 模糊查询字段名
        type: 0, // 模糊查询类型 0{intl.get('REPO.BY')}LIKE 1{intl.get('REPO.BY')}IN
        value: searchValue,
      });
    }
    return params;
  }

  getCatalogs = async (value) => {
    const type =
      parseInt(value) === 1 || !value ? 9 : parseInt(value) === 2 ? 10 : 0;
    try {
      const { data } = await CatalogService.queryByPartition(type);
      this.setState({
        catalogs: data,
      });
      return data;
    } catch (err) {
      ErrorMessage({ error: err, errorTime: 2 });
      return [];
    }
  };
  buildAssetSearch = () => {
    return (
      <Search
        defaultValue=""
        className="asset-search"
        placeholder={intl.get("REPO.SEARCH")}
        style={{ width: 250 }}
        onSearch={this.handleSearch}
      />
    );
  };

  handleSearch = (value) => {
    this.setState({
      searchValue: value,
      paging: {
        next: 1,
        size: 20,
        hasMore: true,
      },
    });
    value
      ? this.setState({ showSource: true })
      : this.setState({ showSource: false });
    setTimeout(() => {
      this.loadData();
    });
  };

  getAssetLabel = (assetType) => {
    return AssetTypes.find((type) => {
      return type.value === assetType.toString();
    }).label;
  };

  handlecatalogIdChange = (data) => {
    const catalogId = data[0];
    this.setState({
      searchValue: "",
      catalogId,
      paging: {
        next: 1,
        size: 20,
        hasMore: true,
      },
    });
    setTimeout(() => {
      this.loadData();
    });
  };

  handleTreeData = (data) => {
    this.setState({ treeData: data });
  };

  handleInfiniteOnLoad = () => {
    this.loadMore();
  };

  loadMore = async () => {
    try {
      // {intl.get('EX.LLOTLPDNCTI')}
      if (
        this.state.paging.next > 1 &&
        (this.state.paging.next - 1) * this.state.paging.size >=
          this.state.totalCount
      ) {
        return;
      }
      this.setState({
        loading: true,
      });
      const { pageNum, pageSize, results, totalCount } =
        await this.getCardsData();
      const paging = {
        next: pageNum + 1,
        size: 20,
        hasMore: totalCount > 20 * (pageNum - 1) + pageSize,
      };
      const { assetData } = this.state;
      this.setState({
        loading: false,
        assetData: assetData.concat(results),
        paging,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });
      ErrorMessage({ error: err });
    }
  };

  itemRenderer = (item) => {
    return this.renderItem(item);
  };

  renderItem = (item) => {
    const { currentAsset, showSource } = this.state;
    const checkedAssets = !currentAsset ? {} : currentAsset;
    let checked = false;
    checked = checkedAssets.asset_id === item.asset_id;
    return (
      <List.Item onClick={() => this.onCardClick(item)}>
        <List.Item.Meta
          avatar={
            <Avatar
              shape="square"
              size="large"
              src={AssetTypeImages[item.asset_type || item.source_type]}
            />
          }
          title={item.asset_name}
          description={item.create_member_name}
        />
        {showSource && (
          <span className="source-box">
            {intl.get("ANAL.COME_FROM")}:
            {item.catalog_name === undefined
              ? intl.get("REPO.UNKNOWN_FOLDER")
              : intl.get(item.catalog_name || "common.empty") ||
                item.catalog_name}
          </span>
        )}

        <span className="update-at">
          {formatDistanceToNow(item.last_modify_time)}
          {intl.get("ANAL.TO_UPDATE")}
        </span>
        <span className="record-count">
          {item.records_count === -1
            ? intl.get("REPO.NOT_COUNTED")
            : formatNumeric(item.records_count) + intl.get("COMM.TO").d(" 行")}
        </span>
        <span className="field-count">
          {item.column_count} {intl.get("REPO.FIELD")}
        </span>
        <span className={checked ? "check-asset" : "check-asset hidden"}>
          <Icon type="icon-duigou" />
        </span>
      </List.Item>
    );
    // }
  };

  onCardClick = (item) => {
    this.setState({ currentAsset: item });
  };

  nextStep = async () => {
    if (!this.state.currentAsset) {
      message.warn(intl.get("COMM.PSAA").d("请选择资产！"));
      return;
    }
    try {
      // await validateMandatoryField(this.state.currentAsset.assetId);
      this.props.saveAsset(this.state.currentAsset);
    } catch (error) {
      ErrorMessage({ error });
    }
  };

  handleCancel = () => {
    this.props.chooseAsset();
  };

  // eslint-disable-next-line no-unused-vars
  getCatalogActions = (catalog, level) => {
    return [];
  };

  // eslint-disable-next-line no-unused-vars
  onCatalogActionClick = ({ key, domEvent }, { catalogId }) => {};

  onCatalogClick = ({ key }, index, typeIndex) => {
    if (key !== "team" && key !== "person" && key !== "together") {
      let type = "self";
      if (key === "bought" || key === "favorite") {
        type = key;
      }
      if (typeIndex === "2") {
        type = "team";
      }
      if (typeIndex === "3") {
        type = "share";
      }
      const catalog =
        key === "header" || key === "bought" || key === "favorite"
          ? undefined
          : key;
      this.setState(
        {
          catalogId: catalog,
          type,
          paging: {
            next: 1,
            size: 20,
            hasMore: true,
          },
          showSource: false,
        },
        () => {
          this.loadData();
        }
      );
    }
  };

  render() {
    const { assetType, loading, assetData, paging } = this.state;
    const dataListing = assetData;
    const type =
      parseInt(assetType) === 1 ? 9 : parseInt(assetType) === 2 ? 10 : 0;
    return (
      <Modal
        title={intl.get("REPO.SELECT_ASSET")}
        className="analysis_asset_modal ant-customized-new"
        visible={this.props.visible}
        width={1258}
        onCancel={this.handleCancel}
        onOk={this.nextStep}
        okText={intl.get("REPO.CONFIRM")}
        cancelText={intl.get("REPO.CANCEL")}
      >
        <Spin
          tip={intl.get("COMM.LOADING").d("正在加载中···")}
          spinning={this.state.loading}
          size="large"
        >
          <div className="asset_modal_content">
            <div className="asset_modal_header">
              {/* {this.buildAssetTypes()} */}
              {this.buildAssetSearch()}
            </div>
            <div className="asset_modal_select">
              <div className="asset_modal_left">
                <Scrollbars
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}
                  thumbMinSize={30}
                  universal={true}
                >
                  <div className="asset_label">
                    {this.getAssetLabel(assetType)}
                  </div>
                  <div className="asset-tree-data">
                    <SiderCatalogMenu
                      key={0}
                      selected={[]}
                      catalogType={type}
                      staticCatalogs={[]}
                      getCatalogActions={this.getCatalogActions}
                      onCatalogSelect={this.onCatalogClick}
                      onCatalogAction={this.onCatalogActionClick}
                      type={"AssetCatalog1"}
                      headerHidden
                      catalogActionHidden
                    />
                  </div>
                </Scrollbars>
              </div>
              <div className="asset_modal_right">
                <ScrollableList
                  className="listing-content"
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!loading && paging.hasMore}
                  dataSource={dataListing}
                  itemRenderer={this.itemRenderer}
                />
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default ChooseAssetModal;
