<template>
    <div>
        <div class="getback" @click="getback">
           <img src="./imager/get.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        methods:{
            getback(){
                history.go(-1);
            }
        }
    }
</script>

<style scoped>
.getback{
    position: absolute;
    top: 158px;
    left:0px;
    font-size: 26px;
    width: 200px;
    height: 100px;

}
.getback img{
    width: 127px;
    margin-top: 20px;
    margin-left: 42px;
}
</style>