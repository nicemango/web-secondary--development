/*
 * @Author: shijunwen
 * @Email: shijunwen@njsdata.com
 * @LastEditors: shijunwen
 * @Date: 2022-03-03 12:24:42
 * @LastEditTime: 2022-04-05 20:16:01
 * @FilePath: \onemind-web\src\components\request-error\index.js
 * @Description: 后台请求错误码
 */

import { message } from 'antd';
import ERROR_CODE from './errorCode';
import { intlGetKey } from 'utils/international';

const requestError = (requestData, other = {}) => {
  console.log(requestData, other);
  if (typeof requestData === 'string') {
    message.error(requestData);
    return;
  }
  const { data: { code: rCode, message: rMessage, result = [] } = {}, status } =
    requestData || {};
  // 请求接口不存在
  if (status === 404) {
    message.error(intlGetKey('ERROR.404').d('请求接口地址不存在'));
    return;
  }
  if (rCode === 10220020) {
    message.error(`[ code:${rCode} ]【 ${result.join(',')}】 唯一性校验不通过`);
    return;
  }
  if (rCode === '10220019') {
    message.error(
      `[ code:${rCode} ] 存在相同的业务名称字段${result.join(',')}}`
    );
    return;
  }
  // 后台返回错误码
  if (ERROR_CODE[rCode]) {
    message.error(`[ code:${rCode} ] ${ERROR_CODE[rCode]}`);
    return;
  }
  // 后台返回错误信息
  if (rMessage) {
    message.error(rMessage);
    return;
  }
  // 自定义错误提示
  const { code, type = 'error', content, ...messageProps } = other;
  let tempValue = content || '查询错误';
  if (ERROR_CODE[code]) {
    tempValue = `[ code:${code} ] ${ERROR_CODE[code]}`;
  }
  message.open({
    type,
    content: tempValue,
    ...messageProps,
  });
};

export default requestError;
