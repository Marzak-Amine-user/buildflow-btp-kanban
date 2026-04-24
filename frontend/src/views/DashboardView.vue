<template>
  <section class="hero-panel">
    <div>
      <span class="eyebrow">Pilotage chantier</span>
      <h1>BuildFlow </h1>
      <p>dashboard, Kanban drag & drop, chantiers, tâches, reporting, planning, commentaires, checklist et thème sombre.</p>
      <div class="hero-actions">
        <RouterLink class="button primary" to="/projects">Voir les chantiers</RouterLink>
        <RouterLink class="button ghost" to="/planning">Voir le planning</RouterLink>
      </div>
    </div>
    <div class="hero-card">
      <strong>{{ stats.progress || 0 }}%</strong>
      <span>avancement global</span>
      <div class="progress-line"><div class="progress-bar" :style="{ width: `${stats.progress || 0}%` }"></div></div>
      <small>{{ stats.done || 0 }} tâches terminées sur {{ stats.tasks || 0 }}</small>
    </div>
  </section>

  <section class="stats-grid">
    <StatCard icon="site" label="Chantiers" :value="stats.projects || 0" hint="portefeuille actif" tone="blue" />
    <StatCard icon="tasks" label="Tâches" :value="stats.tasks || 0" hint="toutes priorités" tone="orange" />
    <StatCard icon="blocked" label="Blocages" :value="stats.blocked || 0" hint="action requise" tone="red" />
    <StatCard icon="clock" label="Retards" :value="stats.overdue || 0" hint="à replanifier" tone="red" />
    <StatCard icon="priority" label="Critiques" :value="stats.critical || 0" hint="haute priorité" tone="orange" />
    <StatCard icon="hours" label="Charge" :value="`${stats.estimatedHours || 0}h`" hint="estimation totale" tone="blue" />
    <StatCard icon="check" label="Terminées" :value="stats.done || 0" hint="livrables validés" tone="green" />
    <StatCard icon="trend" label="Avancement" :value="`${stats.progress || 0}%`" hint="calculé sur les statuts" tone="green" />
  </section>

  <section class="dashboard-grid">
    <article class="panel">
      <div class="section-title"><h2>Avancement par chantier</h2><RouterLink to="/projects">Portefeuille</RouterLink></div>
      <div class="status-list">
        <RouterLink v-for="project in stats.byProject || []" :key="project.id" :to="`/kanban/${project.id}`" class="project-progress-row">
          <div class="between"><strong>{{ project.name }}</strong><span>{{ project.progress }}%</span></div>
          <div class="progress-line"><div class="progress-bar" :style="{ width: `${project.progress}%` }"></div></div>
          <small v-if="project.blocked" class="danger">{{ project.blocked }} blocage(s)</small>
        </RouterLink>
      </div>
    </article>

    <article class="panel">
      <div class="section-title"><h2>Activité récente</h2><button class="button ghost mini" @click="load">Rafraîchir</button></div>
      <div class="timeline">
        <div v-for="activity in activities" :key="activity.id" class="timeline-item" :class="activity.type">
          <span></span>
          <div><strong>{{ activity.message }}</strong><small>{{ formatDate(activity.createdAt) }}</small></div>
        </div>
      </div>
    </article>
  </section>

  <section class="panel">
    <div class="section-title"><h2>Tâches critiques et bloquées</h2><RouterLink to="/reports">Analyse complète</RouterLink></div>
    <div class="cards-grid">
      <TaskCard v-for="task in criticalTasks" :key="task.id" :task="task" @status-change="changeStatus" @delete-task="deleteTask" />
      <p v-if="!criticalTasks.length" class="empty-state">Aucune tâche critique en cours.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../services/api'
import { formatDate } from '../utils/format'
import StatCard from '../components/StatCard.vue'
import TaskCard from '../components/TaskCard.vue'

const stats = ref({})
const tasks = ref([])
const activities = ref([])
const criticalTasks = computed(() => tasks.value.filter((task) => (['Critique', 'Haute'].includes(task.priority) || task.status === 'blocked') && task.status !== 'done').slice(0, 6))
async function load() {
  stats.value = await api.getStats()
  tasks.value = await api.getTasks()
  activities.value = await api.getActivities()
}
async function changeStatus(task, status) {
  await api.updateTask(task.id, { status })
  await load()
}
async function deleteTask(task) {
  await api.deleteTask(task.id)
  await load()
}
onMounted(load)
</script>
