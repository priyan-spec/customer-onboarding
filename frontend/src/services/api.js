export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'
export const WS_URL = import.meta.env.VITE_WS_URL ?? `${API_BASE_URL.replace(/\/api\/?$/, '')}/ws`
const TOKEN_KEY = 'onboarding_auth_token'
const USER_KEY = 'onboarding_auth_user'

export function dashboardPathForRole(role) {
  if (role === 'PROJECT_MANAGER') return '/manager'
  if (role === 'TEAM_MEMBER') return '/team-member'
  return '/customer'
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function setAuthSession(authResponse) {
  setAuthToken(authResponse.token)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: authResponse.userId,
      role: authResponse.role,
      name: authResponse.name,
    }),
  )
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthUser() {
  const value = localStorage.getItem(USER_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function getAuthUserName(fallback = 'User') {
  return getAuthUser()?.name || fallback
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function apiFetch(path, options = {}) {
  const token = getAuthToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function registerUser(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createOnboardingProject(payload) {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('requirements', payload.requirements)
  formData.append('priority', payload.priority)
  formData.append('deadline', payload.deadline)

  payload.documents.forEach((file) => {
    formData.append('documents', file)
  })

  return apiFetch('/projects', {
    method: 'POST',
    body: formData,
  })
}

export function getCustomerProjects(userId) {
  return apiFetch(`/projects/customer/${userId}`)
}

export function getManagerProjects(managerId) {
  return apiFetch(`/projects/manager/${managerId}`)
}

export function getProject(projectId) {
  return apiFetch(`/projects/${projectId}`)
}

export function getProjectDocuments(projectId) {
  return apiFetch(`/documents/project/${projectId}`)
}

export async function downloadDocument(documentId, fileName = 'document') {
  const token = getAuthToken()
  const headers = new Headers()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, { headers })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unable to download document' }))
    throw new Error(error.message || 'Unable to download document')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function getTasksByProject(projectId) {
  return apiFetch(`/tasks/project/${projectId}`)
}

export function getTasksByAssignee(userId) {
  return apiFetch(`/tasks/assignee/${userId}`)
}

export function createTask(payload) {
  return apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTask(taskId, payload) {
  return apiFetch(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteTask(taskId) {
  return apiFetch(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export function getTeamMembers() {
  return apiFetch('/users/team-members')
}

export function getAssignedTeamMembers(projectId) {
  return apiFetch(`/project-assignments/project/${projectId}`)
}

export function assignTeamMember(payload) {
  return apiFetch('/project-assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateProjectAssignment(assignmentId, payload) {
  return apiFetch(`/project-assignments/${assignmentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteProjectAssignment(assignmentId) {
  return apiFetch(`/project-assignments/${assignmentId}`, {
    method: 'DELETE',
  })
}
