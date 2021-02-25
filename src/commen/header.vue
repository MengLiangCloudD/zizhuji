<template>
  <div>
    <div :class="title===''?'title':'title1'">
      <div class="title_left" v-if="title===''">
        <img src="./imager/39f0989f2d5b8ec637a6e261894cc18.png" alt="">
      </div>
      <div class="fahui" v-else>
        <img src="./../commen/imager/goHome.png" alt="" v-if="goback" @click="goHome()">
        <div>{{title}}</div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      goback: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        dateStr: 1607097596000,
      }
    },
    methods: {
      // getback() {
      //   this.$emit("getback");
      // },
      goHome(){
        this.$router.push('/indux');
      },
      //获取当前时间
      getDate() {

      },


    },
  }
</script>

<style scoped>
  .title {
    width: 100%;
    height: 140px;
    background: #3aaa6e;
    position: relative;
  }

  .title1 {
    width: 100%;
    height: 140px;
    background: #3aaa6e;
    position: relative;
    text-align: center;
  }

  .fahui {
    padding-top: 49px;
    font-size: 36px;
    color: #fff;
    font-weight: 600;
  }

  .fahui img {
    position: absolute;
    left: 80px;
    top: 28px;
    width: 99px;
    height: 79px;
  }

  .title_left img {
    width: 294px;
    height: 82px;
    margin-left: 80px;
    margin-top: 27px;
  }

  /* .title_right {
    position: absolute;
    right: 80px;
    top: 51px;
    font-size: 36px;
    color: #fff;
    font-weight: 600;
  } */
</style>
