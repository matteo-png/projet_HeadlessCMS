<template>
  <div class="flex flex-col min-h-full space-y-8">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-gray-900">Liste de Souhaits</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Découvrez notre sélection de souhaits et trouvez l'inspiration pour vos prochains achats.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 text-lg">{{ error }}</div>
      <button @click="fetchArticles" class="mt-4 btn btn-primary">
        Réessayer
      </button>
    </div>

    <!-- Articles Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="article in articles" 
        :key="article.documentId" 
        class="card group hover:shadow-lg transition-all duration-300"
      >
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {{ article.title }}
            </h3>
          </div>

          <p v-if="article.description" class="text-gray-600">
            {{ article.description }}
          </p>

          <div v-if="article.category" class="mb-4">
            <span class="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
              {{ article.category.name }}
            </span>
          </div>

          <!-- Réservation cadeau -->
          <div v-if="user">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                :checked="article.acheter && article.acheteur === user.username"
                :disabled="article.acheter && article.acheteur !== user.username"
                @change="handleToggleAcheter(article)"
              />
              <span v-if="!article.acheter">Je vais acheter ce cadeau</span>
              <span v-else-if="article.acheteur === user.username" class="text-primary-600">Vous avez réservé ce cadeau</span>
              <span v-else class="text-gray-500">Réservé par {{ article.acheteur }}</span>
            </label>
          </div>
          <div v-else-if="article.acheter && article.acheteur" class="text-gray-400 text-sm mb-2">
            Réservé par {{ article.acheteur }}
          </div>

          <div class="flex justify-end">
            <a 
              v-if="article.lien" 
              :href="article.lien" 
              target="_blank" 
              class="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              Voir le lien
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && articles.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun souhait disponible</h3>
      <p class="mt-2 text-gray-600">Revenez plus tard pour découvrir de nouveaux souhaits.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { wishlistService } from '../services/api'

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const user = ref(null)

const fetchArticles = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await wishlistService.getAll()
    articles.value = response.data
  } catch (err) {
    error.value = "Une erreur est survenue lors du chargement des articles"
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      user.value = JSON.parse(userStr)
    } catch {
      user.value = null
    }
  } else {
    user.value = null
  }
}

const handleToggleAcheter = async (article) => {
  if (!user.value) return
  const isAcheteur = article.acheteur === user.value.username
  const newAcheter = isAcheteur ? false : true
  const newAcheteur = isAcheteur ? '' : user.value.username
  try {
    await wishlistService.update(article.documentId, {
      acheter: newAcheter,
      acheteur: newAcheteur
    })
    await fetchArticles()
  } catch (err) {
    alert("Erreur lors de la réservation du cadeau")
    console.error(err)
  }
}

onMounted(() => {
  getCurrentUser()
  fetchArticles()
})
</script> 