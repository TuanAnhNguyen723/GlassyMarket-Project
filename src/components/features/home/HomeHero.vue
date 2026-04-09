<template>
  <section class="pt-8 md:pt-12 pb-8 md:pb-12">
    <div
      class="relative overflow-hidden rounded-[2rem] border border-zinc-200/70 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/80 shadow-[0_28px_70px_-35px_rgba(15,23,42,0.5)]"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        <div class="order-2 lg:order-1 lg:col-span-7 p-8 sm:p-10 lg:p-14">
          <span
            class="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/12 text-emerald-700 dark:text-primary font-bold text-[11px] tracking-[0.2em] uppercase rounded-full mb-6"
          >
            <span class="size-1.5 rounded-full bg-primary" />
            {{ pill }}
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
            <slot name="title">
              Redefining Your <br />
              <span class="text-primary">Vision</span>
            </slot>
          </h1>
          <p class="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mb-9 max-w-xl leading-relaxed">
            {{ description }}
          </p>
          <div class="flex flex-wrap gap-3.5">
            <button
              class="px-7 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
              type="button"
              @click="$emit('primary')"
            >
              {{ primaryText }}
              <span class="material-symbols-outlined text-sm">{{ primaryIcon }}</span>
            </button>
            <button
              class="px-7 py-3.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
              type="button"
              @click="$emit('secondary')"
            >
              {{ secondaryText }}
              <span class="material-symbols-outlined text-sm">{{ secondaryIcon }}</span>
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-9">
            <div class="rounded-xl bg-zinc-100/80 dark:bg-zinc-800/70 px-4 py-3">
              <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">1,200+</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Mẫu gọng cao cấp</p>
            </div>
            <div class="rounded-xl bg-zinc-100/80 dark:bg-zinc-800/70 px-4 py-3">
              <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">4.9/5</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Đánh giá khách hàng</p>
            </div>
            <div class="rounded-xl bg-zinc-100/80 dark:bg-zinc-800/70 px-4 py-3 col-span-2 sm:col-span-1">
              <p class="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">24h</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Tư vấn nhanh chóng</p>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2 lg:col-span-5 relative min-h-[320px] md:min-h-[520px]">
          <div class="absolute inset-0 bg-gradient-to-br from-[#17212f] via-[#1d3c57] to-[#2f6075]" />
          <div
            class="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-95"
            :style="{ backgroundImage: `url('${imageUrl}')` }"
            :aria-label="imageAlt"
          />
          <div class="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 dark:bg-zinc-900/70 backdrop-blur-md border border-white/40 dark:border-zinc-700/60 p-4">
            <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Bộ sưu tập Signature 2026</p>
            <p class="text-xs text-zinc-600 dark:text-zinc-300 mt-1">Thiết kế tối giản, vật liệu nhẹ và lớp phủ chống UV thế hệ mới.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  pill: { type: String, default: "New Collection 2026" },
  description: {
    type: String,
    default:
      "Discover our curated collection of premium frames designed for the modern lifestyle. Precision crafted, fashion forward.",
  },
  imageUrl: { type: String, required: true },
  imageAlt: { type: String, default: "Hero image" },
  primaryText: { type: String, default: "Mua ngay" },
  primaryIcon: { type: String, default: "arrow_forward" },
  secondaryText: { type: String, default: "Thử kính ảo" },
  secondaryIcon: { type: String, default: "visibility" },
})

defineEmits(['primary', 'secondary'])
</script>
