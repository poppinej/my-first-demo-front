<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchHealth, type HealthStatus } from '../api/health'

const health = ref<HealthStatus | null>(null)
const errorMessage = ref('')
const loading = ref(false)

async function load(): Promise<void> {
  loading.value = true
  errorMessage.value = ''

  try {
    health.value = await fetchHealth()
  } catch (error) {
    health.value = null
    errorMessage.value = error instanceof Error ? error.message : '无法连接到后端服务'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="home">
    <el-alert
      v-if="errorMessage"
      type="error"
      :closable="false"
      :title="`后端不可达：${errorMessage}`"
      show-icon
    />

    <div v-else-if="health" class="home__status">
      <p>
        服务状态：<el-tag type="success">{{ health.status }}</el-tag>
      </p>
      <p>应用：{{ health.app }}</p>
      <p>版本：{{ health.version }}</p>
    </div>

    <p v-else>正在检查后端状态…</p>

    <el-button type="primary" :loading="loading" @click="load">重新检查</el-button>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
}

.home__status p {
  margin: 4px 0;
}
</style>
