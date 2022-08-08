// 被征收人信息
import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Col, Row, Divider, Select, Cascader, Radio, message } from "antd";
// 引入接口方法
import { queryAssetById, getProvinceArea, getAreaByParent, getDataWithSort } from '../api/asset'
// 引入eventBus
import eventbus from '../api/eventBus'
// 引入qs
import qs from 'querystringify'

const Expropriated = (props) => {
  const { Option } = Select;

  const [form] = Form.useForm();

  const [projectNameList, setProjectNameList] = useState([]);
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
  }
  
  const handleClick = (checkData) => {
    props.click(checkData.value)
  }

  useEffect( () => {
    eventbus.on('resetSubsidy', () => {
      if(form.getFieldValue().richman_type) {
        if(form.getFieldValue().richman_type !== '承租人') {
          let obj = {
            moveReward: 30000,
            signingReward: 20000
          }
          eventbus.emit('richmanType', obj)
        } else {
          let obj = {
            moveReward: 0,
            signingReward: 0
          }
          eventbus.emit('richmanType', obj)
        }
      } else {
        eventbus.emit('richmanType', null)
      }
      
    })

    eventbus.on('resetCompensate', () => {
      if(form.getFieldValue().house_use) {
        if(form.getFieldValue().house_use === 1) {
          eventbus.emit('houseUse', 1)
        } else {
          eventbus.emit('houseUse', 2)
        }
      } else {
        eventbus.emit('houseUse', null)
      }
    })

    // 获取项目名称信息
    getProjectData()
    // 获取实际居住地
    getAreaSelectData()
  },[])

  // 获取项目名称数据
  const getProjectData = () => {
    // let form_id = qs.parse(window.location.search).formid
    let formId = "d67d3b0da081404c84cbe522bbdf125a"
    let assetId = "5e263506-8afa-7646-2277-1734e04bcc08"
    let queryForm = {
      distinct: true,
      filterGroupList: [{ filters: [] }],
      columnNames: [ "project_name" ],
      sorts: [],
      loadFilters: [{
        column: "project_name",
        type: 4,
        compareObj: "审核项目"
      }]
    }
    queryAssetById(assetId, formId, queryForm).then( (res) => {
      let resArray = []
      let resData = translatePlatformDataToJsonArray(res)

      resData.forEach( (item) => { resArray.push(item.project_name) })
      setProjectNameList(resArray)
      // 获取房屋编号数据
      getHouseIdData()
    })
  }
  
  // 获取房屋编号数据
  const getHouseIdData = () => {
    // let form_id = qs.parse(window.location.search).formid
    let formId = "d67d3b0da081404c84cbe522bbdf125a"
    let assetId = "184560aa-1985-01d9-b97e-578368cda381"
    let queryForm = {
      distinct: true,
      filterGroupList: [{
        filters: [{
          datatype: 0,
          column: "project_name",
          compareObj: "审核项目",
          satisfy_type: 0,
          varibleType: "components",
          type: 4
        }]
      }],
      columnNames: ['house_id'],
      sorts: [],
      loadFilters: []
    }

    queryAssetById(assetId, formId, queryForm).then( (res) => {
      let resArray = []
      let resData = translatePlatformDataToJsonArray(res)

      resData.forEach( (item) => { resArray.push(item.house_id) })
      setHouseIDList(resArray)
    })
  }

  // 实际居住地一级菜单
  const getAreaSelectData = () => {
    getProvinceArea().then( (res) => {
      res.data.forEach( (item) => { item.isLeaf = false })
      setProvinceAreaList(res.data)
    })
  }

  // 动态加载级联选择器
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    
    getAreaByParent(targetOption.id).then( (res) => {
      targetOption.children = res.data
      targetOption.loading = false;
      setProvinceAreaList([...provinceAreaList]);
    })
  };

  // 表单校验
  const inputRules = (type) => {
    if(type === 'ID') {
      return { pattern:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/, message:'请输入正确的身份证号' }
    } else if(type === 'phone') {
      return { pattern:/^1[0-9]{10}/, message:'请输入正确的手机号' }
    }
  }

  // 房屋编号切换
  const change_house_id = (value) => {
    let queryForm = {
      filters: [
        {
          column: "house_id",
          datatype: 0,
          type: 4,
          varibleType: "components",
          compareObj: value,
          satisfy_type: 0
        }
      ],
      columnNames: ["actual_address_xxdz", "idcard", "housing_co_owner", "phone", "legal_representative", "area_total_two", "housing_co_owner_idcard", "certificate_for_uscc","name"],
      sorts: []
    }
    getDataWithSort('184560aa-1985-01d9-b97e-578368cda381', queryForm).then( (res) => {
      let resData = translatePlatformDataToJsonArray(res)[0]
      form.setFieldsValue({
        actual_address_xxdz: resData.actual_address_xxdz,
        idcard: resData.idcard,
        housing_co_owner: resData.housing_co_owner,
        phone: resData.phone,
        legal_representative: resData.legal_representative,
        area_tatal_two: resData.area_total_two,
        housing_co_owner_idcard: resData.housing_co_owner_idcard,
        certificate_for_uscc: resData.certificate_for_uscc,
        name: resData.name,
      });
      if(form.getFieldValue().area_tatal_two) {
        let queryForm = {
          filters: [
            {
              column: "project_name",
              datatype: 0,
              type: 4,
              varibleType: "components",
              compareObj: form.getFieldValue().project_name,
              satisfy_type: 0
            },
            {
              column: "house_id",
              datatype: 0,
              type: 4,
              varibleType: "components",
              compareObj: value,
              satisfy_type: 0
            }
          ],
          columnNames: ["area_total_two"],
          sorts: []
        }
        getDataWithSort('184560aa-1985-01d9-b97e-578368cda381', queryForm).then( (res) => {
          let resData = translatePlatformDataToJsonArray(res)[0]
          if(resData && resData.area_total_two) {
            if(resData.area_total_two !== form.getFieldValue().area_tatal_two) {
              message.warning('房屋面积与现场查勘面积不相符');
            }
          } else {
            message.warning('房屋面积与现场查勘面积不相符');
          }
        })
      }
    })
  }

  // 被征收人类型切换
  const change_richman_type = (value) => {
    if(value !== '承租人') {
      let obj = {
        moveReward: 30000,
        signingReward: 20000
      }
      eventbus.emit('richmanType', obj)
    }
  }

  // 房屋用途切换
  const change_house_use = (checkData) => {
    console.log('checkData', checkData.value)
    eventbus.emit('houseUse', checkData.value)
  }
  
  // 应安面积计算
  const ya_area_count = () => {
    let azf = form.getFieldValue().gt_xs_azf || 0
    let zhengzai = form.getFieldValue().zhengzaitaonei_area || 0
    form.setFieldsValue({
      ya_area: zhengzai * (1 + azf)
    })
  }

  // 证载合法面积计算
  const zz_areaTotal_count = () => {
    let zhengzai = form.getFieldValue().zhengzai_area || 0
    let hefa = form.getFieldValue().hefa_area || 0
    form.setFieldsValue({
      zz_areaTotal: zhengzai + hefa
    })
    if(form.getFieldValue().zz_areaTotal) {
      let queryForm = {
        filters: [
          {
            column: "project_name",
            datatype: 0,
            type: 4,
            varibleType: "components",
            compareObj: form.getFieldValue().project_name,
            satisfy_type: 0
          },
        ],
        columnNames: ["non_residential_hb", "non_residential_hb_times", "residential_hb", "residential_hb_times", "residential_cq", "residential_cq_times", "non_azresidential_hb", "non_azresidential_hb_times", "azresidential_hb", "azresidential_hb_times", "azresidential_cq", "azresidential_cq_times", "non_2azresidential_hb", "non_2azresidential_hb_times", "2azresidential_hb", "2azresidential_hb_times", "2azresidential_cq", "2azresidential_cq_times" ],
        sorts: []
      }
      getDataWithSort('ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988', queryForm).then( (res) => {
        // let resData = translatePlatformDataToJsonArray(res)
        if(form.getFieldValue().house_use === 1 && form.getFieldValue().placement_method === '货币补偿') {
          let obj = {
            _F1: '',
            _F4: '',
            _F7: '',
            _2: 0,
            _5: 0,
            _8: 0,
          }
          eventbus.emit('zz_areaTotal', obj)
        } else {
          let obj = {
            _F1: '',
            _F4: '',
            _F7: '',
            _2: '',
            _5: '',
            _8: '',
          }
          eventbus.emit('zz_areaTotal', obj)
        }
      })
    }
  }

  return (
    <Form name="expropriated" form={ form } autoComplete="off">
      {/* 第一行 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="项目名称" name="project_name">
            <Select disabled={ true } defaultValue={"审核项目"}>
              {
                projectNameList && projectNameList.map( (item, index) => {
                  return( item && <Option key={ index } value={ item }>{ item }</Option> )
                })
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="房屋编号" name="house_id">
            <Select onChange={ (value, e) => { change_house_id(value, e) }}>
              {
                houseIDList && houseIDList.map( (item, index) => {
                  return( item && <Option key={ index } value={ item }>{ item }</Option> )
                })
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="被征收人类型" name="richman_type">
            <Select onChange={ (value, e) => { change_richman_type(value, e) }}>
              <Option value="个人">个人</Option>
              <Option value="单位">单位</Option>
              <Option value="承租人">承租人</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.richman_type !== currentValues.richman_type}>
            {
              ({ getFieldValue }) => getFieldValue('richman_type') === '承租人' ? (
                <Form.Item label="承租编号" name="house_id_czr"><Input /></Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第二行 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="被征收人" name="name" rules={[{ required: true, message: '必填'}]}><Input /></Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="身份证号" name="idcard" rules={[ () => inputRules('ID') ]}><Input maxLength={ 18 }/></Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="手机" name="phone" rules={[ () => inputRules('phone') ]}><Input maxLength={ 11 }/></Form.Item>
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
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.marital_status !== currentValues.marital_status}>
            {
              ({ getFieldValue }) => getFieldValue('marital_status') === '1' ? (
                <Form.Item label="配偶姓名" name="po_name"><Input /></Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.marital_status !== currentValues.marital_status}>
            { 
              ({ getFieldValue }) => getFieldValue('marital_status') === '1' ? (
                <Form.Item label="配偶身份证号" name="po_idcard"><Input /></Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第四行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="遗产继承人" name="inheritor"><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="身份证号" name="inheritor_idcard" rules={[ () => inputRules('ID') ]}><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="继承人电话" name="jcr_phone" rules={[ () => inputRules('ID') ]}><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="房屋共有权人" name="housing_co_owner"><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="身份证号" name="housing_co_owner_idcard" rules={[ () => inputRules('ID') ]}><Input /></Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第五行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="委托代理人" name="entrusted_agent"><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="身份证号" name="entrusted_agent_idcard" rules={[ () => inputRules('ID') ]}><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="手机" name="entrusted_agent_phone" rules={[ () => inputRules('phone') ]}><Input maxLength={ 11 }/></Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第六行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="法定代表人" name="legal_representative"><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="统一社会信用代码" name="certificate_for_uscc"><Input /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="法定代表人电话" name="fddb_phone"><Input /></Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第七行 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="实际居住地" name="actual_address_qycj">
            <Cascader options={ provinceAreaList } loadData={loadData} fieldNames={{ value: 'id', label: 'name', children: 'children'}} changeOnSelect />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="房屋坐落" name="actual_address_xxdz">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第八行 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="房屋用途" name="house_use" rules={[{ required: true, message: '必填'}]}>
            <Radio.Group onChange={ (value) => change_house_use(value.target) }>
              <Radio value={1}>住宅</Radio>
              <Radio value={2}>非住宅</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="安置方式" name="placement_method" rules={[{ required: true, message: '必填'}]}>
            <Radio.Group onChange={ (value) => handleClick(value.target) }>
              <Radio value="货币补偿">货币补偿</Radio>
              <Radio value="产权调换">产权调换</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第九行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="产权证类别" name="property_class">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证号" name="property_no">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="房屋总面积(㎡)" name="area_tatal_two">
            <Input readOnly/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证载建筑面积㎡" name="zhengzai_area">
            <InputNumber style={{ width: '100%' }} onChange={ () => { zz_areaTotal_count() }}/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证载套内面积" name="zhengzaitaonei_area">
            <InputNumber style={{ width: '100%' }} onChange={ () => { ya_area_count() }}/>
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
      {/* 第十行 */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="合法性认定面积(㎡)" name="hefa_area">
            <InputNumber style={{ width: '100%' }} onChange={ () => { zz_areaTotal_count() }}/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.placement_method !== currentValues.placement_method}>
            {
              ({ getFieldValue }) => getFieldValue('placement_method') === '产权调换' ? (
                <Form.Item label="原房屋公摊系数" name="gt_xs_yfw">
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.placement_method !== currentValues.placement_method}>
            {
              ({ getFieldValue }) => getFieldValue('placement_method') === '产权调换' ? (
                <Form.Item label="安置房公摊系数" name="gt_xs_azf">
                  <InputNumber style={{ width: '100%' }} onChange={ () => { ya_area_count() }}/>
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="11应安面积㎡" name="ya_area">
            <Input disabled={true}/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="证载和合法面积总计" name="zz_areaTotal">
            <Input disabled={true}/>
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0}}/>
    </Form>
  );
};

export default Expropriated;