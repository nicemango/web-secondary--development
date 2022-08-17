import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select, Modal, Input, Button, message, Spin } from "antd";
import "./index.less";
import moment from "moment";
import Table2 from "../common/components/Table2";
const { Option } = Select;

export default class SelectModal extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    tableColumns: PropTypes.array,
    modalTitle: PropTypes.string,
    placeholder: PropTypes.string,
    modalWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selectStyle: PropTypes.object,
    allowClear: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    onChange: PropTypes.func,
    valueColumn: PropTypes.string,
    labelColumn: PropTypes.string,
    id: PropTypes.string,
    block: PropTypes.object,
    saveSelectModal: PropTypes.func,
    styleSelect: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    dataSource: [],
    defaultValue: [],
    value: [],
    tableColumns: [],
    modalTitle: "弹窗",
    modalWidth: 1000,
    allowClear: true,
    readOnly: false,
    disabled: false,
    placeholder: "",
    size: "middle",
    block: {},
  };

  state = {
    isModal: false,
    seletedValues: [],
    selectColumn: null,
    selectValue: null,
  };

  isClear = false;

  componentDidMount = () => {
    this.setState({ dataSource: this.props.dataSource });
  };

  handleCancel = () => {
    this.setState({ isModal: false });
  };

  handleOk = () => {
    const { onChange, dataSource, block } = this.props;
    const { selectKey } = this.state;
    const selectRow = dataSource.find(
      (item) => item[block.valueColumn] === selectKey
    );
    const optionData = {
      data: selectRow,
    };
    onChange(selectKey, optionData);
    this.setState({
      isModal: false,
    });

    let retSelectKey = selectKey;
    if (selectRow) {
      let selectedRowDatatype = null;
      let selectDataIndex = Object.keys(selectRow).find(
        (key) => selectRow[key] === retSelectKey
      );
      this.props.tableColumns.map((item) => {
        const { dataIndex, col_datatype } = item;
        if (dataIndex === selectDataIndex) {
          selectedRowDatatype = col_datatype;
        }
      });
      if (selectedRowDatatype === 5) {
        retSelectKey = moment(selectKey).format("YYYY-MM-DD");
      } else if (selectedRowDatatype === 6) {
        retSelectKey = moment(selectKey).format("YYYY-MM-DD HH:mm:ss");
      }
    }

    this.props.saveSelectModal(retSelectKey, selectRow);
  };

  onSelectClick = () => {
    if (this.props.disabled || this.props.readOnly) {
      return;
    }
    if (this.isClear) {
      this.isClear = false;
      return;
    }
    this.setState({
      isModal: true,
      selectKey: this.props.value,
    });
  };

  changeSelectColumn = (value) => {
    this.setState({ selectColumn: value });
  };

  changeSelectValue = (e) => {
    this.setState({ selectValue: e.target.value });
  };

  handleSearch = () => {
    let { selectColumn, selectValue } = this.state;
    let { dataSource } = this.props;
    if (selectColumn && selectValue) {
      dataSource = dataSource.filter((item) => {
        return item[selectColumn]?.includes(selectValue);
      });
      this.setState({ dataSource });
    } else {
      message.error("请选择字段并输入匹配内容");
    }
  };

  handleReset = () => {
    this.setState({ selectColumn: null, selectValue: null });
    this.setState({ dataSource: this.props.dataSource });
  };

  dropdownRender = (dataSource) => {
    const { isModal } = this.state;
    let { tableColumns, modalTitle, modalWidth, block, loading } = this.props;
    let that = this;

    const rowSelection = {
      type: "radio",
      onChange(selectedRowKeys, selectedRow) {
        that.setState({
          selectKey: selectedRow[0][that.props.valueColumn],
          selectedRowKeys: selectedRowKeys,
        });
      },
      selectedRowKeys: this.state.selectedRowKeys,
      defaultSelectedRowKeys: this.state.selectedRowKeys,
    };

    // 行点击时候选中该行
    const onRow = (record) => {
      return {
        onClick: () => {
          that.setState({
            selectKey: record[this.props.valueColumn],
            selectedRowKeys: [record?.key],
          });
        },
      };
    };
    /**
     * 根据后台配置不显示部分表格字段
     * key为组件id，值为需要过滤列字段数组
     */
    const { data_report_selectModal_columns_filter } =
      window.configuration || {};

    let filterTableColums = tableColumns;
    let filterSetting = data_report_selectModal_columns_filter?.current_value
      ? JSON.parse(data_report_selectModal_columns_filter.current_value)
      : {};
    if (filterSetting[this.props.id]) {
      filterTableColums = filterTableColums.filter((column) => {
        return !(
          filterSetting[this.props.id].includes(column.title) ||
          filterSetting[this.props.id].includes(column.dataIndex)
        );
      });
    }

    if (block.optionAssetShowColumns) {
      let showColumns = block.optionAssetShowColumns;
      filterTableColums = filterTableColums.filter((column) => {
        return showColumns.includes(column.dataIndex);
      });
    } else {
      filterTableColums = [];
    }
    return (
      <Modal
        title={modalTitle}
        okText="确定"
        cancelText="关闭"
        visible={isModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered
        width={modalWidth}
        destroyOnClose={true}
        className="selectModal"
      >
        <Spin spinning={loading}>
          <div style={{ margin: "10px 0" }}>
            <Select
              style={{ width: 120, marginRight: 12 }}
              value={this.state.selectColumn}
              onChange={this.changeSelectColumn}
            >
              {filterTableColums.map((item, index) => {
                return item.col_datatype === 0 ? (
                  <Option value={item.dataIndex} key={index}>
                    {item.title}
                  </Option>
                ) : (
                  ""
                );
              })}
            </Select>
            <Input
              style={{ width: 120, marginRight: 12 }}
              value={this.state.selectValue}
              onChange={this.changeSelectValue}
              maxLength={30}
            />
            <Button
              type="primary"
              onClick={this.handleSearch}
              style={{ marginRight: 12 }}
            >
              查询
            </Button>
            <Button onClick={this.handleReset}>重置</Button>
          </div>
          {!loading && (
            <Table2
              rowKey={(record) => record.data_id}
              rowSelection={rowSelection}
              onRow={onRow}
              columns={filterTableColums}
              dataSource={dataSource}
              size="small"
              locale={{ emptyText: "暂无数据" }}
              scroll={{ x: "max-content" }}
              pagination={{
                // 分页
                defaultPageSize: 5,
                total: dataSource.length,
                pageSizeOptions: [5, 10],
              }}
            />
          )}
        </Spin>
      </Modal>
    );
  };

  onClear = () => {
    const { onChange } = this.props;
    onChange(null);
    this.setState({ selectKey: null });
    this.isClear = true;
    this.props.saveSelectModal(null, null);
  };

  render() {
    const {
      styleSelect,
      allowClear,
      placeholder,
      size,
      readOnly,
      disabled,
      valueColumn,
      labelColumn,
      //   defaultValue,
    } = this.props;
    const { dataSource } = this.state;

    return (
      <>
        <Select
          allowClear={allowClear}
          style={styleSelect}
          showArrow
          showSearch={false}
          maxTagCount="responsive"
          value={this.props.value}
          onClick={this.onSelectClick}
          onClear={this.onClear}
          open={false}
          placeholder={placeholder}
          size={size}
          readOnly={readOnly}
          disabled={disabled}
        >
          {(dataSource || []).map((item) => {
            return (
              <Option key={item[valueColumn]} value={item[valueColumn]}>
                {item[labelColumn]}
              </Option>
            );
          })}
        </Select>
        {this.dropdownRender(dataSource || [])}
      </>
    );
  }
}
