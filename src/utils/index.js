import intl from "react-intl-universal";
const regAll = /<select(\S|\s)+?<\/select>/g;
const reg = /<select(\S|\s)+?<\/select>/;
const getDefaultValues = (data, _data) => {
  console.log(data, _data);
  let newData = {};
  const setValues = (data, values) => {
    values.forEach((item) => {
      if (item !== "childData") {
        const __data = getAllComponentsMap(data).find(
          (_item) => _item?.id === item
        );
        const name = __data?.assetColumnList?.[0]?.col_name;
        newData[name || item] = __data?.show_in_config
          ? {
              label: __data?.columnStyle?.title,
              value: _data[item],
            }
          : _data[item];
      } else {
        newData[item] = _data[item].map((item, index) => {
          const _obj = {};
          Object.keys(item).forEach((key) => {
            const __data =
              getAllComponentsMap(data).find((_item) => _item?.id === key) ||
              [];
            _obj[__data?.asset_name] = item[key].map((value, index) =>
              getDefaultValues(__data?.child_table_children, value)
            );
          });
          return _obj;
        });
      }
    });
  };
  setValues(data, Object.keys(_data));
  return newData;
};

const getSaveDefaultValues = (data, _data, flag, _flag) => {
  const childrenColumnList = [];
  const masterColumnList = [];
  const setValues = (data, values) => {
    values.forEach((item) => {
      if (item !== "childData") {
        const __data = getAllComponentsMap(data).find(
          (_item) => _item?.assetColumnList[0]?.col_name === item
        );
        if (__data?.show_in_config) {
          let obj = {
            asset_id: __data?.assetColumnList[0]?.asset_id,
            col_datatype: __data?.assetColumnList[0]?.col_datatype,
            col_name: __data?.assetColumnList[0]?.col_name,
            col_value: _data[item],
          };
          masterColumnList.push(obj);
        }
      } else {
        _data[item].forEach((key) => {
          Object.keys(key).forEach((item) => {
            const child = getAllComponentsMap(data).find(
              (_item) => _item?.asset_name === item
            );
            let obj = {
              id: child?.id,
              columnList: key[item].map((_key) => {
                const _obj =
                  getSaveDefaultValues(
                    child?.child_table_children,
                    _key,
                    flag,
                    true
                  )?.masterColumnList || [];
                return _obj;
              }),
            };
            childrenColumnList.push(obj);
          });
        });
      }
    });

    if (flag && _flag) {
      masterColumnList.push({
        col_name: "data_id",
        col_value: _data.data_id,
        col_datatype: 0,
        asset_id: masterColumnList[0]?.asset_id,
      });
      masterColumnList.push({
        col_name: "parent_id",
        col_value: _data.parent_id,
        col_datatype: 0,
        asset_id: masterColumnList[0]?.asset_id,
      });
    }
  };
  setValues(data, Object.keys(_data), flag);
  if (flag) {
    masterColumnList.push({
      col_name: "data_id",
      col_value: _data.data_id,
      asset_id: masterColumnList[0]?.asset_id,
      col_datatype: 0,
    });
    return {
      childrenColumnList,
      masterColumnList,
      queryCondition: {
        queryParams: [
          {
            colName: "data_id",
            type: 2,
            value: _data.data_id,
          },
        ],
      },
    };
  }
  return {
    childrenColumnList,
    masterColumnList,
  };
};

const formatError = (error) => {
  let message = "";
  const result = error.data.result[0];
  error.data.result.map((res) => {
    if (res.reason === "3") {
      if (!result.errorMessage.length) {
        message = intl.get("COMM.DSVF").d("数据标准校验失败！");
      } else {
        let errorMessage = result.errorMessage.length
          ? JSON.parse(result.errorMessage[0])
          : [];
        errorMessage.values.map((item) => {
          errorMessage.content = errorMessage.content.replace(reg, item);
        });
        message = errorMessage.content.replace(regAll, "");
      }
    } else if (res.reason === "2") {
      message = message + intl.get("COMM.UVNS") + res.noPassColNames.join(",");
    } else if (res.reason === "1") {
      message = message + intl.get("COMM.RVNM") + res.noPassColNames.join(",");
    } else if (res.reason === "4") {
      message = message + intl.get("COMM.RCNS") + res.noPassColNames.join(",");
    } else if (res.reason === "5") {
      message = message + intl.get("COMM.MVNM") + res.noPassColNames.join(",");
    } else if (res.reason === "6") {
      message = message + intl.get("COMM.DVNM") + res.noPassColNames.join(",");
    }
  });
  return `<span>${message}</span>`;
};

