// el-date-picker type="datetime" 时间转换
exports.timeTransformation = (e) => {
    var date = new Date(e);
    var y = date.getFullYear(); // 年
    var m = date.getMonth() + 1; // 月
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate(); // 日
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours(); // 时
    h = h < 10 ? ('0' + h) : h;
    var min = date.getMinutes(); // 分
    min = min < 10 ? ('0' + min) : min;
    var s = date.getSeconds(); // 秒
    s = s < 10 ? ('0' + s) : s;
    return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;//拼在一起
  }