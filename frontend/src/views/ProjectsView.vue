<template>
  <section class="page-header">
    <div><span class="eyebrow">Portefeuille</span><h1>Projets / Chantiers</h1><p>Liste professionnelle des chantiers avec avancement, risque, budget, retards, blocages et accès rapide au Kanban.</p></div>
    <button class="button primary" @click="showForm = !showForm">{{ showForm ? 'Masquer' : '+ Nouveau chantier' }}</button>
  </section>

  <form v-if="showForm" class="panel project-form" @submit.prevent="createProject">
    <div class="form-grid">
      <label>Nom *<input v-model.trim="projectForm.name" /></label>
      <label>Client *<input v-model.trim="projectForm.client" /></label>
      <label>Ville *<input v-model.trim="projectForm.location" /></label>
      <label>Type<input v-model.trim="projectForm.type" /></label>
      <label>Budget<input v-model.number="projectForm.budget" type="number" /></label>
      <label>Chef de projet<select v-model="projectForm.managerId"><option v-for="member in team" :key="member.id" :value="member.id">{{ member.name }}</option></select></label>
      <label>Risque<select v-model="projectForm.riskLevel"><option>Faible</option><option>Moyen</option><option>Élevé</option></select></label>
      <label>Date début<input v-model="projectForm.startDate" type="date" /></label>
      <label>Date fin<input v-model="projectForm.endDate" type="date" /></label>
      <label class="wide">Description<textarea v-model.trim="projectForm.description"></textarea></label>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <button class="button primary">Créer le chantier</button>
  </form>

  <section class="filters-bar compact-filter">
    <label>Recherche<input v-model="search" placeholder="Nom, ville, client..." /></label>
    <label>Risque<select v-model="risk"><option value="">Tous</option><option>Faible</option><option>Moyen</option><option>Élevé</option></select></label>
    <label>Tri<select v-model="sort"><option value="progress">Avancement</option><option value="blocked">Blocages</option><option value="budget">Budget</option><option value="name">Nom</option></select></label>
    <button class="button ghost" @click="load">Rafraîchir</button>
  </section>

  <section class="projects-grid">
    <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { api } from '../services/api'
import ProjectCard from '../components/ProjectCard.vue'
const projects = ref([]); const team = ref([]); const showForm = ref(false); const error = ref('')
const search = ref(''); const risk = ref(''); const sort = ref('progress')
const projectForm = reactive({ name:'', client:'', location:'', type:'Chantier BTP', budget:0, riskLevel:'Moyen', startDate:'', endDate:'', managerId:1, description:'' })
const filteredProjects = computed(() => {
  const query = search.value.toLowerCase()
  return projects.value
    .filter((project) => !risk.value || project.riskLevel === risk.value)
    .filter((project) => !query || [project.name, project.client, project.location, project.type].some((field) => field?.toLowerCase().includes(query)))
    .sort((a, b) => sort.value === 'name' ? a.name.localeCompare(b.name) : sort.value === 'budget' ? b.budget - a.budget : sort.value === 'blocked' ? b.blockedCount - a.blockedCount : b.progress - a.progress)
})
async function load(){ projects.value = await api.getProjects(); const meta = await api.getMeta(); team.value = meta.team }
async function createProject(){
  error.value = ''
  if (!projectForm.name || !projectForm.client || !projectForm.location) { error.value = 'Nom, client et ville sont obligatoires.'; return }
  await api.createProject(projectForm)
  Object.assign(projectForm,{ name:'', client:'', location:'', type:'Chantier BTP', budget:0, riskLevel:'Moyen', startDate:'', endDate:'', managerId:1, description:'' })
  showForm.value=false
  await load()
}
onMounted(load)
</script>
