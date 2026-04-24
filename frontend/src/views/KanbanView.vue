<template>
  <section v-if="project" class="page-header kanban-top">
    <div><span class="eyebrow">Kanban chantier</span><h1>{{ project.name }}</h1><p>{{ project.description }}</p></div>
    <div class="header-actions"><RouterLink class="button ghost" to="/projects">Retour</RouterLink><RouterLink class="button ghost" to="/planning">Planning</RouterLink></div>
  </section>

  <FiltersBar v-model="filters" :team="team" :statuses="statuses" @reset="resetFilters" />

  <div v-if="error" class="error-state">{{ error }}</div>

  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>Chargement des tâches...</p>
  </div>

  <section v-else class="kanban-board">
    <KanbanColumn
      v-for="status in statuses"
      :key="status.key"
      :status-key="status.key"
      :title="status.label"
      :color="status.color"
      :tasks="tasksByStatus(status.key)"
      @drag-start="draggedTask = $event"
      @drop-task="dropTask"
      @status-change="changeStatus"
      @delete-task="deleteTask"
    />
  </section>

  <TaskForm :projects="projects" :team="team" :default-project-id="Number(id)" :compact="false" @create="createTask" />

  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { api } from '../services/api'
import KanbanColumn from '../components/KanbanColumn.vue'
import TaskForm from '../components/TaskForm.vue'
import FiltersBar from '../components/FiltersBar.vue'
const props = defineProps({ id: { type: String, required: true } })
const project = ref(null), projects = ref([]), tasks = ref([]), statuses = ref([]), team = ref([]), draggedTask = ref(null)
const filters = reactive({ q:'', status:'', priority:'', ownerId:'' })
const activeFilters = computed(() => ({ projectId: props.id, ...filters }))

const isLoading = ref(false)
const error = ref(null)
const toasts = ref([])

function addToast(message, type = 'success') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

async function loadMeta(){ 
  try {
    const meta = await api.getMeta(); statuses.value=meta.statuses; team.value=meta.team; projects.value=await api.getProjects(); project.value=await api.getProject(props.id) 
  } catch(err) {
    error.value = "Impossible de charger les données du projet."
  }
}

async function loadTasks(){ 
  isLoading.value = true
  error.value = null
  try {
    tasks.value = await api.getTasks(activeFilters.value) 
  } catch(err) {
    error.value = "Impossible de charger les tâches."
  } finally {
    isLoading.value = false
  }
}

function tasksByStatus(status){ return tasks.value.filter(task => task.status === status) }

async function createTask(payload){ 
  try {
    await api.createTask(payload); await loadTasks(); project.value=await api.getProject(props.id)
    addToast('Tâche créée avec succès !')
  } catch (err) {
    addToast('Erreur lors de la création de la tâche', 'error')
  }
}

async function changeStatus(task, status){ 
  try {
    await api.updateTask(task.id, { status }); await loadTasks(); project.value=await api.getProject(props.id) 
    addToast('Statut mis à jour avec succès !')
  } catch (err) {
    addToast('Erreur lors de la mise à jour', 'error')
  }
}

async function deleteTask(task){ 
  try {
    await api.deleteTask(task.id); await loadTasks(); project.value=await api.getProject(props.id) 
    addToast('Tâche supprimée avec succès !')
  } catch (err) {
    addToast('Erreur lors de la suppression', 'error')
  }
}
async function dropTask(status){ if (!draggedTask.value || draggedTask.value.status === status) return; await changeStatus(draggedTask.value, status); draggedTask.value = null }
function resetFilters(){ Object.assign(filters,{q:'', status:'', priority:'', ownerId:''}) }
watch(filters, loadTasks, { deep:true })
onMounted(async()=>{ await loadMeta(); await loadTasks() })
</script>
