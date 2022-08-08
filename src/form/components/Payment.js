import React, { useState, useEffect, useImperativeHandle } from "react";
import { Form, Button, Space, Table, Input, DatePicker, ConfigProvider, InputNumber } from "antd";
import { queryAssetById } from '../api/asset.js'
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import "./payment.less";
import formatFn from '../uilts/uilt.js';
import FormItem from "antd/es/form/FormItem/index.js";

const Payment = ({ cRef, click, defaultValue }) => {
    const [formpay] = Form.useForm();
    let [rowId, setRowID] = useState(0);
    let [tableData, setTableData] = useState([]);
    let [totalMoney, setTotalMoney] = useState([]);
    useEffect(() => {

        if (defaultValue && defaultValue.data_id) {
            let tempObj = {};
            for (let item in defaultValue) {
                tempObj[item] = defaultValue[item]['value']
            }

            formpay.setFieldsValue(tempObj)
            // let tempArr=[]
            defaultValue?.childData?.forEach(x => {
                if (Object.keys(x)[0] == 'evaluation_plan1jt') {

                    // x.evaluation_plan1jt.map(item => {
                    //     item['payment_time'] = moment(item['payment_time']?.value)

                    //     item['application_money'] = item['application_money']?.value
                    // })
                    x.evaluation_plan1jt.forEach(y => {

                        for (const key in y) {

                            if (y[key]?.value) y[key] = y[key]?.value
                            if (key == 'payment_time') y[key] = moment(y[key])

                        }
                    })


                    setTableData(x.evaluation_plan1jt)
                }
            })

        }
        // let rowKey = JSON.parse(JSON.stringify(rowId));
        // let message = [
        //     {
        //         payment: "",
        //         paymentTime: "",
        //     },
        //     {
        //         payment: "",
        //         paymentTime: "",
        //     },
        //     {
        //         payment: "",
        //         paymentTime: "",
        //     },
        //     {
        //         payment: "",
        //         paymentTime: "",
        //     },
        // ];
        // message.forEach((item, index) => {
        //     item.rowId = ++rowKey;
        // });
        // setRowID(rowKey);
        // setTableData(message);
        // queryAsset()
    }, []);
    useImperativeHandle(cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        changeVal: (newVal) => {

            let labelArr = document.querySelectorAll('.formpay label')
            let valueArr = formpay.getFieldsValue()
            let transformation = {}
            labelArr.forEach(x => {
                let key = x.getAttribute('for')
                transformation[key] = valueArr[key]
            })
            transformation.childData = [];
            tableData.map(item => {
                item['payment_time'] = new Date(moment(item['payment_time'])._i).getTime()
            })
            transformation.childData.push({ evaluation_plan1jt: tableData })
            // jydata
            return transformation
            click(transformation)
        }
    }));

    const queryAsset = () => {
        queryAssetById('790595b9-42c8-fe42-6209-fe4e834425b2').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let tempTable = a.map((x) => {

                return { application_money: x.application_money, payment_time: moment(x.payment_time) }
            })


            setTableData(tempTable)
            let sum = 0;
            tempTable.forEach((item, index) => {
                if (item.application_money) {
                    sum = sum + parseInt(item.application_money);
                }
            });

            setTotalMoney(sum);
            // let temp =b.map
        })
    };



    const columns = [
        {
            title: "打款金额	",
            dataIndex: "application_money",
            key: "application_money	",
            render: (text, record, index) => <InputNumber type={"number"} onChange={(val) => { inputChange(val, index) }} value={text}></InputNumber>,
        },
        {
            title: "打款时间	",
            dataIndex: "payment_time",
            key: "payment_time",
            render: (text, record, index) => (


                <ConfigProvider locale={zhCN}>
                    <DatePicker defaultValue={text} onChange={(val) => { datePickerChange(val, index) }} placeholder=""></DatePicker>
                </ConfigProvider>

            ),
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <a style={{ cursor: "pointer" }} onClick={deletRow.bind(text, record)}>
                        删除
                    </a>
                </Space>
            ),
        },
    ];

    // 合计input change方法
    const totalMoneyChange = (e) => {
        let message = JSON.parse(JSON.stringify(totalMoney));
        message = e.target.value;
        setTotalMoney(message);
    };
    //行内input change方法
    const inputChange = (val, index) => {
        let message = JSON.parse(JSON.stringify(tableData));
        console.log(val);
        message[index].application_money = val;
        setTableData(message);
        let sum = 0;
        message.forEach((item, index) => {
            if (item.application_money) {
                sum = sum + parseInt(item.application_money);
            }
        });

        setTotalMoney(sum);
    };
    //行内datePicker方法
    const datePickerChange = (val, index) => {

        let message = JSON.parse(JSON.stringify(tableData));
        message[index].payment_time = moment(val).format("YYYY-MM-DD");
        setTableData(message);
    };
    // 删除行
    const deletRow = (text, record) => {
        console.log(text, tableData);
        let message = JSON.parse(JSON.stringify(tableData));
        message.forEach((item, index) => {
            if (item.rowId === text.rowId) {
                message.splice(index, 1);
                setTableData(message);
                index--;
            }
        });
    };
    // 添加行
    const addNewRow = () => {
        let rowKey = JSON.parse(JSON.stringify(rowId));
        let message = JSON.parse(JSON.stringify(tableData));

        let info = {
            rowId: ++rowKey,
            application_money: "",
            payment_time: '',
        };

        message.push(info);
        console.log(message);
        setTableData(message);
        setRowID(rowKey);
    };
    return (
        <>

            <Form
                form={formpay}
                className='formpay'

            >



                <Table
                    rowKey={(text) => text.rowId}
                    rowClassName={(record, index) => (index % 2 !== 0 ? "antTableStyle" : "")}
                    bordered
                    columns={columns}
                    pagination={false}
                    dataSource={tableData}
                />
                <div className="newAddBox">
                    <Button className="newAdd" onClick={addNewRow.bind()}>
                        +新增
                    </Button>
                </div>
                <FormItem name='total_dakuan'>
                    <div className="totalMoney">
                        <span>合计打款金额： </span>
                        <Input className="totalMoneyInput" value={totalMoney} onChange={totalMoneyChange}></Input>
                    </div>
                </FormItem>
            </Form>
        </>
    );
};

export default Payment;
