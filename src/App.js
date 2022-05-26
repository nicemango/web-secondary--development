import React, {Component} from "react";
import {
  Radio,
  message,
  Input,
} from "antd";
import {
  FilterOutlined
} from '@ant-design/icons';
import "./app.less"

export default class App extends Component {
  state = {
    first: true, filterContentShow: true,
  }
  filterDataArr = []
  selected = {}

  componentDidMount() {
    window.main = this;
    this.setState({first: false})
    this.filterToolbarContent.current.parentNode.height = this.filterToolbarContent.current.offsetHeight
    const events = [
      {
        key: "selectedValueChange", name: "过滤条件变化", payload: [
          {
            key: "selectedValue", name: "过滤条件", dataType: "string"
          }
        ],
      }, {
        key: "searchValueChange", name: "搜索条件变化", payload: [
          {
            key: "searchValue", name: "搜索条件", dataType: "string"
          }
        ],
      }
    ];
    const actions = []
    this.props?.customConfig?.componentId && window.componentCenter?.register(this.props?.customConfig?.componentId, "", this, {
      events, actions
    });
  }

  filterToolbarContent = React.createRef()

  searchValueChange = (val) => {
    window.eventCenter?.triggerEvent(this.props?.customConfig?.componentId, "searchValueChange", {searchValue: val})
  }
  selectedValueChange = (val) => {
    let selected = []
    let selectedVal = val?.target?.value
    console.log(val?.target?.value);
    this.filterDataArr.forEach((filterRow) => {
      filterRow.filterData.forEach((item) => {
        if (item === selectedVal) {
          this.selected[filterRow.filterName] = selectedVal
        }
      })
    })
    for (let selectedKey in this.selected) {
      selected.push(this.selected[selectedKey])
    }
    console.log(selected);
    window.eventCenter?.triggerEvent(this.props?.customConfig?.componentId, "selectedValueChange", {selectedValue: selected.join(",")})
  }

  handleFilterIconClick = () => {
    this.setState({filterContentShow: !this.state.filterContentShow})
  }

  Event_Center_getName() {
    return "filterData";
  }

  render() {
    const {customConfig} = this.props;
    let {filterData, title, buttonWidth, filterIconRight} = customConfig || {};
    let buttonWidthString;
    let filterIconRightString;
    buttonWidthString = buttonWidth ? `${buttonWidth}px` : "100px";

    filterIconRightString = filterIconRight ? `${filterIconRight}px` : "20px"
    let filterDataArr
    try {
      filterDataArr = JSON.parse(filterData)

    } catch (e) {
      message.error("输入的数据格式有误")
    }
    this.filterDataArr = filterDataArr
    this.filterDataArr.forEach((filterRow) => {
      this.selected[filterRow.filterName] = filterRow.defaultValue
    })
    return (<>
      <div className="filterToolbarHeader">
        <div
          className="filterToolbarContentRight"
          onClick={this.handleFilterIconClick}
          style={{right: filterIconRightString}}
        >
          <FilterOutlined/>
        </div>
      </div>
      <div
        className="shrink"
        style={{
          overflow: "hidden",
          height: !this.state.filterContentShow ? "80px" : this.state.first
                                                        ? "80px"
                                                        : this.filterToolbarContent.current.offsetHeight + "px",
          transition: "0.5s"
        }}
      >
        <div
          className="filterToolbarContent" ref={this.filterToolbarContent}
        >
          <div className="filterToolbarContentLeft">
            {filterDataArr.map((filterRow, filterRowIndex) => (<div
              className="filter-row" key={filterRowIndex} style={{
              marginLeft: "40px", display: "flex", justifyContent: "left"
            }}
            >
              <div
                className="filter-label"
                style={{
                  display: "inline-block",
                  width: "85px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontFamily: "PingFang SC",
                  marginTop: "43px"

                }}
              >{filterRow.filterName}</div>
              <Radio.Group
                onChange={this.selectedValueChange}
                style={{marginLeft: "40px", width: "calc(100% - 150px)"}}
                defaultValue={filterRow.defaultValue}
              >
                {filterRow.filterData.map((filterItem, filterItemIndex) => (<>
                  <Radio.Button
                    style={{
                      borderRadius: "6px",
                      border: "1px solid #999",
                      minWidth: buttonWidthString,
                      color: "#999",
                      height: "32px",
                      cursor: "pointer",
                      textAlignlign: "center",
                      fontSize: "14px",
                      marginRight: "17px",
                      boxSizing: "border-box",
                      marginTop: "43px"
                    }}
                    value={filterItem}
                    key={filterItemIndex}
                  >
                    {filterItem}
                  </Radio.Button>
                </>))}
              </Radio.Group>
            </div>))}
          </div>
          <div className="filterToolbarContentRight">
            <Input.Search
              onSearch={this.searchValueChange}
              placeholder="搜索感兴趣的应用名称"
              style={{display: "inline-block", width: "260px",}}
            />
          </div>
        </div>
      </div>
    </>);
  }
}
