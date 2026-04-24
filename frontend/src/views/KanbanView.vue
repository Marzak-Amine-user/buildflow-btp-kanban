<template>
  <section v-if="project" class="page-header kanban-top">
    <div><span class="eyebrow">Kanban chantier</span><h1>{{ project.name }}</h1><p>{{ project.description }}</p></div>
    <div class="header-actions"><RouterLink class="button ghost" to="/projects">Retour</RouterLink><RouterLink class="button ghost" to="/planning">Planning</RouterLink></div>
  </section>

  <FiltersBar v-model="filters" :team="team" :statuses="statuses" @reset="resetFilters" />

  <section class="kanban-board">
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
    />
  </section>

  <TaskForm :projects="projects" :team="team" :default-project-id="Number(id)" :compact="false" @create="createTask" />
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
async function loadMeta(){ const meta = await api.getMeta(); statuses.value=meta.statuses; team.value=meta.team; projects.value=await api.getProjects(); project.value=await api.getProject(props.id) }
async function loadTasks(){ tasks.value = await api.getTasks(activeFilters.value) }
function tasksByStatus(status){ return tasks.value.filter(task => task.status === status) }
async function createTask(payload){ await api.createTask(payload); await loadTasks(); project.value=await api.getProject(props.id) }
async function changeStatus(task, status){ await api.updateTask(task.id, { status }); await loadTasks(); project.value=await api.getProject(props.id) }
async function dropTask(status){ if (!draggedTask.value || draggedTask.value.status === status) return; await changeStatus(draggedTask.value, status); draggedTask.value = null }
function resetFilters(){ Object.assign(filters,{q:'', status:'', priority:'', ownerId:''}) }
watch(filters, loadTasks, { deep:true })
onMounted(async()=>{ await loadMeta(); await loadTasks() })
</script>
