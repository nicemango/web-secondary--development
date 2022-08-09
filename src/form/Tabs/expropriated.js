// 被征收人信息
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Col,
  Row,
  Divider,
  Select,
  Cascader,
  Radio,
  message,
} from "antd";
// 引入接口方法
import {
  queryAssetById,
  getProvinceArea,
  getAreaByParent,
  getDataWithSort,
} from "../api/asset";
// 引入eventBus
import eventbus from "../api/eventBus";
// 引入qs
import qs from "querystringify";

const Expropriated = (props) => {
  const { Option } = Select;
  const { form } = props;

  const [houseIDList, setHouseIDList] = useState([]);
  const [provinceAreaList, setProvinceAreaList] = useState([]);

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

  const handleClick = (checkData) => {
    props.click(checkData.value);
    zz_areaTotal_count();
  };

  useEffect(() => {
    // 获取房屋编号
    getAllData();

    eventbus.on("initHouseId", () => {
      eventbus.emit("getHouseId", form.getFieldsValue().house_id || null);
    });
  }, []);

  // 初始化页面数据
  const getAllData = () => {
    // 获取项目名称
    if (
      !qs.parse(window.location.search).data_id &&
      qs.parse(window.location.search).project_name
    ) {
      form.setFieldsValue({
        project_name: qs.parse(window.location.search).project_name,
      });
    }
    // 获取实际居住地
    getAreaSelectData();
    // 房屋编号查询条件
    let queryForm = {
      distinct: true,
      filterGroupList: [
        {
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
        },
      ],
      columnNames: ["house_id"],
      sorts: [],
      loadFilters: [],
    };
    // 获取房屋编号数据
    queryAssetById(
      "184560aa-1985-01d9-b97e-578368cda381",
      "d67d3b0da081404c84cbe522bbdf125a",
      queryForm
    ).then((res) => {
      let resArray = [];
      let resData = translatePlatformDataToJsonArray(res);

      resData.forEach((item) => {
        resArray.push(item.house_id);
      });
      setHouseIDList(resArray);
    });
  };

  // 实际居住地一级菜单
  const getAreaSelectData = () => {
    getProvinceArea().then((res) => {
      res.data.forEach((item) => {
        item.isLeaf = false;
      });
      setProvinceAreaList(res.data);
    });

    form.setFieldsValue({
      actual_address_qycj: "贵州省/贵阳市",
    });
  };

  // 动态加载级联选择器
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    getAreaByParent(targetOption.id).then((res) => {
      targetOption.children = res.data;
      targetOption.loading = false;
      setProvinceAreaList([...provinceAreaList]);
    });
  };

  // 表单校验
  const inputRules = (type) => {
    if (type === "ID") {
      return {
        pattern:
          /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/,
        message: "请输入正确的身份证号",
      };
    } else if (type === "phone") {
      return { pattern: /^1[0-9]{10}/, message: "请输入正确的手机号" };
    }
  };

  // 房屋编号切换
  const change_house_id = (value) => {
    eventbus.emit("getHouseId", value); // hrf
    let queryForm = {
      filters: [
        {
          column: "house_id",
          datatype: 0,
          type: 4,
          varibleType: "components",
          compareObj: value,
          satisfy_type: 0,
        },
      ],
      columnNames: [
        "actual_address_xxdz",
        "idcard",
        "housing_co_owner",
        "phone",
        "legal_representative",
        "area_total_two",
        "housing_co_owner_idcard",
        "certificate_for_uscc",
        "name",
      ],
      sorts: [],
    };
    getDataWithSort("184560aa-1985-01d9-b97e-578368cda381", queryForm).then(
      (res) => {
        let resData = translatePlatformDataToJsonArray(res)[0];
        form.setFieldsValue({
          actual_address_xxdz: resData.actual_address_xxdz,
          idcard: resData.idcard,
          housing_co_owner: resData.housing_co_owner,
          phone: resData.phone,
          legal_representative: resData.legal_representative,
          area_tatal_two: resData.area_total_two || 0,
          housing_co_owner_idcard: resData.housing_co_owner_idcard,
          certificate_for_uscc: resData.certificate_for_uscc,
          name: resData.name,
        });
        if (form.getFieldsValue().area_tatal_two) {
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
              {
                column: "house_id",
                datatype: 0,
                type: 4,
                varibleType: "components",
                compareObj: value,
                satisfy_type: 0,
              },
            ],
            columnNames: ["area_total_two"],
            sorts: [],
          };
          getDataWithSort(
            "184560aa-1985-01d9-b97e-578368cda381",
            queryForm
          ).then((res) => {
            let resData = translatePlatformDataToJsonArray(res)[0];
            if (resData && resData.area_total_two) {
              if (
                resData.area_total_two !== form.getFieldsValue().area_tatal_two
              ) {
                message.warning("房屋面积与现场查勘面积不相符");
              }
            } else {
              message.warning("房屋面积与现场查勘面积不相符");
            }
          });
        }
      }
    );
  };

  // 被征收人类型切换, 设置隐藏组件值
  const change_richman_type = (value) => {
    if (value !== "承租人") {
      form.setFieldsValue({
        special_signing_bonus: 20000,
        special_moving_reward: 3000,
      });
    } else {
      form.setFieldsValue({
        special_signing_bonus: 0,
        special_moving_reward: 0,
      });
    }
    value === "个人"
      ? form.setFieldsValue({
          protocal_type: 1,
        })
      : value === "单位"
      ? form.setFieldsValue({
          protocal_type: 2,
        })
      : value === "承租人"
      ? form.setFieldsValue({
          protocal_type: 3,
        })
      : form.setFieldsValue({
          protocal_type: "",
        });
  };

  // 应安面积计算
  const ya_area_count = () => {
    let azf = form.getFieldsValue().gt_xs_azf || 0;
    let zhengzai = form.getFieldsValue().zhengzaitaonei_area || 0;
    if (azf && zhengzai) {
      form.setFieldsValue({
        ya_area: zhengzai * (1 + azf),
      });
    }
  };

  // 证载合法面积计算
  const zz_areaTotal_count = () => {
    let zhengzai = form.getFieldsValue().zhengzai_area || 0;
    let hefa = form.getFieldsValue().hefa_area || 0;
    form.setFieldsValue({
      zz_areaTotal: zhengzai + hefa,
    });
    // 内容改变触发
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
    // F1, F4, F7, 2, 5, 8 计算
    getDataWithSort("ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988", queryForm).then(
      (res) => {
        let resData = translatePlatformDataToJsonArray(res)[0];
        if (resData) {
          let _countData = {
            sum: form.getFieldsValue().zz_areaTotal,
            fzzdjbq: resData.non_residential_hb,
            fzzcsbq: resData.non_residential_hb_times,
            zzdjbq: resData.residential_hb,
            zzcsbq: resData.residential_hb_times,
            cqdjbq: resData.residential_cq,
            cqcsbq: resData.residential_cq_times,
            fzzdjaz: resData.non_azresidential_hb,
            fzzcsaz: resData.non_azresidential_hb_times,
            zzdjaz: resData.azresidential_hb,
            zzcsaz: resData.azresidential_hb_times,
            cqdjaz: resData.azresidential_cq,
            cqcsaz: resData.azresidential_cq_times,
            fzzdjbz: resData.non_2azresidential_hb,
            fzzcsbz: resData.non_2azresidential_hb_times,
            zzdjbz: resData["2azresidential_hb"],
            zzcsbz: resData["2azresidential_hb_times"],
            cqdjbz: resData["2azresidential_cq"],
            cqcsbz: resData["2azresidential_cq_times"],
            yamj: form.getFieldsValue().ya_area,
          };
          if (
            form.getFieldsValue().house_use === 1 &&
            form.getFieldsValue().placement_method === "货币补偿"
          ) {
            form.setFieldsValue({
              hb_relocation_total:
                _countData.fzzdjbq * _countData.fzzcsbq * _countData.sum,
              hb_resettlement_total:
                _countData.fzzdjaz * _countData.fzzcsaz * _countData.sum,
              "2hb_resettlement_total":
                _countData.fzzdjbz * _countData.fzzcsbz * _countData.sum,
              zzhb_relocation_total: 0,
              zzhb_resettlement_total: 0,
              "2zzhb_resettlement_total": 0,
            });
          } else {
            form.setFieldsValue({
              hb_relocation_total: 0,
              hb_resettlement_total: 0,
              "2hb_resettlement_total": 0,
              zzhb_relocation_total:
                _countData.zzdjbq * _countData.zzcsbq * _countData.sum,
              zzhb_resettlement_total:
                _countData.zzdjaz * _countData.zzcsaz * _countData.sum,
              "2zzhb_resettlement_total":
                _countData.zzdjbz * _countData.zzcsbz * _countData.sum,
            });
          }
        }
      }
    );
  };

  // 切换房屋用途
  const change_house_use = () => {};

  return (
    <>
      {/* 第一行 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="项目名称" name="project_name">
            <Input disabled={true} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="房屋编号" name="house_id">
            <Select
              onChange={(value, e) => {
                change_house_id(value, e);
              }}
            >
              {houseIDList &&
                houseIDList.map((item, index) => {
                  return (
                    item && (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    )
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="被征收人类型" name="richman_type">
            <Select
              onChange={(value, e) => {
                change_richman_type(value, e);
              }}
            >
              <Option value="个人">个人</Option>
              <Option value="单位">单位</Option>
              <Option value="承租人">承租人</Option>
            </Select>
          </Form.Item>
        </Col>
        {}
        <Col span={6}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.richman_type !== currentValues.richman_type
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("richman_type") === "承租人" ? (
                <Form.Item label="承租编号" name="house_id_czr">
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第二行 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="被征收人"
            name="name"
            rules={[{ required: true, message: "必填" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="身份证号"
            name="idcard"
            rules={[() => inputRules("ID")]}
          >
            <Input maxLength={18} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="手机"
            name="phone"
            rules={[() => inputRules("phone")]}
          >
            <Input maxLength={11} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="婚姻状况" name="marital_status">
            <Select>
              <Option value="1">已婚</Option>
              <Option value="2">未婚</Option>
              <Option value="3">离异</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {/* 第三行 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.marital_status !== currentValues.marital_status
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("marital_status") === "已婚" ||
              getFieldValue("marital_status") === "1" ? (
                <Form.Item label="配偶姓名" name="po_name">
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.marital_status !== currentValues.marital_status
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("marital_status") === "已婚" ||
              getFieldValue("marital_status") === "1" ? (
                <Form.Item
                  label="配偶身份证号"
                  name="po_idcard"
                  rules={[() => inputRules("ID")]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第四行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="遗产继承人" name="inheritor">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="身份证号"
            name="inheritor_idcard"
            rules={[() => inputRules("ID")]}
          >
            <Input maxLength={18} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="继承人电话"
            name="jcr_phone"
            rules={[() => inputRules("phone")]}
          >
            <Input maxLength={11} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="房屋共有权人" name="housing_co_owner">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="身份证号"
            name="housing_co_owner_idcard"
            rules={[() => inputRules("ID")]}
          >
            <Input maxLength={18} />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第五行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="委托代理人" name="entrusted_agent">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="身份证号"
            name="entrusted_agent_idcard"
            rules={[() => inputRules("ID")]}
          >
            <Input maxLength={18} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="手机"
            name="entrusted_agent_phone"
            rules={[() => inputRules("phone")]}
          >
            <Input maxLength={11} />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第六行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="法定代表人" name="legal_representative">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="统一社会信用代码" name="certificate_for_uscc">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="法定代表人电话"
            name="fddb_phone"
            rules={[() => inputRules("phone")]}
          >
            <Input maxLength={11} />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第七行 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="实际居住地" name="actual_address_qycj">
            <Cascader
              options={provinceAreaList}
              loadData={loadData}
              fieldNames={{ value: "id", label: "name", children: "children" }}
              changeOnSelect
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="房屋坐落" name="actual_address_xxdz">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第八行 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="房屋用途"
            name="house_use"
            rules={[{ required: true, message: "必填" }]}
          >
            <Radio.Group onChange={(value) => change_house_use(value.target)}>
              <Radio value={1}>住宅</Radio>
              <Radio value={2}>非住宅</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="安置方式"
            name="placement_method"
            rules={[{ required: true, message: "必填" }]}
          >
            <Radio.Group onChange={(value) => handleClick(value.target)}>
              <Radio value="货币补偿">货币补偿</Radio>
              <Radio value="产权调换">产权调换</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第九行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="产权证类别" name="property_class">
            <Select>
              <Option value="1">合法性认定</Option>
              <Option value="2">产权证</Option>
              <Option value="3">村镇建设规划许可证</Option>
              <Option value="4">临时施工通知书</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证号" name="property_no">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="房屋总面积(㎡)" name="area_tatal_two">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证载建筑面积㎡" name="zhengzai_area">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
              onChange={() => {
                zz_areaTotal_count();
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证载套内面积" name="zhengzaitaonei_area">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
              onChange={() => {
                ya_area_count();
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第十行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="合法性认定面积(㎡)" name="hefa_area">
            <InputNumber
              min={0}
              step={1.0}
              precision={2}
              style={{ width: "100%" }}
              onChange={() => {
                zz_areaTotal_count();
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.placement_method !== currentValues.placement_method
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("placement_method") === "产权调换" ? (
                <Form.Item label="原房屋公摊系数" name="gt_xs_yfw">
                  <InputNumber
                    min={0}
                    step={0.000001}
                    precision={6}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.placement_method !== currentValues.placement_method
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("placement_method") === "产权调换" ? (
                <Form.Item label="安置房公摊系数" name="gt_xs_azf">
                  <InputNumber
                    min={0}
                    step={0.000001}
                    precision={6}
                    style={{ width: "100%" }}
                    onChange={() => {
                      ya_area_count();
                    }}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="11应安面积㎡" name="ya_area">
            <InputNumber
              precision={2}
              style={{ width: "100%" }}
              disabled={true}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证载和合法面积总计" name="zz_areaTotal">
            <InputNumber
              precision={2}
              style={{ width: "100%" }}
              disabled={true}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="protocal_type">
            <Input disabled={true} style={{ display: "none" }}></Input>
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
    </>
  );
};

export default Expropriated;
