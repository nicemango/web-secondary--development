// 装修附属
import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Form,
  InputNumber,
  Col,
  Row,
  Divider,
  Select,
  Input,
  Button,
  Table,
  Upload,
  Card,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
// 引入接口方法
import { getDataWithSort } from "../api/asset";
// 引入eventBus
import { handleUploadData } from "./enclosure";

const { TextArea } = Input;
const { Option } = Select;

export const translatePlatformDataToJsonArray = (originTableData) => {
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

export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const handleListSum = (list, keyName) => {
  list = list?.map((item) => item[keyName])?.filter(Boolean);
  if (!list?.length) return null;
  return list.reduce((p, n) => p + n);
};

const Renovation = (props, ref) => {
  const { form } = props;

  // 工程名称列表
  const [appurtenanceList, setAppurtenanceList] = useState([]);
  const [attachedList, setAttachedList] = useState([]);

  // 装修工程量测量记录表
  const [assessAmountColumns, setAssessAmountColumns] = useState([]);
  const [assessAmountTableData, setAssessAmountTableData] = useState([]);

  // 附属工程量测量记录表
  const [auxiliaryRealQuantityColumns, setAuxiliaryRealQuantityColumns] =
    useState([]);
  const [auxiliaryRealQuantityTableData, setAuxiliaryRealQuantityTableData] =
    useState([]);

  useImperativeHandle(ref, () => ({
    assessAmountTableData,
    auxiliaryRealQuantityTableData,
  }));

  // 评估报告跳转ID
  const [skipId, setSkipId] = useState("");

  // 获取装修包干单价
  const getContractUnit = async () => {
    let queryForm = {
      distinct: true,
      filters: [
        {
          datatype: 0,
          column: "project_name",
          compareObj: form.getFieldsValue().project_name,
          satisfy_type: 0,
          varibleType: "components",
          type: 4,
        },
      ],
      columnNames: ["gy_decorate_price"],
      sorts: [],
      loadFilters: [],
    };
    const { data } = await getDataWithSort(
      "ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988",
      queryForm
    );

    if (data) return data?.[1]?.[0]?.[0] ?? 0;
  };

  // 设置装修包干金额
  const setDecorateBaogan = async () => {
    const contractUnit = await getContractUnit();
    form.setFieldsValue({
      decorate_baogan: contractUnit * (form.getFieldsValue().zz_areaTotal ?? 0),
    });
    setTotalAmount();
  };

  // 获取装修评估金额
  const getDecoratePingu = async () => {
    let queryForm = {
      distinct: true,
      filters: [
        {
          datatype: 0,
          column: "project_name",
          compareObj: form.getFieldsValue().project_name,
          satisfy_type: 0,
          varibleType: "components",
          type: 4,
        },
        {
          datatype: 0,
          column: "house_id",
          compareObj: form.getFieldsValue().house_id,
          satisfy_type: 0,
          varibleType: "components",
          type: 4,
        },
      ],
      columnNames: ["decorate_money"],
      sorts: [],
      loadFilters: [],
    };
    const { data } = await getDataWithSort(
      "db23c3f3-cf31-77d0-ff95-180084df0f59",
      queryForm
    );
    if (data) return data?.[1]?.[0]?.[0] ?? 0;
  };

  // 获取附属评估金额
  const getCompensationAmount = async () => {
    let queryForm = {
      distinct: true,
      filters: [
        {
          datatype: 0,
          column: "project_name",
          compareObj: form.getFieldsValue().project_name,
          satisfy_type: 0,
          varibleType: "components",
          type: 4,
        },
        {
          datatype: 0,
          column: "house_id",
          compareObj: form.getFieldsValue().house_id,
          satisfy_type: 0,
          varibleType: "components",
          type: 4,
        },
      ],
      columnNames: ["fs_zje"],
      sorts: [],
      loadFilters: [],
    };
    const { data } = await getDataWithSort(
      "db23c3f3-cf31-77d0-ff95-180084df0f59",
      queryForm
    );
    if (data) return data?.[1]?.[0]?.[0] ?? 0;
  };

  // 获取报告评估ID  skipID
  const getAndSetSkipID = async () => {
    let queryForm = {
      distinct: true,
      filters: [
        {
          datatype: 0,
          column: "house_id",
          compareObj: form.getFieldsValue().house_id,
          satisfy_type: 0,
          varibleType: "components",
          type: 4,
        },
      ],
      columnNames: ["data_id"],
      sorts: [],
      loadFilters: [],
    };
    const { data } = await getDataWithSort(
      "db23c3f3-cf31-77d0-ff95-180084df0f59",
      queryForm
    );
    setSkipId(data?.[1]?.[0]?.[0]);
  };

  // 设置装修评估金额
  const setDecoratePingu = async () => {
    const decorate_pingu = await getDecoratePingu();
    form.setFieldsValue({ decorate_pingu });
    setTotalAmount();
  };

  // 设置附属评估金额
  const setCompensationAmount = async () => {
    const compensation_amount = await getCompensationAmount();
    form.setFieldsValue({ compensation_amount });
    setTotalAmount();
  };

  // 设置装修实量金
  const setRealQuantityAmountTotal = () => {
    const decoration_amount = handleListSum(
      assessAmountTableData,
      "estimated_total_price"
    );
    form.setFieldsValue({ decoration_amount });
    setTotalAmount();
  };

  // 设置附属装修实量金
  const setAuxiliaryRealQuantityAmountTotal = () => {
    const attached_shi = handleListSum(
      auxiliaryRealQuantityTableData,
      "estimated_total_price"
    );
    form.setFieldsValue({ attached_shi });
    setTotalAmount();
  };

  // 设置装修附属合计补偿金额
  const setTotalAmount = () => {
    Promise.resolve().then(() => {
      const data = form.getFieldsValue([
        "decorate_baogan",
        "decoration_amount",
        "attached_shi",
        "decorate_pingu",
        "compensation_amount",
      ]);
      const values = Object.values(data)?.filter(Boolean);
      if (values?.length) {
        const total_amount = values.reduce((p, n) => p + n);
        form.setFieldsValue({ total_amount });
      }
    });
  };

  // 获取工程名称列表
  const getAndSetAppurtenanceList = async () => {
    let queryForm = {
      distinct: true,
      filters: [],
      columnNames: [
        "decoration_appurtenance_name",
        "unit",
        "unit_price",
        "price_min",
        "price_max",
      ],
      sorts: [],
      loadFilters: [],
    };
    try {
      const res = await getDataWithSort(
        "818bd818-8902-4e5b-e06b-cc7dd7913183",
        queryForm
      );
      if (res?.data)
        setAppurtenanceList(translatePlatformDataToJsonArray(res) || []);
      const res1 = await getDataWithSort(
        "7b4c1a92-63c1-6d0f-cd5e-a78650e482eb",
        queryForm
      );
      if (res?.data)
        setAttachedList(translatePlatformDataToJsonArray(res1) || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if (props.propsDataList.childData) {
    //   let poopsData = JSON.parse(JSON.stringify(props.propsDataList.childData));
    //   let assessAmountArray = [];
    //   let auxiliaryRealArray = [];

    //   poopsData.forEach((item) => {
    //     // 装修工程量测量记录表
    //     if (item.gy_sign_decorate) {
    //       if (item.gy_sign_decorate.length > 0) {
    //         item.gy_sign_decorate.forEach((e) => {
    //           let propsObj = {};
    //           for (let key in e) {
    //             if (e[key]["label"]) {
    //               propsObj[key] = e[key]["value"];
    //             } else {
    //               propsObj[key] = e[key];
    //             }
    //           }
    //           propsObj.key = propsObj.data_id;
    //           assessAmountArray.push(propsObj);
    //         });
    //       }
    //     }
    //     // 附属工程量测量记录表
    //     if (item.gy_sign_attached) {
    //       if (item.gy_sign_attached.length > 0) {
    //         item.gy_sign_attached.forEach((e) => {
    //           let propsObj = {};
    //           for (let key in e) {
    //             if (e[key]["label"]) {
    //               propsObj[key] = e[key]["value"];
    //             } else {
    //               propsObj[key] = e[key];
    //             }
    //           }
    //           propsObj.key = propsObj.data_id;
    //           assessAmountArray.push(propsObj);
    //         });
    //       }
    //     }
    //   });
    //   setAssessAmountTableData(assessAmountArray);
    //   setAuxiliaryRealQuantityTableData(auxiliaryRealArray);
    // }

    getAndSetAppurtenanceList();
  }, []);

  useEffect(() => {
    if (form.getFieldsValue().house_id) {
      getAndSetSkipID();
    }
  }, [form.getFieldsValue().house_id]);

  useEffect(() => {
    if (form.getFieldsValue().project_name && form.getFieldsValue().house_id) {
      setCompensationAmount();
      setDecoratePingu();
    }
  }, [
    form.getFieldsValue().project_name,
    form.getFieldsValue().house_id,
    setCompensationAmount,
    getDecoratePingu,
  ]);

  useEffect(() => {
    if (form.getFieldsValue().project_name) {
      setDecorateBaogan();
    }
  }, [form.getFieldsValue().project_name, setDecorateBaogan]);

  useEffect(() => {
    createTableColumn("assess");
    setRealQuantityAmountTotal();
  }, [assessAmountTableData]);

  useEffect(() => {
    createTableColumn("auxiliary");
    setAuxiliaryRealQuantityAmountTotal();
  }, [auxiliaryRealQuantityTableData]);

  const changeRenovation = (e) => {
    const { setFieldsValue } = form;
    switch (e) {
      case 1:
        setFieldsValue({
          decoration_amount: "",
          attached_shi: "",
          decorate_pingu: "",
          compensation_amount: "",
        });
        break;
      case 2:
        setFieldsValue({
          decorate_baogan: "",
          decorate_pingu: "",
          compensation_amount: "",
        });
        break;
      case 3:
        setFieldsValue({
          decorate_baogan: "",
          decoration_amount: "",
          attached_shi: "",
        });
        break;

      default:
        break;
    }
  };

  // 装修选择
  const RenovationSelectMod = useMemo(() => {
    const OPTION_DATA_DICT = [
      {
        key: 1,
        value: 1,
        name: "装修包干",
      },
      {
        key: 2,
        value: 2,
        name: "装修实量",
      },
      {
        key: 3,
        value: 3,
        name: "装修评估",
      },
    ];

    return (
      <Col span={6}>
        <Form.Item label="装修选择" name="renovationSelect" initialValue={1}>
          <Select onChange={changeRenovation}>
            {OPTION_DATA_DICT.map((item) => {
              return (
                <Option key={item.key} value={item.value}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Col>
    );
  }, []);

  // 装修包干金额
  const ContractAmountMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.renovationSelect !== currentValues.renovationSelect
        }
      >
        {({ getFieldsValue }) =>
          getFieldsValue("renovationSelect") === 1 ? (
            <Col span={6}>
              <Form.Item label="装修包干金额" name="decorate_baogan">
                <Input readOnly="readonly" />
              </Form.Item>
            </Col>
          ) : null
        }
      </Form.Item>
    );
  }, []);

  // 装修实量金额
  const RealQuantityAmountMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.renovationSelect !== currentValues.renovationSelect
        }
      >
        {({ getFieldsValue }) =>
          getFieldsValue("renovationSelect") === 2 ? (
            <Col span={6}>
              <Form.Item label="装修实量金额" name="decoration_amount">
                <Input readOnly="readonly" />
              </Form.Item>
            </Col>
          ) : null
        }
      </Form.Item>
    );
  }, []);

  // 附属实量金额
  const AuxiliaryRealQuantityAmountMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.renovationSelect !== currentValues.renovationSelect
        }
      >
        {({ getFieldsValue }) =>
          getFieldsValue("renovationSelect") === 2 ? (
            <Col span={6}>
              <Form.Item label="附属实量金额" name="attached_shi">
                <Input readOnly="readonly" />
              </Form.Item>
            </Col>
          ) : null
        }
      </Form.Item>
    );
  }, []);

  // 装修评估金额
  const AssessAmountMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.renovationSelect !== currentValues.renovationSelect
        }
      >
        {({ getFieldsValue }) =>
          getFieldsValue("renovationSelect") === 3 ? (
            <Col span={6}>
              <Form.Item label="装修评估金额" name="decorate_pingu">
                <Input readOnly="readonly" />
              </Form.Item>
            </Col>
          ) : null
        }
      </Form.Item>
    );
  }, []);

  // 附属评估金额
  const AuxiliaryAssessAmountMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.renovationSelect !== currentValues.renovationSelect
        }
      >
        {({ getFieldsValue }) =>
          getFieldsValue("renovationSelect") === 3 ? (
            <Col span={6}>
              <Form.Item label="附属评估金额" name="compensation_amount">
                <Input readOnly="readonly" />
              </Form.Item>
            </Col>
          ) : null
        }
      </Form.Item>
    );
  }, []);

  // 备注
  const RemarksMod = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item label="备注" name="decoration_remark">
          <Input />
        </Form.Item>
      </Col>
    );
  }, []);

  // 装修附属合计补偿金额
  const TotalAmountMod = useMemo(() => {
    return (
      <Col span={6}>
        <Form.Item
          initialValue={0}
          label="装修附属合计补偿金额"
          name="total_amount"
        >
          <InputNumber min={0} step={1.0} precision={2} disabled={true} />
        </Form.Item>
      </Col>
    );
  }, []);

  // 评估报告
  const AssessmentReportBtn = useMemo(() => {
    const openWindow = () => {
      window.open(
        `${window.location.origin}/form/application/detail?view_id=ddbd2600d5624524b7c3105a88bf7ddc&form_id=623eadc8354646da965f629948403f47&id=${skipId}`
      );
    };
    return (
      <Col span={6}>
        <Button onClick={openWindow} type="primary">
          评估报告
        </Button>
      </Col>
    );
  }, [skipId]);

  // 计算星号出现的次数
  const calcTimes = (str) => {
    let index = str.indexOf("*");
    let times = 0;
    while (index !== -1) {
      times++;
      index = str.indexOf("*", index + 1);
    }
    return times;
  };

  // 单位对应的星号数
  const unitCorrespondingStar = (unit) => {
    switch (unit) {
      case "平方米":
        return 1;
      case "立方米":
        return 2;
      default:
        return 0;
    }
  };

  // 根据测量数据计算总价
  const calcTotalPriceAccordDecorate = (
    record,
    tableData,
    setFn,
    updateTableDataValue
  ) => {
    const { decorate_data, unit } = record;
    const data = decorate_data || "";
    // eslint-disable-next-line no-useless-escape
    const arr = data.split(/\+|\-/);
    const multipLength = Math.max(...arr.map((_) => calcTimes(_)));
    if (unitCorrespondingStar(unit) !== multipLength) {
      message.warn("请输入相对应的计算式");
      return;
    }
    let engineering_total = 0;
    try {
      // eslint-disable-next-line no-eval
      engineering_total = eval(decorate_data);
    } catch (error) {
      message.warn("请输入相对应的计算式");
      return;
    }
    calcTotalPrice(record, tableData, setFn, updateTableDataValue);
    updateTableDataValue(
      record,
      "engineering_total",
      tableData,
      setFn,
      engineering_total
    );
  };

  // 直接计算总价 工程量 * 单价
  const calcTotalPrice = (record, tableData, setFn, updateTableDataValue) => {
    const { engineering_total, evaluation_unit_price } = record;
    const estimated_total_price = Number(
      (Number(engineering_total) * Number(evaluation_unit_price)).toFixed(2)
    );
    updateTableDataValue(
      record,
      "estimated_total_price",
      tableData,
      setFn,
      estimated_total_price
    );
  };

  // 设置记录表配置
  const createTableColumn = async (type) => {
    const columnsList = [
      {
        label: "工程名称",
        field: "decorate_name",
        type: "0",
        modeType: "select",
      },
      {
        label: "工程名称",
        field: "decorate_name",
        type: "-1",
        modeType: "select",
        flag: true,
      },
      { label: "Z单位", field: "unit", type: "1", modeType: "input" },
      { label: "F单位", field: "unit", type: "2", modeType: "input" },
      {
        label: "Z测量数据",
        field: "decorate_data",
        type: "3",
        modeType: "input",
      },
      {
        label: "F测量数据",
        field: "decorate_data",
        type: "4",
        modeType: "input",
      },
      {
        label: "Z工程量",
        field: "engineering_total",
        type: "5",
        modeType: "input",
      },
      {
        label: "F工程量",
        field: "engineering_total",
        type: "6",
        modeType: "input",
      },
      {
        label: "Z单价",
        field: "evaluation_unit_price",
        type: "7",
        modeType: "input",
      },
      {
        label: "F单价",
        field: "evaluation_unit_price",
        type: "8",
        modeType: "input",
      },
      {
        label: "单价最小值",
        field: "min_price",
        type: "9",
        modeType: "numberInput",
      },
      {
        label: "单价最大值",
        field: "max_price",
        type: "10",
        modeType: "numberInput",
      },
      {
        label: "Z总价",
        field: "estimated_total_price",
        type: "11",
        modeType: "numberInput",
      },
      {
        label: "F总价",
        field: "estimated_total_price",
        type: "12",
        modeType: "numberInput",
      },
      {
        label: "图片上传",
        field: "upload_photos",
        type: "13",
        modeType: "upload",
      },
      {
        label: "备注",
        field: "decorate_remark",
        type: "14",
        modeType: "input",
      },
    ];

    const updateTableDataValue = (record, field, tableData, setFn, value) => {
      const { id } = record;
      setFn(
        tableData.map((item) => {
          if (item.id === id) item[field] = value;
          return item;
        })
      );
    };

    const renderMods = {
      input: (text, record, field, tableData, setFn) => {
        const onChange = (e) => {
          updateTableDataValue(record, field, tableData, setFn, e.target.value);
        };
        const onBlur = () => {
          if (field === "decorate_data") {
            calcTotalPriceAccordDecorate(
              record,
              tableData,
              setFn,
              updateTableDataValue
            );
          } else if (field === "engineering_total") {
            if (!record.decorate_data) {
              const estimated_total_price = Number(
                (
                  Number(record.engineering_total) *
                  record.evaluation_unit_price
                ).toFixed(2)
              );
              updateTableDataValue(
                record,
                "estimated_total_price",
                tableData,
                setFn,
                estimated_total_price
              );
            } else {
              calcTotalPriceAccordDecorate(
                record,
                tableData,
                setFn,
                updateTableDataValue
              );
            }
          } else if (field === "evaluation_unit_price") {
            const unitPrice = Number(record.evaluation_unit_price);
            const { min_price, max_price } = record;
            if (
              ((min_price && unitPrice >= min_price) || !min_price) &&
              ((max_price && unitPrice <= max_price) || !max_price)
            ) {
              calcTotalPrice(record, tableData, setFn, updateTableDataValue);
            } else {
              message.warn("单价的值应在单价最小值和单价最大值之间！");
            }
          }
        };
        return (
          <Input
            value={text}
            disabled={field === "engineering_total" && record.decorate_data}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
      },
      numberInput: (text, record, field, tableData, setFn) => {
        const onChange = (value) => {
          updateTableDataValue(record, field, tableData, setFn, value);
        };
        return (
          <InputNumber
            value={text}
            min={0}
            step={1.0}
            precision={2}
            onChange={onChange}
            type="number"
          />
        );
      },
      select: (text, record, field, tableData, setFn, type = false) => {
        const list = type ? attachedList : appurtenanceList;
        const onChange = (value, option) => {
          record.unit = list[option.key]?.unit;
          record.evaluation_unit_price =
            list[option.key]?.unit_price || list[option.key]?.price_max;
          record.min_price = list[option.key]?.price_min;
          record.max_price = list[option.key]?.price_max;
          updateTableDataValue(record, field, tableData, setFn, value);
        };
        return (
          <Select
            showSearch
            onChange={onChange}
            value={text}
            style={{ width: 180 }}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {list.map((item, index) => {
              return (
                <Option key={index} value={item.decoration_appurtenance_name}>
                  {item.decoration_appurtenance_name}
                </Option>
              );
            })}
          </Select>
        );
      },
      upload: (list, record, field, tableData, setFn) => {
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>添加图片</div>
          </div>
        );

        const onChange = (e) => {
          updateTableDataValue(
            record,
            field,
            tableData,
            setFn,
            handleUploadData(e)
          );
        };

        return (
          <Upload
            action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
            listType="picture-card"
            fileList={list}
            onChange={onChange}
          >
            {list.length > 10 ? null : uploadButton}
          </Upload>
        );
      },
    };

    if (type === "assess") {
      const showType = ["0", "1", "3", "5", "7", "9", "10", "11", "13", "14"];
      const columns = columnsList
        ?.filter((item) => showType.includes(item.type))
        ?.map((item) => {
          return {
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: "center",
            render: (text, record) =>
              renderMods[item.modeType](
                text,
                record,
                item.field,
                assessAmountTableData,
                setAssessAmountTableData
              ),
          };
        });
      columns.push({
        title: "操作",
        dataIndex: "action",
        key: "action",
        align: "center",
        render: (text, record) => {
          const onDelete = () => {
            const { id } = record;
            setAssessAmountTableData(
              assessAmountTableData?.filter((item) => item.id !== id)
            );
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
      });
      setAssessAmountColumns(columns);
    } else if (type === "auxiliary") {
      const showType = ["-1", "2", "4", "6", "8", "9", "10", "12", "13", "14"];
      const columns = columnsList
        ?.filter((item) => showType.includes(item.type))
        ?.map((item) => {
          return {
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: "center",
            render: (text, record) =>
              renderMods[item.modeType](
                text,
                record,
                item.field,
                auxiliaryRealQuantityTableData,
                setAuxiliaryRealQuantityTableData,
                item.type === "-1" ? true : false
              ),
          };
        });
      columns.push({
        title: "操作",
        dataIndex: "action",
        key: "action",
        align: "center",
        render: (text, record) => {
          const onDelete = () => {
            const { id } = record;
            setAuxiliaryRealQuantityTableData(
              auxiliaryRealQuantityTableData?.filter((item) => item.id !== id)
            );
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
      });
      setAuxiliaryRealQuantityColumns(columns);
    }
  };

  const addRows = (type) => {
    let row = {
      id: uuid(),
      decorate_name: "",
      unit: "",
      decorate_data: "",
      engineering_total: "",
      evaluation_unit_price: "",
      min_price: 0,
      max_price: 0,
      estimated_total_price: "",
      upload_photos: [],
      decorate_remark: "",
    };
    if (type === "assess") {
      setAssessAmountTableData([...assessAmountTableData, row]);
    } else if (type === "auxiliary") {
      setAuxiliaryRealQuantityTableData([
        ...auxiliaryRealQuantityTableData,
        row,
      ]);
    }
  };

  // 装修工程量测量记录表
  const AssessAmountTable = useMemo(() => {
    return (
      <Form.Item label="装修工程量测量记录表" labelCol={{ span: 2 }}>
        <Table
          rowKey="id"
          style={{ marginBottom: "25px" }}
          dataSource={assessAmountTableData}
          columns={assessAmountColumns}
          pagination={false}
          bordered
          footer={() => (
            <Button
              style={{
                width: "100%",
              }}
              type="dashed"
              onClick={() => addRows("assess")}
            >
              新增
            </Button>
          )}
        />
      </Form.Item>
    );
  }, [assessAmountColumns, assessAmountTableData, addRows]);

  // 附属工程量测量记录表
  const AuxiliaryAmountTable = useMemo(() => {
    return (
      <Form.Item label="附属工程量测量记录表" labelCol={{ span: 2 }}>
        <Table
          rowKey="id"
          style={{ marginBottom: "25px" }}
          dataSource={auxiliaryRealQuantityTableData}
          columns={auxiliaryRealQuantityColumns}
          pagination={false}
          bordered
          footer={() => (
            <Button
              style={{
                width: "100%",
              }}
              type="dashed"
              onClick={() => addRows("auxiliary")}
            >
              新增
            </Button>
          )}
        />
      </Form.Item>
    );
  }, [auxiliaryRealQuantityTableData, auxiliaryRealQuantityColumns, addRows]);

  // 补偿金额
  const OtherMod = useMemo(() => {
    return (
      <>
        <Col span={24}>
          <Form.Item label="补偿金额" name="qt_money">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="备注" name="other_compensation">
            <TextArea />
          </Form.Item>
        </Col>
      </>
    );
  }, []);

  return (
    <>
      {/* 第一行 */}
      <Row gutter={16}>{RenovationSelectMod}</Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第二行 */}
      <Row gutter={16}>
        {ContractAmountMod}
        {RealQuantityAmountMod}
        {AuxiliaryRealQuantityAmountMod}
        {AssessAmountMod}
        {AuxiliaryAssessAmountMod}
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第三行 */}
      <Row gutter={16}>
        {RemarksMod}
        {TotalAmountMod}
        {AssessmentReportBtn}
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 记录表 */}
      {AssessAmountTable}
      {AuxiliaryAmountTable}
      <Divider style={{ marginTop: 0 }} />
      {/* 其他事项 */}
      <Card type="inner" title="其他补偿事项">
        {OtherMod}
      </Card>
    </>
  );
};

export default forwardRef(Renovation);
