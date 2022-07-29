import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';
import * as echarts from 'echarts';
import 'echarts-gl';

Vue.use(VueRouter);
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL
});

new Vue({
    router,
    vuetify,
    render: (h) => h(App)
}).$mount('#app');
