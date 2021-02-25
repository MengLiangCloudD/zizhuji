<template>
  <div>
    <Header :title="title" :goback="goback" @getback="getback"></Header>
    <Getback></Getback>
    <div class="zhezhao" v-if="model">
      <div class="model">
        <div class="model_top">每个单据可打印1次</div>
        <div class="model_center">当前单据剩余打印次数为：{{count}}次</div>
        <div class="model_bottom">
          <div class="model_button" @click="clickClose()">关闭</div>
          <div v-if="count>0" class="model_button" @click="clickOk()">打印</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="title_top">
          当前查询的是<span>{{year}}年</span><span>{{month}}</span>的清单信息
        </div>
        <div class="title_bottom">
          <div class="info_item1">
            <span>卡类型：</span>
            <span>{{cardType}}</span>
          </div>
          <div class="info_item2">
            <span>姓名：</span>
            <span>{{name}}</span>
          </div>
          <div class="info_item">
            <span>性别：</span>
            <span>{{sexStr}}</span>
          </div>
        </div>
      </div>
      <div class="info_content">
        <div class="content_title">
          <div class="shade"></div>
        </div>
        <div class="info_List" v-if="printFeeList.length>0">
          <div class="item" v-for="(item,index) in printFeeList" :key="index">
            <div class="item_txt">{{item.revdate}}</div>
            <div class="item_txt1">门诊</div>
            <div class="item_txt2">¥{{item.fee}}</div>
            <div class="item_button" @click="selectItem(index)">
                <img src="./../../commen/imager/noXuan.png" v-if="item.start==false" alt="">
                <img src="./../../commen/imager/yesXuan.png" v-if="item.start==true" alt="">
            </div>
            <!-- <div class="item_button" @click="clickPrint(item)">打印</div> -->
          </div>
        </div>
        <div class="info_List" v-else>
          <p>当月暂无打印数据</p> 
        </div>
      </div>
    </div>
    <div class="bottom">
        <div class="btn" @click="goHome()">返回首页</div>
        <div class="btn" @click="clickPrint()">打印</div>
      </div>
  </div>
</template>

<script>
  import Header from './../../commen/header';
  import http from './../../utils/http';
  import Getback from './../../commen/getback';
  export default {
    components: {
      Header,
      Getback
    },
    data() {
      return {
        title: '收费清单打印',
        goback: true,
        printFeeList: [],
        month: '',
        year: '',
        model: false,
        cardType: '',
        name: '',
        sexStr: '',
        count: 0,
        revSerial: '',
        revdate: '',
        idCardNo: '',
        icCardNo: '',
        fee: '',
        feeYb: '',
        feeZf: '',
        depName: '',
        selectList:[],
        code:0
      }
    },
    created() {
      this.month = this.$route.query.month;
      this.year = this.$route.query.year;

      var type = this.$store.state.type;
      if (type == 1) {
        this.cardType = '医保卡';
      } else if (type == 2) {
        this.cardType = '身份证';
      }
      this.name = this.$store.state.name;
      var sex = this.$store.state.sex + "";
      if (sex == "0") {
        this.sexStr = '男';
      } else if (sex == "1") {
        this.sexStr = '女';
      }

      this.idCardNo = this.$store.state.idCardNo;
      this.icCardNo = this.$store.state.icCardNo;
    },
    mounted() {
      this.getPaidFeeMain();
    },
    methods: {
      //选择
      selectItem(index){
        // var list = this.printFeeList;
        // for(var i = 0;i<list.length;i++){
        //   if(list[i].start==true){
        //     this.code+=1
        //   }
        // }
        if(this.code<5){
          if(this.printFeeList[index].start){
            this.printFeeList[index].start = false;
            this.code-=1;
          }else{
            this.printFeeList[index].start = true;
            this.code+=1;
          }
        }else{
           this.$Message.warning('一次最多选择五个');
        }
        
      },
      getback() {
        this.$router.push(`/inventoryFee`);
      },
      //点击外层打印
      clickPrint() {
        // this.depName = item.depName;
        // this.revSerial = item.revSerial;
        // this.revdate = item.revdate;
        // this.fee = item.fee;
        // this.feeYb = item.feeYb;
        // this.feeZf = item.feeZf;
        var list = this.printFeeList;
        for(var i = 0;i<list.length;i++){
          if(list[i].start==true){
            this.selectList.push(list[i])
          }
        }
        if(this.selectList.length>0){
          this.getPrintCount();
        }
        
      },
      //点击关闭
      clickClose() {
        this.model = false;
      },
      //点击内层打印
      clickOk() {
        this.model = false;
        this.printMent();
      },
      //返回首页
      goHome() {
        this.$router.push(`/`);
      },

      //查询汇总单列表
      async getPaidFeeMain() {
        var m = this.month;
        m = m.substring(0, m.length - 1);

        var url = "register/getPaidFeeMain";
        var data = {
          patientId: this.$store.state.patientId,
          //patientId: '106977996',
          startTime: this.year + "-" + m + "-01"
        };
        var res = await http.post(this, url, data);
        if (res.body.code === '0') {
          var list = res.body.data;
          for(var i = 0;i<list.length;i++){
            list[i].start = false
          }
          this.printFeeList = list;
        } else if (res.body.code === '1') {
          this.printFeeList = [];
           this.$Message.warning(res.body.msg);
        }else{
           this.$Message.warning(res.body.msg);
        }
      },

      //查询剩余打印次数
      async getPrintCount() {
        var url = "print/count";
        var data = {
          ticketNum: this.idCardNo,
        };
        var res = await http.post(this, url, data);
        if (res.code === '0') {
          this.count = 1;
        } else {
          this.count = 0;
          this.$Message.warning(res.msg);
        }
        this.model = true;
      },

      //打印汇总单
      async printMent() {
        var url = "print/printMent";
        var data = {
          name: this.$store.state.name,//姓名
          age: this.$store.state.birthDate,//年龄
          sex: this.sexStr,//性别Str
          // deptName: this.depName,//科室名称?
          // regDate: this.revdate,//日期
          icCardNo: this.icCardNo,//医保卡卡号
          idCardNo: this.idCardNo,//身份证号码
          // feeAll: this.fee,//费用总额
          // feeFund: this.feeYb,//报销部分
          // feeSelf: this.feeZf,//自费部分
          // revSerial: this.revSerial,//流水号
          selectList:JSON.stringify(this.selectList)
        };
        var res = await http.post(this, url, data);
        this.$router.push(`/printOver`);
      },

    },

  }
