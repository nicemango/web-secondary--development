import intl from 'react-intl-universal';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, Pagination } from 'antd';
import { observer } from 'mobx-react';
import './dictModal.less';

const Search = Input.Search;

@observer
class DictModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    chooseDict: PropTypes.func,
    changeDic: PropTypes.func,
    block: PropTypes.object,
    dataSource: PropTypes.array,
  };

  state = {
    pageSize: 5,
    pageNum: 1,
    dectId: this.props.block.columnStyle.option_dict,
    searchSource: this.props.dataSource,
    option_dict_name: this.props.block.columnStyle.option_dict_name,
    searchValue: undefined,
  };

  chooseDict = item => {
    this.setState({ dectId: item.id, option_dict_name: item.name });
  };

  save = () => {
    const { dectId, option_dict_name } = this.state;
    this.props.changeDic(dectId, option_dict_name);
  };

  changePage = e => {
    this.setState({ pageNum: e });
  };

  search = value => {
    let { dataSource = [] } = this.props;
    let searchSource = [];
    var re = new RegExp('' + value + '');
    dataSource.map((item, index) => {
      if (re.test(item.name)) {
        searchSource.push(item);
      }
    });
    this.setState({ searchSource, searchValue: value });
  };

  render() {
    const { dataSource = [] } = this.props;
    let { pageNum, pageSize, dectId, searchSource, searchValue } = this.state;
    if (searchValue === undefined) {
      searchSource = dataSource;
    }
    let showSource = searchSource.slice(
      (pageNum - 1) * pageSize,
      pageNum * pageSize
    );
    return (
      <Modal
        title=""
        className="dictModal"
        visible={this.props.visible}
        width={300}
        onCancel={this.props.chooseDict}
        onOk={this.save}
        okText={intl.get('REPO.CONFIRM')}
        cancelText={intl.get('REPO.CANCEL')}
      >
        <Search onSearch={value => this.search(value)} />
        {showSource &&
          showSource.map((item, index) => {
            return (
              <div
                onClick={this.chooseDict.bind(this, item)}
                className={`dictWrapper ${
                  item.id === dectId ? ' checkDect' : ''
                }`}
                key={index}
              >
                <span>
                  {item.name === '' ||
                  item.name === undefined ||
                  item.name === null
                    ? item.name
                    : typeof item.name === 'number' && item.name !== 'NaN'
                    ? intl.get(String(item.name)).d(item.name)
                    : intl.get(item.name).d(item.name)}
                </span>
                {item.id === dectId && (
                  <img
                    src={require('@/data-form/form/data-form-design/images/dectCheck.png')}
                  />
                )}
              </div>
            );
          })}
        <Pagination
          simple
          defaultCurrent={1}
          total={searchSource.length}
          pageSize={pageSize}
          onChange={this.changePage}
        />
      </Modal>
    );
  }
}

export default DictModal;
