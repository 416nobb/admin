<!-- 
  使用方法  
***

<SvgIcon name="1"></SvgIcon>


***
参数 name：将存放于src/assets/  中的svg图片传名字入
 -->
<template>
  <img :src="tname" />
</template>

<script setup>
//
let name = defineProps(["name"])

let tname= "./src/assets/" + name.name + ".svg"

if (name.name!='' && name.name!=undefined) {
   tname = "./src/assets/" + name.name + ".svg"
  console.log('传入图片名-'+name.name);
  
}else{
  tname = "./src/assets/1.svg"
  console.log('未传入图片名，默认传入"1"');
}



</script>

<style lang="" scoped>

</style>