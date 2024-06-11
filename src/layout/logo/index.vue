<template>
    <div class="logo">
        <!-- <SvgIcon ></SvgIcon> -->
        <img src="@/assets/logo.svg" alt="">
        <p v-show="tag" >琉璃神社</p>
    </div>
</template>

<script setup>



import { ref, reactive ,watch } from "vue"
//获取用户仓库
import useUserStore from '@/store/modules/user';
let userStore = useUserStore();


let tag = ref(true);
// let width = ref(userStore.width.value);


watch(() => userStore.width, (newValue, oldValue) => {
    console.log(newValue);

    if (newValue < 233) {
        tag.value = false;
    }
    if (newValue > 233) {
        tag.value = true;
    }
});

</script>

<script>
export default {
    name: 'logo'
}
</script>



<style lang="scss" scoped>
.logo {
    width: 100%;
    height: $menu-logo-height;
    color: $base-menu-logofont-color;

    display: flex;
    align-items: center;
    padding: 20px;

    img {
        width: 48px;
        height: 48px;
    }

    p {
        font-size: 32px;
        font-weight: bold;
        margin: 10px;
    }
}
</style>