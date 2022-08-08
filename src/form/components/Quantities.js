import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    Upload,
    Col, Row, Table, InputNumber, message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { queryAssetById, getProvinceArea, getAreaByParent, getDataWithSort } from '../api/asset.js'
import eventbus from '../uilts/eventbus'
import formatFn from '../uilts/uilt.js';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const Quantities = ({ cRef, click, defaultValue, temp }) => {
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

        // let rowKey = JSON.parse(JSON.stringify(rowId));
        // let message1 = [
        //     {
        //         a: "",
        //         b: "",
        //         c: "",
        //         d: "",
        //         e: "",
        //         f: "",
        //     },

        // ];
        // message1.forEach((item, index) => {
        //     item.rowId = ++rowKey;
        // });
        // setRowID(rowKey);
        // setdataTable(message1);
        if (defaultValue && defaultValue.data_id) {
            let tempObj = {};
            for (let item in defaultValue) {
                tempObj[item] = defaultValue[item]['value']
            }

            formquan.setFieldsValue(tempObj)

            defaultValue?.childData?.forEach(x => {
                if (Object.keys(x)[0] == 'split_info_decorate') {
                    x.split_info_decorate.forEach(y => {
                        for (const key in y) {
                            if (y[key] && (y[key].value || y[key].value == '')) y[key] = y[key].value


                        }
                    })
                    setdataTable(x.split_info_decorate)
                }
                if (Object.keys(x)[0] == 'split_info_attached') {
                    x.split_info_attached.forEach(y => {
                        for (const key in y) {
                            if (y[key] && (y[key].value || y[key].value == '')) y[key] = y[key]?.value


                        }
                    })
                    setdataTableF(x.split_info_attached)
                }

            })

            queryAsset()
        } else {
            queryAsset()
        }
        eventbus.on('settlementDidmount', () => {

            let collet = JSON.parse(JSON.stringify(formquan.getFieldValue()))
            eventbus.emit('quan', collet)
        })


        //接受被征收人的信息
        eventbus.on('didcoll', (val) => {

            queryHouseId(val)
            querybaogan(val)
            setSplit_info(val)
        })
        eventbus.emit('coll',)


        // console.log(compensate);
    }, [temp]);
    useImperativeHandle(cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        changeVal: (newVal) => {
            let labelArr = document.querySelectorAll('.quantities label')
            let valueArr = formquan.getFieldsValue()
            let transformation = {}
            labelArr.forEach(x => {
                let key = x.getAttribute('for')
                transformation[key] = valueArr[key]
            })
            transformation.childData = []
            transformation.childData.push({ split_info_decorate: dataTable })
            transformation.childData.push({ split_info_attached: dataTableF })
            return transformation
            click(transformation)
        }
    }));
    useEffect(() => {
        renovationChange(formquan.getFieldValue().zxxz)
    }, [formquan.getFieldValue().decoration_amount])
    useEffect(() => {
        renovationChange(formquan.getFieldValue().zxxz)
    }, [formquan.getFieldValue().attached_shi])
    const queryAsset = () => {
        //z表
        queryAssetById('2fb7db88-cfa8-a43e-755d-db051aeb2e6d').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let tempdecorate = []
            a.map(x => {
                if (x.decorate_name) tempdecorate.push(x.decorate_name)

            })
            let tmep = []
            tempdecorate.forEach(x => {
                if (tmep.indexOf(x) == -1 && temp != null && temp != '') tmep.push(x)
            })
            setDecorateTable(a)
            setDecorate(tmep)
        })
        //f表
        queryAssetById('049d9007-0a4e-3008-0329-09e188491d49').then(res => {
            // console.log(res);
            let a = formatFn(res.data[0], res.data[1])
            let tempdecorate = []
            a.map(x => {
                if (x.decorate_name) tempdecorate.push(x.decorate_name)
            })
            let tmep = []
            tempdecorate.forEach(x => {
                if (tmep.indexOf(x) == -1) tmep.push(x)
            })
            setDecorateTableF(a)
            setDecorateF(tmep)
        })
        // split_info 表

    }
    const queryHouseId = (val) => {
        queryAssetById('db23c3f3-cf31-77d0-ff95-180084df0f59').then(res => {
            console.log(val.house_id);
            let a = formatFn(res.data[0], res.data[1])
            let tempdecorate = []
            a.map(x => {
                if (x.house_id == val.house_id) tempdecorate.push(x)
            })
            formquan.setFieldsValue({

                decorate_pingu: tempdecorate[0]?.decorate_money,
                compensation_amount: tempdecorate[0]?.fs_zje,
            })


        })
    }
    const querybaogan = (val) => {
        queryAssetById('ae1cb3c5-b29d-bb49-d309-3ac8b7bfa988').then(res => {

            let a = formatFn(res.data[0], res.data[1])
            let tempdecorate = []
            a.map(x => {
                if (x.project_name == val.project_name) tempdecorate.push(x)
            })
            formquan.setFieldsValue({
                decorate_baogan: tempdecorate[0]?.jt_decorate_price * val.total_confirmed_area,
            })


        })
    }
    // F附属表
    const addmanagementF = () => {
        let rowKey = JSON.parse(JSON.stringify(rowId));
        let message1 = JSON.parse(JSON.stringify(dataTableF));
        let info = {
            rowId: ++rowKey,
            rowId: ++rowKey,
            decorate_name: "",
            unit: "",
            decorate_data: "",
            engineering_total: "",
            evaluation_unit_price: "",
            min_price: 0,
            max_price: 0,
            estimated_total_price: "",
            upload_photos: "",
            decorate_remark: "",
        };
        message1.push(info);
        setdataTableF(message1);
        setRowID(rowKey);
    }


    //decorate_name unit decorate_data engineering_total evaluation_unit_price min_price max_price estimated_total_price upload_photos decorate_remark
    const addmanagement = () => {
        let rowKey = JSON.parse(JSON.stringify(rowId));
        let message1 = JSON.parse(JSON.stringify(dataTable));
        let info = {
            rowId: ++rowKey,
            decorate_name: "",
            unit: "",
            decorate_data: "",
            engineering_total: "",
            evaluation_unit_price: "",
            min_price: 0,
            max_price: 0,
            estimated_total_price: "",
            upload_photos: "",
            decorate_remark: "",
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
        tempDatatable[index].decorate_name = val
        tempDatatable[index].min_price = item.min_price
        tempDatatable[index].max_price = item.max_price
        tempDatatable[index].unit = item.unit
        tempDatatable[index].evaluation_unit_price = item.evaluation_unit_price
        setdataTable(tempDatatable)
        let zsum = shiLiangSum(tempDatatable)
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
        tempDatatable[index].decorate_name = val
        tempDatatable[index].min_price = item.min_price
        tempDatatable[index].max_price = item.max_price
        tempDatatable[index].unit = item.unit
        tempDatatable[index].evaluation_unit_price = item.evaluation_unit_price
        setdataTableF(tempDatatable)
        let fsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }
    //列求和  实量
    const shiLiangSum = (arrT) => {
        let fsum = 0

        arrT.forEach(x => {
            if (x.estimated_total_price) {
                fsum += x.estimated_total_price
            } else {
                fsum += 0
            }
        })

        return fsum
    }
    //装修3选1
    const renovationChange = (val) => {
        // console.log(formquan.getFieldValue().compensation_amount);
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
    //装修工程量  测量数据
    const dedatazBlur = (e, i) => {

        let val = e.target.value
        if (val == '' || val == null || val == undefined || !val) return
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        let price = tempDatatable[i].evaluation_unit_price ? tempDatatable[i].evaluation_unit_price : 0
        switch (tempDatatable[i].unit) {
            case '平方米':

                if (!SymbolFn(val, 2)) {
                    message.error('输入正确表达式')
                    return
                }
                tempDatatable[i].engineering_total = expressionFn(val)
                tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
                break;

            case '立方米':
                if (!SymbolFn(val, 3)) {
                    message.error('输入正确表达式')
                    return
                }
                tempDatatable[i].engineering_total = expressionFn(val)

                tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
                break;

            default:
                tempDatatable[i].engineering_total = val
                tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
        }
        tempDatatable[i].decorate_data = val
        setdataTable(tempDatatable)
        let zsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            decoration_amount: zsum
        })
    }
    const dedatazChange = (e, i) => {

        let val = e.target.value
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))


        tempDatatable[i].decorate_data = val
        setdataTable(tempDatatable)
        let zsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            decoration_amount: zsum
        })
    }
    const isNumber = (val) => {
        const regPos = /^\d+(\.\d+)?$/ // 非负浮点数
        const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true
        } else {
            return false
        }

    }
    const expressionFn = (val) => {


        // 将字符串分割成数组
        const arr = val.split('')
        // 准备一个容器
        let newArray = []
        // 遍历字符串数组
        arr.forEach((item, i) => {
            // 如果当前字符串是数字
            if (isNumber(item)) {
                // 拿到最后一个数组元素
                let endStr = newArray[newArray.length - 1]
                // 拿到最后一个数组元素的索引
                const endIndex = newArray.length - 1
                // 判断最后一个数组元素是否是数字
                if (isNumber(endStr)) {
                    // 如果最后一个数组元素是数字,则进行拼接
                    endStr += item
                    // 修改最后一个数组元素
                    newArray.splice(endIndex, 1, endStr)
                } else {
                    // 如果最后一个数组元素是运算符,则将当前项直接添加到数组
                    newArray.push(item)
                }
            } else {
                // 如果当前项是运算符,则将当前项直接添加到数组
                newArray.push(item)
            }
        })
        // 将数字与运算符遍历,将字符串类型的数字转换成数字类型
        newArray = newArray.map((item) => (isNumber(item) ? parseFloat(item) : item))

        // 通过递归算法,先判断数组元素是否只有一个,如果只有一个数组元素,则返回这个最终值,如果数组元素
        function sumResutl(arr) {
            // 如果数组元素中有乘除加减运算符
            const i1 = arr.indexOf('*')
            const i2 = arr.indexOf('/')
            const i3 = arr.indexOf('-')
            const i4 = arr.indexOf('+')
            if (i1 !== -1) {
                // 拿到乘号运算符前面数字的索引
                const index = i1 - 1
                // 计算出结果
                const result = arr[index] * arr[i1 + 1]
                // 修改数组元素
                arr.splice(index, 3, result)
                // 如果剩下的元素不只一位,则继续调用函数自身
                if (arr.length > 1) sumResutl(arr)
            } else if (i2 !== -1) {
                // 拿到乘号运算符前面数字的索引
                const index = i2 - 1
                // 计算出结果
                const result = arr[index] / arr[i2 + 1]
                // 修改数组元素
                arr.splice(index, 3, result)
                // 如果剩下的元素不只一位,则继续调用函数自身
                if (arr.length > 1) sumResutl(arr)
            } else if (i3 !== -1) {
                // 拿到乘号运算符前面数字的索引
                const index = i3 - 1
                // 计算出结果
                const result = arr[index] - arr[i3 + 1]
                // 修改数组元素
                arr.splice(index, 3, result)
                // 如果剩下的元素不只一位,则继续调用函数自身
                if (arr.length > 1) sumResutl(arr)
            } else if (i4 !== -1) {
                // 拿到乘号运算符前面数字的索引
                const index = i4 - 1
                // 计算出结果
                const result = arr[index] + arr[i4 + 1]
                // 修改数组元素
                arr.splice(index, 3, result)
                // 如果剩下的元素不只一位,则继续调用函数自身
                if (arr.length > 1) sumResutl(arr)
            }
        }

        sumResutl(newArray)
        return newArray[0]

    }
    const SymbolFn = (val, num) => {
        let jia = val.split('+')
        let cheng = 0
        let result = true
        jia.forEach(x => {
            cheng = x.split('*').length
            if (cheng != num) result = false
        })
        return result

    }
    const totalChange = (val, i) => {
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        let price = tempDatatable[i].evaluation_unit_price ? tempDatatable[i].evaluation_unit_price : 0

        if (tempDatatable[i].decorate_data) {
            return
        } else {
            tempDatatable[i].engineering_total = val
            tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
        }

        setdataTable(tempDatatable)
        let zsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            decoration_amount: zsum
        })
    }
    const priceChange = (val, i) => {

        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        // if (!tempDatatable[i].min_price && !tempDatatable[i].max_price) {
        //     tempDatatable[i].evaluation_unit_price = val

        // } else {
        //     if (val < tempDatatable[i].min_price) {
        //         message.error('不能超过最小单价')
        //         return
        //     }
        //     if (val > tempDatatable[i].max_price) {
        //         message.error('不能超过最大单价')
        //         return
        //     }
        // }
        tempDatatable[i].evaluation_unit_price = val
        tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * tempDatatable[i].evaluation_unit_price
        setdataTable(tempDatatable)

    }
    const priceBlur = (e, i) => {
        let val = e.target.value

        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        if (!tempDatatable[i].min_price && !tempDatatable[i].max_price) {
            tempDatatable[i].evaluation_unit_price = val

        } else {
            if (val < tempDatatable[i].min_price) {
                message.error('不能超过最小单价')
                tempDatatable[i].evaluation_unit_price = tempDatatable[i].min_price
                return
            }
            if (val > tempDatatable[i].max_price) {
                tempDatatable[i].evaluation_unit_price = tempDatatable[i].max_price
                message.error('不能超过最大单价')
                return
            }
        }
        let zsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            decoration_amount: zsum
        })
    }
    const valueUpdata = (val, i, key) => {
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        tempDatatable[i][key] = val.target.value
        setdataTable(tempDatatable)
    }
    //附属工程量  测量数据
    const dedatazBlurF = (e, i) => {

        let val = e.target.value
        if (val == '' || val == null || val == undefined || !val) return
        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))
        let price = tempDatatable[i].evaluation_unit_price ? tempDatatable[i].evaluation_unit_price : 0

        switch (tempDatatable[i].unit) {
            case '平方米':

                if (!SymbolFn(val, 2)) {
                    message.error('输入正确表达式')
                    return
                }
                tempDatatable[i].engineering_total = expressionFn(val)
                tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
                break;

            case '立方米':
                if (!SymbolFn(val, 3)) {
                    message.error('输入正确表达式')
                    return
                }
                tempDatatable[i].engineering_total = expressionFn(val)

                tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
                break;

            default:
                tempDatatable[i].engineering_total = val
                tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
        }
        tempDatatable[i].decorate_data = val
        setdataTableF(tempDatatable)
        let fsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }
    const dedatazChangeF = (e, i) => {

        let val = e.target.value
        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))


        tempDatatable[i].decorate_data = val
        setdataTableF(tempDatatable)
        let fsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }


    const totalChangeF = (val, i) => {
        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))
        let price = tempDatatable[i].evaluation_unit_price ? tempDatatable[i].evaluation_unit_price : 0
        if (tempDatatable[i].decorate_data) {
            return
        } else {
            tempDatatable[i].engineering_total = val
            tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * price
        }
        setdataTableF(tempDatatable)
        let fsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }
    const priceChangeF = (val, i) => {

        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))

        tempDatatable[i].evaluation_unit_price = val
        tempDatatable[i].estimated_total_price = tempDatatable[i].engineering_total * tempDatatable[i].evaluation_unit_price
        setdataTableF(tempDatatable)
        let fsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }
    const priceBlurF = (e, i) => {
        let val = e.target.value
        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))
        if (!tempDatatable[i].min_price && !tempDatatable[i].max_price) {
            tempDatatable[i].evaluation_unit_price = val

        } else {
            if (val < tempDatatable[i].min_price) {
                message.error('不能超过最小单价')
                return
            }
            if (val > tempDatatable[i].max_price) {
                message.error('不能超过最大单价')
                return
            }
        }
        let fsum = shiLiangSum(tempDatatable)
        formquan.setFieldsValue({
            attached_shi: fsum
        })
    }
    const valueUpdataF = (val, i, key) => {
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        tempDatatable[i][key] = val.target.value
        setdataTableF(tempDatatable)
    }


    //图片上传
    const uploadChange = (e, i, key) => {
        // formload.setFieldsValue({
        //     out_photos: '1111111111'
        // })
        let tempDatatable = JSON.parse(JSON.stringify(dataTable))
        tempDatatable[i][key] = JSON.stringify(normFile(e))


        setdataTable(tempDatatable)

    }
    const handleUploadData = (e) => {
        const { file, fileList } = e;

        if (file.status === 'done') return fileList?.map(item => {
            const response = item.response
            const url = response ? `${window.location.origin}${process.env.REACT_APP_API}${response?.result?.[0]}` : item.url

            return {
                name: item.name,

                url,
                uid: item.uid,
            }
        })

        return e?.fileList
    }
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return handleUploadData(e)
    };
    const uploadChangeF = (e, i, key) => {
        // formload.setFieldsValue({
        //     out_photos: '1111111111'
        // })
        let tempDatatable = JSON.parse(JSON.stringify(dataTableF))
        tempDatatable[i][key] = JSON.stringify(normFile(e))


        setdataTableF(tempDatatable)

    }

    return (
        <Form
            className='quantities'
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
                        <Select value={text} key={index} showSearch onChange={(text) => { decorateChange(text, index) }} filterOption={true} optionFilterProp="children" >{
                            decorate.map((x, i) => {
                                return (<Select.Option value={x}>{x}</Select.Option>)
                            })
                        }
                        </Select>
                    )} />
                    <Table.Column key="unit" title="Z单位" dataIndex="unit" render={(text, record, index) => (
                        <Input value={text} onChange={(val) => { valueUpdata(val, index, 'unit') }} />
                    )} />
                    <Table.Column key="decorate_data" title="Z测量数据" dataIndex="decorate_data" render={(text, record, index) => (
                        <Input value={text} onBlur={(val) => { dedatazBlur(val, index) }} onChange={(val) => { dedatazChange(val, index) }} onPressEnter={(val) => { dedatazBlur(val, index) }} />
                    )} />
                    <Table.Column key="engineering_total" title="Z工程量" dataIndex="engineering_total" render={(text, record, index) => (
                        <InputNumber value={text} onChange={(val) => { totalChange(val, index) }} />
                    )} />
                    <Table.Column key="evaluation_unit_price" title="Z单价" dataIndex="evaluation_unit_price" render={(text, record, index) => (
                        <InputNumber onChange={(val) => { priceChange(val, index) }} value={text} onBlur={(val) => { priceBlur(val, index) }} />
                    )} />
                    <Table.Column key="min_price" title="单价最小值" dataIndex="min_price" render={(text, record, index) => (
                        <InputNumber disabled={true} value={text} />
                    )} />
                    <Table.Column key="max_price" title="单价最大值" dataIndex="max_price" render={(text, record, index) => (

                        <InputNumber disabled={true} value={text} />
                    )} />
                    <Table.Column key="estimated_total_price" title="Z总价" dataIndex="estimated_total_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="upload_photos" title="图片上传" dataIndex="upload_photos" render={(text, record, index) => (
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" maxCount={1} fileList={text ? JSON.parse(text) : null} onChange={(e) => { uploadChange(e, index, 'upload_photos') }}  >
                            <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    上传
                                </div>
                            </div>
                        </Upload>
                    )} />
                    <Table.Column key="decorate_remark" title="备注" dataIndex="decorate_remark" render={(text, record, index) => (
                        <Input value={text} onChange={(val) => { valueUpdata(val, index, 'decorate_remark') }} />
                    )} />
                    <Table.Column key="a" title="操作" dataIndex="a" render={(text, record, index) => (
                        <Button type="link" key={index} onClick={(text, record) => { deletmanagement(index, record) }}>删除</Button>
                    )} />
                </Table>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24, }} >附属工程量测量记录表
                {
                    //TODO decorate_name unit decorate_data engineering_total evaluation_unit_price min_price max_price estimated_total_price upload_photos decorate_remark
                }
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
                        <Select value={text} key={index} showSearch filterOption={true} optionFilterProp="children" onChange={(text) => { decorateFChange(text, index) }} >{
                            decorateF.map((x, i) => {
                                return (<Select.Option value={x}>{x}</Select.Option>)
                            })
                        }
                        </Select>
                    )} />
                    <Table.Column key="unit" title="F单位" dataIndex="unit" render={(text, record, index) => (
                        <Input value={text} onChange={(val) => { valueUpdataF(val, index, 'unit') }} />
                    )} />
                    <Table.Column key="decorate_data" title="F测量数据" dataIndex="decorate_data" render={(text, record, index) => (
                        <Input value={text} onBlur={(val) => { dedatazBlurF(val, index) }} onChange={(val) => { dedatazChangeF(val, index) }} onPressEnter={(val) => { dedatazBlurF(val, index) }} />
                    )} />
                    <Table.Column key="engineering_total" title="F工程量" dataIndex="engineering_total" render={(text, record, index) => (
                        <InputNumber value={text} onChange={(val) => { totalChangeF(val, index) }} />
                    )} />
                    <Table.Column key="evaluation_unit_price" title="F单价" dataIndex="evaluation_unit_price" render={(text, record, index) => (
                        <InputNumber value={text} onChange={(val) => { priceChangeF(val, index) }} onBlur={(val) => { priceBlurF(val, index) }} />
                    )} />
                    <Table.Column key="min_price" title="单价最小值" dataIndex="min_price" render={(text, record, index) => (
                        <InputNumber disabled={true} value={text} />
                    )} />
                    <Table.Column key="max_price" title="单价最大值" dataIndex="max_price" render={(text, record, index) => (

                        <InputNumber disabled={true} value={text} />
                    )} />
                    <Table.Column key="estimated_total_price" title="F总价" dataIndex="estimated_total_price" render={(text, record, index) => (
                        <InputNumber value={text} />
                    )} />
                    <Table.Column key="upload_photos" title="图片上传" dataIndex="upload_photos" render={(text, record, index) => (
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" maxCount={1} fileList={text ? JSON.parse(text) : null} onChange={(e) => { uploadChangeF(e, index, 'upload_photos') }}  >
                            <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    上传
                                </div>
                            </div>
                        </Upload>
                    )} />
                    <Table.Column key="decorate_remark" title="备注" dataIndex="decorate_remark" render={(text, record, index) => (
                        <Input value={text} onChange={(val) => { valueUpdataF(val, index, 'decorate_remark') }} />
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