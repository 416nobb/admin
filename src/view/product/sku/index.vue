<template>
  <el-card>
    <el-table :data="skuArr" border style="margin:10px">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="200px" prop=skuDesc></el-table-column>
      <el-table-column label="图片" width="200px">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="100px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="100px" prop="price"></el-table-column>
      <el-table-column label="操作" fixed="right" width="245px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            :color="row.isSale == 1 ? '' : 'grey'" @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`确认删除${row.skuName}?`" @confirm="removeSku(row)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 40]" v-model:page-size="pageSize"
      layout=" prev, pager, next, jumper,->,total, sizes" :total="total" :background="true" @current-change="getHasSku"
      @size-change="handler">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer title="SKU详情" v-model="drawer" direction="ltr" size="42%">

      <el-row style="margin:10px 0px">
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row style="margin:10px 0px">
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row style="margin:10px 0px">
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row style="margin:10px 0px">
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag v-for="(item, index) in skuInfo.skuAttrValueList" :key="item.id" style="margin:5px">{{ item.attrName
            }}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin:10px 0px">
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag v-for="(item, index) in skuInfo.skuSaleAttrValueList" type="danger" :key="item.id"
            style="margin:5px">{{
              item.saleAttrValueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin:10px 0px">
        <el-col :span="6">商品图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in 5" :key="item">
              <h3 text="2xl" justify="center">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>

    </el-drawer>

  </el-card>

</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
import { ElMessage } from "element-plus";

//分页器
let currentPage = ref(1);  //当前页
let pageSize = ref(10);   //一页大小
let total = ref(0);
//分页器单页数量变化
const handler = (pageSizes) => {
  getHasSku();
}

//sku数据
let skuArr = ref([]);

onMounted(() => {
  getHasSku();
})

const getHasSku = async (pager = 1) => {
  //默认获取第一页（10个）
  currentPage.value = pager;
  let result = await reqSkuList(currentPage.value, pageSize.value);
  if (result.code == 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
  }

}



//上架下架
const updateSale = async (row) => {
  if (row.isSale == 1) {//正在上架，进行下架
    await reqCancelSale(row.id);
    ElMessage.success("下架成功");
    getHasSku(currentPage.value);
  } else {
    await reqSaleSku(row.id);
    ElMessage.success("上架成功");
    getHasSku(currentPage.value);

  }
}
//更新sku，功能重复，待定
const updateSku = () => {
  ElMessage.success("待定义功能");
}
//详情(抽屉)
let drawer = ref(false);
let skuInfo = ref({});
const findSku = async (row) => {
  //展示抽屉
  drawer.value = true;
  //发送请求
  let result = await reqSkuInfo(row.id);
  //存储
  skuInfo.value = result.data

}

//删除sku
let removeSku = async (row) => {
  let result = await reqRemoveSku(row.id);
  if (result.code == 200) {
    ElMessage.success("删除成功");
    getHasSku(skuArr.value.length > 1 ? currentPage.value : currentPage.value - 1);
  } else {
    ElMessage.error(`${result.data}`);
  }
}


</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>