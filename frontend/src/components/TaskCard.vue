<template>
  <article
    class="task-card"
    :class="{ overdue: isOverdue(task.dueDate, task.status), done: task.status === 'done' }"
    draggable="true"
    @dragstart="$emit('drag-start', task)"
  >
    <div class="card-topline">
      <span class="priority" :class="priorityClass(task.priority)">{{ task.priority }}</span>
      <span class="tag slim">{{ task.category }}</span>
    </div>

    <RouterLink :to="`/tasks/${task.id}`" class="task-title">{{ task.title }}</RouterLink>
    <p class="muted compact">{{ task.description }}</p>

    <div class="task-info">
      <span><IconSymbol name="site" /> {{ task.projectName }}</span>
      <span><IconSymbol name="user" /> {{ task.ownerName }}</span>
      <span :class="{ danger: isOverdue(task.dueDate, task.status) }"><IconSymbol name="calendar" /> {{ formatDate(task.dueDate) }}</span>
      <span><IconSymbol name="hours" /> {{ task.estimatedHours }}h</span>
    </div>

    <div v-if="task.checklist?.length" class="mini-progress" :title="`${task.checklistProgress}% checklist`">
      <div :style="{ width: `${task.checklistProgress}%` }"></div>
    </div>

    <div class="task-actions">
      <button v-if="task.status !== 'todo'" @click="$emit('status-change', task, 'todo')">À faire</button>
      <button v-if="task.status !== 'progress'" @click="$emit('status-change', task, 'progress')">En cours</button>
      <button v-if="task.status !== 'blocked'" @click="$emit('status-change', task, 'blocked')">Bloquer</button>
      <button v-if="task.status !== 'done'" @click="$emit('status-change', task, 'done')">Terminer</button>
    </div>
  </article>
</template>

<script setup>
import { formatDate, isOverdue, priorityClass } from '../utils/format'
import IconSymbol from './IconSymbol.vue'

defineProps({ task: { type: Object, required: true } })
defineEmits(['status-change', 'drag-start'])
</script>
