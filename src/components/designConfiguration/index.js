import React, { useEffect } from "react";
import { Form, Input } from "antd";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
  };

  return (
    <></>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
