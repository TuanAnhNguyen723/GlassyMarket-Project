<template>
  <div class="flex flex-wrap gap-2" :class="className">
    <template v-for="(item, index) in items" :key="index">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        :class="linkClass"
      >
        {{ item.label }}
      </RouterLink>
      <span v-else :class="currentClass">{{ item.label }}</span>
      <span v-if="index < items.length - 1" :class="separatorClass">{{ separator }}</span>
    </template>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every((item) => item.label && (item.to || !item.to)),
  },
  className: {
    type: String,
    default: 'mb-8',
  },
  linkClass: {
    type: String,
    default: 'text-slate-400 text-sm font-medium hover:text-primary transition-colors',
  },
  currentClass: {
    type: String,
    default: 'text-primary text-sm font-semibold',
  },
  separator: {
    type: String,
    default: '/',
  },
  separatorClass: {
    type: String,
    default: 'text-slate-300 text-sm',
  },
})
</script>
