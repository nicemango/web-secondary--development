import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Checkbox,
    Upload,
    Col, Row
} from 'antd'
import { PlusOutlined, ProfileOutlined } from '@ant-design/icons';
import { queryAssetById, } from '../api/asset.js'
import eventbus from '../uilts/eventbus'
import moment from "moment";
import formatFn from '../uilts/uilt.js';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Settlement = ({ updateSet, cRef, click, defaultValue }) => {
    const [formlement] = Form.useForm();
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [hiddenExchange, setHiddenExchange] = useState(true)
    const [hiddenCurrency, setHiddenCurrency] = useState(true)
    const [compensateJa, setCompensateJa] = useState([])
    const [placement_method, setPlacement_method] = useState('货币补偿')
    const [formC, setformC] = useState({})

    const [piceF, setPiceF] = useState({})
    // const [temp, settemp] = useState(0);


    useEffect(() => {
        formlement.validateFields([]);
        if (defaultValue && defaultValue.data_id) {
            let tempObj = {};
            for (let item in defaultValue) {
                if (defaultValue[item]?.value) tempObj[item] = defaultValue[item]?.value

                if (item == 'sign_date') {
                    tempObj[item] = moment(defaultValue[item]?.value)
                } else {
                    tempObj[item] = defaultValue[item]['value']
                }

            }

            // tempObj.cgdqx = [moment(tempObj.transition_start), moment(tempObj.transition_end)]
            formlement.setFieldsValue(tempObj)
        }




        let tempArr = []
        eventbus.on('heji', (val) => {

            let { con_frame_total, con_bconcrete_total, con_bwood_total, wqq_sum, jyx_sum } = val
            let contat = [con_frame_total, con_bconcrete_total, con_bwood_total, wqq_sum, jyx_sum]

            queryAsset(val)
            // console.log(contat);
            // let tempArr = JSON.parse(JSON.stringify(compensateJa))
            tempArr.push(...contat)
            // setCompensateJa(tempArr)
            setPlacement_method(val)
            setformC(placement_method)
            if (val.placement_method == '货币补偿') { //货币补偿
                setHiddenExchange(false)
                setHiddenCurrency(true)
                let bc = val.total_confirmed_area <= 45 ? val.total_confirmed_area : 0
                let tempArr = [val.con_frame_area_total, val.con_bconcrete_area_total, val.con_bwood_area_total]
                let djArr = [val.con_frame_price, val.con_bconcrete_price, val.con_bwood_price]
                let maxdj = 0
                tempArr.forEach((item, i) => {
                    if (!item) {
                        djArr.splice(i, 1)
                        tempArr.splice(i, 1)
                    }
                })
                if (tempArr.length > 1) {
                    djArr.forEach((item, i) => {
                        if (maxdj < item) {
                            maxdj = item
                            console.log(maxdj, '=============');
                        }
                    })
                } else {
                    maxdj = djArr[0]
                }
                console.log(maxdj, tempArr, '=========对应单价');
                let a = val.total_confirmed_area <= 45 ? 45 : val.total_confirmed_area
                let djcs = { jt_monetary_indemnity_removal: formlement.getFieldsValue().jt_monetary_indemnity_removal, jt_monetary_indemnity_removal_times: formlement.getFieldsValue().jt_monetary_indemnity_removal_times, jt_monetary_indemnity_placement: formlement.getFieldsValue().jt_monetary_indemnity_placement, jt_monetary_indemnity_placement_months: formlement.getFieldsValue().jt_monetary_indemnity_placement_months }
                formlement.setFieldsValue({
                    qt_money: maxdj * bc,
                    jt_monetary_total: a * djcs.jt_monetary_indemnity_removal * djcs.jt_monetary_indemnity_removal_times,
                    jt_monetary_indemnity_total: a * djcs.jt_monetary_indemnity_placement * djcs.jt_monetary_indemnity_placement_months
                })

            } else {//产权调换
                setHiddenExchange(true)
                let djcs = { jt_monetary_indemnity_removal: formlement.getFieldsValue().jt_monetary_indemnity_removal, jt_monetary_indemnity_removal_times: formlement.getFieldsValue().jt_monetary_indemnity_removal_times, jt_monetary_indemnity_placement: formlement.getFieldsValue().jt_monetary_indemnity_placement, jt_monetary_indemnity_placement_months: formlement.getFieldsValue().jt_monetary_indemnity_placement_months } //货币补偿
                let cqcs = { jt_monetary_indemnity_removal: formlement.getFieldsValue().jt_equity_exchange_removal, jt_monetary_indemnity_removal_times: formlement.getFieldsValue().jt_equity_exchange_removal_times, jt_monetary_indemnity_placement: formlement.getFieldsValue().jt_equity_exchange_placement, jt_monetary_indemnity_placement_months: formlement.getFieldsValue().jt_equity_exchange_placement_monthsmax } //产权调换

                let zhuanh = { a: val.qf_area ? val.qf_area : 0, b: val.xf_area ? val.xf_area : 0, c: val.dh_area ? val.dh_area : 0 }
                let tmepsum = zhuanh.a + zhuanh.b

                if (val.total_confirmed_area > tmepsum) {
                    let deff = val.total_confirmed_area - tmepsum
                    formlement.setFieldsValue({
                        jt_monetary_total: deff * djcs.jt_monetary_indemnity_removal * djcs.jt_monetary_indemnity_removal_times,
                        jt_equity_total: tmepsum * cqcs.jt_monetary_indemnity_removal * cqcs.jt_monetary_indemnity_removal_times,
                        jt_monetary_indemnity_total: deff * djcs.jt_monetary_indemnity_placement * djcs.jt_monetary_indemnity_placement_months,
                        jt_equity_exchange_total: tmepsum * cqcs.jt_monetary_indemnity_placement * cqcs.jt_monetary_indemnity_placement_months,
                    })

                } else {
                    formlement.setFieldsValue({
                        jt_equity_total: val.total_confirmed_area * cqcs.jt_monetary_indemnity_removal * cqcs.jt_monetary_indemnity_removal_times,
                        jt_equity_exchange_total: val.total_confirmed_area * cqcs.jt_monetary_indemnity_placement * cqcs.jt_monetary_indemnity_placement_months,
                    })
                    setHiddenCurrency(false)

                }
            }


            formlement.setFieldsValue({
                yj_compensation: val.partyb_to_a,

            })
        })
        eventbus.on('quan', (val) => {
            let { total_amount } = val
            // let tempArr = JSON.parse(JSON.stringify(compensateJa))
            // console.log(total_amount);
            tempArr.push(total_amount)
            setCompensateJa(tempArr)
        })
        eventbus.emit('settlementDidmount', {})
        let { qt_money, jt_monetary_total, jt_equity_total, jt_monetary_indemnity_total, jt_equity_exchange_total, jt_signed, jt_move, jt_outsourcing } = formlement.getFieldValue()
        // let tempArr = JSON.parse(JSON.stringify(compensateJa))
        let contat = [qt_money, jt_monetary_total, jt_equity_total, jt_monetary_indemnity_total, jt_equity_exchange_total, jt_signed, jt_move, jt_outsourcing]
        tempArr.push(...contat)
        setCompensateJa(tempArr)

        formlement.setFieldsValue({
            jy_compensation: compenJaSum(tempArr)
        })

        // console.log(compensate);
    }, [updateSet]);



    useImperativeHandle(cRef, () => ({
        // changeVal 就是暴露给父组件的方法

        changeVal: (newVal) => {
            let labelArr = document.querySelectorAll('.settlement label')
            let valueArr = formlement.getFieldsValue()
            // let err2
            formlement.validateFields()
            // .catch(erro => {
            //     err2 = erro

            // })
            let transformation = {}
            labelArr.forEach(x => {
                let key = x.getAttribute('for')
                if (key == 'cgdqx') {
                    if (Array.isArray(valueArr[key])) {
                        transformation.transition_start = new Date(valueArr[key][0]).getTime()
                        transformation.transition_end = new Date(valueArr[key][1]).getTime()
                    }
                } else {
                    transformation[key] = valueArr[key]
                }

            })
            console.log(transformation.sign_date, '=============date');
            transformation.sign_date = new Date(transformation.sign_date?._d).getTime()
            // if (err2) transformation.err2 = err2
            // transformation.childData = []
            // transformation.childData.push({ buss_compensation: jydata })
            // transformation.childData.push({ uncon_compensation: dataTable })
            // transformation.childData.push({ buss_compensation: placeTable })
            // // jydata
            return transformation
            // click(transformation)
        }
    }));
    //
    const queryAsset = (val) => {
        queryAssetById('ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let b = a.filter(item => {
                return item.project_name == val.project_name
            })
            // console.log(b, '======')
            let btemp = b[0] || {}

            formlement.setFieldsValue({
                jt_signed: btemp?.special_sign * val.total_confirmed_area,
                jt_move: btemp?.special_move * val.total_confirmed_area,
            })
            if (val.placement_method == '货币补偿') {
                setHiddenCurrency(true)
                formlement.setFieldsValue({
                    jt_outsourcing: btemp?.buy_out_house * val.total_confirmed_area,
                })
            } else {
                let zhuanh = { a: val.qf_area ? val.qf_area : 0, b: val.xf_area ? val.xf_area : 0, c: val.dh_area ? val.dh_area : 0 }
                let tmepsum = zhuanh.a + zhuanh.b
                if (val.total_confirmed_area > tmepsum) {
                    setHiddenCurrency(true)
                    formlement.setFieldsValue({
                        jt_outsourcing: btemp?.buy_out_house * (val.total_confirmed_area - tmepsum)
                    })
                } else {
                    setHiddenCurrency(false)
                }
            }

            setPiceF(btemp)
            // console.log(b[0].buss_price, '======');


            // let temp =b.map
        })
    };


    //甲补乙金额
    const compenJaSum = (Arr) => {
        let sum = 0
        Arr.forEach(x => {
            if (x) {
                sum += x
            } else {
                sum += 0
            }
        })
        return sum
    }


    const onFormLayoutChange = ({ disabled }) => {
        setComponentDisabled(disabled);
    };
    //小写转大写
    const atoc = (numberValue) => {
        var numberValue = new String(Math.round(numberValue * 100));   //   数字金额  
        var chineseValue = "";                     //   转换后的汉字金额  
        var String1 = "零壹贰叁肆伍陆柒捌玖";               //   汉字数字  
        var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分";           //   对应单位  
        var len = numberValue.length;                   //   numberValue   的字符串长度  
        var Ch1;                           //   数字的汉语读法  
        var Ch2;                           //   数字位的汉字读法  
        var nZero = 0;                         //   用来计算连续的零值的个数  
        var String3;                         //   指定位置的数值  
        if (len > 15) {
            alert("超出计算范围");
            return "";
        }
        if (numberValue == 0) {
            chineseValue = "零元整";
            return chineseValue;
        }

        String2 = String2.substr(String2.length - len, len);       //   取出对应位数的STRING2的值  
        for (var i = 0; i < len; i++) {
            String3 = parseInt(numberValue.substr(i, 1), 10);       //   取出需转换的某一位的值  
            if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
                if (String3 == 0) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                }
                else if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
                else {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
            }
            else {                             //   该位是万亿，亿，万，元位等关键位  
                if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
                else if (String3 != 0 && nZero == 0) {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
                else if (String3 == 0 && nZero >= 3) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                }
                else {
                    Ch1 = "";
                    Ch2 = String2.substr(i, 1);
                    nZero = nZero + 1;
                }
                if (i == (len - 11) || i == (len - 3)) {         //   如果该位是亿位或元位，则必须写上  
                    Ch2 = String2.substr(i, 1);
                }
            }
            chineseValue = chineseValue + Ch1 + Ch2;
        }

        if (String3 == 0) {                       //   最后一位（分）为0时，加上“整”  
            chineseValue = chineseValue + "整";
        }

        return chineseValue;
    }
    //是否抵扣
    const deductionChange = (val) => {

        let { jy_compensation, yj_compensation } = formlement.getFieldValue()
        let deff = Math.abs(jy_compensation - yj_compensation)
        let Capitalize
        if (val.target.value == '是') {
            Capitalize = atoc(deff)
            formlement.setFieldsValue({
                rmb_lowercase: deff,
                rmb_capital: Capitalize
            })
        } else {
            formlement.setFieldsValue({
                rmb_lowercase: formlement.getFieldsValue().jy_compensation,
                rmb_capital: ''
            })
        }
    }
    const jieChange = () => {
        let val = JSON.parse(JSON.stringify(formC))

        if (val.placement_method == '货币补偿') { //货币补偿

            setHiddenExchange(false)
            setHiddenCurrency(true)
            let bc = val.total_confirmed_area <= 45 ? val.total_confirmed_area : 0
            let tempArr = [val.con_frame_area_total, val.con_bconcrete_area_total, val.con_bwood_area_total]
            let djArr = [val.con_frame_price, val.con_bconcrete_price, val.con_bwood_price]
            let maxdj = 0
            tempArr.forEach((item, i) => {
                if (!item) {
                    djArr.splice(i, 1)
                    tempArr.splice(i, 1)
                }
            })
            if (tempArr.length > 1) {
                djArr.forEach((item, i) => {
                    if (maxdj < item) {
                        maxdj = item
                    }
                })
            } else {
                maxdj = djArr[0]
            }

            let a = val.total_confirmed_area <= 45 ? 45 : val.total_confirmed_area
            let djcs = { jt_monetary_indemnity_removal: formlement.getFieldsValue().jt_monetary_indemnity_removal, jt_monetary_indemnity_removal_times: formlement.getFieldsValue().jt_monetary_indemnity_removal_times, jt_monetary_indemnity_placement: formlement.getFieldsValue().jt_monetary_indemnity_placement, jt_monetary_indemnity_placement_months: formlement.getFieldsValue().jt_monetary_indemnity_placement_months }
            formlement.setFieldsValue({
                qt_money: maxdj * bc,
                jt_monetary_total: a * djcs.jt_monetary_indemnity_removal * djcs.jt_monetary_indemnity_removal_times,
                jt_monetary_indemnity_total: a * djcs.jt_monetary_indemnity_placement * djcs.jt_monetary_indemnity_placement_months
            })

        } else {//产权调换
            setHiddenExchange(true)
            let djcs = { jt_monetary_indemnity_removal: formlement.getFieldsValue().jt_monetary_indemnity_removal, jt_monetary_indemnity_removal_times: formlement.getFieldsValue().jt_monetary_indemnity_removal_times, jt_monetary_indemnity_placement: formlement.getFieldsValue().jt_monetary_indemnity_placement, jt_monetary_indemnity_placement_months: formlement.getFieldsValue().jt_monetary_indemnity_placement_months } //货币补偿
            let cqcs = { jt_monetary_indemnity_removal: formlement.getFieldsValue().jt_equity_exchange_removal, jt_monetary_indemnity_removal_times: formlement.getFieldsValue().jt_equity_exchange_removal_times, jt_monetary_indemnity_placement: formlement.getFieldsValue().jt_equity_exchange_placement, jt_monetary_indemnity_placement_months: formlement.getFieldsValue().jt_equity_exchange_placement_monthsmax } //产权调换

            let zhuanh = { a: val.qf_area ? val.qf_area : 0, b: val.xf_area ? val.xf_area : 0, c: val.dh_area ? val.dh_area : 0 }
            let tmepsum = zhuanh.a + zhuanh.b

            if (val.total_confirmed_area > tmepsum) {
                let deff = val.total_confirmed_area - tmepsum
                formlement.setFieldsValue({
                    jt_monetary_total: deff * djcs.jt_monetary_indemnity_removal * djcs.jt_monetary_indemnity_removal_times,
                    jt_equity_total: tmepsum * cqcs.jt_monetary_indemnity_removal * cqcs.jt_monetary_indemnity_removal_times,
                    jt_monetary_indemnity_total: deff * djcs.jt_monetary_indemnity_placement * djcs.jt_monetary_indemnity_placement_months,
                    jt_equity_exchange_total: tmepsum * cqcs.jt_monetary_indemnity_placement * cqcs.jt_monetary_indemnity_placement_months,
                })

            } else {
                formlement.setFieldsValue({
                    jt_equity_total: val.total_confirmed_area * cqcs.jt_monetary_indemnity_removal * cqcs.jt_monetary_indemnity_removal_times,
                    jt_equity_exchange_total: val.total_confirmed_area * cqcs.jt_monetary_indemnity_placement * cqcs.jt_monetary_indemnity_placement_months,
                })
                setHiddenCurrency(false)

            }
        }
    }
    return (
        <Form
            className='settlement'
            form={formlement}
            labelWrap={true}
            labelCol={{ span: 6, }}
            wrapperCol={{ span: 14, }}
            size='large'
            layout="horizontal"
            initialValues={{
                disabled: componentDisabled,
                jt_monetary_indemnity_removal: 8,
                jt_monetary_indemnity_removal_times: 1,
                jt_equity_exchange_removal: 8,
                jt_equity_exchange_removal_times: 2,
                jt_monetary_indemnity_placement: 8,
                jt_monetary_indemnity_placement_months: 3,
                jt_equity_exchange_placement: 8,
                jt_equity_exchange_placement_monthsmax: 36
            }}
            onValuesChange={onFormLayoutChange}
            disabled={componentDisabled}
        >

            <Row justify="center">
                <Col span={8}>
                    <Form.Item label="设施设备搬迁费" name='sssbbqf' >
                        <Input />
                    </Form.Item></Col>
                <Col span={8}><Form.Item label="失业补助" name='ssbz'>
                    <Input />
                </Form.Item></Col>
                <Col span={8}><Form.Item label="停产停业损失补助" name='tctyssbc' >
                    <Input />
                </Form.Item></Col>


            </Row>
            <div className='title_public'  > <ProfileOutlined /> 其他补偿事项</div>

            <Form.Item labelCol={{ span: 2, }} label="7补偿金额" name='qt_money'>
                <Input />
            </Form.Item>
            <Form.Item labelCol={{ span: 2, }} label="备注" name='other_moneytary'>
                <Input type='textarea' />
            </Form.Item>


            <div className='title_public'  > <ProfileOutlined /> 搬迁费</div>
            <div style={{ display: hiddenCurrency ? 'block' : 'none' }} >
                <Row justify="center">
                    <Col span={8}>
                        <Form.Item label="货币补偿搬迁单价" name='jt_monetary_indemnity_removal' >
                            <InputNumber onChange={() => { jieChange() }} />
                        </Form.Item></Col>
                    <Col span={8}><Form.Item label="搬迁次数" name='jt_monetary_indemnity_removal_times'>
                        <InputNumber onChange={() => { jieChange() }} />
                    </Form.Item></Col>
                    <Col span={8}><Form.Item label="8计算" name='jt_monetary_total' >
                        <Input />
                    </Form.Item></Col>
                </Row>
            </div>
            <div style={{ display: hiddenExchange ? 'block' : 'none' }} >
                <Row justify="center">
                    <Col span={8}>
                        <Form.Item label="C产权调换搬迁单价" name='jt_equity_exchange_removal' >
                            <InputNumber onChange={() => { jieChange() }} />
                        </Form.Item></Col>
                    <Col span={8}><Form.Item label="C搬迁次数" name='jt_equity_exchange_removal_times' >
                        <InputNumber onChange={() => { jieChange() }} />
                    </Form.Item></Col>
                    <Col span={8}><Form.Item label="9计算 " name='jt_equity_total' >
                        <Input />
                    </Form.Item></Col>
                </Row>
            </div>
            <div className='title_public'  > <ProfileOutlined /> 临时安置费</div>
            <div style={{ display: hiddenCurrency ? 'block' : 'none' }} >
                <Row justify="center">
                    <Col span={8}>
                        <Form.Item label="货币补偿安置单价" name='jt_monetary_indemnity_placement' >
                            <InputNumber onChange={() => { jieChange() }} />
                        </Form.Item></Col>
                    <Col span={8}><Form.Item label="安置月数" name='jt_monetary_indemnity_placement_months'>
                        <InputNumber onChange={() => { jieChange() }} />
                    </Form.Item></Col>
                    <Col span={8}><Form.Item label="10计算" name='jt_monetary_indemnity_total'  >
                        <Input />
                    </Form.Item></Col>
                </Row>
            </div>
            <div style={{ display: hiddenExchange ? 'block' : 'none' }} >
                <Row justify="center">
                    <Col span={6}>
                        <Form.Item label="C产权调换安置单价" name='jt_equity_exchange_placement' >
                            <InputNumber onChange={() => { jieChange() }} />
                        </Form.Item></Col>
                    <Col span={6}><Form.Item label="C过渡期限" name='cgdqx' >
                        <RangePicker />
                    </Form.Item></Col>
                    <Col span={6}><Form.Item label="C安置月数" name='jt_equity_exchange_placement_monthsmax' >
                        <InputNumber onChange={() => { jieChange() }} />
                    </Form.Item></Col>
                    <Col span={6}><Form.Item label="11计算" name='jt_equity_exchange_total'>
                        <InputNumber onChange={() => { jieChange() }} />
                    </Form.Item></Col>
                </Row>
            </div>
            <div className='title_public'  > <ProfileOutlined /> 奖励及补贴条款</div>
            <Row justify="center">
                <Col span={8}>
                    <Form.Item label="12特殊签约" name='jt_signed' >
                        <InputNumber />
                    </Form.Item></Col>
                <Col span={8}><Form.Item label="13特殊搬家" name='jt_move'>
                    <InputNumber />
                </Form.Item></Col>
                <Col span={8}>
                    <div style={{ display: hiddenCurrency ? 'block' : 'none' }} >
                        <Form.Item label="14外购住房" name='jt_outsourcing'>
                            <InputNumber />
                        </Form.Item>
                    </div  >
                </Col>
            </Row>

            <div className='title_public' index={compensateJa} > <ProfileOutlined /> 双方结算</div>



            <Row>
                <Col span={6}>
                    <Form.Item label="甲补乙金额（元）" name='jy_compensation' >
                        <Input />
                    </Form.Item></Col>
                <Col span={6}><Form.Item label="乙补甲金额（元）" name='yj_compensation'>
                    <Input />
                </Form.Item></Col>
                <Col span={6}><Form.Item label="是否抵扣" name='if_deduction' rules={[
                    {
                        required: true,
                        message: '必填',

                    },]}>
                    <Radio.Group onChange={(value) => { deductionChange(value) }}>
                        <Radio value="是"> 是 </Radio>
                        <Radio value="否"> 否 </Radio>
                    </Radio.Group>
                </Form.Item></Col>
                <Col span={6}><Form.Item label="甲方" name='partya'>
                    <Input />
                </Form.Item></Col>

            </Row>
            <Row>
                <Col span={6}>
                    <Form.Item label="抵扣后金额小写" name='rmb_lowercase' >
                        <Input />
                    </Form.Item></Col>
                <Col span={6}><Form.Item label="抵扣后金额大写" name='rmb_capital'>
                    <Input />
                </Form.Item></Col>
                <Col span={6}><Form.Item label="签约日期" name='sign_date'>
                    <DatePicker />
                </Form.Item></Col>
                <Col span={6}><Form.Item label="乙方" name='partyb'>
                    <Input />
                </Form.Item></Col>

            </Row>








            <Form.Item label="预付款金额" name='yfk_money' >
                <Input />
            </Form.Item>
        </Form>
    );
};

export default Settlement;