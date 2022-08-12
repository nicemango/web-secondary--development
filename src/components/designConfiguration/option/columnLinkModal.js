import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Modal, Table, Button, message, Checkbox } from 'antd';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
import { toJS } from 'mobx';

import { queryByDictId } from 'common/service/dataReportingNew';
import { SELECT } from '@/config/dataReporting/components';
import { queryAssetData } from 'common/service/jdbc-asset';
import { formatDates } from 'common/Transform';
import { intlGetKey } from 'utils/international';

import './columnLinkModal.less';

const { Option } = Select;
const { DATA_TYPE } = SELECT;

const uniq = arr => [...new Set(arr)];

// * intl.get('REPO.UNSUPPORTED_COMPONENTS')
const HiddenComp = [
  'auto_code',
  // 'childtable',
  // 'correlation_child_table',
  // 'pop_up_selection_child_table',
];

const excludeTypeList = [
  'tab',
  'collapse',
  'step',
  'group',
  'grid',
  'childtable',
  'correlation_child_table',
  'pop_up_selection_child_table',
  'timeline',
  'controlled_child_table',
];

const multipleDataInit = {
  multiple_selected: ['other'],
  show: [],
  hide: [],
  condition_value: 1,
};

const OtherText = type => {
  let text = intl.get('REPO.OOC');
  switch (type) {
    case 'select':
    case 'radio':
      text = intl.get('REPO.OTHER_OPTIONS');
      break;
  }
  return text;
};

const loadAesset = async block => {
  let filters = [];
  if (block.columnStyleMap.option_asset_param) {
    filters = (
      JSON.parse(block.columnStyleMap.option_asset_param) || []
    ).filter(item => item.varibleType !== 'components');
  }
  const { data } = await queryAssetData(
    block.columnStyleMap.option_asset_id,
    filters
  );
  let isDate = false;
  let isDateTime = false;
  let isNumber = false;

  let dataSource = [];
  let keyIndex = '';
  let valueIndex = '';
  data[0].map((ele, index) => {
    if (block.columnStyleMap.option_key_column === ele.col_name) {
      keyIndex = index;
      if (ele.col_datatype === 8) {
        isNumber = true;
      }
    }
    if (block.columnStyleMap.option_value_column === ele.col_name) {
      valueIndex = index;
      if (ele.col_datatype === 5) {
        isDate = true;
      }
      if (ele.col_datatype === 6) {
        isDateTime = true;
      }
    }
  });
  data[1].map(ele => {
    dataSource.push({
      value: ele[keyIndex],
      label: ele[valueIndex],
    });
  });
  return {
    dataSource,
    isDate,
    isDateTime,
    isNumber,
  };
};

class ColumnLinkModal extends Component {
  static propTypes = {
    handleCancel: PropTypes.func,
    block: PropTypes.object,
    store: PropTypes.object,
    saveColumnLink: PropTypes.func,
    saveShowLinkList: PropTypes.func,
  };

