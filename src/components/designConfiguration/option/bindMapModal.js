import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Select, message } from 'antd';
import { observer } from 'mobx-react';
import uuid from 'uuid/v4';
import { flatListAll } from '@/data-form/form/common/utils/data/flatComponents';
import { intlGetKey } from 'utils/international';

import './bindMapModal.less';
import { ErrorMessage } from 'common/errorMessage';

const { Option } = Select;

const getIsColumnMapping = item => {
  return item.isColumnMapping ?? true;
};

const getColumnDataType = (name, columnData) => {
  const column = columnData.find(item => item.col_name === name);
  const { col_datatype } = column;
  return col_datatype;
};

const MultipleShowType = ['check', 'select_multiple'];
const SingleShowType = ['radio', 'select'];

const isSingle = showType => SingleShowType.includes(showType);
const isMultiple = showType => MultipleShowType.includes(showType);

@observer
class BindMapModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
    saveBindMap: PropTypes.func,
    block: PropTypes.object,
    formColumnList: PropTypes.array,
    columnData: PropTypes.array,
    store: PropTypes.object,
  };

  state = {
    columnMappingList: [],
  };

  componentDidMount() {
    if (this.props.block.formComponentMappingDtoList) {
      this.setState({
        columnMappingList: this.transFormMapping(
          this.props.block.formComponentMappingDtoList
        ),
      });
    } else {
      this.setState({ columnMappingList: [{}] });
    }
  }
  transFormMapping = data => {
    let newData = [];
    data.forEach(item => {
      newData.push({
        mapping_column_id: item.mappingComponentId,
        asset_column_name: item.assetColumnName,
        mapping_column_name_alias: item.mappingComponentNameAlias,
      });
    });
    return newData;
  };
  reTransFormMapping = data => {
    let newData = [];
    data.forEach(item => {
      newData.push({
        masterComponentId: this.props.block.id,
        masterComponentName: this.props.block.columnStyle.title,
        mappingComponentId: item.mapping_column_id,
        mappingComponentName: item.mapping_column_name,
        assetColumnName: item.asset_column_name,
        mappingType: 0,
        mappingComponentNameAlias: item.mapping_column_name_alias,
      });
    });
    return newData;
  };

  addMapList = () => {
    let { columnMappingList } = this.state;
    columnMappingList.push({ id: uuid() });
    this.setState({ columnMappingList });
  };

  changeValueColumn = (index, e) => {
    let { columnMappingList } = this.state;
    columnMappingList[index].asset_column_name = e;
    this.setState({ columnMappingList });
  };

  changeColumnId = (index, e, option) => {
    let { columnMappingList } = this.state;
    columnMappingList[index].mapping_column_id = e;
    columnMappingList[index].mapping_column_name = option.title;
    if (
      columnMappingList[index] &&
      columnMappingList[index].mapping_column_name_alias
    ) {
      columnMappingList[index].mapping_column_name_alias = null;
    }
    this.setState({ columnMappingList });
  };

  changeColumnAlias = (index, e) => {
    let { columnMappingList } = this.state;
    columnMappingList[index].mapping_column_name_alias = e;
    this.setState({ columnMappingList });
  };

  deleteList = index => {
    let { columnMappingList } = this.state;
    columnMappingList.splice(index, 1);
    this.setState({ columnMappingList });
  };

  checkMapping = () => {
    // TODO 后端校验
    const { columnMappingList } = this.state;
    const { columnData, formColumnList } = this.props;
    const allComponents = flatListAll(formColumnList);
    const componentsMap = {};
    allComponents.forEach(item => {
      const { id } = item;
      componentsMap[id] = item;
    });

    const hasError = columnMappingList.some(mapping => {
      const { asset_column_name, mapping_column_id } = mapping;
      const columnDataType = getColumnDataType(asset_column_name, columnData);
      const showType = componentsMap[mapping_column_id]['showType'];
      if (showType === 'number' && columnDataType !== 8) {
        message.error(intlGetKey('COMM.DBMCE'));
        return true;
      }
    });

    return hasError;
  };

  save = () => {
    const hasError = this.checkMapping();
    if (hasError) {
      return;
    }
    let { columnMappingList } = this.state;
    columnMappingList = columnMappingList.filter(item => {
      if (item.asset_column_name && item.mapping_column_id) {
        return true;
      } else {
        return false;
      }
    });
    let obj = {};
    let falg = true;
    columnMappingList.map(item => {
      if (
        obj[item.asset_column_name] ||
        obj[item.mapping_column_id] ||
        obj[item.asset_column_name + item.mapping_column_name_alias] ||
        obj[item.mapping_column_id + item.mapping_column_name_alias]
      ) {
        falg = false;
      } else {
        if (item.mapping_column_name_alias) {
          obj[item.asset_column_name + item.mapping_column_name_alias] = 1;
          obj[item.mapping_column_id + item.mapping_column_name_alias] = 1;
        } else {
          obj[item.asset_column_name] = 1;
          obj[item.mapping_column_id] = 1;
        }
      }
    });
    if (falg) {
      this.props.saveBindMap(this.reTransFormMapping(columnMappingList));
    } else {
      ErrorMessage({ messages: intl.get('REPO.SFASR') });
    }
  };

  tileBlock = (blockArr, tileBlocks) => {
    blockArr.map(item => {
      item.map(ele => {
        if (ele.subLayoutComponents && ele.subLayoutComponents.length) {
          this.tileBlock(ele.subLayoutComponents, tileBlocks);
        } else {
          tileBlocks.push(ele);
        }
      });
    });
    return tileBlocks;
  };

  render() {
    let { columnData, block, store } = this.props;
    let newFormList = [];
    let newAssetList = {};
    let tileBlocks = [];
    store.setInfo.formColumnList.map(item => {
      if (item.subLayoutComponents && item.subLayoutComponents.length) {
        tileBlocks = this.tileBlock(item.subLayoutComponents, tileBlocks);
      } else {
        tileBlocks.push(item);
      }
    });
    tileBlocks = tileBlocks.filter(item => {
      return (
        item.showType !== 'childtable' &&
        item.showType !== 'emptyBlock' &&
        item.id !== block.id
      );
    });

    const addToNewFormList = (block, newFormList, newAssetList, item) => {
      if (block.hasMultipleAsset) {
        if (!item.hasMultipleAsset) {
          return;
        }
      }
      newFormList.push({
        title: item.columnStyle.title,
        id: item.id,
      });
      newAssetList[item.id] = item.componentBusinessConfigList;
    };

    const selfIsSingle = isSingle(block.showType);

    if (block.parentId && block.parent?.isTableComponent) {
      block.parent.subTableComponents.map(item => {
        if (
          item.id !== block.id &&
          !item.onlyRead &&
          item.showType &&
          getIsColumnMapping(item)
        ) {
          if (selfIsSingle) {
            const targetIsMultiple = isMultiple(item.showType);
            if (targetIsMultiple) {
              return;
            }
          }
          addToNewFormList(block, newFormList, newAssetList, item);
        }
      });
    } else {
      tileBlocks.map(item => {
        if (item.id !== block.id && getIsColumnMapping(item)) {
          if (selfIsSingle) {
            const targetIsMultiple = isMultiple(item.showType);
            if (targetIsMultiple) {
              return;
            }
          }
          addToNewFormList(block, newFormList, newAssetList, item);
        }
      });
    }

    const { columnMappingList } = this.state;
    return (
      <Modal
        title={intl.get('REPO.DBM')}
        className="bindMapModal"
        visible={this.props.visible}
        width={620}
        onCancel={this.props.handleCancel}
        onOk={this.save}
        okText={intl.get('REPO.CONFIRM')}
        cancelText={intl.get('REPO.CANCEL')}
      >
        {block.hasMultipleAsset && (
          <p
            style={{
              fontSize: '12px',
              color: 'grey',
              position: 'absolute',
              top: '17px',
              left: '142px',
            }}
          >
            {intl.get('COMM.TDBMOAMSTCCOBMTOMSTC')}
          </p>
        )}
        {columnMappingList &&
          columnMappingList.map((ele, index) => {
            return (
              <div
                key={ele.id || ele.mapping_column_id}
                style={{ height: '50px' }}
              >
                <Select
                  style={{ width: 160 }}
                  onChange={this.changeValueColumn.bind(this, index)}
                  value={ele.asset_column_name}
                >
                  {columnData &&
                    columnData
                      .filter(element => !element.tableName)
                      .map((item, index) => {
                        return (
                          <Option
                            value={
                              item.tableName
                                ? `${item.col_name}__${item.form_column_id}`
                                : `${item.col_name}`
                            }
                            key={index}
                            title={
                              item.tableName
                                ? `${item.col_name}(${item.tableName})`
                                : `${item.col_name}`
                            }
                          >
                            {item.tableName
                              ? `${item.col_name}(${item.tableName})`
                              : `${item.col_name}`}
                          </Option>
                        );
                      })}
                </Select>
                <img
                  src={require(`@/data-form/form/data-form-design/images/right.png`)}
                  style={{ marginLeft: 7, marginRight: 7 }}
                />
                <Select
                  style={{ width: 160 }}
                  onChange={this.changeColumnId.bind(this, index)}
                  value={ele.mapping_column_id}
                >
                  {newFormList &&
                    newFormList.map((item, index) => {
                      return (
                        <Option value={item.id} title={item.title} key={index}>
                          {item.title}
                        </Option>
                      );
                    })}
                </Select>
                {newAssetList[ele.mapping_column_id] &&
                  newAssetList[ele.mapping_column_id].length > 1 && (
                    <Select
                      style={{ width: 160, marginLeft: 10 }}
                      onChange={this.changeColumnAlias.bind(this, index)}
                      value={ele.mapping_column_name_alias}
                    >
                      {newAssetList[ele.mapping_column_id] &&
                        newAssetList[ele.mapping_column_id].map(
                          (item, index) => {
                            return (
                              <Option
                                value={item.extMeaning}
                                title={item.extMeaning}
                                key={index}
                              >
                                {item.extMeaning}
                              </Option>
                            );
                          }
                        )}
                    </Select>
                  )}
                <img
                  src={require(`@/data-form/form/data-form-design/images/delete2.png`)}
                  style={{ marginLeft: 8, cursor: 'pointer' }}
                  onClick={this.deleteList.bind(this, index)}
                />
              </div>
            );
          })}

        <Button className="addButton" onClick={this.addMapList}>
          {intl.get('ANAL.ADD_TO')}
        </Button>
      </Modal>
    );
  }
}

export default BindMapModal;
