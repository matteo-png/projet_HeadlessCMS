import axios from 'axios'

const API_URL = 'http://localhost:1337/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Intercepteur pour ajouter le token Bearer
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`
  }
  return config
})

export const authService = {
  async login(identifier, password) {
    const response = await api.post('/auth/local', {
      identifier,
      password
    })
    return response.data
  },
  async register(username, email, password) {
    const response = await api.post('/auth/local/register', {
      username,
      email,
      password
    })
    return response.data
  },
  async getUserById(id) {
    const response = await api.get(`/users/${id}?populate=*`)
    return response.data
  }
}

export const wishlistService = {
  async getAll() {
    const response = await api.get('/articles?populate=*')
    return response.data
  },

  async create(article) {
    const response = await api.post('/articles', {
      data: article
    })
    return response.data
  },

  async update(documentId, article) {
    const response = await api.put(`/articles/${documentId}`, {
      data: article
    })
    return response.data
  },

  async delete(documentId) {
    const response = await api.delete(`/articles/${documentId}`)
    return response.data
  }
}

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories')
    return response.data
  }
}

export default api 