<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 dark:bg-black/30 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200/60 dark:border-zinc-800">
          <span class="loader" aria-hidden="true"></span>
          <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{{ $t('common.loading') }}</span>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { usePageLoading } from '@/composables/usePageLoading'

const { isPageLoading } = usePageLoading()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loader {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  border: 2px solid #59b7c0;
  border-right-color: transparent;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

