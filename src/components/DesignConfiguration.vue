<template>
  <el-form ref="form" :model="form" label-width="80">
    <!-- 时间展示步长 -->
    <el-form-item label="时间展示步长">
       <el-select v-model="form.timeStep" placeholder="请选择" size="small">
        <el-option label="月份" value="month"></el-option>
        <el-option label="日期" value="date"></el-option>
        <el-option label="小时" value="time"></el-option>
      </el-select>
    </el-form-item>
    <!-- 配置表单ID -->
    <el-form-item label="配置表单ID">
       <el-input v-model="form.formID" placeholder="请输入配置表单ID" size="small"></el-input>
    </el-form-item>
    <!-- 项目资产ID -->
    <el-form-item label="删除接口Key">
       <el-input v-model="form.deleteKey" placeholder="请输入项目资产ID" size="small"></el-input>
    </el-form-item>
    <!-- 项目表渲染字段 -->
    <el-form-item label="任务表映射字段">
       <el-input v-model="form.taskMappingField" placeholder="请输入项目表渲染字段" size="small"></el-input>
    </el-form-item>
    <!-- 任务资产ID -->
    <el-form-item label="任务资产ID">
       <el-input v-model="form.taskID" placeholder="请输入任务资产ID" size="small"></el-input>
    </el-form-item>
    <!-- 任务表渲染字段 -->
    <el-form-item label="任务表渲染字段">
       <el-input v-model="form.taskField" placeholder="请输入任务表渲染字段" size="small"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DesignConfiguration',

  props: {
    customConfig: Object,
    platformProps: Object
  },

  data() {
    // 储存配置项数据
    let form = {
      timeStep: "",
      formID: "",
      deleteKey: "",
      taskMappingField: "",
      taskID: "",
      taskField: "",
    }
    // 赋值平台数据
    if(this.platformProps) {
      form = JSON.parse(this.platformProps.configuration)
    }
    
    return {
      configForm: {},
      form: form
    }
  },

  mounted() {
    // 数据隔离
    if(this.platformProps) {
      this.configForm = JSON.parse(this.platformProps.configuration)
    } else {
      this.configForm = this.customConfig.configuration
    }
  },

  watch: {
    "form.timeStep": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.formID": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.deleteKey": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.taskMappingField": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.taskID": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.taskField": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },
  
  methods: {
    onFormLayoutChange() {
     this.platformProps?.changeConfiguration(JSON.stringify(this.form));
    }
  },
};
</script>