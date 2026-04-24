<template>
  <section class="kanban-column" @dragover.prevent @drop="$emit('drop-task', statusKey)">
    <header>
      <div>
        <h2>{{ title }}</h2>
        <small>{{ tasks.length }} tâche(s)</small>
      </div>
      <span class="column-dot" :style="{ background: color }"></span>
    </header>

    <div class="task-stack">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @drag-start="$emit('drag-start', task)"
        @status-change="(task, status) => $emit('status-change', task, status)"
      />
      <p v-if="!tasks.length" class="empty-state">Déposez une tâche ici ou changez son statut.</p>
    </div>
  </section>
</template>

<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  title: { type: String, required: true },
  statusKey: { type: String, required: true },
  color: { type: String, default: '#64748b' },
  tasks: { type: Array, default: () => [] }
})
defineEmits(['status-change', 'drag-start', 'drop-task'])
</script>
