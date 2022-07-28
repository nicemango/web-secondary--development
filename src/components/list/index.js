import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { queryLiveing } from "../../api/asset"
import Reflv from 'reflv';
import './index.less';

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {

  const { width } = customParams.width;
  const [modalVisible, setModalVisible] = useState(false);
  const [liveRes, setliveRes] = useState({});
  const [liveUrl, setliveUrl] = useState('');


  useEffect(() => {
    setModalVisible(true);
  }, [])

  useEffect(() => {
    handleClick()
  }, [modalVisible])

  const handleClick = async () => {
    try {
      const { result } = await queryLiveing('888d40c0299348a280a00feb33c66cc5')
      // liveUrl = result.url;
      setliveRes(result)
      console.log(result,liveUrl);
    } catch (error) {
      console.log(error);
    }
    setliveUrl('https://rtmp01open.ys7.com:9188/v3/openlive/G07869142_1_1.flv?expire=1657796434&id=467752284147683328&t=0f69d8d6aaab9e439d3264f36c3098dea919994c1ce5382dbe2c98ec725189f0&ev=100')
  }

  const destroyflvPlayer = () =>{
    setModalVisible(false)
  }

  return (
    <>
      <Modal title="青白江消控中心监控摄像头" visible={modalVisible} destroyOnClose={true} footer={null} closable={false} onCancel={destroyflvPlayer} className="tranfer-table-filter-modal" width={width}>
        <Reflv
          url={liveUrl}
          type="flv"
          isLive
          cors
        />
      </Modal>
    </> 
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
