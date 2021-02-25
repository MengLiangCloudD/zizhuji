<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content">
      <div class="item">
        <img src="./../../commen/imager/chaqia.png" alt="">
        <p>正在读卡，请稍后...</p>
      </div>
    </div>
    <div class="zhezhao" v-if="modal1">
      <div class="model">
        <div class="model_top">{{modelStr}}{{text}}</div>
        <div class="model_bottom">
          <div class="model_button" @click="ok1()">重试</div>
          <div class="model_button" @click="cancel1()">返回首页</div>
        </div>
      </div>
    </div>
    <div class="zhezhao" v-if="modal2">
      <div class="model">
        <div class="model_top">{{modelStr}}{{text}}</div>
        <div class="model_bottom">
          <div class="model_button" @click="ok2()">重试</div>
          <div class="model_button" @click="cancel2()">返回首页</div>
        </div>
      </div>
    </div>
    <!-- <Modal
      v-model="modal1"
      :closable="false"
      :mask-closable="false"
      class-name="vertical-center-modal"
      title="错误提示"
      ok-text="重试"
      cancel-text	="返回首页"
      @on-ok="ok1"
      @on-cancel="cancel1">
      <p>{{modelStr}}{{text}}</p>
    </Modal>

    <Modal
      v-model="modal2"
      :closable="false"
      :mask-closable="false"
      class-name="vertical-center-modal"
      title="错误提示"
      ok-text="重试"
      cancel-text	="返回首页"
      @on-ok="ok2"
      @on-cancel="cancel2">
      <p>{{modelStr}}{{text}}</p>
    </Modal> -->


    <!--    <el-dialog :visible.sync="$store.show">11111</el-dialog>-->
  </div>
</template>

<script>
  import Header from './../../commen/header';
  import http from './../../utils/http';
  import axios from 'axios'

  export default {
    components: {
      Header
    },
    data() {
      return {
        title: '',
        goback: true,
        code: '',
        type: '',
        modal1: false,
        modal2: false,
        timer: null,
        timerNum: 31,
        text: "",
        modelStr: "",
      }
    },
    created() {
      var code = this.$route.query.code;
      var type = this.$route.query.type;
      this.code = code;
      if (code == 1) {
        this.title = "当日挂号"
      } else if (code == 2) {
        this.title = "预约挂号"
      } else if (code == 3) {
        this.title = "自助缴费"
      } else if (code == 4) {
        this.title = "收费清单打印"
      }
      this.type = type;
    },
    methods: {
      getback() {
        this.$router.push(`/registration?code=${this.code}&type=${this.type}`)
      },

      //读取医保卡
      async getMedicalCardInfo() {
        var url = "patient/queryMedical";
        var data = {mutliclass: "1"};
        var res = await http.post(this, url, data);
        if (res.body.code === '0') {
          var map = res.body.data[0];
          this.$store.commit("setPatientId", map.patientId);
          this.$store.commit("setName", map.name);
          this.$store.commit("setSex", map.sex);
          this.$store.commit("setIdCardNo", map.idCardNo);
          this.$store.commit("setIcCardNo", map.icCardNo);
          this.$store.commit("setType", "1");
          this.$store.commit("setBirthDate", map.birthDate);
          this.$router.push(`/personalInfo?code=${this.code}&type=${this.type}`)
        } else if (res.body.code === '1') {
          this.modelStr = "该卡未在院内建档，请至收费处建档，";
          this.modal1 = true;
          //启动定时器
          this.getStatus();
          this.$Message.warning(res.body.msg);
        } else {
          this.modelStr = "未检测到卡，请重新插入[1]，";
          this.modal1 = true;
          //启动定时器
          this.getStatus();
          this.$Message.warning(res.body.msg);
        }
      },

      ok1() {
        this.clearTimer();
        this.modal1 = false;
        this.getMedicalCardInfo();
      },
      cancel1() {
        this.clearTimer();
        //返回首页
        this.$router.push(`/`)
      },

      //读取身份证
      async getIdCardInfo() {
        //var idCardNo = "999999198102163738";
        var idCardNo = "";
        //此处调用身份证读卡器得到返回值
        await axios.get('http://localhost:8989/api/ReadMsg', {
          params: {}
        }).then((res) => {
          if (res.data.code == "0") {
            idCardNo = res.data.cardno;
          }
        }).catch((err) => {

        });
        if (idCardNo == "") {
          this.modelStr = "未检测到卡，请重新插入，";
          this.modal2 = true;
          //启动定时器
          this.getStatus();
        }

        var url = "patient/queryState";
        var data = {idCardNo: idCardNo};
        var res = await http.post(this, url, data);
        if (res.body.code === '0') {
          var map = res.body.data[0];
          this.$store.commit("setPatientId", map.patientId);
          this.$store.commit("setName", map.name);
          this.$store.commit("setSex", map.sex);
          this.$store.commit("setIdCardNo", map.idCardNo);
          this.$store.commit("setIcCardNo", map.icCardNo);
          this.$store.commit("setType", "2");
          this.$store.commit("setBirthDate", map.birthDate);
          this.$router.push(`/personalInfo?code=${this.code}&type=${this.type}`)
        } else if (res.body.code === '1') {
          this.modelStr = "该卡未在院内建档，请至收费处建档，";
          this.modal2 = true;
          //启动定时器
          this.getStatus();
          this.$Message.warning(res.body.msg);
        } else {
          this.modelStr = "未检测到卡，请重新插入[2]，";
          this.modal2 = true;
          //启动定时器
          this.getStatus();
          this.$Message.warning(res.body.msg);
        }
      },

      ok2() {
        this.clearTimer();
        this.modal2 = false;
        this.getIdCardInfo();
      },
      cancel2() {
        this.clearTimer();
        //返回首页
        this.$router.push(`/`)
      },
      getStatus() {
        this.loading(); // 启动定时器
        this.timer = setInterval(() => {  //创建定时器
          if (this.timerNum === 0) { // 设置的定时器时间为0后执行的操作
            this.timer && this.clearTimer(); // 关闭定时器
            this.$router.push(`/`)
          } else {
            this.loading();
          }
        }, 1000);
      },
      loading() { // 启动定时器
        this.timerNum -= 1; // 定时器减1
        this.text = this.timerNum + '秒无操作将返回首页';
        this.$forceUpdate();
      },
      clearTimer() {//清除定时器
        clearInterval(this.timer);
        this.timer = null;
        this.timerNum = 31;
      }
    },
    mounted() {
      if (this.type == 1) {
        this.getMedicalCardInfo();
      } else {
        this.getIdCardInfo();
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
      this.timerNum = 31;
    }
  }
</script>

<style scoped>
  .content {
    text-align: center;
  }

  .item {
    display: inline-block;

  }

  .item img {
    width: 369px;
    margin-top: 188px;
  }

  .item p {
    margin-top: 115px;
    font-size: 42px;
    color: #9a9a9a;
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
</style>
