import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu, message } from "antd";
import { stratify } from "d3-hierarchy";

import { Icon } from "sdata-ui";

import history from "../../utils/history";
import "./index.less";

import SelectableSubMenu from "./selectable-sub-menu";
import CatalogMenuItem from "./catalog-menu-item";
import * as CatalogService from "../../../common/service/catalog";

const DragTypes = {
  Catalog: "catalog",
  Card: "card",
};

const { SubMenu } = Menu;

const rootCatalog = {
  catalog_name: "根目录",
  catalog_id: "root",
};

let catalogLevel = {};

class SiderCatalogMenu extends Component {
  static propTypes = {
    title: PropTypes.string,
    changeCachedProps: PropTypes.func,
    headerAddButton: PropTypes.bool,
    catalogType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    staticCatalogs: PropTypes.arrayOf(PropTypes.object),
    staticOnly: PropTypes.bool,
    selected: PropTypes.arrayOf(PropTypes.string),
    getCatalogActions: PropTypes.func,
    onCatalogSelect: PropTypes.func,
    onCatalogAction: PropTypes.func,
    type: PropTypes.string,
    headerHidden: PropTypes.bool,
    catalogActionHidden: PropTypes.bool,
    Permissions: PropTypes.array,
    refresh: PropTypes.func,
    analysisStyle: PropTypes.bool,
    areaTitle: PropTypes.string,
    hideTitle: PropTypes.bool,
    filterShare: PropTypes.bool,
  };

  state = {
    catalogs: [],

    addCatalogModal: {
      visible: false,
      parent: null,
    },

    renameCatalogModal: {
      visible: false,
      catalog: null,
    },
    addIcon: "icon-tianjia1",

    deleteCatalogModal: {
      visible: false,
      catalog: null,
    },

    shareCatalogModal: false,
    shareInfo: {
      id: null,
      name: null,
    },

    selected: this.props.selected, // defaultCatalog
    is_private: undefined,
    area1: {},
    area2: {},
    area3: {},
    area1Visible: true,
    area2Visible: true,
    area3Visible: true,
  };

  componentDidMount() {
    this.loadData();
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { catalogType, staticOnly } = this.props;
    if (prevProps.catalogType !== catalogType && !staticOnly) {
      this.loadData();
    }
    return null;
  }
  async loadData() {
    const catalogs = await this.getCatalogs();
    let { area1, area2, area3 } = this.state;
    let show_app_store = sessionStorage.getItem("show_app_store");
    if (show_app_store === "1") {
      const index = catalogs[0].findIndex(
        (item) => item.catalog_id === "bought"
      );
      catalogs[0].splice(index, 1);
    }
    catalogs[0].map((item) => {
      area1[item.catalog_id] = "1";
    });

    catalogs[1].map((item) => {
      area2[item.catalog_id] = "1";
    });
    catalogs[2].map((item) => {
      area3[item.catalog_id] = "1";
    });
    this.setState({
      catalogs: [...catalogs],
      area1,
      area2,
      area3,
    });
    return catalogs;
  }

  getCatalogs = async () => {
    const { catalogType } = this.props;
    try {
      const { data } = await CatalogService.queryByPartition(catalogType);
      return data;
    } catch (err) {
      message.error("加载目录数据失败", 2);
      return [];
    }
  };

  getCatalogTree = (catalogs, catalogsType) => {
    try {
      const { staticCatalogs } = this.props;
      // const { catalogs } = this.state;
      // catalogs.sort((a, b) => a.catalog_name.localeCompare(b.catalog_name));
      catalogs = catalogs.filter((item) => {
        const index = catalogs.findIndex((c) => item.parentid === c.catalog_id);
        if (index > -1 || !item.parentid) {
          return true;
        }
        return false;
      });
      const root = stratify()
        .id((d) => d.catalog_id)
        .parentId((d) => {
          if (d.catalog_id === "root") return null;
          return d.parentid || "root";
        })([
        rootCatalog,
        ...staticCatalogs,
        ...catalogs.filter(
          (catalog) => catalog.catalog_id !== catalog.parentid
        ),
      ]);

      catalogLevel[catalogsType] = this.stratifyCatalog(root.children);

      return root.children;
    } catch (err) {
      console.error("目录渲染错误", err);
    }
  };