  state = {
    dataSource: [],
    canLinkColumnList: [],
    multipleData: [cloneDeep(multipleDataInit)],
    assestData: [],
    isDate: false,
    isDateTime: false,
    isNumber: false,
    columnLinkClearDataFlag:
      this.props.block?.columnStyle?.columnLinkClearDataFlag || false,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      onChange: page => {
        this.setState({
          pagination: {
            ...this.state.pagination,
            current: page,
          },
        });
      },
    },
  };

  constructor(props) {
    super(props);
    // * {intl.get('REPO.MOSC')}
    this.type = '';
    switch (this.props.block.showType) {
      case 'check':
      case 'check2':
      case 'select_multiple':
        this.type = 'multiple';
        break;
      default:
        break;
    }
    this.useMultipleData = false;
    // * {intl.get('REPO.IIDIGSLMACAM')}
    if (
      this.type === 'multiple' ||
      this.props.block.columnStyle.option_type === DATA_TYPE.ASSETS
    ) {
      this.useMultipleData = true;
    }
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.block.columnStyle.option_type !==
      this.props.block.columnStyle.option_type
    ) {
      console.log(this.props.block.columnStyle.option_type);
    }
  }

  async componentDidMount() {
    let canLinkColumnList = this.initNewFormList();
    this.setState({ loading: true });
    let tempObj = {};
    let { dataSource } = this.state;
    let block = cloneDeep(toJS(this.props.block));
    if (block.formComponentLinkDtoList) {
      this.reTransFormColumnLink(block.formComponentLinkDtoList).map(item => {
        tempObj[item.condition_value] = {
          hide: item.hide || [],
          show: item.show || [],
        };
      });
    }

    if (block.columnStyleMap.option_type === DATA_TYPE.STATIC) {
      JSON.parse(block.columnStyleMap.option_value).map(ele => {
        if (tempObj[ele.value]) {
          dataSource.push({
            condition_value: ele.value,
            hide: tempObj[ele.value].hide,
            show: tempObj[ele.value].show,
            label: ele.label,
          });
        } else {
          dataSource.push({
            condition_value: ele.value,
            hide: [],
            show: [],
            label: ele.label,
          });
        }
      });
    } else if (block.columnStyleMap.option_type === DATA_TYPE.ASSETS) {
      if (block.columnStyleMap.option_asset_id) {
        const res = await loadAesset(block);
        this.setState({
          ...res,
          assestData: res.dataSource,
        });
      }
    } else {
      const { data } = await queryByDictId(block.columnStyleMap.option_dict);
      data.map(ele => {
        if (
          (block.columnStyleMap.option_show_type === DATA_TYPE.STATIC &&
            tempObj[ele.label]) ||
          (block.columnStyleMap.option_show_type !== DATA_TYPE.STATIC &&
            tempObj[ele.content])
        ) {
          const diffKey =
            block.columnStyleMap.option_show_type === DATA_TYPE.STATIC
              ? ele.label
              : ele.content;
          dataSource.push({
            condition_value: diffKey,
            hide: tempObj[diffKey].hide,
            show: tempObj[diffKey].show,
          });
        } else {
          dataSource.push({
            condition_value:
              block.columnStyleMap.option_show_type === DATA_TYPE.STATIC
                ? ele.label
                : ele.content,
            hide: [],
            show: [],
          });
        }
      });
    }

    const blockColumnLinkDetailList =
      (block.formComponentLinkDtoList &&
        this.reTransFormColumnLink(block.formComponentLinkDtoList).map(item => {
          let condition_value;
          try {
            condition_value = JSON.parse(item.condition_value);
          } catch (err) {
            condition_value = item.condition_value;
          }
          return {
            ...item,
            multiple_selected: condition_value,
          };
        })) ||
      [];

    // * {intl.get('REPO.RTOO')}index
    let otherIndex = 0;
    if (blockColumnLinkDetailList.length) {
      blockColumnLinkDetailList.some((item, index) => {
        if (item.multiple_selected[0] === 'other') {
          otherIndex = index;
          return true;
        }
      });
      // * {intl.get('REPO.COSC')}
      blockColumnLinkDetailList[0] = blockColumnLinkDetailList.splice(
        otherIndex,
        1,
        blockColumnLinkDetailList[0]
      )[0];
    }

    const multipleData = this.useMultipleData
      ? [
          ...((blockColumnLinkDetailList.length &&
            blockColumnLinkDetailList) || [cloneDeep(multipleDataInit)]),
        ]
      : [cloneDeep(multipleDataInit)];

    dataSource.forEach(data => {
      canLinkColumnList.forEach(
        item => data.show.includes(item.id) && (item.showFlag = true)
      );
    });
    const canLinkColumnIds = canLinkColumnList.map(item => item.id);
    dataSource.forEach(data => {
      data.hide = data.hide.filter(id => canLinkColumnIds.includes(id));
      data.show = data.show.filter(id => canLinkColumnIds.includes(id));
    });
    this.setState({
      dataSource,
      multipleData,
      canLinkColumnList,
    });
    this.setState({ loading: false });
  }
  save = () => {
    const data = this.useMultipleData
      ? this.state.multipleData.map(data => {
          return {
            ...data,
            condition_value: JSON.stringify(data.multiple_selected),
            multipleData: Array.isArray(data.multiple_selected)
              ? data.multiple_selected
              : [data.multiple_selected],
            multiple_selected: Array.isArray(data.multiple_selected)
              ? data.multiple_selected
              : [data.multiple_selected],
          };
        })
      : this.state.dataSource;

    this.props.saveColumnLink(
      this.transFormColumnLink(data),
      this.state.columnLinkClearDataFlag
    );
  };
  transFormColumnLink = columnLink => {
    let newData = [];
    columnLink.forEach(column => {
      column.show.forEach(item =>
        newData.push({
          masterComponentId: this.props.block.id,
          linkComponentId: item,
          showOrHide: '1',
          conditionValue: column.condition_value,
        })
      );
      column.hide.forEach(item =>
        newData.push({
          masterComponentId: this.props.block.id,
          linkComponentId: item,
          showOrHide: '0',
          conditionValue: column.condition_value,
        })
      );
    });
    return newData;
  };
  reTransFormColumnLink = data => {
    let newColumnLink = [];
    data.forEach(column => {
      if (column.conditionValue !== undefined) {
        let curOptionIndex = newColumnLink.findIndex(
          item => item.condition_value === column.conditionValue
        );
        if (curOptionIndex === -1) {
          let newColumn = {
            condition_value: column.conditionValue,
            label: '',
            show: [],
            hide: [],
          };
          newColumn[column.showOrHide === '0' ? 'hide' : 'show'].push(
            column.linkComponentId
          );
          newColumnLink.push(newColumn);
        } else {
          newColumnLink[curOptionIndex][
            column.showOrHide === '0' ? 'hide' : 'show'
          ].push(column.linkComponentId);
        }
      }
    });
    return newColumnLink;
  };

  handleChange = (_index, e) => {
    const { pagination } = this.state;
    const index = _index + (pagination.current - 1) * pagination.pageSize;
    const {
      dataSource: selectData,
      multipleData,
      canLinkColumnList,
    } = this.state;
    const dataSource = this.useMultipleData ? multipleData : selectData;
    // {intl.get('REPO.AAO')}
    if (e.length > dataSource[index]['show'].length) {
      let addId = e[e.length - 1];
      canLinkColumnList.forEach(
        item => addId === item.id && (item.showFlag = true)
      );
    } else {
      let deleteId = dataSource[index]['show'].find(
        item => e.indexOf(item) === -1
      );
      let flag = dataSource.some(
        (item, i) => i !== index && item['show'].indexOf(deleteId) !== -1
      );
      if (!flag) {
        canLinkColumnList.forEach(
          item => deleteId === item.id && (item.showFlag = false)
        );
      }
    }
    dataSource[index]['show'] = e;
    dataSource.map(data => {
      data.hide = canLinkColumnList
        .map(item => !data.show.includes(item.id) && item.showFlag && item.id)
        .filter(item => item);
    });
    this.setState({
      [this.useMultipleData ? 'multipleData' : 'selectData']: dataSource,
      canLinkColumnList,
    });
  };

  addDatasource = data => {
    const { canLinkColumnList } = this.state;
    data.push({
      show: [],
      hide: [
        ...canLinkColumnList
          .map(item => item.showFlag && item.id)
          .filter(item => item),
      ],
      condition_value: data.length,
      multiple_selected: [],
    });
    this.setState({ multipleData: data });
  };

  handleSelectedChange = (index, selectedOptions) => {
    const { multipleData } = this.state;
    const multipleDataNew = multipleData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          multiple_selected: selectedOptions,
        };
      } else {
        return item;
      }
    });
    this.setState({ multipleData: multipleDataNew });
  };

  deleteMultipleList = index => {
    const { multipleData = [], canLinkColumnList = [] } = this.state;
    if (index === 0) {
      message.warn(intl.get('REPO.OOCBD'));
      return;
    }

    const filterMultipleData = multipleData.filter((item, i) => i !== index);

    // * 可能要删除的 {intl.get('ANAL.VALUE')}，需要进行检索
    const deleteArr = multipleData[index].show || [];

    deleteArr.forEach(deleteShowId => {
      let flag = true;
      filterMultipleData.forEach(filterData => {
        let isInShow = true;
        filterData.show.some(filterShowId => {
          if (filterShowId === deleteShowId) {
            isInShow = false;
            flag = false;
          }
        });
        if (isInShow) {
          if (filterData['hide'].indexOf(deleteShowId) !== -1) {
            filterData['hide'].splice(
              filterData['hide'].indexOf(deleteShowId),
              1
            );
          }
        }
      });

      if (flag) {
        // 删除后配置项会缺失
        // canLinkColumnList.splice(canLinkColumnList.indexOf(deleteShowId), 1);
        filterMultipleData.map(item => {
          if (item['hide'].indexOf(deleteShowId) !== -1) {
            item['hide'].splice(item['hide'].indexOf(deleteShowId), 1);
          }
        });
        canLinkColumnList.forEach(
          item => deleteShowId === item.id && (item.showFlag = false)
        );
      }
    });
    console.log('--------122', canLinkColumnList);
    this.setState({
      multipleData: filterMultipleData,
    });
  };

  buildConditionOptions = () => {
    const { dataSource, assestData, isDate, isDateTime } = this.state;
    const { block } = this.props;
    if (block.columnStyle.option_type === DATA_TYPE.ASSETS) {
      return assestData.map((item, index) => {
        let label =
          block.columnStyle.show_flag === '0'
            ? item.value
            : isDate
            ? formatDates(item.label)
            : isDateTime
            ? moment(item.label).format('YYYY-MM-DD HH:mm:ss')
            : item.label === null
            ? ''
            : `${item.label}`;
        return (
          <Option key={index} value={item.value}>
            {intl.get(label || 'common.empty') || label}
          </Option>
        );
      });
    } else {
      return dataSource.map((item, index) => {
        return (
          <Option value={item.condition_value} key={index + item.id}>
            {block.columnStyle.option_type === '1' // * 1 静态数据 3 字典数据
              ? block.columnStyle.show_flag !== '0' // * 显示标签
                ? item.label
                : item.condition_value
              : intlGetKey(`${item.condition_value}`)}
          </Option>
        );
      });
    }
  };

  changeHideClearData = e => {
    this.setState({ columnLinkClearDataFlag: e.target.checked });
  };

  initNewFormList = () => {
    const { block, store } = this.props;
    const tileBlocks = this.flatListIncludeGroup(store.setInfo.formColumnList);
    let newFormList = [];
    let excludeIds = [];
    tileBlocks.forEach(item => {
      if (excludeTypeList.includes(item.showType) && item.subTableComponents) {
        if (
          Array.isArray(item.subTableComponents) &&
          item.subTableComponents.length
        ) {
          item.subTableComponents.forEach(m => {
            if (m.showType !== 'emptyBlock') {
              excludeIds.push(m.id);
            }
          });
        }
      }
    });
    tileBlocks
      .filter(block => HiddenComp.indexOf(block.showType) === -1)
      .map(item => {
        if (
          item.id !== block.id &&
          item.showType !== 'emptyBlock' &&
          !item.columnLinkHide &&
          !excludeIds.includes(item.id)
        ) {
          newFormList.push({
            name: item.columnStyle.title,
            id: item.id,
          });
        }
      });
    return newFormList;
  };

  flatListIncludeGroup(data, treeArrays = []) {
    if (Array.isArray(data)) {
      data.forEach(ele => {
        if (
          Array.isArray(ele.subLayoutComponents) &&
          ele.subLayoutComponents.length
        ) {
          //  * {intl.get('COMM.PITGI')}
          treeArrays.push(ele);
          this.flatListIncludeGroup(
            ele.subLayoutComponents.flat(Infinity),
            treeArrays
          );
        } else if (
          Array.isArray(ele.subTableComponents) &&
          ele.subTableComponents.length
        ) {
          // * {intl.get('COMM.PITSTI')}
          treeArrays.push(ele);
          this.flatListIncludeGroup(
            ele.subTableComponents.flat(Infinity),
            treeArrays
          );
        } else {
          treeArrays.push(ele);
        }
      });
    } else {
      treeArrays.push(data);
      [data.subLayoutComponents, data.subTableComponents].some(item => {
        if (Array.isArray(item) && item.length) {
          this.flatListIncludeGroup(item, treeArrays);
          return true;
        }
      });
    }
    return treeArrays.flat(Infinity);
  }

  render() {
    const {
      dataSource,
      multipleData,
      columnLinkClearDataFlag,
      loading,
      canLinkColumnList,
      pagination,
    } = this.state;
    const { block } = this.props;

    let data = dataSource;
    if (this.useMultipleData) {
      data = multipleData;
    }

    // block.columnStyle.option_type === DATA_TYPE.STATIC ||
    //   block.columnStyle.option_type === DATA_TYPE.DICTIONARY ||
    //   block.columnStyle.option_type === DATA_TYPE.ASSETS;
    const columns = [
      {
        title: intl.get('REPO.WTOI'),
        dataIndex: 'condition_value',
        width: this.useMultipleData ? 250 : undefined,
        render: (text, record, index) => {
          if (record?.multiple_selected?.[0] === 'other') {
            return <span>{OtherText(block.showType)}</span>;
          }
          if (this.useMultipleData) {
            return (
              <Select
                mode={this.type}
                onChange={this.handleSelectedChange.bind(this, index)}
                value={record.multiple_selected}
              >
                {this.buildConditionOptions()}
              </Select>
            );
          } else {
            let label =
              block.columnStyle.option_type === '1'
                ? block.columnStyle.show_flag !== '0'
                  ? record.label
                  : record.condition_value
                : text;
            return <span>{intl.get(label || 'common.empty') || label}</span>;
          }
        },
      },
      {
        title: intl.get('REPO.DTFC'),
        dataIndex: 'show',
        width: 250,
        render: (text, record, index) => {
          return (
            <Select
              mode="multiple"
              onChange={this.handleChange.bind(this, index)}
              value={uniq(record.show)}
            >
              {canLinkColumnList.map((item, index) => {
                return (
                  <Option value={item.id} key={index + item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        title: intl.get('REPO.HTFC'),
        dataIndex: 'hide',
        width: 250,
        render: (text, record, index) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Select mode="multiple" value={uniq(record.hide)} disabled>
                {canLinkColumnList.map((item, index) => {
                  return (
                    <Option value={item.id} key={index + item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
              {this.useMultipleData && (
                <img
                  src={require(`@/data-form/form/data-form-design/images/delete2.png`)}
                  style={{ marginLeft: 8, cursor: 'pointer', height: '34px' }}
                  onClick={this.deleteMultipleList.bind(this, index)}
                />
              )}
            </div>
          );
        },
      },
    ];
    return (
      <Modal
        title={intl.get('REPO.OPTION_ASSOCIATION')}
        className="columnLinkModal"
        id="columnLinkModal"
        visible
        width={800}
        onCancel={this.props.handleCancel}
        onOk={this.save}
        okText={intl.get('REPO.CONFIRM')}
        cancelText={intl.get('REPO.CANCEL')}
      >
        <div className="clear">
          <Checkbox
            checked={columnLinkClearDataFlag}
            onChange={this.changeHideClearData}
          />
          <span className="clear-title">{intl.get('REPO.CDWHC')}</span>
          <span className="info">{intl.get('REPO.TCCOSCTC')}</span>
        </div>
        <div className="tips">{intl.get('REPO.DOCATTSOTCCAPOCBDIA')}</div>
        <Table
          key={require('uuid/v4')()}
          dataSource={data}
          columns={columns}
          pagination={data !== multipleData ? pagination : false}
          loading={loading}
        />
        {data === multipleData && (
          <Button
            className="add-button"
            onClick={this.addDatasource.bind(this, data)}
          >
            {intl.get('REPO.ADD_TO')}
          </Button>
        )}
      </Modal>
    );
  }
}

export default ColumnLinkModal;
