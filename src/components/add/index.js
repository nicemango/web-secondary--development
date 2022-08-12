import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

import moment from "moment";
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import SelectModal from "../SelectModal";
import { queryAssetDataById } from "../../common/service/asset";
import { queryFormAssetData } from "../../common/service/jdbc-asset";

const Add = ({
  data,
  onChange,
  formConfig,
  component,
  configuration: propsConfiguration,
  eventCenter,
  componentCenter,
}) => {
  const [form] = Form.useForm();
  const state2 = useRef(data);
  const [state, setState] = useState(data);
  const [value, setValue] = useState(data);
  let [configuration, setConfiguration] = useState({});

  useEffect(() => {
    try {
      console.log("zzh 解析propsConfiguration", JSON.parse(propsConfiguration));
      setConfiguration(JSON.parse(propsConfiguration));
    } catch (error) {
      console.error("zzh configuration解析错误", error);
    }
  }, []);

  const triggerEventCenter = async (targetValue) => {
    await eventCenter.triggerEventNew({
      objectId: formConfig?.id,
      componentId: component.id,
      type: "report",
      event: "change",
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

  // ADD态

  console.log("zzh  ADD", {
    data,
    onChange,
    formConfig,
    component,
    configuration: propsConfiguration,
    eventCenter,
    componentCenter,
  });

  console.log("zzh  ADD  configuration", configuration);

  const {
    option_asset_id: assetId,
    option_value_column: valueColumn,
    option_label_column: labelColumn,
    option_asset_show_columns,
  } = configuration;

  console.log("zzh a", assetId);

  let formId = formConfig?.id || "1bc845215d2345b09ce466ff7f80eeba";

  const [selectValue, setSelectValue] = useState();
  let dataSource = [];
  let [tableData, setTableData] = useState([]);
  let [loading, setLoading] = useState(false);
  let [tableColumns, setTableColumns] = useState([]);
  let keyIndex = "";
  let valueIndex = "";

  //逻辑控制
  const handleChange = (value, optionData) => {
    onChange(value);
    triggerEventCenter("change", value);
    state2.current = value;
    setValue(value);
  };

  const saveSelectModal = (value) => {
    console.log("zzh 选中值", value);
    setValue(value);
  };

  console.log("👿👿👿 组件渲染", selectValue);

  useEffect(() => {
    try {
      setLoading(true);
      if (assetId) {
        loadData();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [assetId]);
  const loadData = async () => {
    try {
      const { data: assetSource } = await queryAssetDataById(assetId, {
        useCache: true,
        cacheDuration: 2 * 60 * 1000,
      });
      tableColumns = assetSource[0].map((ele) => ({
        dataIndex: ele.col_name,
        title: ele.col_alias ?? ele.col_name,
        col_datatype: ele.col_datatype,
        render: (text) => {
          if (ele.col_datatype === 5) {
            return <span>{moment(text).format("YYYY-MM-DD")}</span>;
          } else if (ele.col_datatype === 6) {
            return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>;
          }
          return <span>{text}</span>;
        },
      }));
      setTableColumns(tableColumns);
      const { data: assetSource1 } = await queryFormAssetData(
        assetId,
        formId,
        [],
        undefined,
        {
          useCache: true,
          cacheDuration: 2000,
        }
        // conditionList
      );
      console.log(assetSource1);
      assetSource1[1].map((ele) => {
        let obj = {};
        tableColumns.map((item, i) => {
          obj[item.dataIndex] = ele[i];
        });
        setTableColumns(tableColumns);
        obj.key = obj[valueColumn];
        tableData.push(obj);
        setTableData([...tableData]);
      });
      assetSource[0].map((ele, index) => {
        if (valueColumn === ele.col_name) {
          keyIndex = index;
        }
        if (labelColumn === ele.col_name) {
          valueIndex = index;
        }
      });
      assetSource[1].map((ele) => {
        let obj = {};
        tableColumns.map((item, i) => {
          obj[item.dataIndex] = ele[i];
        });
        obj.key = obj[valueColumn];
        dataSource.push({
          value: ele[keyIndex],
          label: ele[valueIndex],
        });
      });
    } catch (error) {}
  };
  console.log("zzh tableData", tableData);
  console.log("zzh tableColumns", tableColumns);

  return (
    <SelectModal
      // id={selectId}
      dataSource={tableData}
      tableColumns={tableColumns}
      modalTitle="基本信息"
      value={value}
      saveSelectModal={saveSelectModal}
      onChange={handleChange}
      allowClear={true}
      valueColumn={valueColumn}
      labelColumn={labelColumn}
      block={{
        optionAssetShowColumns: option_asset_show_columns,
        valueColumn,
      }}
      loading={loading}
    />
  );
};

Add.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Add;