  stratifyCatalog = (catalog) => {
    const catalogLevel = catalog.map((value) => {
      if (value.children) {
        return {
          catalogId: value.id,
          catalogName: value.data.catalog_name,
          children: this.stratifyCatalog(value.children),
        };
      }
      return { catalogId: value.id, catalogName: value.data.catalog_name };
    });
    return catalogLevel;
  };

  onCatalogActionClick = ({ key, domEvent }, catalog) => {
    domEvent.stopPropagation();
    // console.log(this.state.catalogs)
    // console.log(catalog);
    if (key === "share-catalog") {
      this.setState(
        {
          shareCatalogModal: true,
          shareInfo: {
            id: catalog.catalog_id,
            name: catalog.catalog_name,
          },
        },
        () => {
          this.openAuthority.showModal();
        }
      );
    }
    const { onCatalogAction } = this.props;
    onCatalogAction({ key, domEvent }, catalog);
  };

  splitLocationSearch(str) {
    if (str === undefined) return;
    str = str.substr(1);
    var arr = str.split("&");

    var obj = {};

    var newArr = [];
    arr.map(function (value, index, arr) {
      newArr = value.split("=");
      if (newArr[0] !== undefined) {
        obj[newArr[0]] = newArr[1];
      }
    });
    return obj;
  }

  isRefreshPage = ({ catalog_id }) => {
    const { catalogs } = this.state;
    const locationSearch = this.splitLocationSearch(history.location.search); // search解析数据
    const locationSearchCatalog = locationSearch.catalog; //search解析数据（当前目录ID）
    let idJumpDefault = true; //
    if (locationSearchCatalog !== undefined) {
      let arr = [locationSearchCatalog];
      for (let i = 0; i < catalogs.length; i++) {
        if (catalogs[i].parentid === locationSearchCatalog) {
          arr.push(catalogs[i].catalog_id);
        }
      }
      for (let k = 0; k < arr.length; k++) {
        if (arr[k] === catalog_id) {
          idJumpDefault = true;
        }
      }
    }
    if (idJumpDefault) {
      if (catalog_id === locationSearchCatalog) {
        return {
          idJumpDefault,
          locationSearchCatalog,
          type: 1,
        };
      } else {
        return {
          idJumpDefault,
          locationSearchCatalog,
          type: 2,
        };
      }
    } else {
      return {
        idJumpDefault,
      };
    }
  };

