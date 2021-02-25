<template>
  <div id="app">
    <Timers/>
    <router-view/>
  </div>
</template>

<script>
import Timers from './commen/timer';
    export default {
        name:'App',
        components:{
            Timers
        },
        data(){
            return{
            }
        },
        created(){
        },
        methods: {
          
        }
    }
</script>