import React, { Component } from 'react';
// import axios from 'axios'
import { getContentData } from '../../../src/api/asset'
import '../add/index.css'
// import ReactDOM from 'react-dom'
import { Button } from 'antd'
export default class App extends Component {
  componentDidMount() {
    let aaa = window.location.href
    let num = aaa.indexOf('?')
    const value = aaa.substr(num + 1)
    const arr = value.split('&')
    const obj = {}
    for (let i = 0; i < arr.length; i++) {
      const split = arr[i].split('=')
      obj[split[0].trim()] = split[1].trim()
    }
    console.log(obj);
    getContentData({ dataId: obj.edit_id, formId: obj.id, viewId: obj.view_id }).then(res => {
      let arr = []
      res.data.forEach(item => {
        arr.push(item.name)
        this.setState({ tabData: arr })
      })
      this.setState({ contentData: res.data })
    })
    // getContentData().then(res => {
    //   let arr = []
    //   res.data.forEach(item => {
    //     arr.push(item.name)
    //     this.setState({ tabData: arr })
    //   })
    //   this.setState({ contentData: res.data })
    // })

  }
  state = {
    flag: false,
    tabData: [],
    contentData: [],
    currentIndex: 0,
    showMaskIndex: 0,
    maskeShow: true,
    url: ''
  }
  change = () => {
    this.setState({ flag: true })
  }
  closeMask = () => {
    this.setState({ flag: false, maskeShow: true })
  }
  switchTab = (i) => {
    this.setState({ currentIndex: i })
  }
  changeMask = () => {
    this.setState({ maskeShow: false })
  }
  changeMask1 = () => {
    this.setState({ maskeShow: true })
  }
  bigStyle = {
    width: '90%',
    height: '90%',
    backgroundColor: '#fff',
    position: 'fixed',
    top: '60px',
    left: '120px',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '15px',
    zIndex: '9999999999 !important',
  }
  maskStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: '999999999 !important',
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: '0.8',
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div>
          <Button onClick={this.change} type="primary">协议预览</Button>
        </div>
        <div style={{ width: '100%', height: '100%', position: 'relative', float: 'left', zIndex: '99999999999999999' }}>
          {
            this.state.flag ? (
              <div style={{ width: '100%', height: '100%', }}>
                <div style={this.maskStyle}>
                  <div onClick={this.closeMask} style={{ cursor: 'pointer', width: '50px', height: '50px', textAlign: 'center', float: 'right', lineHeight: '50px', color: '#fff', fontSize: '20px' }}>×</div>
                </div>
                <div style={this.bigStyle}>
                  <div style={{ flex: 1, borderRight: '1px solid #ccc', marginLeft: '35px' }}>
                    {
                      this.state.tabData.map((item, index) => {
                        return (<div key={index} style={{ margin: '30px 0', cursor: 'pointer' }} className={this.state.currentIndex === index ? 'active' : ''} onClick={() => { this.switchTab(index) }}>{item}</div>)
                      })
                    }
                  </div>
                  <div style={{ flex: 4, position: 'relative' }}>
                    {
                      this.state.contentData.map((item, index) => {
                        return (
                          this.state.currentIndex === index ? (
                            <div key={index} style={{ width: '100%', height: '100%' }}>
                              <h1 style={{ textAlign: 'center' }}>{item.name}</h1>
                              <div style={{ overflow: 'scroll', width: '98%', height: '82%', wordBreak: 'break-all', marginLeft: '10px' }} className="scrollBar">
                                <iframe src="https://www.lilnong.top/static/pdf/B-4-RxJS%E5%9C%A8React%E4%B8%AD%E7%9A%84%E5%BA%94%E7%94%A8-%E9%BE%99%E9%80%B8%E6%A5%A0_.pdf" style={{ width: '100%', height: '100%' }} scroll='true'></iframe>
                                {/* <iframe src={item.url} style={{ width: '100%', height: '100%' }} scroll='true'></iframe> */}
                              </div>
                            </div>
                          ) : null
                        )
                      })
                    }
                    {
                      this.state.maskeShow ? (
                        <div style={{ position: 'absolute', bottom: '50px', right: '50px', width: '20%', height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                          <button onClick={this.changeMask}>申请用章</button>
                          <button>签字</button>
                          <button>提交</button>
                          <button onClick={this.closeMask}>关闭</button>
                        </div>
                      ) : (
                        <div style={{ position: 'absolute', bottom: '50px', right: '50px', width: '20%', height: '40px', display: 'flex', justifyContent: 'space-between' }}>
                          <button onClick={this.changeMask1}>通过</button>
                          <button onClick={this.changeMask1}>拒绝</button>
                          <button onClick={this.closeMask}>关闭</button>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            ) : null
          }
        </div>
      </div>
    )
  }
}

// ReactDOM.render(<App />)
