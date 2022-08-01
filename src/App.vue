<template>
  <div className="analyzer-vue-demo">
    <div @click="clickBt">点这里测试逻辑控制</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableDataHeader"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        width="180"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import eventActionDefine from "@/msgCompConfig";

interface Props {
  dataSource: any[][];
  componentId: string | undefined;
  options: { [key: string]: any };
  updateProcess: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  componentId: "",
  options: () => ({
    // 配置项从externalVariables里取
    externalVariables: {},
  }),
  updateProcess: () => {},
});

const fontSize = ref(props?.options?.externalVariables?.fontSize || "14px");

// 解析数据源，转为table所需格式
const zipObject: IZipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};

const tableDataHeader = computed(() =>
  (props.dataSource[0] || []).map((t: string) => ({
    prop: t,
    label: t,
  }))
);
const tableData = computed(() => {
  let [header, ...tableData] = props.dataSource;
  return tableData.map(d => (window?._?.zipObject || zipObject)(header, d));
});

// 逻辑控制用，不可删，return内容可改
const Event_Center_getName = () => {
  return "Demo实例";
};
// 逻辑动作
const do_EventCenter_messageSuccess = (param: { value: any }) => {
  console.log(param.value);
  alert("动作执行成功！");
};

const clickBt = async () => {
  props.componentId &&
    window.eventCenter?.triggerEvent &&
    window.eventCenter.triggerEvent(props.componentId, "onClick", {
      name: "二开插件",
    });
};

onMounted(() => {
  // 注册组件，逻辑控制用
  props.componentId &&
    window.componentCenter?.register &&
    window.componentCenter.register(
      props.componentId,
      "comp",
      { Event_Center_getName, do_EventCenter_messageSuccess },
      eventActionDefine
    );
  props.updateProcess && props.updateProcess();
});
</script>

<style lang="less" scoped>
.analyzer-vue-demo {
  width: 100%;
  height: 100%;
  font-size: v-bind("fontSize");
}
</style>
<style lang="less">
.analyzer-vue-demo {
  table {
    width: 100% !important;
  }
}
</style>
