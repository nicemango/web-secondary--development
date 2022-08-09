import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";

const Add = ({
  data,
  onChange,
  formConfig,
  component,
  configuration: propsConfiguration,
  eventCenter,
  componentCenter,
}) => {
  const state2 = useRef(data);
  const [state, setState] = useState(data);
  const [configuration, setConfiguration] = useState({});

  useEffect(() => {
    try {
      setConfiguration(JSON.parse(propsConfiguration));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  console.log("zzh Add data", data);
  console.log("zzh Add propsConfiguration", propsConfiguration);

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

  const rules = [
    {
      validator: (_, value) => {
        if (value === "" || value === undefined) {
          return Promise.resolve();
        } else {
          if (!/(^\-?[0-9]*$)|(^\-?[0-9]+\.[0-9]+$)/.test(value)) {
            return Promise.reject(new Error("请输入数字"));
          } else {
            if (Number(value) >= Number(min) && Number(value) <= Number(max)) {
              const regExp =
                precision === 0
                  ? /^\-?[0-9]+$/
                  : new RegExp(`^\-?[0-9]+\.?[0-9]{0,${precision}}$`);
              if (regExp.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject(`小数位数不能超过${precision}位`);
              }
            } else {
              return Promise.reject(`请输入${min}~${max}范围之内的数字`);
            }
          }
        }
      },
    },
  ];

  return (
    <Form>
      <Form.Item
        name={component.id || "customInputNumber"}
        rules={rules}
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
