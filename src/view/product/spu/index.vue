<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene></Category>

    <el-card style="margin:10px 0px">
      <!-- 主页面 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu">添加SPU</el-button>
        <!-- 表单 -->
        <el-table :data="records" border stripe>
          <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description">
            <!-- show-overflow-tooltip -->
          </el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" @click="addSku(row)" title="添加SKU"></el-button>
              <el-button type="primary" size="small" icon="Edit" @click="updateSpu(row)" title="修改SPU"></el-button>
              <el-button type="primary" size="small" icon="View" @click="findSku(row)" title="查看SKU列表"></el-button>

              <el-popconfirm :title="`是否确定删除${row.spuName}?`" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"
                    title="删除SPU"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:currentPage="currentPage" :page-sizes="[3, 5, 7, 9]" v-model:page-size="pageSize"
          layout=" prev, pager, next, jumper,->,total, sizes" :total="total" :background="true"
          @current-change="getHasSpu" @size-change="changeSize">
        </el-pagination>
      </div>
      <!-- spu -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <!-- sku -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <!-- 弹窗-展示sku -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table :data="skuArr" border>
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>

    </el-card>

  </div>
</template>

<script setup>
import { ref, reactive, watch ,onBeforeUnmount} from "vue"
import { reqHasSpu, reqSkuList } from "@/api/product/spu";
//引入分类仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore();
//引入子组件
import SpuForm from "./spuForm.vue"
import SkuForm from "./skuForm.vue"
import { reqRemoveSpu } from "../../../api/product/spu";
import { ElMessage } from "element-plus";

/**
 * 数据
 */
//三级分类场景值，防止禁用
let scene = ref(0);   //场景0，已有SPU;  1:+SPU   2:+SKU
//分页器
let currentPage = ref(1);  //当前页
let pageSize = ref(3);   //一页大小
let total = ref(0);
//SPU
let records = ref([]) //spu数据
//子组件spuForm
let spu = ref();
//子组件sku
let sku = ref();



//监听c3Id
watch(() => categoryStore.c3Id, () => {
  //保证有c3Id
  if (!categoryStore.c3Id) return;
  getHasSpu();
})
//获取SPU
const getHasSpu = async (pager = 1) => {
  currentPage.value = pager;
  let result = await reqHasSpu(currentPage.value, pageSize.value, categoryStore.c3Id);
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
}
//分页器size变化
const changeSize = () => {
  getHasSpu();
}
//添加/修改spu
const addSpu = () => {
  scene.value = 1;
  spu.value.initAddSpu(categoryStore.c3Id);
}
const updateSpu = (row) => {
  scene.value = 1;
  spu.value.initHasSpuData(row);

}


//自定义事件：子组件 切换场景事件回调
const changeScene = (obj) => {
  scene.value = obj.flag;
  if (obj.params == 'update') {
    //更新，留在当前页
    getHasSpu(currentPage.value);
  } else if (obj.params == 'add') {
    //添加，留在第一页
    getHasSpu();
  } else {

  }
}

//添加sku
const addSku = (row) => {
  scene.value = 2;
  //调用子组件方法初始化SKU数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, categoryStore.c3Id, row);
}

/**查看sku列表*/
//存储sku数据
let skuArr = ref([]);
let show = ref(false);
//显示sku按钮回调
const findSku = async (row) => {
  let result = await reqSkuList(row.id);
  if (result.code == 200) {
    //存储数据
    skuArr.value = result.data;
    //显示对话框
    show.value = true;
  }

}

/**
 * 删除spu
 */
const deleteSpu = async (row)=>{
  let result = await reqRemoveSpu(row.id);
  if(result.code==200){
    ElMessage.success("删除成功");
    //获取剩余spu数据
    getHasSpu(currentPage.value);
  }else{
    ElMessage.error("删除失败");
  }
}

//销毁前
onBeforeUnmount(() => {
  categoryStore.$reset();
})
</script>

<style lang="" scoped>

</style>