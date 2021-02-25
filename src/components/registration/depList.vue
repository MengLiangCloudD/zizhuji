<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <div class="content">
      <div class="item" v-for="(item,index) in depList" :key="index" @click="goClinicList(item)">
        <img src="./../../commen/imager/medical-icon.png" alt="">
        <p>{{item.depName}}</p>
      </div>
    </div>
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
        title: '科室列表',
        goback: true,
        code: '',
        //科室列表
        depList: [{
          depName: "",
          depCode: ""
        }]
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

      this.getdepList();
    },
    methods: {
      getback() {
        this.$router.push(`/personalInfo?code=${this.code}&type=${this.type}`)
      },
      //号源列表
      goClinicList(item) {
        this.$router.push(`/clinicList?code=${this.code}&type=${this.type}&depName=${item.depName}&depCode=${item.depCode}`)
      },

      //查询所有科室
      async getdepList() {
        var url = "dept/query";
        var data = {};
        var res = await http.post(this, url, data);
        if (res.body.code === '0') {
          var list = res.body.data;
          var list2 = [];
          for (var i = 0; i < list.length; i++) {
            // if (i != 6) {
              list2[i] = list[i];
            // } else {
            //   break;
            // }
          }
          this.depList = list2;
        }else{
          this.$Message.warning(res.body.msg);
        }
      },
    }

  }
</script>

<style scoped>
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0 0 74px;
    height: calc(1080px - 140px);
    overflow: auto;
  }

  .item {
    margin-top: 50px;
    margin-right: 45px;
    width: 554px;
    position: relative;
  }

  .item img {
    width: 100%;
  }

  .item p {
    position: absolute;
    right: 109px;
    top: 117px;
    font-size: 30px;
    color: #fff;
  }
</style>
