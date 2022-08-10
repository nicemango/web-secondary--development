import React, { useEffect, useState } from "react";
import { Form, InputNumber } from "antd";

import "./index.less";

const INT_MAX = 144947616; // java int{intl.get('REPO.TLDS')}
const INT_MIN = -144947616;

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      if (configuration) {
        form.setFieldsValue(JSON.parse(configuration));
        setAllValue(JSON.parse(configuration));
      }
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const [allValue, setAllValue] = useState({});

  const onFormLayoutChange = (changedValues, allValues) => {
    setAllValue({ ...allValues });
    changeConfiguration(JSON.stringify(allValues));
  };

  const onValueChange = (key, value) => {
    allValue[key] = value;
    setAllValue({ ...allValue });
    changeConfiguration(JSON.stringify(allValue));
  };

  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const { num_max_value, num_min_value } = allValue;
  const max_value = num_max_value > INT_MAX ? INT_MAX : num_max_value;
  const min_value = num_min_value < INT_MIN ? INT_MIN : num_min_value;

  return (
    <>
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <div className="sider_style_wrapper">
          <div className="sider_style_wrapper_title comp_prop_line title">
            {"取值范围"}
          </div>
          <div className="numberSizeContainer">
            <Form.Item name="num_min_value">
              <div className="input_number_group">
                <span className="label_title">{"最小值"}</span>
                <InputNumber
                  onChange={(e) => onValueChange("num_min_value", e)}
                  className="input_number"
                  value={min_value}
                  max={max_value}
                />
              </div>
            </Form.Item>

            <Form.Item name="num_max_value">
              <div className="input_number_group">
                <span className="label_title">{"最大值"}</span>
                <InputNumber
                  onChange={(e) => onValueChange("num_max_value", e)}
                  className="input_number"
                  value={max_value}
                  min={min_value}
                />
              </div>
            </Form.Item>
          </div>
        </div>

        <Form.Item label="小数位数" name="precision">
          <InputNumber
            style={{ width: 280, borderRadius: "4px" }}
            min={0}
            precision={0}
            defaultValue={0}
          />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
