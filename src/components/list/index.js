import React, {useEffect} from "react";
import PropTypes from "prop-types";

import {batchOperation} from '../../api/asset'

import './index.less';

const List = (props) => {

  useEffect(() => {
    handleClick();
  }, [])

  const handleClick = () => {
    console.log('props', props)

    let resData = {}
    let resDataList = []

    props.dataSource && props.dataSource.forEach((item, index) => {
      if (item.length) {
        let resObj = {}
        item.forEach((e, i) => {
          switch (e.title) {
            case '设备id':
              resObj.device_id = e.value.value;
            case '设备状态':
              resObj.status = e.value.value;
          }
        })
        resDataList.push(resObj)
      } else {
        switch (item.title) {
          case '设备id':
            resData.device_id = item.value.value;
          case '设备状态':
            resData.status = item.value.value;
        }
      }
    })
    if (resDataList.length) {
      batchOperation(resDataList).then((res) => {
        console.log('批量操作')
        props.handleSearch()
      })
    } else {
      batchOperation([resData]).then((res) => {
        console.log('单条操作')
        props.handleSearch()
      })
    }
  }

  return (
    <></>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
