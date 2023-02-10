import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignInView from '../views/SignInView.vue';
import UserView from '../views/UserView.vue';
import AddMemberView from '../views/AddMemberView.vue';
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
      component: LoginView,
      meta: {
        isAuth: true
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
      meta: {
        isAuth: true
      }
    },
    {
      path: '/users/:id',
      name: 'user',
      component: UserView,
      props: true,
    },
    {
      path: '/members/merge/:id',
      name: 'addTreeMember',
      component: AddMemberView,
      props: true,
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

router.beforeEach((to, from, next) => {
  if (to.meta.isAuth && useAuthStore().authenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router
