// 产权调换情况
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Form,
  Input,
  InputNumber,
  Col,
  Row,
  Button,
  Table,
  Modal,
  message,
} from "antd";
import { ProfileOutlined } from "@ant-design/icons";

import { getDataWithSort } from "../api/asset";

import eventbus from "../api/eventBus";

import "./tabs.less";

const PropertyRight = (props, ref) => {
  const { form } = props;

  const [dataList, setDataList] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [totalEndListData, setTotalEndListData] = useState({}); //  hrf

  const translatePlatformDataToJsonArray = (originTableData) => {
    let originTableHeader = originTableData.data[0];
    let tableHeader = [];
    originTableHeader.forEach((item) => {
      tableHeader.push(item.col_name);
    });
    let tableBody = originTableData.data[1];
    let tableData = [];
    tableBody.forEach((tableItem) => {
      let temp = {};
      tableItem.forEach((item, index) => {
        temp[tableHeader[index]] = item;
      });
      tableData.push(temp);
    });
    return tableData;
  };

  useImperativeHandle(ref, () => ({
    dataList,
  }));

  const get_UUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
        16
      );
    });
  };

  const columns = [
    {
      title: "小区名称",
      dataIndex: "community_name",
      key: "community_name",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={_}
          onChange={(e) => {
            inputChange(e, index, "community_name", record);
          }}
        ></Input>
      ),
    },
    {
      title: "栋号",
      dataIndex: "building_number",
      key: "building_number",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={_}
          onChange={(e) => {
            inputChange(e, index, "building_number");
          }}
        ></Input>
      ),
    },
    {
      title: "单元",
      dataIndex: "unit_number",
      key: "unit_number",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={_}
          onChange={(e) => {
            inputChange(e, index, "unit_number");
          }}
        ></Input>
      ),
    },
    {
      title: "楼层",
      dataIndex: "floor_number",
      key: "floor_number",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={_}
          onChange={(e) => {
            inputChange(e, index, "floor_number");
          }}
        ></Input>
      ),
    },
    {
      title: "房号",
      dataIndex: "room_number",
      key: "room_number",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={_}
          onChange={(e) => {
            inputChange(e, index, "room_number");
          }}
        ></Input>
      ),
    },
    {
      title: "建筑面积",
      dataIndex: "construction_area",
      key: "construction_area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "construction_area");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "套内面积",
      dataIndex: "set_area",
      key: "set_area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "set_area");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "操作",
      key: "handle",
      align: "center",
      render: (_, record, index) => (
        <Button type="link" onClick={() => deleteRows(_, record)}>
          删除
        </Button>
      ),
    },
  ];

  useEffect(() => {
    eventbus.emit("resetPropertyRight", {});

    eventbus.on("initTotalEndList", () => {
      eventbus.emit("countAreaData", totalEndListData || {});
    });

    // if (props.propsDataList.childData) {
    //   let poopsData = JSON.parse(JSON.stringify(props.propsDataList.childData));
    //   let propsArray = [];
    //   poopsData.forEach((item) => {
    //     if (item.gy_placement) {
    //       if (item.gy_placement.length > 0) {
    //         item.gy_placement.forEach((e) => {
    //           let propsObj = {};
    //           for (let key in e) {
    //             if (e[key]["label"]) {
    //               propsObj[key] = e[key]["value"];
    //             } else {
    //               propsObj[key] = e[key];
    //             }
    //           }
    //           propsObj.key = propsObj.data_id;
    //           propsArray.push(propsObj);
    //         });
    //       }
    //     }
    //   });
    //   setDataList(propsArray);
    // }

    getUnitPrice();
  }, []);

  useEffect(() => {
    if (
      (form.getFieldsValue().house_use === "1" ||
        form.getFieldsValue().house_use === 1) &&
      form.getFieldsValue().zhengzaitaonei_area !== undefined &&
      form.getFieldsValue().selected_room_inArea_total
    ) {
      if (
        form.getFieldsValue().zhengzaitaonei_area <
        form.getFieldsValue().selected_room_inArea_total
      ) {
        //证载套内面积<选房套内面积------超安
        if (form.getFieldsValue().gt_xs_azf === undefined) {
          message.error("请填写安置房屋公摊系数");
        } else {
          //应安面积
          let yinganmianji =
            form.getFieldsValue().zhengzaitaonei_area *
            (1 + form.getFieldsValue().gt_xs_azf);
          //选房合计面积
          let xuanfanghejimianji =
            form.getFieldsValue().selected_room_area_total;
          let chaoanmianji = xuanfanghejimianji - yinganmianji;
          if (chaoanmianji > 0 && chaoanmianji <= 10) {
            form.setFieldsValue({
              overarea_0: chaoanmianji,
            });
            form.setFieldsValue({
              overarea_0total:
                chaoanmianji * form.getFieldsValue().overarea_0price,
            });
          } else if (chaoanmianji > 10 && chaoanmianji <= 20) {
            form.setFieldsValue({
              overarea_0: 10,
              overarea_10: chaoanmianji - 10,
            });
            form.setFieldsValue({
              overarea_0total: 10 * form.getFieldsValue().overarea_0price,
              overarea_10total:
                (chaoanmianji - 10) * form.getFieldsValue().overarea_10price,
            });
          } else if (chaoanmianji > 20) {
            form.setFieldsValue({
              overarea_0: 10,
              overarea_10: 10,
              overarea_20: chaoanmianji - 20,
            });
            form.setFieldsValue({
              overarea_0total: 10 * form.getFieldsValue().overarea_0price,
              overarea_10total: 10 * form.getFieldsValue().overarea_10price,
              overarea_20total:
                (chaoanmianji - 20) * form.getFieldsValue().overarea_20price,
            });
          }
          form.setFieldsValue({
            cqdh_area: form.getFieldsValue().zhengzai_area,
            zzcq_relocation_total:
              form.getFieldsValue().zhengzai_area *
              (form.getFieldsValue().zzcq_relocation || 0) *
              (form.getFieldsValue().zzcq_relocation_cs || 0),
            zzcq_resettlement_total:
              form.getFieldsValue().zhengzai_area *
              (form.getFieldsValue().zzcq_resettlement || 0) *
              (form.getFieldsValue().zzcq_resettlement_mon || 0),
            "2zzcq_resettlement_total":
              form.getFieldsValue().zhengzai_area *
              (form.getFieldsValue()["2zzcq_resettlement"] || 0) *
              (form.getFieldsValue()["2zzcq_resettlement_mon"] || 0),
            hb_relocation_total: 0,
            hb_resettlement_total: 0,
            "2hb_resettlement_total": 0,
            zzhb_relocation_total: 0,
            zzhb_resettlement_total: 0,
            "2zzhb_resettlement_total": 0,
          });
        }
      } else {
        if (form.getFieldsValue().gt_xs_yfw === undefined) {
          message.error("请填写原房屋公摊系数");
        } else {
          let huobibuchangbufenmianji =
            (form.getFieldsValue().zhengzai_area -
              form.getFieldsValue().selected_room_inArea_total) *
            (1 + form.getFieldsValue().gt_xs_yfw); //货币补偿面积
          let chanquandiaohuanbufenmianji =
            form.getFieldsValue().zhengzai_area - huobibuchangbufenmianji; //产权调换面积
          form.setFieldsValue({
            cqdh_area: chanquandiaohuanbufenmianji,
            zzhb_relocation_total:
              huobibuchangbufenmianji *
              (form.getFieldsValue().zzhb_relocation || 0) *
              (form.getFieldsValue().zzhb_relocation_cs || 0),
            zzhb_resettlement_total:
              huobibuchangbufenmianji *
              (form.getFieldsValue().zzhb_resettlement || 0) *
              (form.getFieldsValue().zzhb_resettlement_mon || 0),
            "2zzhb_resettlement_total":
              huobibuchangbufenmianji *
              (form.getFieldsValue()["2zzhb_resettlement"] || 0) *
              (form.getFieldsValue()["2zzhb_resettlement_mon"] || 0),
            zzcq_resettlement_total:
              huobibuchangbufenmianji *
              (form.getFieldsValue().zzcq_relocation || 0) *
              (form.getFieldsValue().zzcq_relocation_cs || 0),
            zzcq_resettlement_mon:
              huobibuchangbufenmianji *
              (form.getFieldsValue().zzcq_resettlement || 0) *
              (form.getFieldsValue().zzcq_resettlement_mon || 0),
            "2zzcq_resettlement_total":
              huobibuchangbufenmianji *
              (form.getFieldsValue()["2zzcq_resettlement"] || 0) *
              (form.getFieldsValue()["2zzcq_resettlement_mon"] || 0),
            overarea_0: 0,
            overarea_10: 0,
            overarea_20: 0,
          });
        }
      }
    }
  }, [
    // 房屋用途
    form.getFieldsValue().house_use,
    // 安置方式
    form.getFieldsValue().placement_method,
    // 证载建筑面积
    form.getFieldsValue().zhengzai_area,
    // 证载套内面积
    form.getFieldsValue().zhengzaitaonei_area,
    // 合计选房套内面积
    form.getFieldsValue().selected_room_inArea_total,
    // 安置房系数
    form.getFieldsValue().gt_xs_azf,
    // 原房屋系数
    form.getFieldsValue().gt_xs_yfw,
    // 单价
    form.getFieldsValue().overarea_0price,
    form.getFieldsValue().overarea_10price,
    form.getFieldsValue().overarea_20price,
  ]);

  useEffect(() => {
    form.setFieldsValue({
      selected_room_area_total:
        Number(
          form.getFieldsValue().selected_room_area +
            (form.getFieldsValue().qifang_area || 0)
        ) || 0,
    });
  }, [form.getFieldsValue().selected_room_area]);

  useEffect(() => {
    form.setFieldValue({
      overarea_0total:
        Number(
          form.getFieldValue().overarea_0 *
            (form.getFieldValue().overarea_0price || 0)
        ) || 0,
    });
  }, [form.getFieldValue().overarea_0, form.getFieldValue().overarea_0price]);
  useEffect(() => {
    form.setFieldsValue({
      overarea_10total:
        Number(
          form.getFieldsValue().overarea_10 *
            (form.getFieldsValue().overarea_10price || 0)
        ) || 0,
    });
  }, [form.getFieldValue().overarea_10, form.getFieldValue().overarea_10price]);
  useEffect(() => {
    form.setFieldsValue({
      overarea_20total:
        Number(
          form.getFieldsValue().overarea_20 *
            (form.getFieldsValue().overarea_20price || 0)
        ) || 0,
    });
  }, [form.getFieldValue().overarea_20, form.getFieldValue().overarea_20price]);

  // 获取单价
  const getUnitPrice = () => {
    let queryForm = {
      filters: [],
      columnNames: ["overarea_0price", "overarea_10price", "overarea_20price"],
      sorts: [],
    };
    getDataWithSort("ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988", queryForm).then(
      (res) => {
        let resData = translatePlatformDataToJsonArray(res);
        form.setFieldsValue({
          overarea_0price: resData.overarea_0price || 0,
          overarea_10price: resData.overarea_10price || 0,
          overarea_20price: resData.overarea_20price || 0,
        });
      }
    );
  };

  // 打开弹窗
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    if (form.getFieldsValue().idcard) {
      let asset_id = "eb4745e6-c6d7-8905-2c2d-899e797f4ef8";
      let queryForm = {
        filters: [
          {
            column: "lock_data_id",
            datatype: 0,
            type: 4,
            varibleType: "components",
            compareObj: form.getFieldsValue().idcard,
            satisfy_type: 0,
          },
        ],
        columnNames: [
          "building_number",
          "unit_number",
          "floor_number",
          "room_number",
          "community_name",
          "construction_area",
          "set_area",
        ],
        sorts: [],
      };
      getDataWithSort(asset_id, queryForm).then((res) => {
        let resData = translatePlatformDataToJsonArray(res);

        resData.forEach((item, index) => {
          item.key = get_UUID();
        });

        setDataList(resData);

        let total = 0;
        resData.forEach((item) => {
          total += item.set_area;
        });
        form.setFieldsValue({
          selected_room_inArea_total: total,
        });
      });
    }

    setIsModalVisible(false);
  };

  // 输入框值改变
  const inputChange = (e, index, field) => {
    let tableList = JSON.parse(JSON.stringify(dataList));
    // 建筑面积
    if (field === "construction_area") {
      // 更新数据
      tableList[index][field] = e;
      // 计算选房合计面积
      let total = 0;
      tableList.forEach((item) => {
        total += item.construction_area;
      });
      form.setFieldsValue({ selected_room_area: total });
    }
    // 套内面积
    if (field === "set_area") {
      tableList[index][field] = e;
      // 计算合计选房套内面积
      let total = 0;
      tableList.forEach((item) => {
        total += item.set_area;
      });
      form.setFieldsValue({ selected_room_inArea_total: total });
    }

    setDataList(tableList);
  };

  // 新增
  const addRows = () => {
    let tableList = JSON.parse(JSON.stringify(dataList));
    let row = {
      key: get_UUID(),
      community_name: "",
      building_number: "",
      unit_number: "",
      floor_number: "",
      room_number: "",
      construction_area: 0,
      set_area: 0,
    };
    tableList.push(row);
    setDataList(tableList);

    let total = 0;
    tableList.forEach((item) => {
      total += item.set_area;
    });
    form.setFieldsValue({ selected_room_inArea_total: total });
  };

  // 删除
  const deleteRows = (_, record) => {
    let tableList = JSON.parse(JSON.stringify(dataList));

    let index = tableList.findIndex((e) => {
      return e.key === record.key;
    });
    tableList.splice(index, 1);
    setDataList(tableList);

    let total = 0;
    tableList.forEach((item) => {
      total += item.set_area;
    });
    form.setFieldsValue({ selected_room_inArea_total: total });
  };

  return (
    <>
      {/* 按钮组 */}
      <Form.Item style={{ marginBottom: "40px" }}>
        <Row gutter={16}>
          <Col span={6}>
            <Button type="primary" onClick={showModal}>
              选房
            </Button>
          </Col>
          <Col span={6}> </Col>
          <Col span={6}> </Col>
          <Col span={6}>
            <Form.Item label="产权调换面积" name="cqdh_area">
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      {/* 第一行 */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Form.Item label="期房面积" name="qifang_area">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="选房面积" name="selected_room_area">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="选房合计面积" name="selected_room_area_total">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
              readOnly
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="合计选房套内面积" name="selected_room_inArea_total">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              readOnly
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* 表格 */}
      <Form.Item name="gy_placement">
        <Table
          dataSource={dataList}
          columns={columns}
          pagination={false}
          bordered
          footer={() => (
            <Button
              style={{ width: "100%" }}
              type="dashed"
              onClick={() => addRows()}
            >
              新增
            </Button>
          )}
        />
      </Form.Item>
      {/* 标题 */}
      <div className="title_public">
        <ProfileOutlined /> 超安补差
      </div>
      {/* 列表 */}
      <div style={{ padding: "20px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="超安面积(0-10㎡)" name="overarea_0">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="单价" name="overarea_0price">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
                onChange={(e) => {
                  inputChange(e, 0, "overarea_0price");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="超安10合计" name="overarea_0total">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                readOnly
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="超安面积(10-20㎡)" name="overarea_10">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="单价" name="overarea_10price">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="超安20合计" name="overarea_10total">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                readOnly
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="超安面积(20㎡以上)" name="overarea_20">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="单价" name="overarea_20price">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="超安30合计" name="overarea_20total">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                readOnly
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="乙方应付甲方(元)" name="partyb_to_a">
              <InputNumber
                min={0}
                step={1.0}
                precision={2}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      {/* 弹窗 */}
      <Modal
        title="选房"
        visible={isModalVisible}
        onCancel={handleCancel}
        width="90%"
        footer={[]}
        maskClosable={false}
      >
        {form.getFieldsValue().project_name && form.getFieldsValue().idcard && (
          <iframe
            style={{ width: "100%", height: "650px" }}
            frameborder={0}
            src={`${
              window.location.origin
            }/applicationview/content/view?appid=c0823356-71de-2831-87f7-26a74d0c32ac&type=view&menuId=06dac334-e625-5608-4635-50c54a093534%233&project_name=${
              form.getFieldsValue().project_name
            }&person_id=${form.getFieldsValue().idcard}`}
          />
        )}
      </Modal>
    </>
  );
};

export default forwardRef(PropertyRight);
