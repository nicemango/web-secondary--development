import React, { Component } from "react";
import { Input, Button, Select, Popover } from "antd";
import PropTypes from "prop-types";
import {
  getColumnDataByAssetId,
  queryFormByAssetId,
} from "../../../common/service/dataReportingNew";
import ChooseAssetModal from "./assetModal";
import "./index.less";
import "../../../common/style/variables.less";

import imgTips from "../../../common/images/tips.png";

const DATA_TYPE = {
  ASSETS: "4", // * 资产数据
};

const { Option } = Select;

class SiderOption extends Component {
  static propTypes = {
    id: PropTypes.string,
    configuration: PropTypes.object,
    onValueChange: PropTypes.func,
  };

  state = {
    visible: false,
    columnData: [],
    assetName: "",
    editType: undefined,
    assetRelationForm: [], // {intl.get('REPO.FLOAA')}
    option_asset_name: null, //资产ID
    option_value_column: "", //显示字段
    option_key_column: "", //存储字段
    option_asset_show_columns: [], //弹窗显示字段
  };

  constructor(props) {
    super(props);
    this.otherOptionRef = React.createRef();
  }

  componentDidMount() {
    const { configuration } = this.props;
    const {
      option_asset_id,
      option_asset_name,
      option_value_column,
      option_key_column,
      option_asset_show_columns,
    } = configuration;
    this.setState({
      option_asset_id,
      option_asset_name,
      option_value_column,
      option_key_column,
      option_asset_show_columns,
    });
    if (option_asset_id) {
      this.loadData(option_asset_id);
      this.queryFormByAssetId(option_asset_id);
    }
  }

  loadData = async (option_asset_id) => {
    const { data } = await getColumnDataByAssetId(option_asset_id);
    this.setState({ columnData: data });
  };

  queryFormByAssetId = async (assetId) => {
    const { data } = await queryFormByAssetId(assetId);
    this.setState({ assetRelationForm: data });
  };
  // * {intl.get('COMM.RTIA')}（部分）

  changeValueColumn = (e) => {
    this.setState(
      {
        option_value_column: e,
      },
      () => {
        this.props.onValueChange(this.state);
      }
    );

    let datatype;
    const { columnData } = this.state;
    columnData.map((item) => {
      if (e === item.col_name) {
        datatype = item.col_datatype;
      }
    });
    if (datatype !== 5 && datatype !== 6) {
      this.setState({
        option_key_column: e,
      });
    }
  };

  changeKeyColumn = (e) => {
    this.setState(
      {
        option_key_column: e,
      },
      () => {
        this.props.onValueChange(this.state);
      }
    );
  };

  chooseAsset = (currentAsset) => {
    this.setState({ visible: !this.state.visible }, () => {
      this.props.onValueChange(this.state);
    });
  };

  saveAsset = async (currentAsset) => {
    const { asset_id, asset_name } = currentAsset;
    //保存资产信息选择
    const { data } = await getColumnDataByAssetId(asset_id);
    this.queryFormByAssetId(asset_id);
    this.setState(
      {
        visible: false,
        columnData: data,
        option_asset_id: asset_id,
        option_asset_name: asset_name,
        option_value_column: "",
        option_key_column: "",
        option_asset_show_columns: [],
      },
      () => {
        this.props.onValueChange(this.state);
      }
    );
  };

  /** 显示弹窗列修改 */
  changeShowColumns = (e) => {
    this.setState({ option_asset_show_columns: e }, () => {
      this.props.onValueChange(this.state);
    });
  };

  render() {
    const { smart_data_type, id, configuration } = this.props;
    const {
      visible,
      columnData,
      option_asset_name,
      option_value_column,
      option_key_column,
      option_asset_show_columns,
    } = this.state;
    let keyColumnData = [];
    let newColumnData = [];
    keyColumnData = columnData.filter((item) => {
      return (
        item.col_datatype !== 5 && item.col_datatype !== 6 && !item.tableName
      );
    });
    newColumnData = columnData.filter((item) => {
      return !item.tableName;
    });

    const assestDisabled = smart_data_type === "parentId";
    return (
      <div className="option_render_container">
        <div className="sider_style_wrapper sider_option" key={id}>
          <div className="sider_style_wrapper">
            <div className="sider_style_wrapper_title comp_prop_line title">
              数据选项
            </div>
            <Select
              style={{ width: "100%", marginTop: 0 }}
              value={DATA_TYPE.ASSETS}
            >
              <Option key={DATA_TYPE.ASSETS}>资产数据</Option>
            </Select>
          </div>

          {/* 资产名称 */}
          <div style={{ width: "100%" }}>
            <div
              style={{ marginTop: 16 }}
              className="sider_style_wrapper_title"
            >
              资产名称
              <Popover
                content={
                  <div className="tipsBreak">
                    请保证显示字段、存储字段
                    、排序字段去重后请保证显示字段、存储字段
                    唯一，否则会造成下拉选项重复
                  </div>
                }
                trigger="click"
              >
                <img
                  src={imgTips}
                  className="tips_icon"
                  title={
                    "请保证显示字段、存储字段、排序字段去重后存储字段唯一，否则会造成下拉选项重复"
                  }
                />
              </Popover>
            </div>

            <div className="both_ends" style={{ marginTop: 8 }}>
              <Input
                style={{ marginRight: 12 }}
                value={option_asset_name}
                disabled={false}
              />
              <Button
                type="primary"
                ghost
                onClick={this.chooseAsset}
                disabled={assestDisabled}
              >
                选择资产
              </Button>
            </div>
          </div>

          <div className="sider_style_wrapper_title" style={{ marginTop: 16 }}>
            显示字段
            <Popover
              content={
                <div className="tipsBreak">
                  当显示字段为日期类型时，显示为时间戳
                </div>
              }
              trigger="click"
            >
              <img
                src={imgTips}
                className="tips_icon"
                title={"当前为下拉框时，时间的显示字段只显示对应的时间戳"}
              />
            </Popover>
          </div>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            onChange={this.changeValueColumn}
            value={option_value_column}
            showSearch
            disabled={assestDisabled}
            className="rounded"
          >
            {newColumnData &&
              newColumnData.map((item, index) => {
                return (
                  <Option value={item.col_name} key={index}>
                    {item.col_name}
                  </Option>
                );
              })}
          </Select>
          <div className="sider_style_wrapper_title" style={{ marginTop: 16 }}>
            存储字段
          </div>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            onChange={this.changeKeyColumn}
            value={option_key_column}
            showSearch
            disabled={assestDisabled}
            className="rounded"
          >
            {keyColumnData &&
              keyColumnData.map((item, index) => {
                return (
                  <Option value={item.col_name} key={index}>
                    {item.col_name}
                  </Option>
                );
              })}
          </Select>
          <div className="bindMap">
            <div style={{ marginTop: 16 }}>弹窗显示字段</div>
            <Select
              style={{ width: "100%", marginTop: 10 }}
              onChange={this.changeShowColumns}
              value={option_asset_show_columns}
              showSearch
              disabled={assestDisabled}
              mode="multiple"
            >
              {newColumnData &&
                newColumnData.map((item, index) => {
                  return (
                    <Option value={item.col_name} key={index}>
                      {item.col_name}
                    </Option>
                  );
                })}
            </Select>
          </div>

          <ChooseAssetModal
            visible={visible}
            chooseAsset={this.chooseAsset}
            saveAsset={this.saveAsset}
          />
        </div>
      </div>
    );
  }
}

export default SiderOption;
