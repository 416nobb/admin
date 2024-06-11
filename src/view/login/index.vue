<template>
  <div class="login_container">
    
    <el-row :gutter="30">
      <el-col :span="12" :xs="0">
        <div class="grid-content">
          <!-- juno -->
    <img src="@/live2d/juno-angle.gif" alt=""  class="Limg" v-if=false>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" >
        <!-- 登录表单 -->

        <el-form ref="loginFroms" :model="loginForm" :rules="rules" class="login_form">
          <h1>登录页面</h1>
          <h2>登录页面</h2>
          <el-form-item label="" prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input :prefixIcon="Lock" type="password" show-password v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="default" @click="login" class="login_btn">登录</el-button>

          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

  </div>
  

  <div>
    
  </div>
</template>


<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus'
import spine from '@/live2d/spine-player.js'

//引入用户仓库
import useUserStore from "@/store/modules/user"



let useStore = useUserStore();
//获取el-form
let loginFroms = ref();
//获取路由器
import { useRouter } from 'vue-router';
let $router = useRouter();


//收集表单数据
let loginForm = reactive({ username: 'admin', password: '111111' })
const rules = {
  username: [ //一个规则一个对象
    // { required: true, message: "用户名不能为空", trigger: 'change' },
    { trigger: 'change', validator: usernameValidator }
  ],
  password: [
    { min: 6, message: '密码长度应该大于6位', trigger: 'change' },
  ]
}

function usernameValidator(rules, value, callback) {
  if (/\w+/.test(value)) {
    callback();
  } else {
    callback(new Error("账号不能为空"))
  }
}

//登录
async function login() {
  //表单验证
  await loginFroms.value.validate();

  try {
    await useStore.userLogin(loginForm);
    //跳转首页
    $router.push('/');
    ElNotification({
      type: 'success',
      message: "登陆成功",
      title: 'HI,' + getTime() + '好',
      duration: 1500
    })
  } catch (error) {
    $router.push('/');
    ElNotification({
      type: 'error',
      message: error.message,
      duration: 1500

    })
  }

}

//判断时间
const getTime = () => {
  let message = '';
  //构造函数Date
  let hours = new Date().getHours();
  if (hours <= 11) {
    message = '上午'
  } else if (hours < 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message;
}

//live2d
// new spine.SpinePlayer("container", {
//   //juno-angel
//   // jsonUrl: "assets/st_juno_angel.json",
//   // atlasUrl: "assets/st_juno_angel.atlas",
//   //juno-bg
//   jsonUrl: "@/live2d/assets/mo_event27_chara_01_j.json",
//   atlasUrl: "@/live2d/assets/mo_event27_chara_01_j.atlas",
//   // animation: "run",
// })

</script>

<style lang="scss" scoped>
/* 引入CSS文件的内容 */
@import "@/live2d/css/spine-player.css";



.Limg{
  // float: left;
  position: relative;
  top:30px;
  left:80px;
  width:900px;
  height:930px;
}

.login_container {
  width: 100%;
  height: 100vh;
  // background: url('@/assets/images/login1.png') no-repeat;
  //背景juno
  background: url('@/assets/images/bg_1.png') no-repeat;
  background-size: cover;
  overflow: hidden;

  .login_form {
    position: relative;
    width: 68%;
    top: 30vh;
    // background: url('@/assets/images/login-form.png') no-repeat;
    background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
    background-size: cover;
    border-radius: 1.5%;
    box-shadow: 0 0.5rem 1rem #8793ac;
    ;



    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }

}
</style>