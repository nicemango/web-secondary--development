<template>
  <div></div>
</template>

<script>
export default {
  name: "AddMultiple",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data.split(""),
    };
  },
  methods: {
   
  },
};
</script>