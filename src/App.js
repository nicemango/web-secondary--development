import React, { Component } from "react";

import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts)

const events = [];
const actions = [];

export default class App extends Component {
  state = {};

  constructor(props) {
    super(props);

    let external = props.options?.externalVariables ? props.options.externalVariables : {}
    
    this.from1 = external.区间一 || '0-40'
    this.from2 = external.区间二 || '40-160'
    this.from3 = external.区间三 || '160-200'
    this.fromMax = external.区间最大值 || '200'
    this.fromTitle = external.仪表盘标题 || 'km/h'
<<<<<<< HEAD
    this.titleHeight = external.仪表盘标题位置 || '50'
=======
>>>>>>> e76b264f40e4a9bb3b4a52dc6eb315e1b73dfc53
    this.fromValue = external.仪表盘数值 || '80'

  }

  componentDidMount() {
    const { updateProcess, componentId } = this.props;

    window?.componentCenter?.register(componentId, "comp", this, {
      events,
      actions,
    });
    updateProcess && updateProcess();

    this.Event_Center_getName = () => {
      return "仪表盘";
    };

    this.initEcharts()
  }

  initEcharts() {
    Highcharts.chart(this.refs['gaugeEcharts'],{
      credits: { enabled: false },
      chart: { type: 'gauge' },
      title: { text: '' },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [ [0, '#FFF'], [1, '#333'] ] },
          borderWidth: 0,
          outerRadius: '109%'
        }, {
          backgroundColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [ [0, '#333'], [1, '#FFF'] ] },
          borderWidth: 1,
          outerRadius: '107%'
        }, {}, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '105%',
          innerRadius: '103%'
        }]
      },
      yAxis: {
        min: 0,
        max: this.fromMax,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: { step: 2, rotation: 'auto' },
        title: { 
          text: this.fromTitle,
          style: {
            transform: `translateY(${this.titleHeight}%)`
          },
        },
        titleLocation: 'end',
        plotBands: [
          {
            from: Number(this.from1.split('-')[0]),
            to: Number(this.from1.split('-')[1]),
            color: '#55BF3B' // green
          }, 
          {
            from: Number(this.from2.split('-')[0]),
            to: Number(this.from2.split('-')[1]),
            color: '#DDDF0D' // yellow
          }, 
          {
            from: Number(this.from3.split('-')[0]),
            to: Number(this.from3.split('-')[1]),
            color: '#DF5353' // red
          }
        ]
      },
      series: [
        {
          data: [Number(this.fromValue)],
        }
      ]
    });
  }

  render() {
    return(
      <div ref="gaugeEcharts" style={{ width: '100%', height: '100%'}}></div>
    )
  }
}
