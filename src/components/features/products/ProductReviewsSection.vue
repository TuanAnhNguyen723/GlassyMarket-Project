<template>
  <section class="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-1">
          {{ $t('reviews.title') }}
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm">
          {{ $t('reviews.subtitle', { count: productSummary?.review_count ?? 0 }) }}
        </p>
      </div>
      <ProductRating
        :rating="productSummary?.rating_average ?? 0"
        :reviews="productSummary?.review_count ?? 0"
        size="md"
        :show-reviews-count="true"
        text-color="amber"
      />
    </div>

    <!-- Khu vực đánh giá (chỉ khi đã login) -->
    <div v-if="isAuthenticated" class="mb-8">
      <!-- can_review = false -->
      <div
        v-if="myReviewState !== null && !myReviewState.can_review"
        class="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm"
      >
        {{ $t('reviews.needPurchase') }}
      </div>

      <!-- can_review = true, review = null → Form đánh giá mới -->
      <div
        v-else-if="myReviewState?.can_review && !myReviewState.review && !isEditing"
        class="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700"
      >
        <h3 class="text-sm font-bold text-zinc-900 dark:text-white mb-3">
          {{ $t('reviews.writeReview') }}
        </h3>
        <form @submit.prevent="handleSubmitNew" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
              {{ $t('reviews.rating') }} *
            </label>
            <div class="flex gap-1">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                class="p-1 transition-transform hover:scale-110"
                @click="formRating = i"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-8 h-8 transition-colors"
                  :class="i <= formRating ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
              {{ $t('reviews.comment') }}
            </label>
            <textarea
              v-model="formComment"
              class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
              rows="4"
              :placeholder="$t('reviews.commentPlaceholder')"
              maxlength="2000"
            ></textarea>
            <p class="text-xs text-zinc-500 mt-1">{{ formComment.length }}/2000</p>
          </div>
          <button
            type="submit"
            class="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
            :disabled="isSubmitting || formRating < 1"
          >
            {{ isSubmitting ? $t('common.loading') : $t('reviews.submit') }}
          </button>
        </form>
      </div>

      <!-- can_review = true, review có data → Hiện review của user + nút Sửa/Xóa -->
      <div
        v-else-if="myReviewState?.can_review && myReviewState.review"
        class="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 mb-6"
      >
        <!-- Đang chỉnh sửa -->
        <form
          v-if="isEditing"
          @submit.prevent="handleSubmitEdit"
          class="space-y-4"
        >
          <h3 class="text-sm font-bold text-zinc-900 dark:text-white">
            {{ $t('reviews.editReview') }}
          </h3>
          <div>
            <label class="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
              {{ $t('reviews.rating') }} *
            </label>
            <div class="flex gap-1">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                class="p-1 transition-transform hover:scale-110"
                @click="formRating = i"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-8 h-8 transition-colors"
                  :class="i <= formRating ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
              {{ $t('reviews.comment') }}
            </label>
            <textarea
              v-model="formComment"
              class="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm resize-none"
              rows="4"
              maxlength="2000"
            ></textarea>
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? $t('common.loading') : $t('common.save') }}
            </button>
            <button
              type="button"
              class="px-6 py-2.5 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
              @click="cancelEdit"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
        </form>

        <!-- Xem review của user -->
        <div v-else class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <ProductRating
                :rating="myReviewState.review.rating"
                :reviews="0"
                size="sm"
                :show-reviews="false"
                text-color="amber"
              />
              <span class="text-xs text-zinc-500 dark:text-zinc-400">
                {{ formatDate(myReviewState.review.created_at) }}
              </span>
            </div>
            <p
              v-if="myReviewState.review.comment"
              class="text-sm text-zinc-700 dark:text-zinc-200"
            >
              {{ myReviewState.review.comment }}
            </p>
            <p v-else class="text-sm text-zinc-500 italic">
              {{ $t('reviews.noComment') }}
            </p>
            <div
              v-if="sortedReplies(myReviewState.review.replies).length > 0"
              class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-600/80"
            >
              <p class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                {{ $t('reviews.shopReplies') }}
              </p>
              <ul class="space-y-3">
                <li
                  v-for="reply in sortedReplies(myReviewState.review.replies)"
                  :key="reply.id"
                  class="rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/90 dark:border-zinc-700/60 px-4 py-3"
                >
                  <div class="flex items-start gap-3 justify-between">
                    <p class="text-sm text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap flex-1 min-w-0">
                      {{ reply.message }}
                    </p>
                    <time
                      class="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0 text-right tabular-nums pt-0.5"
                      :datetime="reply.created_at"
                    >
                      {{ formatDateTime(reply.created_at) }}
                    </time>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              @click="startEdit"
            >
              {{ $t('reviews.edit') }}
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              {{ isDeleting ? $t('common.loading') : $t('reviews.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách reviews -->
    <div v-if="reviewsLoading && reviews.length === 0" class="flex justify-center py-12">
      <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>

    <div v-else-if="reviews.length === 0" class="text-center py-12 text-zinc-500 dark:text-zinc-400">
      <span class="material-symbols-outlined text-5xl mb-3 opacity-50">rate_review</span>
      <p>{{ $t('reviews.noReviews') }}</p>
    </div>

    <ul v-else class="space-y-6">
      <li
        v-for="review in displayedReviews"
        :key="review.id"
        class="p-4 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0"
          >
            <img
              v-if="review.user?.avatar"
              :src="resolveAvatar(review.user.avatar)"
              :alt="review.user?.name"
              class="w-full h-full object-cover"
            />
            <span
              v-else
              class="material-symbols-outlined text-zinc-500 text-xl"
            >
              person
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="font-semibold text-zinc-900 dark:text-white">
                {{ review.user?.name ?? $t('reviews.anonymous') }}
              </span>
              <ProductRating
                :rating="review.rating"
                :reviews="0"
                size="sm"
                :show-reviews="false"
                text-color="amber"
              />
              <span class="text-xs text-zinc-500 dark:text-zinc-400">
                {{ formatDate(review.created_at) }}
              </span>
            </div>
            <p
              v-if="review.comment"
              class="text-sm text-zinc-700 dark:text-zinc-200"
            >
              {{ review.comment }}
            </p>
            <p v-else class="text-sm text-zinc-500 italic">
              {{ $t('reviews.noComment') }}
            </p>
            <div
              v-if="sortedReplies(review.replies).length > 0"
              class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-600/80"
            >
              <p class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                {{ $t('reviews.shopReplies') }}
              </p>
              <ul class="space-y-3">
                <li
                  v-for="reply in sortedReplies(review.replies)"
                  :key="reply.id"
                  class="rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/90 dark:border-zinc-700/60 px-4 py-3"
                >
                  <div class="flex items-start gap-3 justify-between">
                    <p class="text-sm text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap flex-1 min-w-0">
                      {{ reply.message }}
                    </p>
                    <time
                      class="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0 text-right tabular-nums pt-0.5"
                      :datetime="reply.created_at"
                    >
                      {{ formatDateTime(reply.created_at) }}
                    </time>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Pagination -->
    <div
      v-if="reviewsMeta?.last_page > 1"
      class="flex justify-center gap-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800"
    >
      <button
        type="button"
        class="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium disabled:opacity-50"
        :disabled="reviewsMeta.current_page <= 1 || reviewsLoading"
        @click="loadReviews(reviewsMeta.current_page - 1)"
      >
        {{ $t('common.previous') }}
      </button>
      <span class="flex items-center px-4 text-sm text-zinc-600 dark:text-zinc-400">
        {{ reviewsMeta.current_page }} / {{ reviewsMeta.last_page }}
      </span>
      <button
        type="button"
        class="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium disabled:opacity-50"
        :disabled="reviewsMeta.current_page >= reviewsMeta.last_page || reviewsLoading"
        @click="loadReviews(reviewsMeta.current_page + 1)"
      >
        {{ $t('common.next') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductRating from '@/components/common/ProductRating.vue'
import {
  getReviews,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
} from '@/services/reviewService'
import { useAuth } from '@/composables/useAuth'
import { resolveAssetUrl } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['review-updated', 'summary-updated'])

const { t } = useI18n()
const { isAuthenticated } = useAuth()
const { showNotification } = useNotification()

const reviews = ref([])
const productSummary = ref(null)
const reviewsMeta = ref({ current_page: 1, last_page: 1 })
const reviewsLoading = ref(false)
const myReviewState = ref(null)
const myReviewLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isEditing = ref(false)
const formRating = ref(5)
const formComment = ref('')

/** Loại bỏ review của user hiện tại khỏi list (đã hiển thị ở box "Đánh giá của tôi") */
const displayedReviews = computed(() => {
  const myId = myReviewState.value?.review?.id
  if (!myId) return reviews.value
  return reviews.value.filter((r) => String(r.id) !== String(myId))
})

function resolveAvatar(url) {
  return resolveAssetUrl(url)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Phản hồi shop: hiển thị giờ phút (theo thời gian) */
function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Sắp xếp replies theo thời gian tạo (cũ → mới) */
function sortedReplies(replies) {
  if (!Array.isArray(replies) || replies.length === 0) return []
  return [...replies].sort((a, b) => {
    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0
    return ta - tb
  })
}

async function loadReviews(page = 1) {
  if (!props.productId) return
  reviewsLoading.value = true
  try {
    const res = await getReviews(props.productId, { page, per_page: 15 })
    reviews.value = res.reviews ?? []
    reviewsMeta.value = res.meta ?? { current_page: 1, last_page: 1 }
    const summary = res.product_summary ?? null
    productSummary.value = summary
    if (summary) emit('summary-updated', summary)
  } catch (e) {
    console.error('Failed to load reviews:', e)
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}

async function loadMyReview() {
  if (!isAuthenticated.value || !props.productId) {
    myReviewState.value = null
    return
  }
  myReviewLoading.value = true
  try {
    const res = await getMyReview(props.productId)
    myReviewState.value = {
      can_review: res.can_review ?? false,
      review: res.review ?? null,
    }
  } catch {
    myReviewState.value = null
  } finally {
    myReviewLoading.value = false
  }
}

async function handleSubmitNew() {
  if (formRating.value < 1) return
  isSubmitting.value = true
  try {
    await createReview(props.productId, {
      rating: formRating.value,
      comment: formComment.value.trim().slice(0, 2000),
    })
    showNotification({
      message: t('reviews.submitSuccess'),
      type: 'success',
      duration: 3000,
    })
    formRating.value = 5
    formComment.value = ''
    await loadMyReview()
    await loadReviews(1)
    emit('review-updated')
    if (productSummary.value) emit('summary-updated', productSummary.value)
  } catch (err) {
    const msg = err?.message ?? t('reviews.submitError')
    if (err?.status === 403) {
      showNotification({
        message: t('reviews.needPurchase'),
        type: 'error',
        duration: 4000,
      })
    } else if (err?.status === 422) {
      showNotification({
        message: t('reviews.alreadyReviewed'),
        type: 'warning',
        duration: 4000,
      })
      await loadMyReview()
    } else {
      showNotification({ message: msg, type: 'error', duration: 4000 })
    }
  } finally {
    isSubmitting.value = false
  }
}

function startEdit() {
  if (!myReviewState.value?.review) return
  formRating.value = myReviewState.value.review.rating ?? 5
  formComment.value = myReviewState.value.review.comment ?? ''
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

async function handleSubmitEdit() {
  const review = myReviewState.value?.review
  if (!review?.id) return
  isSubmitting.value = true
  try {
    await updateReview(review.id, {
      rating: formRating.value,
      comment: formComment.value.trim().slice(0, 2000),
    })
    showNotification({
      message: t('reviews.editSuccess'),
      type: 'success',
      duration: 3000,
    })
    isEditing.value = false
    await loadMyReview()
    await loadReviews(reviewsMeta.value.current_page)
    emit('review-updated')
    if (productSummary.value) emit('summary-updated', productSummary.value)
  } catch (err) {
    showNotification({
      message: err?.message ?? t('reviews.editError'),
      type: 'error',
      duration: 4000,
    })
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  const review = myReviewState.value?.review
  if (!review?.id) return
  if (!confirm(t('reviews.confirmDelete'))) return
  isDeleting.value = true
  try {
    await deleteReview(review.id)
    showNotification({
      message: t('reviews.deleteSuccess'),
      type: 'success',
      duration: 3000,
    })
    myReviewState.value = { ...myReviewState.value, review: null }
    await loadReviews(reviewsMeta.value.current_page)
    emit('review-updated')
    if (productSummary.value) emit('summary-updated', productSummary.value)
  } catch (err) {
    showNotification({
      message: err?.message ?? t('reviews.deleteError'),
      type: 'error',
      duration: 4000,
    })
  } finally {
    isDeleting.value = false
  }
}

watch(() => props.productId, (id) => {
  if (id) {
    loadReviews(1)
    loadMyReview()
    isEditing.value = false
  } else {
    reviews.value = []
    myReviewState.value = null
  }
}, { immediate: true })
</script>
