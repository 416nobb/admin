<template>
  <!-- 搜索框 -->
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 展示区 -->
  <el-card style="margin: 10px 0px">
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row:已有的职位对象 -->
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
      @size-change="sizeChange" />
  </el-card>

  <!-- 添加职位与更新已有职位的结构:对话框 -->
  <el-dialog v-model="dialogVisite" title="添加职位">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialogVisite = false">
        取消
      </el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 分配权限 -->
  <el-drawer v-model="drawer" value="rlt" size="30%">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree style="max-width: 600px" :data="menuArr" show-checkbox node-key="id" default-expand-all
        :default-checked-keys=selectArr :props="defaultProps" ref="tree" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>

</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from "vue"
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from "@/api/acl/role";
import { ElMessage } from "element-plus";

//当前页码
let pageNo = ref(1)
//一页展示几条数据
let pageSize = ref(10)
//搜索结果总数
let total = ref(0);
//保存角色数据
let allRole = ref([]);
//搜索职位关键字
let keyword = ref('');
//控制增改角色弹窗
let dialogVisite = ref(false);
//新增角色数据
let RoleParams = reactive({
  roleName: '',
  id: 0,
});
//添加表单的实例
let form = ref();
/** 权限分配 */
//控制抽屉
let drawer = ref(false);
//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole();
})
//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
//换页回调
const sizeChange = () => {
  getHasRole();
}
//搜索按钮的回调
const search = () => {
  //再次发请求根据关键字
  getHasRole();
  // keyword.value = ''
}
//重置回调
const reset = () => {
  keyword.value = '';
  getHasRole();
}
//添加role
const addRole = () => {
  dialogVisite.value = true;
  //清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate()
  })
}
//修改role
const updateRole = (row) => {
  dialogVisite.value = true;
  //存储已有的职位----带有ID的
  Object.assign(RoleParams, row);
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate()
  })
}
//**表单校验 */
//自定义校验规则的回调
const validatorRoleName = (rule, value, callBack) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
//保存
//确定按钮的回调
const save = async () => {
  //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
  await form.value.validate()
  //添加职位|更新职位的请求
  let result = await reqAddOrUpdateRole(RoleParams);
  if (result.code == 200) {
    //提示文字
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    //对话框显示
    dialogVisite.value = false
    //再次获取全部的已有的职位
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}
/**分配权限 */
const defaultProps = {
  children: 'children',
  label: 'name',
}
//权限数据
let menuArr = ref([]);
//勾选权限id
let selectArr = ref([]);
//返回节点
let tree = ref();
// 分配权限按钮
const setPermission = async (row) => {
  //清空数据
  //显示抽屉
  drawer.value = true;
  //收集分配勾选权限的数据
  Object.assign(RoleParams, row);
  //请求
  let result = await reqAllMenuList(RoleParams.id);
  if (result.code == 200) {
    menuArr.value = result.data;
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
}
//获取勾选权限
const filterSelectArr = (allData, initArr) => {
  allData.forEach((item) => {
    if (item.select && item.children.length == 0) {
      initArr.push(item.id);
    } else if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  })
  return initArr;
}
//确定按钮
const handler = async () => {
  //职位的ID
  const roleId = RoleParams.id;
  //选中节点的ID
  let arr = tree.value.getCheckedKeys();
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys();
  let permissionId = arr.concat(arr1);
  //下发权限
  let result = await reqSetPermisstion(roleId, permissionId);
  console.log(result);

  if (result.code == 200) {
    //抽屉关闭
    drawer.value = false;
    //提示信息
    ElMessage({ type: 'success', message: '分配权限成功' });
    //页面刷新
    window.location.reload();
  }
}
//删除按钮回调
const removeRole = async (id) => {
  let result = await reqRemoveRole(id);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value);
  }
}
</script>

<style lang="" scoped>

</style>