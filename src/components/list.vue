<template>
    <div class="list">
        <header>
            <h1>搜索结果</h1>
            <router-link to="/home" class="goback-btn icon-chevron-left">
            </router-link>
            <span class="total">共{{search_list.length}}条</span>
        </header>
        
        <ul id="scrollMenu" class="good-list">
            <li v-for="item in search_list">
                <img :src="item.img" @click="show_detail(item)">
                <h4>{{item.name}}</h4>
                <p>{{item.describe}}</p>
                <strong>￥{{item.price}}</strong>
                <button type="button" @click="point(item)" :class="['pointer-btn',item.checked? 'ac':'']" :disabled="item.checked"><b>点餐</b><i>已点</i></button>
            </li>
        </ul>
       <div style="text-align: center;" v-if="search_list.length==0"> 没有搜索结果！</div>
    </div>
</template>

<script>
    export default {
        created() {
            //搜索页面的菜品，也可以进入详情页，所以，所有数据都要放在store内
            let keyword=this.$store.state.keyword;
            let goods=this.$store.state.goods;
            this.shopping_cart = this.$store.state.shopping_cart;
            
        	for(var key in goods){
                //ES6 字符串新增方法 includes：判断是否存在某个字符
                //注意 ：
                //console.log(str.includes('')); //空字符串 返回:true
                //console.log(str.indexOf(''))； //空字符串 返回：0
                if(goods[key].name.includes(keyword) && keyword!=""){
                    this.search_list.push(goods[key]);
                }
            }
        },
        data:()=>({
            search_list:[],
            shopping_cart:[]
        }),
        methods:{
        	//点餐
            point(item){
                this.shopping_cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    num: 1
                });
                item.checked=true;
                //放入store里
                this.$store.commit("update_shopping_cart",this.shopping_cart);
            },
            //显示详情页
            show_detail(item){
            	this.$router.push({name:"detail",params:{item}});
            }
        },
    }
</script>

<style scoped>
    
</style>