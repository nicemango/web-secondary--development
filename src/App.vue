<template>
  <div class="biggset" :style="{ background: 'url(' + imgUrl + ')' }" ref="big">
    <div v-for="(item, index) in headTab" :key="item.key" style="position: relative; line-height: 49px;">
      <span :class="index == currentIndex ? 'active' : ''" style="cursor: pointer;" @click="changeTab(item, index)">{{
          item.label
      }}</span>
    </div>
    <div style="background-image:-webkit-linear-gradient(bottom,#fff,skyblue); 
    -webkit-background-clip:text; 
    -webkit-text-fill-color:transparent; font-size: 35px;">
      {{ headTitle }}
    </div>
    <div v-for="(item, index) in headTab1" :key="item.key" style="position: relative; line-height: 49px;">
      <span :class="index == currentIndex1 ? 'active' : ''" style="cursor: pointer;" @click="changeTab1(item, index)">{{
          item.label
      }}</span>
    </div>
  </div>

</template>
<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      headTitle: '',
      headTab: [],
      headTab1: [],
      imgUrl: '',
      currentIndex: 4,
      currentIndex1: 4
    }
  },
  computed: {
  },
  mounted() {
    // console.log('customConfig', this.customConfig);
    let big = this.$refs.big
    console.log(big);
    big.parentNode.style.height = '100%'
    big.parentNode.style.width = '100%'
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    this.headTitle = this.customConfig.title
    this.headTab = JSON.parse(this.customConfig.dataSouce).slice(0, 3)
    this.headTab1 = JSON.parse(this.customConfig.dataSouce).slice(3, 6)
    this.imgUrl = this.customConfig.backgroundImg
    console.log(this.headTab, this.headTab1);
  },
  methods: {
    Event_Center_getName() {
      return "头部tab";
    },
    changeTab(item, i) {
      window?.clickMenu({ key: item.key, isSubMenu: true });
      if (this.currentIndex == i) {
        this.currentIndex = 4
        return
      }
      this.currentIndex = i
      this.currentIndex1 = 4
    },
    changeTab1(item, i) {
      window?.clickMenu({ key: item.key, isSubMenu: true });
      if (this.currentIndex1 == i) {
        this.currentIndex1 = 4
        return
      }
      this.currentIndex1 = i
      this.currentIndex = 4
    }
  },
  beforeDestroy() {
    console.log('customConfig', this.customConfig);
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style scoped>
.biggset {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  background-color: transparent;
  color: #fff
}

span:hover {
  color: skyblue;
}

.active {
  color: skyblue;
}

.active1 {
  background-color: skyblue;
}
</style>
<style>
body {
  background-color: #000;
}
</style>