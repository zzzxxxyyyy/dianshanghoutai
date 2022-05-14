<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
       <div v-show="isShowTable">
         <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
       <el-table :data="attrList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
         <el-table-column prop="prop" label="属性列表" width="width">
           <template slot-scope="{row,$index}">
             <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin:0 15px">{{attrValue.valueName}}</el-tag>
           </template>
         </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{row,$index}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
       </el-table>
       </div>
       <!-- 添加属性|修改属性的结构 -->
       <div v-show="!isShowTable">
         <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
           <el-form-item label="属性名">
             <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
           </el-form-item>
         </el-form>
         <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
         <el-button @click="isShowTable=true">取消</el-button>
         <el-table  style="width: 100%;margin:20px 0px" border :data="attrInfo.attrValueList">
           <el-table-column type="index" label="序号" width="80" align="center">
           </el-table-column>
           <el-table-column  align="center" prop="prop" label="属性值名称" >
             <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else style="display:block;margin:0px 5px;text-align:left" @click="toEdit(row,$index)">{{row.valueName}}</span>
             </template>
           </el-table-column>
           <el-table-column prop="prop" label="操作" width="width" align="center">
             <template slot-scope="{row,$index}">
              <el-popconfirm :title="`你确定删除这个${row.valueName}这个属性值吗？`" @onConfirm="deleteAttrValue($index)">
                 <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" ></el-button>
              </el-popconfirm>
              
             </template>
           </el-table-column>
         </el-table>
         <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
         <!-- :disabled="attrInfo.attrValueList.length<1" -->
        <el-button @click="isShowTable=true">取消</el-button>
       </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
    name: "Attr",
    data() {
      return {
        category1Id:'',
        category2Id:'',
        category3Id:'',
        attrList: [],
        isShowTable:true,
        attrInfo:{
            attrName: "",//属性名
            attrValueList: [//属性值
            ],
            categoryId: 0,//三级分类的ID
            categoryLevel: 3,//服务器需要区分几级ID
          },
       };
    },
    methods:{
      // 自定义事件回调
      getCategoryId({categoryId,level}){
        // 区分三级分类相应的Id，以及父组件进行存储
       if(level==1){
        this.category1Id = categoryId;
        this.category2Id = '';
        this.category3Id = '';
       }else if(level==2){
         this.category2Id = categoryId;
         this.category3Id='';

       }else{
        //  代表三级分类的ID有了
         this.category3Id = categoryId;
         this.getAttrList();

       }
      },
      // 获取平台属性
     async getAttrList(){
        const {category1Id,category2Id,category3Id}=this;
      let result= await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
      if(result.code){
        this.attrList=result.data
      }
      },
      // 添加属性值的回调
     addAttrValue(){
        this.attrInfo.attrValueList.push({
         attrId:this.attrInfo.id,
         valueName:'',
         flag:true,
        });
        this.$nextTick(()=>{
          this.$refs[attrInfo.attrValueList.length-1].focus;
        })
      },
      // 添加属性的回调
      addAttr(){
        this.isShowTable=false;
        this.attrInfo={
           attrName: "",//属性名
            attrValueList: [//属性值
            ],
            categoryId:this.category3Id,//三级分类的ID
            categoryLevel: 3,//服务器需要区分几级ID
        };
      
      },
      // 修改某一个属性的回调
      updateAttr(row){
        this.isShowTable=false;
        this.attrInfo=cloneDeep(row);
        this.attrInfo.attrValueList.forEach((item)=>{
          this.$set(item,'flag',false)
        })
      },
      // 切换到查看模式
      toLook(row){
        if(row.valueName.trim()==''){
          this.$message('请输入一个属性值')
          return
        }
      let isRepat =this.attrInfo.attrValueList.some(item=>{
          if(row!==item){
            return row.valueName==item.valueName
          }
        })
          if(isRepat){
             this.$message('请不要输出相同的属性值')
             return
          }
        row.flag=false;
      },
      // 点击span时的回调--切换到编辑模式
      toEdit(row,index){
        row.flag=true;
        this.$nextTick(()=>{
          this.$refs[index].focus();
        })

      },
      // 删除属性值的操作回调
      deleteAttrValue(index){
        this.attrInfo.attrValueList.splice(index,1)
      },
      // 保存的回调
     async addOrUpdateAttr(){
        this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
         if(item.attrName!==''){
           delete item.flag;
           return true;
         }
        })
        try {
          await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
          this.isShowTable=true;
          this.$message({type:'success',message:'保存成功'})
          this.getAttrList();
        } catch (error) {
          this.$message('保存失败')
        }
      }
      

    }
}
</script>

<style>
   
</style>