<template>
    <div>
         <Header :title="title"  :goback="goback" @getback="getback"></Header>
         <div class="content">
             <!-- <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2743786503,3895901848&fm=26&gp=0.jpg" alt=""> -->
             <div id="qrcode" ref="qrcode" class="img"></div>
              <p v-if="payType==1">打开微信扫一扫，扫码支付</p>
            <p v-if="payType==2">打开支付宝扫一扫，扫码支付</p>
            <p>请在2分钟内完成支付，{{second}}秒后将自动返回首页</p>
         </div>
         <div class="bottom">
             <div :class="payType==2?'pay_price pay_price1':'pay_price'" @click="clickPayType(1,true)">
                <img src="./../../commen/imager/wx.png" alt="">
                <span>使用微信支付</span>
              </div>
              <div :class="payType==1?'pay_price pay_price1':'pay_price'" @click="clickPayType(2,true)">
                <img src="./../../commen/imager/zfb.png" alt="">
                <span>使用支付宝支付</span>
              </div>
         </div>
         <div class="zhezhao" v-if="modal1">
            <div class="model">
                <div class="model_top">缴费成功！</div>
                <div class="model_bottom">
                <!-- <div class="model_button" @click="ok1()">确定</div> -->
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
 import QRCode from 'qrcodejs2';
  import http from './../../utils/http';
    export default {
        components:{
            Header
        },
         data(){
            return{
                title:'自助缴费',
                goback:true,
                payType:1,
                second:1000,
                qrcodeFlag: false,
                type:'',
                code:'',
                ticketNum:'',
                timer:'',
                timer2:'',
                timer3:'',
                 count: 0,
                 modal1:false,
                 modal2:false,
                 spinShow:false
            }
            
        },
        created(){
            var code = this.$route.query.code;
            var type = this.$route.query.type;
            this.code = code;

            this.type = type;
            this.createNative();
        },
         methods: {
            getback() {
                this.$router.push(`/selfHelpHome`)
            },
            ok1() {
                //打印挂号单
                this.modal1 = false;
                // this.modal2 = true;
                // this.printReg();
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
            //已展示二维码时点击函数
            clickPayType(code, beforPayType) {
                if (this.payType != code) {
                    this.payType = code;
                    //生成收款二维码
                    this.createNative();
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
            //生成二维码
            async createNative(){
                var url  = 'wxpay/repayMent';
                this.spinShow = true;
                var patientId = this.$store.state.patientId;
                var recSerial = localStorage.getItem('recSerial');
                var dataLislMap = JSON.parse(localStorage.getItem('dataLislMap'));
                var tradeno = dataLislMap.tradeNo;
                var feeself =  dataLislMap.feeself;
                var feefund = dataLislMap.feefund;
                var revSerial =  dataLislMap.revSerial
                var regName = this.$store.state.name;
                var idCard = this.$store.state.idCardNo;
                var type =this.payType;
                var ptId = this.type;
                var code = this.type;
                var FeeAll = localStorage.getItem('zongfee');
                var data = {
                    patientId,regName,idCard,type,ptId,code,FeeAll,recSerial,tradeno,feeself,feefund,revSerial
                }
                var res = await http.post(this, url, data);
                this.spinShow=false;
                if (res.code === '0') {
                    this.second = 121;
                    this.ticketNum = res.data.ticketNum;
                    this.$refs.qrcode.innerHTML = '';
                    new QRCode('qrcode', {
                        width: 413,
                        height: 417, // 高度
                        text: res.data.codeUrl // 二维码内容
                    });
                    if (this.qrcodeFlag) {//切换后请求
                        // this.clearTimer();
                    } else {//首次请求
                        this.qrcodeFlag = true;
                    }
                     this.getStatus();
                     this.getTicketStatus();
                }else if(res.code === '2'){
                     this.$router.push(`/payOver`);
                } else {
                    this.$Message.warning(res.msg);
                }
            },
            getStatus() {
                this.loading(); // 启动定时器
                 clearInterval(this.timer);
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
.content{
    text-align: center;
}
.content .img{
    width: 413px;
    height: 417px;
    margin-top: 184px;
    display: inline-block;
}
.content p{
    margin-top: 20px;
    font-size: 24px;
    color: #222222;
}
.bottom{
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
   .zhezhao {
    position: absolute;
    width: 100%;
    height: calc(100% - 140px);
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    bottom: 0;
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