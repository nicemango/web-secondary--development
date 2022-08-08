import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,

    Col, Row, Table, InputNumber
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { queryAssetById, getProvinceArea, getAreaByParent, getDataWithSort } from '../api/asset.js'
import eventbus from '../uilts/eventbus'
import formatFn from '../uilts/uilt.js';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const Quantities = () => {
    const [formquan] = Form.useForm();
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [decorate, setDecorate] = useState([])//z工程名
    const [decorateTable, setDecorateTable] = useState([])//z工程名
    const [dataTable, setdataTable] = useState([]);//z工程表
    const [split_info, setSplit_info] = useState({})

    const [decorateF, setDecorateF] = useState([])//f工程名
    const [decorateTableF, setDecorateTableF] = useState([])//f工程名
    const [dataTableF, setdataTableF] = useState([]);//f工程表
    const optionsData = ['框架', '砖混', '砖木', '石木结构', '木结构', '钢结构', '其他']

    let [rowId, setRowID] = useState(0);
    const onFormLayoutChange = ({ disabled }) => {
        setComponentDisabled(disabled);
    };
    useEffect(() => {
        let rowKey = JSON.parse(JSON.stringify(rowId));
        let message1 = [
            {
                a: "",
                b: "",
                c: "",
                d: "",
                e: "",
                f: "",
            },

        ];
        message1.forEach((item, index) => {
            item.rowId = ++rowKey;
        });
        setRowID(rowKey);
        setdataTable(message1);
        eventbus.on('settlementDidmount', () => {

            let collet = JSON.parse(JSON.stringify(formquan.getFieldValue()))
            eventbus.emit('quan', collet)
        })


        //接受被征收人的信息
        eventbus.on('didcoll', (val) => {
            console.log(val.decorate_baogan, val.decorate_pingu, val.compensation_amount);
            formquan.setFieldsValue({
                decorate_baogan: val.decorate_baogan,
                decorate_pingu: val.decorate_pingu,
                compensation_amount: val.compensation_amount,
            })
            setSplit_info(val)
        })
        eventbus.emit('coll',)

        queryAsset()
        // console.log(compensate);
    }, []);

    const queryAsset = () => {
        //z表
        queryAssetById('2fb7db88-cfa8-a43e-755d-db051aeb2e6d').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let tempdecorate = a.map(x => {
                return { decorate_name: x.decorate_name }
            })

            setDecorateTable(a)
            setDecorate(tempdecorate)
        })
        //f表
        queryAssetById('049d9007-0a4e-3008-0329-09e188491d49').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let tempdecorate = a.map(x => {
                return { decorate_name: x.decorate_name }
            })

            setDecorateTableF(a)
            setDecorateF(tempdecorate)
        })
        // split_info 表

    }
    // F附属表
    const addmanagementF = () => {
        let rowKey = JSON.parse(JSON.stringify(rowId));
        let message1 = JSON.parse(JSON.stringify(dataTableF));
        let info = {
            rowId: ++rowKey,
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
            f: "",
        };
        message1.push(info);
        setdataTableF(message1);
        setRowID(rowKey);
    }



    const addmanagement = () => {
        let rowKey = JSON.parse(JSON.stringify(rowId));
        let message1 = JSON.parse(JSON.stringify(dataTable));
        let info = {
            rowId: ++rowKey,
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
            f: "",
        };
        message1.push(info);
        setdataTable(message1);
        setRowID(rowKey);
    }
    //删除Z经营性
    const deletmanagement = (text, record) => {
        console.log(text);
        let message1 = JSON.parse(JSON.stringify(dataTable));
        // message1.forEach((item, index) => {
        //     if (item.rowId === text.rowId) {
        message1.splice(text, 1);
        setdataTable(message1);
        // index--;
        // }
        // });
    };
    //删除F经营性
    const deletmanagementF = (text, record) => {
        console.log(text);
        let message1 = JSON.parse(JSON.stringify(dataTableF));
        // message1.forEach((item, index) => {
        //     if (item.rowId === text.rowId) {
        message1.splice(text, 1);
        setdataTableF(message1);
        // index--;
        // }
        // });
    };
    //z工程名选择事件
    const decorateChange = (val, index) => {
        let item
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        decorateTable.forEach(x => {
            if (val == x.decorate_name) item = x
        })
        tempDatatable[index] = item
        setdataTable(tempDatatable)
        let { zsum } = shiLiangSum()
        formquan.setFieldsValue({
            decoration_amount: zsum
        })
    }
    //F工程名选择事件
    const decorateFChange = (val, index) => {
        let item
        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))
        decorateTableF.forEach(x => {
            if (val == x.decorate_name) item = x
        })
        tempDatatable[index] = item
        setdataTableF(tempDatatable)
        let { fsum } = shiLiangSum()
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }
    //列求和  实量
    const shiLiangSum = () => {
        let fsum = 0
        let zsum = 0
        dataTableF.forEach(x => {
            if (x.estimated_total_price) {
                fsum += x.estimated_total_price
            } else {
                fsum += 0
            }
        })
        dataTable.forEach(x => {
            if (x.estimated_total_price) {
                zsum += x.estimated_total_price
            } else {
                zsum += 0
            }
        })
        return {
            fsum, zsum
        }
    }
    //装修3选1
    const renovationChange = (val) => {
        console.log(formquan.getFieldValue().compensation_amount);
        let { compensation_amount, decorate_baogan, decoration_amount, decorate_pingu, attached_shi } = formquan.getFieldValue()
        compensation_amount = compensation_amount ? compensation_amount : 0
        decorate_baogan = decorate_baogan ? decorate_baogan : 0
        decoration_amount = decoration_amount ? decoration_amount : 0
        decorate_pingu = decorate_pingu ? decorate_pingu : 0
        attached_shi = attached_shi ? attached_shi : 0
        setComponentDisabled(!componentDisabled);



        switch (val) {
            case '1':
                formquan.setFieldsValue({
                    total_amount: decorate_baogan,
                })
                break;

            case '2':
                formquan.setFieldsValue({
                    total_amount: decoration_amount + attached_shi,
                })
                break;

            case '3':
                formquan.setFieldsValue({
                    total_amount: decorate_pingu + compensation_amount,
                })
        }
    }
    return (
        <Form
            form={formquan}
            labelWrap={true}
            labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 14,
            }}
            size='large'
            layout="horizontal"
            initialValues={{
                disabled: componentDisabled,
            }}
            onValuesChange={onFormLayoutChange}
        >
            <Row justify="center">
                <Col span={24} offset={1} >
                    <Form.Item labelCol={{ span: 1, }} wrapperCol={{ span: 5, }} label="装修选择" name='zxxz'    >
                        <Select onChange={(val) => { renovationChange(val) }}>
                            <Select.Option value="1">装修包干金额</Select.Option>
                            <Select.Option value="2">装修实量金额</Select.Option>
                            <Select.Option value="3">装修评估金额</Select.Option>
                        </Select>
                    </Form.Item></Col>


            </Row>

            <Row>
                <Col span={6}>
                    <div style={{ opacity: formquan.getFieldValue().zxxz == '1' ? 1 : 0 }}  >
                        <Form.Item labelCol={{ span: 6, }} wrapperCol={{ span: 18, }} label="装修包干金额" name='decorate_baogan'>
                            <Input />
                        </Form.Item>
                    </div>
                </Col>

                <Col span={6}>
                    <div style={{ opacity: formquan.getFieldValue().zxxz == '2' ? 1 : 0 }}  >
                        <Form.Item wrapperCol={{ span: 18, }} label="装修实量金额" name='decoration_amount' >
                            <Input />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={6}>
                    <div style={{ opacity: formquan.getFieldValue().zxxz == '3' ? 1 : 0 }}  >
                        <Form.Item wrapperCol={{ span: 18, }} label="装修评估金额" name='decorate_pingu'>
                            <Input />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={5} offset={1}><Form.Item >
                    <Button type='primary' size='middle'>评估报告</Button>
                </Form.Item>
                </Col>

            </Row>

            <Row justify="center">
                <Col span={24} offset={1}> <Form.Item labelCol={{ span: 1, }} wrapperCol={{ span: 20, }} label="备注" name='decoration_remark'>
                    <Input />
                </Form.Item>
                </Col>




            </Row>

            <Row>
                <Col span={6} >
                    <div style={{ opacity: formquan.getFieldValue().zxxz == '2' ? 1 : 0 }}  >
                        <Form.Item wrapperCol={{ span: 14, }} label="附属实量金额" name='attached_shi'   >
                            <Input />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={6} >   <div style={{ opacity: formquan.getFieldValue().zxxz == '3' ? 1 : 0 }} >
                    <Form.Item wrapperCol={{ span: 14, }} label="附属评估金额" name='compensation_amount'>
                        <Input />
                    </Form.Item>
                </div>
                </Col>


                <Col span={12} > <Form.Item labelCol={{ span: 3, }} wrapperCol={{ span: 6, }} name='total_amount' label="6装修附属合计金额">
                    <Input disabled={true} />
                </Form.Item>
                </Col>


            </Row>
            <Form.Item wrapperCol={{ span: 24, }}>装修工程量测量记录表
                <Table
                    rowKey={(text) => text.rowId}
                    dataSource={dataTable}
                    bordered
                    footer={() => (<Button type="dashed" onClick={() => { addmanagement() }} block icon={<PlusOutlined />}>
                        新增
                    </Button>)
                    }
                >
                    <Table.Column key="decorate_name" title="工程名称" dataIndex="decorate_name" render={(text, record, index) => (
                        <Select key={index} onChange={(text) => { decorateChange(text, index) }} >{
                            decorate.map((x, i) => {
                                return (<Select.Option value={x.decorate_name}>{x.decorate_name}</Select.Option>)
                            })
                        }
                        </Select>
                    )} />
                    <Table.Column key="unit" title="Z单位" dataIndex="unit" render={(text, record, index) => (
                        <Input value={text} />
                    )} />
                    <Table.Column key="decorate_data" title="Z测量数据" dataIndex="decorate_data" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="engineering_total" title="Z工程量" dataIndex="engineering_total" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="evaluation_unit_price" title="Z单价" dataIndex="evaluation_unit_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="min_price" title="单价最小值" dataIndex="min_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="max_price" title="单价最大值" dataIndex="max_price" render={(text, record, index) => (

                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="estimated_total_price" title="Z总价" dataIndex="estimated_total_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="upload_photos" title="图片上传" dataIndex="upload_photos" render={(text, record, index) => (
                        <InputNumber />
                    )} />
                    <Table.Column key="decorate_remark" title="备注" dataIndex="decorate_remark" render={(text, record, index) => (
                        <Input value={text} />
                    )} />
                    <Table.Column key="a" title="操作" dataIndex="a" render={(text, record, index) => (
                        <Button type="link" key={index} onClick={(text, record) => { deletmanagement(index, record) }}>删除</Button>
                    )} />
                </Table>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24, }} >附属工程量测量记录表
                <Table
                    rowKey={(text) => text.rowId}
                    dataSource={dataTableF}
                    bordered
                    footer={() => (<Button type="dashed" onClick={() => { addmanagementF() }} block icon={<PlusOutlined />}>
                        新增
                    </Button>)
                    }
                >
                    <Table.Column key="decorate_name" title="工程名称" dataIndex="decorate_name" render={(text, record, index) => (
                        <Select key={index} onChange={(text) => { decorateFChange(text, index) }} >{
                            decorateF.map((x, i) => {
                                return (<Select.Option value={x.decorate_name}>{x.decorate_name}</Select.Option>)
                            })
                        }
                        </Select>
                    )} />
                    <Table.Column key="unit" title="Z单位" dataIndex="unit" render={(text, record, index) => (
                        <Input value={text} />
                    )} />
                    <Table.Column key="decorate_data" title="Z测量数据" dataIndex="decorate_data" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="engineering_total" title="Z工程量" dataIndex="engineering_total" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="evaluation_unit_price" title="Z单价" dataIndex="evaluation_unit_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="min_price" title="单价最小值" dataIndex="min_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="max_price" title="单价最大值" dataIndex="max_price" render={(text, record, index) => (

                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="estimated_total_price" title="Z总价" dataIndex="estimated_total_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="upload_photos" title="图片上传" dataIndex="upload_photos" render={(text, record, index) => (
                        <InputNumber />
                    )} />
                    <Table.Column key="decorate_remark" title="备注" dataIndex="decorate_remark" render={(text, record, index) => (
                        <Input value={text} />
                    )} />
                    <Table.Column key="a" title="操作" dataIndex="a" render={(text, record, index) => (
                        <Button type="link" key={index} onClick={(text, record) => { deletmanagementF(index, record) }}>删除</Button>
                    )} />
                </Table>
            </Form.Item>




        </Form>
    );
};

export default Quantities;