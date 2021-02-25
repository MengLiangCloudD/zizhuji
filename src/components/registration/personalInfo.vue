<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content_title">
      <p>*核时信息无误后请点击确认按钮，如信息有误请返回首页重新插卡</p>
    </div>
    <div class="content">
      <p><span>患者姓名：</span>{{name}}</p>
      <p><span>患者性别：</span>{{sexStr}}</p>
      <p><span>身份证号：</span>{{idCardNo}}</p>
      <p><span>医保卡号：</span>{{icCardNo}}</p>
      <p><span>卡片类型：</span>{{typeStr}}</p>
    </div>
    <div class="content_bottom">
      <p>
        <img src="./../../commen/imager/jinggao.png" alt="">
        <span>自助机暂不支持工伤患者挂号，请到窗口就诊。</span>
      </p>
      <p>北京医保患者请使用北京医保卡挂号，取号，否则费用将全部自理。</p>
      <p>住院期间不能使用医保卡预约门诊号源</p>
    </div>
    <div class="item_button" @click="confirm()">确认</div>
  </div>
</template>

<script>
  import Header from './../../commen/header';

  export default {
    components: {
      Header
    },
    data() {
      return {
        title: '患者信息',
        goback: true,
        code: '',
        type: '',

        name: '',
        sexStr: '',
        idCardNo: '',
        icCardNo: '',
        typeStr: '',
      }

    },
    created() {
      var code = this.$route.query.code;
      var type = this.$route.query.type;
      this.code = code;
      this.type = type;

      this.name = this.$store.state.name;
      var sex = this.$store.state.sex + "";
      if (sex == "0") {
        this.sexStr = '男';
      } else if (sex == "1") {
        this.sexStr = '女';
      }
      this.idCardNo = this.$store.state.idCardNo;
      this.icCardNo = this.$store.state.icCardNo;
      if (type == "1") {
        this.typeStr = '医保卡';
      } else if (type == "2") {
        this.typeStr = '身份证';
      }
    },
    methods: {
      getback() {
        this.$router.push(`/registration?code=${this.code}&type=${this.type}`);
      },

      confirm() {
        if (this.code == 1 || this.code == 2) {
          this.$router.push(`/depList?code=${this.code}&type=${this.type}`);
        } else if (this.code == 3) {//自助缴费
          this.$router.push(`/selfHelpHome?code=${this.code}&type=${this.type}`);
        } else if (this.code == 4) {//打印清单
          this.$router.push(`/inventoryFee?code=${this.code}&type=${this.type}`);
        }
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .content_title {
    text-align: center;
    margin-top: 82px;
    font-size: 24px;
    color: #ff9000;
  }

  .content {
    /* text-align: center; */
    width: 544px;
    margin: 110px auto 85px auto;
    border-top: 1px solid #e5e5e5;
  }

  .content p {
    text-align: left;
    font-size: 24px;
    color: #222222;
    padding: 18px 0;
    padding-left: 27px;
    border-bottom: 1px solid #e5e5e5;
  }

  .content p span {
    color: #9a9a9a;
  }

  .content_bottom {
    text-align: center;
  }

  .content_bottom p {
    font-size: 24px;
    color: #9a9a9a;
    line-height: 58px;
  }

  .content_bottom p img, .content_bottom p span {
    display: inline-block;
    vertical-align: middle;
  }

  .content_bottom p img {
    width: 27px;
    height: 27px;
  }

  .item_button {
    width: 193px;
    height: 73px;
    line-height: 73px;
    color: #fff;
    font-size: 24px;
    border-radius: 20px;
    background: #3aaa6e;
    margin: 30px auto 0 auto;
    text-align: center;
  }
</style>
