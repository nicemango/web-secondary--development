import React, { useEffect } from "react";
import { Form } from "antd";

import Option from "./option/render";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      if (configuration) {
        form.setFieldsValue(JSON.parse(configuration));
      }
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(JSON.stringify(allValues));
  };

  return (
    <>
      <Option
        configuration={JSON.parse(configuration)}
        onValueChange={(state) => {
          const {
            option_asset_id,
            option_asset_name,
            option_value_column,
            option_key_column,
            option_asset_show_columns,
          } = state;
          onFormLayoutChange(null, {
            option_asset_id,
            option_asset_name,
            option_value_column,
            option_key_column,
            option_asset_show_columns,
          });
        }}
      />
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
