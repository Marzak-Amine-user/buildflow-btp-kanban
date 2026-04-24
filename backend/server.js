import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { projects as seedProjects, tasks as seedTasks, team, statuses } from './data.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

let projects = structuredClone(seedProjects)
let tasks = structuredClone(seedTasks)
let activities = [
  { id: 1, type: 'success', message: 'Version Ultimate initialisée avec dashboard, Kanban et reporting.', createdAt: new Date().toISOString() },
  { id: 2, type: 'warning', message: 'Deux tâches critiques sont actuellement bloquées.', createdAt: new Date().toISOString() }
]

const getProject = (id) => projects.find((project) => project.id === Number(id))
const getTask = (id) => tasks.find((task) => task.id === Number(id))
const getOwner = (id) => team.find((member) => member.id === Number(id))
const today = () => new Date().toISOString().slice(0, 10)
const nextId = (items) => Math.max(0, ...items.map((item) => Number(item.id))) + 1

function logActivity(message, type = 'info') {
  activities.unshift({ id: Date.now(), type, message, createdAt: new Date().toISOString() })
  activities = activities.slice(0, 30)
}

function enrichTask(task) {
  const project = getProject(task.projectId)
  const owner = getOwner(task.ownerId)
  const checklist = task.checklist || []
  const checklistProgress = checklist.length ? Math.round((checklist.filter((item) => item.done).length / checklist.length) * 100) : 0
  return {
    ...task,
    projectName: project?.name || 'Chantier inconnu',
    projectLocation: project?.location || '',
    ownerName: owner?.name || 'Non assigné',
    ownerRole: owner?.role || 'Non défini',
    checklistProgress,
    overdue: Boolean(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done')
  }
}

function computeProjectProgress(projectId) {
  const projectTasks = tasks.filter((task) => task.projectId === Number(projectId))
  if (!projectTasks.length) return 0
  const done = projectTasks.filter((task) => task.status === 'done').length
  return Math.round((done / projectTasks.length) * 100)
}

function enrichProject(project) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id)
  const highRisk = projectTasks.filter((task) => ['Critique', 'Haute'].includes(task.priority) && task.status !== 'done').length
  const overdueCount = projectTasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done').length
  return {
    ...project,
    manager: getOwner(project.managerId),
    progress: computeProjectProgress(project.id),
    taskCount: projectTasks.length,
    blockedCount: projectTasks.filter((task) => task.status === 'blocked').length,
    doneCount: projectTasks.filter((task) => task.status === 'done').length,
    highRiskCount: highRisk,
    overdueCount
  }
}

function getFilteredTasks(query = {}) {
  const { projectId, status, priority, q, ownerId, category } = query
  let filtered = [...tasks]
  if (projectId) filtered = filtered.filter((task) => task.projectId === Number(projectId))
  if (status) filtered = filtered.filter((task) => task.status === status)
  if (priority) filtered = filtered.filter((task) => task.priority === priority)
  if (ownerId) filtered = filtered.filter((task) => task.ownerId === Number(ownerId))
  if (category) filtered = filtered.filter((task) => task.category === category)
  if (q) {
    const text = String(q).toLowerCase()
    filtered = filtered.filter((task) => [task.title, task.description, task.category].some((field) => field?.toLowerCase().includes(text)))
  }
  return filtered.map(enrichTask)
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'BuildFlow Ultimate API', version: '3.0.0' }))
app.get('/api/meta', (_req, res) => res.json({ statuses, team, priorities: ['Critique', 'Haute', 'Moyenne', 'Basse'], categories: [...new Set(tasks.map((task) => task.category).filter(Boolean))] }))
app.get('/api/activities', (_req, res) => res.json(activities))

app.get('/api/projects', (_req, res) => res.json(projects.map(enrichProject)))
app.get('/api/projects/:id', (req, res) => {
  const project = getProject(req.params.id)
  if (!project) return res.status(404).json({ message: 'Chantier introuvable' })
  res.json({ ...enrichProject(project), tasks: getFilteredTasks({ projectId: project.id }) })
})
app.post('/api/projects', (req, res) => {
  const { name, client, location, type, budget, startDate, endDate, managerId, riskLevel, description } = req.body
  if (!name || !client || !location) return res.status(400).json({ message: 'Nom, client et localisation sont obligatoires.' })
  const project = { id: nextId(projects), name, client, location, type: type || 'Chantier BTP', budget: Number(budget) || 0, startDate: startDate || today(), endDate: endDate || '', managerId: Number(managerId) || 1, riskLevel: riskLevel || 'Moyen', description: description || '' }
  projects.push(project)
  logActivity(`Nouveau chantier créé : ${project.name}`, 'success')
  res.status(201).json(enrichProject(project))
})
app.patch('/api/projects/:id', (req, res) => {
  const project = getProject(req.params.id)
  if (!project) return res.status(404).json({ message: 'Chantier introuvable' })
  Object.assign(project, { ...req.body, managerId: req.body.managerId ? Number(req.body.managerId) : project.managerId, budget: req.body.budget ? Number(req.body.budget) : project.budget })
  logActivity(`Chantier mis à jour : ${project.name}`, 'info')
  res.json(enrichProject(project))
})
app.delete('/api/projects/:id', (req, res) => {
  const project = getProject(req.params.id)
  if (!project) return res.status(404).json({ message: 'Chantier introuvable' })
  projects = projects.filter((item) => item.id !== Number(req.params.id))
  tasks = tasks.filter((task) => task.projectId !== Number(req.params.id))
  logActivity(`Chantier supprimé : ${project.name}`, 'warning')
  res.status(204).send()
})

