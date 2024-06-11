<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuParams.price" placeholder="价格(元)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input v-model="skuParams.weight" placeholder="重量(克)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input v-model="skuParams.skuDesc" placeholder="SKU描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId" style="width:180px">
            <el-option v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id" :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId" style="width:180px">
            <el-option v-for="(saleValue, index) in item.spuSaleAttrValueList" :key="saleValue.id"
              :label="saleValue.saleAttrValueName" :value="`${item.id}:${saleValue.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" @click="handler(row)" icon="Edit">设置默认</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>

    </el-form-item>



  </el-form>

</template>

<script setup>
import { ref, reactive } from "vue";
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr ,reqAddSku } from '@/api/product/spu';
import { ElMessage } from "element-plus";

//初始化
let attrArr = ref([]);
let saleArr = ref([]);
let imgArr = ref([]);
//收集sku
let skuParams = reactive({
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述
  skuAttrValueList: [//平台属性
    {
      attrId: '',//平台属性id
      valueId: '',//属性id
    }
  ],
  skuSaleAttrValueList: [//销售属性
    {
      saleAttrId: '',//属性id
      saleAttrValueId: '',//属性值id
    }
  ],
  skuDefaultImg: ''//sku图片地址
});



//暴露-初始化请求
const initSkuData = async (c1Id, c2Id, c3Id, spu) => {
  //收集数据
  skuParams.category3Id = c3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;

  //获取平台属性
  let _attrArr = await reqAttr(c1Id, c2Id, c3Id);
  attrArr.value = _attrArr.data;
  //图片墙
  let _imgArr = await reqSpuImageList(spu.id);
  imgArr.value = _imgArr.data;
  //销售属性
  let _saleAttr = await reqSpuHasSaleAttr(spu.id);
  saleArr.value = _saleAttr.data;
}

//table实例对象
let table = ref();

//设置默认图片
const handler = (row) => {
  //清空选择
  table.value.clearSelection();
  table.value.toggleRowSelection(row, true);
  skuParams.skuDefaultImg = row.imgUrl;
}





//取消按钮——回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: "" })
}
//定义事件
let $emit = defineEmits(['changeScene']);
//暴露方法
defineExpose({
  initSkuData
});

//保存按钮
const save = async () => {
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev, next) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(":");
      prev.push({
        attrId,valueId
      });
    }
    return prev;
  }, []);
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev, next) => {
    if(next.saleIdAndValueId){
      let [saleAttrId,saleAttrValueId] = next.saleIdAndValueId.split(":");
      prev.push({
        saleAttrId,saleAttrValueId
      });
    }
    return prev;
  }, []);
  //发送请求
  let result = await reqAddSku(skuParams);
  if(result.code == 200){
    ElMessage.success("添加SKU成功");
    //通知父组件切换场景
    $emit('changeScene',{flag:0,params:''});
  }else{
    ElMessage.error("添加SKU失败");
  }
  
}


</script>

<style lang="" scoped>

</style>