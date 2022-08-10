import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input, Form } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import Validate from "../../common/utils/validate";

const Child = ({
  data,
  onChange,
  formConfig,
  component,
  configuration: propsConfiguration,
  theme,
  child_id,
  index,
  eventCenter,
  componentCenter,
}) => {
  const [form] = Form.useForm();
  const state2 = useRef(data);
  const [state, setState] = useState(data);
  const [customPluginConfig, setcustomPluginConfig] = useState({});

  const { columnStyle = {} } = component;
  useEffect(() => {
    try {
      if (columnStyle?.customPluginConfig) {
        const customPluginConfig = JSON.parse(columnStyle?.customPluginConfig);
        setcustomPluginConfig(customPluginConfig);
      }
    } catch (e) {
      console.error(e);
    }
  }, [columnStyle?.customPluginConfig]);

  const triggerEventCenter = async (targetValue) => {
    await window.eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: "change",
      payload: {
        value: targetValue,
        childIndex: index,
      },
    });
  };

  const do_EventCenter_getValue = function () {
    return {
      value: state2.current,
    };
  };

  const do_EventCenter_setValue = function ({ value }) {
    setState(value);
    form.setFieldsValue({ customInputNumber: value });
    // state2.current = value;
  };

  const Event_Center_getName = () => {
    return `${formConfig?.form_name}-${component.columnStyle.title}`;
  };

  // 事件中心注册挂载
  useDelegator(
    component.id,
    { Event_Center_getName, do_EventCenter_getValue, do_EventCenter_setValue },
    eventActionDefine,
    formConfig?.id,
    child_id,
    index,
    { eventCenter, componentCenter }
  );

  //逻辑控制
  const handleChange = (e) => {
    let value = e.target.value;
    onChange(value);
    triggerEventCenter("change", value);
    state2.current = value;
    setState(value);
  };

  // props
  const { num_max_value, num_min_value, precision } = customPluginConfig;

  const min =
    num_min_value !== undefined && num_min_value !== null
      ? num_min_value
      : Number.MIN_SAFE_INTEGER;
  const max =
    num_max_value !== undefined && num_max_value !== null
      ? num_max_value
      : Number.MAX_SAFE_INTEGER;

  return (
    <Form form={form}>
      <Form.Item
        name={"customInputNumber"}
        rules={Validate.rules(precision, min, max)}
        validateTrigger={["onChange", "onBlur"]}
        initialValue={state}
      >
        <Input
          className={"number-input"}
          onChange={handleChange}
          onBlur={() => triggerEventCenter("blur")}
        />
      </Form.Item>
    </Form>
  );
};

Child.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Child;
