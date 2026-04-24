<template>
  <form class="filters-bar" @submit.prevent>
    <label>Recherche<input v-model="model.q" type="search" placeholder="Titre, description, catégorie..." /></label>
    <label>Statut<select v-model="model.status"><option value="">Tous</option><option v-for="status in statuses" :key="status.key" :value="status.key">{{ status.label }}</option></select></label>
    <label>Priorité<select v-model="model.priority"><option value="">Toutes</option><option>Critique</option><option>Haute</option><option>Moyenne</option><option>Basse</option></select></label>
    <label>Responsable<select v-model="model.ownerId"><option value="">Tous</option><option v-for="member in team" :key="member.id" :value="member.id">{{ member.name }}</option></select></label>
    <button type="button" class="button ghost" @click="$emit('reset')">Réinitialiser</button>
  </form>
</template>

<script setup>
const model = defineModel({ type: Object, required: true })
defineProps({ team: { type: Array, default: () => [] }, statuses: { type: Array, default: () => [] } })
defineEmits(['reset'])
</script>
