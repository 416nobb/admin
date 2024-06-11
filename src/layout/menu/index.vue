<template>
    <div>
        <template v-for="(item) in menuListNonReactive" :key="item.path">
            <!-- 没子路由 -->
            <el-menu-item v-if="!item.children" :index="item.path" @click="goRoute">
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
            <!-- 仅一个子路由 -->
            <el-menu-item v-if="item.children && item.children.length == 1" :index="item.path" @click="goRoute">
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
            <!-- 多个子路由 -->
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length >= 2" >
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>

    </div>
</template>

<script setup>
import { ref, reactive, toRaw } from "vue"
import {useRouter} from 'vue-router'
let $router = useRouter();

//接受路由数组
let a = ref('');
const props = defineProps(['menuList'])
const menuListReactive = reactive(props.menuList)
const menuListNonReactive = toRaw(menuListReactive)
//过滤数组
// console.log(menuListNonReactive);
hiddenArr(menuListNonReactive);
function hiddenArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i].name);
        if (arr[i].meta.hidden) {
            arr.splice(i, 1);
            i--; // 修正索引
        }
        if(arr.children){
            hiddenArr(arr.children)
        }
    }
}
//点击跳转
const goRoute =  (vc)=>{
    // console.log(vc.index);
    $router.push(vc.index)
    
}


//检查
// console.log('hidden'+hiddenArr(menuListNonReactive));

</script>
<script>
export default {
    name: 'Menu'
}
</script>

<style lang="" scoped>

</style>