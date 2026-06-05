<script setup>
import Sidebar from './components/layout/SideBar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
}
</style>
