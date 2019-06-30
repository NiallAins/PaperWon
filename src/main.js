import Vue from 'vue';
import App from './App.vue';
import router from './router';
import directives from './directives';

Object.keys(directives).forEach(f => {
  Vue.directive(f, directives[f]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
