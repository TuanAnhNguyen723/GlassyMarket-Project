<template>
  <section class="flex flex-col gap-6">
    <div class="flex items-center gap-3 px-2">
      <span class="material-symbols-outlined text-primary">contact_mail</span>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ $t('profileSettings.contactDetails') }}</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1 flex justify-between">
          {{ $t('profileSettings.emailAddress') }}
          <span
            v-if="isEmailVerified"
            class="text-[10px] uppercase tracking-wider text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900/50"
          >
            {{ $t('profileSettings.verified') }}
          </span>
        </label>
        <input
          v-model="formData.email"
          class="w-full rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 focus:ring-primary focus:border-primary transition-all"
          type="email"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">{{ $t('profileSettings.phoneNumber') }}</label>
        <input
          v-model="formData.phone"
          class="w-full rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 focus:ring-primary focus:border-primary transition-all"
          type="tel"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:formData'])

const formData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value),
})
</script>
