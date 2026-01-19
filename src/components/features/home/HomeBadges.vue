<template>
  <section class="pb-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="b in badges"
        :key="b.title"
        class="flex items-center gap-4 p-6 border border-[#e9f1f1] dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
      >
        <div
          class="size-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
        >
          <span class="material-symbols-outlined text-primary">{{ b.icon }}</span>
        </div>
        <div>
          <h3 class="font-bold">{{ b.title }}</h3>
          <p class="text-sm text-zinc-500">{{ b.subtitle }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  badges: {
    type: Array,
    required: true,
  },
})
</script>

