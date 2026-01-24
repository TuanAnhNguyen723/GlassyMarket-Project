<template>
  <div
    class="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden"
  >
    <div class="p-6 h-full flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-[#0d171b] dark:text-white text-xl font-bold">My Prescription</h3>
        <span class="text-slate-400 dark:text-slate-500 material-symbols-outlined">visibility</span>
      </div>

      <div class="flex-1 grid grid-cols-2 gap-4">
        <!-- OD (Right) -->
        <div class="p-4 rounded-xl bg-[#f6f7f8] dark:bg-slate-800/50">
          <h4 class="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Right Eye (OD)</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 font-medium">SPH</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ prescription.rightEye.sph }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 font-medium">CYL</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ prescription.rightEye.cyl }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 font-medium">AXIS</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ prescription.rightEye.axis }}</span>
            </div>
          </div>
        </div>

        <!-- OS (Left) -->
        <div class="p-4 rounded-xl bg-[#f6f7f8] dark:bg-slate-800/50">
          <h4 class="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Left Eye (OS)</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 font-medium">SPH</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ prescription.leftEye.sph }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 font-medium">CYL</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ prescription.leftEye.cyl }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 font-medium">AXIS</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ prescription.leftEye.axis }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3">
        <p class="text-xs text-[#578e89] text-center italic">Updated: {{ prescription.updatedDate }}</p>
        <button
          class="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          type="button"
        >
          View Full RX
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  prescription: {
    type: Object,
    required: true,
  },
})
</script>
