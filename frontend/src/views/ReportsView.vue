<template>
  <section class="page-header">
    <div><span class="eyebrow">Reporting</span><h1>Suivi & export</h1><p>Analyse des tâches, charge estimée, retards, blocages et export CSV pour le compte-rendu de chantier.</p></div>
    <div class="header-actions"><button class="button ghost" @click="printPage">Imprimer</button><button class="button primary" @click="exportCsv">Exporter CSV</button></div>
  </section>

  <section class="stats-grid">
    <StatCard icon="tasks" label="Tâches" :value="stats.tasks || 0" />
    <StatCard icon="blocked" label="Blocages" :value="stats.blocked || 0" tone="red" />
    <StatCard icon="clock" label="Retards" :value="stats.overdue || 0" tone="red" />
    <StatCard icon="hours" label="Charge" :value="`${stats.estimatedHours || 0}h`" />
  </section>

  <section class="two-columns">
    <article class="panel"><div class="section-title"><h2>Répartition statuts</h2></div><div class="status-list"><div v-for="status in stats.byStatus || []" :key="status.key" class="status-row"><span class="column-dot" :style="{ background: status.color }"></span><strong>{{ status.label }}</strong><em>{{ status.count }}</em></div></div></article>
    <article class="panel"><div class="section-title"><h2>Charge par collaborateur</h2></div><div class="status-list"><div v-for="member in stats.workload || []" :key="member.id" class="status-row"><span class="avatar small">{{ initials(member.name) }}</span><strong>{{ member.name }}</strong><em>{{ member.tasks }} tâche(s) · {{ member.hours }}h</em></div></div></article>
  </section>

  <section class="panel table-panel">
    <div class="section-title"><h2>Liste détaillée</h2><input v-model="q" placeholder="Filtrer le tableau..." /></div>
    <table>
      <thead><tr><th>Tâche</th><th>Chantier</th><th>Responsable</th><th>Priorité</th><th>Statut</th><th>Échéance</th><th>Charge</th></tr></thead>
      <tbody><tr v-for="task in filtered" :key="task.id"><td><RouterLink :to="`/tasks/${task.id}`">{{ task.title }}</RouterLink></td><td>{{ task.projectName }}</td><td>{{ task.ownerName }}</td><td>{{ task.priority }}</td><td>{{ statusLabel(task.status) }}</td><td>{{ formatDate(task.dueDate) }}</td><td>{{ task.estimatedHours }}h</td></tr></tbody>
    </table>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../services/api'
import { formatDate, initials, statusLabel } from '../utils/format'
import StatCard from '../components/StatCard.vue'
const stats = ref({}); const tasks = ref([]); const q = ref('')
const filtered = computed(() => tasks.value.filter((task) => !q.value || [task.title, task.projectName, task.ownerName, task.priority, statusLabel(task.status)].join(' ').toLowerCase().includes(q.value.toLowerCase())))
async function load(){ stats.value = await api.getStats(); tasks.value = await api.getTasks() }
function printPage(){ window.print() }
function exportCsv(){
  const rows = [['Tâche','Chantier','Responsable','Priorité','Statut','Échéance','Charge'], ...filtered.value.map((task) => [task.title, task.projectName, task.ownerName, task.priority, statusLabel(task.status), task.dueDate, task.estimatedHours])]
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"','""')}"`).join(';')).join('\n')
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='buildflow-reporting.csv'; a.click(); URL.revokeObjectURL(url)
}
onMounted(load)
</script>
