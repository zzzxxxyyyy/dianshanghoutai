<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input  placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述" >
        <el-input
          type="textarea"
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item  :label="attr.attrName"  v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择" value="" >
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择" >
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="skuImageList" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column
            prop="prop"
            type="selection"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
              <template slot-scope="{row,$index}">
                 <img :src="row.imgUrl" style="width:100px;height:100px">
              </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else> 默认</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item >
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
        image:[],
      skuImageList: [], //保存图片的数据
      spuSaleAttrList: [], //保存销售属性的数据
      attrInfoList: [], //获取平台属性的数据
      skuInfo: {
        category3Id: '',
        price: 0,
        skuAttrValueList: [
        //   {
        //     attrId: '',
        //     valueId: '',
        //   },
        ],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [
        //   {
        //     id: '',
        //     imgName: "",
        //     imgUrl: "",
        //     isDefault: "",
        //     skuId: '',
        //     spuImgId: '',
        //   },
        ],
        skuName: "",
        skuSaleAttrValueList: [
        //   {
        //     id: '',
        //     saleAttrId: '',
        //     saleAttrName: "",
        //     saleAttrValueId: '',
        //     saleAttrValueName: "",
        //     skuId: 0,
        //     spuId: 0,
        //   },
        ],
        spuId: '',
        tmId: '',
        weight: "",
      }, 
      spu:{},
    
    };
  },
  methods: {
    // 发请求
    async getData(category1Id, category2Id, spu) {
        this.skuInfo.category3Id=spu.category3Id;
        this.skuInfo.tmId=spu.tmId;
        this.skuInfo.spuId=spu.id;
        this.spu=spu;
      // 获取图片的请求
      let result = await this.$API.spu.reqSkuImageList(spu.id);
      
      if (result.code == 200) {
        let list = result.data;
        list.forEach(item => {
            item.isDefault=0;
        });
        this.skuImageList=list;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    // 复选框的回调
    handleSelectionChange(params){
       this.image=params;
    },
    // 排他操作
    changeDefault(row){
        this.skuImageList.forEach(item=>{
            item.isDefault=0
        });
        row.isDefault=1;
        this.skuInfo.skuDefaultImg=row.imgUrl
    },
    // 取消按钮
    cancel(){
        this.$emit('changeScenes',0)
        Object.assign(this._data,this.$options.data())
    },
    // 保存按钮
   async save(){
        const{attrInfoList,skuInfo,spuSaleAttrList,image}=this;
        let arr=[]
        // 平台属性数据的整理
        attrInfoList.forEach(item=>{
            if(item.attrIdAndValueId){
                const[attrId,attrValueId]=item.attrIdAndValueId.split(":");
                let obj={attrId,attrValueId}
                arr.push(obj)
            }
        });
        skuInfo.skuAttrValueList=arr;
         // 销售属性数据的整理
     skuInfo.skuSaleAttrValueList= spuSaleAttrList.reduce((prev,item)=>{
            if(item.attrIdAndValueId){
                const[saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(":")
                prev.push({saleAttrId,saleAttrValueId})
            }
            return prev
        },[]);
        // 图片属性数据的整理
        skuInfo.skuImageList = image.map(item=>{
         return {
           imgName:item.imgName,
           imgUrl:item.imgUrl,
           isDefault:item.isDefault,
           spuImgId:item.id,
         }
     });
        // 发请求
        let result=await this.$API.spu.reqAddSkuInfo(skuInfo);
        console.log(result);
        console.log(456)
       if (result.code == 0){
           this.$message({type: "success",message:'保存成功'})
           this.$emit('changeScenes',0)
           
       }
       
    }
  },
};
</script>

<style>
</style>