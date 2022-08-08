import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    Form,
    Input,

    DatePicker,

    Upload,
    Col, Row
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Upload1 = ({ cRef, click, defaultValue }) => {
    const [formload] = Form.useForm();
    const [componentDisabled, setComponentDisabled] = useState(false);
    const [photo, setPhoto] = useState({})
    const [photoupdate, setPhotoupdate] = useState({})
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
    useEffect(() => {
        if (defaultValue && defaultValue.data_id) {
            // let tempObj = {}
            let tempObj = {};
            // tempObj.out_photos = JSON.parse(defaultValue.out_photos.value)
            // tempObj.signed_photo = JSON.parse(defaultValue.signed_photo.value)
            // tempObj.split_photos = JSON.parse(defaultValue.split_photos.value)
            // tempObj.ygryhd_photos = JSON.parse(defaultValue.ygryhd_photos.value)
            // tempObj.wts_photos = JSON.parse(defaultValue.wts_photos.value)



            for (let item in defaultValue) {

                if (item == 'out_photos') tempObj[item] = JSON.parse(defaultValue[item]['value'])
                if (item == 'signed_photo') tempObj[item] = JSON.parse(defaultValue[item]['value'])
                if (item == 'split_photos') tempObj[item] = JSON.parse(defaultValue[item]['value'])
                if (item == 'ygryhd_photos') tempObj[item] = JSON.parse(defaultValue[item]['value'])
                if (item == 'wts_photos') tempObj[item] = JSON.parse(defaultValue[item]['value'])

            }
            setPhoto(tempObj)
            setPhotoupdate(tempObj)
            // formload.setFieldsValue(tempObj)
        }



    }, [])
    useImperativeHandle(cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        changeVal: (newVal) => {
            // let labelArr = document.querySelectorAll('.upload_ label')
            // let valueArr = formload.getFieldsValue()
            // let transformation = {}
            // labelArr.forEach(x => {
            //     let key = x.getAttribute('for')
            //     transformation[key] = valueArr[key]
            // })
            let transformation = JSON.parse(JSON.stringify(photo))

            for (let key in transformation) {
                transformation[key] = JSON.stringify(photoupdate[key])

            }

            return transformation
        }
    }));
    const onFormLayoutChange = ({ disabled }) => {
        setComponentDisabled(disabled);
    };
    const uploadChange = (e, key) => {
        // formload.setFieldsValue({
        //     out_photos: '1111111111'
        // })
        let temp = JSON.parse(JSON.stringify(photo))
        let tempupdate = JSON.parse(JSON.stringify(photoupdate))
        tempupdate[key] = normFile(e)
        temp[key] = JSON.stringify(normFile(e))

        setPhoto(temp)
        setPhotoupdate(tempupdate)
    }
    return (

        <Form
            className='upload_'
            form={formload}
            labelCol={{
                span: 5,
            }}
            wrapperCol={{
                span: 15,
            }} span={12}
            layout="horizontal"
            initialValues={{
                disabled: componentDisabled,
            }}
            onValuesChange={onFormLayoutChange}
            disabled={componentDisabled}
        >
            <Row>

                <Col span={12}>
                    <Form.Item label="签约合同照片" valuePropName="fileList" >
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card"  >
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
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="房屋外观" name='out_photos' getValueFromEvent={(e) => { normFile(e) }}  >
                        {/* {photoupdate.out_photos && photoupdate.out_photos.map(x => { */}
                        {/* <>
                        <img src={x.url} alt='x.name' />

                    </> */}
                        {/* })} */}
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" fileList={photoupdate.out_photos} onChange={(e) => { uploadChange(e, 'out_photos') }}  >
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
                    </Form.Item>
                </Col>

            </Row>

            <Row>

                <Col span={12}>
                    <Form.Item label="签约照片" name="signed_photo" getValueFromEvent={normFile} >
                        {
                            photoupdate.signed_photo && photoupdate.signed_photo.map(x => {
                                <>
                                    <img src={x.url} alt='x.name' />

                                </>
                            })

                        }
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" fileList={photoupdate.signed_photo} onChange={(e) => { uploadChange(e, 'signed_photo') }}>
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
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="签约照片(个人)" name="split_photos" getValueFromEvent={normFile}>
                        {
                            photoupdate.split_photos && photoupdate.split_photos.map(x => {
                                <>
                                    <img src={x.url} alt='x.name' />

                                </>
                            })

                        }
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" fileList={photoupdate.split_photos} onChange={(e) => { uploadChange(e, 'split_photos') }}  >
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
                    </Form.Item>
                </Col>

            </Row>
            <Row>

                <Col span={12}>
                    <Form.Item label="用工人员核定表" name='ygryhd_photos' >
                        {
                            photoupdate.ygryhd_photos && photoupdate.ygryhd_photos.map(x => {
                                <>
                                    <img src={x.url} alt='x.name' />

                                </>
                            })

                        }
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" fileList={photoupdate.ygryhd_photos} onChange={(e) => { uploadChange(e, 'ygryhd_photos') }}>
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
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="授权委托书" name='wts_photos' >
                        {
                            photoupdate.wts_photos && photoupdate.wts_photos.map(x => {
                                <>
                                    <img src={x.url} alt='x.name' />

                                </>
                            })

                        }
                        <Upload action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`} listType="picture-card" fileList={photoupdate.wts_photos} onChange={(e) => { uploadChange(e, 'wts_photos') }} >
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
                    </Form.Item>
                </Col>

            </Row>







        </Form>
    );
};

export default Upload1;