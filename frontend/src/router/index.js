import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import Login from '../components/Login.vue';
import SignIn from '../components/SignIn.vue';

import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        needsAuth: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.needsAuth && !useAuthStore().authenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router
