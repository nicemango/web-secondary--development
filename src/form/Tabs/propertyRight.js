// 产权调换情况
import React, { useState, useEffect } from "react";
import { Form, Input, Col, Row, Button, Table } from "antd";
import { ProfileOutlined } from '@ant-design/icons';

import './tabs.less'

const PropertyRight = () => {

   const [key, setKey] = useState(-1)
   const [dataList, setDataList] = useState([])

   const columns = [
      {
        title: '小区名称',
        dataIndex: 'community_name',
        key: 'community_name',
        align: 'center',
        render: (_, record) => <Input type="number"></Input>,
      },
      {
        title: '栋号',
        dataIndex: 'building_number',
        key: 'building_number',
        align: 'center',
        render: (_, record) => <Input type="number"></Input>,
      },
      {
        title: '单元',
        dataIndex: 'unit_number',
        key: 'unit_number',
        align: 'center',
        render: (_, record) => <Input type="number"></Input>,
      },
      {
         title: '楼层',
         dataIndex: 'floor_number',
         key: 'floor_number',
         align: 'center',
         render: (_, record) => <Input type="number"></Input>,
      },
      {
         title: '房号',
         dataIndex: 'room_number',
         key: 'room_number',
         align: 'center',
         render: (_, record) => <Input type="number"></Input>,
      },
      {
         title: '建筑面积',
         dataIndex: 'construction_area',
         key: 'construction_area',
         align: 'center',
         render: (_, record) => <Input type="number"></Input>,
      },
      {
         title: '套内面积',
         dataIndex: 'set_area',
         key: 'set_area',
         align: 'center',
         render: (_, record) => <Input type="number"></Input>,
      },
      {
         title: '操作',
         key: "handle",
         align: 'center',
         render: (_, record, key) => <Button type="link" onClick={ () => deleteRows(_, record, key)}>删除</Button>
      },
   ];

   useEffect( () => {
   },[])

   // 新增
   const addRows = () => {
      let rowKey = JSON.parse(JSON.stringify(key));
      let tableList = JSON.parse(JSON.stringify(dataList))
      let row = {
         key: ++rowKey,
         community_name: '',
         building_number: '',
         unit_number: '',
         floor_number: '',
         room_number: '',
         construction_area: '',
         set_area: '',
      }
      tableList.push(row)
      setDataList(tableList)
      setKey(rowKey)
   }
   // 删除
   const deleteRows = (_, record, key) => {
      let tableList = JSON.parse(JSON.stringify(dataList))

      let index = tableList.findIndex( (e) => {
         return e.key === key;
      });
      tableList.splice(index, 1)
      setDataList(tableList)
   }

   return (
      <>
         <Form labelCol={{ span: 8 }}>
            {/* 按钮组 */}
            <Form.Item style={{ marginBottom: '40px' }}>
               <Row gutter={16}>
                  <Col span={6}>
                     <Button type="primary">选房</Button>
                  </Col>
               </Row>
            </Form.Item>
            {/* 第一行 */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
               <Col span={6}>
                  <Form.Item label="期房面积" name="qifang_area">
                     <Input type="number"/>
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item label="选房面积" name="selected_room_area">
                     <Input type="number"/>
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item label="选房合计面积" name="selected_room_area_total">
                     <Input type="number"/>
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item label="合计选房套内面积" name="selected_room_inArea_total">
                     <Input type="number"/>
                  </Form.Item>
               </Col>
            </Row>
            {/* 表格 */}
            <Table dataSource={ dataList } columns={ columns } pagination={false} bordered footer={ () => (<Button style={{ width: '100%' }} type="dashed" onClick={ () => addRows() }>新增</Button>) }/>
            {/* 标题 */}
            <div className='title_public'><ProfileOutlined /> 超安补差</div>
            {/* 列表 */}
            <div style={{ padding: '20px'}}>
               <Row gutter={16}>
                  <Col span={8}>
                     <Form.Item label="超安面积(0-10㎡)" name="overarea_0">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="单价" name="overarea_0price">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="超安10合计" name="overarea_0total">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={8}>
                     <Form.Item label="超安面积(10-20㎡)" name="overarea_10">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="单价" name="overarea_10price">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="超安20合计" name="overarea_10total">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={8}>
                     <Form.Item label="超安面积(20㎡以上)" name="overarea_20">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="单价" name="overarea_20price">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
                  <Col span={8}>
                     <Form.Item label="超安30合计" name="overarea_20total">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
               </Row>
               <Row gutter={16}>
                  <Col span={8}>
                     <Form.Item label="乙方应付甲方(元)" name="partyb_to_a">
                        <Input type="number"/>
                     </Form.Item>
                  </Col>
               </Row>
            </div>
         </Form>
      </>
   )
}

export default PropertyRight
