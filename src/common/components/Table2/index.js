/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2021-02-18 15:54:32
 * @LastEditTime: 2022-03-24 14:48:30
 * @FilePath: \onemind-web\src\components\Table2\index.js
 * @Description: {intl.get('COMM.CUSTOMIZED')}table 样式组件
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table } from 'antd';
import useTableServices from './useTableServices';
import { EditableCell, EditableRow } from './EditTable';

import './index.less';

const Table2 = ({
  isReady,
  params: propsParams,
  url,
  callMethod,
  pagination,
  className: propsClassName,
  rowClassName: propsRowClassName,
  headerRowClassName: propsHeaderRowClassName,
  dataSource: propsDataSource,
  customParameters,
  scroll,
  columns,
  handleSaveRecord,
  isAllowEdit = false,
  ...tableProps
}) => {
  const { dataSource, params, setParams, loading, total } = useTableServices(
    url,
    callMethod,
    isReady
  );

  useEffect(() => {
    if (propsParams) {
      setParams(propsParams);
    }
  }, [propsParams, setParams]);

  const onChangePage = (pageNum, pageSize) => {
    if (typeof customParameters === 'function') {
      customParameters({ ...params, pageNum, pageSize });
      return;
    }
    setParams({ ...params, pageNum, pageSize });
  };

  const onShowSizeChange = (pageNum, pageSize) => {
    if (typeof customParameters === 'function') {
      customParameters({ ...params, pageNum, pageSize });
      return;
    }
    setParams({ ...params, pageNum, pageSize });
  };

  const showTotal = total => {
    return (
      <>
        共<span style={{ color: '#0C0D0E', margin: '0 4px' }}>{total}</span>条
      </>
    );
  };

  const editComponents = isAllowEdit
    ? {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }
    : {};
  const newColumns = isAllowEdit
    ? columns.map(col => {
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSaveRecord,
            isAllowEdit,
          }),
        };
      })
    : columns;

  return (
    <Table
      components={editComponents}
      columns={newColumns}
      dataSource={propsDataSource || dataSource}
      loading={loading}
      bordered
      className={classnames(propsClassName, 'table2')}
      rowClassName={(record, index) =>
        classnames(propsRowClassName, 'editable-row', 'table2Row', {
          evenRow: index % 2 !== 0,
        })
      }
      onHeaderRow={() => ({
        className: classnames(propsHeaderRowClassName, 'table2HeaderRow'),
      })}
      pagination={
        pagination
          ? {
              showSizeChanger: true,
              size: 'small',
              onShowSizeChange: onShowSizeChange,
              onChange: onChangePage,
              showTotal: showTotal,
              total: total,
              ...params,
              ...pagination,
            }
          : false
      }
      scroll={{
        scrollToFirstRowOnChange: true,
        x: 'max-content',
        ...scroll,
      }}
      {...tableProps}
    />
  );
};

Table2.propTypes = {
  url: PropTypes.string,
  callMethod: PropTypes.string,
  params: PropTypes.object,
  pagination: PropTypes.any,
  isReady: PropTypes.bool,
  className: PropTypes.string,
  rowClassName: PropTypes.string,
  headerRowClassName: PropTypes.any,
  dataSource: PropTypes.array,
  customParameters: PropTypes.func,
  scroll: PropTypes.any,
  isAllowEdit: PropTypes.bool,
  columns: PropTypes.array,
  handleSaveRecord: PropTypes.func,
};

export default Table2;