</script>

<style scoped>
  .content {
    text-align: center;
  }

  .title {
    padding-top: 51px;
    margin: 0px 0 41px 0;
  }

  .title_top {
    margin-bottom: 39px;
    font-size: 30px;
    color: #222;
  }

  .title_top span {
    color: #3aaa6e;
  }

  .title_bottom {
    font-size: 24px;
    color: #222;
  }

  .info_item, .info_item1, .info_item2 {
    display: inline-block;
    vertical-align: middle;
  }

  .info_item1 {
    margin-right: 188px;
  }

  .info_item2 {
    margin-right: 176px;
  }

  .content_title {
    width: 1140px;
    height: 44px;
    background: #3aaa6e;
    border-radius: 22px;
    display: inline-block;
    position: relative;
  }

  .shade {
    width: 1002px;
    height: 22px;
    background-image: linear-gradient(rgb(24, 75, 47), rgb(255, 255, 255));
    position: absolute;
    bottom: 0;
    left: 69px;
  }

  .info_List {
    width: 1002px;
    display: inline-block;
    background: #fff;
    box-shadow: 6px 3px 6px 3px rgb(238, 237, 237), -6px 3px 6px 3px rgb(238, 237, 237);
    max-height: 400px;
    overflow: auto;
    min-height: 400px;
  }
.info_List p{
  font-size: 36px;
  margin-top: 100px;
}
  .item {
    padding: 10px 39px 10px 54px;
    border-bottom: 1px solid rgb(238, 238, 238);
    color: #222;
    font-size: 20px;
    text-align: left;

  }

  .item_txt, .item_txt1, .item_txt2, .item_button {
    display: inline-block;
    vertical-align: middle;
  }

  .item_txt1 {
    margin-left: 178px;
  }

  .item_txt2 {
    /* margin-left: 138px; */
    width: 228px;
    text-align: right;
  }

  .item_button {
    margin-left: 177px;
    /* text-align: center;
    border-radius: 20px;
    background: #3aaa6e;
    color: #fff;
    font-size: 24px;
    width: 192px;
    height: 72px;
    line-height: 72px; */
  }
.item_button img{
  width: 30px;
  height: 30px;
}
  .zhezhao {
    position: absolute;
    width: 100%;
    height: calc(100% - 140px);
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
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
  
  .bottom {
    margin-top: 70px;
    text-align: center;
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
