import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Empty, message } from "antd";
import { getAssetData } from '../../api/asset'

import './index.less';

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {

  const width = customParams.width;
  const assetId = customParams.assetId;
  const videoIdKey = customParams.videoIdKey;
  const videoKey = customParams.videoKey;
  console.log({
    "width===": width,
    "assetId===": assetId,
    "videoIdKey===": videoIdKey,
    "videoKey===": videoKey,
    "dataId===":dataId
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [videoObj, setVideoObj] = useState({});

  useEffect(() => {
    handleClick();
  }, [])

  const handleClick = async () => {
    try {
      await getAssetData(assetId).then(res=>{
        let key = res.data[0]
        let value = res.data[1]
        let data = value.map(val => {
          let obj = {};
          key.forEach((k,index) =>{
            obj[k.col_name] = val[index]
          })
          return obj;
        }).filter(x=>{
          return x[videoIdKey] === dataId
        })
        console.log('data=============>',data);
        if (data.length > 0) {
          setVideoObj(data[0])
        }else {
          message.info('暂无视频');
        }
      }).catch(err=>{
        console.log(err);
      });
    } catch (error) {
      return false;
    }
    setModalVisible(true);
  }

  return (
    
    <Modal title="视频弹窗" visible={modalVisible} footer={null} onCancel={()=> setModalVisible(false)} className="tranfer-table-filter-modal" width={width} destroyOnClose={true}>
      {
        videoObj[videoKey] ? <video className="centeredVideo" controls src={videoObj[videoKey]} poster=""></video> : <Empty />
      }
    </Modal>     
    
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
