<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!-- @tab-click="handleClick" -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setToday">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!-- 日历 -->
          <el-date-picker
            size="mini"
            class="date"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-mm-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="16">
            <!-- 柱状图 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="8">
              <div>
                  <h4>{{title}}排名</h4>
                  <ul>
                      <li>
                          <span class="rindex">1</span>
                          <span class="rmiddle">肯德基</span>
                          <span class="rvalue">123456</span>
                      </li>
                      <li>
                          <span class="rindex">2</span>
                          <span class="rmiddle">麦当劳</span>
                          <span class="rvalue">123456</span>
                      </li>
                      <li>
                          <span class="rindex">3</span>
                          <span class="rmiddle">肯德基</span>
                          <span class="rvalue">123456</span>
                      </li>
                      <li>
                          <span class="rindex">4</span>
                          <span class="rmiddle">海底捞</span>
                          <span class="rvalue">123456</span>
                      </li>
                      <li>
                          <span>5</span>
                          <span class="rmiddle">汉堡王</span>
                          <span class="rvalue">123456</span>
                      </li>
                      <li>
                          <span>6</span>
                          <span class="rmiddle">肯德基</span>
                          <span class="rvalue">123456</span>
                      </li>
                      <li>
                          <span>7</span>
                          <span class="rmiddle">肯德基</span>
                          <span class="rvalue">123456</span>
                      </li>
                  </ul>
              </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      Mycharts:null,
      date:[],
      
    };
  },
  mounted() {
    this. Mycharts = echarts.init(this.$refs.charts);
   this. Mycharts.setOption({
        title:{
            text: "总销售量"
        },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月","九月","十月","十一月","十二月"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220,110,120,130,140,120],
        },
      ],
    });
  },
  computed:{
      title(){
          return this.activeName=="sale"?'销售额':"访问量"
      }
  },
  watch:{
      title(){
          this.Mycharts.setOption({
              title:{
                   text:this.title
              }
          })
         
      }

  },
  methods: {
      setToday(){
          const day=dayjs().format('YYYY-MM-DD');
          this.date=[day,day]

      },
      setWeek(){
          const start=dayjs().day(1).format('YYYY-MM-DD');
          const end=dayjs().day(7).format('YYYY-MM-DD');
          this.date=[start,end]
      },
      setMonth(){
          const start=dayjs().startOf('month').format('YYYY-MM-DD');
          const end=dayjs().endOf('month').format('YYYY-MM-DD');
          this.date=[start,end]
      },
      setYear(){
          const start=dayjs().startOf('year').format('YYYY-MM-DD');
          const end=dayjs().endOf('year').format('YYYY-MM-DD');
          this.date=[start,end]
      }
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0 10px;
}
.date {
  width: 230px;
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0px;
}
ul li{
    height:8%;
}
.rindex {
    float: left;
    width: 16px;
    height: 17px;
    border-radius:50%;
    background:black;
    color: #fff;
    text-align: center;
    

}
.rvalue{
    float: right;
}
.rmiddle{
    margin-left:10px
}
</style>