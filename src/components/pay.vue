<template>
    <div class="pay bounceInDown animated">
        <h2>订单提交成功</h2>
        <p>订单总额：<em style="color: red; font-size:.3rem;">{{$route.params.totalPrice}}</em> 元</p>
        <br>
        <h3>您的订单编号是：</h3>
        <p class="order-num">3323574823</p>
        <p><button class="pay-btn">去付款</button></p>
        <p><button class="goback-btn" @click="goback">返回菜单</button></p>
    </div>
</template>

<script>
    export default{
        methods: {
            goback() {
                this.$router.push("home");
            }
        }
    }
</script>

<style>
</style>