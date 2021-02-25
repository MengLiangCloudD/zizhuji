<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content">
      <div class="item" @click="goRegistration(1)">
        <img src="./../../commen/imager/yikeep.png" alt="">
      </div>
      <div class="item" @click="goRegistration(2)">
        <img src="./../../commen/imager/noyikeep.png" alt="">
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
        code: ''
      }
    },
    created() {
      var code = this.$route.query.code;
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
    },
    methods: {
      getback() {
        this.$router.push(`/`);
      },
      //科室列表
      goRegistration(type) {
        //type:1-医保挂号，2-身份证挂号
        this.$store.commit("type", type);
        this.$router.push(`/registration?code=${this.code}&type=${type}`);
      }
    }
  }
</script>

<style scoped>
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 47px 0 0 104px;
  }

  .item {
    width: 806px;
    margin-top: 226px;
    margin-right: 102px;
    /* margin-left: 103px; */
  }

  .item img {
    width: 100%;
  }

</style>
