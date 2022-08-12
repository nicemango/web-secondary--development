import intl from "react-intl-universal";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { List } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import Scrollbars from "react-custom-scrollbars";
import classNames from "classnames";

import "./index.less";

class ScrollableList extends Component {
  static propTypes = {
    className: PropTypes.string,
    loadMore: PropTypes.func,
    initialLoad: PropTypes.bool,
    pageStart: PropTypes.number,
    hasMore: PropTypes.bool,
    itemRenderer: PropTypes.func.isRequired,
  };

  handleScroll() {
    window.dispatchEvent(new Event("scroll"));
  }

  render() {
    const {
      className,
      loadMore,
      initialLoad = false,
      pageStart = 0,
      hasMore = false,
      type = "list",
      itemRenderer,
      ...restProps
    } = this.props;

    return (
      <Scrollbars
        className={classNames(
          "scrollable-list",
          `${type}-scrollable-list`,
          className
        )}
        onScroll={this.handleScroll}
      >
        <InfiniteScroll
          initialLoad={initialLoad}
          pageStart={pageStart}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
        >
          <List
            renderItem={itemRenderer}
            {...restProps}
            locale={{
              emptyText: intl.get("ANAL.NO_DATA").d("暂无数据"),
            }}
          />
        </InfiniteScroll>
      </Scrollbars>
    );
  }
}

export default ScrollableList;
