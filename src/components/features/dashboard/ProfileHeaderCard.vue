<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div class="relative">
        <div
          class="aspect-square rounded-full size-24 border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold overflow-hidden"
          :aria-label="`${user?.name || 'User'} profile picture`"
        >
          <img
            v-if="avatarSrc && !avatarLoadError"
            :key="avatarSrc"
            :src="avatarSrc"
            :alt="`${user?.name || 'User'}`"
            class="w-full h-full object-cover"
            @error="onAvatarError"
          />
          <span v-if="!avatarSrc || avatarLoadError" class="relative z-10">{{ userInitial }}</span>
        </div>
        <button
          v-if="editable"
          class="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 hover:bg-primary/90 transition-colors"
          type="button"
          @click="$emit('edit-photo')"
        >
          <span class="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>
      <div class="flex-1 text-center sm:text-left">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ user?.name || '—' }}</h3>
        <p v-if="user?.email" class="text-slate-400 dark:text-slate-500 text-xs mt-1">{{ user.email }}</p>
      </div>
      <button
        v-if="editable"
        class="bg-primary/10 text-primary hover:bg-primary/20 px-6 py-2 rounded-full font-bold text-sm transition-all"
        type="button"
        @click="$emit('change-photo')"
      >
        {{ $t('profileSettings.changePhoto') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { resolveAssetUrl } from '@/services/api'

useI18n()

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit-photo', 'change-photo'])

const avatarLoadError = ref(false)
const avatarSrc = computed(() => {
  const url = props.user?.avatar
  if (!url || typeof url !== 'string') return ''
  return resolveAssetUrl(url)
})

watch(
  () => props.user?.avatar,
  () => { avatarLoadError.value = false },
)

function onAvatarError() {
  avatarLoadError.value = true
}

const userInitial = computed(() => {
  const name = props.user?.name
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
})

</script>
