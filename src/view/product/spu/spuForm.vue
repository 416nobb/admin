<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>

    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId" style="width: 200px;">
        <el-option :label="item.tmName" v-for="(item, index) in AllTradeMark" :key="item.id"
          :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input v-model="SpuParams.description" type="textarea" placeholder="请描述SPU"></el-input>
    </el-form-item>

    <el-form-item label="SPU照片">
      <el-upload v-model:file-list="SpuImageList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;height:100%" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <el-select v-model="saleAttrIdAndValueName" width="80px" style="width: 200px;"
        :placeholder="unSelectSaleAttr.length ? `还未选${unSelectSaleAttr.length}个` : '无'">
        <el-option :label="item.name" v-for="(item, index) in unSelectSaleAttr" :key="item.id"
          :value="`${item.id}:${item.name}`"></el-option>

      </el-select>
      <el-button type="primary" size="" @click="addSaleAttr" icon="Plus" style="margin: 0px 10px"
        :disabled="saleAttrIdAndValueName ? false : true">添加属性值</el-button>
      <!-- 展示销售属性 -->
      <el-table :data="saleAttr" border style="margin:10px 0px">
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column width="120" label="销售属性名" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag class="mx-1" closable @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" style="margin:0px 5px">
              {{ item.saleAttrValueName }}
            </el-tag>
            <!-- 编辑模式 -->
            <el-input v-if="row.flag == true" v-model="row.saleAttrValue" placeholder="请输入"
              :ref="(vc) => inputArr[$index] = vc" size="small" clearable @blur="toLook(row)"
              style="width:100px"></el-input>

            <el-button v-else type="primary" @click="toEidt(row, $index)" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="" @click="save" :disabled="saleAttr.length > 0 ? false : true">保存</el-button>
      <el-button type="primary" size="" @click="cancel">取消</el-button>

    </el-form-item>


  </el-form>

</template>

<script setup>
import { ref, reactive, computed, nextTick } from "vue"
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from "@/api/product/spu";
import { ElMessage } from "element-plus";

let $emit = defineEmits(['changeScene']);
//点击取消，通知父组件切换场景
const cancel = () => {
  $emit('changeScene', {
      flag: 0,
      params: 'update',
    });
}

//input实例，负责获取焦点
let inputArr = ref([]);

//spu数据
//所有品牌
let AllTradeMark = ref([]);
//品牌照片
let SpuImageList = ref([]);
//销售属性
let saleAttr = ref([]);
//全部销售属性
let AllSaleAttr = ref([]);
//完整spu
let SpuParams = ref({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

//修改发请求,获得完整spu
const initHasSpuData = async (spu) => {
  //存储spu
  SpuParams.value = spu;
  //spu是父组件被点击修改的row：spu数据，发请求补全spu数据
  let _AllTradeMark = await reqAllTradeMark();
  let _SpuImageList = await reqSpuImageList(spu.id);
  let _SpuHasSaleAttr = await reqSpuHasSaleAttr(spu.id);
  let _AllSaleAttr = await reqAllSaleAttr();
  //存储spu数据

  AllTradeMark.value = _AllTradeMark.data;
  SpuImageList.value = _SpuImageList.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  });
  saleAttr.value = _SpuHasSaleAttr.data;
  AllSaleAttr.value = _AllSaleAttr.data;

}
//添加发请求
const initAddSpu = async (c3Id) => {
  //重置数据
  Object.assign(SpuParams.value, {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空图片
  SpuImageList.value = [];
  //清空销售属性
  saleAttr.value = [];
  saleAttrIdAndValueName.value = '';

  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let result = await reqAllTradeMark()
  let result1 = await reqAllSaleAttr()
  //存储数据
  AllTradeMark.value = result.data
  AllSaleAttr.value = result1.data
}

//图片墙
//控制对话框的显示与隐藏
let dialogVisible = ref(false)
//存储预览图片地址
let dialogImageUrl = ref('')
//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  //对话框弹出来
  dialogVisible.value = true
}
//照片墙上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF',
    })
    return false
  }
}
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性:颜色、版本、尺码
  //已有的销售属性:颜色、版本
  let unSelectArr = AllSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
//收集未选择的销售属性id和属性值名字
let saleAttrIdAndValueName = ref('');
//添加销售属性
let addSaleAttr = () => {
  /*
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
  //准备一个新的销售属性对象:将来带给服务器即可
  let newSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  //追加到数组当中
  saleAttr.value.push(newSaleAttr);
  //清空收集的数据
  saleAttrIdAndValueName.value = '';
}


//编辑模式
const toEidt = (row, $index) => {
  row.flag = true;
  row.saleAttrValue = '';
  //获取焦点
  nextTick(() => {
    console.log($index);
    inputArr.value[$index].focus();
  })
}
//查看模式
const toLook = (row) => {
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的属性值形式
  let newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  }
  //非法情况判断
  if (saleAttrValue.trim() == '') {
    ElMessage.error("输入不能为空");
    row.flag = false;
    return
  }
  //判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })


  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换场景
  row.flag = false;
}
//保存
const save = async () => {
  //整理数据
  //1:照片墙的数据
  SpuParams.value.spuImageList = SpuImageList.value.map((item) => {
    return {
      imgName: item.name, //图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //2:整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  //发请求
  let result = await reqAddOrUpdateSpu(SpuParams.value);
  console.log(result);

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    //通知父组件切换场景为0
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    });
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

defineExpose({ initHasSpuData, initAddSpu })


</script>

<style lang="" scoped>

</style>