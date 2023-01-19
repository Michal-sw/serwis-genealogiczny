import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignInView from '../views/SignInView.vue';
import DashboardView from '../views/DashboardView.vue';

import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        needsAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/users/:id',
      name: 'user',
      component: SignInView
    },
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
