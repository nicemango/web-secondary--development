/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2022-02-21 13:53:31
 * @LastEditTime: 2022-03-16 14:54:13
 * @FilePath: \onemind-web\src\components\Table2\EditTable\EditableCell.js
 * @Description: 请描述文件作用
 */
import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import { Input, Form, Popover } from "antd";
import PropTypes from "prop-types";
import EditableContext from "./EditableContext";
import RecordSetting from "./RecordSetting";
import "./index.less";
import { omit } from "lodash";

const EditableCell = ({
  isAllowEdit,
  children,
  dataIndex,
  record = {},
  handleSaveRecord,
  ...restProps
}) => {
  const { dataStyle = {} } = record;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    if (!dataIndex) return;
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSaveRecord({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  const styles = useMemo(() => {
    try {
      return JSON.parse(dataStyle[dataIndex]);
    } catch (e) {
      return {};
    }
  }, [dataStyle, dataIndex]);

  if (isAllowEdit && dataIndex) {
    childNode = (
      <Popover
        trigger="click"
        placement="bottom"
        content={
          <RecordSetting
            dataStyle={dataStyle[dataIndex]}
            onChange={(value) =>
              handleSaveRecord({
                ...record,
                dataStyle: {
                  ...dataStyle,
                  [dataIndex]: JSON.stringify(value),
                },
              })
            }
          />
        }
      >
        {editing ? (
          <Form.Item
            style={{
              margin: 0,
              position: "relative",
            }}
          >
            <Form.Item name={dataIndex} noStyle>
              <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
          </Form.Item>
        ) : (
          <div className="editable-cell-value-wrap" onClick={toggleEdit}>
            {children}
          </div>
        )}
      </Popover>
    );
  }

  return (
    <td {...omit(restProps, ["editable"])} title={""} style={{ ...styles }}>
      {childNode}
    </td>
  );
};
EditableCell.propTypes = {
  isAllowEdit: PropTypes.bool,
  children: PropTypes.any,
  dataIndex: PropTypes.string,
  record: PropTypes.object,
  handleSaveRecord: PropTypes.func,
};
export default EditableCell;
