import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Papers from '@/views/Papers';
import Topics from '@/views/Topics';
import Definitions from '@/views/Definitions';
import About from '@/views/About';
import ExamPaper from '@/views/ExamPaper';
import ExamQuestion from '@/views/ExamQuestion';
import StyleGuide from '@/views/StyleGuide';

let router = new Router({
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
      component: ExamPaper,
      props: true
    },
    {
      path: '/papers/:year/:paper/:question',
      name: 'examquestion',
      component: ExamQuestion,
      props: true
    },
    {
      path: '/topics',
      name: 'topics',
      component: Topics
    },
    {
      path: '/definitions/:searchterm?',
      name: 'definitions',
      component: Definitions,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    ,
    {
      path: '/style-guide',
      name: 'styleguide',
      component: StyleGuide
    }
  ]
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

Vue.use(Router);

export default router;