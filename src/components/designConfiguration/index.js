import React, { useEffect } from "react";
import { Form, InputNumber, Input } from "antd";

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
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="宽度：" name="width" initialValue={520}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="视频对应字段：" name="videoKey"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="视频主键字段：" name="videoIdKey"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="资产ID：" name="assetId"
          rules={[
            {
              required: true,
              message: '',
            },
          ]}>
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
