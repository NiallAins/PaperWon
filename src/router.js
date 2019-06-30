import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Papers from '@/views/Papers';
import About from '@/views/About';
import Topics from '@/views/Topics';
import ExamPaper from '@/views/ExamPaper';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/papers',
      name: 'papers',
      component: Papers
    },
    {
      path: '/papers/:year/:paper',
      name: 'exampaper',
      component: ExamPaper
    },
    {
      path: '/topics',
      name: 'topics',
      component: Topics
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
});
