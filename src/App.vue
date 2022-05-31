<template>
  <div id="main" ref="main" style="height:100%;margin: auto;"></div>
</template>

<script>
import * as echarts from 'echarts';

const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};

export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {
          bgColor: '',
          title: '',
          position: '',
          titlefontSize: '',
          titlefontColor: ''
        },
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      demoTableData: [],
      data: [],
      x: [],
      y: [],
      z: [],
      source: [],
      timer: null
    };
  },
  // computed: {
  //   tableDataHeader() {
  //     return (this.dataSource[0] || []).map(t => ({
  //       prop: t,
  //       label: t,
  //     }));
  //   },
  //   tableData() {
  //     let [header, ...tableData] = this.dataSource;
  //     tableData = tableData || [];
  //     return tableData.map(d => (window?._?.zipObject || zipObject)(header, d));
  //   },
  // },
  mounted() {
    // console.log(this.options.externalVariables.tiTle);
    this.handlerData()
    const events = [

    ];

    const actions = [

    ];

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
    this.eChartsInit()
  },
  methods: {
    all(a) {
      a[0].map((item, index) => {
        a.map(ite => {
          this.x.push(ite[index])
        })
        this.z.push(this.x.splice(a.length, a.length))
      })
      this.z[0] = this.x
      // this.z.unshift([])
      return this.z
    },
    handlerData() {
      this.source = this.all(this.dataSource)
    },
    eChartsInit() {
      // console.log(this.options.externalVariables.tiTle);
      // var chartDom = document.getElementById('main');
      var chartDom = this.$refs.main
      var myChart = echarts.init(chartDom);
      var option;
      // echarts.dataTool.prepareBoxplotData(this.dataset.source)
      option = {
        title: [
          {
            text: this.options.externalVariables.title ? this.options.externalVariables.title : '标题',
            left: this.options.externalVariables.position ? this.options.externalVariables.position : 'center',
            // left: '50%',
            textStyle: {
              fontSize: this.options.externalVariables.titlefontSize ? this.options.externalVariables.titlefontSize : '18px',
              color: this.options.externalVariables.titlefontColor ? this.options.externalVariables.titlefontColor : '#464646'
            }
          },
        ],
        dataset: [
          {
            // prettier-ignore
            source: this.source
          },
          {
            fromDatasetIndex: 1,
            fromTransformResult: 1
          }
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: this.dataSource[0]
        },
        yAxis: {
          type: 'value',
          splitArea: {
            show: true
          }
        },
        series: [
          {
            name: 'boxplot',//箱形图
            type: 'boxplot',
            itemStyle: { //盒须图样式。
              color: this.options.externalVariables.bgColor ? this.options.externalVariables.bgColor : "skyblue", //boxplot图形的颜色。 默认从全局调色盘 option.color 获取颜色
              borderColor: '#000', //boxplot图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
            },
          }
        ]
      };
      option && myChart.setOption(option);
      this.timer = setTimeout(() => {
        window.addEventListener('resize', function () {
          myChart.resize()
        })
      }, 1000)

    },
    clickBt() {
      this.componentId &&
        window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "onClick", {
          name: "二开插件",
        });
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "箱体图";
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },

};
</script>
<style>
html,
body {
  height: 100% !important;
}

template {
  width: 100% !important;
  height: 100% !important;
}

#main {
  width: 100% !important;
  height: 100% !important;
}
</style>