import React, { useState, useEffect } from 'react';
import {
    message,
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    Col, Row, Table
} from 'antd'
import { PlusOutlined, ProfileOutlined } from '@ant-design/icons';
import { queryAssetById, getProvinceArea, getAreaByParent, getDataWithSort } from '../api/asset.js'
import eventbus from '../uilts/eventbus'
import formatFn from '../uilts/uilt.js';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const Collection = () => {
    const [form] = Form.useForm();
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [project_name, setProject_name] = useState(['审核项目']);
    const [compensate, setCompensate] = useState({})
    const [split_info, setSplit_info] = useState({})

    const [projectNameList, setProjectNameList] = useState([]);
    const [houseIDList, setHouseIDList] = useState([]);
    const [placeTable, setPlaceTable] = useState([])
    let [rowId, setRowID] = useState(0);
    let [rowId2, setRowID2] = useState(0);
    const [rights, setRights] = useState([0, 0, 0])
    const [dataTable, setdataTable] = useState([]);
    const [jydata, setjydata] = useState([]);
    const optionsData = ['框架', '砖混', '砖木', '石木结构', '木结构', '钢结构', '其他']
    const options2Data = ['框架', '砖混', '砖木']
    const [provinceAreaList, setProvinceAreaList] = useState([]);

    const onFormLayoutChange = ({ disabled }) => {
        setComponentDisabled(disabled);
    };

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
        queryAsset()
        querysplit_info()
        eventbus.on('settlementDidmount', () => {

            let collet = JSON.parse(JSON.stringify(form.getFieldValue()))
            eventbus.emit('heji', collet)
        })




        // console.log(compensate);
    }, []);

    const queryAsset = () => {
        queryAssetById('ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let b = a.filter(item => {
                return item.create_member == 1234567890
            })
            let c = []
            b.forEach(x => {
                c.push(x.project_name)
            })
            let temp = []
            c.forEach(x => {
                if (temp.indexOf(x) == -1) temp.push(x)

            })
            setProject_name(temp)
            setCompensate(b[0])
            form.setFieldsValue({
                overarea_0price: a[0].jt_over0price, overarea_10price: a[0].jt_over10price, overarea_20price: a[0].jt_over20price, overarea_0total: 0.00, overarea_10total: 0.00, overarea_20total: 0.00, partyb_to_a: 0.00,
                test1: 11111111111, con_frame_price: b[0].frame_unitprice_qqfw, frame_percent: b[0].percent_qqfw, con_bconcrete_price: b[0].bconcrete_unitprice_qqfw, bconcrete_percent: b[0].percent_qqfw,
                con_bwood_price: b[0].bwood_unitprice_qqfw, bwood_percent: b[0].percent_qqfw
                //TODO
            })
            // let temp =b.map
        })
    };
    //保留两位小数

    const fomatFloat = (src, pos) => {
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    }
    const querysplit_info = () => {
        queryAssetById('52f07736-7d11-a20b-aa22-9ab9162146ec').then(res => {
            let a = formatFn(res.data[0], res.data[1])

            setSplit_info(a[0])
            eventbus.on('coll', () => {
                console.log(a[1]);
                let collet = JSON.parse(JSON.stringify(a[1]))
                eventbus.emit('didcoll', collet)
            })

            form.setFieldsValue({
                con_frame_area_total: a[0].con_frame_area_total, con_bconcrete_area_total: a[0].con_bconcrete_area_total, con_bwood_area_total: a[0].con_bwood_area_total,
                total_confirmed_area: a[0].con_frame_area_total + a[0].con_bconcrete_area_total + a[0].con_bwood_area_total
            })
        })
        // 项目名称
        queryAssetById('5e263506-8afa-7646-2277-1734e04bcc08').then((res) => {
            let resArray = []
            let resData = translatePlatformDataToJsonArray(res)
            resData.forEach((item) => {
                resArray.push({
                    project_name: item.project_name,
                    project_id: item.project_id
                })
            })
            setProjectNameList(resArray)
        })

        // 房屋编号
        queryAssetById('184560aa-1985-01d9-b97e-578368cda381').then((res) => {
            let resArray = []
            let resData = translatePlatformDataToJsonArray(res)
            resData.forEach((item) => {
                resArray.push({
                    house_id: item.house_id
                })
            })
            setHouseIDList(resArray)
        })
        //安置房
        queryAssetById('f5503437-4546-8bf4-cdec-ccf53fd51a50').then((res) => {
            let a = formatFn(res.data[0], res.data[1])
            let sum = 0
            a.forEach(x => {
                sum += x.construction_area
            })
            form.setFieldsValue({
                xf_area: sum
            })

            setPlaceTable(a)
        })
        getProvinceArea().then((res) => {
            res.data.forEach((item) => { item.isLeaf = false })
            setProvinceAreaList(res.data)
        })
    }
    //添加
    const addnegative = () => {
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
    //添加经营性
    const addmanagement = () => {
        let rowKey = JSON.parse(JSON.stringify(rowId2));
        let message1 = JSON.parse(JSON.stringify(jydata));
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
        setjydata(message1);
        setRowID2(rowKey);
    }
    //删除经营性
    const deletmanagement = (text, record) => {
        // console.log(text, tableData);
        let message1 = JSON.parse(JSON.stringify(jydata));
        message1.forEach((item, index) => {
            if (item.rowId === text.rowId) {
                message1.splice(index, 1);
                setjydata(message1);
                index--;
            }
        });
    };
    //删除
    const deletnegative = (text, record) => {
        // console.log(text, tableData);
        let message1 = JSON.parse(JSON.stringify(dataTable));
        message1.forEach((item, index) => {
            if (item.rowId === text.rowId) {
                message1.splice(index, 1);
                setdataTable(message1);
                index--;
            }
        });
    };
    const submitFn = (a) => {
        console.log(a);
    }
    //货币补偿合计  
    const compensateChange = (value, a, c, val3) => {
        if (!value) return

        let sum = value * form.getFieldValue()[a] * (form.getFieldValue()[c] / 100 + 1)
        sum = fomatFloat(sum, 2)
        //TODO 补偿
        conState(sum, val3)

    }
    const conState = (sum, val3) => {
        switch (val3) {
            case 'con_frame_total':
                form.setFieldsValue({
                    con_frame_total: sum,
                })
                break;

            case 'con_bconcrete_total':
                form.setFieldsValue({
                    con_bconcrete_total: sum,
                })
                break;

            case 'con_bwood_total':
                form.setFieldsValue({
                    con_bwood_total: sum,
                })
        }

    }




    // 货币补偿更改值  单价
    const inputNumberChange = (value, a, c, val3) => {
        if (!value) return

        let sum = value * form.getFieldValue()[a] * (form.getFieldValue()[c] / 100 + 1)
        sum = fomatFloat(sum, 2)

        conState(sum, val3)

    }

    // 货币补偿更改值  浮动
    const inputPercentChange = (value, a, c, val3) => {
        if (!value) return

        let sum = form.getFieldValue()[c] * form.getFieldValue()[a] * (value / 100 + 1)
        sum = fomatFloat(sum, 2)

        conState(sum, val3)

    }



    const inputSumChange = () => {


        form.setFieldsValue({
            total_confirmed_area: form.getFieldValue().con_frame_area_total + form.getFieldValue().con_bconcrete_area_total + form.getFieldValue().con_bwood_area_total
        })

        setComponentDisabled(!componentDisabled)

        placementChange(form.getFieldValue().placement_method)
    }
    //补差合计
    const differenceChange = (val, val2, val3) => {
        switch (val3) {
            case 'overarea_0total':
                form.setFieldsValue({
                    overarea_0total: form.getFieldValue()[val] * form.getFieldValue()[val2],
                })
                break;

            case 'overarea_10total':
                form.setFieldsValue({
                    overarea_10total: form.getFieldValue()[val] * form.getFieldValue()[val2],
                })
                break;

            case 'overarea_20total':
                form.setFieldsValue({
                    overarea_20total: form.getFieldValue()[val] * form.getFieldValue()[val2],
                })
        }
        form.setFieldsValue({
            partyb_to_a: form.getFieldValue().overarea_0total + form.getFieldValue().overarea_10total + form.getFieldValue().overarea_20total
        })
        eventbus.emit('heji', form.getFieldValue().partyb_to_a)

        setComponentDisabled(!componentDisabled)
    }
    //未确权选择框

    const negativeSelect = (val, i) => {

        let message1 = JSON.parse(JSON.stringify(dataTable));
        let temp = []
        switch (val) {
            case 0:
                temp[0] = compensate.jt_frame_glbz
                temp[1] = compensate.jt_frame_jlbz
                break;
            case 1:
                temp[0] = compensate.jt_bconcrete_glbz
                temp[1] = compensate.jt_bconcrete_glbz
                break;
            case 2:
                temp[0] = compensate.jt_bwood_glbz
                temp[1] = compensate.jt_bwood_jlbz
                break;
            case 3:
                temp[0] = compensate.jt_stonew_glbz
                temp[1] = compensate.jt_stonew_jlbz
                break;
            case 4:
                temp[0] = compensate.jt_wood_glbz
                temp[1] = compensate.jt_wood_jlbz
                break;
            case 5:
                temp[0] = compensate.jt_steel_glbz
                temp[1] = compensate.jt_steel_jlbz
                break;
            case 6:
                temp[0] = compensate.jt_other_glbz
                temp[1] = compensate.jt_other_jlbz
                break;
        }
        message1[i].c = temp[0]
        message1[i].d = temp[1]
        setdataTable(message1);
    }
    //未确权面积
    const negativeChange = (val, i, key) => {
        let message1 = JSON.parse(JSON.stringify(dataTable));
        message1[i][key] = val
        message1[i].e = message1[i].b * (message1[i].c + message1[i].d)
        let sum = 0
        message1.forEach(x => {
            if (typeof x.e == 'number') sum += x.e
        })
        form.setFieldsValue({
            wqq_sum: sum
        })
        setdataTable(message1)

    }
    //经营性选择框
    const managementSelect = (val, i) => {

        let message1 = JSON.parse(JSON.stringify(jydata));
        let temp = []
        switch (val) {
            case 0:
                temp[0] = compensate.frame_unitprice_qqfw
                break;
            case 1:
                temp[0] = compensate.bconcrete_unitprice_qqfw
                break;
            case 2:
                temp[0] = compensate.bwood_unitprice_qqfw
                break;

        }
        temp[1] = compensate.percent_qqfw
        message1[i].c = temp[0]
        message1[i].d = temp[1]
        setjydata(message1);
    }
    const managementChange = (val, i, key) => {
        let message1 = JSON.parse(JSON.stringify(jydata));
        message1[i][key] = val
        message1[i].e = message1[i].b * message1[i].c * (message1[i].d / 100)
        let sum = 0
        let measureTotal = 0
        message1.forEach(x => {
            if (typeof x.e == 'number') sum += x.e
            if (typeof x.b == 'number') measureTotal += x.b
        })
        setjydata(message1)
        if (measureTotal <= 120) {
            form.setFieldsValue({
                jyx_sum: sum,
                operational_sum: measureTotal
            })
        } else {
            message.error('经营性面积有误');
        }



    }
    //面积求和
    const mjSumChange = () => {
        // console.log(form.getFieldValue().qf_area, form.getFieldValue().xf_area);s
        // console.log(form.getFieldValue().qf_area + form.getFieldValue().xf_area);
        let sum1 = form.getFieldValue().qf_area ? form.getFieldValue().qf_area : 0
        let sum2 = form.getFieldValue().xf_area ? form.getFieldValue().xf_area : 0
        let sum = sum1 + sum2

        form.setFieldsValue({
            totalmj: sum,
            dh_area: sum
        })
        placementChange(form.getFieldValue().placement_method)
        // setComponentDisabled(!componentDisabled)


    }
    // 动态加载级联选择器
    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        getAreaByParent(targetOption.id).then((res) => {
            targetOption.children = res.data
            targetOption.loading = false;
            setProvinceAreaList([...provinceAreaList]);
        })
    };
    //表单验证
    const inputRules = (type) => {
        if (type === 'ID') {
            return { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/, message: '请输入正确的身份证号' }
        } else if (type === 'phone') {
            return { pattern: /^1[0-9]{10}/, message: '请输入正确的手机号' }
        }
    }
    const changeHouseID = (value) => {
        let dataForm = {
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
            columnNames: ["actual_address_xxdz", "idcard", "housing_co_owner", "phone", "legal_representative", "area_total_two", "housing_co_owner_idcard", "certificate_for_uscc", "name"],
            sorts: []
        }
        // getDataWithSort('184560aa-1985-01d9-b97e-578368cda381', dataForm).then((res) => {
        //   let resData = translatePlatformDataToJsonArray(res)[0]
        //   form.setFieldsValue({
        //     actual_address_xxdz: resData.actual_address_xxdz,
        //     idcard: resData.idcard,
        //     housing_co_owner: resData.housing_co_owner,
        //     phone: resData.phone,
        //     legal_representative: resData.legal_representative,
        //     area_tatal_two: resData.area_total_two,
        //     housing_co_owner_idcard: resData.housing_co_owner_idcard,
        //     certificate_for_uscc: resData.certificate_for_uscc,
        //     name: resData.name,
        //   });
        //   if (form.getFieldValue().area_tatal_two) {
        //     let dataForm = {
        //       filters: [
        //         {
        //           column: "project_name",
        //           datatype: 0,
        //           type: 4,
        //           varibleType: "components",
        //           compareObj: form.getFieldValue().project_name,
        //           satisfy_type: 0
        //         },
        //         {
        //           column: "house_id",
        //           datatype: 0,
        //           type: 4,
        //           varibleType: "components",
        //           compareObj: value,
        //           satisfy_type: 0
        //         }
        //       ],
        //       columnNames: ["area_total_two"],
        //       sorts: []
        //     }
        //     getDataWithSort('184560aa-1985-01d9-b97e-578368cda381', dataForm).then((res) => {
        //       let resData = translatePlatformDataToJsonArray(res)[0]
        //       if (resData && resData.area_total_two) {
        //         if (resData.area_total_two !== form.getFieldValue().area_tatal_two) {
        //           message.warning('房屋面积与现场查勘面积不相符');
        //         }
        //       } else {
        //         message.warning('房屋面积与现场查勘面积不相符');
        //       }
        //     })
        //   }
        // })
    }
    //安置方式逻辑
    const placementChange = (val) => {
        let sum1 = form.getFieldValue().qf_area ? form.getFieldValue().qf_area : 0
        let sum2 = form.getFieldValue().xf_area ? form.getFieldValue().xf_area : 0
        let total_confirmed_area = form.getFieldValue().total_confirmed_area
        let sum = sum1 + sum2
        if (val == '1') {
            form.setFieldsValue({
                dh_area: sum
            })
            if (total_confirmed_area <= 45) {
                let deff = sum - 45
                if (deff >= 0) {
                    if (deff <= 10) {
                        form.setFieldsValue({ overarea_0: deff, overarea_10: 0, overarea_20: 0 })
                    } else if (deff > 10 && deff <= 20) {
                        form.setFieldsValue({ overarea_0: 10, overarea_10: deff - 10, overarea_20: 0 })
                    } else {
                        form.setFieldsValue({ overarea_0: 10, overarea_10: 20, overarea_20: deff - 20 })
                    }

                } else {
                    form.setFieldsValue({
                        overarea_0: 0,
                        overarea_10: 0,
                        overarea_20: 0,
                    })
                }
            } else {
                let deff = total_confirmed_area - sum
                if (deff >= 0) {
                    let { con_frame_area_total, con_bconcrete_area_total, con_bwood_area_total } = form.getFieldValue()
                    let R1 = con_bwood_area_total - sum
                    let R2 = R1 + con_bconcrete_area_total
                    let R3 = R2 + con_frame_area_total
                    if (R1 > 0) {
                        form.setFieldsValue({
                            con_frame_area: con_frame_area_total,
                            con_bconcrete_area: con_bconcrete_area_total,
                            con_bwood_area: R1,
                        })
                    } else {
                        if (R2 > 0) {
                            form.setFieldsValue({
                                con_frame_area: con_frame_area_total,
                                con_bconcrete_area: R2,
                                con_bwood_area: 0,
                            })
                        } else {
                            if (R3 > 0) {
                                form.setFieldsValue({
                                    con_frame_area: R3,
                                    con_bconcrete_area: 0,
                                    con_bwood_area: 0,
                                })
                            } else {
                                form.setFieldsValue({
                                    con_frame_area: 0,
                                    con_bconcrete_area: 0,
                                    con_bwood_area: 0,
                                })
                            }
                        }

                    }
                } else {
                    let deffT = -(deff)
                    if (deffT <= 10) {
                        form.setFieldsValue({ overarea_0: deffT, overarea_10: 0, overarea_20: 0 })
                    } else if (deffT > 10 && deffT <= 20) {
                        form.setFieldsValue({ overarea_0: 10, overarea_10: deffT - 10, overarea_20: 0 })
                    } else {
                        form.setFieldsValue({ overarea_0: 10, overarea_10: 20, overarea_20: deffT - 20 })
                    }
                    form.setFieldsValue({
                        con_frame_area: 0,
                        con_bconcrete_area: 0,
                        con_bconcrete_area: 0,
                    })
                }
            }


        } else {
            let { con_frame_area_total, con_bconcrete_area_total, con_bwood_area_total } = form.getFieldValue()
            form.setFieldsValue({
                con_frame_area: con_frame_area_total,
                con_bconcrete_area: con_bconcrete_area_total,
                con_bwood_area: con_bwood_area_total,
            })

        }
        setComponentDisabled(!componentDisabled)

    }
    return (
        <div className='Collection'>
            <div className='Collection_form'>
                <Form
                    form={form}
                    onFinish={() => submitFn()}
                    labelWrap={true}
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    initialValues={{
                        project_name: project_name[0],
                        placement_method: '0',
                        total_confirmed_area: 0.00
                    }}
                    onValuesChange={onFormLayoutChange}
                    size='large'
                >
                    <div className='classitem' >

                        <Row justify="space-around">
                            <Col span={6}>
                                <Form.Item label="项目名称" name="project_name" >
                                    <Select disabled={false}>
                                        {
                                            projectNameList && projectNameList.map((item, index) => {
                                                return (item && <Option key={index} value={item.project_id}>{item.project_name}</Option>)
                                            })
                                        }
                                        {/* <Select.Option value="demo">审核项目</Select.Option> */}
                                    </Select>
                                </Form.Item></Col>
                            <Col span={6}><Form.Item required label="房屋编号" name="house_id">
                                <Select onChange={(value, e) => { changeHouseID(value, e) }}>
                                    {
                                        houseIDList && houseIDList.map((item, index) => {
                                            return (item && <Option key={index} value={item.house_id}>{item.house_id}</Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item></Col>
                            <Col span={6}><Form.Item label="附加编号" name='split_house_id'>
                                <Input />
                            </Form.Item></Col>
                            <Col span={6}>
                                <Form.Item label="被征收人类型" name='richman_type'>
                                    <Select>
                                        <Select.Option value="demo">Demo</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row justify="space-around">
                            <Col span={6}><Form.Item required={true} label="被征收人" name='spit_name'>
                                <Input />
                            </Form.Item>
                            </Col>
                            <Col span={6}> <Form.Item required label="身份证号" name="splic_idcard" rules={[() => inputRules('ID')]}>
                                <Input size='large' maxLength={18} />
                            </Form.Item></Col>
                            <Col span={6}> <Form.Item label="手机" name="splic_phone" rules={[() => inputRules('phone')]}>
                                <Input />
                            </Form.Item></Col>
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
                    </div>
                    <Row >
                        <Col span={12} pull={1}>
                            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.marital_status !== currentValues.marital_status}>
                                {
                                    ({ getFieldValue }) => getFieldValue('marital_status') === '1' ? (
                                        <Form.Item labelCol={{ span: 5, }} label="配偶姓名" name="po_name"><Input /></Form.Item>
                                    ) : null
                                }
                            </Form.Item>
                        </Col>
                        <Col span={12} pull={1}>
                            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.marital_status !== currentValues.marital_status}>
                                {
                                    ({ getFieldValue }) => getFieldValue('marital_status') === '1' ? (
                                        <Form.Item labelCol={{ span: 5, }} label="配偶身份证号" name="po_idcard"><Input /></Form.Item>
                                    ) : null
                                }
                            </Form.Item>
                        </Col>
                    </Row>


                    <div className='classitem' >
                        <Row>
                            <Col span={6}> <Form.Item label="组织机构代码" name='zzjgdm'>
                                <Input />
                            </Form.Item>
                            </Col>
                            <Col span={6}> <Form.Item label="法定代表人" name='fddbr'>
                                <Input />
                            </Form.Item></Col>
                            <Col span={6}><Form.Item label="身份证号" name='fddbr_idcard' rules={[() => inputRules('ID')]} valuePropName="checked">
                                <Input />
                            </Form.Item></Col>
                            <Col span={6}>
                                <Form.Item label="联系方式" name='fddbr_phone'   >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>


                        <Row justify="start">
                            <Col span={12} pull={1}  >
                                <Form.Item label="实际居住地" labelCol={{
                                    span: 5,
                                }} wrapperCol={{ span: 19 }} name="actual_address_qycj">
                                    <Cascader options={provinceAreaList} loadData={loadData} fieldNames={{ value: 'id', label: 'name', children: 'children' }} changeOnSelect />
                                </Form.Item>
                            </Col>
                            <Col span={12} pull={1}> <Form.Item label="房屋坐落" name='actual_address_xxdz' labelCol={{
                                span: 5,
                            }} wrapperCol={{ span: 19 }}>
                                <Input />
                            </Form.Item></Col>


                        </Row>

                        <Row>
                            <Col span={4}> <Form.Item label="房屋共有权人" name='housing_co_owner' labelCol={{
                                span: 8, offset: 1
                            }} wrapperCol={{ span: 13 }}
                            >
                                <Input />
                            </Form.Item>
                            </Col>
                            <Col span={5} > <Form.Item label="房屋共有权人身份证" name='housing_co_owner_idcard' rules={[() => inputRules('ID')]} labelCol={{
                                span: 8,
                            }} wrapperCol={{ span: 14 }}
                            >
                                <Input />
                            </Form.Item></Col>
                            <Col span={4}> <Form.Item label="遗产继承人" name='inheritor' labelCol={{
                                span: 8,
                            }} wrapperCol={{ span: 14 }}
                            >
                                <Input />
                            </Form.Item></Col>
                            <Col span={5}> <Form.Item label="遗产继承人身份证" name='inheritor_idcard' rules={[() => inputRules('ID')]} labelCol={{
                                span: 7,
                            }} wrapperCol={{ span: 14 }}>
                                <Input />
                            </Form.Item></Col>
                            <Col span={5}> <Form.Item label="继承人电话" name='jcr_phone' rules={[() => inputRules('phone')]} labelCol={{ span: 8, }}
                                wrapperCol={{ span: 11 }}
                            >
                                <Input />
                            </Form.Item></Col>
                        </Row>

                        <Row>
                            <Col span={6}> <Form.Item label="委托代理人" name='entrusted_agent'>
                                <Input />
                            </Form.Item>
                            </Col>
                            <Col span={6}> <Form.Item label="身份证号" name='entrusted_agent_idcard' rules={[() => inputRules('ID')]}>
                                <Input />
                            </Form.Item></Col>
                            <Col span={6}> <Form.Item label="手机" name='entrusted_agent_phone' rules={[() => inputRules('phone')]}>
                                <Input />
                            </Form.Item></Col>

                        </Row>

                        <Row>
                            <Col span={6}> <Form.Item label="产权证类别">
                                <Select>
                                    <Select.Option value="demo">产权证类别</Select.Option>
                                    <Select.Option value="demo1">农户确权</Select.Option>
                                </Select>
                            </Form.Item>
                            </Col>
                            <Col span={6}> <Form.Item label="证号">
                                <Input />
                            </Form.Item></Col>


                        </Row>

                        <Row>
                            <Col span={6}> <Form.Item required label="安置方式" name='placement_method' onChange={(value) => { placementChange(value) }}>
                                <Radio.Group  >
                                    <Radio value="0"> 货币补偿 </Radio>
                                    <Radio value="1"> 产权调换 </Radio>
                                </Radio.Group>
                            </Form.Item>
                            </Col>
                            <Col span={6}> <Form.Item >

                                <Button size='middle' type='primary' >获取确权</Button>

                            </Form.Item>
                            </Col>

                        </Row>
                    </div>

                    <div className='classitem' b={split_info} >
                        <Row>
                            <Col span={6}> <Form.Item label="确权框架（㎡）" name='con_frame_area_total' >
                                <InputNumber step='1.00' onChange={() => { inputSumChange() }} />
                            </Form.Item>
                            </Col>
                            <Col span={6}> <Form.Item label="确权砖混（㎡）" name='con_bconcrete_area_total'>
                                <InputNumber step='1.00' onChange={() => { inputSumChange() }} />
                            </Form.Item></Col>
                            <Col span={6}> <Form.Item label="确权砖木（㎡）" name='con_bwood_area_total'>
                                <InputNumber step='1.00' onChange={() => { inputSumChange() }} />
                            </Form.Item></Col>
                            <Col span={6}> <Form.Item label="合计确权（㎡）" name='total_confirmed_area'>
                                <InputNumber step='1.00' disabled={true} />
                            </Form.Item></Col>

                        </Row>
                        <div style={{ opacity: form.getFieldValue('placement_method') == '1' ? 1 : 0 }} >
                            <Row>
                                <Col offset={2} span={2}> <Form.Item  >
                                    <Button size='middle' type='primary' block={true} > 选房 </Button>
                                </Form.Item>
                                </Col>

                                <Col span={6} offset={8}> <Form.Item label="期房面积" name='qf_area' >
                                    <InputNumber step='1.00' onChange={() => { mjSumChange() }} />
                                </Form.Item></Col>
                                <Col span={6}> <Form.Item label="选房面积" name='xf_area'  >
                                    <InputNumber step='1.00' onChange={() => { mjSumChange() }} />
                                </Form.Item></Col>

                            </Row>
                        </div>

                        <Row>

                            <Col span={6} offset={12}> <Form.Item label="合计总面积" name='totalmj'>
                                <InputNumber step='1.00' disabled={true} />
                            </Form.Item></Col>

                            <Col span={6}>  <div style={{ opacity: form.getFieldValue('placement_method') == '1' ? 1 : 0 }} > <Form.Item label="产权调换面积" name='dh_area'>
                                <InputNumber step='1.00' />
                            </Form.Item> </div>
                            </Col>

                        </Row>
                    </div>

                    <div style={{ display: form.getFieldValue('placement_method') == '1' ? 'block' : 'none' }} >
                        安置房
                        <Table rowKey={(text) => text.rowId} dataSource={placeTable} bordered pagination={false}
                        >
                            <Table.Column key="community_name" title="小区名称" dataIndex="community_name" />
                            <Table.Column key="building_number" title="栋号" dataIndex="building_number" />
                            <Table.Column key="unit_number" title="单元" dataIndex="unit_number" />
                            <Table.Column key="floor_number" title="楼层" dataIndex="floor_number" />
                            <Table.Column key="room_number" title="房号" dataIndex="room_number" />
                            <Table.Column key="construction_area" title="建筑面积(m²)" dataIndex="construction_area" />
                        </Table>
                    </div>
                    <div style={{ display: form.getFieldValue('placement_method') == '1' ? 'block' : 'none' }} >
                        <div className='title_public'  > <ProfileOutlined /> 超安补差</div>
                        <Row>
                            <Col span={8}> <Form.Item label="超安面积（0-10㎡）" name='overarea_0' >
                                <InputNumber step='1.00' onChange={() => differenceChange('overarea_0', 'overarea_0price', 'overarea_0total')} />
                            </Form.Item>
                            </Col>
                            <Col span={8}> <Form.Item label="单价（元/m²）" name='overarea_0price' >
                                <InputNumber onChange={(value) => differenceChange('overarea_0', 'overarea_0price', 'overarea_0total')} />
                            </Form.Item></Col>
                            <Col span={8}> <Form.Item label="合计" name='overarea_0total' >
                                <InputNumber disabled={true} />
                            </Form.Item></Col>


                        </Row>

                        <Row>
                            <Col span={8}> <Form.Item label="超安面积（10-20㎡）" name='overarea_10'>
                                <InputNumber step='1.00' onChange={() => differenceChange('overarea_10', 'overarea_10price', 'overarea_10total')} />
                            </Form.Item>
                            </Col>
                            <Col span={8}> <Form.Item label="单价（元/m²）" name='overarea_10price' >
                                <InputNumber onChange={() => differenceChange('overarea_10', 'overarea_10price', 'overarea_10total')} />
                            </Form.Item></Col>
                            <Col span={8}> <Form.Item label="合计" name='overarea_10total' >
                                <InputNumber disabled={true} />
                            </Form.Item></Col>


                        </Row>
                        <Row>
                            <Col span={8}> <Form.Item label="超安面积（20-30㎡）" name='overarea_20'  >
                                <InputNumber step='1.00' onChange={() => differenceChange('overarea_20', 'overarea_20price', 'overarea_20total')} />
                            </Form.Item>
                            </Col>
                            <Col span={8}> <Form.Item label="单价（元/m²）" name='overarea_20price' >
                                <InputNumber onChange={() => differenceChange('overarea_20', 'overarea_20price', 'overarea_20total')} />
                            </Form.Item></Col>
                            <Col span={8}> <Form.Item label="合计" name='overarea_20total' >
                                <InputNumber disabled={true} />
                            </Form.Item></Col>
                        </Row>

                        <Row justify="start">
                            <Col span={19}>
                                <Form.Item labelCol={{ span: 1.5, offset: 1 }} wrapperCol={{ span: 16 }} label='乙方应付甲方' name='partyb_to_a' >
                                    <Input disabled={true} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <div className='title_public'  > <ProfileOutlined /> 货币补偿确权</div>

                    <Row>
                        <Col span={6}> <Form.Item label="确权框架（㎡）" name='con_frame_area'>
                            <InputNumber step='1.00' onChange={(value) => compensateChange(value, 'con_frame_price', 'frame_percent', 'con_frame_total')} />
                        </Form.Item>
                        </Col>
                        <Col span={6}> <Form.Item label="评估单价" name='con_frame_price' >
                            <InputNumber onChange={(value) => inputNumberChange(value, 'con_frame_area', 'frame_percent', 'con_frame_total')} a='frame_unitprice_qqfw' />
                        </Form.Item></Col>
                        <Col span={6}> <Form.Item label="上浮百分比" name='frame_percent' >
                            <InputNumber onChange={(value) => inputPercentChange(value, 'con_frame_area', 'con_frame_price', 'con_frame_total')} a='percent_qqfw' />
                        </Form.Item></Col>
                        <Col span={6}> <Form.Item label='1计算' name='con_frame_total'>
                            <Input disabled={true} />
                        </Form.Item></Col>

                    </Row>


                    {
                        //TODO
                    }
                    <Row>
                        <Col span={6}> <Form.Item label="确权砖混（㎡）" name='con_bconcrete_area'>
                            <InputNumber step='1.00' onChange={(value) => compensateChange(value, 'con_bconcrete_price', 'bconcrete_percent', 'con_bconcrete_total')} />
                        </Form.Item>
                        </Col>
                        <Col span={6}> <Form.Item label="评估单价" name='con_bconcrete_price'  >
                            <InputNumber onChange={(value) => inputNumberChange(value, 'con_bconcrete_area', 'bconcrete_percent', 'con_bconcrete_total')} a='bconcrete_unitprice_qqfw' />
                        </Form.Item></Col>
                        <Col span={6}> <Form.Item label="上浮百分比" name='bconcrete_percent'>
                            <InputNumber onChange={(value) => inputPercentChange(value, 'con_bconcrete_area', 'con_bconcrete_price', 'con_bconcrete_total')} a='percent_qqfw' />
                        </Form.Item></Col>
                        <Col span={6}> <Form.Item label="2计算" name='con_bconcrete_total'>
                            <Input disabled={true} />
                        </Form.Item></Col>

                    </Row>

                    <Row>
                        <Col span={6}> <Form.Item label="确权砖木（㎡）" name='con_bwood_area'>
                            <InputNumber step='1.00' onChange={(value) => compensateChange(value, 'con_bwood_price', 'bwood_percent', 'con_bwood_total')} />
                        </Form.Item>
                        </Col>
                        <Col span={6}> <Form.Item label="评估单价" name='con_bwood_price' >
                            <InputNumber onChange={(value) => inputNumberChange(value, 'con_bwood_area', 'bwood_percent', 'con_bwood_total')} a='bwood_unitprice_qqfw' />
                        </Form.Item></Col>
                        <Col span={6}> <Form.Item label="上浮百分比" name='bwood_percent'>
                            <InputNumber onChange={(value) => inputPercentChange(value, 'con_bwood_area', 'con_bwood_price', 'con_bwood_total')} a='percent_qqfw' />
                        </Form.Item></Col>
                        <Col span={6}> <Form.Item label="3计算" name='con_bwood_total'>
                            <Input disabled={true} />
                        </Form.Item></Col>

                    </Row>
                    <div className='dase'></div>


                    <Form.Item wrapperCol={{ span: 24 }}>
                        未确权部分

                        <Table
                            rowKey={(text) => text.rowId}
                            dataSource={dataTable}
                            bordered pagination={false}
                            footer={() => (<Button onClick={() => addnegative()} type="dashed" block icon={<PlusOutlined />}>
                                新增
                            </Button>)

                            }
                        >
                            <Table.Column key="a" title="结构" dataIndex="a" render={(text, record, index) => (

                                <Select key={index} onChange={(text) => { negativeSelect(text, index) }} >{
                                    optionsData.map((x, i) => {
                                        return (<Select.Option value={i}>{x}</Select.Option>)
                                    })
                                }
                                </Select>

                            )} />
                            <Table.Column key="b" title="面积(m²)" dataIndex="b" render={(text, record, index) => (
                                <>
                                    <InputNumber onChange={(text) => { negativeChange(text, index, 'b') }} value={text} key={text} />
                                </>
                            )} />
                            <Table.Column key="c" title="工料补助单价" dataIndex="c" render={(text, record, index) => (

                                <InputNumber onChange={(text) => { negativeChange(text, index, 'c') }} key={index} value={text} />

                            )} />
                            <Table.Column key="d" title="奖励补助单价" dataIndex="d" render={(text, record, index) => (
                                <>
                                    <InputNumber onChange={(text) => { negativeChange(text, index, 'd') }} key={index} value={text} />
                                </>
                            )} />
                            <Table.Column key="e" title="合计" dataIndex="e" render={(text, record, index) => (
                                <>
                                    <Input disabled={true} key={index} value={text} />
                                </>
                            )} />
                            <Table.Column key="f" title="操作" dataIndex="f" render={(index, record, text) => (
                                <>
                                    <Button type="link" key={index} onClick={(text, record) => { deletnegative(text, record) }}>删除</Button>
                                </>
                            )} />
                        </Table>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }} >
                        经营性部分
                        <Table
                            dataSource={jydata}
                            bordered
                            footer={() => (<Button type="dashed" onClick={() => addmanagement()} block icon={<PlusOutlined />}>
                                新增
                            </Button>)
                            }
                        >
                            <Table.Column key="a" title="结构" dataIndex="a" render={(text, record, index) => (
                                <>
                                    <Select key={index} onChange={(text) => { managementSelect(text, index) }}>
                                        {
                                            options2Data.map((x, i) => {
                                                return (<Select.Option value={i}>{x}</Select.Option>)
                                            })
                                        }
                                    </Select>
                                </>
                            )} />
                            <Table.Column key="b" title="面积(m²)" dataIndex="b" render={(text, record, index) => (
                                <>
                                    <InputNumber onChange={(text) => { managementChange(text, index, 'b') }} value={text} key={index} />
                                </>
                            )} />
                            <Table.Column key="c" title="单价(元/m²)" dataIndex="c" render={(text, record, index) => (
                                <>
                                    <InputNumber onChange={(text) => { managementChange(text, index, 'b') }} value={text} key={index} />
                                </>
                            )} />
                            <Table.Column key="d" title="补贴百分比(%)" dataIndex="d" render={(text, record, index) => (
                                <>
                                    <InputNumber onChange={(text) => { managementChange(text, index, 'b') }} value={text} key={index} />
                                </>
                            )} />
                            <Table.Column key="e" title="合计" dataIndex="e" render={(text, record, index) => (
                                <>
                                    <Input key={index} value={text} disabled={true} />
                                </>
                            )} />
                            <Table.Column key="f" title="操作" dataIndex="f" render={(index, record, text) => (
                                <>
                                    <Button type="link" key={index} onClick={(text, record) => { deletmanagement(text, record) }} >删除</Button>
                                </>
                            )} />
                        </Table>
                    </Form.Item>

                    <Row justify="start">
                        <Col span={24}>
                            <Form.Item labelCol={{ span: 1.5, pull: 0 }} wrapperCol={{ span: 16 }} label='经营性面积合计' name='operational_sum'>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row justify="start">
                        <Col span={20}>

                            <Form.Item labelCol={{ span: 1.5, offset: 1 }} wrapperCol={{ span: 24 }} label='4合计' name='wqq_sum'>

                                <Input disabled={true} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="start">
                        <Col span={20}>
                            <Form.Item labelCol={{ span: 1.5, offset: 1 }} wrapperCol={{ span: 24 }} label='5合计' name='jyx_sum' >

                                <Input disabled={true} />
                            </Form.Item>

                        </Col>
                    </Row>
                </Form>
            </div>

        </div>
    );
};

export default Collection;
