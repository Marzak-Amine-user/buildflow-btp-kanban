<template>
  <section class="page-header"><div><span class="eyebrow">Ressources</span><h1>Équipe projet</h1><p>Profils BTP, coordonnées et charge active par collaborateur.</p></div></section>
  <section class="team-grid">
    <article v-for="member in enrichedTeam" :key="member.id" class="team-card">
      <span class="avatar">{{ initials(member.name) }}</span>
      <h2>{{ member.name }}</h2>
      <p>{{ member.role }}</p>
      <span>✉️ {{ member.email }}</span>
      <span>📞 {{ member.phone }}</span>
      <div class="progress-line"><div class="progress-bar" :style="{ width: `${Math.min(member.hours * 4, 100)}%` }"></div></div>
      <strong>{{ member.tasks }} tâche(s) active(s) · {{ member.hours }}h</strong>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../services/api'
import { initials } from '../utils/format'
const team = ref([]); const workload = ref([])
const enrichedTeam = computed(() => team.value.map((member) => ({ ...member, ...(workload.value.find((item) => item.id === member.id) || { tasks:0, hours:0 }) })))
async function load(){ const meta = await api.getMeta(); const stats = await api.getStats(); team.value = meta.team; workload.value = stats.workload || [] }
onMounted(load)
</script>
