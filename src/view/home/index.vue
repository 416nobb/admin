<template>
  <div >
    <!-- 选择角色 下拉菜单- -->
  <el-select v-model="name"  value-key="value" placeholder="请选择" clearable filterable @change=""
    style="width: 280px;" >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
    <el-button type="primary" style="z-index: 1;" @click="showLive2d()" >显示/隐藏live2d</el-button>
  </div>
  <div class="none">
    <!-- <live2d v-if='ShowTag' :name="name" :key="componentKey"></live2d> -->
    <AsyncHello class="live2d" v-if='ShowTag' :name="name" :key="componentKey" />
  </div>

  <div class="title">
    <h1>首页</h1>
    <br>
    <span class="sp">欢迎回来</span>
  </div>


</template>

<script setup>
import { ref, reactive, onMounted, watch ,defineAsyncComponent  } from "vue";
import useUserStore from '@/store/modules/user';
// import live2d from '../../components/live2d.vue';

const AsyncHello = defineAsyncComponent({
  loader: () => import('../../components/live2d.vue'),
  delay: 200,
  timeout: 3000
});



let name = ref('nengdai_2');
//刷新key
const componentKey = ref(0);


let userStore = useUserStore();
let ShowTag = ref(true);

//获取名字
const all_name = [
   'nengdai_2', 'hk416'
];
//更改名字格式-下拉菜单需要
const options = all_name.map((item) => {
  return {
    value: item,
    label: item,
  }
})
//挂载完毕，获取用户信息。(转移到路由守卫中统一发送)
//  onMounted(() => {
//   userStore.useInfo();
//  })


const showLive2d = () => {
  ShowTag.value = !ShowTag.value;
}

//监听名字变化
watch(name, (newValue) => {
  // 当name发生变化时，重新加载子组件
  if (ShowTag.value) {
    ShowTag.value = false;
    setTimeout(() => {
      ShowTag.value = true;
      componentKey.value++; // 更新key值，强制更新子组件
    }, 0);
  }

});
</script>

<style lang="scss" scoped>
* {
  overflow: auto;
}

.none {
  position: absolute;
  top: 50px;
}
.title{
  position: relative;
  overflow: hidden;
  left: 650px;
  .sp{
    position: relative;
    font-size: 20px;
    left: 20px;
  }
}
h1 {
  font-size: 36px;
  font-weight: bold;
  color: #333;

}

</style>