  getCatalogActions = (catalog, level) => {
    const { hasAction = true } = catalog;
    if (!hasAction) {
      return null;
    }

    const { getCatalogActions } = this.props;
    if (!getCatalogActions) {
      return null;
    }

    const actions = getCatalogActions(catalog, level);
    if (!actions || !actions.length) {
      return null;
    }

    const actionsMenu = (
      <Menu onClick={(event) => this.onCatalogActionClick(event, catalog)}>
        {actions.map(({ key, name, subActions = [] }) => {
          if (
            key === "share-catalog" &&
            !this.props.Permissions.includes("t")
          ) {
            return;
          }
          return subActions.length ? (
            <SubMenu key={key} title={<span>{name}</span>}>
              {subActions.map(({ key, name }) => (
                <Menu.Item key={key}>{name}</Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item key={key}>{name}</Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <Dropdown
        className="ant-customized"
        overlay={actionsMenu}
        placement="bottomLeft"
      >
        <Icon type="icon-gengduo" />
      </Dropdown>
    );
  };

  renderCatalogMenu = (
    { id, data, children },
    addbutton,
    level = 0,
    catalogType
  ) => {
    if (children && children.parent && children.parent.idPath) {
      children.idPath = `${children.parent.idPath},${children.id}`;
    } else if (children && children.parent) {
      children.idPath = `${children.parent.id},${children.id}`;
    }
    if (addbutton === "noAdd") {
      id = id + "_share";
    }
    const { canDrag = true, canDrop = true } = data;
    const isStatic = data.static;
    const iconType = data.iconType;
    // 把文件夹类型添加进catalog
    data.catalogType = catalogType;
    let actions = this.getCatalogActions(data, level);
    if (addbutton === "noAdd") {
      actions = [];
    }
    const accepts = canDrop
      ? level === 0
        ? [DragTypes.Catalog, DragTypes.Card]
        : [DragTypes.Card]
      : [];
    let iconShow;
    if (isStatic) {
      iconShow = <Icon type="icon-wenjianjia1" />;
    } else if (iconType && iconType === "my-product") {
      iconShow = <Icon type="icon-goumai" />;
    } else if (iconType && iconType === "my-order") {
      iconShow = <Icon type="icon-dingdan" />;
    } else if (iconType && iconType === "my-collection") {
      iconShow = <Icon type="icon-star" />;
    } else if (iconType && iconType === "my-account") {
      iconShow = <Icon type="icon-renyuan" />;
    } else {
      iconShow = <Icon type="icon-gerenwenjianjia" />;
    }
    if (data.catalog_id && data.catalog_id === "template") {
      iconShow = <Icon type="icon-moban" />;
    }
    if (data.catalog_id && data.catalog_id === "favorite") {
      iconShow = <Icon type="icon-wodeshoucang" />;
    }
    if (data.catalog_id && data.catalog_id === "bought") {
      iconShow = <Icon type="icon-wodegoumai" />;
    }
    if (
      data.catalog_id &&
      (data.catalog_id === "default" ||
        data.catalog_id === "defaultTeam" ||
        data.catalog_id === "share")
    ) {
      iconShow = <Icon type="icon-morenqu" />;
    }
    if (children && children.length) {
      return (
        <SelectableSubMenu
          selectedKeys={this.props.selected || []}
          onSelect={(e) => this.onCatalogSelects("0", e)}
          key={id}
          level={level}
          context={data.catalog_id === "favorite" ? "noAdd" : addbutton}
          analysisStyle={this.props.analysisStyle}
          title={
            <CatalogMenuItem
              accepts={accepts}
              id={id}
              key={id}
              name={data.catalog_name}
              desc={data.catalog_desc}
              actions={actions}
              icon={iconShow}
              catalog_id={data.catalog_id}
              area1={this.state.area1}
              area2={this.state.area2}
              area3={this.state.area3}
              level={level}
            />
          }
        >
          {children.map((child) =>
            this.renderCatalogMenu(child, addbutton, level + 1, catalogType)
          )}
        </SelectableSubMenu>
      );
    }

    return (
      <Menu.Item key={id} context={addbutton}>
        <CatalogMenuItem
          accepts={accepts}
          canDrag={canDrag && level !== 0}
          id={id}
          desc={data.catalog_desc}
          name={data.catalog_name}
          actions={actions}
          icon={iconShow}
          catalog_id={data.catalog_id}
          area1={this.state.area1}
          area2={this.state.area2}
          area3={this.state.area3}
          level={level}
        />
      </Menu.Item>
    );
  };

  onHeaderAddButtonClick = (is_private, domEvent) => {
    domEvent.stopPropagation();
    this.setState({
      addCatalogModal: {
        visible: true,
        parentCatalog: null,
      },
      is_private,
    });
  };

  onCatalogSelect = (e) => {
    console.log(e);
  };

  onCatalogClick = (e) => {
    if (e.key === "person") {
      this.setState({ area1Visible: !this.state.area1Visible });
    }
    if (e.key === "team") {
      this.setState({ area2Visible: !this.state.area2Visible });
    }
    if (e.key === "together") {
      this.setState({ area3Visible: !this.state.area3Visible });
    }
  };

  getParentsNote = (targetData, targetId, result = []) => {
    targetData.some((item) => {
      if (item.catalog_id === targetId) {
        result.unshift(item);
        item.parentid && this.getParentsNote(targetData, item.parentid, result);
        return true;
      }
    });
    return result;
  };

  onCatalogSelects = async (index, e) => {
    const { area1 } = this.state;
    const { catalogs } = this.state;
    const { changeCachedProps } = this.props;
    let current = {};
    let catalog = [];
    let area;
    if (e.key !== "header") {
      if (e.key === "favorite") {
        catalogs[0].map((value) => {
          if (value.catalog_id === e.key) {
            current = value;
            current.index =
              (e.item &&
              e.item.props &&
              e.item.props.context &&
              e.item.props.context === 1
                ? "hasAdd"
                : false) || "hasAdd";
            current.area = area;
          }
        });
        if (current.parentid) {
          catalogs[area - 1].map((value) => {
            if (value.catalog_id === current.parentid) {
              catalog = [value, current];
            }
          });
        } else {
          catalog = [current];
        }
        this.props.onCatalogSelect(e, "noAdd", "1", catalog);
      } else if (e.key.indexOf("_share") === -1) {
        if (area1[e.key]) {
          area = "1";
        } else {
          area = "2";
        }
        catalogs[area - 1].map((value) => {
          if (value.catalog_id === e.key) {
            current = value;
            current.index =
              (e.item &&
              e.item.props &&
              e.item.props.context &&
              e.item.props.context === 1
                ? "hasAdd"
                : false) || "hasAdd";
            current.area = area;
          }
        });
        if (current.parentid) {
          catalogs[area - 1].map((value) => {
            if (value.catalog_id === current.parentid) {
              value.index =
                (e.item &&
                e.item.props &&
                e.item.props.context &&
                e.item.props.context === 1
                  ? "hasAdd"
                  : false) || "hasAdd";
              value.area = area;
            }
          });
          catalog = this.getParentsNote(
            catalogs[area - 1],
            current.catalog_id,
            []
          );
        } else {
          catalog = [current];
        }
        this.props.onCatalogSelect(
          e,
          (e.item &&
          e.item.props &&
          e.item.props.context &&
          e.item.props.context === 1
            ? "hasAdd"
            : false) || "hasAdd",
          area,
          catalog
        );
      } else {
        catalogs[2].map((value) => {
          if (value.catalog_id === e.key.replace("_share", "")) {
            current = value;
            current.index =
              (e.item &&
              e.item.props &&
              e.item.props.context &&
              e.item.props.context === 1
                ? "hasAdd"
                : false) || "hasAdd";
            current.area = area;
          }
        });
        if (current.parentid) {
          catalogs[2].map((value) => {
            if (value.catalog_id === current.parentid) {
              catalog = [value, current];
              value.index =
                (e.item &&
                e.item.props &&
                e.item.props.context &&
                e.item.props.context === 1
                  ? "hasAdd"
                  : false) || "hasAdd";
              value.area = area;
            }
          });
        } else {
          catalog = [current];
        }
        e.key = e.key.split("_")[0];
        this.props.onCatalogSelect(
          e,
          (e.item && e.item.props && e.item.props.context) || "noAdd",
          "3",
          catalog
        );
      }
    }
    if (changeCachedProps) {
      changeCachedProps(e.selectedKeys);
    }
  };
  render() {
    const { title, selected } = this.props;
    const { catalogs, area1Visible, area2Visible, area3Visible } = this.state;
    return (
      <Fragment>
        <Menu
          defaultSelectedKeys={selected || []}
          selectedKeys={selected || []}
          className="sider-catalog-menus"
          onSelect={this.onCatalogSelects.bind(this, "0")}
          onClick={this.onCatalogClick.bind(this)}
          mode="inline"
        >
          {!this.props.headerHidden && (
            <Menu.Item
              className="sider-header"
              key="header"
              context={{ aaa: "abc" }}
            >
              <div
                className="sider-title"
                style={{
                  textAlign: "center",
                  display: "block",
                  width: "272px",
                  marginRight: "4px",
                }}
              >
                <Icon
                  type={
                    title === "安全规则" ? "icon-save" : "icon-biaozhunguanli"
                  }
                  className="icon_rule"
                  style={{
                    display:
                      title === "安全规则" || title === "标准管理"
                        ? "inline"
                        : "none",
                  }}
                />
                <span
                  style={{
                    color: "#333333",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {title}
                </span>
              </div>
            </Menu.Item>
          )}

          {this.props.type !== "DatareportingMangerCatalog" && (
            <Menu.Item
              className="sider-header sider-headers"
              key="person"
              context={{ aaa: "abc" }}
              style={{ marginTop: "10px", backgroung: "#EFF4FF" }}
            >
              <div className="sider-title">
                <Icon
                  type="icon-xiala3"
                  className={`${
                    area1Visible ? "icon-xiala3" : "icon-xiala3 xialaTrans"
                  }`}
                  style={{ display: "inline", color: "#B9B9B9" }}
                />
                <Icon
                  type="icon-gerengongzuoqu"
                  className="icon_rule"
                  style={{ display: "inline", color: "#5182E4" }}
                />
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#5182E4",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  个人工作区
                </span>
                {!this.props.catalogActionHidden ? (
                  <Icon
                    type={this.state.addIcon}
                    onClick={this.onHeaderAddButtonClick.bind(this, true)}
                    onMouseOver={this.onIconMouseOver}
                    onMouseLeave={this.onIconMouseLeave}
                    style={{ marginLeft: "80px" }}
                  />
                ) : (
                  <span style={{ marginLeft: "87px" }} />
                )}
              </div>
            </Menu.Item>
          )}
          {catalogs.length &&
            area1Visible &&
            this.props.type !== "DatareportingMangerCatalog" &&
            this.getCatalogTree(catalogs[0], "personal").map((child) =>
              this.renderCatalogMenu(child, "hasAdd", 0, "personal")
            )}
          {!this.props.hideTitle && (
            <Menu.Item
              className="sider-header sider-headers sider-headerss"
              key="team"
              context={{ aaa: "abc" }}
              style={{ backgroung: "#EFF4FF" }}
            >
              <div className="sider-title">
                <Icon
                  type="icon-xiala3"
                  className={`${
                    area2Visible ? "icon-xiala3" : "icon-xiala3 xialaTrans"
                  }`}
                  style={{ display: "inline", color: "#B9B9B9" }}
                />
                <Icon
                  type="icon-tuanduigongzuoqu"
                  className="icon_rule"
                  style={{ display: "inline", color: "#5182E4" }}
                />
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#5182E4",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  团队工作区
                </span>
                {!this.props.catalogActionHidden ? (
                  <Icon
                    type={this.state.addIcon}
                    onClick={this.onHeaderAddButtonClick.bind(this, false)}
                    onMouseOver={this.onIconMouseOver}
                    onMouseLeave={this.onIconMouseLeave}
                    style={{ marginLeft: "80px" }}
                  />
                ) : (
                  <span style={{ marginLeft: "87px" }} />
                )}
              </div>
            </Menu.Item>
          )}
          {catalogs.length &&
            area2Visible &&
            this.getCatalogTree(catalogs[1], "team").map((child) =>
              this.renderCatalogMenu(child, "hasAdd", 0, "team")
            )}
          {this.props.type !== "DatareportingMangerCatalog" &&
            this.props.type !== "application" &&
            !this.props.filterShare && (
              <Menu.Item
                className="sider-header sider-headers sider-headerss"
                key="together"
                context={{ aaa: "abc" }}
                style={{
                  backgroung: "#EFF4FF",
                }}
              >
                <div
                  className="sider-title"
                  style={{ display: "inline-flex", border: "none" }}
                >
                  <Icon
                    type="icon-xiala3"
                    className={`${
                      area3Visible ? "icon-xiala3" : "icon-xiala3 xialaTrans"
                    }`}
                    style={{ display: "inline", color: "#B9B9B9" }}
                  />
                  <Icon
                    type="icon-gongxianggongzuoqu"
                    className="icon_rule"
                    style={{ display: "inline", color: "#5182E4" }}
                  />
                  <span
                    style={{
                      color: "#5182E4",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    共享工作区
                  </span>
                </div>
              </Menu.Item>
            )}
          {catalogs.length &&
            area3Visible &&
            this.props.type !== "DatareportingMangerCatalog" &&
            this.props.type !== "application" &&
            !this.props.filterShare &&
            this.getCatalogTree(catalogs[2], "share").map((child) =>
              this.renderCatalogMenu(child, "noAdd", 0, "share")
            )}
        </Menu>
      </Fragment>
    );
  }
}

export default SiderCatalogMenu;
