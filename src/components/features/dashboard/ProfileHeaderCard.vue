<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div class="relative">
        <div
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 border-4 border-slate-50 dark:border-slate-800"
          :style="{ backgroundImage: `url('${user.avatar}')` }"
          :aria-label="`${user.name} profile picture`"
        ></div>
        <button
          class="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 hover:bg-primary/90 transition-colors"
          type="button"
          @click="$emit('edit-photo')"
        >
          <span class="material-symbols-outlined text-sm">edit</span>
        </button>
      </div>
      <div class="flex-1 text-center sm:text-left">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ user.name }}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          {{ $t('profileSettings.premiumMemberSince', { date: user.memberSince }) }}
        </p>
      </div>
      <button
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  user: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit-photo', 'change-photo'])
</script>
