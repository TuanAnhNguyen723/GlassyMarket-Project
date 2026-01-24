<template>
  <section class="flex flex-col gap-6 mt-5">
    <div class="flex items-center gap-3 px-2">
      <span class="material-symbols-outlined text-primary">badge</span>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ $t('profileSettings.personalInformation') }}</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">{{ $t('profileSettings.fullName') }}</label>
        <input
          v-model="formData.fullName"
          class="w-full rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 focus:ring-primary focus:border-primary transition-all"
          type="text"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">{{ $t('profileSettings.dateOfBirth') }}</label>
        <input
          v-model="formData.dateOfBirth"
          class="w-full rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 focus:ring-primary focus:border-primary transition-all"
          type="date"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">{{ $t('profileSettings.gender') }}</label>
        <select
          v-model="formData.gender"
          class="w-full rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="male">{{ $t('profileSettings.male') }}</option>
          <option value="female">{{ $t('profileSettings.female') }}</option>
          <option value="non-binary">{{ $t('profileSettings.nonBinary') }}</option>
          <option value="prefer-not-to-say">{{ $t('profileSettings.preferNotToSay') }}</option>
        </select>
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
})

const emit = defineEmits(['update:formData'])

const formData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value),
})
</script>
