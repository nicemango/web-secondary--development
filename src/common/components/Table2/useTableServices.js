import intl from "react-intl-universal";
/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2021-02-18 15:58:37
 * @LastEditTime: 2021-02-20 16:09:16
 * @FilePath: \onemind-web\src\components\Table2\useTableServices.js
 * @Description: table {intl.get('COMP.INTERFACE_REQUEST')}
 */
import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import request from "../../../api/request";

const useTableServices = (url, callMethod = "POST", isReady) => {
  const [dataSource, setDataSource] = useState([]);
  const [params, setParams] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (callMethod === "POST") {
        const { data } = await request.post(url, { ...params });
        const { results = [], totalCount } = data;
        setDataSource(results);
        setLoading(false);
        setTotal(totalCount);
        return;
      }
      const { data } = await request.get(url);
      const { results = [], totalCount } = data;
      setDataSource(results);
      setLoading(false);
      setTotal(totalCount);
    } catch (e) {
      message.error(intl.get("COMP.FTLL"));
      setDataSource([]);
      setLoading(false);

      console.warn(e);
    }
  }, [url, params, callMethod]);

  useEffect(() => {
    if (isReady && url && params) {
      fetchData();
    }
  }, [params, fetchData, isReady, url]);

  return { dataSource, params, setParams, total, loading };
};

export default useTableServices;
