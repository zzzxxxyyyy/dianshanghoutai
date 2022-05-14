<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card >
      <!-- 底部将来是有三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示Spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled='!category3Id' @click="addSpu">添加SPU</el-button>
        <el-table :data="records" style="width: 100%" border> 
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="270">
            <template slot-scope="{row,$index}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
               <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></el-button>
            </el-popconfirm>
             
            </template>
          </el-table-column>
        </el-table>
        <!--  @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination align="center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          @current-change="handleCurrentChange"
           @size-change="handleSizeChange"
          :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>

    </el-card>
    <el-dialog :title="`${spu.spuName}列表`" :visible.sync="dialogTableVisible">
      <el-table :data="skuList" style="width: 100%" border >
        <el-table-column prop="skuName"  label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price"  label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight"  label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop"  label="默认图片" width="width">
          <template slot-scope="{row,$index}">
           <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
 
</el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
    name: "Spu",
    data() {
      return {
        category1Id:'',
        category2Id:'',
        category3Id:'',
        page:1,//分页第几页
        limit:3,//一页展示几条数据
        records:[],
        total:'',
        scene:0,
        spu:{},
       dialogTableVisible:false,
       skuList:[],
      //  loading: true,
      }
    },
    methods: {
      // 三级联动的自定义事件的回调
      getCategoryId({categoryId,level}){
        if(level==1){
         this.category1Id = categoryId;
         this.category2Id ='';
         this.category3Id ='';
        }else if(level==2){
          this.category2Id = categoryId;
          this.category3Id ='';
        }else{
          this.category3Id = categoryId
          // 三级分类有ID了需要发请求得到数据
          this.getSpuList();
        }

      },
      // 获取列表数据的请求方法
     async getSpuList(){
       const {page,limit,category3Id}=this;
      let result=await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code == 200){
        this.records=result.data.records;
        this.total=result.data.total;
      }
      },
      // 点击分页器的第几页按钮的回调
      handleCurrentChange(page){
        this.page=page;
        this.getSpuList();

      },
      handleSizeChange(limit){
        this.limit=limit;
        this.getSpuList();
      },
      // 点击添加SPU属性的回调
      addSpu(){
        this.scene=1;
        this.$refs.spu.addSpuData(this.category3Id);
      },
      // 修改Spu的回调
      updateSpu(row){
        this.scene=1;
        // 获取spuform的子组件的数据
        this.$refs.spu.initSpuData(row);
              },
      // SPUform自定义事件的回调
      changeScene({scene,flag}){
        this.scene=scene;
        if(flag=='修改'){
           this.getSpuList(this.page);
        }else{
          this.getSpuList();
        }
       
      },
      // 删除按钮
     async deleteSpu(row){
      let result= await this.$API.spu.reqDeleteSpu(row.id);
     if(result.code ==200){
       this.$message({type: "success",message:'删除成功'})
       this.getSpuList(this.records.length > 1 ? this.page:this.page-1);
     }

      },
      // 添加sku
      addSku(row){
        this.scene=2;
        this.$refs.sku.getData(this.category1Id,this.category2Id,row);
      },
      // 取消自定义事件的回调
      changeScenes(scene){
        this.scene = scene;
      },
      // 查看当前sku列表的回调
     async handler(spu){
        this.dialogTableVisible = true;
        this.spu = spu;
      let result = await this.$API.spu.findBySpuId(spu.id);
      if(result.code == 200){
        this.skuList=result.data;
        // this.loading=false;

      }

      },
      // // 关闭对话框的回调
      // close(){
      //   this.skuList=[];
      // }


    },
    components:{
      SkuForm,
      SpuForm
    }
}
</script>

<style>

</style>