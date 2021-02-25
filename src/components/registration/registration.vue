<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <Getback></Getback>
    <div class="content">
      <div class="item">
        <img src="./../../commen/imager/dang.png" alt="">
        <div class="item_txt">
          <p>请插入<span>{{cardTxt}}</span></p>
          <p>插卡后请点击确认按钮</p>

        </div>
        <!-- <div class="bttn" @click="readCard()">
          确认
        </div> -->
        <div class="bottom">
          <div class="bottom_btn" @click="readCard()">
            确认
          </div>
          <div class="bottom_btn" @click="getType()">
            返回首页
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './../../commen/header';
  import Getback from './../../commen/getback';

  export default {
    components: {
      Header,
      Getback
    },
    data() {
      return {
        title: '',
        goback: true,
        code: '',
        cardTxt: '',
        type: ''
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
      //1:医保挂号,2:身份证挂号
      this.type = type;
      if (type == 1) {
        this.cardTxt = '医保卡'
      } else if (type == 2) {
        this.cardTxt = '身份证'
      }
    },
    methods: {
      getType(){
        this.$router.push(`/`);
      },
      getback() {
        this.$router.push(`/selectKeepCard?code=${this.code}`);
      },
      //读卡页面
      readCard() {
        this.$router.push(`/readCard?code=${this.code}&type=${this.type}`)
      }
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
    width: 385px;
    margin-top: 127px;
  }

  .item_txt p:nth-child(1) {
    margin-top: 96px;
    font-size: 44px;
    color: #222222;
  }

  .item_txt p:nth-child(2) {
    margin-top: 50px;
    font-size: 42px;
    color: #9a9a9a;
  }

  .bttn {
    display: inline-block;
    width: 193px;
    height: 73px;
    text-align: center;
    line-height: 73px;
    color: #fff;
    background: #3aaa6e;
    font-size: 24px;
    border-radius: 20px;
    margin-top: 57px;
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
