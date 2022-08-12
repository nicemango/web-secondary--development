import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import { observer } from 'mobx-react';
import './batchModal.less';

const { TextArea } = Input;
@observer
class BatchModal extends Component {
  static propTypes = {
    editType: PropTypes.string,
    handleCancel: PropTypes.func,
    block: PropTypes.object,
    changeBlockNew: PropTypes.func,
  };

  state = {
    values: '',
  };

  componentDidMount() {
    const { columnStyle } = this.props.block;
    let values = '';
    JSON.parse(columnStyle.option_value).map((item, index) => {
      if (index === 0) {
        values =
          this.props.editType === 'value'
            ? item.value === undefined
              ? ''
              : item.value
            : item.label === undefined
            ? ''
            : item.label;
      } else {
        values =
          values +
          '\n' +
          (this.props.editType === 'value'
            ? item.value === undefined
              ? ''
              : item.value
            : item.label === undefined
            ? ''
            : item.label);
      }
    });
    this.setState({ values });
  }

  save = () => {
    const { values } = this.state;
    const { columnStyle } = this.props.block;
    let temArr = [];
    temArr = values.split('\n');
    let option_value = JSON.parse(columnStyle.option_value);
    option_value.length = temArr.length;
    if (this.props.editType === 'value') {
      temArr.map((item, index) => {
        option_value[index] = {
          value: item.slice(0, 64),
          label:
            option_value[index] && option_value[index].label !== ''
              ? option_value[index].label
              : '',
        };
      });
    } else {
      temArr.map((item, index) => {
        option_value[index] = {
          value:
            option_value[index] && option_value[index].value !== ''
              ? option_value[index].value
              : '',
          label: item.slice(0, 64),
        };
      });
    }
    this.props.changeBlockNew('option_value', JSON.stringify(option_value));
    this.props.handleCancel();
  };

  changeValue = e => {
    this.setState({ values: e.target.value });
  };

  render() {
    const { values } = this.state;
    return (
      <Modal
        title={intl.get('REPO.BATCH_EDITING')}
        className="batchModal"
        visible
        width={300}
        onCancel={this.props.handleCancel}
        onOk={this.save}
        okText={intl.get('REPO.CONFIRM')}
        cancelText={intl.get('REPO.CANCEL')}
      >
        <div className="tips">{intl.get('REPO.ELCTOO')}</div>
        <TextArea
          autosize={{ minRows: 6, maxRows: 10 }}
          onChange={this.changeValue}
          value={values}
          autoSize={{ minRows: 4 }}
        />
      </Modal>
    );
  }
}

export default BatchModal;
