<template>
  <section class="pb-14">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
      <div
        v-for="b in badges"
        :key="b.title"
        class="flex items-start gap-4 p-5 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl bg-white/90 dark:bg-zinc-900/75 hover:-translate-y-0.5 hover:shadow-md transition-all group"
      >
        <div
          class="size-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center group-hover:bg-primary transition-colors"
        >
          <span class="material-symbols-outlined text-[20px]">{{ b.icon }}</span>
        </div>
        <div>
          <h3 class="font-bold text-zinc-900 dark:text-zinc-100">{{ b.title }}</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{{ b.subtitle }}</p>
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

