<template>
  <section class="flex flex-col gap-6">
    <div class="flex items-center gap-3 px-2">
      <span class="material-symbols-outlined text-zinc-900 dark:text-zinc-100">contact_mail</span>
      <h2 class="text-lg font-bold text-zinc-900 dark:text-white">{{ $t('profileSettings.contactDetails') }}</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-1">
          {{ $t('profileSettings.emailAddress') }}
        </label>
        <input
          v-model="formData.email"
          class="w-full rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 px-4 py-2.5 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all bg-zinc-50 dark:bg-zinc-800/50"
          type="email"
          readonly
          :title="$t('profileSettings.emailReadOnlyHint', 'Email không thể thay đổi tại đây')"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-1">{{ $t('profileSettings.phoneNumber') }}</label>
        <input
          v-model="formData.phone"
          class="w-full rounded-xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 px-4 py-2.5 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
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
})

const emit = defineEmits(['update:formData'])

const formData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value),
})
</script>
