// 附件上传
import React, { useMemo } from "react";
import { Form, Col, Row, Divider, Upload, Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

export const handleUploadData = (e) => {
  const { file, fileList } = e;

  if (file.status === "done")
    return fileList?.map((item) => {
      const response = item.response;
      const url = response
        ? `${window.location.origin}${process.env.REACT_APP_API}${response?.result?.[0]}`
        : item.url;
      return {
        name: item.name,
        uid: item.uid,
        url,
      };
    });

  return e?.fileList;
};

const Enclosure = (props) => {
  const { form } = props;

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>添加图片</div>
    </div>
  );

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return handleUploadData(e);
  };

  // 签约照片
  const SignedPhotoMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.signed_photo !== currentValues.signed_photo
        }
      >
        {({ getFieldsValue }) => {
          const photoDataList = getFieldsValue("signed_photo");
          return (
            <Col span={12}>
              <Form.Item
                name="signed_photo"
                label="签约照片"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
                  listType="picture-card"
                >
                  {photoDataList?.length ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    );
  }, [uploadButton]);

  // 签约照片（个人）
  const SplitPhotosMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.split_photos !== currentValues.split_photos
        }
      >
        {({ getFieldsValue }) => {
          const photoDataList = getFieldsValue("split_photos");
          return (
            <Col span={12}>
              <Form.Item
                name="split_photos"
                label="签约照片（个人）"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
                  listType="picture-card"
                >
                  {photoDataList?.length ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    );
  }, [uploadButton]);

  // 房屋外观照
  const OutPhotosMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.out_photos !== currentValues.out_photos
        }
      >
        {({ getFieldsValue }) => {
          const photoDataList = getFieldsValue("out_photos");
          return (
            <Col span={12}>
              <Form.Item
                name="out_photos"
                label="房屋外观照"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
                  listType="picture-card"
                >
                  {photoDataList?.length >= 6 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    );
  }, [uploadButton]);

  // 用工人员核定表
  const StaffCheckMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.staffCheck !== currentValues.staffCheck
        }
      >
        {({ getFieldsValue }) => {
          const photoDataList = getFieldsValue("staffCheck");
          return (
            <Col span={12}>
              <Form.Item
                name="staffCheck"
                label="用工人员核定表"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
                  listType="picture-card"
                >
                  {photoDataList?.length ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    );
  }, [uploadButton]);

  // 授权委托书
  const AuthorizationMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.authorization !== currentValues.authorization
        }
      >
        {({ getFieldsValue }) => {
          const photoDataList = getFieldsValue("authorization");
          return (
            <Col span={12}>
              <Form.Item
                name="authorization"
                label="授权委托书"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
                  listType="picture-card"
                >
                  {photoDataList?.length ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    );
  }, [uploadButton]);

  // 产权证注销
  const PropertyRcertificateCancellationMod = useMemo(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.property_rcertificate_cancellation !==
          currentValues.property_rcertificate_cancellation
        }
      >
        {({ getFieldsValue }) => {
          const photoDataList = getFieldsValue(
            "property_rcertificate_cancellation"
          );
          return (
            <Col span={12}>
              <Form.Item
                name="property_rcertificate_cancellation"
                label="授权委托书"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action={`${process.env.REACT_APP_API}/sdata/rest/image/upload`}
                >
                  <Button
                    disabled={photoDataList?.length}
                    icon={<UploadOutlined />}
                  >
                    上传附件
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          );
        }}
      </Form.Item>
    );
  }, [uploadButton]);

  return (
    <>
      {/* 第一行 */}
      <Row gutter={16}>
        {SignedPhotoMod}
        {SplitPhotosMod}
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第二行 */}
      <Row gutter={16}>{OutPhotosMod}</Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第三行 */}
      <Row gutter={16}>
        {StaffCheckMod}
        {AuthorizationMod}
      </Row>
      <Divider style={{ marginTop: 0 }} />
      {/* 第四行 */}
      <Row gutter={16}>{PropertyRcertificateCancellationMod}</Row>
    </>
  );
};

export default Enclosure;
