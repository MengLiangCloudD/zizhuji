<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content">
      <div class="title_info">
        <div class="tit_biao">
          信息
        </div>
        <div class="tit_right_content">
          <div class="tit_right_item tit_right_item1">
            <span>卡类型：</span>
            <span>{{typeStr}}</span>
          </div>
          <div class="tit_right_item tit_right_item2">
            <span>姓名：</span>
            <span>{{name}}</span>
          </div>
          <div class="tit_right_item tit_right_item3">
            <span>性别：</span>
            <span>{{sexStr}}</span>
          </div>
        </div>
      </div>
      <div class="content_info">
        <div class="content_biao">
          年份
        </div>
        <div class="content_right_content">
          <div class="content_right_itemList">
            <div v-for="(item,index) in yearList" :key="index"
                 :class="item.start===0?'content_item':'content_item content_item1'" @click="clickUpdateYear(item)">
              {{item.year}}
            </div>
          </div>
        </div>
      </div>
      <div class="content_info">
        <div class="content_biao">
          月份
        </div>
        <div class="content_right_content">
          <div class="content_right_itemList">
            <div v-for="(item,index) in monthList" :key="index"
                 :class="item.start===0?'content_item':'content_item content_item1'" @click="clickUpdateMonth(item)">
              {{item.month}}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="bottom_btn" @click="goPrintFeeInfo()">
          确定
        </div>
        <div class="bottom_btn" @click="getback()">
          返回首页
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './../../commen/header';
  import http from './../../utils/http';

  export default {
    components: {
      Header
    },
    data() {
      return {
        title: '收费清单打印',
        goback: true,
        yearList: [{
          year: "2018", start: 0
        }, {
          year: "2019", start: 0
        }, {
          year: "2020", start: 0
        }, {
          year: "2021", start: 0
        }],
        monthList: [
          {
            month: '1', start: 0
          },
          {
            month: '2', start: 0
          },
          {
            month: '3', start: 0
          },
          {
            month: '4', start: 0
          },
          {
            month: '5', start: 0
          },
          {
            month: '6', start: 0
          },
          {
            month: '7', start: 0
          },
          {
            month: '8', start: 0
          },
          {
            month: '9', start: 0
          },
          {
            month: '10', start: 0
          },
          {
            month: '11', start: 0
          },
          {
            month: '12', start: 0
          }
        ],
        //选择的年
        year: '',
        //选择的月
        month: '',
        typeStr: '',
        name: '',
        sexStr: '',
      }

    },
    created() {
      this.name = this.$store.state.name;
      var sex = this.$store.state.sex + "";
      if (sex == "0") {
        this.sexStr = '男';
      } else if (sex == "1") {
        this.sexStr = '女';
      }
      var type = this.$store.state.type;
      if (type == 1) {
        this.typeStr = '医保卡';
      } else if (type == 2) {
        this.typeStr = '身份证';
      }
      //this.month = this.monthList[0].month;
      //this.year = this.yearList[0].year;
    },
    mounted() {
      this.getYearList();
    },
    methods: {
      getback() {
        this.$router.push(`/`)
      },
      goPrintFeeInfo() {
        this.$router.push(`/printFeeInfo?year=${this.year}&month=${this.month}`)
      },
      //点击改变数据里的start状态切换年份
      clickUpdateYear(item) {
        var list = this.yearList;
        for (var i = 0; i < list.length; i++) {
          list[i].start = 0;
          if (list[i].year === item.year) {
            list[i].start = 1;
            this.year = list[i].year;
          }
        }
        this.yearList = list;
        //不同于react自动更新页面 改变数据重新渲染需要调用新方法
        this.$forceUpdate();
        this.getMonthList(item.year, false);
      },
      //点击改变数据里的start状态切换月份
      clickUpdateMonth(item) {
        var list = this.monthList;
        for (var i = 0; i < list.length; i++) {
          list[i].start = 0;
          if (list[i].month === item.month) {
            list[i].start = 1;
            this.month = list[i].month;
          }
        }
        this.monthList = list;
        //不同于react自动更新页面 改变数据重新渲染需要调用新方法
        this.$forceUpdate();
      },


      //获取所有年份【默认最后一年】
      async getYearList() {
        var url = "date/getYear";
        var data = {};
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          var list = res.data;
          var yearList = [];
          for (var i = 0; i < list.length; i++) {
            var map = {year: list[i], start: 0};
            yearList[i] = map;
            if (i == list.length - 1) {
              yearList[i].start = 1;
              this.year = list[i];
            }
          }
          this.yearList = yearList;
          this.getMonthList(this.year, true);
        }else{
           this.$Message.warning(res.msg);
        }
      },

      //获取所有月份【默认最后一年最后一个月】
      async getMonthList(year, flag) {
        var url = "date/getMonth";
        var data = {year: year};
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          var list = res.data;
          var monthList = [];
          for (var i = 0; i < list.length; i++) {
            var map = {month: list[i], start: 0};
            monthList[i] = map;
            if (i == 0) {
              if (!flag) {//点击切换年份后
                monthList[i].start = 1;
                this.month = monthList[i].month;
              }
            }
            if (i == list.length - 1) {
              if (flag) {//最新的年份
                monthList[i].start = 1;
                this.month = monthList[i].month;
              }
            }
          }
          this.monthList = monthList;
        }else{
           this.$Message.warning(res.msg);
        }
      }
    }
  }
</script>

<style scoped>
  .title_info {
    margin: 40px 80px 30px 145px;
    display: flex;
  }

  .tit_biao {
    font-size: 30px;
    color: #222;
    flex: 1;
    padding-top: 53px;
  }

  .tit_right_content {
    width: 1548px;
    height: 134px;
    border-radius: 28px;
    background: #eafcf2;
    line-height: 134px;
    font-size: 30px;
    color: #222;
    margin-left: 86px;
  }

  .tit_right_item {
    display: inline-block;
    vertical-align: middle;
  }

  .tit_right_item1 {
    margin-left: 70px;

  }

  .tit_right_item2 {
    margin-left: 145px;
  }

  .tit_right_item3 {
    margin-left: 144px;
  }

  .content_info {
    margin: 0 80px 30px 145px;
    display: flex;
  }

  .content_biao {
    font-size: 30px;
    color: #222;
    flex: 1;
    padding-top: 79px;
  }

  .content_right_content {
    width: 1548px;
    min-height: 120px;
    border-radius: 28px;
    background: #eafcf2;
    /* line-height: 180px; */
    font-size: 30px;
    color: #222;
    margin-left: 86px;
    padding: 30px 0 0 0;
  }

  .content_right_itemList {
    display: flex;
    flex-wrap: wrap;

  }

  .content_item {
    margin-left: 40px;
    width: 200px;
    height: 120px;
    line-height: 120px;
    background: #fff;
    text-align: center;
    border-radius: 20px;
    margin-bottom: 30px;
  }

  .content_item1 {
    background: #3aaa6e;
    color: #fff;
  }

  .bottom {
    margin-top: 46px;
    text-align: center;
  }

  .bottom_btn {
    width: 193px;
    height: 72px;
    margin: 0 27px;
    line-height: 72px;
    text-align: center;
    color: #fff;
    font-size: 24px;
    background: #3aaa6e;
    border-radius: 20px;
    display: inline-block;
  }

</style>
