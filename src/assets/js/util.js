import moment from "moment";

// function setCookie(name, value, time = "", path = "") {
//   if (time && path) {
//     var strsec = time * 1000;
//     var exp = new Date();
//     exp.setTime(exp.getTime() + strsec * 1);
//     document.cookie =
//       name +
//       "=" +
//       escape(value) +
//       ";expires=" +
//       exp.toGMTString() +
//       ";path=" +
//       path;
//   } else if (time) {
//     var strsec = time * 1000;
//     var exp = new Date();
//     exp.setTime(exp.getTime() + strsec * 1);
//     document.cookie =
//       name + "=" + escape(value) + ";expires=" + exp.toGMTString();
//   } else if (path) {
//     document.cookie = name + "=" + escape(value) + ";path=" + path;
//   } else {
//     document.cookie = name + "=" + escape(value);
//   }
// }
// exports.setCookie = setCookie;
// //获取cookie
// function getCookie(name) {
//   var arr,
//     reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//   if ((arr = document.cookie.match(reg))) {
//     return unescape(arr[2]);
//   } else {
//     return null;
//   }
// }
// exports.getCookie = getCookie;
// //删除cookie
// function delCookie(name) {
//   var exp = new Date();
//   exp.setTime(exp.getTime() - 1);
//   // 这里需要判断一下cookie是否存在
//   var c = getCookie(name);
//   if (c != null) {
//     document.cookie = name + "=" + c + ";expires=" + exp.toGMTString();
//   }
// }

// exports.delCookie = delCookie;

export function formatDate(item) {
  let str = "";
  if (item) {
    item = parseInt(item);
    str = moment(item).format("YYYY-MM-DD");
  }
  return str;
}
