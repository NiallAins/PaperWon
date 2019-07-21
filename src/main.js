import Vue from 'vue';
import App from './App.vue';
import router from './router';
import directives from './directives';
import def from './components/def';

// Load directives and global components
Object.keys(directives).forEach(f => {
  Vue.directive(f, directives[f]);
});
Vue.component('def', def);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
