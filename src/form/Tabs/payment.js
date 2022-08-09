// 打款情况
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Table, Button, InputNumber, DatePicker } from "antd";
import qs from "querystringify";
import { getDataWithSort } from "../api/asset";
import { uuid } from "./renovation";

const Campaign = (props, ref) => {
  const { form } = props;
  const [dataSource, setDataSource] = useState([]);

  const changeDataSource = (i, key, value) => {
    let newDataSource = [...dataSource];
    newDataSource[i][key] = value;
    setDataSource(newDataSource);
  };

  useImperativeHandle(ref, () => ({
    dataSource,
  }));

  const columns = [
    {
      title: "打款金额",
      dataIndex: "application_money",
      align: "center",
      render: (_, record, index) => {
        return (
          <InputNumber
            min={0}
            step={1.0}
            precision={2}
            onChange={(e) => changeDataSource(index, "application_money", e)}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "打款时间",
      dataIndex: "payment_time",
      align: "center",
      render: (_, record, index) => {
        return (
          <DatePicker
            style={{ width: "100%" }}
            onChange={(e) =>
              changeDataSource(index, "payment_time", e.valueOf())
            }
          />
        );
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      align: "center",
      width: 120,
      render: (_, record) => {
        const onDelete = () => {
          const { id } = record;
          setDataSource(dataSource?.filter((item) => item.id !== id));
        };
        return (
          <span
            onClick={onDelete}
            style={{ color: "red", whiteSpace: "nowrap", cursor: "pointer" }}
          >
            删除
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    // if (props.propsDataList.childData) {
    //   let poopsData = JSON.parse(JSON.stringify(props.propsDataList.childData));
    //   let propsArray = [];

    //   poopsData.forEach((item) => {
    //     if (item.evaluation_plan1gy) {
    //       if (item.evaluation_plan1gy.length > 0) {
    //         item.evaluation_plan1gy.forEach((e) => {
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
    //   setDataSource(propsArray);
    // }

    getPlayRecord();
  }, []);

  useEffect(() => {
    let total = 0;
    dataSource.forEach((item) => {
      total += item.application_money || 0;
    });
    form.setFieldsValue({ total_dakuan: total });
  }, [form, dataSource]);

  const getPlayRecord = async () => {
    const assetId = "c6c6048c-7152-84d9-27d8-a4a158eeb3fc";
    const queryParams = {
      filters: [
        {
          column: "data_id",
          datatype: 0,
          type: 4,
          varibleType: "components",
          compareObj: qs.parse(window.location.search).data_id,
          satisfy_type: 0,
        },
      ],
      columnNames: ["application_money", "payment_time"],
      sorts: [],
    };
    try {
      const { data } = await getDataWithSort(assetId, queryParams);
      setDataSource(data?.[1]?.[0] || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addRows = () => {
    setDataSource([...dataSource, { id: uuid() }]);
  };

  return (
    <>
      <Form.Item label="打款记录" labelCol={{ span: 2 }}>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          style={{ marginBottom: "25px" }}
          pagination={false}
          bordered
          footer={() => (
            <Button style={{ width: "100%" }} type="dashed" onClick={addRows}>
              新增
            </Button>
          )}
        />
      </Form.Item>
      <Form.Item
        label="合计打款金额"
        name="total_dakuan"
        labelCol={{ span: 2 }}
      >
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </>
  );
};

export default forwardRef(Campaign);
