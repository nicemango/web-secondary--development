import intl from 'react-intl-universal';
/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2021-04-26 15:08:15
 * @LastEditTime: 2021-05-24 17:47:52
 * @FilePath: \onemind-web\src\data-reporting-new\components\style\option\FormLinkOption.js
 * @Description: {intl.get('REPO.FCAO')}
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Col, Select, Row, Button, Input } from 'antd';
import { queryMasterBundleColumnByViewId } from 'common/service/reportManger';
import ReportModal from 'components/addModal/dataReportModal';
import { ErrorMessage } from 'common/errorMessage';
import { Icon } from 'sdata-ui';

const FormLinkOption = ({
  data = {},
  reload,
  optionValue,
  deletedrelationOption,
}) => {
  const [viewListVis, setViewListVis] = useState(false);
  const [relationViewColumns, setRelationViewColumns] = useState([]);

  const selectRelationView = relationView => {
    try {
      fetchViewColumns(relationView.object_id);
      data.view_name = relationView.mapping_name;
      data.correlation_view_id = relationView.object_id;
      data.correlation_field = '';
      reload();
    } catch (err) {
      console.log(err);
    }
  };

  const selectcorrelationField = id => {
    data.correlation_field = id;
    reload();
  };

  const fetchViewColumns = useCallback(async id => {
    if (!id) return;
    try {
      const { data: columns } = await queryMasterBundleColumnByViewId(id);
      const keys = [];
      const tempList = [];
      columns.forEach(item => {
        if (!keys.includes(item['form_column_id']) && item.col_datatype !== 8) {
          tempList.push({
            col_name: item.component_title,
            id: item['form_column_id'],
          });
          keys.push(item['form_column_id']);
        }
      });
      setRelationViewColumns(tempList);
    } catch (e) {
      ErrorMessage({ messages: intl.get('REPO.FTGD') });
    }
  }, []);

  useEffect(() => {
    fetchViewColumns(data.correlation_view_id);
  }, [data, fetchViewColumns]);

  const relationOption = useMemo(() => {
    return relationViewColumns.map((item, index) => (
      <Select.Option key={index} value={item.id}>
        {item.col_name}
      </Select.Option>
    ));
  }, [relationViewColumns]);

  return (
    <Row key={data.id}>
      <Col span={6}>
        <Button
          onClick={() => setViewListVis(!viewListVis)}
          className="form_link_button"
          style={{ marginBottom: 10 }}
        >
          {intl.get('REPO.VIEW_SELECTION')}
        </Button>
      </Col>
      <Col span={8}>
        <Input disabled style={{ width: 142 }} value={data.view_name} />
      </Col>
      <Col span={9}>
        <Select
          style={{ width: '95%' }}
          onSelect={selectcorrelationField}
          value={data.correlation_field}
          placeholder={intl.get('REPO.PSAFK')}
          showSearch={relationViewColumns.length > 8}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {relationOption}
        </Select>
      </Col>
      <Col span={1}>
        <Icon
          type="icon-tingzhi1"
          style={{ fontSize: 20, position: 'absolute', top: 5 }}
          onClick={() => deletedrelationOption(optionValue, data.id)}
        />
      </Col>
      {viewListVis && (
        <ReportModal
          hiddenModal={() => setViewListVis(!viewListVis)}
          type="data"
          visible={viewListVis}
          addBlock={selectRelationView}
        />
      )}
    </Row>
  );
};

FormLinkOption.propTypes = {
  data: PropTypes.object,
  reload: PropTypes.func,
  optionValue: PropTypes.string,
  deletedrelationOption: PropTypes.func,
};

export default FormLinkOption;
