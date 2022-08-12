import intl from 'react-intl-universal';
/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2021-04-25 15:35:33
 * @LastEditTime: 2021-05-25 10:01:41
 * @FilePath: \onemind-web\src\data-reporting-new\components\style\option\FormLink.js
 * @Description: {intl.get('EXAM.PDTROTF')}
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, Select, Button } from 'antd';
import uuid from 'uuid/v4';
import useBlockDataSource from '@/data-form/list/hooks/useBlockDataSource';
import { flatList } from '@/data-form/form/common/utils/data';
import FormLinkOption from './FormLinkOption';
import { observer } from 'mobx-react-lite';
import './formLink.less';

const FormLink = ({
  store,
  block,
  setVis,
  changeBlock,
  changeBlockInfo,
  ...otherProps
}) => {
  const [currentBlock, setCurrentBlock] = useState({});
  const [isSearch, setIsSearch] = useState(false);
  const [optionLinkData, setOptionLinkData] = useState({});
  const [dataSource = []] = useBlockDataSource(currentBlock, false, isSearch);
  const [
    form_placeholder_component_id,
    setForm_placeholder_component_id,
  ] = useState(undefined);
  useEffect(() => {
    if (otherProps.visible) {
      const tempBlock = JSON.stringify(block);
      setCurrentBlock(JSON.parse(tempBlock));
      setForm_placeholder_component_id(
        block?.columnStyle?.form_placeholder_component_id
      );
      setIsSearch(true);
    } else {
      setCurrentBlock({});
      setOptionLinkData({});
      setForm_placeholder_component_id(undefined);
    }
  }, [otherProps.visible]);

  useEffect(() => {
    const { formCorrelationList = [] } = currentBlock;
    if (!Array.isArray(formCorrelationList) || !formCorrelationList.length) {
      return;
    }
    formCorrelationList.forEach(item => {
      if (optionLinkData[item.condition_value]) {
        optionLinkData[item.condition_value].push(item);
      } else {
        optionLinkData[item.condition_value] = [];
        optionLinkData[item.condition_value].push(item);
      }
    });
    setOptionLinkData({ ...optionLinkData });
  }, [currentBlock]);

  const save = () => {
    setVis(false);
    const tempArr = form_placeholder_component_id
      ? Object.values(optionLinkData).flat(Infinity)
      : [];
    const hasFields = tempArr.filter(item => item.correlation_field);
    changeBlockInfo('formCorrelationList', hasFields);
    changeBlock('form_placeholder_component_id', form_placeholder_component_id);
    currentBlock.formCorrelationList = [];
    setIsSearch(false);
    setOptionLinkData({});
  };

  const deletedrelationOption = (value, id) => {
    const index = optionLinkData[value].findIndex(item => item.id === id);
    optionLinkData[value].splice(index, 1);
    setOptionLinkData({ ...optionLinkData });
  };

  const addOptionLinkData = useCallback(
    value => {
      const temp = {
        id: uuid(),
        master_column_id: block.id,
        condition_value: value,
      };
      if (optionLinkData[value]) {
        optionLinkData[value].push(temp);
      } else {
        optionLinkData[value] = [];
        optionLinkData[value].push(temp);
      }
      setOptionLinkData({ ...optionLinkData });
    },
    [optionLinkData]
  );

  const reloadOptionLinkData = () => {
    setOptionLinkData({ ...optionLinkData });
  };

  const optionAssociatedForm = useMemo(
    () =>
      dataSource.map((optionData, index) => (
        <Row key={optionData.id} className="option_item">
          <Col className="option_item_label" span={4}>
            {block.columnStyle.show_flag === '1'
              ? optionData.label
              : optionData.value}
          </Col>
          <Col className="option_item_content" span={20}>
            <Row>
              <Col span={24}>
                {Array.isArray(optionLinkData[optionData.value])
                  ? optionLinkData[optionData.value].map(linkData => (
                      <FormLinkOption
                        key={linkData.id}
                        data={linkData}
                        reload={reloadOptionLinkData}
                        optionValue={optionData.value}
                        deletedrelationOption={deletedrelationOption}
                      />
                    ))
                  : ''}
              </Col>
              <Col span={24}>
                <Button
                  onClick={() => addOptionLinkData(optionData.value)}
                  type="dashed"
                  className="form_link_button"
                >
                  + {intl.get('COMM.ADD')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )),
    [dataSource, optionLinkData, addOptionLinkData]
  );
  const allComponents = flatList(store?.setInfo?.formColumnList) || [];
  const formPlaceholder = allComponents.filter(
    item => item.showType === 'form_placeholder'
  );
  const formPlaceholderOptions = useMemo(
    () =>
      formPlaceholder.map(item => (
        <Select.Option value={item.id} key={item.id}>
          {item.columnStyle.title}
        </Select.Option>
      )),
    [JSON.stringify(formPlaceholder)]
  );
  const onSelectFormPlaceholder = value => {
    setForm_placeholder_component_id(value);
  };
  const onClearFormPlaceholder = () => {
    setForm_placeholder_component_id('');
  };
  return (
    <Modal
      title={intl.get('REPO.FAC')}
      className="form_link_modal"
      footer={null}
      width={660}
      closable={false}
      destroyOnClose
      {...otherProps}
    >
      <div className="form_link">
        <Row>
          <div style={{ marginRight: 16 }}>{intl.get('REPO.FPC')}</div>
          <Select
            placeholder={intl.get('REPO.PSAPCF')}
            onSelect={onSelectFormPlaceholder}
            onClear={onClearFormPlaceholder}
            style={{ width: 490 }}
            allowClear
            showSearch={formPlaceholder.length > 8}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            value={form_placeholder_component_id}
          >
            {formPlaceholderOptions}
          </Select>
        </Row>
        {form_placeholder_component_id ? (
          <div className="content">{optionAssociatedForm}</div>
        ) : (
          ''
        )}
        <span className="note">
          {intl
            .get('COMM.NCAFVOSBC')
            .d('注：关联的表单视图目前仅支持含有基础组件')}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 32,
        }}
      >
        <Button
          type="primary"
          onClick={() => save()}
          style={{ margin: '0 10px 0 0 ' }}
        >
          {intl.get('ANAL.CONFIRM')}
        </Button>
        <Button onClick={() => setVis(false)}>{intl.get('REPO.CANCEL')}</Button>
      </div>
    </Modal>
  );
};
FormLink.propTypes = {
  block: PropTypes.object,
  store: PropTypes.object,
  setVis: PropTypes.func,
  changeBlock: PropTypes.func,
  changeBlockInfo: PropTypes.func,
};
export default observer(FormLink);
