<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/navbar.vue';
</script>

<template>
  <div style="display: flex;">
  <Navbar />
  <main class="page-content">
    <RouterView />
  </main>
  </div>
</template>

<style>
.page-content {
  margin-left: 200px; /* Width of your sidebar */
  padding: 20px;
}
</style>

