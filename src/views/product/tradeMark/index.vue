<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="addshowDialog">添加</el-button>
  <!-- 表格组件 -->
  <el-table style="width: 100%" border :data="list">
    <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
     <el-table-column prop="tmName" label="品牌名称" width="width"> </el-table-column>
     <el-table-column prop="logoUrl" label="品牌Logo" width="width">
       <template slot-scope="{row,$index}">
         <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
       </template>
     </el-table-column>
     <el-table-column prop="prop" label="操作" width="width">
       <template slot-scope="{row,$index}">
         <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateShowDialog(row)">修改</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
       </template>
     </el-table-column>
  </el-table>
  <!-- 分页器 
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    -->
  <el-pagination
  style="margin-top:20px;textAlign:center"
    :current-page="page"
    :page-sizes="[3, 5, 10]"
    :page-size="limit"
    layout="prev, pager, next, jumper,->,sizes,total"
     @current-change="getPageList"
      @size-change="handleSizeChange"
    :total="total">
  </el-pagination>
  <!-- 对话框
  Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
   -->

  <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
  <el-form  style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
    <el-form-item label="品牌名称" label-width="100px" prop="tmName">
      <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
    </el-form-item>
    <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
      <!-- 上传图片 -->
      <el-upload
        class="avatar-uploader"
        action="/dev-api/admin/product/fileUpload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
    name: "tradeMark",
    data() {
      return {
        page:1,
        limit:3,
        total:0,
        list:[],
        dialogFormVisible:false,
        //  imageUrl: '',
         tmForm:{
           tmName:'',
           logoUrl:'',
         },
        //  表单验证
          rules: {
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
          logoUrl: [
            { required: true, message: '请选择图片', trigger: 'change' }
          ],
      }
    }
    },
    mounted(){
     this.getPageList();
    },
    methods:{
      // 获取商品品牌列表数据
     async getPageList(pager=1){
       this.page = pager;
        const{page,limit}=this;
      let result= await this.$API.trademark.reqTradeMarkList(page,limit)
     if(result.code==200){
       this.total=result.data.total;
       this.list=result.data.records;
     }
      },
      handleSizeChange(limit){
        this.limit=limit;
        this.getPageList();

      },
      // 点击添加品牌的按钮
      addshowDialog(){
        this.dialogFormVisible=true;
        this.tmForm={tmName:'',logoUrl:''}
      },
      // 修改品牌
      updateShowDialog(row){
        this.dialogFormVisible=true;
        this.tmForm={...row}
      },
    // 图片上传成功滞后的回调
     handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl=res.data
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 上传之前的回调
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }, 
      // 添加按钮(添加品牌|修改品牌)
     addOrUpdateTradeMark(){
        this.dialogFormVisible=false;
        // 发请求（添加品牌|修改品牌）
        this.$refs.ruleForm.validate(async(success)=>{
         if(success){
           let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
      if(result.code==200){
        this.$message({
          type: "success",
          message:this.tmForm.id?"修改品牌成功":'添加品牌成功'
        })
        this.getPageList(this.tmForm.id?this.page:1)
      }
         }else{
           console.log('error submit!!');
             return false;

         }
        }); 
     },
    //  删除按钮
    deleteTradeMark(row){
       this.$confirm(`你确定删除${row.tmName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let result =await this.$API.trademark.reqDeleteTradeMark(row.id)
          if(result.code==200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length>1?this.page:this.page-1)

          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
    
    },
}
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>