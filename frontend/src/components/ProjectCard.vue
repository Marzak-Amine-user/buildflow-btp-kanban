<template>
  <article class="project-card">
    <div class="card-topline">
      <span class="tag">{{ project.type }}</span>
      <span class="risk" :class="riskClass">Risque {{ project.riskLevel }}</span>
    </div>

    <h3>{{ project.name }}</h3>
    <p class="muted">{{ project.description }}</p>

    <div class="project-meta">
      <span><IconSymbol name="location" /> {{ project.location }}</span>
      <span><IconSymbol name="user" /> {{ project.manager?.name }}</span>
      <span><IconSymbol name="budget" /> {{ formatCurrency(project.budget) }}</span>
      <span><IconSymbol name="tasks" /> {{ project.taskCount }} tâches</span>
      <span><IconSymbol name="blocked" tone="red" /> {{ project.blockedCount }} blocage(s)</span>
      <span><IconSymbol name="clock" tone="orange" /> {{ project.overdueCount }} retard(s)</span>
    </div>

    <div class="progress-line"><div class="progress-bar" :style="{ width: `${project.progress}%` }"></div></div>
    <div class="between"><small>{{ project.progress }}% terminé</small><small>{{ project.doneCount }}/{{ project.taskCount }} tâches</small></div>

    <RouterLink class="button primary full" :to="`/kanban/${project.id}`">Ouvrir le Kanban</RouterLink>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'
import IconSymbol from './IconSymbol.vue'

const props = defineProps({ project: { type: Object, required: true } })
const riskClass = computed(() => ({ low: props.project.riskLevel === 'Faible', medium: props.project.riskLevel === 'Moyen', high: props.project.riskLevel === 'Élevé' }))
</script>
