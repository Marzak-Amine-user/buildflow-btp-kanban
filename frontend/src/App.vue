<template>
  <div class="app-shell">
    <Navbar />
    <main class="page-container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
