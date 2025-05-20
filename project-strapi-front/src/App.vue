<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from './services/api'

const router = useRouter()
const isAuthenticated = ref(false)
const isAdmin = ref(false)
const username = ref('')

const fetchAndSetUser = async () => {
  const jwt = localStorage.getItem('jwt')
  const user = localStorage.getItem('user')
  if (jwt && user) {
    try {
      const userObj = JSON.parse(user)
      // Récupérer les infos complètes (avec le rôle)
      const userFull = await authService.getUserById(userObj.id)
      localStorage.setItem('user', JSON.stringify(userFull))
      username.value = userFull.username || ''
      isAuthenticated.value = true
      isAdmin.value = userFull.role && userFull.role.name === 'Admin'
    } catch {
      username.value = ''
      isAuthenticated.value = false
      isAdmin.value = false
    }
  } else {
    username.value = ''
    isAuthenticated.value = false
    isAdmin.value = false
  }
}

const logout = () => {
  localStorage.removeItem('jwt')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  isAdmin.value = false
  username.value = ''
  router.push('/')
  window.location.reload()
}

watch(() => router.currentRoute.value.path, () => {
  fetchAndSetUser()
})

onMounted(fetchAndSetUser)
</script>

<template>
  <div class="min-h-screen flex flex-col w-full bg-gray-50">
    <!-- Header -->
    <header class="w-full h-16 bg-white shadow-sm">
      <nav class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center w-full">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xl font-bold text-gray-900">Liste de Souhaits</span>
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              v-if="!isAuthenticated" 
              to="/login" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Se connecter
            </router-link>
            <router-link 
              v-if="!isAuthenticated" 
              to="/register" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Inscription
            </router-link>
            <span v-if="isAuthenticated && username" class="text-gray-700 font-semibold">
              {{ username }}
            </span>
            <router-link 
              v-if="isAdmin" 
              to="/admin" 
              class="text-gray-600 hover:text-primary-600 transition-colors font-semibold"
            >
              Dashboard Admin
            </router-link>
            <button 
              v-if="isAuthenticated" 
              @click="logout" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="w-full bg-white border-t mt-auto">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} Liste de Souhaits. Tous droits réservés.
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
.card {
  @apply bg-white rounded-lg shadow-sm p-6 border border-gray-100;
}
input, textarea, select {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}
label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
</style>
