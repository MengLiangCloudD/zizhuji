<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <Getback></Getback>
    <div class="zhezhao" v-if="model">
      <div class="model">
        <div class="model_top">同一个科室一天只能挂一个号</div>
        <!-- <div class="model_center">同一个科室一天只能挂一个号</div> -->
        <div class="model_bottom">
          <div class="model_button" @click="clickClose()">返回首页</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content_left">
        <div :class="selectStart==0?'btn btn1':'btn'" @click="clickBtn(0)">挂号信息</div>
        <!--        <div :class="selectStart==1?'btn btn1':'btn'" @click="clickBtn(1)">挂号须知</div>-->
      </div>
      <div class="content_right" v-if="selectStart===0">
        <div class="item">
          <div class="content_right_left">
            <p>
              <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
              <span>{{name}}</span>
            </p>
            <p>
              <span>身份证号</span>
              <span>{{idCardNo}}</span>
            </p>
            <p v-if="type==1">
              <span>医保卡号</span>
              <span>{{icCardNo}}</span>
            </p>
            <p>
              <span>就诊科室</span>
              <span>{{depName}}</span>
            </p>
            <p>
              <span>号源名称</span>
              <span>{{insCode}}</span>
            </p>
            <p>
              <span>就诊医生</span>
              <span>{{dcName}}</span>
            </p>
            <p>
              <span>就诊时间</span>
              <span>{{regTime}}</span>
            </p>
            <p>
              <span>挂号费用</span>
              <span>￥{{fee}}</span>
            </p>
            <!-- 在这里写判断是否需要医保 -->
            <div v-if="type==1">
              <p style="margin-top: 30px;">
                <span>医保报销</span>
                <span>￥{{Ybbxfair}}</span>
              </p>
              <p>
                <span>自付费用</span>
                <span>￥{{Infair}}</span>
              </p>
            </div>
          </div>
          <div :class="beforPayType?'content_right_right1':'content_right_right'">
            <div id="qrcode" ref="qrcode" class="img"></div>
            <p v-if="payType==1">打开微信扫一扫，扫码支付</p>
            <p v-if="payType==2">打开支付宝扫一扫，扫码支付</p>
            <p>请在2分钟内完成支付，{{second}}秒后将自动返回首页</p>
            <div class="bottom_btn">
              <div :class="payType==2?'pay_price pay_price1':'pay_price'" @click="clickPayType(1,true)">
                <img src="./../../commen/imager/wx.png" alt="">
                <span>使用微信支付</span>
              </div>
              <div :class="payType==1?'pay_price pay_price1':'pay_price'" @click="clickPayType(2,true)">
                <img src="./../../commen/imager/zfb.png" alt="">
                <span>使用支付宝支付</span>
              </div>
            </div>
          </div>
          <div :class="beforPayType?'content_right_right':'content_right_right1'">
            <div class="buton">
              <div :class="'pay_buton pay_buton1'" @click="beforclickPayType(1,false)">
                <!--              <div :class="payType==1?'pay_buton pay_buton1':'pay_buton'" @click="beforclickPayType(0,false)">-->
                <img src="./../../commen/imager/wx.png" alt="">
                <span>选择微信支付</span>
              </div>
              <div :class="'pay_buton pay_buton1'" @click="beforclickPayType(2,false)">
                <!--              <div :class="payType==0?'pay_buton pay_buton1':'pay_buton'" @click="beforclickPayType(1,false)">-->
                <img src="./../../commen/imager/zfb.png" alt="">
                <span>选择支付宝支付</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content_txt" v-if="selectStart===1">
        <div class="item_txt">
          <div class="titile">
            伟达医院挂号须知
          </div>
          <div class="txt">
            <p>一、挂号须知</p>
            <p>1、根据系统指示填写“网上预约挂号申请”，点击“递交”后系统将发送短信至用户手机上。</p>
          </div>

        </div>
      </div>
    </div>
    <div class="zhezhao" v-if="modal1">
      <div class="model">
        <div class="model_top">是否打印挂号单</div>
        <div class="model_bottom">
          <div class="model_button" @click="ok1()">打印挂号单</div>
          <div class="model_button" @click="cancel1()">返回首页</div>
        </div>
      </div>
    </div>
    <div class="zhezhao" v-if="modal2">
      <div class="model">
        <div class="model_top">正在打印，5秒后自动返回首页</div>
        <div class="model_bottom">
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  import Header from './../../commen/header';
  import http from './../../utils/http';
  import QRCode from 'qrcodejs2'
  import Getback from './../../commen/getback';


  export default {
    components: {
      Header,
      Getback
    },
    data() {
      return {
        title: '挂号详情',
        goback: true,
        code: '',
        selectStart: 0,
        type: '',
        insCode: '',
        depCode: '',
        depName: '',
        dcCode: '',
        dcName: '',
        fee: '',
        regTime: '',
        name: '',
        idCardNo: '',
        icCardNo: '',
        ticketNum: '',
        second: '',
        count: 0,
        timer: null,
        timer2: null,
        timer3: null,
        sexStr: '',
        modal1: false,
        modal2: false,
        rtId: '',
        patientId: '',
        Ybbxfair: '正在计算...',
        Infair: '正在计算...',
        Fair:'',
        payType: 1,//1为微信2为支付宝
        beforPayType: true,// 选择支付方式之前为true，选择之后为false
        qrcodeFlag: false,
        model:false,
        spinShow:false
      }
    },
    created() {
      var code = this.$route.query.code;
      this.code = code;
      if (code == 1) {
        this.title += "-当日挂号"
      } else if (code == 2) {
        this.title += "-预约挂号"
      }
      var type = this.$route.query.type;
      this.type = type;
      var insCode = this.$route.query.insCode;
      this.insCode = insCode;
      var depCode = this.$route.query.depCode;
      this.depCode = depCode;
      var depName = this.$route.query.depName;
      this.depName = depName;
      var dcCode = this.$route.query.dcCode;
      this.dcCode = dcCode;
      var dcName = this.$route.query.dcName;
      this.dcName = dcName;
      var fee = this.$route.query.fee;
      this.fee = fee;
      var regTime = this.$route.query.regTime;
      this.regTime = regTime;
      var rtId = this.$route.query.rtId;
      this.rtId = rtId;

      this.name = this.$store.state.name;
      this.idCardNo = this.$store.state.idCardNo;
      this.patientId = this.$store.state.patientId;
      this.icCardNo = this.$store.state.icCardNo;
      var sex = this.$store.state.sex + "";
      if (sex == "0") {
        this.sexStr = '男';
      } else if (sex == "1") {
        this.sexStr = '女';
      }

    },
    mounted() {
      if (this.type == 1) {//医保
        //1、调接口展示医保报销部分和自付部分
        this.createNativeForFee();
      }else{
        this.Ybbxfair=0.00;
        this.Infair =0.00;
        this.Fair=0.00;
      }
    },
    methods: {
       //点击关闭
      clickClose() {
        this.model = false;
        this.$router.push(`/`);
      },
      getback() {
        this.$router.push(`/clinicList?code=${this.code}&type=${this.type}&depName=${this.depName}&depCode=${this.depCode}`);
      },
      //点击切换
      clickBtn(selectStart) {
        this.selectStart = selectStart;
      },
      goPayOver() {
        if (this.type == 1) {
          this.$router.push(`/insurance?code=${this.code}&type=${this.type}`);
        } else {
          this.$router.push(`/payOver?code=${this.code}&type=${this.type}`);
        }
      },
      //未展示二维码时点击函数
      beforclickPayType(code, beforPayType) {
        this.payType = code;
        this.beforPayType = beforPayType;
        //生成收款二维码
        this.createNative();
      },
      //已展示二维码时点击函数
      clickPayType(code, beforPayType) {
        if (this.payType != code) {
          this.payType = code;
          //生成收款二维码
          this.createNative();
        }
      },
      //生成收款二维码
      async createNative() {
        var url = "wxpay/createNative";
        this.spinShow = true;
        var data = {
          regName: this.name,
          idCard: this.idCardNo,
          healthCard: this.icCardNo,
          funName: this.insCode,
          depCode: this.depCode,
          depName: this.depName,
          dcCode: this.dcCode,
          dcName: this.dcName,
          regDate: this.regTime,
          fee: this.fee,
          sex: this.sexStr,
          patientId: this.patientId,
          code: this.type,
          ptId: this.type,
          rtId: this.rtId,
          type: this.payType,
          Ybbxfair:this.Ybbxfair,
          Infair:this.Infair,
          Fair:this.Fair
        };
        var res = await http.post(this, url, data);
        this.spinShow = false;
        if (res.code === '0') {
          this.second = 121;
          this.ticketNum = res.data.ticketNum;
          this.$refs.qrcode.innerHTML = '';
          new QRCode('qrcode', {
            width: 285,
            height: 287, // 高度
            text: res.data.codeUrl // 二维码内容
          });
          if (this.qrcodeFlag) {//切换后请求
            this.clearTimer();
          } else {//首次请求
            this.qrcodeFlag = true;
          }
          this.getStatus();
          this.getTicketStatus();
        } else {
          this.model=true;
          this.$Message.warning(res.msg);
        }
      },

      //医保分解
      async createNativeForFee() {
        var url = "wxpay/regiPay";
        this.spinShow = true;
        var data = {
          regName: this.name,
          idCard: this.idCardNo,
          healthCard: this.icCardNo,
          funName: this.insCode,
          depCode: this.depCode,
          depName: this.depName,
          dcCode: this.dcCode,
          dcName: this.dcName,
          regDate: this.regTime,
          fee: this.fee,
          sex: this.sexStr,
          patientId: this.patientId,
          code: 1,
          ptId: 1,
          rtId: this.rtId,
          type: this.payType,
        };
        var res = await http.post(this, url, data);
        this.spinShow = false;
        if (res.body.code === '0') {
          this.Ybbxfair = res.body.data[0].Ybbxfair;
          this.Infair = res.body.data[0].Infair;
          this.Fair =  res.body.data[0].Fair;
        }else {
          this.model=true;
          this.$Message.warning(res.body.msg);
        }
      },

      //查询挂号单是否已支付
      async getTicketStatus() {
        var url = "register/getTicketStatus";
        var data = {
          ticketNum: this.ticketNum,
        };
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          if (res.data == 0) {
            if (this.count <= 41) {
              this.count += 1;
              this.timer2 = setTimeout(() => {
                this.getTicketStatus();
              }, 3000);
            } else {
              this.clearTimer();
              this.$router.push(`/`);
            }
          } else if (res.data == 1) {//已支付
            this.clearTimer();
            //弹出打印窗口
            this.modal1 = true;
          }
        } else {
          if (this.count <= 41) {
            this.count += 1;
            this.timer2 = setTimeout(() => {
              this.getTicketStatus();
            }, 3000);
          } else {
            this.clearTimer();
            this.$router.push(`/home`);
          }
          this.$Message.warning(res.msg);
        }
      },

      ok1() {
        //打印挂号单
        this.modal1 = false;
        this.modal2 = true;
        this.printReg();
        this.timer3 = setTimeout(() => {
          this.$router.push(`/`);
        }, 5000);
      },
      cancel1() {
        //返回首页
        this.$router.push(`/`);
      },

      //打印挂号单接口
      async printReg() {
        var url = "print/printReg";
        var data = {
          ticketNum: this.ticketNum,
        };
        var res = await http.post(this, url, data);
      },

      getStatus() {
        this.loading(); // 启动定时器
        // clearInterval(this.timer);
        this.timer = setInterval(() => {  //创建定时器
          if (this.second <= 0) { //2分钟外
            this.timer && this.clearTimer(); // 关闭定时器
            this.$router.push(`/`);
          } else {//2分钟内
            console.log(this.second);
            this.loading();
          }
        }, 1000);
      },
      loading() {
        this.second -= 1;
      },
      clearTimer() {
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.timer2);
        this.timer2 = null;
        clearInterval(this.timer3);
        this.timer3 = null;
      }
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (this.timer2) {
        clearInterval(this.timer2);
        this.timer2 = null;
      }
      if (this.timer3) {
        clearInterval(this.timer3);
        this.timer3 = null;
      }
    },

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
    padding: 61px 62px 51px 62px;
    background: #eafcf2;
    border-radius: 28px;
    width: 1350px;

  }

  .item {
    display: flex;
    /* flex-wrap: wrap; */
  }

  .content_right_left {
    width: 656px;
    height: 780px;
    background: #fff;
    border-radius: 20px;
  }

  .content_right_left p {
    margin-top: 30px;
    margin-left: 66px;
    font-size: 24px;
  }

  .content_right_left p span {
    color: #222222;
  }

  .content_right_left p span:nth-of-type(1) {
    margin-right: 62px;
    color: #9a9a9a;
  }

  .content_right_left p:nth-of-type(1) {
    margin-top: 50px;
  }

  .content_right_right {
    background: #fff;
    width: 656px;
    height: 780px;
    border-radius: 20px;
    margin-left: 38px;
    text-align: center;
  }

  .content_right_right1 {
    position: absolute;
    z-index: 999;
    opacity: 0;
  }

  .content_right_right .img {
    width: 285px;
    height: 287px;
    margin-top: 163px;
    /* margin-left: 186px; */
    display: inline-block;
  }

  .content_right_right p {
    text-align: center;
    font-size: 24px;
    color: #222222;
    /* margin-top: 64px; */
  }

  .content_right_right p:nth-of-type(1) {
    margin-top: 64px;
    margin-bottom: 20px;
  }

  .content_txt {
    background: #eafcf2;
    vertical-align: top;
    display: inline-block;
    padding: 60px 80px 82px 80px;
    border-radius: 28px;
  }

  .item_txt {


    /* background: #eafcf2; */

    width: 1314px;
    height: 750px;
    overflow: auto;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .titile {
    /* margin-top: 60px; */
    text-align: center;
    font-size: 30px;
    color: #222222;
  }

  .txt {
    margin-top: 36px;
    /* margin-left: 80px; */
    /* margin-right: 80px; */
    font-size: 28px;
    color: #222222;

  }

  .txt p {
    line-height: 64px
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

  .bottom_btn {
    text-align: center;
    margin-top: 20px;
  }

  .pay_price {
    width: 258px;
    height: 70px;
    line-height: 70px;
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
    background: #eafcf2;
    border-radius: 20px;
    font-size: 24px;
    color: #222222;
    text-align: center;
  }

  .pay_price1 {
    width: 256px;
    height: 68px;
    border: 1px solid #eafcf2;
    background: #fff;
  }

  .pay_price img {
    width: 36px;
    height: 36px;
    display: inline-block;
    vertical-align: middle;
  }

  .pay_price span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;
  }

  .buton {
    text-align: center;
    margin-top: 200px;
  }

  .pay_buton {
    width: 258px;
    height: 70px;
    line-height: 70px;

    margin: 0 auto;
    margin-top: 42px;
    background: #eafcf2;
    border-radius: 20px;
    font-size: 24px;
    color: #222222;
    text-align: center;
  }

  .pay_buton1 {
    width: 256px;
    height: 68px;
    border: 1px solid #eafcf2;
    background: #fff;
  }

  .pay_buton img {
    width: 36px;
    height: 36px;
    display: inline-block;
    vertical-align: middle;
  }

  .pay_buton span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;
  }
  .zhezhao {
    position: absolute;
    width: 100%;
    height: calc(100% - 140px);
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
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
