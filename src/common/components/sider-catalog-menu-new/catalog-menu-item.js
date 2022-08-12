import intl from "react-intl-universal";
import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class CatalogMenuItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
    actions: PropTypes.any,
    icon: PropTypes.any,
    connectDragSource: PropTypes.func.isRequired,
    canDrag: PropTypes.bool,
    hovered: PropTypes.bool,
    area1: PropTypes.object,
    area2: PropTypes.object,
    area3: PropTypes.object,
    level: PropTypes.number,
  };
  render() {
    const { name, desc, actions, icon, hovered } = this.props;

    const clsString = classNames({
      "catalog-menu-item": true,
      "catalog-menu-item-hovered": hovered,
    });

    const canDropElement = (
      <div
        className={clsString}
        style={{
          paddingLeft: 50 + (this.props.level > 3 ? 60 : this.props.level * 20),
        }}
      >
        <div className="catalog-menu-item-content2">
          {icon}
          <span title={desc || name}>
            {intl.get(name || "common.empty").d(name)}
          </span>
        </div>
        {actions}
      </div>
    );

    return canDropElement;
  }
}

export default CatalogMenuItem;
