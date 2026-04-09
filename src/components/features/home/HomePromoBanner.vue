<template>
  <section class="pb-10 md:pb-20">
    <div
      class="relative overflow-hidden rounded-[2rem] px-6 py-10 md:px-12 md:py-14 border border-zinc-800/40 bg-gradient-to-br from-zinc-900 via-slate-900 to-cyan-900 text-white"
    >
      <div class="absolute -top-20 -right-16 size-64 bg-primary/25 rounded-full blur-3xl" />
      <div class="absolute -bottom-20 -left-14 size-64 bg-blue-500/20 rounded-full blur-3xl" />

      <div class="relative z-10 max-w-3xl">
        <p class="text-xs uppercase tracking-[0.2em] text-cyan-100/80 mb-3">Free Vision Care</p>
        <h2 class="text-3xl md:text-5xl font-black leading-tight mb-5">{{ title }}</h2>
        <p class="text-white/80 mb-8 max-w-2xl text-base md:text-lg">{{ subtitle }}</p>
        <div class="flex flex-wrap gap-3">
          <button
            class="bg-white text-zinc-900 px-7 py-3 rounded-xl font-semibold shadow-xl hover:bg-zinc-100 transition-colors"
            type="button"
            @click="$emit('primary')"
          >
            {{ primaryText }}
          </button>
          <button
            class="bg-white/10 border border-white/25 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/15 transition-colors"
            type="button"
            @click="$emit('secondary')"
          >
            {{ secondaryText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Eye Health is Wealth. Get your checkup today.',
  },
  subtitle: {
    type: String,
    default:
      'Đặt lịch khám miễn phí với chuyên gia khúc xạ để nhận tư vấn đúng nhu cầu thị lực của bạn.',
  },
  primaryText: { type: String, default: 'Đặt lịch tư vấn miễn phí' },
  secondaryText: { type: String, default: 'Khám phá công cụ thử kính' },
})

defineEmits(['primary', 'secondary'])
</script>
