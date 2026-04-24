<template>
  <form class="task-form" @submit.prevent="submit">
    <div class="section-title">
      <div><h2>{{ compact ? 'Ajout rapide' : 'Nouvelle tâche chantier' }}</h2><p class="muted">Tâche structurée avec responsable, priorité et échéance.</p></div>
    </div>

    <div class="form-grid">
      <label>Chantier *<select v-model="form.projectId"><option value="">Sélectionner</option><option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option></select></label>
      <label>Responsable *<select v-model="form.ownerId"><option value="">Sélectionner</option><option v-for="member in team" :key="member.id" :value="member.id">{{ member.name }} — {{ member.role }}</option></select></label>
      <label class="wide">Titre *<input v-model.trim="form.title" placeholder="Ex. Contrôler les réservations béton" /></label>
      <label v-if="!compact" class="wide">Description<textarea v-model.trim="form.description" rows="3" placeholder="Objectif, contraintes, livrables attendus..."></textarea></label>
      <label>Échéance *<input v-model="form.dueDate" type="date" /></label>
      <label>Priorité<select v-model="form.priority"><option>Critique</option><option>Haute</option><option>Moyenne</option><option>Basse</option></select></label>
      <label>Statut<select v-model="form.status"><option value="todo">À faire</option><option value="progress">En cours</option><option value="blocked">Bloqué</option><option value="done">Terminé</option></select></label>
      <label>Catégorie<input v-model.trim="form.category" placeholder="Sécurité, Gros œuvre..." /></label>
      <label>Charge prévue<input v-model.number="form.estimatedHours" type="number" min="1" /></label>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <div class="form-actions"><button class="button ghost" type="button" @click="reset">Réinitialiser</button><button class="button primary" type="submit">Créer la tâche</button></div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
const props = defineProps({ projects: { type: Array, default: () => [] }, team: { type: Array, default: () => [] }, defaultProjectId: { type: [String, Number], default: '' }, compact: { type: Boolean, default: false } })
const emit = defineEmits(['create'])
const error = ref('')
const initialForm = () => ({ projectId: props.defaultProjectId || '', ownerId: '', title: '', description: '', dueDate: '', priority: 'Moyenne', status: 'todo', category: 'Général', estimatedHours: 2 })
const form = reactive(initialForm())
watch(() => props.defaultProjectId, () => { form.projectId = props.defaultProjectId || form.projectId })
function reset() { Object.assign(form, initialForm()); error.value = '' }
function submit() {
  if (!form.projectId || !form.ownerId || !form.title || !form.dueDate) { error.value = 'Merci de compléter le chantier, le responsable, le titre et l’échéance.'; return }
  emit('create', { ...form })
  reset()
}
</script>
