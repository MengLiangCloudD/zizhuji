<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content">
      <div class="content_title">
        <img src="./../../commen/imager/dayin(1).png" alt="">
        <p>正在打印，请勿离开，请勿拔卡</p>
        <p>打印完成后10秒自动跳转到首页</p>
      </div>
      <div class="bottom">
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
        timer: null,
      }
    },
    created() {
      var code = this.$route.query.code;
      this.code = code;
    },
    mounted(){
      this.timer = setTimeout(() => {
        this.$router.push(`/`);
      }, 10000);
    },
    methods: {
      getback() {
        this.$router.push(`/printFeeInfo`)
      },
      goHome() {
        this.$router.push(`/`)
      }
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
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

  .content_title p {
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
