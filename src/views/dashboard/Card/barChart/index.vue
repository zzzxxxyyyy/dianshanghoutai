<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name:'barChart',
    mounted() {
        let barChart = echarts.init(this.$refs.charts)

        barChart.setOption({
             xAxis: {
                type: 'category',
                show:false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',
                show:false,
            },
            series: [
                {
                data: [110, 200, 150, 80, 70, 110, 130,90,80,50],
                type: 'bar'
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