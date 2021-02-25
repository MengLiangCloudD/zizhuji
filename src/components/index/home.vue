<template>
  <div>
    <Header :title="title" :goback="goback"></Header>
    <div class="content">
      <div class="item" @click="goSelectKeepCard(1)">
        <img src="./../../commen/imager/dangriguahao.png" alt="">
      </div>
      <div class="item" @click="goSelfHelpHome()">
        <img src="./../../commen/imager/zizhujiaofei.png" alt="">
      </div>
      <div class="item" @click="goSelectKeepCard(2)">
        <img src="./../../commen/imager/yuyueguahao.png" alt="">
      </div>
      <div class="item" @click="goInventoryFee()">
        <img src="./../../commen/imager/dayin.png" alt="">
      </div>
    </div>
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
        goback: false
      }
    },
    created() {
      this.$store.commit("clear");
    },
    methods: {
      getTest() {
        /**
         * 这是一个get请求
         */
        axios.get('', {
          params: {}
        }).then((res) => {

        }).catch((err) => {

        })
      },
      //挂号
      goSelectKeepCard(code) {
        this.$router.push(`/selectKeepCard?code=${code}`)
      },
      //自助缴费
      goSelfHelpHome() {
        this.$router.push(`/selectKeepCard?code=3`)
      },
      //打印
      goInventoryFee() {
        this.$router.push('/selectKeepCard?code=4')
      },
      // //自助缴费
      // goSelfHelpHome() {
      //   this.$router.push(`/selfHelpHome`)
      // },
      // //打印
      // goInventoryFee() {
      //   this.$router.push('/inventoryFee')
      // },
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
    margin-top: 24px;
    margin-right: 102px;
    /* margin-left: 103px; */
  }

  .item img {
    width: 100%;
  }
</style>
