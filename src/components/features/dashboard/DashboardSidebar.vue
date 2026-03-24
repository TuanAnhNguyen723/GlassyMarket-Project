<template>
  <aside class="flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 shrink-0">
    <div class="flex flex-col h-full justify-between">
      <div class="flex flex-col gap-8">
        <!-- Profile Section -->
        <div class="flex items-center gap-3">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/20 flex items-center justify-center bg-primary/20 text-primary text-lg font-bold"
            :style="userAvatarStyle"
            :aria-label="`Portrait of ${authUser?.name}`"
          >
            <span v-if="!authUser?.avatar">{{ authUserInitial }}</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-[#0d171b] dark:text-white text-base font-bold leading-none">{{ authUser?.name || '—' }}</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
            :class="
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            "
          >
            <span
              class="material-symbols-outlined"
              :style="getIconStyle(item.path)"
            >
              {{ item.icon }}
            </span>
            <p :class="isActive(item.path) ? 'text-sm font-bold' : 'text-sm font-medium'">
              {{ $t(`sidebar.${item.key}`) }}
            </p>
          </RouterLink>
        </nav>
      </div>

      <div class="flex flex-col gap-1 mt-auto">
        <button
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          type="button"
          @click="handleLogout"
        >
          <span class="material-symbols-outlined">logout</span>
          <p class="text-sm font-bold">{{ $t('sidebar.logout') }}</p>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { resolveAssetUrl } from '@/services/api'

const route = useRoute()
const router = useRouter()
const { user: authUser, logout } = useAuth()

const userAvatarStyle = computed(() => {
  const url = authUser.value?.avatar
  if (!url) return {}
  const resolved = resolveAssetUrl(url)
  if (!resolved) return {}
  return { backgroundImage: `url(${JSON.stringify(resolved)})` }
})

const authUserInitial = computed(() => {
  const name = authUser.value?.name
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
})

const navItems = [
  { path: '/dashboard', key: 'dashboard', icon: 'dashboard' },
  { path: '/dashboard/orders', key: 'myOrders', icon: 'package_2' },
  { path: '/dashboard/settings', key: 'profileSettings', icon: 'person' },
  { path: '/dashboard/security', key: 'security', icon: 'lock' },
]

const isActive = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

const getIconStyle = (path) => {
  if (isActive(path)) {
    return { fontVariationSettings: "'FILL' 1" }
  }
  return {}
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>
