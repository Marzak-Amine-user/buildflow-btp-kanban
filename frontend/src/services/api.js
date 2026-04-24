const API_URL = 'http://localhost:3000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur API inconnue' }))
    throw new Error(error.message || 'Erreur API')
  }

  if (response.status === 204) return null
  return response.json()
}

function query(params = {}) {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined))
  return search.toString() ? `?${search}` : ''
}

export const api = {
  getHealth: () => request('/health'),
  getMeta: () => request('/meta'),
  getStats: () => request('/stats'),
  getActivities: () => request('/activities'),
  getProjects: () => request('/projects'),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (payload) => request('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  getTasks: (params = {}) => request(`/tasks${query(params)}`),
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (payload) => request('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  addComment: (id, payload) => request(`/tasks/${id}/comments`, { method: 'POST', body: JSON.stringify(payload) }),
  addChecklistItem: (id, payload) => request(`/tasks/${id}/checklist`, { method: 'POST', body: JSON.stringify(payload) }),
  updateChecklistItem: (id, itemId, payload) => request(`/tasks/${id}/checklist/${itemId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  reset: () => request('/reset', { method: 'POST' })
}
