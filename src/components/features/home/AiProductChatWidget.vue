<template>
  <div class="fixed right-4 bottom-4 z-[70]">
    <button
      v-if="!isOpen"
      type="button"
      class="size-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
      @click="isOpen = true"
      aria-label="Mở chat tư vấn AI"
    >
      <span class="material-symbols-outlined">chat</span>
    </button>

    <div
      v-else
      class="w-[min(92vw,420px)] h-[560px] rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col overflow-hidden"
    >
      <div class="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
        <div>
          <p class="font-bold text-zinc-900 dark:text-zinc-100">AI tư vấn sản phẩm</p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Mô tả nhu cầu, AI sẽ gợi ý kính phù hợp</p>
        </div>
        <button
          type="button"
          class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          @click="isOpen = false"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div ref="scrollRef" class="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="rounded-xl p-3"
          :class="msg.role === 'user'
            ? 'bg-zinc-900 text-white ml-8'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 mr-8'"
        >
          <p class="text-sm whitespace-pre-wrap">{{ msg.text }}</p>

          <div
            v-if="msg.role === 'assistant' && msg.filters"
            class="mt-3 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
          >
            <p class="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5">
              AI hiểu nhu cầu của bạn
            </p>
            <div class="text-xs text-zinc-700 dark:text-zinc-200 space-y-1">
              <p v-if="msg.filters.frame_shape">Dáng gọng: {{ msg.filters.frame_shape }}</p>
              <p v-if="msg.filters.min_price != null || msg.filters.max_price != null">
                Ngân sách:
                {{ formatPrice(msg.filters.min_price) }} - {{ formatPrice(msg.filters.max_price) }}
              </p>
              <p v-if="msg.filters.style">Phong cách: {{ msg.filters.style }}</p>
            </div>
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90"
                @click="emit('apply-filters', msg.filters)"
              >
                Áp dụng bộ lọc
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-300 dark:border-zinc-600"
                @click="emit('view-more', msg.filters)"
              >
                Xem thêm
              </button>
            </div>
          </div>

          <div
            v-if="msg.role === 'assistant' && Array.isArray(msg.products) && msg.products.length"
            class="mt-3 space-y-2"
          >
            <div
              v-for="p in msg.products"
              :key="p.id"
              class="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex gap-2"
            >
              <img
                v-if="p.image"
                :src="p.image"
                :alt="p.name"
                class="size-12 rounded-md object-cover bg-zinc-100 dark:bg-zinc-800"
              />
              <div v-else class="size-12 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <span class="material-symbols-outlined text-zinc-400 text-sm">image</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold truncate">{{ p.name }}</p>
                <p class="text-xs text-primary font-bold">{{ formatPrice(p.price) }}</p>
                <p v-if="p.reason" class="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">{{ p.reason }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isSubmitting"
          class="rounded-xl p-3 mr-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm"
        >
          Đang tư vấn...
        </div>
      </div>

      <form class="p-3 border-t border-zinc-200 dark:border-zinc-700" @submit.prevent="handleSubmit">
        <textarea
          ref="textareaRef"
          v-model="input"
          class="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          rows="3"
          maxlength="1000"
          :disabled="isSubmitting"
          placeholder="Ví dụ: Tôi mặt tròn, ngân sách 2 triệu, đi làm hằng ngày"
        />
        <div class="mt-2 flex items-center justify-between">
          <p class="text-[11px] text-zinc-500">{{ input.length }}/1000</p>
          <button
            type="submit"
            class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold disabled:opacity-60"
            :disabled="isSubmitting || !canSubmit"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { resolveAssetUrl } from '@/services/api'
import { recommendProducts } from '@/services/aiRecommendationService'

const emit = defineEmits(['apply-filters', 'view-more'])

const isOpen = ref(false)
const isSubmitting = ref(false)
const input = ref('')
const scrollRef = ref(null)
const textareaRef = ref(null)
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: 'Xin chào! Bạn đang tìm kính cho nhu cầu nào? Hãy mô tả khuôn mặt, ngân sách và mục đích sử dụng.',
  },
])

const canSubmit = computed(() => input.value.trim().length > 0 && input.value.trim().length <= 1000)

function formatPrice(v) {
  if (v == null || v === '') return '—'
  const n = Number(v)
  if (!Number.isFinite(n)) return String(v)
  return `${n.toLocaleString('vi-VN')} đ`
}

function normalizeFilters(filters) {
  if (!filters || typeof filters !== 'object') return null
  const frameShape = Array.isArray(filters.frame_shape) ? filters.frame_shape[0] : filters.frame_shape
  return {
    frame_shape: frameShape ?? null,
    min_price: filters.min_price ?? null,
    max_price: filters.max_price ?? null,
    style: filters.style ?? filters.usage ?? null,
  }
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) return []
  return products.slice(0, 3).map((p) => ({
    id: p?.id ?? p?.product_id ?? null,
    name: p?.name ?? p?.title ?? 'Sản phẩm',
    price: p?.price ?? p?.base_price ?? null,
    image: resolveAssetUrl(
      p?.image ?? p?.image_url ?? p?.primary_image ?? p?.thumbnail ?? ''
    ),
    reason: p?.reason ?? p?.ai_reason ?? '',
  }))
}

function mapErrorMessage(status, fallback) {
  if (status === 422) return 'Nội dung chưa hợp lệ. Vui lòng nhập lại ngắn gọn hơn.'
  if (status === 429) return 'Bạn thao tác hơi nhanh, thử lại sau 1 phút.'
  if (status >= 500) return 'Hệ thống đang bận, vui lòng thử lại.'
  return fallback || 'Hệ thống đang bận, vui lòng thử lại.'
}

async function scrollToBottom() {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

function openChat() {
  isOpen.value = true
  nextTick(() => {
    textareaRef.value?.focus?.()
  })
}

defineExpose({ openChat })

async function handleSubmit() {
  const message = input.value.trim()
  if (!message || message.length > 1000 || isSubmitting.value) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: message,
  })
  input.value = ''
  isSubmitting.value = true
  await scrollToBottom()

  try {
    const res = await recommendProducts(message)
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: res?.reply || 'Mình đã tìm được vài mẫu phù hợp cho bạn.',
      filters: normalizeFilters(res?.filters),
      products: normalizeProducts(res?.products),
    })
  } catch (err) {
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: mapErrorMessage(err?.status, err?.message),
    })
  } finally {
    isSubmitting.value = false
    await scrollToBottom()
  }
}
</script>

