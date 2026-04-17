<script setup>
import { onMounted } from 'vue'
import { RouterView } from "vue-router";
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import PageLoader from "./components/common/PageLoader.vue";
import Notification from "./components/common/Notification.vue";
import { useAuth } from '@/composables/useAuth'
import { useGeneralSettings } from '@/composables/useGeneralSettings'

const { checkAuth } = useAuth()
const { fetchGeneralSettings } = useGeneralSettings()
onMounted(() => {
  checkAuth()
  fetchGeneralSettings({ force: true }).catch((error) => {
    console.warn('Failed to fetch general settings:', error)
  })
})
</script>

<template>
  <div class="app-layout">
    <PageLoader />
    <Notification />
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  /* View tự quản lý layout/padding */
}
</style>
