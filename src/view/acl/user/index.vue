<template>
  <!-- 搜索框 -->
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input v-model="keyword" placeholder="请你输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 展示区 -->
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="primary" size="default" :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser">批量删除</el-button>
    <!-- table展示用户信息 -->
    <el-table :data="userArr" @selection-change="onSelectionChange" style="margin: 10px 0px" border>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" prop="id" align="center"></el-table-column>
      <el-table-column label="用户名" prop="username" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户昵称" prop="name" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" prop="roleName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" icon="user" size="small" @click="classify(row)">分类角色</el-button>
          <el-button type="primary" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`是否删除用户-${row.username}?`" @confirm="deleteUser(row.id)" width="200px">
            <template #reference>
              <el-button type="primary" icon="Delete" size="small">删除</el-button>
            </template>
          </el-popconfirm>


        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total=total @current-change="getHasUser"
      @size-change="handler_sc">
    </el-pagination>
    <!-- 抽屉1-:添加用户|更新 -->
    <el-drawer v-model="drawer">
      <!-- 头部标题:将来文字内容应该动态的 -->
      <template #header>
        <h4>{{ userParams.id ? '编辑' : '增加' }}用户</h4>
      </template>
      <!-- 身体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item v-if="userParams.id ? false : true" label="用户密码" prop="password">
            <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉2-分配角色 -->
    <el-drawer title="分配角色" v-model="role" direction="rtl" size="30%">
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <!-- 显示职位的的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedRoleChange">
            <el-checkbox v-for="(role, index) in all_roles" :key="index" :value="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="role = false">取消</el-button>
          <el-button type="primary" @click="setRole_save">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue"
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetRole, reqRemoveUser, reqRemoveSelectedUser } from "@/api/acl/user";
import { ElMessage } from "element-plus";

//获取form实例
let formRef = ref();
//存储用户信息
let userArr = ref([]);
onMounted(() => {
  getHasUser();
})
//获取用户信息
const getHasUser = async (pager = 1) => {
  //默认第一页，传参覆盖
  currentPage.value = pager;
  //发送请求
  let result = await reqUserInfo(currentPage.value, pageSize.value, keyword.value);
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
//分页器
let currentPage = ref(1);  //当前页
let pageSize = ref(7);   //一页大小
let total = ref(10);
//分页器单页数量变化
const handler_sc = (pageSizes) => {
  getHasUser();
}

/**
 * //添加用户-抽屉
 */
let drawer = ref(false);
//收集用户数据
let userParams = reactive({
  id: 0,
  name: '',
  password: '',
  username: '',
})
//添加用户
const addUser = () => {
  drawer.value = true;
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  });
  //清空表单验证
  nextTick(() => {
    formRef.value.clearValidate();
  })
}
//保存添加/更新用户
const save = async () => {
  //表单验证
  await formRef.value.validate();
  //发送请求
  let result = await reqAddOrUpdateUser(userParams);
  //必须不重名，添加必须带id等于0
  if (result.code == 200) {
    drawer.value = false;
    ElMessage({ type: 'success', message: userParams.id == 0 ? '添加成功' : '更新成功' });
    //浏览器自动刷新一次
    window.location.reload();
    //更新留在该页面的功能为了刷新（修改用户名重新登录）失效
    // getHasUser(userParams.id ? currentPage.value : 1);
  } else {
    ElMessage({ type: 'error', message: userParams.id == 0 ? '添加失败' : '更新失败' });
  }
}
//取消
const cancel = () => {
  drawer.value = false;
}

/**表单校验*/
//1、用户名长度校验
const validatorUsername = (rule, value, callBack) => {
  //规则对象，表单内容，通过回调
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户名至少5位"));
  }
}
//2、用户昵称校验
const validatorName = (rule, value, callBack) => {
  //规则对象，表单内容，通过回调
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户昵称至少5位"));
  }
}
//3、用户昵称校验
const validatorPassword = (rule, value, callBack) => {
  //规则对象，表单内容，通过回调
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error("用户密码至少6位"));
  }
}
//规则数组
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
/**更新用户信息
 * 
 */
const updateUser = (row) => {
  //抽屉显示出来
  drawer.value = true;
  //存储收集已有的账号信息
  Object.assign(userParams, row);
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username');
    formRef.value.clearValidate('name');
  })
}
/**分配角色*/
//控制抽屉
let role = ref(false);
//分配角色回调
const classify = async (row) => {
  //存储收集已有的账号信息
  Object.assign(userParams, row);
  //获得全部职位
  let result = await reqAllRole(userParams.id);
  if (result.code == 200) {
    //存储所有职位
    all_roles.value = result.data.allRolesList;
    //存储当前职位
    userRole.value = result.data.assignRoles;
    //判断全选状态（防止没有角色）
    if (userRole.value.length == 0) { isIndeterminate.value = false; }
    //显示抽屉
    role.value = true;

  }
}
//复选框
//存储所有职位
let all_roles = ref([])
let userRole = ref([]);
//是否全选
let checkAll = ref(false);
//设置不确定状态
let isIndeterminate = ref(true);
//全选更改
let handleCheckAllChange = (val) => {//是否选中全选
  userRole.value = val ? all_roles.value : [];
  isIndeterminate.value = false;
}
//检查角色选择
const handleCheckedRoleChange = (val) => {//val 选中数组
  const count = val.length;
  checkAll.value = count === all_roles.value.length;
  isIndeterminate.value = count > 0 && count < all_roles.value.length;
  console.log(isIndeterminate.value);
}
//保存
const setRole_save = async () => {
  //收集参数
  let data = {
    userId: userParams.id,
    roleIdList: userRole.value.map((item) => {
      return item.id
    }),
  }
  //分配用户的职位
  let result = await reqSetRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    role.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(currentPage.value)
  }
}


//删除单个用户
const deleteUser = async (userId) => {
  let result = await reqRemoveUser(userId);
  console.log(result);

  if (result.code == 200) {
    ElMessage.success("删除成功");
    getHasUser(userArr.value.length > 1 ? currentPage.value : currentPage.value - 1);
  } else {
    ElMessage.error("删除失败");
  }

}
//删除勾选用户
let selectIdArr = ref([]);   //批量删除用户id
const onSelectionChange = (users) => { //勾选数组
  //收集删除用户
  selectIdArr.value = users;
}
const deleteSelectUser = async () => {
  //批量删除回调
  let ids = selectIdArr.value.map(item => {
    return item.id;
  })
  //删除
  let result = await reqRemoveSelectedUser(ids);
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    role.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(currentPage.value)
  } else {
    ElMessage.error("删除失败");
  }
}

//搜索
let keyword = ref('');
const search = () => {
  getHasUser();
}
//重置
let reset = () => {
  keyword.value = '';
  getHasUser();
}

</script>

<style lang="" scoped>

</style>