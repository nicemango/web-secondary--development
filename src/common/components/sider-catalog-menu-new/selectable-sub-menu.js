import React, { Component } from 'react';
import { Menu } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { css } from 'emotion';

const AntSubMenu = Menu.SubMenu;

class SubMenu extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    onTitleClick: PropTypes.func,
    className: PropTypes.string,
    eventKey: PropTypes.object,
    selectedKeys: PropTypes.array,
    analysisStyle: PropTypes.bool,
    level: PropTypes.number,
    area: PropTypes.any,
  };

  onTitleClick = ({ key, domEvent }) => {
    const { onSelect } = this.props;
    onSelect({ key, item: this.saveAntSubMenu.subMenu });
  };

  saveAntSubMenu = antSubMenu => (this.antSubMenu = antSubMenu);

  render() {
    const {
      onTitleClick,
      className,
      eventKey,
      selectedKeys = [],
      analysisStyle,
      ...restProps
    } = this.props;
    const isSelected = selectedKeys.indexOf(eventKey) !== -1;
    const classStr = classNames(className, {
      'ant-submenu-selected': isSelected,
    });
    let customStyle = null;

    if (analysisStyle) {
      customStyle = css`
        & > .ant-menu-submenu-title > .catalog-menu-item {
          left: ${this.props.level > 1
            ? this.props.level * 5
            : 20}px !important;
        }
        & > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
          left: ${this.props.level * 5}px !important;
        }
      `;
    } else {
      customStyle = css`
        & > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
          left: ${10 +
            (this.props.level > 4 ? 80 : this.props.level * 20)}px !important;
        }
      `;
    }

    return (
      <AntSubMenu
        ref={this.saveAntSubMenu}
        className={classStr + ' ' + customStyle}
        eventKey={eventKey}
        selectedKeys={selectedKeys}
        onTitleClick={this.onTitleClick}
        area={this.props.area}
        {...restProps}
      />
    );
  }
}

export default SubMenu;
