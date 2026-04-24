<template>
  <article class="stat-card" :class="tone">
    <IconSymbol :name="icon" :tone="tone" />
    <div>
      <p>{{ label }}</p>
      <strong>{{ value }}</strong>
      <small v-if="hint">{{ hint }}</small>
    </div>
  </article>
</template>

<script setup>
import IconSymbol from './IconSymbol.vue'

defineProps({
  icon: { type: String, default: 'default' },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  tone: { type: String, default: 'blue' }
})
</script>
