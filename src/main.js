// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import './commen/index.css';
import {DatePicker, Modal, Message, Select, Option,Spin} from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.component('DatePicker', DatePicker);
Vue.component('Spin', Spin);
Vue.component('Modal', Modal);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.prototype.$Message=Message;
Vue.use(ElementUI);
Vue.config.productionTip = false;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: {App},
  template: '<App/>',
});
