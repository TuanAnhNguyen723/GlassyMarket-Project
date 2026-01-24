<template>
  <section class="flex flex-col gap-6">
    <div class="flex items-center gap-3 px-2">
      <span class="material-symbols-outlined text-primary">favorite_border</span>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ $t('profileSettings.shoppingPreferences') }}</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">{{ $t('profileSettings.preferredFrameStyle') }}</label>
        <select
          v-model="formData.preferredFrameStyle"
          class="w-full rounded-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="aviator">{{ $t('products.aviator') }}</option>
          <option value="round">{{ $t('products.round') }}</option>
          <option value="wayfarer">{{ $t('products.wayfarer') }}</option>
          <option value="cat-eye">{{ $t('products.catEye') }}</option>
          <option value="square">{{ $t('products.square') }}</option>
        </select>
      </div>
    </div>
    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
      <!-- Marketing Newsletter Toggle -->
      <div class="flex items-center justify-between p-4">
        <div>
          <p class="text-sm font-bold text-slate-900 dark:text-white">{{ $t('profileSettings.marketingNewsletter') }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('profileSettings.marketingNewsletterDesc') }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            v-model="formData.marketingNewsletter"
            class="sr-only peer"
            type="checkbox"
          />
          <div
            class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
      </div>
      <!-- Prescription Reminders Toggle -->
      <div class="flex items-center justify-between p-4">
        <div>
          <p class="text-sm font-bold text-slate-900 dark:text-white">{{ $t('profileSettings.prescriptionReminders') }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('profileSettings.prescriptionRemindersDesc') }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            v-model="formData.prescriptionReminders"
            class="sr-only peer"
            type="checkbox"
          />
          <div
            class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
          ></div>
        </label>
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
