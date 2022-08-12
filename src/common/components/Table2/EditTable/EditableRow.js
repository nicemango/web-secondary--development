/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2022-02-21 13:56:14
 * @LastEditTime: 2022-02-21 16:50:23
 * @FilePath: \onemind-web\src\components\Table2\EditTable\EditableRow.js
 * @Description: 请描述文件作用
 */
import React from 'react';
import { Form } from 'antd';
import EditableContext from './EditableContext';

const EditableRow = props => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

EditableRow.propTypes = {};

export default EditableRow;
