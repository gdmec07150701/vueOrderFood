<template>
	<div class="home">
		<!--头部-->
		<header>
			<label><input type="search" v-model="keyword" :placeholder="search_ico"></label>
			<button type="button" class="search-btn" @click="search">搜索</button>
		</header>

		<!--侧边固定栏-->
		<aside class="animated bounceInLeft">
			<ul>
				<li v-for="(menu,index) in goods_cls" :class="{'ac':cur_goods_cls==menu.id}" @click="changeMenu(index)">{{menu.name}}</li>
			</ul>
		</aside>

		<!--主菜谱 外层容器用于消除animate动画的bug-->
		<div style="width:100%; overflow: hidden;">

			<div class="order-bar animated  bounceInRight">
				<div class="order-class" v-for="item in goods_cls">
					<h3>{{item.name}}</h3>
					<ul class="good-list">
						<li v-for="id in item.goods">
							<router-link :to="{name:'detail',params:{item:goods[id]}}"><img :src="goods[id].img"></router-link>
							<h4>{{goods[id].name}}</h4>
							<p class="ellipsis">{{goods[id].describe}}</p>
							<strong>￥{{goods[id].price}}</strong>
							<button type="button" @click="order(goods[id],$event)" :class="['pointer-btn',goods[id].checked? 'ac':'']" :disabled="goods[id].checked"><b>点餐</b><i>已点</i></button>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--底部-->
		<footer>
			<!--购物车-->
			<div class="shoping-cart animated" :class="{'bounceInUp':showShoppingCart,'shoping-list-slide':showShoppingCart}">
				<div class="empty">
					<span class="icon-trash" @click="clearShopping"></span>
				</div>
				<ul v-if="shopping_cart.length>0">
					<li v-for="(itm,index) in shopping_cart">{{itm.name}}
						<em>￥{{itm.price}}</em>
						<div>
							<button class="shoping-sub icon-minus" type="button" @click="s_sub(itm,index)"></button>
							<span>{{itm.num}}</span>
							<button class="shoping-add icon-plus" type="button" @click="s_add(itm)"></button>
						</div>
					</li>
				</ul>
				<ul v-else>
					<li style="text-align: center">还没有点菜哟！！</li>
				</ul>

				<!--id给抛物线用-->
				<button type="button" id="shoppingBtn" class="shopping-btn icon-shopping-cart" @click="showShoppingCart=!showShoppingCart"></button>
				<span class="count" :class="{'hide':totalNum==0}">{{totalNum}}</span>
			</div>

			<!--底部菜单-->
			<div class="cont">
				<div class="order-pointer-footer">
					<div class="total"><em>￥{{totalPrice}}</em></div>
					<a v-if="totalNum>0" href="javascript:;" class="pay-btn" @click="pay">去下单</a>
				</div>
			</div>
		</footer>
		<!--模态层-->
		<div class="modal" :class="{'hide':!showShoppingCart}" @click="showShoppingCart=!showShoppingCart"></div>
	</div>
</template>

<script>
	import axios from "axios";
	//zepto不支持commonJS，只能用jquery
	import $ from "jquery";
	//自定义抛物线 模块
	import par from "../assets/js/parabola.js";

	export default {
		name: 'home',
		data: () => ({
			//菜品
			"goods": null,
			//分类
			goods_cls: null,
			//购物车
			shopping_cart: [
				/*{
				    "id":1,
				    "name":"宫保鸡丁",
				    "price":22,
				    "num":1
				},*/
			],
			cur_goods_cls: 1, //当前分类id
			//总价格
			totalPrice: 0,
			//总数量
			totalNum: 0,
			//显示购物车
			showShoppingCart: false,
			//搜索关键字
			keyword: "",
			//vue只能用属性绑定方式定义placeholder图标
			search_ico: "\ue903 请输入菜品名称"
		}),

		created() {
			//本模块被keepalive，created钩子只运行一次
			axios.get("/static/data.json").then(
				msg => {
					this.goods = msg.data.goods
					this.goods_cls = msg.data.goods_cls;
					//存入store
					this.$store.commit("update_goods", this.goods);
				}, 
				() => {
					alert("连接失败");
				}
			);
			
			//全局路由钩子
			this.$router.beforeEach((to, from, next) => { //回调函数
				//从搜索页回来，清除关键字
				this.keyword = "",
				//如果打开购物车，直接路由到下单页，再从下单页返回，不显示购物车
				this.showShoppingCart = false;
				next() //一定要记着执行，不然路由不能跳转了
			})
		},
		watch: {
			//监听购物车变化
			shopping_cart: {
				handler(curval, oldval) {
					//清空所有数据
					this.totalNum = this.totalPrice = 0;

					//清空所有菜品checked
					for(var key in this.goods) {
						this.goods[key].checked = false;
					}
					
					curval.forEach(item => {
						//重新计算总额 总数
						this.totalNum += item.num;
						this.totalPrice += item.num * item.price;
						
						//禁用已选菜品按钮
						this.goods[item.id].checked = true;
					});
					//向vuex的store存储数据
					this.$store.commit("update_shopping_cart", this.shopping_cart);
				},
				deep: true //对象内部的属性监听，也叫深度监听  
			},
		},
		mounted() {
			//监听window滚动
			window.addEventListener('scroll', this.winScroll)
		},
		methods: {
			//滚动
			winScroll() {
				var _this = this;
				var scrollTop = $(window).scrollTop();
				var oItem = $('.order-class');
				oItem.each(function(i, elm) {
					//此处不能使用箭头函数，因为$(this)
					//offset
					if($(this).offset().top < scrollTop + 200) {
						_this.cur_goods_cls = i + 1;
					}
				})
			},
			//搜索
			search() {
				if(this.keyword == "") {
					alert("请输入搜索关键字！！");
				} else {
					//搜索页面的菜品，也可以进入详情页，所以，所有数据都要放在store内
					this.$store.commit("update_keyword", this.keyword);
					this.$router.push("list")
				}
			},
			//点餐
			order(item, ev) {
				this.shopping_cart.push({
					id: item.id,
					name: item.name,
					price: item.price,
					num: 1
				});

				//加入购物车抛物线
				var el = $('<div class="parabola-el"></div>');
				$(document.body).append(el);
				new par.parabola({
					origin: ev.target,
					target: '#shoppingBtn',
					element: el,
					time: 500,
					a: 0.01,
					callback(el) {
						el.remove();
					}
				}).move()
			},

			//左侧切换
			changeMenu(i) {
				var aUl = $('.order-class');
				//使用position判断的ul
				$(window).scrollTop(aUl.eq(i).position().top);
			},

			//清空购物车
			clearShopping() {
				this.showShoppingCart = !this.showShoppingCart;
				this.shopping_cart = [];
			},

			//购物车add
			s_add(item) {
				item.num++;
			},

			//购物车sub
			s_sub(item, i) {
				item.num--;
				if(item.num == 0) {
					this.shopping_cart.splice(i, 1);
				};
			},
			//去下单
			pay() {
				this.$router.push({
					name: "pay",
					params: {
						totalPrice: this.totalPrice
					}
				})
			},
		},
	}
</script>
<style scoped>

</style>