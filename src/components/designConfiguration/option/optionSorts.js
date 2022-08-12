import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Select } from 'antd';
import { observer } from 'mobx-react';
import uuid from 'uuid/v4';
import './optionSorts.less';
import { ErrorMessage } from 'common/errorMessage';
const { Option } = Select;

@observer
class OptionSorts extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
    saveOptionSorts: PropTypes.func,
    block: PropTypes.object,
    formColumnList: PropTypes.array,
    columnData: PropTypes.array,
    store: PropTypes.object,
  };

  state = {
    option_sorts: [],
  };

  componentDidMount() {
    if (this.props.block.columnStyle.option_sorts) {
      let option_sorts = JSON.parse(this.props.block.columnStyle.option_sorts);
      this.setState({
        option_sorts: option_sorts,
      });
    } else {
      this.setState({ option_sorts: [{}] });
    }
  }

  addSorts = () => {
    let { option_sorts } = this.state;
    option_sorts.push({ id: uuid() });
    this.setState({ option_sorts });
  };

  changeValueColumn = (index, e) => {
    let { option_sorts } = this.state;
    option_sorts[index].orderColumn = e;
    this.setState({ option_sorts });
  };

  changeOrderType = (index, e) => {
    let { option_sorts } = this.state;
    option_sorts[index].orderType = e;
    this.setState({ option_sorts });
  };

  deleteList = index => {
    let { option_sorts } = this.state;
    option_sorts.splice(index, 1);
    this.setState({ option_sorts });
  };

  save = () => {
    let { option_sorts } = this.state;
    option_sorts = option_sorts.filter((item, index) => {
      if (item.orderColumn && item.orderType) {
        return true;
      } else {
        return false;
      }
    });
    let obj = {};
    let falg = true;
    option_sorts.map((item, index) => {
      if (obj[item.orderColumn]) {
        falg = false;
      } else {
        obj[item.orderColumn] = 1;
      }
    });
    if (falg) {
      this.props.saveOptionSorts(JSON.stringify(option_sorts));
    } else {
      ErrorMessage({ messages: intl.get('REPO.SFASR') });
    }
  };

  render() {
    let { columnData } = this.props;

    const { option_sorts } = this.state;
    return (
      <Modal
        title={intl.get('REPO.OPTION_SORTING')}
        className="optionSortsModal"
        visible={this.props.visible}
        width={620}
        onCancel={this.props.handleCancel}
        onOk={this.save}
        okText={intl.get('REPO.CONFIRM')}
        cancelText={intl.get('REPO.CANCEL')}
      >
        <div style={{ height: 40 }}>{intl.get('REPO.SORT_FIELD')}</div>
        {option_sorts &&
          option_sorts.map((ele, index) => {
            return (
              <div
                key={ele.id || ele.mapping_column_id}
                style={{ height: '50px' }}
              >
                <Select
                  style={{ width: 255 }}
                  onChange={this.changeValueColumn.bind(this, index)}
                  value={ele.orderColumn}
                >
                  {columnData &&
                    columnData.map((item, index) => {
                      if (!item) {
                        return null;
                      }
                      return (
                        <Option value={item} key={index}>
                          {item}
                        </Option>
                      );
                    })}
                </Select>
                <Select
                  style={{ width: 255, marginLeft: 10 }}
                  onChange={this.changeOrderType.bind(this, index)}
                  value={ele.orderType}
                >
                  <Option value={'DESC'}>
                    {intl.get('REPO.DESCENDING_ORDER')}
                  </Option>
                  <Option value={'ASC'}>
                    {intl.get('REPO.ASCENDING_ORDER')}
                  </Option>
                </Select>
                <img
                  src={require(`@/data-form/form/data-form-design/images/delete2.png`)}
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                  onClick={this.deleteList.bind(this, index)}
                />
              </div>
            );
          })}

        <Button className="addButton" onClick={this.addSorts}>
          {intl.get('ANAL.ADD_TO')}
        </Button>
      </Modal>
    );
  }
}

export default OptionSorts;
