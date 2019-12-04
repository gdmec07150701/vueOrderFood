import Vue from "vue";
import Vuex from "vuex";

//应用插件
Vue.use(Vuex);

//定义vuex状态
export default new Vuex.Store({
	state:{
		shopping_cart:[],  //购物车
		goods:{},
		keyword:"",
	},
	
	mutations:{
		update_shopping_cart(state,paylod){
//			console.log(paylod);
			this.state.shopping_cart=paylod;
		},
		
		update_goods(state,paylod){
			state.goods=paylod;
		},
		
		update_keyword(state,paylod){
			state.keyword=paylod;
		}
	}
})
