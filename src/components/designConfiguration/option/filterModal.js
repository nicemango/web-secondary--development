import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Input,
  Button,
  Modal,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import { observer } from 'mobx-react';
// @REFACTOR
import {
  DateOption,
  DataType,
  TextOption,
  NumberOption,
} from '@/data-form-components/ConditionOptions';
import moment from 'moment';
import './filterModal.less';

// const DateOption = {
//   2: intl.get('ANAL.BET'),
//   6: intl.get('ANAL.NET'),
//   116: intl.get('ANAL.EMPTY'),
//   117: intl.get('ANAL.NOT_EMPTY'),
//   8: intl.get('ANAL.BEFORE'),
//   9: intl.get('ANAL.AFTER'),
//   13: intl.get('ANAL.RANGE'),
//   15: intl.get('ANAL.TODAY'),
//   16: intl.get('ANAL.YESTERDAY'),
//   17: intl.get('ANAL.LAST_WEEK'),
//   18: intl.get('ANAL.LTW'),
//   19: intl.get('ANAL.LAST_MONTH'),
//   20: intl.get('ANAL.LTM'),
//   21: intl.get('ANAL.LAST_YEAR'),
//   22: intl.get('ANAL.TOMORROW'),
//   23: intl.get('ANAL.NEXT_WEEK'),
//   24: intl.get('ANAL.THIS_WEEK'),
//   25: intl.get('ANAL.PREVIOUS_WEEK'),
//   26: intl.get('ANAL.NEXT_MONTH'),
//   27: intl.get('ANAL.THIS_MONTH'),
//   28: intl.get('ANAL.PREVIOUS_MONTH'),
//   34: intl.get('ANAL.PREVIOUS_QUARTER'),
//   32: intl.get('ANAL.NEXT_QUARTER'),
//   31: intl.get('ANAL.PREVIOUS_YEAR'),
//   29: intl.get('ANAL.NEXT_YEAR'),
//   30: intl.get('ANAL.THIS_YEAR'),
//   33: intl.get('ANAL.THIS_QUARTER'),
// };

// const TextOption = {
//   2: intl.get('ANAL.BET'),
//   6: intl.get('ANAL.NET'),
//   116: intl.get('ANAL.EMPTY'),
//   117: intl.get('ANAL.NOT_EMPTY'),
//   10: intl.get('SRC.CONTAIN'),
//   14: intl.get('SRC.NOT_INCLUDED'),
//   11: intl.get('ANAL.START'),
//   12: intl.get('SRC.END'),
//   37: 'IN',
//   38: 'NOT IN',
// };

// const NumberOption = {
//   110: intl.get('SRC.GREATER_THAN'),
//   111: intl.get('SRC.GTOET'),
//   112: intl.get('SRC.LESS_THAN'),
//   113: intl.get('SRC.LTOET'),
//   2: intl.get('ANAL.BET'),
//   6: intl.get('ANAL.NET'),
//   116: intl.get('ANAL.EMPTY'),
//   117: intl.get('ANAL.NOT_EMPTY'),
//   13: intl.get('ANAL.RANGE'),
// };

const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const SystemVaribles = {
  $current_user_id: '当前用户ID',
  $current_user_name: intl.get('ANAL.CUN'),
  $current_office_id: '当前部门ID',
  $current_office_name: intl.get('ANAL.CDN'),
  $current_company_name: intl.get('ANAL.CCN'),
  $current_time: intl.get('ANAL.CURRENT_TIME'),
  $current_branch_company_id_and_next: intl.get('REPO.CCAS'),
};

let children = [];
Object.keys(SystemVaribles).forEach(variable => {
  children.push(<Option key={variable}>{SystemVaribles[variable]}</Option>);
});

