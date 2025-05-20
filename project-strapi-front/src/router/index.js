import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const jwt = localStorage.getItem('jwt')
  const user = localStorage.getItem('user')
  if (to.meta.requiresAuth && !jwt) {
    next('/login')
  } else if (to.path === '/admin') {
    let isAdmin = false
    if (user) {
      try {
        const userObj = JSON.parse(user)
        // Strapi v4 : le rôle est dans user.role.name
        isAdmin = userObj.role && userObj.role.name === 'Admin'
      } catch (e) {
        isAdmin = false
      }
    }
    if (!isAdmin) {
      console.error('Accès refusé : vous devez être administrateur pour accéder à cette page.')
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 