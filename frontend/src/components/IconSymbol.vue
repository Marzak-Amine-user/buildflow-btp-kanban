<template>
  <span class="ui-icon" :class="tone" aria-hidden="true">
    <svg v-if="name === 'site'" viewBox="0 0 24 24"><path d="M4 20V8l8-4 8 4v12"/><path d="M8 20v-7h8v7"/><path d="M4 11h16"/></svg>
    <svg v-else-if="name === 'tasks'" viewBox="0 0 24 24"><path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><path d="M4 6h.01"/><path d="M4 12h.01"/><path d="M4 18h.01"/></svg>
    <svg v-else-if="name === 'blocked'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8.5 8.5l7 7"/></svg>
    <svg v-else-if="name === 'clock'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>
    <svg v-else-if="name === 'priority'" viewBox="0 0 24 24"><path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/></svg>
    <svg v-else-if="name === 'check'" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
    <svg v-else-if="name === 'trend'" viewBox="0 0 24 24"><path d="M4 17 10 11l4 4 6-8"/><path d="M14 7h6v6"/></svg>
    <svg v-else-if="name === 'location'" viewBox="0 0 24 24"><path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
    <svg v-else-if="name === 'user'" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 4.3-6 8-6s6.4 2 8 6"/></svg>
    <svg v-else-if="name === 'budget'" viewBox="0 0 24 24"><path d="M5 7h11a4 4 0 0 1 0 8H5"/><path d="M5 11h10"/><path d="M5 5v14"/></svg>
    <svg v-else-if="name === 'calendar'" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>
    <svg v-else-if="name === 'hours'" viewBox="0 0 24 24"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="8"/></svg>
    <svg v-else viewBox="0 0 24 24"><rect x="5" y="5" width="6" height="6" rx="1.5"/><rect x="13" y="5" width="6" height="6" rx="1.5"/><rect x="5" y="13" width="6" height="6" rx="1.5"/><rect x="13" y="13" width="6" height="6" rx="1.5"/></svg>
  </span>
</template>

<script setup>
defineProps({
  name: { type: String, default: 'default' },
  tone: { type: String, default: 'blue' }
})
</script>
