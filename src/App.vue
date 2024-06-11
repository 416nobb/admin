<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { reqLogin,reqUserInfo } from './api/user';
import { onMounted } from 'vue';
// import  axios  from "axios";


onMounted(() => {
  // reqLogin({username:'admin',password:'111111'})
  // let result= reqUserInfo({token:'AdminToken'});
  
  // console.log(result);
})

</script>

<style lang="" scoped>

</style>