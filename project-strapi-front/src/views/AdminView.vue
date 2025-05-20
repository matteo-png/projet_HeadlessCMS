<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Gestion des Souhaits</h2>
      <button @click="openModal" class="btn btn-primary">
        Ajouter un souhait
      </button>
    </div>

    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="text-red-600 text-center">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles" :key="article.documentId" class="card hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-900">{{ article.title }}</h3>
          <div class="flex space-x-2">
            <button @click="editArticle(article)" class="text-gray-600 hover:text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button @click="deleteArticle(article.documentId)" class="text-gray-600 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="article.description" class="text-gray-600 mb-4">
          {{ article.description }}
        </p>
        <div v-if="article.category" class="mb-4">
          <span class="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
            {{ article.category.name }}
          </span>
        </div>
        <a 
          v-if="article.lien" 
          :href="article.lien" 
          target="_blank" 
          class="text-primary-600 hover:text-primary-700"
        >
          Voir le lien
        </a>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="card w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingArticle ? 'Modifier le souhait' : 'Ajouter un souhait' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            ></textarea>
          </div>

          <div>
            <label for="lien" class="block text-sm font-medium text-gray-700">Lien (optionnel)</label>
            <input
              id="lien"
              v-model="form.lien"
              type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              id="category"
              v-model="form.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option 
                v-for="category in availableCategories" 
                :key="category.documentId"
                :value="category.documentId"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ editingArticle ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { wishlistService, categoryService } from '../services/api'

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const editingArticle = ref(null)
const availableCategories = ref([])

const form = ref({
  title: '',
  description: '',
  lien: '',
  category: ''
})

const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll()
    availableCategories.value = response.data
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err)
  }
}

const fetchArticles = async () => {
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

const openModal = () => {
  editingArticle.value = null
  form.value = {
    title: '',
    description: '',
    lien: '',
    category: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingArticle.value = null
}

const editArticle = (article) => {
  editingArticle.value = article
  form.value = {
    title: article.title,
    description: article.description,
    lien: article.lien,
    category: article.category ? article.category.documentId : ''
  }
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const articleData = {
      ...form.value,
      category: form.value.category ? {
        connect: [{ documentId: form.value.category }]
      } : null
    }

    if (editingArticle.value) {
      await wishlistService.update(editingArticle.value.documentId, articleData)
    } else {
      await wishlistService.create(articleData)
    }
    await fetchArticles()
    closeModal()
  } catch (err) {
    error.value = "Une erreur est survenue lors de l'enregistrement"
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deleteArticle = async (documentId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return

  loading.value = true
  try {
    await wishlistService.delete(documentId)
    await fetchArticles()
  } catch (err) {
    error.value = "Une erreur est survenue lors de la suppression"
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchArticles(), fetchCategories()])
})
</script> 