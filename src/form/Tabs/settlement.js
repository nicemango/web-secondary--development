/* eslint-disable react-hooks/exhaustive-deps */
// 结算
import React, { useEffect } from "react";
import {
  Form,
  InputNumber,
  Col,
  Row,
  Divider,
  Input,
  Radio,
  DatePicker,
} from "antd";
import eventbus from "../api/eventBus";
import { getDataWithSort } from "../api/asset";

const Settlement = (props) => {
  const { form } = props;

  useEffect(() => {
    computedJYCompensation();
    getYfkMoney();
    eventbus.on("formChange", computedJYCompensation);
  }, []);

  const computedJYCompensation = () => {
    const {
      certified = 0,
      noCertified = 0,
      legitimate = 0,
      reformHouse = 0,
      selfBuilt = 0,
      total_amount = 0,
      hb_relocation_total = 0,
      zzhb_relocation_total = 0,
      zzcq_relocation_total = 0,
      hb_resettlement_total = 0,
      zzhb_resettlement_total = 0,
      zzcq_resettlement_total = 0,
      special_signing_bonus = 0,
      special_moving_reward = 0,
      jy_compensation = 0,
      yj_compensation = 0,
      if_deduction,
      rmb_lowercase = 0,
    } = form.getFieldsValue();

    const hb_resettlement_total2 =
      form.getFieldsValue()["2hb_resettlement_total"] || 0;
    const zzhb_resettlement_total2 =
      form.getFieldsValue()["2zzhb_resettlement_total"] || 0;
    const zzcq_resettlement_total2 =
      form.getFieldsValue()["2zzcq_resettlement_total"] || 0;

    const total =
      certified +
      noCertified +
      legitimate +
      reformHouse +
      selfBuilt +
      total_amount +
      hb_relocation_total +
      zzhb_relocation_total +
      zzcq_relocation_total +
      hb_resettlement_total +
      zzhb_resettlement_total +
      zzcq_resettlement_total +
      hb_resettlement_total2 +
      zzhb_resettlement_total2 +
      zzcq_resettlement_total2 +
      special_signing_bonus +
      special_moving_reward;
    if (total !== jy_compensation) {
      form.setFieldsValue({ jy_compensation: total });
    }
    let rmbLowercase = 0;
    if (if_deduction === "1") {
      rmbLowercase = jy_compensation - yj_compensation;
    } else if (if_deduction === "2") {
      rmbLowercase = jy_compensation;
    }
    if (rmbLowercase !== rmb_lowercase) {
      form.setFieldsValue({
        rmb_lowercase: rmbLowercase || 0,
        rmb_capital: atoc(rmbLowercase),
      });
    }
  };

  const changeDeduction = (e) => {
    const val = e?.target?.value || "1";
    const { jy_compensation = 0, yj_compensation = 0 } = form.getFieldsValue();
    let rmb_lowercase = 0;
    if (val === "1") {
      rmb_lowercase = jy_compensation - yj_compensation;
    } else {
      rmb_lowercase = jy_compensation;
    }
    form.setFieldsValue({ rmb_lowercase, rmb_capital: atoc(rmb_lowercase) });
  };

  const atoc = (numberValue) => {
    numberValue = Math.round(numberValue * 100).toString(); //   数字金额
    let chineseValue = ""; //   转换后的汉字金额
    let String1 = "零壹贰叁肆伍陆柒捌玖"; //   汉字数字
    let String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; //   对应单位
    let len = numberValue.length; //   numberValue   的字符串长度
    let Ch1; //   数字的汉语读法
    let Ch2; //   数字位的汉字读法
    let nZero = 0; //   用来计算连续的零值的个数
    let String3; //   指定位置的数值
    if (len > 15) {
      console.log("超出计算范围");
      return "";
    }
    if (numberValue === 0) {
      chineseValue = "零元整";
      return chineseValue;
    }

    String2 = String2.substr(String2.length - len, len); //   取出对应位数的STRING2的值
    for (let i = 0; i < len; i++) {
      String3 = parseInt(numberValue.substr(i, 1), 10); //   取出需转换的某一位的值
      if (i !== len - 3 && i !== len - 7 && i !== len - 11 && i !== len - 15) {
        if (String3 === 0) {
          Ch1 = "";
          Ch2 = "";
          nZero = nZero + 1;
        } else if (String3 !== 0 && nZero !== 0) {
          Ch1 = "零" + String1.substr(String3, 1);
          Ch2 = String2.substr(i, 1);
          nZero = 0;
        } else {
          Ch1 = String1.substr(String3, 1);
          Ch2 = String2.substr(i, 1);
          nZero = 0;
        }
      } else {
        //   该位是万亿，亿，万，元位等关键位
        if (String3 !== 0 && nZero !== 0) {
          Ch1 = "零" + String1.substr(String3, 1);
          Ch2 = String2.substr(i, 1);
          nZero = 0;
        } else if (String3 !== 0 && nZero === 0) {
          Ch1 = String1.substr(String3, 1);
          Ch2 = String2.substr(i, 1);
          nZero = 0;
        } else if (String3 === 0 && nZero >= 3) {
          Ch1 = "";
          Ch2 = "";
          nZero = nZero + 1;
        } else {
          Ch1 = "";
          Ch2 = String2.substr(i, 1);
          nZero = nZero + 1;
        }
        if (i === len - 11 || i === len - 3) {
          //   如果该位是亿位或元位，则必须写上
          Ch2 = String2.substr(i, 1);
        }
      }
      chineseValue = chineseValue + Ch1 + Ch2;
    }
    if (String3 === 0) {
      //   最后一位（分）为0时，加上“整”
      chineseValue = chineseValue + "整";
    }

    return chineseValue;
  };

  const getYfkMoney = async () => {
    const { richman_name, richman_idcard } = form.getFieldsValue();
    const assetId = "5ef63f82-c740-ff24-fae8-473f9bfcbe01";
    const queryParams = {
      filters: [
        {
          column: "richman_name",
          datatype: 0,
          type: 4,
          varibleType: "components",
          compareObj: richman_name,
          satisfy_type: 0,
        },
        {
          column: "richman_idcard",
          datatype: 0,
          type: 4,
          varibleType: "components",
          compareObj: richman_idcard,
          satisfy_type: 0,
        },
      ],
      columnNames: ["richman_money_ex"],
      sorts: [],
    };
    try {
      const { data } = await getDataWithSort(assetId, queryParams);
      form.setFieldsValue({ yfk_money: data?.[1]?.[0] || 0 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="甲补乙金额"
            name="jy_compensation"
            labelCol={{ span: 8 }}
          >
            <InputNumber
              readOnly
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="乙补甲金额"
            name="yj_compensation"
            labelCol={{ span: 8 }}
          >
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="是否抵扣"
            name="if_deduction"
            labelCol={{ span: 8 }}
            rules={[{ required: true, message: "请选择是否抵扣" }]}
          >
            <Radio.Group onChange={changeDeduction}>
              <Radio value="1">是</Radio>
              <Radio value="2">否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="签约日期" name="sign_date" labelCol={{ span: 8 }}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="抵扣后金额小写"
            name="rmb_lowercase"
            labelCol={{ span: 8 }}
          >
            <InputNumber
              readOnly
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="抵扣后金额大写"
            name="rmb_capital"
            labelCol={{ span: 8 }}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="甲方" name="partya" labelCol={{ span: 8 }}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="乙方" name="partyb" labelCol={{ span: 8 }}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="预付款金额" name="yfk_money" labelCol={{ span: 8 }}>
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default Settlement;
