import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import { getThemeStyle } from "../themeColor";

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
  const state2 = useRef(data);
  const [state, setState] = useState(data);
  const [configuration, setConfiguration] = useState({});

  useEffect(() => {
    try {
      if (propsConfiguration) {
        setConfiguration(JSON.parse(propsConfiguration));
      }
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

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
    child_id,
    index,
    { eventCenter, componentCenter }
  );

  return <></>;
};

Child.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Child;
