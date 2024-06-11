<template>
    <el-card>
        <el-form :inline="true">

            <el-form-item label="一级分类" style="width: 240px;">
                <el-select v-model="categoryStore.c1Id" placeholder="请选择" @change="getC2" :disabled="scene==1">
                    <el-option v-for="(item, index) in categoryStore.c1Arr" :key="item.id" :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类" style="width: 240px;">
                <el-select v-model="categoryStore.c2Id" placeholder="请选择" @change="getC3" :disabled="scene==1">
                    <el-option v-for="(item, index) in categoryStore.c2Arr" :key="item.id" :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类" style="width: 240px;">
                <el-select v-model="categoryStore.c3Id" :disabled="scene==1">
                    <el-option v-for="(item, index) in categoryStore.c3Arr" :key="item.id" :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>
    </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
//引入分类仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore();


//挂载完毕
onMounted(() => {
    //获取一级分类
    getC1();
})

//获取一级分类数据
const getC1 = () => {
    categoryStore.getC1();

}
//获取二级分类数据
const getC2 = () => {
    //一级变化，清空二级三级数据
    categoryStore.clearC2();
    //获取二级数据
    categoryStore.getC2();

}

//获取三级分类数据
const getC3 = () => {
    //二级变化，清空三级数据
    categoryStore.clearC3();
    //获取三级数据
    categoryStore.getC3();

}

//接受父组件传递的场景scene
defineProps(['scene']);
// let scene=defineProps(['scene']);
// console.log(scene);



</script>

<style lang="" scoped>

</style>