<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <Getback></Getback>
    <div class="content">
      <div class="content_left">
        <div :class="selectStart==0?'btn btn1':'btn'">{{depName}}</div>
        <!-- <div :class="selectStart==1?'btn btn1':'btn'" @click="clickBtn(1)">专家号源</div> -->
      </div>


      <!-- <div class="content_right" v-if="rightFlag">

        <div class="content_item">
          <div class="item" v-for="(item,index) in doctorList" :key="index" @click="goDetail(item)">
            <div class="title_heardImg">
            </div>
            <div class="doctor_info">
              <p>
                <span>{{item.dcName}}</span>
                <span>{{item.insCode}}</span>
                <span>&ensp; ¥{{item.fee}}</span>
              </p>
              <p>
                <span>伟达中医肿瘤医院</span>
                <span>{{depName}}</span>
              </p>
            </div>
          </div>
        </div>
      </div> -->


      <div class="content_right1">
        <div class="right_title" v-if="dayFlag">
          <div v-for="(item,index) in timeList" :key="index"
               :class="item.start==1?'title_item':'title_item title_item1'" @click="selectTable(item)">
            <p>{{item.week}}</p>
            <p>{{item.date}}</p>
          </div>
        </div>
        <div :class="dayFlag?'right_content':'right_content1'" v-if="rightFlag">
          <div class="item" v-for="(item,index) in doctorList" :key="index" @click="goDetail(item)">
            <div class="title_heardImg">
              <img src="" alt="">
            </div>
            <div class="doctor_info">
              <p>
                <span>{{item.dcName}}</span>
                <span>{{item.insCode}}</span>
                <span>&ensp; ¥{{item.fee}}</span>
              </p>
              <p>
                <span>伟达中医肿瘤医院</span>
                <span>{{depName}}</span>
              </p>
            </div>
          </div>
          <div v-if="tipFlag" class="doctorListnull">
            当日无出诊医师
          </div>
        </div>

      </div>

    </div>
    <!-- <div class="zhezhao" v-if="modal1">
      <div class="model">
        <div class="model_top">当日无出诊医生</div>
        <div class="model_bottom">
          <div class="model_button" @click="ok1()">返回科室选择</div>
          <div class="model_button" @click="cancel1()">返回首页</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import Header from './../../commen/header';
  import http from './../../utils/http';
  import Getback from './../../commen/getback';


  export default {
    components: {
      Header,
      Getback
    },
    data() {
      return {
        title: '号源列表',
        goback: true,
        code: '',
        selectStart: 0,
        doctorList: [{
          id: '',
          dcCode: '',
          dcName: '',//显示
          depCode: '',
          insCode: '',//显示
          deptName: '',
          scheDate: '',
          fee: '',//显示
          rtId: '',
        }],
        //日期
        timeList: [
          {
            day: "2020-12-08 星期二",
            date: "2020-12-08",
            week: "星期二",
            start: 0,
          }
        ],
        type: '',
        depName: '',
        depCode: '',
        modal1: false,
        regTime: "",
        rightFlag: false,
        tipFlag: false,
        dayFlag: false,
      }
    },
    created() {
      var code = this.$route.query.code;
      var type = this.$route.query.type;
      var depName = this.$route.query.depName;
      var depCode = this.$route.query.depCode;
      this.type = type;
      this.code = code;
      this.depName = depName;
      this.depCode = depCode;
      if (code == 1) {
        this.title += "-当日挂号"
      } else if (code == 2) {
        this.title += "-预约挂号"
        this.dayFlag = true;
      }

      this.getThisWeek();
    },
    methods: {
      getback() {
        this.$router.push(`/depList?code=${this.code}&type=${this.type}`)
      },
      //确认挂号页
      goDetail(item) {
        this.$router.push(`/registrationInfo?code=${this.code}&type=${this.type}&insCode=${item.insCode}&depCode=${this.depCode}&depName=${this.depName}&dcCode=${item.dcCode}&dcName=${item.dcName}&fee=${item.fee}&regTime=${this.regTime}&rtId=${item.rtId}`)
      },
      //点击切换
      selectTable(item) {
        //切换改变数据重新渲染页面
        var list = this.timeList;
        for (var i = 0; i < list.length; i++) {
          list[i].start = 0;
          if (item.day === list[i].day) {
            list[i].start = 1;
          }
        }
        this.timeList = list;
        //不同于react自动更新页面 改变数据重新渲染需要调用新方法
        this.$forceUpdate();
        this.regTime = item.day;
        this.getSchedDoc();
      },
      //点击切换
      clickBtn(selectStart) {
        this.selectStart = selectStart;
      },

      //获取已排班医生
      async getSchedDoc() {
        var url = "sched/list";
        var data = {
          scheDate: this.regTime,
          depCode: this.depCode
        };
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          this.doctorList = res.data;
          if (this.doctorList.length == 0) {
            this.modal1 = true;
            this.tipFlag = true;
          } else {
            this.tipFlag = false;
          }
          this.rightFlag = true;
        }else{
          this.$Message.warning(res.msg);
        }
      },

      //获取当前往后7天的日期
      async getThisWeek() {
        var url = "date/getThisWeek";
        var data = {};
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          var list = res.data;
          var list2 = [];
          for (var i = 0; i < list.length; i++) {
            var day = list[i];
            var arr = day.split(" ");

            var map = {start: 0, day: day, date: arr[0], week: arr[1]};
            list2.push(map);
          }
          list2[0].start = 1;
          this.regTime = list2[0].day;

          this.timeList = list2;
          this.getSchedDoc();

        }else{
          this.$Message.warning(res.msg);
        }
      },

      ok1() {
        //返回科室选择
        this.$router.push(`/depList?code=${this.code}&type=${this.type}`);
      },
      cancel1() {
        //返回首页
        this.$router.push(`/`);
      },

    },
    mounted() {
      if (this.code == 1) {//取接口下标为0的
        this.regTime = this.timeList[0].day;
      }
    }
  }