@observer
class FilterModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    saveFilter: PropTypes.func,
    changeDic: PropTypes.func,
    block: PropTypes.object,
    dataSource: PropTypes.array,
    store: PropTypes.object,
    columnData: PropTypes.array,
    newFormList: PropTypes.array,
    handleCancel: PropTypes.func,
  };

  state = {
    filterList: this.props.block.columnStyle.option_asset_param
      ? JSON.parse(this.props.block.columnStyle.option_asset_param)
      : [],
    satisfy_type: 0,
  };

  componentDidMount() {
    if (
      this.state.filterList.length &&
      this.state.filterList[0].satisfy_type !== undefined
    ) {
      this.setState({ satisfy_type: this.state.filterList[0].satisfy_type });
    }
  }

  save = () => {
    const { filterList, satisfy_type } = this.state;
    // let testObj = {};
    // const falg = filterList.every((item, index) => {
    //   if (!testObj[item.varibleType] || item.varibleType !== 'components') {
    //     testObj[item.varibleType] = '1';
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // if (falg) {
    filterList.map((item, index) => {
      item.satisfy_type = satisfy_type;
    });
    this.props.saveFilter(JSON.stringify(filterList));
    // } else {
    //   message.error('组件类型最多可以设置一次');
    // }
  };

  loadOptions = column => {
    let options = [];
    const type = column.datatype || 0;
    if (
      DataType[type] === '日期(年月日)' ||
      DataType[type] === '时间(时分秒)'
    ) {
      for (let value in DateOption) {
        options.push(
          <Option value={+value} key={value}>
            {DateOption[value]}
          </Option>
        );
      }
    } else if (DataType[type] === intl.get('ANAL.CHARACTER_STRING')) {
      for (let value in TextOption) {
        options.push(
          <Option value={+value} key={value}>
            {TextOption[value]}
          </Option>
        );
      }
    } else {
      for (let value in NumberOption) {
        options.push(
          <Option value={+value} key={value}>
            {NumberOption[value]}
          </Option>
        );
      }
    }
    return options;
  };

  changeName = (index, e, option) => {
    let { filterList } = this.state;
    const { columnData } = this.props;
    filterList[index].column = columnData[option.key].col_name;
    filterList[index].datatype = columnData[option.key].col_datatype;
    this.setState({ filterList });
  };

  handleChangeOptions = (index, value) => {
    let { filterList } = this.state;
    filterList[index].type = value;
    this.setState({
      filterList,
    });
  };

  isVariblesSelectShow = dateOption => {
    return (
      dateOption === intl.get('ANAL.EMPTY') ||
      dateOption === intl.get('ANAL.NOT_EMPTY') ||
      dateOption === intl.get('ANAL.RANGE') ||
      dateOption === intl.get('ANAL.TODAY') ||
      dateOption === intl.get('ANAL.YESTERDAY') ||
      dateOption === intl.get('ANAL.LAST_WEEK') ||
      dateOption === intl.get('ANAL.LTW') ||
      dateOption === intl.get('ANAL.LAST_MONTH') ||
      dateOption === intl.get('ANAL.LTM') ||
      dateOption === intl.get('ANAL.LAST_YEAR') ||
      dateOption === intl.get('ANAL.TOMORROW') ||
      dateOption === intl.get('ANAL.NEXT_WEEK') ||
      dateOption === intl.get('ANAL.THIS_WEEK') ||
      dateOption === intl.get('ANAL.PREVIOUS_WEEK') ||
      dateOption === intl.get('ANAL.NEXT_MONTH') ||
      dateOption === intl.get('ANAL.THIS_MONTH') ||
      dateOption === intl.get('ANAL.PREVIOUS_MONTH') ||
      dateOption === intl.get('ANAL.NEXT_YEAR') ||
      dateOption === intl.get('ANAL.THIS_YEAR') ||
      dateOption === intl.get('ANAL.PREVIOUS_YEAR') ||
      dateOption === intl.get('ANAL.NEXT_QUARTER') ||
      dateOption === intl.get('ANAL.THIS_QUARTER') ||
      dateOption === intl.get('ANAL.PREVIOUS_QUARTER')
    );
  };

  loadVariblesSelects(column, condition, varibleType, index) {
    if (this.isVariblesSelectShow(DateOption[condition])) {
      return null;
    }
    const filterLink = [
      'select',
      'radio',
      'check',
      'select_multiple',
      'readOnlySelect',
    ];

    return (
      <Select
        className="options-select"
        placeholder={intl.get('ANAL.PSAT')}
        style={{ width: 120, marginLeft: 20 }}
        onChange={this.handleTypeChanges.bind(this, index)}
        defaultValue="values"
        value={varibleType}
      >
        <Option value="varibles">{intl.get('ANAL.VARIABLE')}</Option>
        <Option value="values">{intl.get('ANAL.FIXED_VALUE')}</Option>
        {filterLink.includes(this.props.block.showType) && (
          <Option value="components">{intl.get('APP.ASSEMBLY')}</Option>
        )}
      </Select>
    );
  }

  handleTypeChanges = (index, value) => {
    let { filterList } = this.state;
    filterList[index].varibleType = value;
    filterList[index].compareObj = undefined;
    this.setState({
      filterList,
    });
  };

  SelectChanges = (index, value) => {
    let { filterList } = this.state;
    filterList[index].compareObj = value;
    this.setState({
      filterList,
    });
  };

  InputChanges = (index, e) => {
    let { filterList } = this.state;
    filterList[index].compareObj = e.target.value;
    this.setState({
      filterList,
    });
  };

  InputNumberChanges = (index, e) => {
    let { filterList } = this.state;
    filterList[index].compareObj = e;
    this.setState({
      filterList,
    });
  };

  minInputChanges = (index, e) => {
    let { filterList } = this.state;
    filterList[index].min = e.target.value;
    this.setState({
      filterList,
    });
  };

  maxInputChanges = (index, e) => {
    let { filterList } = this.state;
    filterList[index].max = e.target.value;
    this.setState({
      filterList,
    });
  };

  dateChanges = (index, item, date) => {
    let { filterList } = this.state;
    if (Array.isArray(date) && date[0] && date[1]) {
      filterList[index].min = this.getFormatTimestamp(date[0], item);
      filterList[index].max = this.getFormatTimestamp(date[1], item);
      this.setState({
        filterList,
      });
    } else {
      filterList[index].compareObj = this.getFormatTimestamp(date, item);
      this.setState({
        filterList,
      });
    }
  };

  getFormatTimestamp = (time, item) => {
    if (typeof time === 'number') {
      return time;
    }
    // const column = this.props.item;
    const type = item.datatype;
    let timestring, momentObj, format;
    format =
      DataType[type] === '日期(年月日)' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
    timestring = time.format(format);
    momentObj = moment(timestring, format);
    return momentObj.valueOf();
  };

  loadInputs = (column, condition, items, index) => {
    let showTime = false;
    let format = 'YYYY-MM-DD';
    const type = items.datatype;
    if (
      DateOption[condition] === intl.get('ANAL.EMPTY') ||
      DateOption[condition] === intl.get('ANAL.NOT_EMPTY')
    ) {
      return null;
    }
    if (DataType[type] === intl.get('ANAL.CHARACTER_STRING')) {
      if (items.varibleType === 'varibles') {
        return (
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={this.SelectChanges.bind(this, index)}
            value={items.compareObj}
          >
            {children}
          </Select>
        );
      } else if (items.varibleType === 'values') {
        return (
          <Input
            onChange={this.InputChanges.bind(this, index)}
            value={items.compareObj}
            style={{ width: 120, marginLeft: 20 }}
          />
        );
      } else {
        return (
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={this.SelectChanges.bind(this, index)}
            value={items.compareObj}
          >
            {this.props.newFormList.map((item, index) => {
              return (
                <Option value={item.id} title={item.title} key={index}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        );
      }
    }

    if (DataType[type] === '时间(时分秒)') {
      showTime = true;
      format = 'YYYY-MM-DD HH:mm:ss';
    }

    switch (DataType[type]) {
      case intl.get('ANAL.DPD'):
      case intl.get('ANAL.INTEGER'):
      case intl.get('ANAL.LONG_INTEGER'):
      case intl.get('ANAL.SPD'):
      case intl.get('ANAL.NUMERICAL_VALUE'):
        if (NumberOption[condition] === intl.get('ANAL.RANGE')) {
          return (
            <div style={{ display: 'inline-block', marginLeft: 20 }}>
              <Input
                style={{ width: 100, textAlign: 'center' }}
                placeholder={intl.get('ANAL.MINIMUM_VALUE')}
                value={items.min}
                onChange={this.minInputChanges.bind(this, index)}
              />
              <span style={{ padding: '0 10px', textAlign: 'center' }}>~</span>
              <Input
                style={{ width: 100, textAlign: 'center' }}
                placeholder={intl.get('ANAL.MAXIMUM')}
                value={items.max}
                onChange={this.maxInputChanges.bind(this, index)}
              />
            </div>
          );
        }
        return items.varibleType === 'varibles' ? (
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={this.SelectChanges.bind(this, index)}
            value={items.compareObj}
          >
            {children}
          </Select>
        ) : items.varibleType === 'values' ? (
          // DataType[type] === intl.get('ANAL.NUMERICAL_VALUE') ? (
          <InputNumber
            onChange={this.InputNumberChanges.bind(this, index)}
            value={items.compareObj}
            style={{ width: 120, marginLeft: 20 }}
          />
        ) : (
          // ) : (
          //   <Input
          //     onChange={this.InputChanges.bind(this, index)}
          //     value={items.compareObj}
          //     style={{ width: 120, marginLeft: 20 }}
          //   />
          // )
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={this.SelectChanges.bind(this, index)}
            value={items.compareObj}
          >
            {this.props.newFormList.map((item, index) => {
              return (
                <Option value={item.id} title={item.title} key={index}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        );
    }

    switch (DateOption[condition]) {
      case intl.get('ANAL.AND_AFTER'):
      case intl.get('ANAL.AND_BEFORE'):
      case intl.get('ANAL.BET'):
      case intl.get('ANAL.NET'):
      case intl.get('ANAL.BEFORE'):
      case intl.get('ANAL.AFTER'):
        let value = items.compareObj
          ? moment(items.compareObj)
          : items.compareObj;
        return items.varibleType === 'varibles' ? (
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={this.SelectChanges.bind(this, index)}
            value={items.compareObj}
          >
            {children}
          </Select>
        ) : items.varibleType === 'values' ? (
          <DatePicker
            onChange={this.dateChanges.bind(this, index, items)}
            format={format}
            value={value}
            showTime={showTime}
          />
        ) : (
          <Select
            style={{ width: 120, marginLeft: 20 }}
            onChange={this.SelectChanges.bind(this, index)}
            value={items.compareObj}
          >
            {this.props.newFormList.map((item, index) => {
              return (
                <Option value={item.id} title={item.title} key={index}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        );
      case intl.get('ANAL.RANGE'):
        let date1;
        let date2;
        const min = items.min;
        const max = items.max;
        // const { minNumber, maxNumber } = this.state;
        date1 = min ? moment(min) : min;
        date2 = max ? moment(max) : max;
        return (
          <RangePicker
            onChange={this.dateChanges.bind(this, index, items)}
            format={format}
            value={[date1, date2]}
            showTime={showTime}
          />
        );
      default:
        return null;
    }
  };

  onChangeSatisfyType = e => {
    this.setState({
      satisfy_type: e.target.value,
    });
  };

  addFilterList = () => {
    let { filterList } = this.state;
    filterList.push({ varibleType: 'values' });
    this.setState({ filterList });
  };

  deleteList = index => {
    let { filterList } = this.state;
    filterList.splice(index, 1);
    this.setState({ filterList });
  };

  render() {
    let { columnData = [] } = this.props;
    const { filterList, satisfy_type } = this.state;
    return (
      <Modal
        title={intl.get('SRC.DATA_CONDITIONS')}
        className="filterModal"
        visible={this.props.visible}
        width={700}
        onCancel={this.props.handleCancel}
        onOk={this.save}
        okText={intl.get('ANAL.CONFIRM')}
        cancelText={intl.get('ANAL.CANCEL')}
      >
        <p
          style={{
            fontSize: '12px',
            color: 'grey',
            position: 'absolute',
            top: '17px',
            left: '102px',
          }}
        >
          数据条件只能选择下拉，{intl.get('ASS.SINGLE_CHOICE')}
          ，多选，下拉多选组件
        </p>
        <label className="screen-label">
          {intl.get('ANAL.CONDITION_SETTING')}
        </label>
        <RadioGroup value={satisfy_type} onChange={this.onChangeSatisfyType}>
          <Radio value={0}>{intl.get('ANAL.SIMULTANEOUSLY_MEET')}</Radio>
          <Radio value={1}>{intl.get('ANAL.SINGLE_SATISFACTION')}</Radio>
        </RadioGroup>
        <div className="filterWrapper">
          {filterList.map((item, index) => {
            return (
              <div className="filterContent" key={index}>
                <Select
                  className="filter_column"
                  onChange={this.changeName.bind(this, index)}
                  value={item.column}
                >
                  {columnData
                    .filter(element => !element.tableName)
                    .map((ele, i) => {
                      return (
                        <Option
                          value={ele.col_name}
                          key={i}
                          title={ele.col_name}
                        >
                          {ele.col_name}
                        </Option>
                      );
                    })}
                </Select>
                <Select
                  className="options-select"
                  placeholder={intl.get('ANAL.PSAC')}
                  value={item.type}
                  style={{ width: 120, marginLeft: 20 }}
                  onChange={this.handleChangeOptions.bind(this, index)}
                >
                  {this.loadOptions(item)}
                </Select>
                {this.loadVariblesSelects(
                  item,
                  item.type,
                  item.varibleType,
                  index
                )}
                {this.loadInputs(
                  item,
                  item.type,
                  item,
                  index,
                  filterList.length
                )}
                <img
                  src={require(`@/data-form/form/data-form-design/images/delete2.png`)}
                  style={{ marginLeft: 8, cursor: 'pointer', float: 'right' }}
                  onClick={this.deleteList.bind(this, index)}
                />
              </div>
            );
          })}
          <Button className="addButton" onClick={this.addFilterList}>
            {intl.get('COMM.ADD_TO')}
          </Button>
        </div>
      </Modal>
    );
  }
}

export default FilterModal;
