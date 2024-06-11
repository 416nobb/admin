<template>
    <div class="name">
        <div class="layout_container">
            <!-- 左侧菜单 -->
            <div class="layout_slider" id="left" :class="{ fold: LayOutSettingStore.fold }" ref="left_menu">
                <Logo></Logo>
                <el-scrollbar class="scrollbar">
                    <el-menu text-color="#3E3F4C" background-color="#BE98AA" active-text-color="#ffffff"
                        :default-active="$route.path" :collapse="LayOutSettingStore.fold">
                        <!-- 动态生成菜单 -->
                        <Menu :menuList=userStore.menuRoutes></Menu>
                    </el-menu>
                </el-scrollbar>
                <div id="moveBar" @mousedown="startResize"></div>

            </div>

            <!-- 拖动 -->

            <!-- 顶部导航 -->
            <div class="layout_tabbar" id="tab">
                <Tabbar></Tabbar>
            </div>
            <!-- 内容展示区域 -->
            <div class="layout_main" id="bmain">
                <Main></Main>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue';
import Menu from './menu/index.vue';
import Tabbar from './tabbar/index.vue';
//引入主展示区域
import Main from './main/index.vue';
//获取用户仓库
import useUserStore from '@/store/modules/user';
//获取Layout （折叠）
import useLayOutSettingStore from '@/store/modules/setting.js'

let userStore = useUserStore();
let LayOutSettingStore = useLayOutSettingStore();


//引入路由，解决路径正确，激活不正确问题
let $route = useRoute();
// console.log($route.path);

let isResizing = ref(false);

let left_menu = ref();


const method = (e) => {
    if (isResizing.value) {
        // 获取鼠标拖动的距离
        // var x = e.offsetX
        var cx = e.clientX
        if(cx>208 && cx<258){
            userStore.width=cx;
            // console.log(userStore.width);
        }

        if (cx > 100) {
            left.style.width = (cx + 3) + "px";
            tab.style.left = (cx + 3) + "px";
            tab.style.width = `calc(100% - ${cx}px)`
            bmain.style.left = (cx + 3) + "px";
            bmain.style.width = `calc(100% - ${cx}px)`
        }
    }
}


function startResize(e) {
    isResizing.value = true;
    console.log("开始拖动");
    //获取初始鼠标位置
    var point = e.clientX
    document.addEventListener('mousemove', method)
}

document.addEventListener('mouseup', (e) => {
    if (isResizing.value) {
        isResizing.value = false;
        console.log("结束拖动");
    }
})



onUnmounted(() => {
    document.removeEventListener('mousemove', method)
    console.log("remove listener");

})





</script>

<script>
export default {
    name: 'tabbar'
}
</script>

<style lang="scss" scoped>
* {
    font-weight: 900;
}

.layout_container {
    display: flex;
    width: 100%;
    height: 100vh;

    .layout_slider {
        display: flex;
        flex-wrap: wrap;
        width: calc($base-menu-width - 3px);
        height: 100vh;
        background-color: $base-menu-color;
        min-width: 100px;

        .scrollbar {
            // display: flex;
            width: calc(100% - 3px);
            height: calc(100vh - $menu-logo-height);
        }

        #moveBar {

            width: 3px;
            height: calc(100vh - $menu-logo-height);
            background-color: $base-menu-color;
            cursor: col-resize;
        }

    }



    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width );
        height: $base-tabbar-height;
        top: 0;
        left: $base-menu-width - 3px;
        border-bottom: 1px solid;
        background-color: $synoa_color5;

    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        background-color: $synoa_color5;
        left: $base-menu-width - 3px;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
    }
}
</style>