</script>

<style scoped>
  .content {
    padding-top: 25px;
  }

  .content_left {
    display: inline-block;
    padding: 0 42px 0 45px;
    padding-top: 47px;
    vertical-align: top;
  }

  .btn {
    width: 324px;
    height: 68px;
    border-radius: 20px;
    line-height: 68px;
    text-align: center;
    font-size: 30px;
    color: #222222;
    margin-top: 14px;

  }

  .btn1 {
    background: #eafcf2;
  }

  .content_right {
    vertical-align: top;
    display: inline-block;
    /* padding: 54px 25px 80px 65px;
    background: #eafcf2;
    border-radius: 28px;
    width: 1385px; */
  }

  .content_item {
    display: flex;
    flex-wrap: wrap;
  }

  .item {
    width: 306px;
    padding: 72px 0;
    height: 353px;
    text-align: center;
    background: #fff;
    border-radius: 20px;
    box-shadow: 6px 3px 6px 3px rgb(238, 237, 237), -6px 3px 6px 3px rgb(238, 237, 237);
    margin-right: 40px;
    margin-top: 26px;
    display: inline-block;
  }

  .title_heardImg {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: #222222;
    overflow: hidden;
    display: inline-block;

  }

  .title_heardImg img {
    width: 100%;

  }

  .doctor_info p:nth-of-type(1) {
    margin-top: 42px;
    font-size: 24px;
    color: #222222;
  }

  .doctor_info p {
    line-height: 1;
  }

  .doctor_info p:nth-of-type(2) {
    margin-top: 18px;
    font-size: 20px;
    color: #9a9a9a;
  }

  .doctor_info p span:nth-of-type(1) {
    margin-right: 18px;
  }

  .content_right1 {
    vertical-align: top;
    display: inline-block
  }

  .right_title {
    padding: 36px 0 36px 57px;
    border-radius: 28px;
    width: 1474px;
    background: #eafcf2;
    /* height: 161px; */
    display: flex;
    flex-wrap: wrap;
  }

  .title_item {
    width: 153px;
    height: 161px;
    background: #3aaa6e;
    color: #fff;
    text-align: center;
    border-radius: 20px;
    line-height: 161px;
    margin-right: 48px;

  }

  .title_item1 {
    background: #fff;
    color: #222222;
  }

  .title_item p:nth-of-type(1) {
    font-size: 30px;
    padding-top: 44px;
  }

  .title_item p:nth-of-type(2) {
    font-size: 20px;
    margin-top: 20px;
  }

  .right_content {
    padding: 40px 0 40px 61px;
    width: 1474px;
    height: 555px;
    background: #eafcf2;
    border-radius: 28px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .right_content1 {
    padding: 40px 0 40px 61px;
    width: 1474px;
    height: 885px;
    background: #eafcf2;
    border-radius: 28px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .zhezhao {
    position: absolute;
    width: 100%;
    height: calc(100% - 140px);
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    top: 140px;
  }

  .model {
    width: 868px;
    height: 499px;
    background: #fff;
    border-radius: 28px;
    text-align: center;
    color: #9a9a9a;
    font-size: 42px;
    margin: 0 auto;
    margin-top: 144px;
  }

  .model_top {
    padding-top: 146px;
  }

  .model_center {
    margin-top: 44px;
  }

  .model_bottom {
    margin-top: 80px;
  }

  .model_button {
    width: 193px;
    height: 72px;
    line-height: 72px;
    color: #fff;
    background: #3aaa6e;
    font-size: 24px;
    margin: 0 27px;
    border-radius: 20px;
    display: inline-block;
  }

  .doctorListnull {
    margin: 50px auto;
    font-size: 40px;
  }
</style>
