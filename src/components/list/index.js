import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col , Modal, Button } from "antd";
import { getAssetJSONForProduct } from './../../api/asset';

import './index.less';

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {

  const { width } = customParams;

  const [ JsonContent, setJsonContent ] = useState('');

  useEffect(() => {
    handleClick();
  }, [])

  const handleClick = async () => {
    try {
      const { data } = await getAssetJSONForProduct(dataId);
      const formatedJson = JSON.stringify(data?.params || {}, null, 4);
      setJsonContent(formatedJson);
    } catch (error) {
      setJsonContent('');
    }
    
    setModalVisible(true);
  }

  const [modalVisible, setModalVisible] = useState(false);


  const handleDownLoad = async () => {
    downloadEvt('模型文件.json');
  }

  const downloadEvt = fileName =>  {
    const Link = document.createElement('a');
    Link.download = fileName;
    Link.style.display = 'none';
    // 字符内容转变成blob地址
    const blob = new Blob([JsonContent]);
    Link.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(Link);
    Link.click();
    // 然后移除
    document.body.removeChild(Link);
  }



  return (
    
    <Modal title="查看物模型" visible={modalVisible} footer={null} onCancel={()=> setModalVisible(false)} className="tranfer-table-filter-modal" width={width}>
      <Row>
        <Col span={24}>
          <pre className="json-content">{JsonContent}</pre>
        </Col>
      </Row>
      <Row>
        <Col span={24} className="btn-container">
          <Button type="primary" onClick={handleDownLoad}>导出模型文件</Button>
        </Col>
      </Row>
    </Modal>     
    
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
