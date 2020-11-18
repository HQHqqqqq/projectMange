// 封装公共方法 lmg 使用this.util.getNowDate() 使用
export default {
  // 获取当前时间 年月日
  getNowDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
  },
  // 里程碑组件 重新封装到OA参数 表单形式
  getOAMilestone(tableData) {
    var arr = [];
    if (tableData != null) {
      for (var i = 0; i < tableData.length; i++) {
        var item = tableData[i];
        //添加选中的数据
        if (item.deliverableStatus) {
          var hash = {};
          hash["stageName"] = item.stageName; //阶段名称 新增字段
          hash["milestoneName"] = item.milestoneName;
          hash["progressPercentage"] = item.progressPercentage;
          hash["isCut"] = item.isCut == 1 ? "是" : "否";
          hash["description"] = item.description;
          hash["estimatedStartDate"] = item.expectedBeginTime; //预计开始时间
          hash["estimatedFinishDate"] = item.expectedEndTime; //预计结束时间
          hash["estimatedWorkingHours"] = item.workHours; //预计工时
          // 交付物数据
          var deliverable = item.deliverable;
          var del_str = "";
          deliverable.forEach(del => {
            if (del.checkedStatus) {
              del_str += del.deliverableName + "、";
            }
          });
          hash["delStr"] = del_str.substr(0, del_str.length - 1);
          arr.push(hash);
        }
      }
    }
    console.log("======里程碑OA数据======");
    console.log(arr);
    return arr;
  }
}
