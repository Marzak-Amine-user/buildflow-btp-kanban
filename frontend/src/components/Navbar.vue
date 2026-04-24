<template>
  <nav class="navbar">
    <RouterLink class="brand" to="/">
      <span class="brand-mark"><span class="brand-grid"></span></span>
      <span>
        <strong>BuildFlow</strong>
        <small>Suivi chantier & Kanban BTP</small>
      </span>
    </RouterLink>

    <button class="mobile-menu" @click="open = !open" aria-label="Ouvrir le menu">
      <span class="menu-lines"></span>
    </button>
    <div class="nav-links" :class="{ open }">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/projects">Chantiers</RouterLink>
      <RouterLink to="/planning">Planning</RouterLink>
      <RouterLink to="/reports">Reporting</RouterLink>
      <RouterLink to="/team">Équipe</RouterLink>
      <button class="theme-toggle" @click="toggleTheme">
        <span class="theme-symbol" :class="{ dark: isDark }"></span>
        {{ isDark ? 'Mode clair' : 'Mode sombre' }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const open = ref(false)
const isDark = ref(false)

function applyTheme(value) {
  isDark.value = value === 'dark'
  document.documentElement.dataset.theme = value
  localStorage.setItem('buildflow-theme', value)
}

function toggleTheme() {
  applyTheme(isDark.value ? 'light' : 'dark')
}

onMounted(() => {
  applyTheme(localStorage.getItem('buildflow-theme') || 'light')
})
</script>
