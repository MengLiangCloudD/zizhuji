<template>
  <div>
    <div class="title_right" ref="timeXxx">
      {{dateStr | formatDate}}
    </div>
  </div>
</template>

<script>
  import http from './../utils/http';

  export default {
    data() {
      return {
        dateStr: 946656000000,
      }
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);

        let weekStr = date.getDay();
        switch (weekStr) {
          case 0:
            weekStr = "星期日";
            break;
          case 1:
            weekStr = "星期一";
            break;
          case 2:
            weekStr = "星期二";
            break;
          case 3:
            weekStr = "星期三";
            break;
          case 4:
            weekStr = "星期四";
            break;
          case 5:
            weekStr = "星期五";
            break;
          case 6:
            weekStr = "星期六";
            break;
          default:
            weekStr = "";
            break;
        }

        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '年' + MM + '月' + d + '日 ' + h + ':' + m + ':' + s + ' ' + weekStr;
      }
    },
    created() {
      //获取服务器时间
      this.getTime();
      var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(function () {
        _this.dateStr = _this.dateStr + 1000;
      }, 1000);


    },
    methods: {

      async getTime() {
        var url = "date/getCurrentTime";
        var data = {};
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          this.dateStr = res.data;
        }else{
          this.$Message.warning(res.msg);
        }
      },

    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    },
  }
</script>

<style scoped>
  .title_right {
    position: absolute;
    right: 80px;
    top: 51px;
    font-size: 36px;
    color: #fff;
    font-weight: 600;
    z-index: 999;
  }
</style>
