<template>
  <div>统计时间：{{time}}</div>
</template>
<script>
import { departmentTabel } from "../../api/api.js";
export default {
  props: ["name"],
  data() {
    return {
      time: "",
      code: ""
    };
  },
  created() {
    //  console.log(this.name )
     if (this.name == "taskobject") {
        this.code = "1-1";
      } else if (this.name == "Sell") {
        this.code = "1-2";
      } else if (this.name == "Application") {
        this.code = "2-1";
      } else if (this.name == "Edit") {
        this.code = "2-2";
      }
      let params = {
        code: this.code
      };
      departmentTabel("/accounting/pj/time", params)
        .then(res => {
          this.time = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    // getDepartmentTabelTime();
  },
  methods: {
    getDepartmentTabelTime() {
     
    }
  },
  watch: {
    name: function(newVal, oldVal) {}
  }
};
</script>

<style type="text/css" lang="scss" scoped>
</style>
