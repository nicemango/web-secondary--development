// 搬迁、安置、补助
import React, { useEffect, useMemo, useState } from "react";

import eventbus from "../api/eventBus";
import { Card, Col, Divider, Form, InputNumber, Row, DatePicker } from "antd";
import { getDataWithSort } from "../api/asset";
import { translatePlatformDataToJsonArray } from "./renovation";

const { RangePicker } = DatePicker;

const Subsidy = (props) => {
  const { form } = props;

  // 获取合计数据
  const setTotalItem = () => {
    const {
      F1: hb_relocation_total,
      F4: hb_resettlement_total,
      F7,
      num2: zzhb_relocation_total,
      num3: zzcq_relocation_total,
      num5: zzhb_resettlement_total,
      num6: zzcq_resettlement_total,
      num8,
      num9,
    } = form.getFieldsValue();

    form.setFieldsValue({
      hb_relocation_total,
      hb_resettlement_total,
      "2hb_resettlement_total": F7,
      zzhb_relocation_total,
      zzcq_relocation_total,
      zzhb_resettlement_total,
      zzcq_resettlement_total,
      "2zzhb_resettlement_total": num8,
      "2zzcq_resettlement_total": num9,
    });
  };

  // 获取其他费用数据
  const setOtherAmount = async () => {
    let queryForm = {
      filters: [
        {
          column: "project_name",
          datatype: 0,
          type: 4,
          varibleType: "components",
          compareObj: form.getFieldsValue().project_name,
          satisfy_type: 0,
        },
      ],
      columnNames: [
        "non_residential_hb",
        "non_residential_hb_times",
        "residential_hb",
        "residential_hb_times",
        "residential_cq",
        "residential_cq_times",
        "non_azresidential_hb",
        "non_azresidential_hb_times",
        "azresidential_hb",
        "azresidential_hb_times",
        "azresidential_cq",
        "azresidential_cq_times",
        "non_2azresidential_hb",
        "non_2azresidential_hb_times",
        "2azresidential_hb",
        "2azresidential_hb_times",
        "2azresidential_cq",
        "2azresidential_cq_times",
      ],
      sorts: [],
    };

    const res = await getDataWithSort(
      "ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988",
      queryForm
    );
    const data = translatePlatformDataToJsonArray(res)?.[0] || {};
    const {
      azresidential_cq: zzcq_resettlement,
      azresidential_cq_times: zzcq_resettlement_mon,
      azresidential_hb: zzhb_resettlement,
      azresidential_hb_times: zzhb_resettlement_mon,
      non_2azresidential_hb,
      non_2azresidential_hb_times,
      non_azresidential_hb: hb_resettlement,
      non_azresidential_hb_times: hb_resettlement_mon,
      non_residential_hb: hb_relocation,
      non_residential_hb_times: hb_relocation_cs,
      residential_cq: zzcq_relocation,
      residential_cq_times: zzcq_relocation_cs,
      residential_hb: zzhb_relocation,
      residential_hb_times: zzhb_relocation_cs,
    } = data;

    const formData = {
      zzcq_resettlement,
      zzcq_resettlement_mon,
      zzhb_resettlement,
      zzhb_resettlement_mon,
      hb_resettlement,
      hb_resettlement_mon,
      hb_relocation,
      hb_relocation_cs,
      zzcq_relocation,
      zzcq_relocation_cs,
      zzhb_relocation,
      zzhb_relocation_cs,
    };
    formData["2hb_resettlement"] = non_2azresidential_hb;
    formData["2hb_resettlement_mon"] = non_2azresidential_hb_times;
    formData["2zzhb_resettlement"] = data?.["2azresidential_hb"];
    formData["2zzhb_resettlement_mon"] = data?.["2azresidential_hb_times"];
    formData["2zzcq_resettlement"] = data?.["2azresidential_cq"];
    formData["2zzcq_resettlement_mon"] = data?.["2azresidential_cq_times"];
    form.setFieldsValue(formData);
  };

  useEffect(() => {
    setTotalItem();
  }, [form.getFieldsValue(), setTotalItem]);

  useEffect(() => {
    if (form.getFieldsValue().project_name) {
      setOtherAmount();
    }
  }, [form.getFieldsValue().project_name, setOtherAmount]);

  // 非住宅搬迁单价（货币）
  const HBRelocation = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="非住宅搬迁单价（货币）" name="hb_relocation">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // F搬迁次数
  const HBRelocationCs = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="F搬迁次数" name="hb_relocation_cs">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // F1合计
  const HBRelocationTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="F1合计" name="hb_relocation_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 住宅搬迁单价（货币）
  const ZZHBRelocation = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="住宅搬迁单价（货币）" name="zzhb_relocation">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 搬迁次数
  const ZZHBRelocationCs = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="搬迁次数" name="zzhb_relocation_cs">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 2合计
  const ZZHBRelocationTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="2合计" name="zzhb_relocation_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 住宅搬迁单价（产权）
  const ZZCQRelocation = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="住宅搬迁单价（产权）" name="zzcq_relocation">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 搬迁次数
  const ZZCQRelocationCs = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="搬迁次数" name="zzcq_relocation_cs">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 3合计
  const ZZCQRelocationTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="3合计" name="zzcq_relocation_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 非住宅安置单价（货币）
  const HBResettlement = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="非住宅安置单价（货币）" name="hb_resettlement">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // F安置月数
  const HBResettlementMon = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="F安置月数" name="hb_resettlement_mon">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // F4合计
  const HBResettlementTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="F4合计" name="hb_resettlement_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 住宅安置单价（货币）
  const ZZHBResettlement = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="住宅安置单价（货币）" name="zzhb_resettlement">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 安置月数
  const ZZHBResettlementMon = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="安置月数" name="zzhb_resettlement_mon">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 5合计
  const ZZHBResettlementTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="5合计" name="zzhb_resettlement_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 住宅安置单价（产权）
  const ZZCQResettlement = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="住宅安置单价（产权）" name="zzcq_resettlement">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 过渡期限
  const TransitionTime = useMemo(() => {
    const onChange = (values) => {
      const [transition_time_st, transition_time_ed] = [
        values[0].format("YYYY-MM-DD"),
        values[1].format("YYYY-MM-DD"),
      ];
      form.setFieldsValue({
        transition_time_st,
        transition_time_ed,
      });
    };
    return (
      <Col span={6}>
        <Form.Item
          rules={[{ type: "array" }]}
          label="过渡期限"
          name="transition_time"
        >
          <RangePicker onChange={onChange} />
        </Form.Item>
      </Col>
    );
  }, [form]);

  // 安置月数
  const ZZCQResettlementMon = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="安置月数" name="zzcq_resettlement_mon">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 6合计
  const ZZCQResettlementTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="6合计" name="zzcq_resettlement_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 非住宅安置单价（货币）
  const THBResettlement = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="非住宅安置单价（货币）" name="2hb_resettlement">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // F安置月数
  const THBResettlementMon = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="F安置月数" name="2hb_resettlement_mon">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // F7合计
  const THBResettlementTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="F7合计" name="2hb_resettlement_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 住宅安置单价（货币）
  const TZZBHResettlement = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="住宅安置单价（货币）" name="2zzhb_resettlement">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 安置月数
  const TZZHBResettlementMon = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="安置月数" name="2zzhb_resettlement_mon">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 8合计
  const TZZHBResettlementTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="8合计" name="2zzhb_resettlement_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 住宅安置单价（产权）
  const TZZCQResettlement = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="住宅安置单价（产权）" name="2zzcq_resettlement">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // b安置月数
  const TZZCQResettlementMon = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="b安置月数" name="2zzcq_resettlement_mon">
          <InputNumber min={0} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 9合计
  const TZZCQResettlementTotal = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="9合计" name="2zzcq_resettlement_total">
          <InputNumber min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 签约奖励
  const SpecialSigningBonus = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="签约奖励" name="special_signing_bonus">
          <InputNumber readOnly min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 搬迁交房奖励
  const SpecialMovingReward = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="搬迁交房奖励" name="special_moving_reward">
          <InputNumber readOnly min={0} step={1.0} precision={2} />
        </Form.Item>
      </Col>
    );
  }, []);

  return (
    <>
      {/* 第一块 */}
      <Card type="inner" title="搬迁费及搬迁补助费">
        {/* 第一行 */}
        <Row gutter={16}>
          {HBRelocation}
          {HBRelocationCs}
          {HBRelocationTotal}
        </Row>
        {/* 第二行 */}
        <Row gutter={16}>
          {ZZHBRelocation}
          {ZZHBRelocationCs}
          {ZZHBRelocationTotal}
        </Row>
        {/* 第三行 */}
        <Row gutter={16}>
          {ZZCQRelocation}
          {ZZCQRelocationCs}
          {ZZCQRelocationTotal}
        </Row>
      </Card>
      <Divider style={{ marginTop: 0 }} />
      {/* 第二块 */}
      <Card type="inner" title="临时安置费">
        {/* 第一行 */}
        <Row gutter={16}>
          {HBResettlement}
          {HBResettlementMon}
          {HBResettlementTotal}
        </Row>
        {/* 第二行 */}
        <Row gutter={16}>
          {ZZHBResettlement}
          {ZZHBResettlementMon}
          {ZZHBResettlementTotal}
        </Row>
        {/* 第三行 */}
        <Row gutter={16}>
          {ZZCQResettlement}
          {TransitionTime}
          {ZZCQResettlementMon}
          {ZZCQResettlementTotal}
        </Row>
      </Card>
      {/* 第三块 */}
      <Card type="inner" title="临时安置补助费">
        {/* 第一行 */}
        <Row gutter={16}>
          {THBResettlement}
          {THBResettlementMon}
          {THBResettlementTotal}
        </Row>
        {/* 第二行 */}
        <Row gutter={16}>
          {TZZBHResettlement}
          {TZZHBResettlementMon}
          {TZZHBResettlementTotal}
        </Row>
        {/* 第三行 */}
        <Row gutter={16}>
          {TZZCQResettlement}
          {TZZCQResettlementMon}
          {TZZCQResettlementTotal}
        </Row>
      </Card>
      {/* 第四块 */}
      <Card type="inner" title="奖励及补贴">
        {/* 第一行 */}
        <Row gutter={16}>
          {SpecialSigningBonus}
          {SpecialMovingReward}
        </Row>
      </Card>
    </>
  );
};

export default Subsidy;
