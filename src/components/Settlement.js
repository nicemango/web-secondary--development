import React, { useState, useEffect } from 'react';
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
import eventbus from '../uilts/eventbus'
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Settlement = ({ updateSet }) => {
    const [formlement] = Form.useForm();
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [hiddenExchange, setHiddenExchange] = useState(true)
    const [hiddenCurrency, setHiddenCurrency] = useState(true)
    const [compensateJa, setCompensateJa] = useState([])
    // const [temp, settemp] = useState(0);


    useEffect(() => {
        let tempArr = []
        eventbus.on('heji', (val) => {

            let { con_frame_total, con_bconcrete_total, con_bwood_total, wqq_sum, jyx_sum } = val
            let contat = [con_frame_total, con_bconcrete_total, con_bwood_total, wqq_sum, jyx_sum]
            // console.log(contat);
            // let tempArr = JSON.parse(JSON.stringify(compensateJa))
            tempArr.push(...contat)
            // setCompensateJa(tempArr)
            if (val.placement_method == '0') { //货币补偿
                setHiddenExchange(false)
                setHiddenCurrency(true)
                let bc = val.total_confirmed_area <= 45 ? val.total_confirmed_area : 0
                let tempArr = [val.con_frame_area_total, val.con_bconcrete_area_total, val.con_bwood_area_total]
                let djArr = [val.kjdj, val.zhdj, val.zmdj]
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
                let djcs = { bcdj: formlement.getFieldsValue().bcdj, bqcs: formlement.getFieldsValue().bqcs, azdj: formlement.getFieldsValue().azdj, azys: formlement.getFieldsValue().azys }
                formlement.setFieldValue({
                    qt_money: maxdj * bc,
                    jt_monetary_total: a * djcs.bcdj * djcs.bqcs,
                    jt_monetary_indemnity_total: a * djcs.azdj * djcs.azys
                })

            } else {//产权调换
                setHiddenExchange(true)
                let djcs = { bcdj: formlement.getFieldsValue().bcdj, bqcs: formlement.getFieldsValue().bqcs, azdj: formlement.getFieldsValue().azdj, azys: formlement.getFieldsValue().azys } //货币补偿
                let cqcs = { bcdj: formlement.getFieldsValue().cqdj, bqcs: formlement.getFieldsValue().cbqcs, azdj: formlement.getFieldsValue().cazdj, azys: formlement.getFieldsValue().canzs } //产权调换

                let zhuanh = { a: val.qf_area ? val.qf_area : 0, b: val.xf_area ? val.xf_area : 0, c: val.dhmj ? val.dhmj : 0 }
                let tmepsum = zhuanh.a + zhuanh.b + zhuanh.c

                if (val.total_confirmed_area > tmepsum) {
                    let deff = val.total_confirmed_area - tmepsum
                    formlement.setFieldValue({
                        jt_monetary_total: deff * djcs.bcdj * djcs.bqcs,
                        jt_equity_total: tmepsum * cqcs.bcdj * cqcs.bqcs,
                        jt_monetary_indemnity_total: deff * djcs.azdj * djcs.azys,
                        jt_equity_exchange_total: tmepsum * cqcs.azdj * cqcs.azys,
                    })

                } else {
                    formlement.setFieldValue({
                        jt_equity_total: val.total_confirmed_area * cqcs.bcdj * cqcs.bqcs,
                        jt_equity_exchange_total: val.total_confirmed_area * cqcs.azdj * cqcs.azys,
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
    }, [updateSet.pro]);

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
        if (val.target.value == '1') {
            Capitalize = atoc(deff)
            formlement.setFieldsValue({
                rmb_lowercase: deff,
                rmb_capital: Capitalize
            })
        } else {

        }
    }

    return (
        <Form
            form={formlement}
            labelWrap={true}
            labelCol={{ span: 6, }}
            wrapperCol={{ span: 14, }}
            size='large'
            layout="horizontal"
            initialValues={{
                disabled: componentDisabled,
                bcdj: 8,
                bqcs: 1,
                cqdj: 8,
                cbqcs: 2,
                azdj: 8,
                azys: 3,
                cazdj: 8,
                canzs: 36
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
            <Form.Item labelCol={{ span: 2, }} label="备注">
                <Input type='textarea' />
            </Form.Item>


            <div className='title_public'  > <ProfileOutlined /> 搬迁费</div>
            <Row justify="center">
                <Col span={8}>
                    <Form.Item label="货币补偿搬迁单价" name='bcdj' >
                        <Input />
                    </Form.Item></Col>
                <Col span={8}><Form.Item label="搬迁次数" name='bqcs'>
                    <Input />
                </Form.Item></Col>
                <Col span={8}><Form.Item label="8计算" name='jt_monetary_total' >
                    <Input />
                </Form.Item></Col>
            </Row>
            <div style={{ display: hiddenExchange ? 'block' : 'none' }} >
                <Row justify="center">
                    <Col span={8}>
                        <Form.Item label="C产权调换搬迁单价" name='cqdj' >
                            <Input />
                        </Form.Item></Col>
                    <Col span={8}><Form.Item label="C搬迁次数" name='cbqcs' >
                        <Input />
                    </Form.Item></Col>
                    <Col span={8}><Form.Item label="9计算 " name='jt_equity_total' >
                        <Input />
                    </Form.Item></Col>
                </Row>
            </div>
            <div className='title_public'  > <ProfileOutlined /> 临时安置费</div>
            <Row justify="center">
                <Col span={8}>
                    <Form.Item label="货币补偿安置单价" name='azdj' >
                        <Input />
                    </Form.Item></Col>
                <Col span={8}><Form.Item label="安置月数" name='azys'>
                    <Input />
                </Form.Item></Col>
                <Col span={8}><Form.Item label="10计算" name='jt_monetary_indemnity_total'  >
                    <Input />
                </Form.Item></Col>
            </Row>
            <div style={{ display: hiddenExchange ? 'block' : 'none' }} >
                <Row justify="center">
                    <Col span={6}>
                        <Form.Item label="C产权调换安置单价" name='cazdj' >
                            <Input />
                        </Form.Item></Col>
                    <Col span={6}><Form.Item label="C过渡期限" name='cgdqx' >
                        <RangePicker />
                    </Form.Item></Col>
                    <Col span={6}><Form.Item label="C安置月数" name='canzs' >
                        <Input />
                    </Form.Item></Col>
                    <Col span={6}><Form.Item label="11计算" name='jt_equity_exchange_total'>
                        <Input />
                    </Form.Item></Col>
                </Row>
            </div>
            <div className='title_public'  > <ProfileOutlined /> 奖励及补贴条款</div>
            <Row justify="center">
                <Col span={8}>
                    <Form.Item label="12特殊签约" name='jt_signed' >
                        <Input />
                    </Form.Item></Col>
                <Col span={8}><Form.Item label="13特殊搬家" name='jt_move'>
                    <Input />
                </Form.Item></Col>
                <Col span={8}>
                    <div style={{ display: hiddenExchange ? 'block' : 'none' }} >
                        <Form.Item label="14外购住房" name='jt_outsourcing'>
                            <Input />
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
                <Col span={6}><Form.Item label="是否抵扣" name='if_deduction' >
                    <Radio.Group onChange={(value) => { deductionChange(value) }}>
                        <Radio value="1"> 是 </Radio>
                        <Radio value="2"> 否 </Radio>
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








            <Form.Item label="预付款金额">
                <Input />
            </Form.Item>
        </Form>
    );
};

export default Settlement;