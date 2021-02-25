<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content" v-if="itemList.length > 0">
      <div class="title">
        <div class="title_left">
          <p>
            <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
            <span>{{name}}</span>
          </p>
          <p>
            <!--            <span>医保类型</span>-->
            <!--            <span>自费</span>-->
          </p>
          <p>
            <!--            <span>收费时间</span>-->
            <!--            <span>2020-10-10 15:08:03</span>-->
          </p>
        </div>
        <div class="title_right">
          <p>
            <span>身份证号码</span>
            <span>{{idCardNo}}</span>
          </p>
          <!--          <p>-->
          <!--            <span>票据单号</span>-->
          <!--            <span>1545155155255258558</span>-->
          <!--          </p>-->
        </div>
      </div>
      <div class="tablie">
        <div class="item_table">
          项目
        </div>
        <div class="item_table">
          金额
        </div>
      </div>
      <div class="content_table_all">
        <div class="itemInfo" v-for="(item,index) in itemList" :key="index">
          <div class="Info">
            <p>{{item.feeType}}</p>
          </div>
          <div class="Info">
            <p>{{item.fee}}</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="price">
                    <span>
                        合计金额：
                    </span>
          <span>￥{{feeAll}}</span>
        </div>
        <div class="price" v-if="type==1">
                    <span>
                        报销金额：
                    </span>
          <span>￥{{dataLislMap.feefund}}</span>
        </div>
        <div class="price"  v-if="type==1">
                    <span>
                        实际支付金额：
                    </span>
          <span>￥{{dataLislMap.feeself}}</span>
        </div>
        <div class="btn" @click="goPayFees()">
          确认支付
        </div>
      </div>
    </div>
    <div class="content1" v-else>
      <img src="./../../commen/imager/wushuju.png" alt="">
      <p>当前无待缴费项目</p>
      <p>5秒后自动跳到主页</p>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
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
        title: '自助缴费',
        goback: true,
        spinShow:false,
        //项目列表
        itemList: [
          {
            "fee": '2369.3424',//金额
            "recSerial": '200727nzwh0018',//单据号
            "feeType": '成药',//项目
          },
          {
            "fee": '70.6823',
            "recSerial": '200727nzwh0019',
            "feeType": '草药',
          }
        ],
        name: '',
        idCardNo: '',
        timer: null,
        code:'',
        type:'',
        feeAll:0,
        dataLislMap:{}
      }

    },
    created() {
      var code = this.$route.query.code;
      var type = this.$route.query.type;
      this.code = code;

      this.type = type;

      this.name = this.$store.state.name;
      this.idCardNo = this.$store.state.idCardNo;
    },
    mounted() {
      this.itemList = [];
      this.getFee();
    },
    methods: {
      getback() {
        this.$router.push(`/`)
      },
      //支付
      goPayFees() {
        var list = this.itemList;
        var recSerial = '';
        if(list.length>1){
          for(var i = 0;i<list.length;i++){
            recSerial+=list[i].recSerial + '|';
          }
          recSerial = recSerial.substr(0,recSerial.length-1);
        }else{
          recSerial=list[0].recSerial;
        }
        localStorage.setItem('recSerial',recSerial);
        localStorage.setItem('zongfee',this.feeAll);
        localStorage.setItem('dataLislMap',JSON.stringify(this.dataLislMap))
        this.$router.push(`/payFees?code=${this.code}&type=${this.type}`);
      },

      //查询待缴费订单
      async getFee() {
        var url = "register/getFee";
        this.spinShow = true;
        var data = {
          patientId: this.$store.state.patientId,
          code:this.$route.query.type
        };
        var res = await http.post(this, url, data);
        this.spinShow = false;
        if (res.body.code === '0') {
          this.itemList = res.body.data;
          this.dataLislMap = res.body.datas[0];
          this.feeAll = res.body.feeAll;
        } else if (res.body.code === '1') {
          this.itemList = [];
          this.$Message.warning(res.body.msg);
        } else {
          this.itemList = [];
          this.$Message.warning(res.body.msg);
        }
        if (this.itemList.length == 0) {
          this.timer = setTimeout(() => {
            this.$router.push(`/`);
          }, 5000);
        }
      },
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
  }
</script>

<style scoped>
  .title {
    margin-left: 80px;
    margin-top: 57px;
  }

  .title_left, .title_right {
    display: inline-block;
    vertical-align: top;
    margin-right: 40px;
  }

  .title_left p, .title_right p {
    margin-bottom: 20px;
  }

  .title_left p span:nth-of-type(1), .title_right p span:nth-of-type(1) {
    font-size: 20px;
    color: #9a9a9a;
    margin-right: 30px;
  }

  .title_left p span:nth-of-type(2), .title_right p span:nth-of-type(2) {
    font-size: 20px;
    color: #222222;
  }

  .tablie {
    margin: 17px 80px 32px 80px;
    border-top: 1px solid #9a9a9a;
    padding-top: 37px;
    display: flex; /*弹性布局*/

    flex-wrap: wrap; /*允许换行*/
  }

  .item_table {
    width: 25%;
    text-align: left;
    font-size: 20px;
    color: #9a9a9a;
  }

  .content_table_all {
    width: 100%;
    height: 476px;
    overflow: auto;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .itemInfo {
    margin: 0px 80px 20px 80px;
    display: flex; /*弹性布局*/

    flex-wrap: wrap;
  }

  .Info {
    width: 25%;
    text-align: left;
    font-size: 20px;
    color: #222222;
  }

  .bottom {
    width: 100%;
    border-top: 1px solid #9a9a9a;
    margin-top: 30px;
    text-align: right;
    padding-top: 34px;
    /* height: 153px; */
  }

  .price, .btn {
    display: inline-block;
    vertical-align: middle;
  }

  .price {
    margin-right: 45px;
  }

  .price span:nth-of-type(1) {
    font-size: 20px;
    color: #222222;
  }

  .price span:nth-of-type(2) {
    font-size: 30px;
    color: #222222;
  }

  .btn {
    text-align: center;
    line-height: 80px;
    width: 193px;
    height: 80px;
    background: #3aaa6e;
    color: #fff;
    font-size: 24px;
    border-radius: 20px;
    margin-right: 80px;
  }

  .content1 {
    text-align: center;
  }

  .content1 img {
    width: 281px;
    height: 253px;
    margin-top: 240px;
  }

  .content1 p:nth-of-type(1) {
    margin-top: 114px;
    color: #222222;
    font-size: 42px;
    /* font-weight: 600; */
  }

  .content1 p:nth-of-type(2) {
    margin-top: 50px;
    color: #9a9a9a;
    font-size: 42px;
    /* font-weight: 600; */
  }
</style>
