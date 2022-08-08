import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

class errMessage extends React.Component {
  static propTypes = {
    url: PropTypes.string,
    text: PropTypes.string,
  };
  render() {
    const { url, text } = this.props;
    return (
      <div className="container">
        <div className={`image_${url}`}>
          <img src={require(`./images/${url}.png`)} alt="" />
        </div>
        <div className="text">{text}</div>
      </div>
    );
  }
}
export default errMessage;
