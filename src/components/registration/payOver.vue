<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content">
      <div class="content_title">
        <img src="./../../commen/imager/zhifuwancheng(1).png" alt="">
        <p>付款完成</p>
        <!-- <p>是否打印小票，打印小票请点击打印按钮</p> -->
        <p>10秒后自动跳转到主页</p>
      </div>
      <div class="bottom">
        <!-- <div class="btn">打印</div> -->
        <div class="btn" @click="goHome()">返回首页</div>
      </div>
    </div>
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
        title: ' ',
        goback: true,
        code: '',
        selectStart: 1,
      }

    },
    created() {
      var code = this.$route.query.code;
      this.code = code;
      var type = this.$route.query.type;
      this.type = type;
      var that = this;
      setTimeout(() => {
          that.$router.push(`/`)
      }, 10000);
    },
    methods: {
      getback() {
        this.$router.push(`/registrationInfo?code=${this.code}&type=${this.type}`);
      },
      goHome() {
        this.$router.push(`/`);
      }
    }
  }
</script>

<style scoped>
  .content {
    text-align: center;
  }

  .content_title {
    margin-top: 120px;
  }

  .content_title img {
    width: 250px;
    height: 249px;
  }

  .content_title p:nth-of-type(1) {
    margin-top: 78px;
    color: #222222;
    font-size: 44px;
    /* font-weight: 600; */
  }

  .content_title p:nth-of-type(2), .content_title p:nth-of-type(3) {
    margin-top: 50px;
    color: #9a9a9a;
    font-size: 42px;
    /* font-weight: 600; */
  }

  .bottom {
    margin-top: 70px;
  }

  .btn {
    width: 193px;
    height: 72px;
    display: inline-block;
    vertical-align: middle;
    line-height: 72px;
    background: #3aaa6e;
    color: #fff;
    border-radius: 20px;
    text-align: center;
    margin: 0 38px;
    font-size: 24px;
  }
</style>
