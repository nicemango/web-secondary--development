<template>
  <div class="custom-node">
    <div class="modleTop">
      <div
        class="NodeIcon"
        :style="{
          marginTop: '6px',
          display: icon.html ? 'inline-block' : 'none',
        }"
        v-html="icon.html"
      />
      <img
        class="NodeIcon"
        :src="getIconUrl"
        alt=""
        :style="{
          display: !icon.html ? 'inline-block' : 'none',
        }"
      />
      <el-input
        placeholder="动态输入"
        v-model="nodeName"
        @input="inputChangeVal"
        :style="{ marginTop: '15px', width: '200px' }"
      />
    </div>
    <div class="custom-node-content">
      <div class="content-row">
        <div class="row-left">选择字段：</div>
        <div class="row-right">
          <el-select
            :value="selectCols"
            @change="changeField"
            placeholder="请选择"
            class="textClass"
            multiple
            collapse-tags
            :style="{ width: '200px', marginLeft: '10px' }"
          >
            <el-option
              :key="t.col_index"
              :label="t.col_name"
              :value="t.col_name"
              v-for="t in tests"
            />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  props: {
    currentNode: String,
    nodeCode: String,
    nodeFieldList: Object,
    nodeInfoList: Object,
    obj_id: String,
    updateNode: Function,
    customIcon: Object,
    img: String,
  },
  data() {
    let currentNodes = this.currentNode;
    let detail = this.nodeInfoList[currentNodes] || {};
    let currentfieldList = this.nodeFieldList[currentNodes] || {};
    let label = detail.label?.split(":")[1];
    let field = detail.data?.detail?.columns || [];
    const tests = currentfieldList[currentNodes] || [];
    const newIcon = this.customIcon || {};
    return {
      nodeName: label,
      fields: field,
      detail,
      currentNodes,
      currentfieldList,
      tests,
      selectCols: field.map(_ => _.col_name),
      icon: newIcon,
    };
  },
  methods: {
    updateNode1(newName, newFields) {
      let detail = this.detail;
      detail.data = detail.data || {};
      detail.data.detail = detail.data.detail || {};
      detail.data.text = {
        internalName: newName,
        code: this.currentNodes,
      };
      detail.data.detail.columns = newFields;
      detail.label = this.currentNodes + ":" + newName;
      this.updateNode(detail);
    },

    inputChangeVal(value) {
      this.nodeName = value;
      this.updateNode1(value, this.fields);
    },

    changeField(fieldOpt) {
      let ele = this.tests.filter(test => fieldOpt.includes(test.col_name));
      this.selectCols = fieldOpt;
      this.fields = ele;
      this.updateNode1(this.nodeName, ele);
    },
  },
  computed: {
    getIconUrl() {
      return `${window.location.origin}/storage_area/ext_plugins/web/${this.obj_id}/images/${this.img}`;
    },
  },
};
</script>
<style lang="less" scoped>
.custom-node {
  height: 100%;
  width: 100%;
  background-color: white;
  .modleTop {
    display: flex;
    .NodeIcon {
      color: #9e9e9e;
      margin-left: 18px;
      margin-top: 15px;
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
  }

  .custom-node-content {
    height: 240px;
    padding: 20px 40px;

    .content-row {
      height: 48px;
      display: flex;
      align-items: center;

      .row-left {
        width: 120px;
        text-align: left;
      }

      .row-right {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
