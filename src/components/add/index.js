import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import Validate from "../../common/utils/validate";
const Add = ({
  data,
  onChange,
  formConfig,
  component,
  configuration: propsConfiguration,
  eventCenter,
  componentCenter,
}) => {
  console.log("组件配置项", formConfig);
  const [form] = Form.useForm();
  const state2 = useRef(data);
  const [state, setState] = useState(data);
  const [configuration, setConfiguration] = useState({});

  const initData = () => {
    if (data) {
      form.setFieldsValue({ customInputNumber: data });
    }
  };

  useEffect(() => {
    try {
      initData();
      if (propsConfiguration) {
        setConfiguration(JSON.parse(propsConfiguration));
      }
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const triggerEventCenter = async (targetEvent, targetValue) => {
    await eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: targetEvent,
      payload: {
        value: targetValue,
      },
    });
  };

  const do_EventCenter_getValue = function () {
    console.log(state2.current);
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
    null,
    -1,
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
  const { num_max_value, num_min_value, precision } = configuration;

  const min =
    num_min_value !== undefined && num_min_value !== null
      ? num_min_value
      : Number.MIN_SAFE_INTEGER;
  const max =
    num_max_value !== undefined && num_max_value !== null
      ? num_max_value
      : Number.MAX_SAFE_INTEGER;

  return (
    <Form form={form} className={"number-input"}>
      <Form.Item
        name={"customInputNumber"}
        rules={Validate.rules(precision, min, max)}
        validateTrigger={["onChange", "onBlur"]}
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

Add.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Add;
