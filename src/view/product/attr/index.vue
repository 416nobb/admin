<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>

    <!-- 属性 -->
    <el-card style=" margin: 20px 0px; ">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" @click="addAttr"
          :disabled="!categoryStore.c3Id">添加平台属性</el-button>
        <el-table border style="margin:10px 0px;" :data="attrArr">
          <el-table-column label="序号" type="index" width="80px">
          </el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag v-for="(item, index) in row.attrValueList" :key="item.id" style="margin:3px;">{{
                item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作名称" width="120px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" @click="updateAttr(row)" icon="Edit" color="orange"></el-button>
              
              <el-popconfirm :title="`是否确认删除${row.attrName}`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" @click="" icon="Delete"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>


        </el-table>
      </div>
      <!-- 编辑 -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName" @change="" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" @click="addAttrValue" icon="Plus"
          :disabled="!attrParams.attrName">添加属性值</el-button>
        <el-button type="primary" size="default" @click="attrParams.attrValueList = []">清空</el-button>

        <el-table :data="attrParams.attrValueList" border style="margin:10px 0px">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc) => inputArr[$index] = vc" v-if="row.flag" @blur="$event => toLook(row, $index)"
                placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="$event => toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" @click="$event => attrParams.attrValueList.splice($index, 1)"
                icon="Delete"></el-button>

            </template>
          </el-table-column>

        </el-table>
        <el-button type="primary" size="default" @click="saveAttr"
          :disabled="attrParams.attrValueList.length <= 0">保存</el-button>
        <el-button type="primary" size="default" @click="scene = 0">取消</el-button>
      </div>

    </el-card>


  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onBeforeUnmount } from "vue"
//引入属性api
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
//引入分类仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from "element-plus";
let categoryStore = useCategoryStore();

//存储已有属性
let attrArr = ref([]);

/**展示属性*/
//监听三级分类
watch(() => categoryStore.c3Id, () => {
  //清空上一个属性
  attrArr.value = [];
  //获取新属性
  if (categoryStore.c3Id) getAttr();
})

//获取属性
const getAttr = async () => {
  //获取3个id
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result = await reqAttr(c1Id, c2Id, c3Id);

  if (result.code == 200) {
    attrArr.value = result.data;
  }
}

/***
 * 场景：增改
 * */
let scene = ref(0); //默认0,查看,1增改
//保存数据
let attrParams = reactive({
  attrName: "", //新增属性名字
  attrValueList: [

  ],//新增属性数组
  categoryId: "",//三级分类id
  categoryLevel: 3,//三级分类
})
//修改数据
let flag = ref(true);  //控制属性编辑与查看模式
let inputArr = ref([]);  //存储input实例

//添加
const addAttr = () => {
  //清空增改面板,仍是响应式
  Object.assign(attrParams, {
    attrName: "", //新增属性名字
    attrValueList: [

    ],//新增属性数组
    categoryId: "",//三级分类id
    categoryLevel: 3,//三级分类
  });

  //切换场景
  scene.value = 1;
  //收集C3Id
  attrParams.categoryId = categoryStore.c3Id;

}
//修改
const updateAttr = (row) => {
  scene.value = 1;
  //已有数据覆盖
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}
//删除
const deleteAttr = async (attrId) => {
  //删除请求
  let result = await reqRemoveAttr(attrId);
  if (result.code == 200) {
    ElMessage.success("删除成功");
    getAttr();
  } else {
    ElMessage.error("删除失败");
  }
}

//方法--新增属性值
const addAttrValue = () => {

  //添加一条属性
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制编辑与查看
  })
  //获取焦点
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  })
}

//方法--保存属性
const saveAttr = async () => {
  //发送请求
  let result = await reqAddOrUpdateAttr(attrParams);
  if (result.code == 200) {
    //切换场景
    scene.value = 0;
    //提示成功
    ElMessage.success("保存成功")
    //更新数据
    getAttr();
  } else {
    ElMessage.error("保存失败")
  }
}

//编辑查看切换
const toLook = (row, $index) => {

  //非法1：空白属性
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1);
    ElMessage.error("属性不能为空");
    return;
  }
  //非法2：重复属性
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    ElMessage.error("属性重复");
    return;
  }
  //展示div
  row.flag = false;
}

const toEdit = (row, $index) => {
  //展示div
  row.flag = true;
  nextTick(() => {
    inputArr.value[$index].focus();
  })
}
 

//销毁时，清空仓库相关数据
onBeforeUnmount(() => {
  categoryStore.$reset();
  // console.log(categoryStore.$reset);
  
})
</script>

<style lang="" scoped>

</style>