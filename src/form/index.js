import React, { Component } from "react";
import { Tabs } from "antd";
import qs from "querystringify";
import "./index.less";

// 被征收人信息
import Collection from './components/Collection.js'
// 装修附属
import Quantities from './components/Quantities.js'
// 搬迁、安置、补助
import Settlement from './components/Settlement.js'
// 结算
import Upload1 from './components/Upload.js'
// 附件上传
import Payment from './components/Payment.js'
// 打款情况
import ButtonModal from './buttonModal.js'
import eventbus from './uilts/eventbus'
const { TabPane } = Tabs;

export default class App extends Component {

  constructor(props) {
    super(props);
    console.log('===', props.defaultValue)
    this.state = {
      defaultValue: props.defaultValue || {},
      propertyRightTabs: '',
      pro: false,
      temp: false,
      formid: '',
      collection: {},
      quantities: {},
      settlement: {},
      upload1: {},
      payment: {},
      arrObj: {}
    };
    this.myRef = React.createRef()
    this.Quantities = React.createRef()
    this.Settlement = React.createRef()
    this.Upload1 = React.createRef()
    this.Payment = React.createRef()

    // this.hideTabs = this.hideTabs.bind(this);
    // this.QuantitiesTabs = this.QuantitiesTabs.bind(this);
    // this.SettlementTabs = this.SettlementTabs.bind(this);
    // this.Upload1Tabs = this.Upload1Tabs.bind(this);
    // this.PaymentTabs = this.PaymentTabs.bind(this);
  }

  // hideTabs(value) {
  //   this.setState({ collection: value }, () => {
  //     let tempObj = { ...this.state.collection, ...this.state.arrObj }
  //     this.setState({ arrObj: tempObj })
  //   })
  // }
  // QuantitiesTabs(value) {

  //   this.setState({ quantities: value }, () => {
  //     let tempObj = { ...this.state.collection, ...this.state.arrObj }
  //     this.setState({ arrObj: tempObj })
  //   })


  // }
  // SettlementTabs(value) {

  //   this.setState({ settlement: value }, () => {
  //     let tempObj = { ...this.state.collection, ...this.state.arrObj }
  //     this.setState({ arrObj: tempObj })
  //   })

  // }
  // Upload1Tabs(value) {


  //   this.setState({ upload1: value }, () => {
  //     let tempObj = { ...this.state.collection, ...this.state.arrObj }
  //     this.setState({ arrObj: tempObj })
  //   })

  // }
  // PaymentTabs(value) {

  //   this.setState({ payment: value }, () => {
  //     let tempObj = { ...this.state.collection, ...this.state.arrObj }
  //     this.setState({ arrObj: tempObj })
  //   })


  // }

  changeTabs(key) {
  }

  onChange(key) {
    if (key == 3) {
      this.setState({ pro: true })
    } else {
      this.setState({ pro: false })
    }
    if (key == 2) {
      this.setState({ temp: true })
    } else {
      this.setState({ temp: false })
    }
  };
  componentWillMount() {
    const temp = qs.parse(window.location.search.substring(1))
      ;
    this.setState({ formid: temp.formid })
  }
  componentDidMount() {
    const events = [];

    const actions = [];



    // console.log(this.state.defaultValue, '===============defaultValue');
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(this.props?.customConfig?.componentId, "", this, { events, actions });
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "集体征收补偿";
  }
  sumit() {
    const myRef = this.myRef.current.changeVal()
    const Quantities = this.Quantities.current.changeVal()
    const Settlement = this.Settlement.current.changeVal()
    const Upload1 = this.Upload1.current.changeVal()
    const Payment = this.Payment.current.changeVal()
    const { defaultValue } = this.state

    // console.log(this.state.arrObj, '=======index');
    // console.log(defaultValue, 'AAAAAAAAAA');
    let tempObj = {
      childData: []
    };
    for (let item in myRef) {
      if (item === 'childData') {
        myRef[item].map(ele => {
          tempObj.childData.push(ele)
        })

      } else {
        tempObj[item] = myRef[item]
      }
    }
    for (let item in Quantities) {
      if (item === 'childData') {
        Quantities[item].map(ele => {
          tempObj.childData.push(ele)
        })

      } else {
        tempObj[item] = Quantities[item]
      }
    }
    for (let item in Settlement) {
      if (item === 'childData') {
        Settlement[item].map(ele => {
          tempObj.childData.push(ele)
        })

      } else {
        tempObj[item] = Settlement[item]
      }
    }
    for (let item in Upload1) {
      if (item === 'childData') {
        Upload1[item].map(ele => {
          tempObj.childData.push(ele)
        })

      } else {
        tempObj[item] = Upload1[item]
      }
    }
    for (let item in Payment) {
      if (item === 'childData') {
        Payment[item].map(ele => {
          tempObj.childData.push(ele)
        })

      } else {
        tempObj[item] = Payment[item]
      }
    }

    if (defaultValue) {
      tempObj.data_id = defaultValue.data_id
      tempObj.flow_instance_id = defaultValue.flow_instance_id
      tempObj.create_member = defaultValue.create_member
      tempObj.office_id = defaultValue.office_id
      tempObj.process_status = defaultValue.process_status
    }

    console.log(tempObj, '===================aa');
    return tempObj


  }

  render() {
    const { pro, formid, defaultValue, temp } = this.state
    return (
      <div className='tabs'>
        {defaultValue?.data_id ? <ButtonModal className="button_modal" processStatus={this.props.processStatus} ></ButtonModal> : ''
        }

        <Tabs defaultActiveKey="1" onChange={(key) => { this.onChange(key) }}  >
          <TabPane tab="被征收人信息" key="1" forceRender={true}>
            {/* <Collection ref={this.myRef} cRef={this.myRef} formid={formid} click={this.hideTabs} /> */}
            <Collection ref={this.myRef} cRef={this.myRef} formid={formid} defaultValue={defaultValue} />
          </TabPane>
          <TabPane tab="装修及附属工程量" key="2" forceRender={true}>
            {/* <Quantities formid={{ formid }} cRef={this.Quantities} click={this.QuantitiesTabs} /> */}
            <Quantities formid={{ formid }} temp={temp} cRef={this.Quantities} defaultValue={defaultValue} />
          </TabPane>
          <TabPane tab="结算" key="3" forceRender={true}>
            {/* <Settlement updateSet={pro} cRef={this.Settlement} click={this.SettlementTabs} /> */}
            <Settlement updateSet={pro} cRef={this.Settlement} defaultValue={defaultValue} />
          </TabPane>
          <TabPane tab="上传资料" key="4" forceRender={true}>
            {/* <Upload1 cRef={this.Upload1} click={this.Upload1Tabs} /> */}
            <Upload1 cRef={this.Upload1} defaultValue={defaultValue} />
          </TabPane>
          <TabPane tab="打款记录" key="5" forceRender={true}>
            <Payment cRef={this.Payment} defaultValue={defaultValue} />
            {/* <Payment cRef={this.Payment} click={this.PaymentTabs} /> */}
          </TabPane>
        </Tabs>
      </div >
    );
  }
}
