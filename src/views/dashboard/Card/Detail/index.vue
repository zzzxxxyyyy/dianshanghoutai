<template>
  <div>
      <div class="card-header">
          <span>{{title}}</span>
          <svg t="1645449580161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2699" width="16" height="16"><path d="M503.803829 63.578014c-247.050676 0-447.328072 200.277396-447.328072 447.327048 0 247.054769 200.277396 447.333188 447.328072 447.333188 247.054769 0 447.332165-200.278419 447.332165-447.333188C951.13497 263.85541 750.858598 63.578014 503.803829 63.578014L503.803829 63.578014zM503.803829 894.313336c-211.749682 0-383.408273-171.659615-383.408273-383.408273 0-211.749682 171.659615-383.40725 383.408273-383.40725 211.753775 0 383.412366 171.658591 383.412366 383.40725C887.216195 722.653721 715.557604 894.313336 503.803829 894.313336L503.803829 894.313336zM447.745069 255.897158l127.914298 0L575.659367 383.576095 447.745069 383.576095 447.745069 255.897158 447.745069 255.897158zM447.745069 425.470251l127.914298 0 0 342.058516L447.745069 767.528767 447.745069 425.470251 447.745069 425.470251zM447.745069 425.470251" p-id="2700" fill="#8a8a8a"></path></svg>
      </div>
      <div class="card-content">{{count}}</div>
      <div class="card-charts">
         <slot name="charts"></slot>
      </div>
      <div class="card-footer">
          <slot name="footer"></slot>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Detail',
    props:['title','count']

}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
}
.card-content{
    font-size:30px;
    padding:10px 0px;
}
.card-charts {
    height: 50px;

}
.card-footer{
    border-top: 1px solid #eee;
}

</style>