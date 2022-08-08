// 货币补偿
import React, { useState, useEffect } from "react";
import { Input, Table, Button, Form, Row, Col } from 'antd'
import eventbus from '../api/eventBus'

const PropertyRight = () => {

   let [housePurpose, setHousePurpose] = useState(null)

   // 有证住宅结算
   const [certifiedKey, setCertifiedKey] = useState(0)
   const [certified, setCertified] = useState([])
   const [certifiedData, setCertifiedData] = useState([])
   // 无证住宅结算.
   const [noCertifiedKey, setNoCertifiedKey] = useState(0)
   const [noCertified, setNoCertified] = useState([])
   const [noCertifiedData, setNoCertifiedData] = useState([])
   // 合法性认定面积结算
   const [legitimateKey, setLegitimateKey] = useState(0)
   const [legitimate, setLegitimate] = useState([])
   const [legitimateData, setLegitimateData] = useState([])
   // 住改非结算
   const [reformHouseKey, setReformHouseKey] = useState(0)
   const [reformHouse, setReformHouse] = useState([])
   const [reformHouseData, setReformHouseData] = useState([])
   // 无证自建房结算
   const [selfBuiltKey, setSelfBuiltKey] = useState(0)
   const [selfBuilt, setSelfBuilt] = useState([])
   const [selfBuiltData, setSelfBuiltData] = useState([])

   useEffect( () => {
      eventbus.on('houseUse', (type) => {
         setHousePurpose(type)
      })
      eventbus.emit('resetCompensate', null)

      createTableColumn('certified')
      createTableColumn('noCertified')
      createTableColumn('legitimate')
      createTableColumn('reformHouse')
      createTableColumn('selfBuilt')
   },[])

   const createTableColumn = (type) => {
      let columnsList = [
         { label: '结构', field: 'structure', type: '0'},
         { label: '面积(㎡)', field: 'structure', type: '0'},
         { label: '评估单价', field: 'price', type: '1'},
         { label: '上浮百分比', field: 'percent', type: '2'},
         { label: '百分比计算', field: 'percentCount', type: '3'},
         { label: '工料补助单价(元)', field: 'materials', type: '4'},
         { label: '工料补助单价(元)', field: 'rewardPrice', type: '4'},
         { label: '合计', field: 'total', type: '0'},
      ]
      if(type === 'certified' || type === 'noCertified' || type === 'legitimate') {
         let tableColumn = []
         columnsList.forEach( (item) => {
            if(item.type === '0' || item.type === '1' || item.type === '2') {
               tableColumn.push(item)
            }
         })
         type === 'certified' 
         ? setCertified(tableColumn.map( (item, index) => ({
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: 'center',
            render: (_, record) => <Input type="number"></Input>,
         })))
         : type === 'noCertified' 
         ? setNoCertified(tableColumn.map( (item, index) => ({
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: 'center',
            render: (_, record) => <Input type="number"></Input>,
         })))
         : setLegitimate(tableColumn.map( (item, index) => ({
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: 'center',
            render: (_, record) => <Input type="number"></Input>,
         })))
      }
      if(type === 'reformHouse') {
         let tableColumn = []
         columnsList.forEach( (item) => {
            if(item.type === '0' || item.type === '1' || item.type === '3') {
             tableColumn.push(item)
            }
         })
         setReformHouse(tableColumn.map( (item, index) => ({
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: 'center',
            render: (_, record) => <Input type="number"></Input>,
         })))
      }
      if(type === 'selfBuilt') {
         let tableColumn = []
         columnsList.forEach( (item) => {
            if(item.type === '0' || item.type === '4') {
             tableColumn.push(item)
            }
         })
         setSelfBuilt(tableColumn.map( (item, index) => ({
            title: item.label,
            dataIndex: item.field,
            key: item.field,
            align: 'center',
            render: (_, record) => <Input type="number"></Input>,
         })))
      }
   }

   const addRows = (type) => {
      let row = {
         key: '',
         structure: '',
         price: '',
         percent: '',
         percentCount: '',
         materials: '',
         rewardPrice: '',
         total: '',
      }
      let rowKey = ''
      let rowData = []
      if(type === 'certified') {
         rowKey = JSON.parse(JSON.stringify(certifiedKey))
         rowData = JSON.parse(JSON.stringify(certifiedData))
         row.key = ++rowKey
         rowData.push(row)
         setCertifiedData(rowData)
         setCertifiedKey(rowKey)
      } else if(type === 'noCertified') {
         rowKey = JSON.parse(JSON.stringify(noCertifiedKey))
         rowData = JSON.parse(JSON.stringify(noCertifiedData))
         row.key = ++rowKey
         rowData.push(row)
         setNoCertifiedData(rowData)
         setNoCertifiedKey(rowKey)
      } else if(type === 'legitimate') {
         rowKey = JSON.parse(JSON.stringify(legitimateKey))
         rowData = JSON.parse(JSON.stringify(legitimateData))
         row.key = ++rowKey
         rowData.push(row)
         setLegitimateData(rowData)
         setLegitimateKey(rowKey)
      } else if(type === 'reformHouse') {
         rowKey = JSON.parse(JSON.stringify(reformHouseKey))
         rowData = JSON.parse(JSON.stringify(reformHouseData))
         row.key = ++rowKey
         rowData.push(row)
         setReformHouseData(rowData)
         setReformHouseKey(rowKey)
      } else if(type === 'selfBuilt') {
         rowKey = JSON.parse(JSON.stringify(selfBuiltKey))
         rowData = JSON.parse(JSON.stringify(selfBuiltData))
         row.key = ++rowKey
         rowData.push(row)
         setSelfBuiltData(rowData)
         setSelfBuiltKey(rowKey)
      }
   }

   return (
      <Form>
         {
            housePurpose === 1 && <Form.Item label="有证住宅结算" labelCol={{ span: 2}}>
               <Table style={{ marginBottom: '25px'}} dataSource={ certifiedData } columns={ certified } pagination={false} bordered
                  footer={ () => (<Button style={{ width: '100%' }} type="dashed" onClick={ () => addRows('certified') }>新增</Button>) }/>
            </Form.Item>
         }
         {
            housePurpose === 2 && <Form.Item label="有证非住宅结算" labelCol={{ span: 2}}>
               <Table style={{ marginBottom: '25px'}} dataSource={ noCertifiedData } columns={ noCertified } pagination={false} bordered
                  footer={ () => (<Button style={{ width: '100%' }} type="dashed" onClick={ () => addRows('noCertified') }>新增</Button>) }/>
            </Form.Item>
         }
         
         
         <Form.Item label="合法性认定面积结算" labelCol={{ span: 2}}>
            <Table style={{ marginBottom: '25px'}} dataSource={ legitimateData } columns={ legitimate } pagination={false} bordered
               footer={ () => (<Button style={{ width: '100%' }} type="dashed" onClick={ () => addRows('legitimate') }>新增</Button>) }/>
         </Form.Item>
         <Form.Item label="住改非结算" labelCol={{ span: 2}}>
            <Table style={{ marginBottom: '25px'}} dataSource={ reformHouseData } columns={ reformHouse } pagination={false} bordered
               footer={ () => (<Button style={{ width: '100%' }} type="dashed" onClick={ () => addRows('reformHouse') }>新增</Button>) }/>
         </Form.Item>
         <Form.Item label="无证自建房结算" labelCol={{ span: 2}}>
            <Table style={{ marginBottom: '25px'}} dataSource={ selfBuiltData } columns={ selfBuilt } pagination={false} bordered
               footer={ () => (<Button style={{ width: '100%' }} type="dashed" onClick={ () => addRows('selfBuilt') }>新增</Button>) }/>
         </Form.Item>
         {/* 表单 */}
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item label="有证住宅合计" name="certified">
                  <Input type="number"/>
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item label="有证非住宅合计" name="noCertified">
                  <Input type="number"/>
               </Form.Item>
            </Col>
         </Row>
         <Row gutter={16}>
            <Col span={8}>
               <Form.Item label="合法性认定合计" name="legitimate">
                  <Input type="number"/>
               </Form.Item>
            </Col>
            <Col span={8}>
               <Form.Item label="住改非合计" name="reformHouse">
                  <Input type="number"/>
               </Form.Item>
            </Col>
            <Col span={8}>
               <Form.Item label="无证自建房合计" name="selfBuilt">
                  <Input type="number"/>
               </Form.Item>
            </Col>
         </Row>
      </Form>
   )
}

export default PropertyRight