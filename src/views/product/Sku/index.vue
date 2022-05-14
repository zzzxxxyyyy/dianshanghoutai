<template>
  <div>
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
       <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
       <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
       <el-table-column prop="prop" label="默认图片" width="width">
         <template slot-scope="{row,$index}">
           <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
         </template>
      </el-table-column>
       <el-table-column prop="weight" label="重量" width="80">
      </el-table-column>
       <el-table-column prop="price" label="价格" width="80">
      </el-table-column>
       <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
         <el-button type="success" icon="el-icon-top" size="mini" v-if="row.isSale" @click="sale(row)"></el-button>
         <el-button type="primary" icon="el-icon-bottom" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletesku(row)"></el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
     @current-change="getSkuList"
       @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total">
    </el-pagination>
    <el-drawer :visible.sync="drawer" :direction="direction" :before-close="handleClose" :show-close=false size="50%">
    <el-row>
      <el-col :span="5">sku名称</el-col>
      <el-col :span="16">{{skuInfo.skuName}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="5">描述</el-col>
      <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="5">价格</el-col>
      <el-col :span="16">{{skuInfo.price}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="5">平台属性</el-col>
      <el-col :span="16">
        <template>
          <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </template>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">商品图片</el-col>
      <el-col :span="16">
          <el-carousel style="height:350px;width:350px">
          <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
           <img :src="item.imgUrl" alt="" style="width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
</el-drawer>
  </div>
</template>

<script>
export default {
    name: "Sku",
    data() {
      return {
        page:1,
        limit:7,
        total:'',
        records:[],
        skuInfo:{},//存储抽屉的信息
        drawer:false,
      }
    },
    mounted(){
      this.getSkuList();
    },
    methods: {
      // 获取SKU数据
     async getSkuList(pages=1) {
       this.page = pages;
        const{page,limit} = this
      let result =await this.$API.sku.reqSkuList(page,limit)
      if (result.code == 200) {
         this.total=result.data.total;
        this.records=result.data.records;
      }
      },
        // 点击分页器的第几页按钮的回调
       handleSizeChange(limit){
        this.limit=limit;
        this.getSkuList();
      },
      // 上架
     async sale(row){
        let result =await this.$API.sku.reqOnSale(row.id)
        if(result.code==200){
          row.isSale=0
          this.$message({type: "success", message:'上架成功'})
        }
      },
      // 下架
     async cancel(row){
         let result =await this.$API.sku.reqCancelSale(row.id)
        if(result.code==200){
          row.isSale=1
          this.$message({type: "success", message:'下架成功'})
        }
        
      },
      // 正在开发中
      edit(){
        this.$message('正在开发中....');
      },
      // 获取抽屉的信息
     async getSkuInfo(sku){
       let result =await this.$API.sku.reqGetSkuById(sku.id)
       if (result.code==200){
        this.drawer = true
         this.skuInfo=result.data
       } 
      },
      // 删除按钮
     async deletesku(sku){
        let result =await this.$API.sku.reqDeleteSku(sku.id)
        if (result.code==200){
          this.$message({type: "success",message:'删除成功'});
          this.getSkuList(this.records.length>1?this.page:this.page-1);
        }
      }
     
    },
}
</script>
<style>
   .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
<style scope>
.el-row .el-col-5 {
  font-size:20px;
  text-align:right;

 
}
.el-col{
  margin:10px 10px
}

</style>