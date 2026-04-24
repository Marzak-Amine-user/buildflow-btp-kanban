<template>
  <section class="page-header"><div><span class="eyebrow">Planning</span><h1>Vue planning chantier</h1><p>Timeline simplifiée pour repérer les échéances, les retards et les charges de la semaine.</p></div><RouterLink class="button ghost" to="/reports">Export reporting</RouterLink></section>
  <section class="filters-bar compact-filter"><label>Recherche<input v-model="q" placeholder="Tâche, chantier, responsable..." /></label><label>Priorité<select v-model="priority"><option value="">Toutes</option><option>Critique</option><option>Haute</option><option>Moyenne</option><option>Basse</option></select></label><button class="button ghost" @click="load">Rafraîchir</button></section>
  <section class="panel planning-list">
    <div v-for="task in sortedTasks" :key="task.id" class="planning-row" :class="{ overdue: task.overdue }">
      <div><strong>{{ formatDate(task.dueDate) }}</strong><small>{{ task.overdue ? 'En retard' : statusLabel(task.status) }}</small></div>
      <div><RouterLink :to="`/tasks/${task.id}`">{{ task.title }}</RouterLink><p>{{ task.projectName }} · {{ task.ownerName }}</p></div>
      <span class="priority" :class="priorityClass(task.priority)">{{ task.priority }}</span>
      <div class="timeline-bar"><span :style="{ width: `${task.status === 'done' ? 100 : task.checklistProgress || 25}%` }"></span></div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../services/api'
import { formatDate, priorityClass, statusLabel } from '../utils/format'
const tasks = ref([]); const q = ref(''); const priority = ref('')
const sortedTasks = computed(() => tasks.value
  .filter((task) => !priority.value || task.priority === priority.value)
  .filter((task) => !q.value || [task.title, task.projectName, task.ownerName].join(' ').toLowerCase().includes(q.value.toLowerCase()))
  .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)))
async function load(){ tasks.value = await api.getTasks() }
onMounted(load)
</script>
