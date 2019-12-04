<template>
  <div id="app">
  	<!--首页的goods数据要缓存-->
    <keep-alive>
    	<router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
	//引入样式表
	import "./assets/css/ico.css";
	import "./assets/css/style.css";
	import "./assets/css/animate.min.css";	
	
	export default {
	  name: 'App'
	}
</script>

<style>

</style>
