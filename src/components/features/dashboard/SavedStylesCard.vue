<template>
  <div
    class="xl:col-span-2 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-[#0d171b] dark:text-white text-xl font-bold">Saved Styles</h3>
        <RouterLink class="text-primary text-sm font-bold hover:underline" to="/dashboard/saved">
          See All Favorites
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="style in savedStyles"
          :key="style.id"
          class="group cursor-pointer"
          @click="handleStyleClick(style)"
        >
          <div
            class="relative bg-[#f6f7f8] dark:bg-slate-800 rounded-xl aspect-[4/3] flex items-center justify-center p-6 overflow-hidden transition-all group-hover:shadow-md"
          >
            <img :alt="style.name" class="w-full h-full object-contain" :src="style.image" />
            <button
              class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-red-400"
              type="button"
              @click.stop="toggleFavorite(style)"
            >
              <span
                class="material-symbols-outlined fill-[1] text-lg"
                style="font-variation-settings: 'FILL' 1"
              >
                favorite
              </span>
            </button>
          </div>
          <div class="mt-3 flex justify-between items-start">
            <div>
              <p class="text-slate-900 dark:text-white font-bold text-sm">{{ style.name }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ style.material }}</p>
            </div>
            <p class="text-primary font-bold text-sm">${{ style.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  savedStyles: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['style-click', 'favorite-toggle'])

const handleStyleClick = (style) => {
  emit('style-click', style)
}

const toggleFavorite = (style) => {
  emit('favorite-toggle', { ...style, isFavorite: !style.isFavorite })
}
</script>
