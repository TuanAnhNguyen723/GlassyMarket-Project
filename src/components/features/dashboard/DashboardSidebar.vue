<template>
  <aside class="flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 shrink-0">
    <div class="flex flex-col h-full justify-between">
      <div class="flex flex-col gap-8">
        <!-- Profile Section -->
        <div class="flex items-center gap-3">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/20"
            :style="{ backgroundImage: `url('${user.avatar}')` }"
            :aria-label="`Portrait of ${user.name}`"
          ></div>
          <div class="flex flex-col">
            <h1 class="text-[#0d171b] dark:text-white text-base font-bold leading-none">{{ user.name }}</h1>
            <p class="text-[#578e89] dark:text-primary/70 text-xs mt-1 font-medium leading-normal">
              {{ $t('sidebar.premiumMember') }}
            </p>
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
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const user = {
  name: 'Alex Johnson',
  tier: 'Premium Member',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDecLItH5k87ecj97AkGRSrN336EvrPz75l3iupJRjhHuGKMtrrJbs3gYcFog6TuiqxopJZ2YAXX9XeImEaSdooCurLZEpnX9MtguE0towJv7Bnj1XJ7wPZ7LjrnN8IeyQjfVWWW6VrXZv6UVpk40P3A_xh3ZTLwivWM5SfEo4odOqDB-03GUcM1yTI6J0O7DnZ4vcy9hW9xBnuDgwFtEcvklTpyRN0Oa24HsI0RGt84ALv1oobiDvkzg6D_W4_mhaYfkVRGO-O34Ud',
}

const navItems = [
  { path: '/dashboard', key: 'dashboard', icon: 'dashboard' },
  { path: '/dashboard/orders', key: 'myOrders', icon: 'package_2' },
  { path: '/dashboard/saved', key: 'savedStyles', icon: 'favorite' },
  { path: '/dashboard/prescriptions', key: 'prescriptions', icon: 'description' },
  { path: '/dashboard/settings', key: 'settings', icon: 'settings' },
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

const handleLogout = () => {
  // Handle logout logic
  console.log('Logout')
}
</script>
