<template>
    <div class="tabbar">
        <div class="tabarr_left">
            <!-- 左边 -->
            <el-icon class="icon" @click="" style="margin-right: 10px;">
                <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
            </el-icon>
            <!-- 面包屑 -->
            <el-breadcrumb :separator-icon=ArrowRight>
                <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" :to="{ path: item.path }">
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabarr_right">
            <!-- 右边 -->
            <el-button size="large" circle @click="" icon="Refresh"></el-button>
            <el-button size="large" circle @click="fullScreen" icon="FullScreen"></el-button>
            <el-button size="large" circle @click="" icon="Setting"></el-button>
            <div class="hicon">
                <img :src=userStore.avatar alt="" style="width: 36px;height: 36px; border-radius: 50%;">
                <el-dropdown class="dropdownBox">
                    <span>
                        {{ userStore.username ? userStore.username : "未知用户" }}
                        <el-icon>
                            <arrow-down></arrow-down>
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="back">退出登录</el-dropdown-item>

                        </el-dropdown-menu>

                    </template>
                </el-dropdown>

            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { ArrowRight } from '@element-plus/icons-vue'
import useLayOutSettingStore from '@/store/modules/setting.js'
//路由
import { useRoute, useRouter, } from 'vue-router'
//用户仓库
import useUserStore from '@/store/modules/user'



let LayOutSettingStore = useLayOutSettingStore();
let $route = useRoute();
let $router = useRouter();

let userStore = useUserStore();

//折叠
function change() {
    LayOutSettingStore.fold = !LayOutSettingStore.fold;
}

// 全屏
const fullScreen = () => {
    let full = document.fullscreenElement;
    if (!full) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

//退出
const back = async () => {
    await userStore.userLogout()
    $router.push({ path: '/login', query: { redirect: $route.path } });
}

</script>

<script>
export default {
    name: 'tabbar'
}
</script>

<style lang="scss" scoped>
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .icon {
        margin: 10px;
    }

    .tabarr_left {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .tabarr_right {
        display: flex;
        align-items: center;
        margin-right: 16px;
    }

    .hicon {
        margin-left: 12px;
        margin-top: 4px;
        padding: 0px;

        .dropdownBox {
            margin-top: 7px;

        }

        img {
            margin-right: 5px;
            position: relative;
            top: -1px;
        }
    }

}
</style>