import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import * as echarts from 'echarts';
import 'echarts-gl';

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: (h) => h(App)
}).$mount('#app');
