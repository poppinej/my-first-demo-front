<script setup lang="ts">
import { useAppStore } from './stores/app'

const appStore = useAppStore()
</script>

<template>
  <el-container class="app">
    <el-header class="app__header">
      <h1>{{ appStore.title }}</h1>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.app__header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
}

.app__header h1 {
  font-size: 18px;
  margin: 0;
}
</style>
