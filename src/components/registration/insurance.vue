<template>
    <div>
        <Header :title="title"  :goback="goback" @getback="getback"></Header>
        <div class="content">
            <div class="content_title">
                <img src="./../../commen/imager/miaobiao.png" alt="">
                <p>医保结算中</p>
                <p>稍后会自动跳转到付费页面</p>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './../../commen/header';
    export default {
        components:{
            Header
        },
         data(){
            return{
                title:' ',
                goback:true,
                code:'',
                selectStart:1,
                type:''
            }

        },
        created(){
            var code = this.$route.query.code;
            this.code = code;
             var type = this.$route.query.type;
             this.type = type;
        },
        methods: {
            getback() {
                this.$router.push(`/registrationInfo?code=${this.code}`);
            },
        },
        mounted(){
             setTimeout(() => {
                this.$router.push(`/payOver?code=${this.code}&type=${this.type}`);
            }, 3000);
        }
    }
</script>

<style scoped>
.content{
    text-align: center;
}
.content_title{
    margin-top: 240px;
}
.content_title img{
    width:249px;
    height: 250px;
}
.content_title p:nth-of-type(1){
    margin-top: 118px;
    color: #222222;
    font-size: 42px;
    /* font-weight: 600; */
}
.content_title p:nth-of-type(2){
    margin-top: 48px;
    color: #9a9a9a;
    font-size: 42px;
    /* font-weight: 600; */
}
</style>
