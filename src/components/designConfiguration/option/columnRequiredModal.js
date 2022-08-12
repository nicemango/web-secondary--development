import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Modal, Table } from 'antd';
import cloneDeep from 'lodash.clonedeep';
import { toJS } from 'mobx';
import { queryByDictId } from 'common/service/dataReportingNew';
import { observer } from 'mobx-react';
import './columnLinkModal.less';

const { Option } = Select;

// * intl.get('REPO.UNSUPPORTED_COMPONENTS')
const HiddenComp = [
  'auto_code',
  'childtable',
  'correlation_child_table',
  'pop_up_selection_child_table',
];
@observer
class ColumnRequiredModal extends Component {
  static propTypes = {
    handleCancel: PropTypes.func,
    block: PropTypes.object,
    store: PropTypes.object,
    saveColumnRequired: PropTypes.func,
  };

  state = {
    dataSource: [],
    canLinkColumnList: [],
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    let canLinkColumnList = this.initNewFormList();
    let tempObj = {};
    let { dataSource } = this.state;
    let block = cloneDeep(toJS(this.props.block));
    if (block.formComponentRequiredLinkList) {
      let a = this.reTransFormColumnRequired(
        block.formComponentRequiredLinkList
      );
      a.map(item => {
        let required = new Set(item.required);
        let unRequired = new Set(item.unRequired);
        tempObj[item.condition_value] = {
          required: [...required],
          unRequired: [...unRequired],
        };
      });
    }

    if (block.columnStyleMap.option_type === '1') {
      JSON.parse(block.columnStyleMap.option_value).map(ele => {
        if (tempObj[ele.value]) {
          dataSource.push({
            condition_value: ele.value,
            unRequired: tempObj[ele.value].unRequired,
            required: tempObj[ele.value].required,
            label: ele.label,
          });
        } else {
          dataSource.push({
            condition_value: ele.value,
            unRequired: [],
            required: [],
            label: ele.label,
          });
        }
      });
    } else {
      const { data } = await queryByDictId(block.columnStyleMap.option_dict);

      data.map(ele => {
        if (
          (block.columnStyleMap.option_show_type === '1' &&
            tempObj[ele.label]) ||
          (block.columnStyleMap.option_show_type !== '1' &&
            tempObj[ele.content])
        ) {
          const diffKey =
            block.columnStyleMap.option_show_type === '1'
              ? ele.label
              : ele.content;
          dataSource.push({
            condition_value: diffKey,
            unRequired: tempObj[diffKey].unRequired,
            required: tempObj[diffKey].required,
          });
        } else {
          dataSource.push({
            condition_value:
              block.columnStyleMap.option_show_type === '1'
                ? ele.label
                : ele.content,
            unRequired: [],
            required: [],
          });
        }
      });
    }

    dataSource.forEach(data => {
      canLinkColumnList.forEach(
        item => data.required.includes(item.id) && (item.requiredFlag = true)
      );
    });
    const canLinkColumnIds = canLinkColumnList.map(item => item.id);
    dataSource.forEach(data => {
      data.required = data.required.filter(id => canLinkColumnIds.includes(id));
      data.unRequired = data.unRequired.filter(id =>
        canLinkColumnIds.includes(id)
      );
    });

    this.setState({ dataSource, canLinkColumnList });
  };

  initNewFormList = () => {
    const { block, store } = this.props;
    let tileBlocks = [];
    store.setInfo.formColumnList.map(item => {
      if (item.subLayoutComponents && item.subLayoutComponents.length) {
        tileBlocks = this.tileBlock(item.subLayoutComponents, tileBlocks);
      } else {
        tileBlocks.push(item);
      }
    });
    let newFormList = [];
    tileBlocks
      .filter(block => HiddenComp.indexOf(block.showType) === -1)
      .map(item => {
        if (
          item.id !== block.id &&
          item.showType !== 'emptyBlock' &&
          item.showType !== 'double_random' &&
          !item.columnRequireLinkHide
        ) {
          newFormList.push({
            name: item.columnStyle.title,
            id: item.id,
          });
        }
      });

    return newFormList;
  };

