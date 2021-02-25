<template>
    <div>
        <Header :title="title" :goback="goback"></Header>
        <div class="content">
            <div class="passwordCode">
                <div class="passTitle">
                    请输入自助码
                </div>
                <div class="passContent">
                    <div class="contentItem">
                        {{num1}}
                    </div>
                    <div class="contentItem">
                        {{num2}}
                    </div>
                    <div class="contentItem">
                        {{num3}}
                    </div>
                    <div class="contentItem">
                        {{num4}}
                    </div>
                    <div class="contentItem">
                       {{num5}}
                    </div>
                    <div class="contentItem">
                        {{num6}}
                    </div>
                </div>
                <div class="keyboard_key">
                    <div class="key_id" v-for="(item,index) in keyboard" :key="index" @click="keyClick(item.value)">
                        <span v-if="item.key==10"></span>
                        <span v-else-if="item.key==11">
                            <img src="./../../commen/imager/qingchu.png" class="qingchu" alt="">
                        </span>
                        <span v-else>{{item.value}}</span>
                        
                    </div>
                </div>
                <div class="bottom">
                    <div class="button" @click="okClick()">确认</div>
                </div>
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
                title: '',
                goback: false,
                 //键盘数据
                keyboard:[{
                    key:1,
                    value:'1'
                },{
                    key:2,
                    value:'2'
                },{
                    key:3,
                    value:'3'
                },{
                    key:4,
                    value:'4'
                },{
                    key:5,
                    value:'5'
                },{
                    key:6,
                    value:'6'
                },{
                    key:7,
                    value:'7'
                },{
                    key:8,
                    value:'8'
                },{
                    key:9,
                    value:'9'
                },{
                    key:10,
                    value:'10'
                },{
                    key:0,
                    value:'0'
                },{
                    key:11,
                    value:'11'
                },],
                num1:'',
                num2:'',
                num3:'',
                num4:'',
                num5:'',
                num6:'',
                numAll:''
            }
        },
        methods:{
            keyClick(key){
                if(key==11){
                    var passworld = this.numAll;
                    if(passworld.length===1){
                        this.num1 = ''
                    }else if(passworld.length===2){
                        this.num2 = ''
                    }else if(passworld.length===3){
                        this.num3 = ''
                    }else if(passworld.length===4){
                        this.num4 = ''
                    }else if(passworld.length===5){
                        this.num5 = ''
                    }else if(passworld.length===6){
                        this.num6 = ''
                    }
                    passworld=passworld.substr(0, passworld.length - 1);
                    this.numAll = passworld;
                     console.log(this.numAll)
                }else if(key==10){

                }else{
                    var passworld = this.numAll
                    if(passworld.length<6){
                        passworld = passworld + key;
                    }
                    this.numAll = passworld;
                    console.log(this.numAll)
                    if(passworld.length===1){
                        this.num1 = key
                    }else if(passworld.length===2){
                        this.num2 = key
                    }else if(passworld.length===3){
                        this.num3 = key
                    }else if(passworld.length===4){
                        this.num4 = key
                    }else if(passworld.length===5){
                        this.num5 = key
                    }else if(passworld.length===6){
                        this.num6 = key
                    }
                }
            },
            //确认
            async okClick() {
                var url = "question/verificode";
                var data = {
                    code: this.numAll,
                };
                var res = await http.post(this, url, data);
                if(res.code==0){
                     this.$router.push('/home');
                }else{
                     this.$Message.warning(res.msg);
                }
            },
        }
    }
</script>

<style scoped>
    .content{
        position: absolute;
        margin: 26px 29px 26px 29px;
        /* margin: 26px auto; */
        width: calc(100% - 26px - 26px);
        background: #eafcf2;
        border-radius: 28px;
        padding: 61px 0 61px 0;
    }
    .passwordCode{
        width: 656px;
        height: 700px;
        border-radius: 20px;
        background: #fff;
        margin: 0 auto;
        text-align: center;
        padding-top: 61px;
    }
    .passTitle{
        margin-bottom: 60px;
        font-size: 24px;
    }
    .passContent{
        display: flex;
        flex-wrap: wrap;
        margin: 0 115px 0 99px;
        width: 100%;
    }
    .contentItem{
        width: 58px;
        height: 58px;
        line-height: 58px;
        margin-left: 16px;
        background: #eafcf2;
        font-size: 30px;
        color: #222;
        border-radius: 10px;
    }
    .keyboard_key{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        text-decoration: none;
        border-top:1px solid rgb(223,223,223);
        margin-top: 50px;
    }
    .key_id {
        width: 33%;
        height: 80px;
        border-left: 1px solid rgb(233, 233, 233);
        border-bottom: 1px solid rgb(233, 233, 233);
        line-height: 80px;
        /* padding: 28px 0; */
        font-size: 33px;
        color: rgb(154,154,154);
    }
    .keyboard_key:after{ 
        content: "";
        height: 0;
        width: 32%;
    }
    .bottom{
        width: 100%;
        margin-top: 25px;
    }
    .button{
        width: 193px;
        height: 72px;
        color: #fff;
        line-height: 72px;
        background: #3aaa6e;
        border-radius: 20px;
        font-size: 24px;
        margin: 0 auto;
    }
    .qingchu{
        width: 30px;
        height: 22px;
        margin-top: 15px;
        margin-left: 15px;
    }
</style>