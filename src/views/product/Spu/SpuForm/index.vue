<template>
  <div>
      <el-form  ref="form" label-width="80px" :model="spu">
          <el-form-item label="SPU名称" >
              <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
              <el-select v-model="spu.tmId" placeholder="SPU品牌">
                  <el-option :label="tm.tmName" v-for="(tm,index) in tradeMarkList" :key="tm.id" :value="tm.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="SPU描述">
              <el-input type="textarea" placeholder="描述信息" rows="4" v-model="spu.description"> </el-input>
          </el-form-item>
          <el-form-item label="SPU图片">
              <el-upload 
                action="/dev-api/admin/product/fileUpload"
                list-type="picture-card"
                :file-list="imageList"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>           
          </el-form-item>
         <el-form-item label="销售属性">
             <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" style="margin:5px 5px" v-model="attrId">
                 <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
             </el-select>
             <el-button type="primary" icon="el-icon-plus" :disabled="!attrId" @click="addSaleAttr">添加销售属性</el-button>
             <el-table :data="spu.spuSaleAttrList" style="width: 100%" border>  
                 <el-table-column type="index" label="序号" width="80" align="center">
                 </el-table-column>
                 <el-table-column prop="saleAttrName" label="属性名" width="150">
                 </el-table-column>
                  <el-table-column prop="prop" label="属性值名称列表" width="width">
                      <template slot-scope="{row,$index}">
                          <!-- @close="handleClose(tag)"
                          @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"
                          @click="showInput"
                           -->
                          <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)" > {{tag.saleAttrValueName}} </el-tag>
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"  >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)" >添加</el-button>

                      </template>
                 </el-table-column>
                 <el-table-column prop="prop" label="操作" width="150">
                     <template slot-scope="{row,$index}">
                        <el-button type="danger" icon="el-icon-delete" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                     </template>
                 </el-table-column>
             </el-table> 
         </el-form-item>
         <el-form-item>
            <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
            <el-button @click="cancel">取消</el-button>
         </el-form-item>
      </el-form>
      
  </div>
</template>

<script>
export default {
    name:'SpuForm',
    data() {
        return {
             dialogImageUrl: '',
            dialogVisible: false,
            spu:{
            category3Id: '',
            description: "",
            spuImageList: [
                {
                id: 0,
                imgName: "",
                imgUrl: "",
                spuId: 0
                }
            ],
            spuName: "",
            spuSaleAttrList: [
                {
                baseSaleAttrId: '',
                id: '',
                saleAttrName: '',
                spuId: '',
                spuSaleAttrValueList: [
                    {
                    baseSaleAttrId: '',
                    id: 0,
                    isChecked: "",
                    saleAttrName: "",
                    saleAttrValueName: "",
                    spuId: '',
                    }
                ]
                }
            ],
            tmId:''
            },
            tradeMarkList:[],
            imageList:[],
            baseSaleAttrList:[],
            attrId:'',
        }
    },
     methods: {
        //  图片上传成功的回调
         handleSuccess(response, file, fileList){
             this.imageList=fileList;
         },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.imageList=fileList;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    //   初始化SpuForm的数据
   async initSpuData(spu){
        // 获得SPU信息
        let spuResult= await this.$API.spu.reqSpu(spu.id)
        if(spuResult.code==200){
            this.spu = spuResult.data
        }
        //   获取品牌的信息
        let TradeResult =await this.$API.spu. reqTrademarkList();
        if(TradeResult.code==200){
            this.tradeMarkList= TradeResult.data;
        }
        // 获得SPU图片的请求
        let imageResult =await this.$API.spu.reqImageList(spu.id)
        if(imageResult.code==200){
            // this.imageList= imageResult.data
            let AttrList=imageResult.data;
            AttrList.forEach(item => {
               item.name = item.imgName;
               item.url = item.imgUrl;
                
            });
            this.imageList = AttrList;
        }
        // 获得平台全部销售属性请求
       let baseResult= await this.$API.spu.reqbaseSaleAttrList()
       if(baseResult.code==200){
           this.baseSaleAttrList= baseResult.data
       }
       
      
    },
    // 添加新的销售属性
    addSaleAttr(){
        const [baseSaleAttrId,saleAttrName]=this.attrId.split(':')
        let newSaleAttr={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]};
        this.spu.spuSaleAttrList.push(newSaleAttr);
        this.attrId=''

    },
    // 添加按钮的回调
    addSaleAttrValue(row){
        this.$set(row,'inputVisible',true);
        this.$set(row,'inputValue','')
    },
    // 失去焦点
    handleInputConfirm(row){
        const{baseSaleAttrId,inputValue}=row;
        if(inputValue.trim()==''){
            this.$message('属性值不能为空');
            return;
        }
        // let result=row.spuSaleAttrValueList.every(item.saleAttrValueName=inputValue)
        // if(!result){
        //     this.$message('属性值不能相等');
        //     return;
        // }
        let newAttr={baseSaleAttrId,saleAttrValueName:inputValue}
        row.spuSaleAttrValueList.push(newAttr)
        row.inputVisible = false;
    },
    // 保存按钮的回调
   async addOrUpdateSpu(){
       this.spu.imageList= this.imageList.map(item=>{
            return{
                imageName:item.name,
                imageUrl:(item.response&&item.response.data)||item.url
            }
        });
      let result=  await this.$API.spu.reqAddOrUpdate(this.spu);
      if(result.code==200){
          this.$message({type:'success',message:'保存成功'})
           this.$emit('changeScene',{scene:0,flag:this.spuId?'修改':'添加'})
        //    this.$emit('changeScene',0)
      }
       //    清除数据
    Object.assign(this._data,this.$options.data())
    },
    // 添加spu的回调
   async addSpuData(category3Id){
       this.spu.category3Id=category3Id
         //   获取品牌的信息
        let TradeResult =await this.$API.spu.reqTrademarkList();
        if(TradeResult.code==200){
            this.tradeMarkList=TradeResult.data;
        }
        // 获得平台全部销售属性请求
       let baseResult= await this.$API.spu.reqbaseSaleAttrList()
       if(baseResult.code==200){
           this.baseSaleAttrList=baseResult.data
       }

    },
    // 取消按钮的回调
    cancel(){
       this. $emit('changeScene',{scene:0,flag:''})
    //    清除数据
    Object.assign(this._data,this.$options.data())
    }
    },
    computed:{
        // 计算出项目全部是销售属性
        unSelectSaleAttr(){
            // baseSaleAttrList
           let result= this.baseSaleAttrList.filter(item =>{
                return this.spu.spuSaleAttrList.every(item1=>{
                    return item.name!=item1.saleAttrName;

                })
            })
            return result

        }
    }

}
</script>

<style>
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>