  transFormColumnRequired = columnRequired => {
    let newData = [];
    columnRequired.forEach(column => {
      column.required.forEach(item =>
        newData.push({
          masterComponentId: this.props.block.id,
          linkComponentId: item,
          linkComponentTitle: this.state.canLinkColumnList.find(
            column => column.id === item
          )?.name,
          requiredOrUnRequired: '1',
          conditionValue: column.condition_value,
        })
      );
      column.unRequired.forEach(item =>
        newData.push({
          masterComponentId: this.props.block.id,
          linkComponentId: item,
          linkComponentTitle: this.state.canLinkColumnList.find(
            column => column.id === item
          )?.name,
          requiredOrUnRequired: '0',
          conditionValue: column.condition_value,
        })
      );
    });
    return newData;
  };
  reTransFormColumnRequired = data => {
    let newColumnRequired = [];
    data.forEach(column => {
      if (column.conditionValue !== undefined) {
        let curOptionIndex = newColumnRequired.findIndex(
          item => item.condition_value === column.conditionValue
        );
        if (curOptionIndex === -1) {
          let newColumn = {
            condition_value: column.conditionValue,
            label: '',
            required: [],
            unRequired: [],
          };
          newColumn[
            column.requiredOrUnRequired === '0' ? 'unRequired' : 'required'
          ].push(column.linkComponentId);
          newColumnRequired.push(newColumn);
        } else {
          newColumnRequired[curOptionIndex][
            column.requiredOrUnRequired === '0' ? 'unRequired' : 'required'
          ].push(column.linkComponentId);
        }
      }
    });
    return newColumnRequired;
  };

  save = () => {
    this.props.saveColumnRequired(
      this.transFormColumnRequired(this.state.dataSource)
    );
  };

  handleRequiredChange = (e, index) => {
    let { dataSource, canLinkColumnList } = this.state;
    // {intl.get('REPO.AAO')}
    if (e.length > dataSource[index]['required'].length) {
      let addId = e[e.length - 1];
      canLinkColumnList.forEach(
        item => addId === item.id && (item.requiredFlag = true)
      );
    } else {
      let deleteId = dataSource[index]['required'].find(
        item => e.indexOf(item) === -1
      );
      let flag = dataSource.some(
        (item, i) => i !== index && item['required'].indexOf(deleteId) !== -1
      );
      if (!flag) {
        canLinkColumnList.forEach(
          item => deleteId === item.id && (item.requiredFlag = false)
        );
      }
    }
    dataSource[index]['required'] = e;
    dataSource.map(data => {
      data.unRequired = canLinkColumnList
        .map(
          item =>
            !data.required.includes(item.id) && item.requiredFlag && item.id
        )
        .filter(item => item);
    });
    this.setState({ dataSource, canLinkColumnList });
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
    const { dataSource, canLinkColumnList } = this.state;
    const { block } = this.props;

    const columns = [
      {
        title: intl.get('REPO.WTOI'),
        dataIndex: 'condition_value',
        render: (text, record) => {
          let value =
            block.columnStyle.option_type === '1'
              ? block.columnStyle.show_flag !== '0'
                ? record.label
                : record.condition_value
              : text;
          return <span>{intl.get(value || 'common.empty') || value}</span>;
        },
      },
      {
        title: intl.get('REPO.REQUIRED_COMPONENTS'),
        dataIndex: 'required',
        width: 250,
        render: (text, record, index) => {
          return (
            <Select
              mode="multiple"
              onChange={e => this.handleRequiredChange(e, index)}
              value={record.required}
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
        title: intl.get('REPO.NMC'),
        dataIndex: 'unRequired',
        width: 250,
        render: (text, record) => {
          return (
            <Select mode="multiple" value={record.unRequired} disabled>
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
    ];
    return (
      <Modal
        title={intl.get('REPO.REQUIRED_ASSOCIATION')}
        className="columnRequiredModal"
        id="columnRequiredModal"
        visible
        width={700}
        onCancel={this.props.handleCancel}
        onOk={this.save}
        okText={intl.get('REPO.CONFIRM')}
        cancelText={intl.get('REPO.CANCEL')}
      >
        {/* <div className="tips">
          {intl.get('COMM.DOTSO')}，显示其他控件。当前控件和上级选项不能被关联显示。
        </div> */}
        {dataSource.length && (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="condition_value"
          />
        )}
      </Modal>
    );
  }
}

export default ColumnRequiredModal;
