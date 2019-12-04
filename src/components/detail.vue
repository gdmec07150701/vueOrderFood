<template>
	<div class="detail">
        <header>
            <h1>详情</h1>
            <a class="goback-btn icon-chevron-left" href="javascript:;" @click="goback">
            </a>
        </header>
        <div class="cont">
            <h4>{{$route.params.item.name}} 
            	<span class="price">￥{{$route.params.item.price}}</span>
            </h4>
            <!--goods的每一个元素都是一个对象，修改对应的元素，本item也会发生变化-->
            <button class="plus-btn icon-shopping-cart" :class="$route.params.item.checked?'ac':''" :disabled="$route.params.item.checked" @click="order"></button>
            
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="src in $route.params.item.slide"><img class="slide-img" :src="src"></div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
            <div>
            </div>
            <div class="describe">
                {{$route.params.item.describe}}
            </div>
        </div>
    </div>
</template>

<script>
	import swiper from "swiper";
    import "swiper/dist/css/swiper.min.css";

    export default {
        created() {
        	//详情可以直接点餐，所以也要读取购物车数据
            this.shopping_cart = this.$store.state.shopping_cart;
        },
        data:()=>({
            shopping_cart:[]//购物车
        }),
        mounted() {
        	//加载轮播图
            var mySwiper = new swiper('.swiper-container', {
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                },
            })
        },
        methods:{
        	//返回前页
            goback(){
              	this.$router.go(-1);  
            },
            //点餐
            order(){
                var item=this.$route.params.item;
                this.shopping_cart.push({
                    id:item.id,
                    name:item.name,
                    price:item.price,
                    num: 1
                });
                //item与goods[key]是同一个对象
                item.checked=true;
                //shopping_cart是个数组（引用数据类型），所以，可以不用commit，官方要求用commit
                //放入store里
                this.$store.commit("update_shopping_cart",{
                    shopping_cart:this.shopping_cart,
                });
            }
        }
    }
</script>

<style>
</style>