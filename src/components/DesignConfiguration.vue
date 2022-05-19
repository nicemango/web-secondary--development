<template>
  <el-form ref="form" :model="form" label-width="80px">

    <el-form-item label="宽度">
      <el-input v-model="form.mapWidth"></el-input>
    </el-form-item>

    <el-form-item label="高度">
      <el-input v-model="form.mapHeight"></el-input>
    </el-form-item>

    <el-form-item label="地区选择">
      <el-cascader 
        v-model="form.mapCityCenter"
        :props="defaultProps"
        :options="cityList"
        @change="changeCity"
        clearable
        :show-all-levels="false">
      </el-cascader>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        mapWidth: '',
        mapHeight: '',
        mapCityCenter: '',
      },
      defaultProps: {
        checkStrictly: true,
        children: 'districts',
        label: 'name',
        value: 'center'
      },
      cityList: [
        {
          citycode:"0550",
          adcode:"341122",
          name:"来安县",
          center:"118.432581,32.423072",
          level:"district",
          districts: [
            {
              citycode: "0550",
              adcode: "341122",
              name: "半塔镇",
              center: "118.701065,32.590168",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "大英镇",
              center: "118.572488,32.305753",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "施官镇",
              center: "118.527349,32.466620",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "独山镇",
              center: "118.656849,32.380153",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "三城镇",
              center: "118.432675,32.211573",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "张山镇",
              center: "118.527756,32.475997",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "汊河镇",
              center: "118.521078,32.276365",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "新安镇",
              center: "118.397498,32.484612",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "舜山镇",
              center: "118.441099,32.604501",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "杨郢乡",
              center: "118.497747,32.678146",
              level: "street",
            },
            {
              citycode: "0550",
              adcode: "341122",
              name: "水口镇",
              center: "118.574325,32.401077",
              level: "street",
            }
          ]
        }
      ]
    };
  },

  watch: {
    "form.mapWidth": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.mapHeight": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.mapCityCenter": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },

  props: {
    changeConfiguration: Function,
    configuration: Object,
    customConfig: Object,
  },

  mounted() {
    if(JSON.parse(this.customConfig.configuration).mapWidth) {
      this.form = JSON.parse(this.customConfig.configuration)
    } else {
      this.form.mapWidth = "100%"
      this.form.mapHeight = "500px"
      this.form.mapCityCenter = ["118.432581,32.423072"]
    }
  },

  methods: {
    onFormLayoutChange() {
      this.customConfig.changeConfiguration(JSON.stringify(this.form));
    },

    changeCity(value) {
      this.mapCityCenter = value
    }
  },
  
};
</script>