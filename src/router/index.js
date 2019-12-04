import Vue from 'vue'
import Router from 'vue-router';
import home from '@/components/home';
import detail from '@/components/detail';
import list from '@/components/list';
import pay from '@/components/pay';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:"/home"
    },
    {
      path: '/home',
      name: 'home',
      meta:{keepAlive:true}, //缓存首页数据
      component: home
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/pay',
      name: 'pay',
      component: pay
    }
  ]
})
