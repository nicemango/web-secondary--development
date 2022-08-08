import React, { useState } from 'react';
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
import { PlusOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Upload1 = () => {
    const [componentDisabled, setComponentDisabled] = useState(false);

    const onFormLayoutChange = ({ disabled }) => {
        setComponentDisabled(disabled);
    };

    return (
        <Form
            labelCol={{
                span: 5,
            }}
            wrapperCol={{
                span: 15,
            }}
            layout="horizontal"
            initialValues={{
                disabled: componentDisabled,
            }}
            onValuesChange={onFormLayoutChange}
            disabled={componentDisabled}
        >

            <Row justify="center">
                <Col span={6}>
                    <Form.Item label="Form disabled" name="disabled" valuePropName="checked">
                        <Checkbox>disabled</Checkbox>
                    </Form.Item></Col>
                <Col span={6}><Form.Item label="Radio">
                    <Radio.Group>
                        <Radio value="apple"> Apple </Radio>
                        <Radio value="pear"> Pear </Radio>
                    </Radio.Group>
                </Form.Item></Col>
                <Col span={6}><Form.Item label="Input">
                    <Input />
                </Form.Item></Col>
                <Col span={6}>
                    <Form.Item label="Select">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

            </Row>

            <Row>
                <Col span={6}><Form.Item label="TreeSelect">
                    <TreeSelect
                        treeData={[
                            {
                                title: 'Light',
                                value: 'light',
                                children: [
                                    {
                                        title: 'Bamboo',
                                        value: 'bamboo',
                                    },
                                ],
                            },
                        ]}
                    />
                </Form.Item>
                </Col>
                <Col span={6}> <Form.Item label="Cascader">
                    <Cascader
                        options={[
                            {
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [
                                    {
                                        value: 'hangzhou',
                                        label: 'Hangzhou',
                                    },
                                ],
                            },
                        ]}
                    />
                </Form.Item></Col>
                <Col span={6}> <Form.Item label="DatePicker">
                    <DatePicker />
                </Form.Item></Col>
                <Col span={6}>
                    <Form.Item label="RangePicker">
                        <RangePicker />
                    </Form.Item>
                </Col>

            </Row>

            <Row>
                <Col span={6}> <Form.Item label="InputNumber">
                    <InputNumber />
                </Form.Item>
                </Col>
                <Col span={6}> <Form.Item label="TextArea">
                    <TextArea rows={4} />
                </Form.Item></Col>
                <Col span={6}><Form.Item label="Switch" valuePropName="checked">
                    <Switch />
                </Form.Item></Col>
                <Col span={6}>
                    <Form.Item label="Upload" valuePropName="fileList">
                        <Upload action="/upload.do" listType="picture-card">
                            <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Upload
                                </div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Col>

            </Row>









            <Form.Item label="Button">
                <Button>Button</Button>
            </Form.Item>
        </Form>
    );
};

export default Upload1;