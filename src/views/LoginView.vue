<template>
  <main class="min-h-[70vh] flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <div
        class="border border-[#eaf0f0] dark:border-gray-800 rounded-2xl bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden"
      >
        <div class="p-8">
          <div class="flex justify-center mb-6">
            <div class="size-14 bg-primary rounded-xl flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-3xl">visibility</span>
            </div>
          </div>
          <h1 class="text-xl font-black text-center text-[#111718] dark:text-white mb-1">
            {{ $t('auth.loginTitle') }}
          </h1>
          <p class="text-sm text-[#5e8487] dark:text-gray-400 text-center mb-8">
            {{ $t('auth.loginSubtitle') }}
          </p>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <label class="block">
              <span class="text-sm font-bold text-[#111718] dark:text-white mb-1.5 block">
                {{ $t('auth.email') }}
              </span>
              <input
                v-model="form.email"
                class="w-full rounded-lg border border-[#eaf0f0] dark:border-gray-700 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary focus:border-primary h-11 px-4 text-sm"
                type="email"
                required
                autocomplete="email"
              />
            </label>
            <label class="block">
              <span class="text-sm font-bold text-[#111718] dark:text-white mb-1.5 block">
                {{ $t('auth.password') }}
              </span>
              <input
                v-model="form.password"
                class="w-full rounded-lg border border-[#eaf0f0] dark:border-gray-700 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary focus:border-primary h-11 px-4 text-sm"
                type="password"
                required
                autocomplete="current-password"
              />
            </label>
            <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">
              {{ errorMessage }}
            </p>
            <button
              type="submit"
              class="w-full h-11 rounded-lg bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              {{ loading ? $t('common.loading') : $t('auth.login') }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-[#5e8487] dark:text-gray-400">
            {{ $t('auth.noAccount') }}
            <RouterLink to="/register" class="font-semibold text-primary hover:underline">
              {{ $t('auth.register') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import { useNotification } from '@/composables/useNotification'
import * as authService from '@/services/authService'

const router = useRouter()
const route = useRoute()
const { setUser } = useAuth()
const { t } = useI18n()
const { showNotification } = useNotification()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const res = await authService.login({ email: form.email, password: form.password })
    setUser(res.user, res.token)
    showNotification({ message: t('auth.loginSuccess'), type: 'success' })
    router.push(route.query.redirect || '/')
  } catch (err) {
    errorMessage.value = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>
