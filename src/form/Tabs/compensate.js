// 货币补偿
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Input,
  InputNumber,
  Table,
  Button,
  Form,
  Row,
  Col,
  Select,
} from "antd";
import { getDataWithSort } from "../api/asset";

const PropertyRight = (props, ref) => {
  const { Option } = Select;
  const { form } = props;

  // 有证非住宅结算
  const [houseSettleData, sethouseSettleData] = useState([]);
  const houseSettleColums = [
    {
      title: "结构",
      dataIndex: "structure",
      key: "structure",
      type: "0",
      align: "center",
      render: (_, record, index) => (
        <Select
          onChange={(e) => {
            changeStructure(e, index, "structure", "houseSettle");
          }}
        >
          <Option value="框架">框架</Option>
          <Option value="砖混">砖混</Option>
          <Option value="砖木">砖木</Option>
        </Select>
      ),
    },
    {
      title: "面积(㎡)",
      dataIndex: "area",
      key: "area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "area", "houseSettle");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "评估单价",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "price", "houseSettle");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "上浮百分比",
      dataIndex: "percent",
      key: "percent",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "percent", "houseSettle");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "合计",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (_, record, index) => (
        <Input readOnly value={_} style={{ width: "100%" }} />
      ),
    },
    {
      title: "操作",
      key: "handle",
      align: "center",
      render: (_, record, index) => (
        <Button
          type="link"
          onClick={() => deleteRows(_, record, "houseSettle")}
        >
          删除
        </Button>
      ),
    },
  ];
  // 有证非住宅结算
  const [unhouseSettleData, setUnhouseSettleData] = useState([]);
  const unhouseSettleColums = [
    {
      title: "结构",
      dataIndex: "structure",
      key: "structure",
      type: "0",
      align: "center",
      render: (_, record, index) => (
        <Select
          onChange={(e) => {
            changeStructure(e, index, "structure", "unhouseSettle");
          }}
        >
          <Option value="框架">框架</Option>
          <Option value="砖混">砖混</Option>
          <Option value="砖木">砖木</Option>
        </Select>
      ),
    },
    {
      title: "面积(㎡)",
      dataIndex: "area",
      key: "area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "area", "unhouseSettle");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "评估单价",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "price", "unhouseSettle");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "上浮百分比",
      dataIndex: "percent",
      key: "percent",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "percent", "unhouseSettle");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "合计",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (_, record, index) => (
        <Input readOnly value={_} style={{ width: "100%" }} />
      ),
    },
    {
      title: "操作",
      key: "handle",
      align: "center",
      render: (_, record, index) => (
        <Button
          type="link"
          onClick={() => deleteRows(_, record, "unhouseSettle")}
        >
          删除
        </Button>
      ),
    },
  ];
  // 合法性认定面积结算
  const [legalData, setlegalData] = useState([]);
  const legalColumns = [
    {
      title: "结构",
      dataIndex: "structure",
      key: "structure",
      type: "0",
      align: "center",
      render: (_, record, index) => (
        <Select
          onChange={(e) => {
            changeStructure(e, index, "structure", "legal");
          }}
        >
          <Option value="框架">框架</Option>
          <Option value="砖混">砖混</Option>
          <Option value="砖木">砖木</Option>
        </Select>
      ),
    },
    {
      title: "面积(㎡)",
      dataIndex: "area",
      key: "area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "area", "legal");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "评估单价",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "price", "legal");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "上浮百分比",
      dataIndex: "percent",
      key: "percent",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "percent", "legal");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "合计",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (_, record, index) => (
        <Input readOnly value={_} style={{ width: "100%" }} />
      ),
    },
    {
      title: "操作",
      key: "handle",
      align: "center",
      render: (_, record, index) => (
        <Button type="link" onClick={() => deleteRows(_, record, "legal")}>
          删除
        </Button>
      ),
    },
  ];
  // 住改非结算
  const [reformHouseData, setReformHouseData] = useState([]);
  const reformHouseColums = [
    {
      title: "结构",
      dataIndex: "structure",
      key: "structure",
      type: "0",
      align: "center",
      render: (_, record, index) => (
        <Select
          onChange={(e) => {
            changeStructure(e, index, "structure", "reformHouse");
          }}
        >
          <Option value="框架">框架</Option>
          <Option value="砖混">砖混</Option>
          <Option value="砖木">砖木</Option>
        </Select>
      ),
    },
    {
      title: "面积(㎡)",
      dataIndex: "area",
      key: "area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "area", "reformHouse");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "评估单价",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "price", "reformHouse");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "百分比计算",
      dataIndex: "percentCount",
      key: "percentCount",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "percentCount", "reformHouse");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "合计",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (_, record, index) => (
        <Input readOnly value={_} style={{ width: "100%" }} />
      ),
    },
    {
      title: "操作",
      key: "handle",
      align: "center",
      render: (_, record, index) => (
        <Button
          type="link"
          onClick={() => deleteRows(_, record, "reformHouse")}
        >
          删除
        </Button>
      ),
    },
  ];
  // 无证自建房结算
  const [selfHouseData, setSelfHouseData] = useState([]);
  const selfHouseColums = [
    {
      title: "结构",
      dataIndex: "structure",
      key: "structure",
      type: "0",
      align: "center",
      render: (_, record, index) => (
        <Select
          onChange={(e) => {
            changeStructure(e, index, "structure", "selfHouse");
          }}
        >
          <Option value="框架">框架</Option>
          <Option value="砖混">砖混</Option>
          <Option value="砖木">砖木</Option>
          <Option value="石木">石木</Option>
          <Option value="木结构">木结构</Option>
          <Option value="钢结构">钢结构</Option>
          <Option value="其它">其它</Option>
        </Select>
      ),
    },
    {
      title: "面积(㎡)",
      dataIndex: "area",
      key: "area",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "area", "selfHouse");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "工料补助单价(元)",
      dataIndex: "materials",
      key: "materials",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "materials", "selfHouse");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "奖励补助单价(元)",
      dataIndex: "rewardPrice",
      key: "rewardPrice",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          step={1.0}
          precision={2}
          value={_}
          onChange={(e) => {
            inputChange(e, index, "rewardPrice", "selfHouse");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "合计",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (_, record, index) => (
        <Input readOnly value={_} style={{ width: "100%" }} />
      ),
    },
    {
      title: "操作",
      key: "handle",
      align: "center",
      render: (_, record, index) => (
        <Button type="link" onClick={() => deleteRows(_, record, "selfHouse")}>
          删除
        </Button>
      ),
    },
  ];

  useImperativeHandle(ref, () => ({
    houseSettleData,
    unhouseSettleData,
    legalData,
    reformHouseData,
    selfHouseData,
  }));

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

  const get_UUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
        16
      );
    });
  };

  useEffect(() => {
    // if (props.propsDataList.childData) {
    //   let poopsData = JSON.parse(JSON.stringify(props.propsDataList.childData));
    //   let houseSettlArray = [];
    //   let unhouseSettleArray = [];
    //   let legalArray = [];
    //   let reformHouseArray = [];
    //   let selfHouseArray = [];
    //   poopsData.forEach((item) => {
    //     if (form.getFieldsValue().house_use === 1) {
    //       // 有证住宅结算
    //       if (item.gy_sign_certificate) {
    //         if (item.gy_sign_certificate.length > 0) {
    //           item.gy_sign_certificate.forEach((e) => {
    //             let propsObj = {};
    //             for (let key in e) {
    //               if (e[key]["label"]) {
    //                 propsObj[key] = e[key]["value"];
    //               } else {
    //                 propsObj[key] = e[key];
    //               }
    //             }
    //             propsObj.key = propsObj.data_id;
    //             houseSettlArray.push(propsObj);
    //           });
    //         }
    //       }
    //     } else if (form.getFieldsValue().house_use === 2) {
    //       // 有证非住宅结算
    //       if (item.gy_sign_uncertificate) {
    //         if (item.gy_sign_uncertificate.length > 0) {
    //           item.gy_sign_uncertificate.forEach((e) => {
    //             let propsObj = {};
    //             for (let key in e) {
    //               if (e[key]["label"]) {
    //                 propsObj[key] = e[key]["value"];
    //               } else {
    //                 propsObj[key] = e[key];
    //               }
    //             }
    //             propsObj.key = propsObj.data_id;
    //             houseSettlArray.push(propsObj);
    //           });
    //         }
    //       }
    //     }
    //     // 合法性认定面积
    //     if (item.gy_sign_legal) {
    //       if (item.gy_sign_legal.length > 0) {
    //         item.gy_sign_legal.forEach((e) => {
    //           let propsObj = {};
    //           for (let key in e) {
    //             if (e[key]["label"]) {
    //               propsObj[key] = e[key]["value"];
    //             } else {
    //               propsObj[key] = e[key];
    //             }
    //           }
    //           propsObj.key = propsObj.data_id;
    //           legalArray.push(propsObj);
    //         });
    //       }
    //     }
    //     // 住改非结算
    //     if (item.gy_sign_zgf) {
    //       if (item.gy_sign_zgf.length > 0) {
    //         item.gy_sign_zgf.forEach((e) => {
    //           let propsObj = {};
    //           for (let key in e) {
    //             if (e[key]["label"]) {
    //               propsObj[key] = e[key]["value"];
    //             } else {
    //               propsObj[key] = e[key];
    //             }
    //           }
    //           propsObj.key = propsObj.data_id;
    //           reformHouseArray.push(propsObj);
    //         });
    //       }
    //     }
    //     // 无证自建房结算
    //     if (item.monetary_indemnity) {
    //       if (item.monetary_indemnity.length > 0) {
    //         item.monetary_indemnity.forEach((e) => {
    //           let propsObj = {};
    //           for (let key in e) {
    //             if (e[key]["label"]) {
    //               propsObj[key] = e[key]["value"];
    //             } else {
    //               propsObj[key] = e[key];
    //             }
    //           }
    //           propsObj.key = propsObj.data_id;
    //           selfHouseArray.push(propsObj);
    //         });
    //       }
    //     }
    //   });
    //   sethouseSettleData(houseSettlArray);
    //   setUnhouseSettleData(unhouseSettleArray);
    //   setlegalData(legalArray);
    //   setReformHouseData(reformHouseArray);
    //   setSelfHouseData(selfHouseArray);
    // }
    // 获取房屋用途
  }, []);

  //  数据改变
  const inputChange = (e, index, field, type) => {
    if (type === "houseSettle") {
      let rowList = JSON.parse(JSON.stringify(houseSettleData));
      rowList[index][field] = e;
      rowList[index].total = 0;
      rowList[index].total = Number(
        (
          Number(rowList[index].area) *
          Number(rowList[index].price) *
          (Number(rowList[index].percent) / 100 + 1)
        ).toFixed(2)
      );

      sethouseSettleData(rowList);
      computeTotal(rowList, "certified");
    }
    if (type === "unhouseSettle") {
      let rowList = JSON.parse(JSON.stringify(unhouseSettleData));
      rowList[index][field] = e;
      rowList[index].total = 0;
      rowList[index].total = Number(
        (
          Number(rowList[index].area) *
          Number(rowList[index].price) *
          (Number(rowList[index].percent) / 100 + 1)
        ).toFixed(2)
      );

      setUnhouseSettleData(rowList);
      computeTotal(rowList, "noCertified");
    }
    if (type === "legal") {
      let rowList = JSON.parse(JSON.stringify(legalData));
      rowList[index][field] = e;

      rowList[index].total = 0;
      rowList[index].total = Number(
        (
          Number(rowList[index].area) *
          Number(rowList[index].price) *
          (Number(rowList[index].percent) / 100 + 1)
        ).toFixed(2)
      );

      setlegalData(rowList);
      computeTotal(rowList, "legitimate");
    }
    if (type === "reformHouse") {
      let rowList = JSON.parse(JSON.stringify(reformHouseData));
      rowList[index][field] = e;

      rowList[index].total = 0;
      rowList[index].total = Number(
        (
          Number(rowList[index].area) *
          Number(rowList[index].price) *
          (Number(rowList[index].percentCount) / 100)
        ).toFixed(2)
      );

      setReformHouseData(rowList);
      computeTotal(rowList, "reformHouse");
    }
    if (type === "selfHouse") {
      let rowList = JSON.parse(JSON.stringify(selfHouseData));
      rowList[index][field] = e;

      rowList[index].total = 0;
      rowList[index].total = Number(
        (
          Number(rowList[index].area) *
          Number(rowList[index].materials) *
          Number(rowList[index].rewardPrice)
        ).toFixed(2)
      );

      setSelfHouseData(rowList);
      computeTotal(rowList, "selfBuilt");
    }
  };

  // 新增
  const addRows = (type) => {
    let row = {
      key: get_UUID(),
      area: 0,
      structure: "",
      price: 0,
      percent: 0,
      percentCount: 0,
      materials: 0,
      rewardPrice: 0,
      total: 0,
    };

    if (type === "houseSettle") {
      let tableList = JSON.parse(JSON.stringify(houseSettleData));
      tableList.push(row);
      sethouseSettleData(tableList);
    }
    if (type === "unhouseSettle") {
      let tableList = JSON.parse(JSON.stringify(unhouseSettleData));
      tableList.push(row);
      setUnhouseSettleData(tableList);
    }
    if (type === "legal") {
      let tableList = JSON.parse(JSON.stringify(legalData));
      tableList.push(row);
      setlegalData(tableList);
    }
    if (type === "reformHouse") {
      let tableList = JSON.parse(JSON.stringify(reformHouseData));
      tableList.push(row);
      setReformHouseData(tableList);
    }
    if (type === "selfHouse") {
      let tableList = JSON.parse(JSON.stringify(selfHouseData));
      tableList.push(row);
      setSelfHouseData(tableList);
    }
  };

  // 删除
  const deleteRows = (_, record, type) => {
    if (type === "houseSettle") {
      let tableList = JSON.parse(JSON.stringify(houseSettleData));
      let index = tableList.findIndex((e) => {
        return e.key === record.key;
      });
      tableList.splice(index, 1);
      sethouseSettleData(tableList);
      computeTotal(tableList, "certified");
    }
    if (type === "unhouseSettle") {
      let tableList = JSON.parse(JSON.stringify(unhouseSettleData));
      let index = tableList.findIndex((e) => {
        return e.key === record.key;
      });
      tableList.splice(index, 1);
      setUnhouseSettleData(tableList);
      computeTotal(tableList, "noCertified");
    }
    if (type === "legal") {
      let tableList = JSON.parse(JSON.stringify(legalData));
      let index = tableList.findIndex((e) => {
        return e.key === record.key;
      });
      tableList.splice(index, 1);
      setlegalData(tableList);
      computeTotal(tableList, "legitimate");
    }
    if (type === "reformHouse") {
      let tableList = JSON.parse(JSON.stringify(reformHouseData));
      let index = tableList.findIndex((e) => {
        return e.key === record.key;
      });
      tableList.splice(index, 1);
      setReformHouseData(tableList);
      computeTotal(tableList, "reformHouse");
    }
    if (type === "selfHouse") {
      let tableList = JSON.parse(JSON.stringify(selfHouseData));
      let index = tableList.findIndex((e) => {
        return e.key === record.key;
      });
      tableList.splice(index, 1);
      setSelfHouseData(tableList);
      computeTotal(tableList, "selfBuilt");
    }
  };

  // 计算合计
  const computeTotal = (list, field) => {
    let total = 0;
    list.forEach((item) => (total += item.total));
    form.setFieldsValue({ [field]: Number(total.toFixed(2)) });
  };

  // 切换结构
  const changeStructure = (e, index, field, type) => {
    if (type === "houseSettle") {
      let rowList = JSON.parse(JSON.stringify(houseSettleData));
      rowList[index][field] = e;

      if (form.getFieldsValue().project_name) {
        let columnField = [];
        if (e === "框架") {
          columnField = ["frame_unitprice_yzzh", "percent_yzzh"];
        } else if (e === "砖混") {
          columnField = ["bconcrete_unitprice_yzzh", "percent_yzzh"];
        } else if (e === "砖木") {
          columnField = ["bwood_unitprice_yzzh", "percent_yzzh"];
        }
        let asset_id = "ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988";
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
          columnNames: columnField,
          sorts: [],
        };
        getDataWithSort(asset_id, queryForm).then((res) => {
          let resData = translatePlatformDataToJsonArray(res)[0];
          if (resData) {
            rowList[index].percent = resData.percent_yzzh;
            if (e === "框架") {
              rowList[index].price = resData.frame_unitprice_yzzh;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.frame_unitprice_yzzh *
                  resData.percent_yzzh
              );
            } else if (e === "砖混") {
              rowList[index].price = resData.bconcrete_unitprice_yzzh;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.bconcrete_unitprice_yzzh *
                  resData.percent_yzzh
              );
            } else if (e === "砖木") {
              rowList[index].price = resData.bwood_unitprice_yzzh;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.bwood_unitprice_yzzh *
                  resData.percent_yzzh
              );
            }
          }
          sethouseSettleData(rowList);
        });
      }

      let total = 0;
      rowList.forEach((item) => {
        total += item.total;
      });

      form.setFieldsValue({ certified: Number(total) });
    }
    if (type === "unhouseSettle") {
      let rowList = JSON.parse(JSON.stringify(unhouseSettleData));
      rowList[index][field] = e;

      if (form.getFieldsValue().project_name) {
        let columnField = [];
        if (e === "框架") {
          columnField = ["frame_unitprice_yzfzz", "percent_yzfzz"];
        } else if (e === "砖混") {
          columnField = ["bconcrete_unitprice_yzfzz", "percent_yzfzz"];
        } else if (e === "砖木") {
          columnField = ["bwood_unitprice_yzfzz", "percent_yzfzz"];
        }

        let asset_id = "ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988";
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
          columnNames: columnField,
          sorts: [],
        };
        getDataWithSort(asset_id, queryForm).then((res) => {
          let resData = translatePlatformDataToJsonArray(res)[0];
          if (resData) {
            rowList[index].percent = resData.percent_yzfzz;
            if (e === "框架") {
              rowList[index].price = resData.frame_unitprice_yzfzz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.frame_unitprice_yzfzz *
                  resData.percent_yzfzz
              );
            } else if (e === "砖混") {
              rowList[index].price = resData.bconcrete_unitprice_yzfzz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.bconcrete_unitprice_yzfzz *
                  resData.percent_yzfzz
              );
            } else if (e === "砖木") {
              rowList[index].price = resData.bwood_unitprice_yzfzz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.bwood_unitprice_yzfzz *
                  resData.percent_yzfzz
              );
            }
          }
          setUnhouseSettleData(rowList);
        });
      }

      let total = 0;
      rowList.forEach((item) => {
        total += item.total;
      });

      form.setFieldsValue({ noCertified: Number(total) });
    }
    if (type === "legal") {
      let rowList = JSON.parse(JSON.stringify(legalData));
      rowList[index][field] = e;

      rowList[index].total = 0;
      rowList[index].total = Number(
        rowList[index].area * rowList[index].price * rowList[index].percent
      );

      setlegalData(rowList);

      let total = 0;
      rowList.forEach((item) => {
        total += item.total;
      });
      form.setFieldsValue({ legitimate: Number(total) });
    }
    if (type === "reformHouse") {
      let rowList = JSON.parse(JSON.stringify(reformHouseData));
      rowList[index][field] = e;

      rowList[index].total = 0;
      rowList[index].total =
        rowList[index].area *
        rowList[index].price *
        rowList[index].percentCount;

      setReformHouseData(rowList);

      let total = 0;
      rowList.forEach((item) => {
        total += item.total;
      });
      form.setFieldsValue({ reformHouse: Number(total) });
    }
    if (type === "selfHouse") {
      let rowList = JSON.parse(JSON.stringify(selfHouseData));
      rowList[index][field] = e;

      if (form.getFieldsValue().project_name) {
        let columnField = [];
        if (e === "框架") {
          columnField = ["gy_frame_glbz", "gy_frame_jlbz"];
        } else if (e === "砖混") {
          columnField = ["gy_bconcrete_glbz", "gy_bconcrete_jlbz"];
        } else if (e === "砖木") {
          columnField = ["gy_bwood_glbz", "gy_bwood_jlbz"];
        } else if (e === "石木") {
          columnField = ["gy_stonewood_glbz", "gy_stonew_jlbz"];
        } else if (e === "木结构") {
          columnField = ["gy_wood_glbz", "gy_wood_jlbz"];
        } else if (e === "钢结构") {
          columnField = ["gy_steel_glbz", "gy_steel_jlbz"];
        } else if (e === "其它") {
          columnField = ["gy_other_glbz", "gy_other_jlbz"];
        }

        let asset_id = "ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988";
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
          columnNames: columnField,
          sorts: [],
        };
        getDataWithSort(asset_id, queryForm).then((res) => {
          let resData = translatePlatformDataToJsonArray(res)[0];
          if (resData) {
            if (e === "框架") {
              rowList[index].price = resData.gy_frame_glbz;
              rowList[index].percent = resData.gy_frame_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_frame_glbz *
                  resData.gy_frame_jlbz
              );
            } else if (e === "砖混") {
              rowList[index].price = resData.gy_bconcrete_glbz;
              rowList[index].percent = resData.gy_bconcrete_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_bconcrete_glbz *
                  resData.gy_bconcrete_jlbz
              );
            } else if (e === "砖木") {
              rowList[index].price = resData.gy_bwood_glbz;
              rowList[index].percent = resData.gy_bwood_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_bwood_glbz *
                  resData.gy_bwood_jlbz
              );
            } else if (e === "石木") {
              rowList[index].price = resData.gy_stonewood_glbz;
              rowList[index].percent = resData.gy_stonew_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_stonewood_glbz *
                  resData.gy_stonew_jlbz
              );
            } else if (e === "木结构") {
              rowList[index].price = resData.gy_wood_glbz;
              rowList[index].percent = resData.gy_wood_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_wood_glbz *
                  resData.gy_wood_jlbz
              );
            } else if (e === "钢结构") {
              rowList[index].price = resData.gy_steel_glbz;
              rowList[index].percent = resData.gy_steel_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_steel_glbz *
                  resData.gy_steel_jlbz
              );
            } else if (e === "其它") {
              rowList[index].price = resData.gy_other_glbz;
              rowList[index].percent = resData.gy_other_jlbz;
              rowList[index].total = Number(
                rowList[index].area *
                  resData.gy_other_glbz *
                  resData.gy_other_jlbz
              );
            }
          }
          setSelfHouseData(rowList);
        });
      }

      let total = 0;
      rowList.forEach((item) => {
        total += item.total;
      });
      form.setFieldsValue({ selfBuilt: total });
    }
  };

  return (
    <>
      {form.getFieldsValue().house_use === 1 && (
        <Form.Item label="有证住宅结算" labelCol={{ span: 2 }}>
          <Table
            style={{ marginBottom: "25px" }}
            dataSource={houseSettleData}
            columns={houseSettleColums}
            pagination={false}
            bordered
            footer={() => (
              <Button
                style={{ width: "100%" }}
                type="dashed"
                onClick={() => addRows("houseSettle")}
              >
                新增
              </Button>
            )}
          />
        </Form.Item>
      )}
      {form.getFieldsValue().house_use === 2 && (
        <Form.Item label="有证非住宅结算" labelCol={{ span: 2 }}>
          <Table
            style={{ marginBottom: "25px" }}
            dataSource={unhouseSettleData}
            columns={unhouseSettleColums}
            pagination={false}
            bordered
            footer={() => (
              <Button
                style={{ width: "100%" }}
                type="dashed"
                onClick={() => addRows("unhouseSettle")}
              >
                新增
              </Button>
            )}
          />
        </Form.Item>
      )}
      <Form.Item label="合法性认定面积结算" labelCol={{ span: 2 }}>
        <Table
          dataSource={legalData}
          columns={legalColumns}
          pagination={false}
          bordered
          footer={() => (
            <Button
              style={{ width: "100%" }}
              type="dashed"
              onClick={() => addRows("legal")}
            >
              新增
            </Button>
          )}
        />
      </Form.Item>
      <Form.Item label="住改非结算" labelCol={{ span: 2 }}>
        <Table
          style={{ marginBottom: "25px" }}
          dataSource={reformHouseData}
          columns={reformHouseColums}
          pagination={false}
          bordered
          footer={() => (
            <Button
              style={{ width: "100%" }}
              type="dashed"
              onClick={() => addRows("reformHouse")}
            >
              新增
            </Button>
          )}
        />
      </Form.Item>
      <Form.Item label="无证自建房结算" labelCol={{ span: 2 }}>
        <Table
          style={{ marginBottom: "25px" }}
          dataSource={selfHouseData}
          columns={selfHouseColums}
          pagination={false}
          bordered
          footer={() => (
            <Button
              style={{ width: "100%" }}
              type="dashed"
              onClick={() => addRows("selfHouse")}
            >
              新增
            </Button>
          )}
        />
      </Form.Item>
      {/* 表单 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="有证住宅合计" name="certified">
            <Input disabled={true} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="有证非住宅合计" name="noCertified">
            <Input disabled={true} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="合法性认定合计" name="legitimate">
            <Input disabled={true} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="住改非合计" name="reformHouse">
            <Input disabled={true} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="无证自建房合计" name="selfBuilt">
            <Input disabled={true} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default forwardRef(PropertyRight);