app.get('/api/tasks', (req, res) => res.json(getFilteredTasks(req.query)))
app.get('/api/tasks/:id', (req, res) => {
  const task = getTask(req.params.id)
  if (!task) return res.status(404).json({ message: 'Tâche introuvable' })
  res.json(enrichTask(task))
})
app.post('/api/tasks', (req, res) => {
  const { projectId, title, description, ownerId, dueDate, priority, status, category, estimatedHours } = req.body
  if (!projectId || !title || !ownerId || !dueDate) return res.status(400).json({ message: 'Chantier, titre, responsable et échéance sont obligatoires.' })
  const task = { id: nextId(tasks), projectId: Number(projectId), title, description: description || '', ownerId: Number(ownerId), dueDate, priority: priority || 'Moyenne', status: status || 'todo', category: category || 'Général', estimatedHours: Number(estimatedHours) || 1, checklist: [], comments: [] }
  tasks.push(task)
  logActivity(`Nouvelle tâche : ${task.title}`, 'success')
  res.status(201).json(enrichTask(task))
})
app.patch('/api/tasks/:id', (req, res) => {
  const task = getTask(req.params.id)
  if (!task) return res.status(404).json({ message: 'Tâche introuvable' })
  const previousStatus = task.status
  Object.assign(task, { ...req.body, projectId: req.body.projectId ? Number(req.body.projectId) : task.projectId, ownerId: req.body.ownerId ? Number(req.body.ownerId) : task.ownerId, estimatedHours: req.body.estimatedHours ? Number(req.body.estimatedHours) : task.estimatedHours })
  if (req.body.status && req.body.status !== previousStatus) logActivity(`Tâche déplacée : ${task.title} → ${statuses.find((s) => s.key === task.status)?.label || task.status}`, 'info')
  else logActivity(`Tâche mise à jour : ${task.title}`, 'info')
  res.json(enrichTask(task))
})
app.delete('/api/tasks/:id', (req, res) => {
  const task = getTask(req.params.id)
  if (!task) return res.status(404).json({ message: 'Tâche introuvable' })
  tasks = tasks.filter((item) => item.id !== Number(req.params.id))
  logActivity(`Tâche supprimée : ${task.title}`, 'warning')
  res.status(204).send()
})
app.post('/api/tasks/:id/comments', (req, res) => {
  const task = getTask(req.params.id)
  if (!task) return res.status(404).json({ message: 'Tâche introuvable' })
  if (!req.body.message) return res.status(400).json({ message: 'Le commentaire est vide.' })
  const comment = { id: Date.now(), author: req.body.author || 'Utilisateur BuildFlow', message: req.body.message, createdAt: today() }
  task.comments.push(comment)
  logActivity(`Commentaire ajouté sur : ${task.title}`, 'info')
  res.status(201).json(comment)
})
app.post('/api/tasks/:id/checklist', (req, res) => {
  const task = getTask(req.params.id)
  if (!task) return res.status(404).json({ message: 'Tâche introuvable' })
  const label = String(req.body.label || '').trim()
  if (!label) return res.status(400).json({ message: 'Le libellé est obligatoire.' })
  const item = { id: Date.now(), label, done: false }
  task.checklist.push(item)
  res.status(201).json(item)
})
app.patch('/api/tasks/:id/checklist/:itemId', (req, res) => {
  const task = getTask(req.params.id)
  if (!task) return res.status(404).json({ message: 'Tâche introuvable' })
  const item = task.checklist.find((entry) => entry.id === Number(req.params.itemId))
  if (!item) return res.status(404).json({ message: 'Élément introuvable' })
  Object.assign(item, req.body)
  res.json(item)
})

app.get('/api/stats', (_req, res) => {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'done').length
  const blocked = tasks.filter((task) => task.status === 'blocked').length
  const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done').length
  const critical = tasks.filter((task) => ['Critique', 'Haute'].includes(task.priority) && task.status !== 'done').length
  res.json({
    projects: projects.length,
    tasks: total,
    done,
    blocked,
    overdue,
    critical,
    estimatedHours: tasks.reduce((sum, task) => sum + (Number(task.estimatedHours) || 0), 0),
    progress: total ? Math.round((done / total) * 100) : 0,
    byStatus: statuses.map((status) => ({ ...status, count: tasks.filter((task) => task.status === status.key).length })),
    byProject: projects.map((project) => ({ id: project.id, name: project.name, progress: computeProjectProgress(project.id), blocked: tasks.filter((task) => task.projectId === project.id && task.status === 'blocked').length })),
    workload: team.map((member) => ({ ...member, tasks: tasks.filter((task) => task.ownerId === member.id && task.status !== 'done').length, hours: tasks.filter((task) => task.ownerId === member.id && task.status !== 'done').reduce((sum, task) => sum + (Number(task.estimatedHours) || 0), 0) }))
  })
})

app.post('/api/reset', (_req, res) => {
  projects = structuredClone(seedProjects)
  tasks = structuredClone(seedTasks)
  activities = []
  logActivity('Données réinitialisées.', 'success')
  res.json({ message: 'Données réinitialisées.' })
})

app.listen(PORT, () => console.log(`BuildFlow Ultimate API disponible sur http://localhost:${PORT}`))
