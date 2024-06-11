<template>
  <div>
    <el-card>
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
      <!--表格 -->
      <el-table :data="trademarKarr" style="margin: 10px 0px" border>
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <div>
              {{ row.tmName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" alt="" style="width: 100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="updateTrademark(row)" icon="Edit"></el-button>

            <el-popconfirm :title="`确定删除品牌${row.tmName}吗?`"  width="250px" icon="Delete" @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" @click="" icon="Delete"></el-button>
              </template>
            </el-popconfirm>



          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination :pager-count="9" @size-change="sizeChange" @current-change="getHasTrademark"
        v-model:currentPage="currentPage" :page-sizes="[3, 5, 7, 9]" v-model:page-size="limit"
        layout=" prev, pager, next, jumper,->,total, sizes" :total="totalNum" background>
      </el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog :title="trademarkParams.id ? '修改品牌' : '添加品牌'" v-model="dialogFormVisible">
      <el-form style="width:80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input placeholder="请输入品牌名" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="80px" prop="logoUrl">
          <!-- action:图片上传路径 -->
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue"
//引入API
import { reqHasTrademark, reqAddOrUpdateTrademark,reqDeleteTrademark } from "@/api/product/trademark";
import { ElMessage } from "element-plus";

// 分页器当前页
let currentPage = ref(1)
//一页多少条数据
let limit = ref(3)
//品牌总数
let totalNum = ref(0)
//存储已有品牌数据
let trademarKarr = ref([]);
//控制对话框
let dialogFormVisible = ref(false)
//收集品牌数据
let trademarkParams = reactive({
  tmName: '',
  logoUrl: '',
})
//获取表单form
let formRef = ref();





//获取已有品牌接口封装为函数
const getHasTrademark = async (pager = 1) => {
  currentPage.value = pager;
  let result = await reqHasTrademark(currentPage.value, limit.value);
  if (result.code == 200) {

    totalNum.value = result.data.total;
    trademarKarr.value = result.data.records;
  }
  // await reqHasTrademark(1,3);
}
//挂载完毕，加载资源
onMounted(() => {
  getHasTrademark();
})
//分页器换页
// const currentChange = (page) => {
//   console.log(page);
//   getHasTrademark();

// }
const sizeChange = (pageSize) => {
  // currentPage.value=1;
  getHasTrademark();

}
//添加品牌回调
const addTrademark = () => {
  //清空数据
  trademarkParams.logoUrl = '';
  trademarkParams.tmName = '';
  trademarkParams.id = undefined;

  //如果存在表单校验，清空表单校验
  //方法1 :判断存在
  // formRef.value?.clearValidate();
  //方法2 ：获取更新后dom
  nextTick(() => {
    formRef.value.clearValidate();
  })

  //现实对话框
  dialogFormVisible.value = true;
}
//修改品牌回调
const updateTrademark = (row) => {
  //加载数据
  // console.log(row);


  //es6语法替换
  Object.assign(trademarkParams, row);

  //呈现对话框
  dialogFormVisible.value = true;

  nextTick(() => {
    formRef.value.clearValidate();
  })
}
//---对话框按钮
//取消
const cancel = () => {
  dialogFormVisible.value = false;
}


//确认
const confirm = async () => {
  //校验，通过则继续，await 返回false，后续不执行

  await formRef.value.validate();
  //请求
  let result = await reqAddOrUpdateTrademark(trademarkParams);
  //判断添加还是修改
  let med = trademarkParams.id ? "修改" : "添加";

  if (result.code == 200) {
    dialogFormVisible.value = false;
    ElMessage.success(med + "成功");
    getHasTrademark(trademarkParams.id ? currentPage.value : 1);
  } else {
    ElMessage.error(med + "失败");
  }


}

//上传图片限制钩子
const beforeAvatarUpload = (rawFile) => {

  if (rawFile.type !== 'image/png' && rawFile.type !== 'image/jpeg') {
    console.log(rawFile.type);
    ElMessage({
      type: 'error',
      message: '格式错误,支持png,jpg',
    })
    return false;
  } else if (rawFile.size / 1024 / 1024 > 1) {
    //size 单位b
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
//上传成功钩子
const handleAvatarSuccess = (response, uploadFile) => {
  //收集图片地址
  trademarkParams.logoUrl = response.data;
  //图片上传成功，清除校验错误
  formRef.value.clearValidate('logoUrl');
}

//检验方法
/**品牌名校验 */
const validatorTmName = (rule, value, callBack) => {
  if (value.trim().length >= 2) {
    callBack();

  } else {
    callBack(new Error('品牌名称大于两位'))

  }
}
/**品牌logo校验 */
const validatorLogoUrl = (rule, value, callBack) => {
  if (value) {
    callBack();
  } else {
    callBack(new Error('Logo图片必须上传'));
  }
}

//表单校验
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }

  ]
}


//删除确定的回调
const removeTradeMark = async (id)=>{
  
  let result = await reqDeleteTrademark(id);
  
  if(result.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
      //获取刷新信息
    });
    getHasTrademark(currentPage.value);
  }else{
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>