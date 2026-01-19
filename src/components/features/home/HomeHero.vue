<template>
  <section class="py-10 md:py-20">
    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-accent-blue dark:bg-zinc-900/50 rounded-3xl overflow-hidden"
    >
      <!-- Hero Image -->
      <div class="relative h-[400px] md:h-[600px] order-2 lg:order-1">
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url('${imageUrl}')` }"
          :aria-label="imageAlt"
        />
      </div>

      <!-- Hero Content -->
      <div class="p-8 md:p-16 order-1 lg:order-2">
        <span
          class="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-6"
          >{{ pill }}</span
        >
        <h1 class="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-8">
          <slot name="title">
            Redefining Your <br />
            <span class="text-primary">Vision</span>
          </slot>
        </h1>
        <p class="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-md leading-relaxed">
          {{ description }}
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            class="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
            type="button"
            @click="$emit('primary')"
          >
            {{ primaryText }}
            <span class="material-symbols-outlined text-sm">{{ primaryIcon }}</span>
          </button>
          <button
            class="px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all flex items-center gap-2"
            type="button"
            @click="$emit('secondary')"
          >
            {{ secondaryText }}
            <span class="material-symbols-outlined text-sm">{{ secondaryIcon }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  pill: { type: String, default: 'New Collection 2026' },
  description: {
    type: String,
    default:
      'Discover our curated collection of premium frames designed for the modern lifestyle. Precision crafted, fashion forward.',
  },
  imageUrl: { type: String, required: true },
  imageAlt: { type: String, default: 'Hero image' },
  primaryText: { type: String, default: 'Shop Now' },
  primaryIcon: { type: String, default: 'arrow_forward' },
  secondaryText: { type: String, default: 'Try Glasses' },
  secondaryIcon: { type: String, default: 'visibility' },
})

defineEmits(['primary', 'secondary'])
</script>

