import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Tabs, Form } from "antd";
import "./index.less";

import eventbus from "./api/eventBus";
// 被征收人信息
import Expropriated from "./Tabs/expropriated";
// 产权调换情况
import PropertyRight from "./Tabs/propertyRight";
// 货币补偿
import Compensate from "./Tabs/compensate";
// 装修附属
import Renovation from "./Tabs/renovation";
// 搬迁、安置、补助
import Subsidy from "./Tabs/subsidy";
// 结算
import Settlement from "./Tabs/settlement";
// 附件上传
import Enclosure from "./Tabs/enclosure";
// 打款情况
import Payment from "./Tabs/payment";
// 签章
import ButtonModal from "./Tabs/buttonModal";

import { getProvinceArea, getAreaByParent } from "./api/asset";

const { TabPane } = Tabs;

const App = forwardRef((props, myRef) => {
  const [form] = Form.useForm();

  const PropertyRightRef = useRef();
  const CompensateRef = useRef();
  const RenovationRef = useRef();
  const PaymentRef = useRef();

  const [propsDataList, setPropsDataList] = useState([]);

  const [propertyRightTabs, setPropertyRightTabs] = useState("货币补偿");

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const events = [];

    const actions = [];

    let propsObj = {};

    for (let item in props.defaultValue) {
      if (props.defaultValue[item]["label"]) {
        propsObj[item] = props.defaultValue[item]["value"];
      } else {
        propsObj[item] = props.defaultValue[item];
      }
    }
    // 房屋用途
    if (propsObj.house_use) {
      propsObj.house_use =
        propsObj.house_use === "住宅"
          ? 1
          : propsObj.house_use === "非住宅"
          ? 2
          : "";
    }
    // 安置方式
    if (propsObj.placement_method) {
      setPropertyRightTabs(propsObj.placement_method);
    }
    // 被征人信息
    if (propsObj.richman_type) {
      propsObj.protocal_type =
        propsObj.richman_type === "个人"
          ? 1
          : propsObj.richman_type === "单位"
          ? 2
          : propsObj.richman_type === "承租人"
          ? 3
          : "";
    }
    // 过渡时间
    if (propsObj.transition_time_ed && propsObj.transition_time_st) {
      propsObj.transition_time = [
        new Date(propsObj.transition_time_st),
        new Date(propsObj.transition_time_ed),
      ];
    }
    // 实际居住地
    if (propsObj.actual_address_qycj) {
      propsObj.actual_address_qycj = propsObj.actual_address_qycj.replace(
        ",",
        "/"
      );
    }
    // 签约照片
    if (propsObj.signed_photo) {
      propsObj.signed_photo = JSON.parse(propsObj.signed_photo);
    }
    // 签约照片（个人）
    if (propsObj.split_photos) {
      propsObj.split_photos = JSON.parse(propsObj.split_photos);
    }
    // 房屋外观
    if (propsObj.out_photos) {
      propsObj.out_photos = JSON.parse(propsObj.out_photos);
    }
    // 用工人员核定表
    if (propsObj.staffCheck) {
      propsObj.staffCheck = JSON.parse(propsObj.staffCheck);
    }
    // 授权委托书(图)
    if (propsObj.authorization) {
      propsObj.authorization = JSON.parse(propsObj.authorization);
    }
    // 授权委托书
    if (propsObj.property_rcertificate_cancellation) {
      propsObj.property_rcertificate_cancellation = JSON.parse(
        propsObj.property_rcertificate_cancellation
      );
    }

    console.log("propsObj", propsObj);

    setPropsDataList(propsObj);

    form.setFieldsValue(propsObj);

    props?.customConfig?.componentId &&
      window.componentCenter?.register(
        props?.customConfig?.componentId,
        "",
        { Event_Center_getName },
        { events, actions }
      );
  }, []);

  const hideTabs = (value) => {
    setPropertyRightTabs(value);
  };

  const changeTabs = (key) => {
    eventbus.emit("formChange");
  };

  // 逻辑控制用，不可删
  const Event_Center_getName = () => {
    return "国有征收补偿";
  };

  const formChange = () => {
    eventbus.emit("formChange");
  };

  // 处理保存数据
  const handleData = () => {
    let data = form.getFieldsValue();

    let childData = [];

    childData.push({ gy_placement: PropertyRightRef.current?.dataList || [] });

    if (data.house_use === 1) {
      childData.push({
        gy_sign_certificate: CompensateRef.current.houseSettleData || [],
      });
    } else if (data.house_use === 2) {
      childData.push({
        gy_sign_uncertificate: CompensateRef.current.unhouseSettleData || [],
      });
    }
    // 获取所有子表
    childData.push({
      gy_sign_legal: CompensateRef.current.legalData || [],
    });
    childData.push({
      gy_sign_zgf: CompensateRef.current.reformHouseData || [],
    });
    childData.push({
      monetary_indemnity: CompensateRef.current.selfHouseData || [],
    });
    childData.push({
      gy_sign_decorate: RenovationRef.current.assessAmountTableData || [],
    });
    childData.push({
      gy_sign_attached:
        RenovationRef.current.auxiliaryRealQuantityTableData || [],
    });
    childData.push({
      evaluation_plan1gy: PaymentRef.current.dataSource || [],
    });
    // 提交表单中添加子表
    data.childData = childData;

    // 处理实际居住地
    if (data.actual_address_qycj) {
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(data.actual_address_qycj)) {
        let arr = data.actual_address_qycj.split("/");
        // 映射省
        getProvinceArea().then((res) => {
          res.data.forEach((item) => {
            if (item.name === arr[0]) {
              setProvince(item.id);
              // 映射市
              getAreaByParent(item.id).then((res1) => {
                res1.data.forEach((e) => {
                  if (e.name === arr[1]) {
                    setCity(e.id);
                  }
                });
              });
            }
          });
        });
        data.actual_address_qycj = province + "," + city;
      } else {
        data.actual_address_qycj =
          data.actual_address_qycj[0] + "," + data.actual_address_qycj[1];
      }
    }
    // 处理过渡时间
    if (data.transition_time) {
      data.transition_time_st = Date.parse(new Date(data.transition_time[0]));
      data.transition_time_ed = Date.parse(new Date(data.transition_time[1]));
    }
    // 添加默认参数
    if (props.defaultValue) {
      data.data_id = props.defaultValue.data_id;
      data.flow_instance_id = props.defaultValue.flow_instance_id;
      data.create_member = props.defaultValue.create_member;
      data.office_id = props.defaultValue.office_id;
      data.process_status = props.defaultValue.process_status;
    }

    return data;
  };

  useImperativeHandle(myRef, () => ({
    myForm: handleData(),
  }));

  return (
    <Form
      form={form}
      className="tabs_all"
      onValuesChange={formChange}
      labelWrap
    >
      {props?.defaultValue?.data_id ? (
        <ButtonModal
          className="button_modal"
          form={form}
          processStatus={props.processStatus}
        ></ButtonModal>
      ) : (
        ""
      )}

      <Tabs defaultActiveKey="1" onChange={changeTabs}>
        <TabPane tab="被征收人信息" key="1" forceRender={true}>
          <Expropriated form={form} click={hideTabs} />
        </TabPane>
        {propertyRightTabs && propertyRightTabs === "产权调换" && (
          <TabPane tab="产权调换情况" key="2" forceRender={true}>
            <PropertyRight
              ref={PropertyRightRef}
              form={form}
              propsDataList={propsDataList}
            ></PropertyRight>
          </TabPane>
        )}
        <TabPane tab="货币补偿" key="3" forceRender={true}>
          <Compensate
            ref={CompensateRef}
            form={form}
            propsDataList={propsDataList}
          />
        </TabPane>
        <TabPane tab="装修附属" key="4" forceRender={true}>
          <Renovation
            ref={RenovationRef}
            form={form}
            propsDataList={propsDataList}
          />
        </TabPane>
        <TabPane tab="搬迁、安置、补助" key="5" forceRender={true}>
          <Subsidy form={form} />
        </TabPane>
        <TabPane tab="结算" key="6" forceRender={true}>
          <Settlement form={form} />
        </TabPane>
        <TabPane tab="附件上传" key="7" forceRender={true}>
          <Enclosure form={form} />
        </TabPane>
        <TabPane tab="打款情况" key="8" forceRender={true}>
          <Payment ref={PaymentRef} form={form} propsDataList={propsDataList} />
        </TabPane>
      </Tabs>
    </Form>
  );
});

export default App;
