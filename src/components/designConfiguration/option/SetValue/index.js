import intl from 'react-intl-universal';
import React from 'react';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';

import IconHasSetValue from '@/data-reporting-new/images/done.svg';
import './index.less';

const SetValue = ({
  title,
  onClick,
  hasValue,
  textValues,
  buttonText = intl.get('ANAL.SET_UP'),
}) => {
  let isTrue =
    (textValues &&
      textValues?.length > 8 &&
      textValues !== '<p><br></p>' &&
      textValues !== '<p></p>') ||
    // eslint-disable-next-line prettier/prettier
    (Object.values(hasValue || {}).length > 2 &&
      Object.values(hasValue || {})[1] === ']');
  return (
    <div className="set_value">
      <div className="set_value_title">
        {title}
        {title === intl.get('SRC.DATA_CONDITIONS') && (
          <Tooltip title=" {intl.get('COMM.翻译异常需手动翻译！')}，请不要设置在一个资产中，会引起表单显示出错">
            {/* <img
              src={require(`../../../images/tips.png`)}
              style={{ marginLeft: 8 }}
            /> */}
          </Tooltip>
        )}
      </div>
      <Button className="set_value_button" onClick={onClick}>
        {buttonText}
        {title?.props?.children[0] !== intl.get('REPO.STC')
          ? Boolean(hasValue) && <IconHasSetValue />
          : isTrue && <IconHasSetValue />}
      </Button>
    </div>
  );
};

SetValue.propTypes = {
  title: PropTypes.node,
  onClick: PropTypes.func,
  hasValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  buttonText: PropTypes.string,
  textValues: PropTypes.string,
};
export default SetValue;