const ErrorCode = {
  10120019: "该组件实例不存在",
  10010003: "未选择资产",
  10010004: "您无权访问该填报绑定的资产",
  10130000: "数据标准校验不通过",
  10130001: "数据绑定映射配置有误",
  10130002: "填报组件绑定的字段在数据库中不存在",
  10130003: "找不到外键",
  10130004: "找不到填报多选组件或子表组件绑定的资产的主键",
  10130005: "填报组件绑定的字段在数据库中不存在",
  10130006: "组件绑定的字段有误",
  10130007: "填报id不存在",
  10130008: "视图id不存在",
  10130009: "数据校验失败",
  10130010: "不支持的资产类型",
  10130011: "导出数据长度超过32767",
  10130012: "找不到资产",
  10130013: "导入数据的模板不符合要求",
  // '10130014': '',
  10130015: "更新填报数据时，id不可为空",
  10130016: "关联的填报不是同一个数据源",
  10130017: "数据不可为null",
  10130018: "多选组件传值有误",
  10130021: "弹窗选择或编辑子表选择的视图不可为空且不包含弹窗选择或编辑子表",
  10130023: "查询不到表单创建人字段",
  10130024: "填报时间不在时间限制内",
  10130025: "组件集合必须绑定同源的资产",
  20130000: "查询看板配置失败",
  20130001: "看板模式查询组分页查询参数错误",
  20130002: "看板模式未能查询到分组字段",
  20130003: "卡片模式分组参数查询失败",
  10130026: "文书模板不可为空",
  10130027: "无权访问数据",
  10130032: "多选框配置不正确",
  10130045: "存储字段的值唯一时必须使用关系型数据库，且必须和主表资产同源",

  // license错误校验
  100000008: "错误的lic文件",
  100000009: "超过最大实例限制",
  100000010: "无权限访问",
  100000011: "license已经到期",
  100000012: "mac地址错误",
  100000013: "错误的lic类型",
  100000007: "saas模式不支持更新license,请联系管理员",
  10130030: "应用配置有误，请联系应用配置人员处理",
  10130035: "数据库配置与填报配置不一致",
  10130038: "",
  10130039: "错误的数据id",
  10130040: "数据选项绑定的资产和主表资产非同源",
  // 添加错误提示
  10130043: "业务流生成的填报不能在填报设计中编辑",

  // /flow/instance/apply
  // /flow/instance/handleAndModify
  // /flow/instance/handle4Form
  10140011: "插入数据节点执行失败",
  10140012: "更新数据节点执行失败",
  10140013: "批量更新节点执行失败",
  10140014: "批量插入节点执行失败",
  10140015: "表单回填节点执行失败",
  10140016: "新增变量节点执行失败",
  10140017: "更新变量节点执行失败",
  10140018: "删除数据节点执行失败",
  10140019: "数据服务节点执行失败",
  10140020: "服务节点执行失败",
  10140021: "查询数据节点执行失败",
  10140022: "批量查询节点执行失败",
  10140023: "restful节点执行失败",
  10140024: "站内信节点执行失败",
  10140025: "短信节点执行失败",
  10140026: "邮件节点执行失败",
  10140027: "触发数据流节点执行失败",
  10140028: "触发业务流节点执行失败",
  10140029: "无符合条件的走向",
  10140030: "业务实例不存在",
  10140033: "rest接口可以调通，但接口内部返回错误",

  10140006: "流程已停用",

  100000018: "存在非法字符",
  10020004: "数据源不存在",

  10160001: "流程死循环",
  10010014: "资产查询失败",
  10010015: "参数有误",
  10010016: "此模块只分析数值型字段数超过2的资产",
};
const getAllComponentsMap = (componentsMap) => {
  let childrenMap = [];
  const getComponentsMap = (data) => {
    data.forEach((item) => {
      if (Array.isArray(item)) {
        getComponentsMap(item);
      } else {
        childrenMap.push(item);
        if (item.children) {
          getComponentsMap(item.children);
        }
      }
    });
  };
  if (componentsMap) {
    Object.keys(componentsMap).forEach((id) => {
      if (componentsMap[id]?.children) {
        getComponentsMap(componentsMap[id]?.children);
      }
    });
  }

  return [...componentsMap, ...childrenMap];
};

export { getDefaultValues, getSaveDefaultValues, formatError, ErrorCode };
