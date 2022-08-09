import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, InputNumber } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import useFormItemLayout from "../../common/hooks/useFormItemLayout";
import "../../common/style/formItem.less";
import { getTips } from "../../common/utils/tips";
import { getWidth } from "../../common/utils/width";
import { getTitle } from "../../common/utils/title";

const Set = (props) => {
  const [customPluginConfig, setcustomPluginConfig] = useState({});
  const Event_Center_getName = () => {
    return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
  };

  useEffect(() => {
    try {
      const customPluginConfig = JSON.parse(
        props.component.columnStyle.customPluginConfig
      );
      setcustomPluginConfig(customPluginConfig);
    } catch (e) {
      console.error(e);
    }
  }, [props.component.columnStyle.customPluginConfig]);

  const {
    tips: placeholder,
    title,
    width,
    tips_content: tips,
    suffix,
    precision: numerical_precision,
    labelAlignMode,
    disabled,
    readOnly,
    required,
    step,
    num_max_value: numMaxValue,
    num_min_value: numMinValue,
  } = customPluginConfig;

  console.log("zzh customPluginConfig", customPluginConfig);

  useDelegator(
    props.component.id,
    { Event_Center_getName },
    eventActionDefine,
    props.formConfig?.id,
    props.child_id,
    props.index,
    { eventCenter: props.eventCenter, componentCenter: props.componentCenter }
  );

  const formItemLayout = useFormItemLayout(labelAlignMode);

  // props
  // const { id } = props.component;

  // let titleObj = { label: title };
  // const formItemLayout = useFormItemLayout(labelAlignMode);

  // // 属性
  // const min =
  //   numMinValue !== undefined && numMinValue !== null
  //     ? numMinValue
  //     : Number.MIN_SAFE_INTEGER;
  // const max =
  //   numMaxValue !== undefined && numMaxValue !== null
  //     ? numMaxValue
  //     : Number.MAX_SAFE_INTEGER;

  // return (
  //   <Form.Item
  //     label={getTitle(titleObj)}
  //     colon={false}
  //     htmlFor={id}
  //     className={"formItem"}
  //     required={required}
  //     {...formItemLayout}
  //   >
  //     <div
  //       className={"space"}
  //       style={{ width: getWidth(width), maxWidth: "100%" }}
  //     >
  //       <div className={"number-content"}>
  //         <Form.Item noStyle name={id}>
  //           <InputNumber
  //             className={suffix ? "suffix-number-input" : "number-input"}
  //             min={min}
  //             max={max}
  //             step={step}
  //             precision={numerical_precision}
  //             disabled={disabled}
  //             readOnly={readOnly}
  //             placeholder={placeholder?.label}
  //           />
  //         </Form.Item>
  //         {suffix && <div className={"ant-input-group-addon"}>{suffix}</div>}
  //       </div>
  //       {getTips(tips)}
  //     </div>
  //   </Form.Item>
  // );
};

Set.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Set;
