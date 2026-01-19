<template>
  <section class="pb-24">
    <div
      class="bg-primary rounded-3xl p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center text-white"
    >
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      <h2 class="text-4xl md:text-5xl font-black mb-6 max-w-2xl relative z-10">
        {{ title }}
      </h2>
      <p class="text-white/80 mb-10 max-w-lg relative z-10 font-medium">
        {{ subtitle }}
      </p>
      <div class="flex flex-wrap justify-center gap-4 relative z-10">
        <button
          class="bg-white text-primary px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-zinc-50 transition-colors"
          type="button"
          @click="$emit('primary')"
        >
          {{ primaryText }}
        </button>
        <button
          class="bg-black text-white px-10 py-4 rounded-xl font-bold hover:bg-zinc-900 transition-colors"
          type="button"
          @click="$emit('secondary')"
        >
          {{ secondaryText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Eye Health is Wealth. Get your checkup today.' },
  subtitle: {
    type: String,
    default:
      'Schedule a free consultation with our licensed optometrists and find your perfect fit with our virtual AI tool.',
  },
  primaryText: { type: String, default: 'Book Free Consultation' },
  secondaryText: { type: String, default: 'Launch Virtual AI' },
})

defineEmits(['primary', 'secondary'])
</script>

