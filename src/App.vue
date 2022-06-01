<template>
  <div :style="{ width: '100%', height: '100%' }">
    <div className="card-bg" v-on:click="clickbt">
      配置两个插件之后，点这里测试逻辑控制
    </div>
    <div v-if="data && options" :style="{ color: '#ffffff' }">
      展示接收到的变量值:{{ default_value }}
    </div>
    <div v-if="data && options" :style="{ color: '#ffffff' }">
      展示接收到的变量ID:{{ id }}
    </div>

    <div
      v-if="data && options"
      ref="fnref"
      :style="{ width: '100%', height: '100%' }"
    ></div>

    <div v-if="!(data && options)">请配置数据</div>
  </div>
</template>

<script>
import echarts from "echarts";
import { normalizeData } from "./normalizeData";
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data: function () {
    return {
      dataSource: [],
      rowId: "",
      default_value: "",
      id: "",
    };
  },
  computed: {
    data: function () {
      return this.customConfig.data || [];
    },
    options: function () {
      return this.customConfig.options || [];
    },
    variable: function () {
      return this.customConfig.variable || [];
    },
    customConfigClone: function () {
      return JSON.stringify(this.customConfig);
    },
  },
  watch: {
    customConfigClone: (newval) => {
      console.log("customConfigChange", customConfigClone);
      this.initChart(this.variable, this.options, this.data);
    },
    data: (newvalue) => {
      console.log("dataChange", newvalue);
      this.initChart(this.variable, this.options, this.data);
    },
    variable: (newvalue) => {
      console.log("variableChange", newvalue);
      this.initChart(this.variable, this.options, this.data);
    },
    options: (newvalue) => {
      console.log("optionsChange", newvalue);
      this.initChart(this.variable, this.options, this.data);
    },
  },
  created() {
    const pubSub = this.customConfig.pubSub;
    pubSub &&
      pubSub.subscribe(
        "updateChart" + this.customConfig.componentId,
        (data) => {
          console.log("updateChart");
          this.initChart(data.variable, data.options, data.data);
        }
      );
  },
  mounted() {
    this.initChart && this.initChart(this.variable, this.options, this.data);
    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "名称",
            dataType: "string",
            key: "name",
          },
        ],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "成功提示",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];
    window.componentCenter?.register &&
      window.componentCenter.register(
        this.customConfig.componentId,
        "comp",
        this,
        {
          events,
          actions,
        }
      );
    this.customConfig?.updateProcess && this.customConfig.updateProcess();
  },

  methods: {
    Event_Center_getName: () => {
      return "Demo实例";
    },
    do_EventCenter_messageSuccess: function (param) {
      console.log(param);
      alert("动作执行成功！");
    },
    clickbt: function () {
      console.log("clickbt");
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(
          this.customConfig.componentId,
          "onClick",
          {
            name: "二开插件",
          }
        );
    },
    initChart: function (variable, bigScreen_options, bigScreen_data) {
      const myChart = echarts.init(this.$refs.fnref);

      const data = normalizeData(bigScreen_options, bigScreen_data).map((v) => {
        return {
          value: v[1],
          name: v[0],
        };
      });
      const { default_value = "测试的数据", id = "测试的名称" } = variable;

      this.default_value = default_value;
      this.id = id;

      let option = {
        title: {
          text: "演示数据",
          subtext: "演示二级标题",
          left: "center",
          textStyle: {
            color: "#f0f",
            fontWeight: "bold",
          },
          subtextStyle: {
            color: "#f0f",
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#f0f",
            fontWeight: "bold",
          },
        },
        series: [
          {
            name: id,
            type: "pie",
            radius: "50%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      if (option && typeof option === "object") {
        myChart.setOption(option);
        myChart.resize();
      }
    },
  },
};
</script>
