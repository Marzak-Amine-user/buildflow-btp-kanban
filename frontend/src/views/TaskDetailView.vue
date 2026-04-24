<template>
  <RouterLink class="back-link" :to="task?.projectId ? `/kanban/${task.projectId}` : '/projects'">← Retour au Kanban</RouterLink>
  <section v-if="task" class="task-detail">
    <article class="panel detail-main">
      <div class="section-title">
        <div><span class="eyebrow">Détail tâche</span><h1>{{ task.title }}</h1><p class="muted">{{ task.description || 'Aucune description renseignée.' }}</p></div>
        <div class="status-actions"><button class="button ghost" @click="editMode = !editMode">{{ editMode ? 'Fermer' : 'Modifier' }}</button><button class="button danger" @click="removeTask">Supprimer</button></div>
      </div>

      <div class="detail-grid">
        <span><strong>Chantier</strong>{{ task.projectName }}</span>
        <span><strong>Responsable</strong>{{ task.ownerName }} — {{ task.ownerRole }}</span>
        <span><strong>Statut</strong>{{ statusLabel(task.status) }}</span>
        <span><strong>Priorité</strong>{{ task.priority }}</span>
        <span><strong>Échéance</strong>{{ formatDate(task.dueDate) }}</span>
        <span><strong>Charge</strong>{{ task.estimatedHours }}h prévues</span>
      </div>

      <form v-if="editMode" class="edit-panel" @submit.prevent="saveTask">
        <div class="form-grid">
          <label class="wide">Titre<input v-model.trim="edit.title" /></label>
          <label class="wide">Description<textarea v-model.trim="edit.description"></textarea></label>
          <label class="wide">Notes / Commentaires<textarea v-model.trim="edit.notes"></textarea></label>
          <label>Statut<select v-model="edit.status"><option value="todo">À faire</option><option value="progress">En cours</option><option value="blocked">Bloqué</option><option value="done">Terminé</option></select></label>
          <label>Priorité<select v-model="edit.priority"><option>Critique</option><option>Haute</option><option>Moyenne</option><option>Basse</option></select></label>
          <label>Échéance<input v-model="edit.dueDate" type="date" /></label>
          <label>Charge<input v-model.number="edit.estimatedHours" type="number" min="1" /></label>
        </div>
        <button class="button primary">Enregistrer</button>
      </form>
    </article>

    <article class="panel">
      <div class="section-title"><h2>Notes de chantier</h2></div>
      <div v-if="!editNotesMode">
        <p style="white-space: pre-wrap; line-height: 1.6;">{{ task.notes || 'Aucune note de chantier pour le moment.' }}</p>
        <button class="button ghost mini" @click="editNotesMode = true; edit.notes = task.notes || ''" style="margin-top: 1rem;">Modifier les notes</button>
      </div>
      <form v-else @submit.prevent="saveNotes" style="display: grid; gap: 0.8rem;">
        <textarea v-model.trim="edit.notes" placeholder="Saisissez vos notes ici..." style="width: 100%; min-height: 120px; resize: vertical;"></textarea>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button type="button" class="button ghost" @click="editNotesMode = false">Annuler</button>
          <button type="submit" class="button primary">Enregistrer les notes</button>
        </div>
      </form>
    </article>

    <article class="panel">
      <div class="section-title"><h2>Checklist qualité / exécution</h2><strong>{{ task.checklistProgress }}%</strong></div>
      <div class="mini-progress"><div :style="{ width: `${task.checklistProgress}%` }"></div></div>
      <label v-for="item in task.checklist" :key="item.id" class="check-item"><input type="checkbox" :checked="item.done" @change="toggleChecklist(item, $event.target.checked)" />{{ item.label }}</label>
      <form class="comment-form" @submit.prevent="addChecklist"><input v-model.trim="newChecklist" placeholder="Nouvel élément de checklist" /><button class="button ghost">Ajouter</button></form>
    </article>

    <article class="panel">
      <div class="section-title"><h2>Commentaires chantier</h2><small>{{ task.comments?.length || 0 }} message(s)</small></div>
      <div v-for="comment in task.comments" :key="comment.id" class="comment"><strong>{{ comment.author }}</strong><small>{{ formatDate(comment.createdAt) }}</small><p>{{ comment.message }}</p></div>
      <form class="comment-form" @submit.prevent="addComment"><input v-model.trim="newComment" placeholder="Ajouter un commentaire..." /><button class="button primary">Envoyer</button></form>
    </article>
  </section>
  <p v-else class="empty-state">Chargement de la tâche...</p>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { formatDate, statusLabel } from '../utils/format'
const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const task = ref(null); const editMode = ref(false); const editNotesMode = ref(false); const newComment = ref(''); const newChecklist = ref('')
const edit = reactive({ title:'', description:'', status:'todo', priority:'Moyenne', dueDate:'', estimatedHours:1, notes:'' })
function syncEdit(){ Object.assign(edit, { title: task.value.title, description: task.value.description, status: task.value.status, priority: task.value.priority, dueDate: task.value.dueDate, estimatedHours: task.value.estimatedHours, notes: task.value.notes || '' }) }
async function load(){ task.value = await api.getTask(props.id); syncEdit() }
async function saveTask(){ task.value = await api.updateTask(props.id, edit); editMode.value=false; await load() }
async function saveNotes(){ await api.updateTask(props.id, { notes: edit.notes }); editNotesMode.value=false; await load() }
async function removeTask(){ if (!confirm('Supprimer définitivement cette tâche ?')) return; await api.deleteTask(props.id); router.push(task.value?.projectId ? `/kanban/${task.value.projectId}` : '/projects') }
async function addComment(){ if (!newComment.value) return; await api.addComment(props.id, { author:'Utilisateur BuildFlow', message:newComment.value }); newComment.value=''; await load() }
async function addChecklist(){ if (!newChecklist.value) return; await api.addChecklistItem(props.id, { label:newChecklist.value }); newChecklist.value=''; await load() }
async function toggleChecklist(item, done){ await api.updateChecklistItem(props.id, item.id, { done }); await load() }
onMounted(load)
</script>
