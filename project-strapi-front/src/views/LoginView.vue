<template>
  <div class="flex flex-col min-h-full w-full">
    <div class="flex-1 flex flex-col justify-center w-full px-4 sm:px-8">
      <div class="w-full max-w-lg mx-auto">
        <div class="card">
          <!-- Header -->
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Connexion Admin</h2>
            <p class="mt-2 text-gray-600">
              Connectez-vous pour gérer la liste de souhaits
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
            <div class="space-y-4">
              <div>
                <label for="identifier" class="block text-sm font-medium text-gray-700">
                  Identifiant
                </label>
                <input
                  id="identifier"
                  v-model="form.identifier"
                  type="text"
                  required
                  class="mt-1"
                  :class="{ 'border-red-300': error }"
                  placeholder="Entrez votre identifiant"
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="mt-1"
                  :class="{ 'border-red-300': error }"
                  placeholder="Entrez votre mot de passe"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="text-red-600 text-sm text-center">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                class="w-full btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
                <span v-else>Se connecter</span>
              </button>
            </div>

            <!-- Back Link -->
            <div class="text-center">
              <router-link 
                to="/" 
                class="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                Retour à l'accueil
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api'

const router = useRouter()
const loading = ref(false)
const error = ref(null)

const form = ref({
  identifier: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await authService.login(form.value.identifier, form.value.password)
    localStorage.setItem('jwt', response.jwt)
    localStorage.setItem('user', JSON.stringify(response.user))
    router.push('/admin')
  } catch (err) {
    error.value = "Identifiants incorrects"
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script> 