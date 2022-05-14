<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name:'lineChart',
    mounted() {
        let LineCharts =echarts.init(this.$refs.charts)
        LineCharts.setOption({
           xAxis:{
               show:false,
               type:'category'
           },
           yAxis:{
               show:false,
           },
           series:[
               {
                   type: 'line',
                   data: [30,7,33,12,88,20,50],
                    smooth:true,
                   itemStyle: {
                       opacity: 0,
                   },
                   lineStyle:{
                       color:"purple"
                   },
                   areaStyle:{
                       color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'purple' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#fff' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                        }
                   }
               }
           ],
           grid:{
               left:0,
               top:0,
               right:0,
               bottom:0
           }
        })
    },

}
</script>

<style>
.charts{
    height:100%;
    width: 100%;
}

</style>