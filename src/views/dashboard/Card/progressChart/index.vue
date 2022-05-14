<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name:'progressChart',
    mounted() {
        let barChart = echarts.init(this.$refs.charts)
        barChart.setOption({
             xAxis: {
                 min: 0,
                 max: 100,
                show:false,
               
            },
            yAxis: {
                type: 'value',
                show:false,
                type: 'category',
            },
            series: [
                {
                data: [78],
                type: 'bar',
                barWidth:10,
                color: "skyblue",
                showBackground:true,
                backgroundStyle:{
                    color: "#eee"
                },
                label: {
                    show:true,
                    formatter:'|',
                    position:"right",
                    color: "skyblue"
                }
                }
            ]
        })
    },

}
</script>

<style>
.charts {
    width: 100%;
    height: 100%;
}

</style>